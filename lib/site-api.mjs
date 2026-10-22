const TOPICS = new Set(['pilot', 'deployment', 'support', 'contribution']);
const EVENTS = new Set(['hero_get_started', 'hero_showcase', 'pilot_open', 'review_download', 'github', 'contact_saved']);
const HEADERS = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };

class RequestError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function response(body, status = 200, headers = {}) {
  return Response.json(body, { status, headers: { ...HEADERS, ...headers } });
}

function sameOrigin(request) {
  const site = request.headers.get('sec-fetch-site');
  if (request.headers.get('origin') !== new URL(request.url).origin ||
      (site && site !== 'same-origin' && site !== 'none')) {
    throw new RequestError(403, 'Send this request from the website.');
  }
}

async function readJson(request, maximum) {
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    throw new RequestError(415, 'Use application/json.');
  }
  if (Number(request.headers.get('content-length')) > maximum) {
    throw new RequestError(413, 'The request is too large.');
  }
  if (!request.body) throw new RequestError(400, 'A JSON object is required.');
  const reader = request.body.getReader();
  const chunks = [];
  let length = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > maximum) {
        await reader.cancel();
        throw new RequestError(413, 'The request is too large.');
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  try {
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    const body = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error();
    return body;
  } catch {
    throw new RequestError(400, 'A valid JSON object is required.');
  }
}

function contactFields(body) {
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const organization = typeof body.organization === 'string' ? body.organization.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const length = value => [...value].length;
  if ([name, email, organization, message].some(value => value.includes('\0')) ||
      !name || length(name) > 100 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      (body.organization !== undefined && typeof body.organization !== 'string') || length(organization) > 160 ||
      length(message) < 20 || length(message) > 4000 || !TOPICS.has(body.topic) || body.consent !== true || body.website !== '') {
    throw new RequestError(400, 'Check the form fields and give permission to store your enquiry.');
  }
  return { name, email, organization, message, topic: body.topic };
}

function failure(error) {
  return error instanceof RequestError
    ? response({ error: error.message }, error.status)
    : response({ error: 'This service is temporarily unavailable. Please try again later.' }, 503);
}

// The route supplies this user from the platform's trusted authentication headers.
export async function contact(request, db, user) {
  try {
    if (!['GET', 'POST', 'DELETE'].includes(request.method)) return response({ error: 'Method not allowed.' }, 405, { Allow: 'GET, POST, DELETE' });
    if (!user?.userId || !user?.email) throw new RequestError(401, 'Sign in with ChatGPT to manage your enquiries.');
    if (request.method !== 'GET') sameOrigin(request);
    if (!db?.prepare) throw new Error('Database unavailable');
    if (request.method === 'GET') {
      const result = await db.prepare(
        'SELECT id, topic, name, email, organization, message, created_at AS createdAt FROM enquiries WHERE user_id = ? ORDER BY created_at DESC',
      ).bind(user.userId).all();
      if (!result.success) throw new Error('Database unavailable');
      return response({ enquiries: result.results, identity: { name: user.displayName || user.email, email: user.email } });
    }
    if (request.method === 'DELETE') {
      const id = new URL(request.url).searchParams.get('id') || '';
      if (!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(id)) throw new RequestError(400, 'Use a valid enquiry ID.');
      const result = await db.prepare('DELETE FROM enquiries WHERE id = ? AND user_id = ?').bind(id, user.userId).run();
      if (!result.success) throw new Error('Database unavailable');
      if (!result.meta.changes) throw new RequestError(404, 'Enquiry not found.');
      return response({ deleted: true });
    }
    const fields = contactFields(await readJson(request, 32768));
    const now = new Date();
    const window = Math.floor(now.getTime() / 3_600_000);
    const rate = await db.prepare(`INSERT INTO contact_rate (user_id, window_start, count) VALUES (?, ?, 1)
      ON CONFLICT(user_id) DO UPDATE SET window_start = excluded.window_start,
      count = CASE WHEN contact_rate.window_start = excluded.window_start THEN contact_rate.count + 1 ELSE 1 END
      WHERE contact_rate.window_start != excluded.window_start OR contact_rate.count < 3
      RETURNING count`).bind(user.userId, window).first();
    if (!rate) return response({ error: 'You can send three enquiries per hour. Please try again next hour.' }, 429,
      { 'Retry-After': String(3600 - Math.floor(now.getTime() / 1000) % 3600) });
    const id = crypto.randomUUID();
    const createdAt = now.toISOString();
    const result = await db.prepare(`INSERT INTO enquiries
      (id, user_id, topic, name, email, organization, message, created_at, consent_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(
      id, user.userId, fields.topic, fields.name, fields.email, fields.organization, fields.message, createdAt, createdAt,
    ).run();
    if (!result.success) throw new Error('Database unavailable');
    return response({ id, message: 'Your enquiry was saved. You can view or delete it here while signed in.' }, 201);
  } catch (error) {
    return failure(error);
  }
}

export async function analytics(request, db) {
  try {
    if (request.method !== 'POST') return response({ error: 'Method not allowed.' }, 405, { Allow: 'POST' });
    sameOrigin(request);
    const body = await readJson(request, 1024);
    if (body.consent !== true || !EVENTS.has(body.event)) throw new RequestError(400, 'Choose an allowed event and give analytics permission.');
    if (!db?.prepare) throw new Error('Database unavailable');
    const result = await db.prepare(`INSERT INTO cta_daily (day, event, count) VALUES (?, ?, 1)
      ON CONFLICT(day, event) DO UPDATE SET count = cta_daily.count + 1`)
      .bind(new Date().toISOString().slice(0, 10), body.event).run();
    if (!result.success) throw new Error('Database unavailable');
    return response({ recorded: true });
  } catch (error) {
    return failure(error);
  }
}
