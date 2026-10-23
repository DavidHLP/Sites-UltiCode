import { repository, sourceCommit, sourceDate } from './site-config.mjs';

const source = `${repository}/blob/${sourceCommit}`;

export const evaluationPages = [
  {
    path: '/evaluation/',
    title: 'An evaluation you can reproduce',
    label: 'Evaluation protocol',
    description: 'A practical self-hosted evaluation with source references, responsibilities, acceptance criteria and a clear exit decision.',
    body: `
      <section id="evaluation-model"><h2>Start with the available service model</h2>
        <p>UltiCode is available as MIT-licensed source for self-hosted evaluation. Your team supplies infrastructure, permitted test data and an operator. The public project provides code, guides and community issue tracking; this website does not sell a managed pilot or reserve implementation time.</p>
        <p>No software subscription is required to obtain the source. Infrastructure, staff time and any enabled external model calls remain your costs. A separate service arrangement exists only if you and a provider actually agree one.</p>
        <p><a class="button primary" href="/resources/institutional-review-pack.md" download>Download the technical review pack ↓</a> · <a href="/resources/institutional-review-checklist.md" download>Download the decision worksheet</a></p>
      </section>
      <section id="evaluation-plan"><h2>A bounded sequence</h2>
        <div class="table-scroll"><table><thead><tr><th scope="col">Stage</th><th scope="col">Action</th><th scope="col">Keep as evidence</th></tr></thead><tbody>
          <tr><th scope="row">Agree scope</th><td>Choose one ordinary-practice workflow and synthetic or authorized data. Name the teaching sponsor, operator and decision owner.</td><td>Revision, permitted data, responsibilities, evaluation window and success criteria.</td></tr>
          <tr><th scope="row">Prepare</th><td>Follow the environment, object storage and migration gates. Use the supported lifecycle scripts.</td><td>Sanitized doctor results, completed migration records and selected scope. Never substitute a changed marker for a completed cutover.</td></tr>
          <tr><th scope="row">Exercise</th><td>Use a normal learner account to open a known problem, submit correct and incorrect solutions, and inspect final results. Check administrator restrictions separately.</td><td>Problem and language configuration, submission identifiers, expected and actual results, and authorization outcomes.</td></tr>
          <tr><th scope="row">Operate</th><td>Check monitoring and an approved recovery rehearsal on an isolated target. Measure your representative workload.</td><td>Observed capacity, backup coverage, restore duration, limitations and incident contacts.</td></tr>
          <tr><th scope="row">Decide and close</th><td>Compare evidence with the agreed criteria. Expand, repeat or stop; export or remove evaluation data under the agreed policy.</td><td>A decision, outstanding risks, named owners and a data disposal record.</td></tr>
        </tbody></table></div>
        <p>There is no imposed cohort size or invented duration. Set these from your workload and staff capacity before collecting learner information.</p>
      </section>
      <section id="evaluation-acceptance"><h2>Define a pass before you begin</h2>
        <ul class="check-list"><li>Known correct and incorrect practice submissions reach the expected terminal verdicts.</li><li>A learner cannot use privileged management functions or access another account’s private records.</li><li>The operator can identify a failed dependency without discarding queues or business data.</li><li>An authorized backup and restore exercise demonstrates the required coverage on a disposable target.</li><li>Identity, accessibility, workload, retention and support requirements have explicit decisions and remaining gaps.</li></ul>
        <p>A local readiness check does not complete these acceptance criteria. <a href="/verification/">The current local record</a> states exactly which observations were made.</p>
      </section>
      <section id="evaluation-data"><h2>Follow the data boundaries</h2>
        <div class="table-scroll"><table><thead><tr><th scope="col">Boundary</th><th scope="col">Documented responsibility</th><th scope="col">Decision for your environment</th></tr></thead><tbody>
          <tr><th scope="row">Identity</th><td>Auth owns credentials, browser sessions and role checks.</td><td>Registration, identity-provider fit, administrator provisioning and offboarding.</td></tr>
          <tr><th scope="row">Business data</th><td>Auth, Admin, App, Submission and Notification keep their owner boundaries; Judge and Search are workers.</td><td>Database access, region, permitted records and backup coverage.</td></tr>
          <tr><th scope="row">Objects and derived data</th><td>Object storage holds managed files; queues and search indexes support processing and discovery.</td><td>Bucket permissions, transport security, queue recovery, index rebuild and deletion propagation.</td></tr>
          <tr><th scope="row">Optional Agent</th><td>A separate Python service keeps conversation/workflow state; saved learning plans have a separate business lifecycle. Source-aware model use requires explicit source consent.</td><td>Provider, region, source disclosure, retention, per-run and cumulative costs, and whether persistence is permitted.</td></tr>
        </tbody></table></div>
        <p>Choosing self-hosting does not establish compliance, a hosting region or an identity-provider integration. Record the answers for the installation you will operate.</p>
      </section>
      <section id="evaluation-help"><h2>Ask a focused question</h2><p>Read the technical pack first. For ordinary setup questions, use <a href="/contact/?topic=pilot">a signed-in website enquiry</a> or a public GitHub Issue without private information. Include the revision, proposed workflow and the specific unresolved requirement.</p><p><a href="/support/">Read the support and data-handling policy</a> · <a href="${source}/docs/OPERATIONS.md">Operations source at ${sourceCommit.slice(0,7)}</a></p></section>`,
  },
  {
    path: '/verification/',
    title: 'What the local installation actually showed',
    label: 'Dated local verification',
    description: 'Observed local service readiness, infrastructure and browser behavior, with explicit limits and reproduction steps.',
    body: `
      <section id="verification-context"><h2>Environment and scope</h2>
        <p>Checked on <time datetime="2026-10-23T07:25:34Z">23 October 2026, around 07:25 UTC</time> against a local development installation. The clean source checkout matched public GitHub main at <a href="${repository}/tree/db1c868a179c6b100df991bddec10b395a7cc7f3"><code>db1c868</code></a>. Process working directories matched that checkout.</p>
        <p>This is a dated observation of running development services. It is not an institutional case study, production audit, build-provenance attestation or an always-live status page. The running Java artifacts were not rebuilt or independently tied to the checkout commit during this check.</p>
      </section>
      <section id="verification-observations"><h2>Observed results</h2>
        <div class="table-scroll"><table><thead><tr><th scope="col">Check</th><th scope="col">Observed result</th><th scope="col">What it establishes</th></tr></thead><tbody>
          <tr><th scope="row">Auth readiness</th><td>HTTP 200, status UP; database and Redis UP.</td><td>The public readiness route answered successfully at that moment.</td></tr>
          <tr><th scope="row">Admin and App readiness</th><td>Both HTTP 200, status UP; database, Redis and storage UP.</td><td>The reported dependencies passed those services’ readiness checks.</td></tr>
          <tr><th scope="row">Notification readiness</th><td>HTTP 200, status UP; database and Redis UP.</td><td>The public Notification readiness check passed.</td></tr>
          <tr><th scope="row">Infrastructure</th><td>MySQL, Redis, Nacos, RustFS and MeiliSearch reported healthy in the lifecycle health output.</td><td>Reported container health, separately from browser or judging acceptance.</td></tr>
          <tr><th scope="row">Process inventory</th><td>The full-stack health command listed all ten selected applications online; Agent was running separately.</td><td>Process status only. Submission, Judge and Search use the manifest’s process-based check, not an invented public readiness URL.</td></tr>
          <tr><th scope="row">Browser entries</th><td>Console, Management and Landing returned HTTP 200. The signed-in Console rendered the problem library and a sample problem’s statement, examples, language control and editor.</td><td>Page delivery and those read interactions; no new judge verdict was generated in this check.</td></tr>
          <tr><th scope="row">Agent availability setting</th><td>The public Admin feature endpoint returned HTTP 200 with enabled=true.</td><td>The installation’s current feature setting; not model readiness or analysis quality.</td></tr>
          <tr><th scope="row">Anonymous Agent access</th><td>The direct <code>/agent/capabilities</code> route and Console proxy returned HTTP 401, session_required.</td><td>The route was reachable and rejected an unauthenticated request. No model request was made.</td></tr>
        </tbody></table></div>
      </section>
      <section id="verification-repeat"><h2>Repeat the observations on your installation</h2>
        <p>From an already prepared, running checkout, use its documented lifecycle entrypoint:</p>
        <pre class="code-block"><code>git status --short --branch
git rev-parse HEAD
./scripts/dev/up.sh health --scope full-stack --json
curl --fail http://127.0.0.1:9101/api/v1/auth/health/ready
curl --fail http://127.0.0.1:9102/api/v1/admin/health/ready
curl --fail http://127.0.0.1:9103/api/v1/app/health/ready
curl --fail http://127.0.0.1:9105/api/v1/notification/health/ready</code></pre>
        <p>Use the scope and addresses from your own checkout. Loopback addresses refer to the reader’s machine; they are not public demo links. For a cold start, complete <a href="/get-started/">the configuration and migration gates</a> first.</p>
      </section>
      <section id="verification-limits"><h2>Still to verify before adoption</h2>
        <p>This check did not execute a new submission-to-verdict journey, restore a backup, measure concurrent load, exercise failover, validate an institutional identity provider, audit security, or call an external model. No uptime percentage, recovery objective, classroom capacity or customer outcome is derived from it.</p>
        <p>Local seeded problem names, accounts, activity totals and acceptance rates remain development data. <a href="/evaluation/">Use the evaluation protocol</a> to collect the missing evidence for your target installation.</p>
      </section>`,
  },
  {
    path: '/support/',
    title: 'Know how help and follow-up work',
    label: 'Support and website operations',
    description: 'Current support channels, enquiry storage and deletion, security reporting and operating responsibilities.',
    body: `
      <section id="support-channels"><h2>Choose the channel for the question</h2>
        <div class="table-scroll"><table><thead><tr><th scope="col">Need</th><th scope="col">Channel</th><th scope="col">Handling</th></tr></thead><tbody>
          <tr><th scope="row">Ordinary project or evaluation question</th><td><a href="/contact/">Signed-in website enquiry</a></td><td>A saved record for the Site owner to review through Sites. You can read and delete your own records. No automatic email forwarding is configured.</td></tr>
          <tr><th scope="row">Reproducible repository defect or proposal</th><td><a href="${repository}/issues">GitHub Issues</a></td><td>Public project tracking. Search existing reports and include a minimal sanitized reproduction.</td></tr>
          <tr><th scope="row">Potential vulnerability</th><td><a href="${repository}/security/advisories/new">Private GitHub vulnerability reporting</a></td><td>Keep exploit details out of public Issues and the ordinary website form. Check the repository security page if GitHub does not offer the reporting action.</td></tr>
          <tr><th scope="row">An incident in your installation</th><td>Your institution’s operating contact</td><td>The deployment owner handles access, backups, availability and incident response; community tracking is not an emergency service.</td></tr>
        </tbody></table></div>
        <p>There is no staffed help desk, promised review schedule, paid support plan or response-time guarantee offered by this website. Saving an enquiry confirms storage, not assignment or a booked pilot. The public project account is <a href="https://github.com/DavidHLP">DavidHLP</a>; that identity does not imply a separate legal entity or contracting service.</p>
      </section>
      <section id="support-report"><h2>Make a report actionable</h2><p>Include the source revision, mode or scope, the smallest reproduction, expected and actual behavior, timestamp and a redacted error. For a delayed submission, retain its original identifier and inspect that operation before trying again.</p><p>Do not send passwords, cookies, private keys, student records, private source code or complete sensitive logs. This website does not accept file attachments. A public GitHub draft sends nothing until you publish it.</p><p><a href="/docs/troubleshooting/">Follow the troubleshooting guide</a> · <a href="/security/#security-report">Read private reporting guidance</a></p></section>
      <section id="support-records"><h2>Website records have an explicit lifecycle</h2><p>Enquiries stay in the Site database until the sender or Site owner deletes them; there is no automated expiry. The separate per-user hourly anti-abuse counter is not reset by deleting an enquiry and also has no automated expiry. An application deletion does not erase provider backups or authentication logs.</p><p>Optional analytics are off unless allowed in this browser. They store only daily counts for six allowed events. They cannot establish unique visitors or customer adoption, and cannot isolate a previous visitor’s contribution for deletion.</p><p>Site-owner review uses restricted Sites database tools; the website offers no public cross-user record listing. <a href="/privacy/">Read the full website privacy notice</a>.</p></section>
      <section id="support-maintenance"><h2>Use documentation with a known revision</h2><p>The current public source snapshot is <a href="${repository}/tree/${sourceCommit}">${sourceCommit.slice(0,7)} · ${sourceDate}</a>. Updates on GitHub can precede this website. Before an upgrade or a new evaluation, compare revisions and review migration, identity, data and recovery changes.</p><p>The source import pins documents and interface references; a deliberate refresh reviews those changes together with the English guides, then regenerates the download pack, search and site metadata. The <a href="/updates/">updates page</a> records the snapshot check date.</p></section>`,
  },
];
