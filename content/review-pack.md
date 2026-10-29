# UltiCode technical and institutional review pack

Updated 29 October 2026. This document describes the public project and the website's current service model. It is a review aid, not a signed offer, certification, completed institutional assessment or production acceptance report.

## Product and availability

UltiCode is a self-hostable online judge for problems, practice submissions, judging, contests, editorials, community and administration. Console is the learner interface; Management is the privileged operating interface. Source is MIT licensed. Obtaining it requires no software subscription from this website; infrastructure, staff and optional model services are separate costs.

The available evaluation model is self-hosted: your institution supplies an environment, operator and permitted evaluation data. No managed hosting plan, paid pilot slot, fixed cohort allowance, support response deadline or commercial contract is offered through this website.

Practice includes problem discovery, problem lists, a multi-panel problem workspace and submission results. Contests include registration, rankings and virtual participation where available. Learners can review their own submissions, editorials and bookmarks; Management provides problem and contest administration, moderation, audit and operational views. These describe implemented workflows, not an end-to-end acceptance result for your deployment.

## Source and freshness

Source revision: {{SOURCE_COMMIT}}

Public source: {{SOURCE_URL}}

Read the documentation and executable runbooks belonging to the revision you deploy. A GitHub commit or a process running online is not proof of successful production deployment. The updates page distinguishes a source snapshot from a published release.

## System and data boundaries

| Boundary | Current implementation reference | Institution/operator decision |
| --- | --- | --- |
| Auth | Credentials, OAuth, roles and browser sessions; access and refresh credentials use HttpOnly cookies; refresh sessions are stored as hashes | Identity-provider compatibility, account lifecycle, administrator provisioning and offboarding |
| Five owners | Auth, Admin, App, Submission and Notification maintain data ownership; Judge and Search are separate workers | Region, access rights, data classification, operational credentials and migration authority |
| Execution | Judge consumes submission work and executes through the sandbox path | Runtime limits, network restrictions, patching and production remote/rootless Docker with TLS |
| Storage and derived state | MySQL, S3-compatible object storage, Redis queues and optional MeiliSearch indexes | Storage location, bucket permissions, backup coverage, retention, deletion and index recovery |
| Agent | Independent Python service; conversations/workflow state are separate from business databases and saved learning plans | Model provider, external processing, allowed source disclosure, persistence and cost policy |

No institution-specific SAML, SCIM or learning-management-system integration is established by these general controls. Self-hosting is not a compliance certification.

## Current Agent behavior

The experimental Agent is off by default, including when its availability setting is absent. An administrator must explicitly enable it. The former VITE_AGENT_REVIEW_ENABLED frontend flag is no longer read. A feature setting does not start the separate Python service, configure a model, authorize external calls or grant persistence.

Eligible sources are an account's own completed ordinary-practice submissions. Contest or unfinished submissions are excluded. Source-aware analysis requires explicit consent; the source read is bounded to 12,000 characters. Opening a workspace does not start analysis. Model calls and persistence have separate runtime controls.

Loopback development can enable live calls without a shared cumulative budget policy, while retaining per-request limits. Operators must account for real provider charges; per-run limits do not establish an overall spending cap. Non-loopback deployments require the documented active budget policy. This website does not initiate model calls.

Review provider processing regions, permitted source disclosure and retention before enabling learner use. Conversation history remains until its owner deletes it; saved learning plans have a separate lifecycle. Cancelling analysis does not erase history or undo a completed business write.

## Deployment and recovery

Choose the installation path before generating configuration. For published images, follow the selected release’s Operations installation entry and its asset, signature, TLS/Judge and approval requirements. For fresh local development, start with the empty-volume Development entry while `.env` is absent; do not run `init-env.sh` first. With existing configuration, databases or volumes, preserve them and use the upgrade/rollback entry; never recreate configuration with `--force` or substitute a marker change for migration. See {{ORIGIN}}/get-started/ and the pinned Operations/Development guides.

Use the repository lifecycle entrypoints. The documented development prerequisites include Docker Compose v2, mise, the Maven wrapper with Zulu Java 17, the checkout's Node/pnpm versions, PM2, curl, timeout and OpenSSL. Object storage is required; there is no local uploads fallback.

