import test from 'node:test';
import assert from 'node:assert/strict';
import {renderMarkdown, sourceCommit, tableOfContents} from '../scripts/render-content.mjs';

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
