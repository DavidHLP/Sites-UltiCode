import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import test from 'node:test';
import { analytics, contact } from '../lib/site-api.mjs';

const ORIGIN = 'https://ulticode.example';
const USER = { userId: 'platform-user-a', email: 'session@example.test', displayName: 'Example person' };
const OTHER = { userId: 'platform-user-b', email: 'other@example.test', displayName: 'Other person' };
const FORM = { name: 'A person', email: 'contact@example.test', organization: 'Example institution',
  message: 'Please help us evaluate a deployment.', topic: 'pilot', consent: true, website: '' };

function database(t) {
  const sqlite = new DatabaseSync(':memory:');
  const migrations = new URL('../drizzle/', import.meta.url);
  const files = readdirSync(migrations).filter(name => name.endsWith('.sql')).sort();
  assert.ok(files.length, 'Generate the database migration before running API checks.');
  for (const file of files) sqlite.exec(readFileSync(new URL(file, migrations), 'utf8'));
  t.after(() => sqlite.close());
  const calls = [];
  return {
    sqlite, calls,
    prepare(sql) {
      return { bind(...values) {
        calls.push({ sql, values });
        const statement = sqlite.prepare(sql);
        return {
          first: async () => statement.get(...values) || null,
          all: async () => ({ success: true, results: statement.all(...values) }),
          run: async () => ({ success: true, meta: { changes: Number(statement.run(...values).changes) } }),
        };
      } };
    },
  };
}

function request(method = 'POST', body = FORM, headers = {}, path = '/api/contact') {
  return new Request(`${ORIGIN}${path}`, {
    method,
    headers: { origin: ORIGIN, 'content-type': 'application/json', ...headers },
    ...(method === 'GET' || method === 'DELETE' ? {} : { body: JSON.stringify(body) }),
  });
}

test('contact requires a trusted session, not identity in the submitted form', async t => {
  const db = database(t);
  for (const user of [null, { userId: USER.userId }, { email: USER.email }]) {
    const result = await contact(request('POST', { ...FORM, userId: USER.userId }), db, user);
    assert.equal(result.status, 401);
    assert.equal(result.headers.get('cache-control'), 'no-store');
  }
  assert.equal(db.calls.length, 0);
});

test('mutations reject other origins and cross-site fetches, including DELETE', async t => {
  const db = database(t);
  for (const method of ['POST', 'DELETE']) {
    for (const headers of [{ origin: 'https://other.example' }, { origin: '' }, { 'sec-fetch-site': 'cross-site' }]) {
      assert.equal((await contact(request(method, FORM, headers), db, USER)).status, 403);
    }
  }
  assert.equal((await analytics(request('POST', { event: 'github', consent: true }, { origin: 'https://other.example' }), db)).status, 403);
  assert.equal(db.calls.length, 0);
});

test('JSON parsing enforces actual streaming byte limits and valid objects', async t => {
  const db = database(t);
  assert.equal((await contact(request('POST', FORM, { 'content-type': 'text/plain' }), db, USER)).status, 415);
  for (const body of ['{', '[]', 'null']) {
    const req = new Request(`${ORIGIN}/api/contact`, { method: 'POST', headers: { origin: ORIGIN, 'content-type': 'application/json' }, body });
    assert.equal((await contact(req, db, USER)).status, 400);
  }
  for (const [handler, maximum] of [[req => contact(req, db, USER), 32768], [req => analytics(req, db), 1024]]) {
    const bytes = new TextEncoder().encode(JSON.stringify({ message: 'x'.repeat(maximum) }));
    const body = new ReadableStream({ start(controller) {
      controller.enqueue(bytes.subarray(0, 32));
      controller.enqueue(bytes.subarray(32));
      controller.close();
    } });
    const req = new Request(`${ORIGIN}/api/contact`, { method: 'POST', duplex: 'half',
      headers: { origin: ORIGIN, 'content-type': 'application/json', 'content-length': '1' }, body });
    assert.equal((await handler(req)).status, 413);
  }
  assert.equal(db.calls.length, 0);
});

test('contact validates consent, honeypot and important field boundaries before storage', async t => {
  const db = database(t);
  for (const invalid of [{ consent: false }, { website: 'bot' }, { email: 'bad' }, { topic: 'billing' }, { name: '' },
    { organization: 'x'.repeat(161) }, { message: 'x'.repeat(19) }, { message: 'x'.repeat(4001) },
    { message: '😀'.repeat(10) }, { name: 'Person\0injected' }]) {
    assert.equal((await contact(request('POST', { ...FORM, ...invalid }), db, USER)).status, 400);
  }
  assert.equal(db.calls.length, 0);
  assert.equal((await contact(request('POST', { ...FORM, message: '😀'.repeat(20) }), db, USER)).status, 201);
  assert.equal((await contact(request('POST', { ...FORM, message: '中'.repeat(4000) }), db, USER)).status, 201);
});

