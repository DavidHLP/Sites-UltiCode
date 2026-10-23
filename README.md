# UltiCode project website

An institution-first website for [UltiCode](https://github.com/DavidHLP/UltiCode), published with Sites using the Vinext runtime. It provides English and Simplified Chinese project pages, pinned public documentation, evaluation resources, browser search, signed-in enquiries and optional aggregate analytics.

This website is a separate application from the UltiCode product. It does not host a judging environment or receive student submissions from self-hosted installations.

## Start here

- [Architecture and directory responsibilities](docs/ARCHITECTURE.md)
- [Development, content updates, privacy and publication](docs/MAINTENANCE.md)
- [Pinned product documentation](content/upstream/docs/index.md)

Run commands from this repository, `ulticode-institutions/`. Use Node.js >=22.13.0 and npm with the checked-in lockfile:

```sh
npm run install:ci
npm run build
```

For the first local preview, follow the [D1 initialization instructions](docs/MAINTENANCE.md#local-development) before starting `npm run dev -- --hostname 127.0.0.1 --port 4173`. Apply migrations only when pending.

## Project layout

| Path | Responsibility |
| --- | --- |
| `app/` | HTTP routes, Sites identity and framework layout |
| `lib/`, `db/`, `drizzle/` | API rules, connector integration, schema and migrations |
| `content/` | Authored pages, translations, website/source metadata and pinned product documents |
| `scripts/content/` | Content generation, rendering, localization and public source synchronization |
| `scripts/` | Installation and runtime entrypoints, with Vite and connector-preview integrations in subdirectories |
| `public/` | Authored browser assets plus ignored generated public resources |
| `tests/` | Existing renderer/localization and API regression tests |
| `docs/` | Documentation for maintaining this website |
| `generated/`, `dist/` | Ignored content route map and deployment output; regenerate instead of editing |

`npm run dev` and `npm run build` generate content first. For focused work, use `npm run content:build`, `npm test`, `npm run lint` and `npx tsc --noEmit`. See the maintenance guide for verification choices and source refresh steps.

Preserve `.openai/hosting.json` and its project identity. Keep enquiry ownership, analytics consent, original-source provenance and evidence boundaries intact. Screenshots and dated development observations are not customer endorsements or production acceptance evidence.
