# Website maintenance

Run the commands below from the `Sites-UltiCode/` repository root. This guide covers this website; the product documentation in `content/upstream/` describes the separately operated UltiCode application. See [architecture](ARCHITECTURE.md) for directory responsibilities and build/runtime boundaries, or return to the [project overview](../README.md).

An institution-first project website for [UltiCode](https://github.com/DavidHLP/UltiCode), published with Sites. It retains the navy, ivory and oxblood design, product illustration, keyboard access and light/dark themes while adding documentation, getting started, project participation and operational information.

The server uses the supported Sites Vinext starter. Content is generated into a route map and served as HTML; the browser does not need a React application to navigate it. The hosting identity remains in `.openai/hosting.json`. `dist/` is now generated deployment output; authored styles, scripts and images live in `public/`.

## Content and provenance

- `content/guides.mjs`: English getting started, first submission, troubleshooting and documentation paths.
- `content/project.mjs`: product, institutions, deployment, security, contribution, licensing, costs and contact.
- `content/home.html`: retained homepage source. The content builder supplies the current navigation, resource download and calls to action.
- `content/upstream/` and `content/upstream.json`: public documentation, release status and provenance pinned at `ec4e9b135ac1404348e0b57d58b5b745301f7d5f`, checked against GitHub main on 23 October 2026. Page links and snapshot dates derive from this metadata. Dated local verification records retain the revision actually observed at that time.
- `content/evaluation.mjs`: self-hosted evaluation protocol, dated local observations and current support/data-handling policy.
- `content/review-pack.md`: authored technical review pack; the builder resolves its public source and website links.
- `content/site-config.mjs`: canonical website origin, public product repository, snapshot revision/date and imported-document routes. Content modules read this metadata without importing the HTML renderer.
- `scripts/content/build-content.mjs`: readable source documents, section search, metadata, sitemap, robots, `llms.txt`, update information and the downloadable review pack and decision worksheet. It writes the runtime route map to `generated/site-pages.json`.
- `scripts/content/sync-source.mjs`: bounded, public-only snapshot import. It preserves the previous snapshot if fetching or validation fails. Update its pinned revision deliberately and review source changes before refreshing the website.

The original Chinese source guides remain available alongside English orientation pages. Source links use the pinned public revision. A later product checkout can differ; its code, configuration and executable runbooks determine behavior.

## Local development

Use Node.js >=22.13.0 and npm with the checked-in lockfile. Install through the Sites `install-dependencies.mjs` helper or `npm run install:ci`. Then build once to prepare the local D1 configuration:

```sh
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_keen_mother_askani.sql
npm run dev -- --hostname 127.0.0.1 --port 4173
```

Apply an existing migration only to a database where it is pending. Local previews use a separate local database. The portable starter provides mock sign-in at `/signin-with-chatgpt?return_to=%2Fcontact%2F`; this mock is excluded from production. Hosted sign-in is owned by Sites.

Run `npm test` for the focused Markdown and API security/failure tests and `npx tsc --noEmit` for types. Sites publication uses the plugin’s supported build, source, packaging and deployment helpers. Preserve its integration and the project ID. The owner has requested public, anonymous access to the website; changes to content never grant access to an institution’s product deployment.

### Commands and generated files

The application previously lived in a nested `ulticode-institutions/` repository. It now lives directly at the `Sites-UltiCode/` root, retaining its Git history, Sites identity and local database state. Update terminal working directories and external preview configurations that still point to the old directory, and rebuild before previewing; npm command names and website URLs are unchanged.

| Command | Purpose |
| --- | --- |
| `npm run content:build` | Regenerate the route map, localized search, metadata and review downloads without starting a service. |
| `npm run content:sync` | Fetch the deliberately pinned public product snapshot and screenshots; review the authored diff before rebuilding. |
| `npm run dev -- --hostname 127.0.0.1 --port 4173` | Generate content and start the development runtime. |
| `npm run build` | Generate content and build `dist/` for publication. |
| `npm start` | Preview an existing build with local Wrangler persistence; it does not rebuild content. |
| `npm test` | Run the existing renderer, localization and API regression tests. |
| `npm run lint` | Check source lint rules. |
| `npx tsc --noEmit` | Check types after content generation. |
| `npm run db:generate` | Generate SQL migrations from deliberate schema changes; review them before applying. |

The content builder resolves paths relative to its module, not the shell's working directory. Use npm commands as the supported entrypoints; direct content-tool paths now live under `scripts/content/`. Run `npm run content:build` before standalone type checking in a fresh checkout because the route handler imports the generated JSON file.

Do not edit or commit `generated/`, `dist/`, or the generated public files listed in `.gitignore`. `public/styles.css`, `public/site.css`, `public/app.js`, images and icons remain authored assets. An old `content/site-pages.json` may remain in an existing checkout; it is ignored and no longer read. No database or local preview state needs to be removed for this migration.

### Choosing verification

The repository's [CI workflow](../.github/workflows/ci.yml) uses Node.js 22 and runs `npm run install:ci`, `npm test`, `npm run lint`, `npm run build`, then `npx tsc --noEmit` on pull requests and pushes to `main`; it can also be started manually. A clean checkout uses the portable runtime profile. CI does not refresh the product snapshot, access hosted data or deploy. Keep content generation before standalone type checking. Required checks/review and branch protection are separate GitHub settings, not established by the workflow file.

For content, localization or renderer changes, regenerate content and run the existing renderer tests. For API or schema changes, run the API tests, which apply the SQL migrations to in-memory SQLite. Use lint and types for module moves and a full build to verify Vite/Vinext can bundle the generated route map. For visual changes, also inspect phone layouts, keyboard focus and both themes. A passing build does not establish hosted authentication or production database behavior.

When refreshing public sources, update `SOURCE_COMMIT` for product documentation or `SCREENSHOT_COMMIT` for images and their index in `scripts/content/sync-source.mjs`, run `npm run content:sync`, review `content/upstream.json`, imported documents and images, then run `npm run content:build`. Images currently use the public UI 2.0 revision `7d0eca225ce448d497bcb69af3a2e45ab0e9d1ba`; the documentation pin remains unchanged. Keep imported files verbatim; put corrections in authored content or the builder's surrounding notices. Synchronization validates downloads before writing and replaces each file atomically, but it is not a transaction across the whole snapshot; inspect the working tree after an interrupted write.

## Contact and analytics

The D1 binding is `DB`. Schema and generated migrations are in `db/schema.ts` and `drizzle/`.

- Contact requires a trusted Sites sign-in. Users can save, list and delete only their own enquiries. The site owner can review them through authorized Sites database tools. There is no automatic email forwarding or response-time promise.
- Requests have actual UTF-8 byte limits, schema validation, same-origin checks and independent atomic per-user hourly limits. Deleting an enquiry does not reset the rate limit.
- Enquiries remain until the user or owner deletes them. The separate rate counter also retains a site-specific user ID and hourly window; no timed retention job is configured. The website privacy page explains both.
- Analytics are off by default. Explicit consent allows only daily aggregate counters for six named promotional events. The counter table stores no user identity, IP, referrer, query or enquiry data. These are approximate click totals, not unique visitors or adoption statistics.
- For owner review, use the Sites database overview and table tools for this project. `enquiries` contains personal messages and must remain restricted; `cta_daily` contains aggregate counts; `contact_rate` contains anti-abuse state. Never expose these tables through a public listing endpoint.

## Chinese and English

English URLs remain unchanged. Simplified Chinese pages use `/zh-CN/` followed by the same path, including localized 404 responses. The language control preserves the page, query and section anchor; a saved Chinese preference applies when returning through the root entry. Navigation, metadata, authored guides, forms, accessible labels, search and review downloads have both editions. No translation service or new dependency is used.

`content/locales/zh-home-guides.mjs`, `zh-project.mjs`, `zh-ui.mjs` and `zh-extra.mjs` contain authored translations. `scripts/content/i18n.mjs` localizes generated HTML text and display attributes while preserving form values, code and original-source regions. The content build refuses missing authored translations. Each locale has its own search index and canonical URL; alternate-language links and the sitemap expose both versions.

Original source documents, code examples, the MIT license and commit titles retain their published language and provenance. They are marked as original regions; switching the interface language does not rewrite their content. The Chinese review pack is maintained in `content/review-pack.zh-CN.md`.

Switching language from a visible enquiry form keeps an unsent draft in this tab's session storage. The draft is restored only for the same signed-in identity and removed from storage after reading. It is never submitted by changing language. Blocked storage leaves the page and draft in place with an explanation. The privacy page documents the session draft and language preference; API validation, ownership, consent and event identifiers are unchanged.

## Evidence boundaries

The homepage code walkthrough is illustrative and executes no code. Repository images are design/regression references with sample accounts and numbers, not production/customer evidence. No published GitHub Releases were returned at the dated snapshot check; no stable version, SLA, certification, institutional SSO compatibility or paid service is invented.

The review pack and worksheet are real downloadable Markdown resources. The homepage's former testimonial, pilot-case and partner-logo placeholders have been replaced with linked local observations, interface references and technical evaluation material. No customer endorsement or institutional affiliation is asserted. The current evaluation model is self-hosted and community supported; no managed pilot, paid plan or support-response promise is offered. No production judging environment is hosted by this website.

The [contribution guide](../CONTRIBUTING.md), issue forms and PR checklist route website changes to `Sites-UltiCode` and application changes to `UltiCode`. The [root MIT license](../LICENSE) and [material boundaries](../README.md#license-and-materials) cover website-owned content while preserving upstream and vendor notices. Do not rewrite imported license files.

The [website security policy](../SECURITY.md) and bilingual security, support and contact pages distinguish the website's private GitHub reporting channel from the product's channel. Website login and enquiry-data concerns belong to the website owner. Recheck private-reporting availability when maintaining these links; the policy explains a safe fallback if the reporting action is unavailable. No security-response deadline or separate reporting email is promised. An operational support agreement, approved customer references, a custom domain, automatic email delivery and a public isolated product demo still require actual operator decisions and resources; they cannot be inferred from repository code.

The local verification page records development readiness, process/container status and observed read interactions on 23 October 2026. It does not claim a new submission verdict, restore drill, load test, production provenance or model-quality evaluation. Process working directories and a clean checkout do not prove that running artifacts were built from that revision.

The pinned Product source still contains an older frontend Agent flag paragraph. Preserve that imported document verbatim; its rendered page includes a correction pointing to the current Development guide and Admin/Agent implementation. Current Agent availability is controlled by Management, defaulting to enabled when unset, with separate model/persistence authorization. Loopback live calls may have per-request limits without a cumulative budget ledger; do not describe them as a total spending cap.
