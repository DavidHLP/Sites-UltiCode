# Website architecture

This document describes the website repository, `ulticode-institutions/`. The UltiCode product has its own architecture in [the pinned public snapshot](../content/upstream/docs/ARCHITECTURE.md). The parent workspace is not the application's Git root.

## Content and request flow

```text
content/site-config.mjs + content/upstream.json
                    ↓
authored pages + translations + imported documents
                    ↓
scripts/content/build-content.mjs
    ├── render-content.mjs: Markdown, links, document layout
    └── i18n.mjs: Chinese HTML and localized URLs
                    ↓
generated/site-pages.json + generated public resources
                    ↓
app/[[...slug]]/route.ts → HTML responses

public/app.js → app/api/contact/route.ts → identity + lib/site-api.mjs → D1
              app/api/analytics/route.ts → lib/site-api.mjs → D1
```

Content modules depend on `content/site-config.mjs` for the canonical origin, source metadata and source-route mapping. They do not import the renderer. The configuration reads the revision and date from `content/upstream.json`; it does not contact GitHub during a build. The public snapshot updater is a separate, explicit command.

The builder assembles authored pages and imported Markdown, adds contact and privacy content, then emits English and Chinese routes, search indexes, metadata and review downloads. It rejects duplicate routes and missing authored translations. The catch-all handler reads the generated route map, normalizes trailing slashes, selects the localized 404 page and sets security headers. Page navigation consumes generated HTML; React hydration is not needed for it.

## Directory boundaries

| Layer | Location | Rules |
| --- | --- | --- |
| HTTP and identity | `app/` | Keep route adapters thin. Sites supplies trusted identity; do not substitute a browser-provided user ID. |
| API behavior | `lib/site-api.mjs` | Shared contact validation, ownership, same-origin checks, rate limiting and analytics consent/event validation. The route adapters and API tests use this implementation. |
| Storage | `db/`, `drizzle/` | Drizzle schema and SQL migration history. Current API handlers use the D1 binding directly; `db/index.ts` also provides the starter's Drizzle accessor. |
| Connector integration | `lib/connector-*`, `lib/connectors.ts`, `scripts/connector-preview/` | Sites connector contracts, request context, errors and local preview transport. Keep platform integration distinct from website API rules. |
| Authored content | `content/*.mjs`, `content/home.html`, `content/review-pack*.md`, `content/locales/` | Edit page copy, translations and downloadable source here. Site configuration has no rendering dependency. |
| Product evidence | `content/upstream/`, `content/upstream.json` | Public, pinned imports and provenance. Preserve original text; add corrections outside imported regions. |
| Content tools | `scripts/content/` | Build-time rendering, localization and explicit source synchronization. These do not run inside API requests. |
| Runtime tooling | Root-level `scripts/`, `scripts/vite/` | Existing installation, execution-profile, environment and framework wrappers, plus Vite integration. Keep their supported paths stable. |
| Browser assets | `public/app.js`, `public/styles.css`, `public/site.css`, images/icons | Authored UI behavior and design. Generated public files are explicitly listed in `.gitignore`. |
| Maintainer documentation | `docs/` | Website setup and architecture. These files are not automatically published as product-source pages. |

## Generated and local state

| Path | Produced by | Used by |
| --- | --- | --- |
| `generated/site-pages.json` | `npm run content:build` | Catch-all page route and framework build |
| `public/search-index*.json`, `public/i18n.js` | Content builder | Browser search and localized interface |
| `public/sitemap.xml`, `public/robots.txt`, `public/llms.txt` | Content builder | Public metadata consumers |
| `public/resources/institutional-review-*.md` | Content builder | Review downloads in both languages |
| `dist/` | `npm run build` | Sites publication and `npm start` |
| `.wrangler/`, `.sites-runtime/` | Preview/runtime tooling | Local persistence and tool state |

Generated outputs are ignored by Git. Build content before standalone type checking in a clean checkout. Never edit deployment output to change the site. Keep local database state separate from generated content; reorganizing source requires no database reset or migration.

## Security and compatibility boundaries

Contact requests require trusted sign-in, enforce per-user ownership and have independent hourly counters. Analytics require explicit consent and accept only the existing event identifiers. `enquiries` and `contact_rate` hold private state; `cta_daily` holds aggregate counts. None is a public listing service.

The directory reorganization keeps npm command names, page/API URLs, bilingual behavior, database schema, browser assets, Sites project identity and runtime/connector integration intact. Direct content-tool imports now use `scripts/content/`; source metadata imports use `content/site-config.mjs`. There are no compatibility wrappers for the former internal paths.

See [maintenance](MAINTENANCE.md) for setup, updates, verification, privacy details and the limits of published evidence.