Fresh environment initialization sets the Submission cutover marker to false. Complete the migration, backfill, verification and cutover runbook; do not simply set the marker to true. dev-lite and dev-full require remote Submission routing and the completed marker. dev-lite does not start either frontend by default; use the frontend entrypoint when needed. dev-full includes indexed search and both browser applications. Core is an optional bounded verification profile, not the default production topology.

For production, retain a complete approved release descriptor and previous compatible artifact. Rollback does not downgrade the database schema. Full recovery covers the control schema, all five owner schemas and required objects. Storage credentials, encryption keys, retention, restore authority and measured recovery targets belong to the operator.

## Evaluation protocol

1. Agree the scope, permitted data, named sponsor/operator, evaluation window and success criteria.
2. Prepare an isolated environment using the selected revision and supported configuration/migration gates.
3. Exercise a learner's complete ordinary-practice submission journey with known correct and incorrect solutions. Record identifiers and expected/actual final results. Test administrator restrictions separately.
4. Rehearse dependency failure diagnosis, an authorized backup/restore into a disposable target and representative workload. Preserve queues and recovery evidence.
5. Compare results with the agreed criteria. Expand, repeat or stop, and document export/deletion of evaluation data.

Pass criteria must cover the intended identity provider, accessibility, expected load, recovery, retention and operational support. Do not treat an HTTP 200 or a sample screenshot as completion of those criteria.

## Dated local observation

On 23 October 2026 around 07:25 UTC, the local clean checkout matched GitHub main at db1c868a179c6b100df991bddec10b395a7cc7f3 and process working directories matched that checkout. The running artifacts were not rebuilt or independently bound to that commit in this check.

- Auth, Admin, App and Notification public readiness endpoints returned HTTP 200 and status UP; Admin and App reported storage UP as well as database and Redis.
- MySQL, Redis, Nacos, RustFS and MeiliSearch reported healthy through the lifecycle command. Ten full-stack applications were listed online; Agent ran separately. Submission/Judge/Search checks are process-based in the manifest.
- Console, Management and Landing browser entries returned HTTP 200. The signed-in Console displayed the problem library and a sample problem with statement, examples and editor controls.
- The public Agent availability setting was enabled. Anonymous direct/proxied Agent capabilities returned HTTP 401 session_required. No model was called.

Not exercised: a new judge verdict, backup restoration, load capacity, failover, institutional SSO, a security audit or live model quality. This is a local development observation, not a customer case study, capacity guarantee or uptime report.

## Website enquiries and support

Ordinary questions can use the signed-in contact form or public GitHub Issues. Website enquiries are saved for the Site owner to review through restricted Sites tools; automatic email forwarding, case assignment and a review schedule are not configured or promised. Saving a record is not a booked pilot. Use your own operating contact for an incident in an institution's deployment.

Senders can list and delete only their own enquiries. Records remain until sender/owner deletion; the separate anti-abuse counter also has no automated expiry. Website deletion does not erase provider backups or identity logs. Optional analytics are off by default and store only daily action counts. Keep student records, credentials, private code, unpublished vulnerabilities and sensitive logs out of ordinary enquiries.

Potential vulnerabilities belong in the repository's private GitHub reporting route, not public Issues or ordinary enquiries. Check the security page for current availability. No security-response deadline is promised.

## Licensing and evidence

MIT permits use and redistribution under its terms; retain the required copyright and permission notice. Dependencies, images, problem content, editorials and student work have their own rights and policies. The source is provided without warranty under the license.

The website's repository interface screenshots are design/regression references with sample accounts and numbers. Its homepage code walkthrough executes no code. No customer testimonial, partner endorsement, adoption count, SOC 2/ISO certification, production SLA or verified recovery target is asserted.

## Continue the review

- Evaluation: {{ORIGIN}}/evaluation/
- Local observations: {{ORIGIN}}/verification/
- Architecture: {{ORIGIN}}/docs/source/architecture/
- Development: {{ORIGIN}}/docs/source/development/
- Operations: {{ORIGIN}}/docs/source/operations/
- Security: {{ORIGIN}}/security/
- Support: {{ORIGIN}}/support/
- Privacy: {{ORIGIN}}/privacy/
- Decision worksheet: {{ORIGIN}}/resources/institutional-review-checklist.md
