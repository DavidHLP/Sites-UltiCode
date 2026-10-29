import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';
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

test('HTML responses provide fresh CSP nonces for Cloudflare script injection', async () => {
  const source = (await read('app/[[...slug]]/route.ts')).replace(
    "'../../generated/site-pages.json'",
    `'${new URL('../generated/site-pages.json', import.meta.url).href}' with { type: 'json' }`,
  );
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
  const { GET } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
  const nonces = new Set();
  for (const path of ['/showcase/', '/zh-CN/showcase/', '/missing/', '/zh-CN/missing/']) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const response = GET(new Request(`${origin}${path}`));
      assert.equal(response.status, path.includes('missing') ? 404 : 200);
      assert.equal(response.headers.get('content-language'), path.startsWith('/zh-CN/') ? 'zh-CN' : 'en');
      const csp = response.headers.get('content-security-policy');
      const nonce = csp.match(/script-src 'self' 'nonce-([A-Za-z0-9+/=]+)'/);
      assert.ok(nonce, 'response header must supply a nonce for Cloudflare');
      assert.equal(Buffer.from(nonce[1], 'base64').length, 16);
      assert.ok(!nonces.has(nonce[1]), 'each response needs a new nonce');
      nonces.add(nonce[1]);
      assert.match(csp, /object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'/);
      assert.doesNotMatch(csp, /unsafe-inline|unsafe-eval/);
      assert.equal(response.headers.get('cache-control'), 'public, max-age=0, must-revalidate');
    }
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
    const showcase = pages[`${prefix}/showcase/`];
    assert.equal((showcase.match(/<img data-public-reference /g) || []).length, upstream.screenshots.length);
    assert.equal((showcase.match(/<img /g) || []).length, upstream.screenshots.length + 11);
    for (const name of ['judge-cpp-accepted.jpg', 'agent-analysis-accepted.jpg', 'agent-analysis-ready.jpg', 'agent-analysis-result.jpg']) {
      assert.ok(showcase.includes(`/assets/screenshots/${name}`), `${prefix}: ${name}`);
    }
    assert.match(showcase, /earlier Sandbox Error and a later Accepted result|修复前的 Sandbox Error 和修复后的 Accepted/);
    assert.match(showcase, /earlier error analysis and a later Accepted result analysis|此前错误的分析和之后 Accepted 结果的分析/);
    assert.match(showcase, /earlier attempt that did not complete|此前未完成的分析/);
    assert.match(showcase, /submission source was not sent|提交源码未发送/);
    assert.match(showcase, /not a verified diagnosis|并非经验证的诊断/);
    assert.match(showcase, /src="\/assets\/screenshots\/landing-light.jpg" width="1264" height="720"/);
    assert.match(showcase, /src="\/assets\/screenshots\/management-problems.jpg" width="1280" height="720"/);
    assert.match(showcase, /src="\/assets\/screenshots\/console-problem-list.jpg" width="1264" height="720"/);
    for (const name of ['console-forum-detail.jpg', 'console-solutions.jpg', 'console-appearance.jpg', 'console-rankings.jpg']) {
      assert.ok(showcase.includes(`/assets/screenshots/${name}`), `${prefix}: ${name}`);
    }
    assert.match(showcase, /local development interfaces and example data|本地开发界面和示例数据/);
    assert.match(showcase, /unverified UI wording, not product guarantees|未经验证的界面文案，不构成产品保证/);
    for (let number = 1; number <= upstream.screenshots.length; number++) {
      assert.ok(showcase.includes(`id="interface-${number}"`));
    }
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
