import { escapeHtml } from './render-content.mjs';
import { origin } from '../../content/site-config.mjs';

export const chinesePath = path => `/zh-CN${path}`;

export function localizedUrl(value, paths) {
  if (value.startsWith('/signin-with-chatgpt?')) {
    const url = new URL(value, 'https://website.invalid');
    const destination = url.searchParams.get('return_to');
    if (destination && paths.has(destination)) url.searchParams.set('return_to', chinesePath(destination));
    return url.pathname + url.search;
  }
  if (/^\/resources\/institutional-review-(pack|checklist)\.md$/.test(value)) return value.replace('.md', '.zh-CN.md');
  const match = value.match(/^(\/[^?#]*)([?#].*)?$/);
  return match && paths.has(match[1]) ? chinesePath(match[1]) + (match[2] || '') : value;
}

const voidTags = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
const originalTags = new Set(['pre','code','script','style','svg','time']);

// Generated markup only: this localizes text, never parses untrusted HTML for rendering.
export function localizeHtml(html, { messages, paths, missing = new Set() }) {
  const stack = [];
  function translate(value) {
    const key = value.replace(/\s+/g, ' ').trim();
    if (!key) return value;
    let translated = Object.hasOwn(messages,key) ? messages[key] : undefined;
    if (translated === undefined && key.endsWith(' | UltiCode')) {
      const title = key.slice(0, -11);
      if (messages[title]) translated = `${messages[title]} | UltiCode`;
    }
    if (translated === undefined) {
      if (/[a-zA-Z]{2}/.test(key)) missing.add(key);
      return value;
    }
    return value.slice(0, value.length - value.trimStart().length) + escapeHtml(translated) + value.slice(value.trimEnd().length);
  }
  return html.replace(/<!--[\s\S]*?-->|<![^>]*>|<\/?[a-zA-Z][^>]*>|[^<]+|</g, token => {
    if (!token.startsWith('<')) return stack.at(-1)?.original ? token : translate(token);
    if (token.startsWith('<!--') || token.startsWith('<!')) return token;
    const closing = token.match(/^<\/([\w-]+)/);
    if (closing) {
      if (stack.at(-1)?.tag !== closing[1]) throw new Error(`Unbalanced generated markup: ${closing[1]}`);
      stack.pop();
      return token;
    }
    const tag = token.match(/^<([\w-]+)/)?.[1];
    if (!tag) return token;
    const inheritedOriginal = stack.at(-1)?.original || false;
    const original = inheritedOriginal || originalTags.has(tag) || /\bdata-(original-source|original-label)\b/.test(token);
    if (!voidTags.has(tag) && !token.endsWith('/>')) stack.push({ tag, original });
    if (!/\bdata-language=|\brel="alternate"/.test(token)) {
      token = token.replace(/\bhref="([^"]*)"/g, (attribute, value) => {
        const next = value.startsWith(origin) ? origin + localizedUrl(value.slice(origin.length), paths) : localizedUrl(value, paths);
        return next === value ? attribute : `href="${escapeHtml(next)}"`;
      });
    }
    if (inheritedOriginal || /\bdata-(original-source|original-label)\b/.test(token)) return token;
    if (/\bdata-language="en"/.test(token)) token = token.replace(' aria-current="page"', '');
    if (/\bdata-language="zh-CN"/.test(token)) token = token.replace('>', ' aria-current="page">');
    token = token.replace(/\b(aria-label|alt|placeholder|title)="([^"]*)"/g, (_, name, value) => `${name}="${translate(value)}"`);
    if (tag === 'meta' && /\b(?:name="description"|property="og:(?:title|description)"|name="twitter:title")/.test(token)) {
      token = token.replace(/\bcontent="([^"]*)"/, (_, value) => `content="${translate(value)}"`);
    }
    if (tag === 'meta' && /\bproperty="og:url"/.test(token)) token = token.replace(/\bcontent="([^"]*)"/, (_, value) => `content="${origin}${localizedUrl(value.slice(origin.length), paths)}"`);
    if (/^<(html|aside|p)\b/.test(token)) token = token.replace(/\blang="en"/, 'lang="zh-CN"');
    return token;
  });
}
