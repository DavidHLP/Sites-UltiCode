import pages from '../../content/site-pages.json';

const renderedPages = pages as Record<string, string>;

export function GET(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname === '/' ? '/' : `${url.pathname.replace(/\/+$/, '')}/`;
  const page = renderedPages[pathname];
  return new Response(page || renderedPages['/404/'], {
    status: page && pathname !== '/404/' ? 200 : 404,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
    },
  });
}
