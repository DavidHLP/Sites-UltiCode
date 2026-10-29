import pages from '../../generated/site-pages.json';

const renderedPages = pages as Record<string, string>;

export function GET(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname === '/' ? '/' : `${url.pathname.replace(/\/+$/, '')}/`;
  const page = renderedPages[pathname];
  const language = pathname.startsWith('/zh-CN/') ? 'zh-CN' : 'en';
  const missingPage = language === 'zh-CN' ? '/zh-CN/404/' : '/404/';
  // Cloudflare copies the response-header nonce onto its injected detection scripts.
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));
  return new Response(page || renderedPages[missingPage], {
    status: page && pathname !== missingPage ? 200 : 404,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Language': language,
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Content-Security-Policy': `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self'; img-src 'self' data:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'`,
    },
  });
}
