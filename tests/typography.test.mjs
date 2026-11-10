import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { layout } from '../scripts/content/render-content.mjs';
import { localizeHtml } from '../scripts/content/i18n.mjs';

const css = readFileSync(new URL('../public/site.css', import.meta.url), 'utf8');
const typography = css.slice(css.indexOf('/* Locale tokens'));

function localeTokens(language) {
  const body = typography.match(new RegExp(`\\[lang\\|="${language}"\\]\\s*\\{([^}]+)\\}`))?.[1];
  assert.ok(body, `Missing ${language} typography tokens`);
  return Object.fromEntries([...body.matchAll(/(--[\w-]+):\s*([^;]+);/g)]
    .map(([, name, value]) => [name, value]));
}

test('locales define the same complete typography scale with more compact Chinese copy', () => {
  const en = localeTokens('en');
  const zh = localeTokens('zh');
  assert.deepEqual(Object.keys(en).sort(), Object.keys(zh).sort());
  for (const key of ['--copy-size', '--copy-leading', '--lead-size', '--lead-gap', '--paragraph-gap']) {
    assert.ok(parseFloat(zh[key]) < parseFloat(en[key]), `${key} must be more compact in Chinese`);
  }
  assert.equal(zh['--copy-tracking'], '0em');
  assert.equal(zh['--heading-tracking'], '0em');
  assert.notEqual(zh['--heading-weight'], en['--heading-weight']);
  assert.notEqual(zh['--subheading-weight'], en['--subheading-weight']);
});

test('hero leading survives the existing mobile selector and code keeps neutral tracking', () => {
  const hero = typography.match(/\.hero\.wrap h1\s*\{([^}]+)\}/)?.[1];
  assert.match(hero, /font-size:\s*var\(--hero-size\)/);
  assert.match(hero, /line-height:\s*var\(--heading-leading\)/);
  assert.match(typography, /\.prose p\s*\{\s*margin-block:\s*var\(--paragraph-gap\)/);
  assert.match(typography, /pre, code, kbd, samp\s*\{\s*letter-spacing:\s*normal/);
  for (const width of [1100, 800, 480]) {
    assert.ok(typography.includes(`@media (max-width: ${width}px)`));
  }
});

test('typography layer changes only text metrics and paragraph spacing', () => {
  const allowed = new Set(['font-size', 'font-weight', 'line-height', 'letter-spacing',
    'margin-top', 'margin-bottom', 'margin-block']);
  for (const [, property] of typography.matchAll(/(?:^|[;{])\s*([\w-]+)\s*:/g)) {
    assert.ok(property.startsWith('--') || allowed.has(property), `Unexpected property: ${property}`);
  }
});

test('both editions load the shared stylesheet and retain original-source language boundaries', () => {
  const page = { path: '/typography/', title: 'Typography', description: 'Typography' };
  const html = layout(page, '<main><section data-original-source lang="en"><p>English source</p></section><section data-original-source lang="zh-CN"><p>中文原文</p></section></main>');
  const zh = localizeHtml(html, { messages: {}, paths: new Set([page.path]) });
  for (const edition of [html, zh]) {
    assert.equal((edition.match(/href="\/site\.css\?v=\d+"/g) || []).length, 1);
    assert.match(edition, /data-original-source lang="en"><p>English source/);
    assert.match(edition, /data-original-source lang="zh-CN"><p>中文原文/);
  }
  assert.match(html, /<html lang="en">/);
  assert.match(zh, /<html lang="zh-CN">/);
});
