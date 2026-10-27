import upstream from './upstream.json' with { type: 'json' };

export const origin = 'https://ulticode.davidhlp.dpdns.org';
export const sourceCommit = upstream.sourceCommit;
export const sourceDate = new Date(upstream.sourceDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const repository = 'https://github.com/DavidHLP/UltiCode';
export const websiteRepository = 'https://github.com/DavidHLP/Sites-UltiCode';
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
