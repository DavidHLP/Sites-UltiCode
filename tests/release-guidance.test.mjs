import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { origin } from '../content/site-config.mjs';
import { projectPages } from '../content/project.mjs';
import { guides } from '../content/guides.mjs';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('generated discovery resources use the confirmed official origin', async () => {
  assert.equal(origin, 'https://ulticode.davidhlp.dpdns.org');
  for (const path of ['public/robots.txt', 'public/sitemap.xml', 'public/llms.txt', 'public/resources/institutional-review-checklist.md']) {
    const text = await read(path);
    assert.ok(text.includes(origin), path);
    assert.ok(!text.includes('ulticode.bloomywren4096.chatgpt.site'), path);
  }
});

test('evaluation guidance disables the experimental Agent without rewriting historical behavior', async () => {
  const product = projectPages.find(page => page.path === '/product/').body;
  assert.match(product, /Keep the experimental Agent disabled for evaluation/);
  assert.match(product, /pinned historical snapshot can enable it when unset/);
  assert.match(product, /source consent and persistence permissions/);
  const gettingStarted = guides.map(page => page.body).join('\n');
  assert.match(gettingStarted, /experimental feature disabled/);
  for (const path of ['content/review-pack.md', 'content/review-pack.zh-CN.md']) {
    const pack = await read(path);
    assert.match(pack, /experimental Agent explicitly disabled|明确关闭实验性 Agent/);
  }
  // Imported historical documentation is still presented with its provenance.
  assert.match(await read('content/upstream/docs/PRODUCT.md'), /VITE_AGENT_REVIEW_ENABLED/);
  assert.match(await read('scripts/content/build-content.mjs'), /source below is preserved as published/);
});
