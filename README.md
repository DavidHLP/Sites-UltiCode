# UltiCode project website

An institution-first website for [UltiCode](https://github.com/DavidHLP/UltiCode), published with Sites using the Vinext runtime. It provides English and Simplified Chinese project pages, pinned public documentation, evaluation resources, browser search, signed-in enquiries and optional aggregate analytics.

Published website: [ulticode.bloomywren4096.chatgpt.site](https://ulticode.bloomywren4096.chatgpt.site/).

This website is a separate application from the UltiCode product. It does not host a judging environment or receive student submissions from self-hosted installations.

## Start here

- [Architecture and directory responsibilities](docs/ARCHITECTURE.md)
- [Development, content updates, privacy and publication](docs/MAINTENANCE.md)
- [Pinned product documentation](content/upstream/docs/index.md)
- [Contributing and issue routing](CONTRIBUTING.md)
- [Private security reporting](SECURITY.md)
- [Website license and material boundaries](#license-and-materials)

Run commands from the `Sites-UltiCode/` repository root. The application lives directly here, with no nested application repository. Use Node.js >=22.13.0 and npm with the checked-in lockfile:

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

## Contributions and checks

Report website text, translation, rendering and enquiry-flow issues in [Sites-UltiCode](https://github.com/DavidHLP/Sites-UltiCode/issues). Application and self-hosted deployment issues belong in [UltiCode](https://github.com/DavidHLP/UltiCode/issues). Follow [CONTRIBUTING.md](CONTRIBUTING.md) for local checks and pull requests; use [SECURITY.md](SECURITY.md) for confidential reports.

The [CI workflow](.github/workflows/ci.yml) runs the existing installation helper, tests, lint, build and then type checking on Node.js 22 for pull requests and pushes to `main`. The build generates content before type checking. CI needs no hosted login, deployment secrets or production database; it does not publish the website or establish hosted acceptance. Required branch checks are a separate GitHub setting.

## License and materials

The root [MIT license](LICENSE) covers website-owned code, authored documentation/copy, translations and original website assets, including the custom styles, `public/favicon.svg` and `public/social-preview.jpg`.

- Imported product documents in `content/upstream/` retain the [UltiCode MIT license and copyright](content/upstream/LICENSE). The copied images in `public/assets/screenshots/` come from that product snapshot; retain its notice when redistributing them. [Source metadata](content/upstream.json) records provenance. The root license does not replace upstream notices.
- Third-party/runtime materials and dependencies keep their own terms, including the [Sites Vite plugin notice](scripts/vite/sites-vite-plugin.LICENSE) and [vendored shadcn stylesheet notice](vendor/shadcn-tailwind-4.13.0.LICENSE.md). Review dependency licenses for your distribution.
- Names and logos identify the projects; no trademark rights, endorsement or rights to separately supplied problem content, datasets or student work are granted by the website license.
