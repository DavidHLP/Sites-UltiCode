import { repository, sourceCommit } from './site-config.mjs';

const source = `${repository}/blob/${sourceCommit}`;

const sourceNote = `<p class="source-note">Based on the public repository at <a href="${source}/README.md">${sourceCommit.slice(0,7)} · source snapshot</a>. The long-form source guides are maintained in Chinese. These instructions describe a development environment; they do not establish a production deployment or service guarantee.</p>`;

export const guides = [
  {
    path: '/get-started/',
    title: 'Start with a controlled evaluation.',
    description: 'Prepare a development environment, understand the required data gate, and check the platform before the first submission.',
    label: 'Getting started',
    body: `
      <section id="before-you-start">
        <h2>Know what you are starting</h2>
        <p>UltiCode is a self-hosted online judge for problem practice, contests, submissions and administration. The repository includes the applications and operational tooling. You supply the environment, configuration and people who operate it.</p>
        <p>The default topology is distributed. The optional Core profile is a bounded verification environment, rather than the default way to deploy the product. Start with the documented development modes below.</p>
        <div class="callout"><strong>First startup has a required data preparation gate.</strong><p>A newly generated environment sets <code>SUBMISSION_CUTOVER_COMPLETE=false</code>. Startup refuses an incomplete Submission cutover. Complete the migration and verification runbook with your operator before starting; changing that flag alone does not complete the work.</p></div>
        <p><a class="text-link" href="/docs/source/product/">Read the product boundaries</a> · <a class="text-link" href="/docs/source/architecture/">Read the architecture guide</a></p>
      </section>

      <section id="requirements">
        <h2>Prepare the tools and dependencies</h2>
        <ul class="check-list">
          <li>Git, Docker and Docker Compose v2.</li>
          <li>mise-managed Zulu Java 17; use the repository's <code>services/mvnw</code> wrapper for backend tasks.</li>
          <li>Node.js 22.12 or later, pnpm 10 or later, and PM2; follow the versions declared by the checkout's mise and package configuration.</li>
          <li><code>curl</code>, <code>timeout</code> and <code>openssl</code>.</li>
          <li>Configuration for the required MySQL, Redis, Nacos and S3-compatible object storage dependencies. The documented development object store is RustFS. Indexed search additionally uses MeiliSearch.</li>
          <li>The migration identity, certificates and other inputs required by the selected runtime scope. Follow the configuration guide rather than supplying guessed credentials.</li>
        </ul>
        <p class="source-note">Version note: this snapshot's English README allows Node.js <code>^20.19.0 || &gt;=22.12.0</code>, while the development guide specifies <code>&gt;=22.12.0</code>. Node 22.12 or later meets both statements; use the checkout's declared tool versions for an exact setup.</p>
        <p>Dev Containers and Codespaces are another documented environment option. Container creation installs dependencies and the default startup check runs the unit gate; it does not start the full platform.</p>
      </section>

      <section id="checkout">
        <h2>1. Get a matching source checkout</h2>
        <p>For an evaluation matching the documents rendered on this website, check out this source snapshot:</p>
        <pre class="code-block"><code>git clone https://github.com/DavidHLP/UltiCode.git
cd UltiCode
git checkout ${sourceCommit}</code></pre>
        <p>This creates a detached checkout of the documented revision. For ongoing development, use a task branch and read the guides in that checkout. <a href="https://github.com/DavidHLP/UltiCode">The repository's current default branch</a> may contain newer requirements.</p>
      </section>

      <section id="environment">
        <h2>2. Check and configure the environment</h2>
        <p>Run the repository entrypoints from the repository root:</p>
        <pre class="code-block"><code>./ulticode doctor --json
./scripts/dev/init-env.sh</code></pre>
        <p>Read the doctor's results and resolve missing requirements. The environment initializer creates <code>.env</code>; keep it private and out of commits. Supply the required values through your environment or secret management process.</p>
        <p>Object storage is required for this snapshot. Missing or unreachable storage fails startup; it does not silently fall back to a local uploads directory. Existing installations with local avatars or backups must use the documented object migration procedure.</p>
        <p><a class="text-link" href="/docs/source/development/">Configuration and environment guide</a></p>
      </section>

      <section id="data-gate">
        <h2>3. Complete the required data preparation</h2>
        <p>Read <a href="/docs/source/operations/">Operations → database migrations and Owner convergence</a> and the linked database and cutover runbooks before applying migrations. An existing installation also needs its data, backup and rollback conditions assessed.</p>
        <p>The documented sequence is expand, backfill, verify, cut over, then contract. Verification covers data parity, writer state and permissions. Cutover requires stopping and draining affected writers and switching the route through the runbook.</p>
        <ul class="check-list">
          <li>Use the authoritative migrations and the required migration principal.</li>
          <li>Preserve existing data and obtain the backup and restore evidence the runbook requires.</li>
          <li>Complete the authorized Submission backfill, verification and cutover procedure.</li>
          <li>Only record the completed cutover when the required evidence exists. Normal startup requires <code>APP_SUBMISSION_ROUTING_MODE=remote</code> and <code>SUBMISSION_CUTOVER_COMPLETE=true</code>.</li>
        </ul>
        <p>If you cannot satisfy this gate, stop here and <a href="https://github.com/DavidHLP/UltiCode/issues">ask a setup question</a> with sanitized diagnostic output. This guide does not provide a shortcut around migration validation.</p>
      </section>

      <section id="startup">
        <h2>4. Choose the development mode</h2>
        <div class="table-scroll"><table><caption>Documented development modes</caption><thead><tr><th scope="col">Mode</th><th scope="col">Search</th><th scope="col">Browser applications</th></tr></thead><tbody><tr><th scope="row">dev-lite</th><td>Database-backed search; no Search worker</td><td>Not started by default</td></tr><tr><th scope="row">dev-full</th><td>Indexed search with the Search worker</td><td>Console and Management started</td></tr></tbody></table></div>
        <p>After the data gate and required configuration are complete, choose one startup command. For both browser applications:</p>
        <pre class="code-block"><code>./scripts/dev/up.sh --mode dev-full</code></pre>
        <p>For database-backed search and a smaller development setup:</p>
        <pre class="code-block"><code>./scripts/dev/up.sh --mode dev-lite
# Start the browser applications when needed:
./scripts/dev/up.sh --frontend-only</code></pre>
        <p>For a specific task, the development guide also defines <code>app-journey</code>, <code>admin</code>, <code>submission-judge</code>, <code>search</code> and <code>full-stack</code> scopes. Select one deliberately and use that same scope for status, logs, health and stopping. Use the lifecycle scripts so migration and readiness checks remain in the startup path.</p>
      </section>

      <section id="check-readiness">
        <h2>5. Check readiness and open the applications</h2>
        <p>Use the lifecycle health command for the scope you started. For the explicit full-stack scope, the documented command family is:</p>
        <pre class="code-block"><code>./scripts/dev/up.sh status --scope full-stack
./scripts/dev/up.sh health --scope full-stack
./scripts/dev/up.sh logs --scope full-stack</code></pre>
        <p>A running process or a page that loads is only part of the check. Resolve failed dependencies and worker readiness before evaluating submissions.</p>
        <div class="table-scroll"><table><caption>Default development browser addresses, once frontends are running</caption><thead><tr><th scope="col">Application</th><th scope="col">Address</th><th scope="col">Purpose</th></tr></thead><tbody><tr><th scope="row">Console</th><td><code>http://localhost:9002</code></td><td>Practice, contests and submission results</td></tr><tr><th scope="row">Management</th><td><code>http://localhost:9003</code></td><td>Authorized administration</td></tr></tbody></table></div>
        <p>These are loopback development addresses, not hosted demo links. Use the access and account configuration for your own installation; this website publishes no default administrator account.</p>
        <p><a class="button primary" href="/docs/first-submission/">Walk through the first submission</a></p>
      </section>

      <section id="after-evaluation">
        <h2>Before inviting a class</h2>
        <p>Confirm sign-in, authorization, a known problem and a complete submission-to-verdict cycle in your target environment. Then review backup and restore, object storage access, Judge isolation, monitoring, updates and support ownership. Decide what data is permitted and how long it is retained.</p>
        <p>Development readiness does not establish uptime, production capacity or a recovery objective. Use the operations guide to plan and verify those separately.</p>
        <p><a class="text-link" href="/docs/troubleshooting/">Troubleshoot the evaluation</a> · <a class="text-link" href="/docs/source/operations/">Read operations and recovery</a></p>
        ${sourceNote}
      </section>`,
  },
  {
    path: '/docs/',
    title: 'A path from evaluation to operation.',
    description: 'Find the right guide for practice, teaching, platform operation or contributing to UltiCode.',
    label: 'Documentation',
    body: `
      <section id="choose-your-path">
        <h2>Start with your task</h2>
        <div class="table-scroll"><table><caption>Learning paths</caption><thead><tr><th scope="col">Your role</th><th scope="col">Start here</th><th scope="col">Then read</th></tr></thead><tbody>
          <tr><th scope="row">Administrator or IT evaluator</th><td><a href="/get-started/">Set up a controlled evaluation</a></td><td><a href="/docs/source/operations/">Deployment, recovery and operational boundaries</a></td></tr>
          <tr><th scope="row">Instructor or contest organizer</th><td><a href="/docs/source/product/">Understand product roles and capabilities</a></td><td><a href="/docs/first-submission/">Check the learner submission journey</a></td></tr>
          <tr><th scope="row">Student or learner</th><td><a href="/docs/first-submission/">Submit a first solution on your institution's installation</a></td><td>Follow your instructor's problem and contest instructions.</td></tr>
          <tr><th scope="row">Developer or contributor</th><td><a href="/docs/source/development/">Development, checks and repository rules</a></td><td><a href="/docs/source/architecture/">Architecture</a> and <a href="/docs/source/reference/">API and authentication contracts</a></td></tr>
        </tbody></table></div>
        <p>Students use an installation provided by their institution or operator. The marketing website is not a public problem-solving service.</p>
      </section>

      <section id="practical-guides">
        <h2>Practical English guides</h2>
        <ul class="link-list">
          <li><a href="/get-started/">Getting started</a><p>Tooling, configuration, the migration gate, startup modes and readiness.</p></li>
          <li><a href="/docs/first-submission/">Your first submission</a><p>A deliberate checklist from sign-in to reviewing a verdict.</p></li>
          <li><a href="/docs/troubleshooting/">Troubleshooting</a><p>Identify the failing boundary and gather useful, sanitized evidence.</p></li>
        </ul>
        <p>These guides orient you to the published source snapshot. For exact configuration, contracts and operational procedures, continue to the source documents below.</p>
      </section>

      <section id="source-library">
        <h2>The source documentation, rendered here</h2>
        <p>The detailed project guides are currently maintained in Chinese. They are rendered as readable pages on this site and link back to their public source revision.</p>
        <ul class="link-list">
          <li><a href="/docs/source/overview/">Documentation overview <span lang="zh-CN">· 文档入口</span></a><p>Choose the authoritative guide for each topic.</p></li>
          <li><a href="/docs/source/product/">Product and domain <span lang="zh-CN">· 产品与领域</span></a><p>Roles, capabilities, terminology and explicit product boundaries.</p></li>
          <li><a href="/docs/source/architecture/">Architecture <span lang="zh-CN">· 架构与系统边界</span></a><p>Service responsibilities, data flow and security boundaries.</p></li>
          <li><a href="/docs/source/development/">Development <span lang="zh-CN">· 开发、测试与规则</span></a><p>Prerequisites, lifecycle entrypoints, configuration, checks and troubleshooting.</p></li>
          <li><a href="/docs/source/operations/">Operations <span lang="zh-CN">· 运维、部署与恢复</span></a><p>Release, migrations, storage, backup, recovery and incident response.</p></li>
          <li><a href="/docs/source/reference/">API and authentication <span lang="zh-CN">· API、认证与内部契约</span></a><p>External entrypoints, browser sessions and internal contracts.</p></li>
          <li><a href="/docs/source/readme-en/">Repository README · English</a><p>The project's English overview and development quick start.</p></li>
          <li><a href="/docs/source/readme-zh/">Repository README <span lang="zh-CN">· 简体中文</span></a><p>The Chinese project introduction.</p></li>
        </ul>
      </section>

      <section id="how-to-read">
        <h2>Read the guide that matches your checkout</h2>
        <p>Source code, configuration, migration scripts and executable runbooks determine behavior. This website renders a pinned public snapshot so its content can be traced. If your version differs, use the documentation in your own checkout and review its changes before running commands.</p>
        <p><a href="https://github.com/DavidHLP/UltiCode/tree/main/docs">Read the latest documentation on GitHub</a> when evaluating the current default branch. Latest-branch content can change independently of this website.</p>
        <p>Repository checks show the behavior they exercise. They do not establish production uptime, recovery time, a security certification or model quality.</p>
        ${sourceNote}
      </section>`,
  },
  {
    path: '/docs/first-submission/',
    title: 'Follow a solution through to a verdict.',
    description: 'A first-use checklist for a healthy UltiCode installation, from opening a problem to checking the submission record.',
    label: 'First submission',
    body: `
      <section id="ready-to-practice">
        <h2>Begin on a healthy installation</h2>
        <p>This walkthrough starts after an operator has completed the data preparation gate, started the required services and confirmed their readiness. If you are setting up UltiCode yourself, begin with <a href="/get-started/">Getting started</a>.</p>
        <ul class="check-list">
          <li>Use the Console address supplied by your institution or operator.</li>
          <li>Use an account intended for your own practice and follow that installation's sign-in or registration process.</li>
          <li>Ask the operator or instructor for a known, available practice problem with verified examples, test data and a configured judging language.</li>
          <li>Confirm the Submission service, Judge worker and sandbox dependencies are ready.</li>
        </ul>
        <p>No default administrator credentials or guaranteed seed problem are provided by this website. Use the account and content preparation instructions for your deployment.</p>
      </section>

      <section id="read-the-problem">
        <h2>Read the problem before writing code</h2>
        <p>Open the problem your instructor or operator selected. Read its input and output format, limits and examples. Choose a language that the installation exposes and that the problem supports.</p>
        <p>For the first evaluation, use a small, known solution whose expected result the operator can independently check. Example inputs are an aid to understanding; they do not establish that all judge test data is configured correctly.</p>
      </section>

      <section id="send-a-solution">
        <h2>Submit and keep the submission record</h2>
        <p>Enter your solution in the problem's submission interface, confirm the language and submit once. Follow the submission record while the system processes it. Record the submission identifier if you need help.</p>
        <p>If the result is delayed, inspect the original submission before trying again. A slow or unknown response does not establish whether the first submission was accepted by the service.</p>
        <p>The public product documentation describes the submission lifecycle and verdict ownership. Exact result labels, available languages and UI controls depend on the installed revision and configuration.</p>
      </section>

      <section id="understand-the-result">
        <h2>Review the result</h2>
        <div class="table-scroll"><table><caption>How to approach the first result</caption><thead><tr><th scope="col">What you observe</th><th scope="col">Next step</th></tr></thead><tbody>
          <tr><th scope="row">A completed result that matches the known solution</th><td>Compare the problem, language and submitted source with your intended inputs. Keep the record as evidence for this environment.</td></tr>
          <tr><th scope="row">A completed result that differs from your expectation</th><td>Read the reported feedback. Check input handling, output format and limits, then ask the operator to verify problem data if needed.</td></tr>
          <tr><th scope="row">No completed result or a processing failure</th><td>Keep the submission identifier and timestamp. Ask the operator to inspect the Submission-to-Judge path before resubmitting.</td></tr>
        </tbody></table></div>
        <p>One successful submission demonstrates that specific journey. It does not measure classroom capacity, judge isolation under attack or service availability. Operators should verify those requirements separately before a broader rollout.</p>
      </section>

      <section id="teaching-checklist">
        <h2>For instructors preparing a first session</h2>
        <ul class="check-list">
          <li>Check the task with a normal learner account, including what that account cannot access.</li>
          <li>Verify problem visibility, statement, examples, limits, test data and the languages students will use.</li>
          <li>Check both a known correct solution and a deliberately incorrect solution against expected outcomes.</li>
          <li>Confirm who handles access problems, content corrections and delayed verdicts during the session.</li>
          <li>Use test accounts and permitted evaluation data before adding real learner information.</li>
        </ul>
        <p>Contest-specific access, timing and rules need a separate check for your event. An ordinary practice submission does not establish that the contest setup is correct.</p>
      </section>

      <section id="optional-analysis">
        <h2>Optional analysis is a separate capability</h2>
        <p>The Agent review workspace uses a separate service for an account’s own completed ordinary-practice submissions. In this revision, availability is controlled by the administrator’s Agent feature setting and defaults to enabled when no setting exists. This does not start the service or authorize model use. Contests and submissions still being judged remain outside the supported source scope.</p>
        <p>Using an external model requires separate configuration and runtime authorization. Confirm the data scope and cost policy with the operator. Opening a submission or review workspace does not itself request a model analysis.</p>
        <p><a class="text-link" href="/docs/source/product/">Read the analysis feature boundaries</a> · <a class="text-link" href="/docs/troubleshooting/">Get help with a failed journey</a></p>
        ${sourceNote}
      </section>`,
  },
  {
    path: '/docs/troubleshooting/',
    title: 'Find the failing boundary first.',
    description: 'Use the project lifecycle tools and preserve the evidence needed to diagnose startup, access and judging failures.',
    label: 'Troubleshooting',
    body: `
      <section id="first-observations">
        <h2>Collect a small, useful report</h2>
        <p>Record your source revision, selected startup mode or scope, tool versions, the command that failed and its exit result. For a browser problem, include the route, timestamp and sanitized error message. For a submission problem, include its identifier and observed state.</p>
        <p>Do not publish <code>.env</code>, passwords, tokens, cookies, private keys, submitted private code or a complete sensitive log. Share the minimum redacted excerpt needed to understand the failure.</p>
        <p><a class="text-link" href="https://github.com/DavidHLP/UltiCode/issues">Search existing issues or report a reproducible problem</a></p>
      </section>

      <section id="lifecycle-checks">
        <h2>Use the same scope for diagnosis</h2>
        <p>Run the doctor and use status, health and logs for the scope you started. For an explicit full-stack run:</p>
        <pre class="code-block"><code>./ulticode doctor --json
./scripts/dev/up.sh status --scope full-stack
./scripts/dev/up.sh health --scope full-stack
./scripts/dev/up.sh logs --scope full-stack</code></pre>
        <p>Replace <code>full-stack</code> with your chosen scope when evaluating a smaller service set. Judge and Search workers do not expose business HTTP pages; use their documented readiness and logs rather than expecting a browser endpoint.</p>
        <p>Start and stop through <code>scripts/dev</code>. Direct PM2 or Maven startup bypasses the shared lifecycle manifest and its migration, readiness and rollback checks.</p>
      </section>

      <section id="common-symptoms">
        <h2>Match the symptom to the next check</h2>
        <div class="table-scroll"><table><caption>First checks for common evaluation failures</caption><thead><tr><th scope="col">Symptom</th><th scope="col">Check next</th></tr></thead><tbody>
          <tr><th scope="row">Startup refuses the cutover marker</th><td>Read the migration and Owner cutover procedure. Fresh environment initialization intentionally sets the marker to false. Complete the required data verification; do not only change the marker.</td></tr>
          <tr><th scope="row">The Console or Management address does not open</th><td><code>dev-lite</code> starts neither frontend by default. After a healthy backend startup, use <code>./scripts/dev/up.sh --frontend-only</code>, or deliberately select <code>dev-full</code>. Check the chosen scope and configured ports.</td></tr>
          <tr><th scope="row">A backend fails before serving HTTP</th><td>Check the first startup error and required configuration. This snapshot probes object storage during startup; missing or unreachable S3/RustFS configuration can prevent the application context from starting.</td></tr>
          <tr><th scope="row">Readiness reports storage down</th><td>Check the endpoint, bucket, scoped access permissions and TLS configuration through the operations guide. Restore storage; there is no local filesystem fallback.</td></tr>
          <tr><th scope="row">A configuration edit has not taken effect</th><td>The development guide uses <code>./scripts/dev/up.sh --mode dev-lite --skip-install</code> for that mode. Reapply configuration through the lifecycle entrypoint for your intended setup.</td></tr>
          <tr><th scope="row">Indexed search is unavailable</th><td><code>dev-lite</code> uses database search without the Search worker. For indexed search, select a documented search-enabled mode or scope and check MeiliSearch and worker readiness.</td></tr>
          <tr><th scope="row">A submission remains unfinished</th><td>Inspect the existing submission and the Submission, Judge, Redis and sandbox health. Preserve the queue state and identifier; use the worker runbook before replaying or discarding work.</td></tr>
          <tr><th scope="row">An old avatar or backup is unavailable after an upgrade</th><td>Read the object storage migration procedure. Startup rejects remaining legacy references for selected owners; the documented migration preserves old files and verifies objects before changing references.</td></tr>
          <tr><th scope="row">Agent review is absent or unavailable</th><td>Check Management → System settings → Feature toggles → Agent, the separate Python service and authenticated capabilities. The old <code>VITE_AGENT_REVIEW_ENABLED</code> flag is no longer read. Feature-setting failures return 503; model and persistence permissions remain separate. Core judging does not require a model call.</td></tr>
          <tr><th scope="row">An unknown or retired startup mode is rejected</th><td>Choose a supported mode or scope. <code>legacy-rollback</code> is retired; it is not a recovery path for current binaries.</td></tr>
        </tbody></table></div>
      </section>

      <section id="preserve-recoverability">
        <h2>Keep recovery possible</h2>
        <p>For a queue backlog, begin with worker status, Redis permissions, pending entries, the dead-letter queue and downstream health. Preserve streams, pending entries, inboxes, outboxes and leases. Deleting them to make a dashboard look clear can lose the evidence and work needed for recovery.</p>
        <p>Submission and Judge processing use generation and attempt fences. Replaying a job without the corresponding runbook can cause stale results or duplicate work. Use the appropriate recovery procedure and verify the original operation when its outcome is unknown.</p>
        <p>For production release or rollback, use the complete release descriptor retained by the deployer and verify compatibility. The documented rollback path skips schema downgrade; the current binaries do not restore a removed implementation.</p>
        <p><a class="text-link" href="/docs/source/operations/">Read recovery and incident response</a></p>
      </section>

      <section id="reporting">
        <h2>When you need project help</h2>
        <p>Search existing <a href="https://github.com/DavidHLP/UltiCode/issues">GitHub issues</a> before opening another. Describe expected and actual behavior, reproduction steps, source revision, selected scope and sanitized diagnostics. Distinguish a repeatable repository defect from a missing deployment input.</p>
        <p>Do not put an exploitable vulnerability or credentials in a public issue. Review the project's current security reporting information and use an available private reporting route before sending sensitive details.</p>
        <p>Community issue tracking is not an uptime or response-time commitment. Your deployment needs a named operational contact and an incident process.</p>
        <p><a class="text-link" href="/docs/source/development/">Complete development and troubleshooting guide</a> · <a class="text-link" href="/docs/source/reference/">Authentication and API reference</a></p>
        ${sourceNote}
      </section>`,
  },
];
