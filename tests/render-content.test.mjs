import test from 'node:test';
import assert from 'node:assert/strict';
import {renderMarkdown, sourceCommit, tableOfContents} from '../scripts/render-content.mjs';
import {localizeHtml, localizedUrl} from '../scripts/i18n.mjs';

test('source Markdown cannot create executable HTML or unsafe links', () => {
  const output = renderMarkdown('<script>alert(1)</script>\n\n<img src=x onerror=alert(1)>\n\n[unsafe](javascript:alert(1))\n\n![unsafe](data:image/svg+xml,test)', 'docs/PRODUCT.md');
  assert.doesNotMatch(output, /<script|<img\s[^>]*onerror|href="javascript:|src="data:/i);
  assert.match(output, /&lt;script&gt;/);
});

test('source links remain tied to the rendered library or pinned public revision', () => {
  const output = renderMarkdown('[Operations](OPERATIONS.md#备份与恢复)\n\n[Source](../services/README.md)', 'docs/PRODUCT.md');
  assert.match(output, /href="\/docs\/source\/operations\/#/);
  assert.match(output, new RegExp(`github.com/DavidHLP/UltiCode/blob/${sourceCommit}/services/README.md`));
});

test('Unicode and repeated headings have distinct anchors, while fenced comments remain code', () => {
  const output = renderMarkdown('## 备份与恢复\n\n## 备份与恢复\n\n```sh\n# This is a shell comment\n```', 'docs/OPERATIONS.md');
  const headings = tableOfContents(output);
  assert.deepEqual(headings.map(item=>item.id), ['备份与恢复','备份与恢复-2']);
  assert.equal(headings.length,2);
  assert.match(output, /<code class="language-sh"># This is a shell comment/);
});

test('localization keeps query/hash state and sign-in return paths without rewriting APIs or external links', () => {
  const paths = new Set(['/','/contact/']);
  assert.equal(localizedUrl('/contact/?topic=pilot#saved',paths),'/zh-CN/contact/?topic=pilot#saved');
  assert.equal(localizedUrl('/signin-with-chatgpt?return_to=%2Fcontact%2F',paths),'/signin-with-chatgpt?return_to=%2Fzh-CN%2Fcontact%2F');
  assert.equal(localizedUrl('/api/contact/',paths),'/api/contact/');
  assert.equal(localizedUrl('//example.com/contact/',paths),'//example.com/contact/');
  assert.equal(localizedUrl('https://example.com/contact/',paths),'https://example.com/contact/');
  assert.equal(localizedUrl('/resources/institutional-review-pack.md',paths),'/resources/institutional-review-pack.zh-CN.md');
});

test('translation escapes text and attributes while preserving source, code and form contracts', () => {
  const input = '<html lang="en"><body><a href="/contact/" title="Send enquiry">Send enquiry</a><a href="https://example.com/?a=1&amp;b=2">External</a><select name="topic"><option value="pilot">Pilot</option></select><pre><code>Send enquiry</code></pre><section data-original-source lang="en"><p>Send enquiry</p></section></body></html>';
  const output = localizeHtml(input,{messages:{'Send enquiry':'<img src=x onerror="alert(1)">','Pilot':'评估','External':'外部'},paths:new Set(['/contact/'])});
  assert.match(output,/<html lang="zh-CN">/);
  assert.match(output,/href="\/zh-CN\/contact\/" title="&lt;img src=x onerror=&quot;alert\(1\)&quot;&gt;"/);
  assert.doesNotMatch(output,/<img/);
  assert.match(output,/<option value="pilot">评估<\/option>/);
  assert.match(output,/<pre><code>Send enquiry<\/code><\/pre>/);
  assert.match(output,/<section data-original-source lang="en"><p>Send enquiry<\/p><\/section>/);
  assert.match(output,/href="https:\/\/example.com\/\?a=1&amp;b=2"/);
});
