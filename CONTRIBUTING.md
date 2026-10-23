# Contributing to the UltiCode website

This repository maintains the public website, its copy, translations, rendering, search and signed-in enquiry flow. Contributions in English or Simplified Chinese are welcome.

## Choose the right repository

- Website defects, broken links, translations and website proposals: search the [website Issues](https://github.com/DavidHLP/Sites-UltiCode/issues), then use the bug or feature form.
- Online judge, Console, Management, Agent or self-hosted deployment problems: use the [UltiCode product tracker](https://github.com/DavidHLP/UltiCode/issues) and its [contribution guidance](https://github.com/DavidHLP/UltiCode#contributing).
- Potential vulnerabilities, including website login or enquiry-data exposure: follow [SECURITY.md](SECURITY.md). Do not use public Issues or the ordinary enquiry form.

Describe the user problem and discuss substantial scope in an Issue before implementation. A proposal does not promise a delivery date or maintainer response time.

## Make and verify a focused change

Read [the project overview](README.md), [architecture](docs/ARCHITECTURE.md) and [maintenance guide](docs/MAINTENANCE.md). Run commands at this repository root with Node.js >=22.13.0 and the committed npm lockfile:

```sh
npm run install:ci
npm test
npm run lint
npm run build
npx tsc --noEmit
git diff --check
```

The build generates content before type checking; do not run standalone type checking in a fresh checkout until `npm run content:build` or `npm run build` has completed. The [CI workflow](.github/workflows/ci.yml) runs the same npm checks on pull requests and pushes to `main`. See [verification choices](docs/MAINTENANCE.md#choosing-verification) for focused local checks. Visual changes also need phone, keyboard and light/dark checks.

Edit authored sources, keep English and Chinese copy aligned, and add meaningful regression coverage for behavior changes. Preserve imported source notices, the pinned product snapshot, enquiry ownership and analytics consent. Do not commit generated output, local databases, environment files, private messages or credentials. Use `content:sync` only for an intentional, reviewed product-source refresh.

## Submit a pull request

Use a task branch and a concise English conventional commit subject, such as `docs: clarify website contribution routing`. Explain the problem, final behavior, actual checks and remaining limitations in the pull request; include screenshots when the appearance changes. Keep unrelated work out of the diff. Maintainers review and merge contributions; opening a pull request does not schedule a release or website publication.

Submit only material you have the right to contribute. Website-owned contributions use the [MIT license](LICENSE); imported and third-party materials retain their [existing notices and terms](README.md#license-and-materials).