test('enquiries are saved for the session owner; receipts and deletion enforce ownership', async t => {
  const db = database(t);
  const saved = await contact(request('POST', { ...FORM, userId: OTHER.userId }), db, USER);
  assert.equal(saved.status, 201);
  const { id } = await saved.json();
  assert.match(id, /^[\da-f-]{36}$/);
  await contact(request('POST'), db, OTHER);
  const own = await contact(request('GET'), db, USER);
  assert.equal(own.status, 200);
  const receipt = await own.json();
  assert.deepEqual(receipt.identity, { name: USER.displayName, email: USER.email });
  assert.equal(receipt.enquiries.length, 1);
  assert.deepEqual(Object.keys(receipt.enquiries[0]).sort(), ['id', 'topic', 'name', 'email', 'organization', 'message', 'createdAt'].sort());
  assert.equal(receipt.enquiries[0].email, FORM.email);
  assert.equal((await contact(request('DELETE', undefined, {}, `/api/contact?id=${id}`), db, OTHER)).status, 404);
  assert.equal((await contact(request('DELETE', undefined, {}, '/api/contact?id=invalid'), db, USER)).status, 400);
  assert.equal((await contact(request('DELETE', undefined, {}, `/api/contact?id=${id}`), db, USER)).status, 200);
  assert.equal((await (await contact(request('GET'), db, USER)).json()).enquiries.length, 0);
  assert.equal(db.sqlite.prepare('SELECT count FROM contact_rate WHERE user_id = ?').get(USER.userId).count, 1);
});

test('atomic hourly limits survive concurrency and enquiry deletion, then reset next window', async t => {
  const db = database(t);
  const statuses = await Promise.all(Array.from({ length: 5 }, async () => (await contact(request(), db, USER)).status));
  assert.deepEqual(statuses.sort(), [201, 201, 201, 429, 429]);
  db.sqlite.prepare('DELETE FROM enquiries WHERE user_id = ?').run(USER.userId);
  const limited = await contact(request(), db, USER);
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.headers.get('retry-after')) > 0);
  db.sqlite.prepare('UPDATE contact_rate SET window_start = window_start - 1 WHERE user_id = ?').run(USER.userId);
  assert.equal((await contact(request(), db, USER)).status, 201);
  assert.equal(db.sqlite.prepare('SELECT count FROM contact_rate WHERE user_id = ?').get(USER.userId).count, 1);
});

test('analytics requires explicit permission and stores only a daily allowlisted count', async t => {
  const db = database(t);
  for (const body of [{ event: 'github' }, { event: 'github', consent: false }, { event: 'arbitrary', consent: true }]) {
    assert.equal((await analytics(request('POST', body), db)).status, 400);
  }
  assert.equal(db.calls.length, 0);
  for (let i = 0; i < 2; i++) {
    const result = await analytics(request('POST', { event: 'github', consent: true, day: '1900-01-01', count: 999,
      userId: USER.userId, email: USER.email, message: 'private', ip: '192.0.2.1', referrer: 'private' },
    { 'user-agent': 'private browser', referer: 'https://private.example' }), db);
    assert.equal(result.status, 200);
  }
  assert.equal((await analytics(request('GET'), db)).status, 405);
  assert.deepEqual(db.sqlite.prepare('PRAGMA table_info(cta_daily)').all().map(row => row.name), ['day', 'event', 'count']);
  const rows = db.sqlite.prepare('SELECT * FROM cta_daily').all();
  assert.equal(rows.length, 1);
  assert.equal(rows[0].count, 2);
  assert.equal(rows[0].day, new Date().toISOString().slice(0, 10));
  for (const call of db.calls) assert.deepEqual(call.values, [rows[0].day, 'github']);
});

test('database failures return generic no-store errors without leaking details', async () => {
  const db = { prepare() { throw new Error('private database credential or user data'); } };
  for (const result of [await contact(request('GET'), db, USER), await analytics(request('POST', { event: 'github', consent: true }), db)]) {
    assert.equal(result.status, 503);
    assert.equal(result.headers.get('cache-control'), 'no-store');
    assert.doesNotMatch(await result.text(), /private|credential|user data/);
  }
});
