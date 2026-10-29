import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { origin } from '../content/site-config.mjs';
import { projectPages } from '../content/project.mjs';
import { guides } from '../content/guides.mjs';
import upstream from '../content/upstream.json' with { type: 'json' };

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('generated discovery resources use the confirmed official origin', async () => {
  // CI runs tests before the production build; generate the resources under test.
  execFileSync(process.execPath, ['scripts/content/build-content.mjs'], {
    cwd: new URL('..', import.meta.url), stdio: 'pipe',
  });
  assert.equal(origin, 'https://ulticode.davidhlp.dpdns.org');
  for (const path of ['public/robots.txt', 'public/sitemap.xml', 'public/llms.txt', 'public/resources/institutional-review-checklist.md']) {
    const text = await read(path);
    assert.ok(text.includes(origin), path);
    assert.ok(!text.includes('ulticode.bloomywren4096.chatgpt.site'), path);
  }
});

test('current guidance describes administrator opt-in without rewriting dated observations', async () => {
  const product = projectPages.find(page => page.path === '/product/').body;
  assert.match(product, /experimental feature, disabled when its setting is absent/);
  assert.match(product, /source consent and persistence permissions/);
  const gettingStarted = guides.map(page => page.body).join('\n');
  assert.match(gettingStarted, /Agent review is experimental and disabled by default/);
  for (const path of ['content/review-pack.md', 'content/review-pack.zh-CN.md']) {
    const pack = await read(path);
    assert.match(pack, /experimental Agent is off by default|实验性 Agent 默认关闭/);
  }
  assert.match(await read('content/upstream/docs/PRODUCT.md'), /缺少设置时默认关闭/);
  assert.match(await read('content/evaluation.mjs'), /enabled=true/);
  assert.match(await read('scripts/content/build-content.mjs'), /source below is preserved as published/);
});

test('public workflows, reference images and downloads are available in both languages', async () => {
  const pages = JSON.parse(await read('generated/site-pages.json'));
  for (const prefix of ['', '/zh-CN']) {
    for (const guide of ['practice-and-community', 'contests', 'administration']) {
      assert.ok(pages[`${prefix}/docs/${guide}/`], `${prefix}/${guide}`);
      assert.ok(pages[`${prefix}/docs/`].includes(`${prefix}/docs/${guide}/`));
    }
    assert.equal((pages[`${prefix}/showcase/`].match(/<img /g) || []).length, upstream.screenshots.length);
    assert.ok(pages[`${prefix}/updates/`].includes(upstream.releases[0].url));
  }
  for (const screenshot of upstream.screenshots) {
    const bytes = await readFile(new URL(`../public/assets/screenshots/${screenshot.filename}`, import.meta.url));
    assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.equal(bytes.readUInt32BE(16), screenshot.width);
    assert.equal(bytes.readUInt32BE(20), screenshot.height);
  }
  for (const suffix of ['', '.zh-CN']) {
    const pack = await read(`public/resources/institutional-review-pack${suffix}.md`);
    assert.ok(pack.includes(upstream.sourceCommit));
    assert.doesNotMatch(pack, /\{\{SOURCE_/);
  }
});
