import MarkdownIt from 'markdown-it';
import path from 'node:path';
import upstream from '../content/upstream.json' with { type: 'json' };

export const origin = 'https://ulticode-institutions.bloomywren4096.chatgpt.site';
export const sourceCommit = upstream.sourceCommit;
export const sourceDate = new Date(upstream.sourceDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const repository = 'https://github.com/DavidHLP/UltiCode';
export const sourceRoutes = {
  'docs/index.md': '/docs/source/overview/',
  'docs/PRODUCT.md': '/docs/source/product/',
  'docs/ARCHITECTURE.md': '/docs/source/architecture/',
  'docs/DEVELOPMENT.md': '/docs/source/development/',
  'docs/OPERATIONS.md': '/docs/source/operations/',
  'docs/REFERENCE.md': '/docs/source/reference/',
  'README.md': '/docs/source/readme-en/',
  'README.zh-CN.md': '/docs/source/readme-zh/',
};

export const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export const slug = value => value.normalize('NFKC').toLowerCase().trim().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '') || 'section';

const markdown = new MarkdownIt({html: false, linkify: false, typographer: false});

function sourceLink(href, file) {
  if (href.startsWith('#') || /^(https?:|mailto:)/i.test(href)) return href;
  const [relative, fragment] = href.split('#');
  const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(file), relative));
  if (sourceRoutes[resolved]) return sourceRoutes[resolved] + (fragment ? `#${fragment}` : '');
  return `${repository}/blob/${sourceCommit}/${resolved}${fragment ? `#${fragment}` : ''}`;
}

export function renderMarkdown(input, file) {
  const text = file.startsWith('README') ? input.replace(/^<\/?div[^>]*>\s*$/gm, '').replace(/^<\/?details>\s*$/gm, '').replace(/^<summary>(.*?)<\/summary>\s*$/gm, '**$1**') : input;
  const tokens = markdown.parse(text, {});
  const seen = new Map();
  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index];
    if (token.type === 'heading_open') {
      const title = tokens[index + 1].content;
      const base = slug(title);
      const count = (seen.get(base) || 0) + 1;
      seen.set(base, count);
      token.attrSet('id', count === 1 ? base : `${base}-${count}`);
      if (token.tag === 'h1') { token.tag = 'h2'; tokens[index + 2].tag = 'h2'; }
    }
    for (const child of token.children || []) {
      if (child.type === 'link_open') child.attrSet('href', sourceLink(child.attrGet('href') || '', file));
      if (child.type === 'image') {
        const original = child.attrGet('src') || '';
        const filename = path.posix.basename(original);
        // Only locally reviewed reference screenshots are embedded in source pages.
        const allowed = ['problem-detail-dark.png','problem-set-dark.png','contests-dark.png','submissions-list-dark.png','admin-dashboard-dark.png','user-management-dark.png','contest-management-dark.png','forum-list-light.png'];
        child.attrSet('src', allowed.includes(filename) ? `/assets/screenshots/${filename}` : '');
        child.attrSet('loading', 'lazy');
        child.attrSet('width', '1496');
        child.attrSet('height', '933');
      }
    }
  }
  return markdown.renderer.render(tokens, markdown.options, {});
}

export function plainText(html) {
  return markdown.utils.unescapeAll(html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
}

export function tableOfContents(html) {
  return [...html.matchAll(/<h2\b[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g)].map(match => ({id: match[1], title: plainText(match[2])}));
}

const mainNavigation = [['/product/','Product'],['/get-started/','Get started'],['/docs/','Docs'],['/updates/','Updates'],['/community/','Community'],['/institutions/','For institutions']];
const brand = `<a class="brand" href="/" aria-label="UltiCode home"><span class="brand-mark" aria-hidden="true">u<span>c</span></span>UltiCode<span class="brand-period">.</span></a>`;
export function header(current) {
  return `<a class="skip-link" href="#main">Skip to content</a><header class="site-header wrap">${brand}<nav aria-label="Main navigation">${mainNavigation.map(([href,title]) => `<a href="${href}"${current === href ? ' aria-current="page"' : ''}>${title}</a>`).join('')}</nav><div class="header-actions"><button class="search-open" type="button" data-search-open hidden aria-label="Search documentation">Search <span aria-hidden="true">⌕</span></button><button class="theme-toggle" id="theme-toggle" type="button" aria-label="Switch color theme" hidden><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.5A8.8 8.8 0 0 1 9.5 3.5 9 9 0 1 0 20.5 14.5Z"/></svg><span id="theme-label">Dark mode</span></button><a class="github-link" data-track="github" href="${repository}">GitHub <span aria-hidden="true">↗</span></a></div></header>`;
}

export function footer() {
  return `<footer class="site-footer wrap"><div>${brand}<p>Open source. Thoughtfully considered.</p><p class="footer-source">Public source snapshot<br><a href="${repository}/tree/${sourceCommit}">${sourceDate} · ${sourceCommit.slice(0,7)} ↗</a></p></div><nav aria-label="Project resources"><a href="/get-started/">Get started</a><a href="/docs/">Documentation</a><a href="/showcase/">Interface showcase</a><a href="/verification/">Local verification</a><a href="/updates/">Versions and updates</a><a href="/community/">Community and contribution</a></nav><nav aria-label="Institutional resources"><a href="/institutions/">Institutional evaluation</a><a href="/deployment/">Deployment</a><a href="/security/">Security</a><a href="/pricing/">Costs and availability</a><a href="/licensing/">MIT license and content rights</a><a href="/contact/">Contact the project</a><a href="/privacy/">Website privacy</a><button class="text-link" type="button" data-privacy-open hidden>Analytics preferences</button></nav></footer>`;
}

const sidebar = `<aside class="docs-sidebar"><nav aria-label="Documentation navigation"><p>Start here</p><a href="/get-started/">Getting started</a><a href="/docs/first-submission/">First submission</a><a href="/docs/troubleshooting/">Troubleshooting</a><p>Evaluate and operate</p><a href="/product/">Product and boundaries</a><a href="/institutions/">For institutions</a><a href="/deployment/">Deployment</a><a href="/security/">Security</a><a href="/pricing/">Costs</a><p>Source library · 中文</p><a href="/docs/source/product/">Product and domain</a><a href="/docs/source/architecture/">Architecture</a><a href="/docs/source/development/">Development</a><a href="/docs/source/operations/">Operations</a><a href="/docs/source/reference/">API and authentication</a><p>Open source</p><a href="/updates/">Updates</a><a href="/community/">Contribute</a><a href="/licensing/">License</a></nav></aside>`;

export function contentPage(page) {
  const toc = tableOfContents(page.body);
  return `<main id="main" class="wrap document-main"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/docs/">Resources</a><span aria-hidden="true">/</span><span>${escapeHtml(page.label || page.title)}</span></nav><div class="docs-layout">${sidebar}<article class="document-article"${page.lang ? ` lang="${page.lang}"` : ''}><header class="document-heading"><p class="section-label">${escapeHtml(page.label || 'Project resource')}</p><h1>${escapeHtml(page.title)}</h1><p>${escapeHtml(page.description)}</p></header><div class="prose">${page.body}</div><p class="document-end">Source-based guidance, not a production acceptance report. <a href="${repository}/issues">Suggest a correction ↗</a></p></article><aside class="page-outline"><nav aria-label="On this page"><p>On this page</p>${toc.map(item => `<a href="#${escapeHtml(item.id)}">${escapeHtml(item.title)}</a>`).join('')}</nav></aside></div></main>`;
}

const dialogs = `<dialog id="search-dialog" aria-labelledby="search-title"><div class="dialog-heading"><h2 id="search-title">Find your next step.</h2><button class="dialog-close" type="button" aria-label="Close search">×</button></div><label class="search-label" for="site-search">Search guides, product information and source documentation</label><input id="site-search" type="search" placeholder="Try deployment, authentication or 备份" autocomplete="off"><p class="search-count" id="search-count" role="status">Search runs in your browser. Queries are not sent to an analytics service.</p><ul class="search-results" id="search-results"></ul></dialog><dialog id="privacy-dialog" aria-labelledby="privacy-title"><div class="dialog-heading"><h2 id="privacy-title">A small choice.</h2><button class="dialog-close" type="button" aria-label="Close analytics preferences">×</button></div><p>Optional analytics count promotional button clicks by day. We do not store your search terms, account, email, IP address, referrer or browsing history in these counters.</p><p>Your choice stays in this browser. Declining does not change access to the website. <a href="/privacy/">Read website privacy</a>.</p><div class="privacy-actions"><button class="button primary" id="analytics-allow" type="button">Allow aggregate click counts</button><button class="button secondary" id="analytics-decline" type="button">Keep analytics off</button></div><p id="analytics-choice" role="status"></p></dialog>`;

export function layout(page, main, extra = '') {
  const title = page.path === '/' ? 'UltiCode — Programming education. In your hands.' : `${page.title} | UltiCode`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="theme-color" content="#f5f3ec"><meta name="description" content="${escapeHtml(page.description)}"><link rel="canonical" href="${origin}${page.path}"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(page.description)}"><meta property="og:type" content="website"><meta property="og:url" content="${origin}${page.path}"><meta property="og:image" content="${origin}/social-preview.jpg"><meta name="twitter:card" content="summary_large_image"><title>${escapeHtml(title)}</title><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/site.css"><script src="/app.js" defer></script></head><body>${header(page.path)}${main}${footer()}${extra}${dialogs}</body></html>`;
}
