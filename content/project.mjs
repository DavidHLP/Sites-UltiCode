const repository = 'https://github.com/DavidHLP/UltiCode';
const snapshot = `${repository}/blob/638483a96a0b1dbc102aba14065d98bcea76b2cd`;
const sourceNote = (files) => `<p class="source-note">Based on the public source snapshot, not a production deployment assessment. ${files.map(([name, path]) => `<a href="${snapshot}/${path}">${name}</a>`).join(' · ')}.</p>`;

export const projectPages = [
  {
    path: '/product/',
    title: 'One place for problems, submissions and contests',
    description: 'See what UltiCode provides for learners, instructors and administrators, and where the documented boundaries remain.',
    label: 'Product',
    body: `
      <section aria-labelledby="product-work"><h2 id="product-work">The work an institution needs to do</h2>
        <p>UltiCode is a self-hostable, open-source online judge. It brings problem practice, code submissions, judging, contests, editorials and community into a platform with a separate administration interface.</p>
        <div class="table-scroll"><table><thead><tr><th scope="col">For</th><th scope="col">Documented capabilities</th><th scope="col">What to establish in a pilot</th></tr></thead><tbody>
          <tr><th scope="row">Administrators</th><td>Manage problems, contests, users, moderation, audit records, settings and operational queries.</td><td>Required roles, approval procedures, content ownership and responsibility for ongoing operations.</td></tr>
          <tr><th scope="row">Instructors</th><td>Organize problems and contests, publish editorials, and inspect submission and judging records.</td><td>How existing course activities map to the available workflow. Gradebook and learning-management-system integration are not promised here.</td></tr>
          <tr><th scope="row">Students</th><td>Browse problems, submit code, review verdicts and participate in available community and notification features.</td><td>Browser access, supported runtime requirements, accessibility needs and the institution’s rules for submitted code.</td></tr>
          <tr><th scope="row">Operators</th><td>Use repository runbooks for startup, migrations, health checks, backups and recovery.</td><td>Hosting capacity, isolation, monitoring, recovery evidence and an accountable support owner.</td></tr>
        </tbody></table></div>
      </section>
      <section aria-labelledby="product-evidence"><h2 id="product-evidence">Look at the actual interfaces</h2>
        <p>The showcase includes repository screenshots of problem detail, contests, submissions, the management dashboard, user management and the forum. These are design and regression references, not evidence of a production rollout.</p>
        <p><a class="button primary" href="/showcase/">Explore the interface showcase</a></p>
      </section>
      <section aria-labelledby="product-boundaries"><h2 id="product-boundaries">Read the boundaries before adopting</h2>
        <ul class="check-list">
          <li><strong>You operate the deployment.</strong> The repository supplies code, configuration and verification paths; it does not supply a hosted service or establish production capacity.</li>
          <li><strong>Identity needs a fit check.</strong> Account, session, OAuth and role controls are documented. An institution-specific SAML, SCIM or single-sign-on integration requires separate verification.</li>
          <li><strong>Availability depends on the deployment.</strong> Active-active production operation, transparent failover and production recovery targets are not established project claims.</li>
          <li><strong>Learning assistance is optional.</strong> The separate Agent service is not part of the default startup. Live model use requires runtime authorization and budget controls; external-provider, retention and student-consent requirements need review before enablement.</li>
        </ul>
        <p>Repository descriptions explain intended boundaries. Confirm behavior against the chosen revision, configuration and your own acceptance criteria.</p>
        <p><a class="text-link" href="/institutions/">Plan an institutional evaluation</a> · <a class="text-link" href="/deployment/">Review deployment responsibilities</a></p>
      </section>
      ${sourceNote([['Product source', 'docs/PRODUCT.md'], ['Public README', 'README.md'], ['Architecture source', 'docs/ARCHITECTURE.md']])}
    `,
  },
  {
    path: '/institutions/',
    title: 'Evaluate UltiCode with your institution’s requirements',
    description: 'A practical procurement checklist and pilot sequence for identity, student data, deployment, availability and support.',
    label: 'For institutions',
    body: `
      <section aria-labelledby="institution-answers"><h2 id="institution-answers">The questions to settle first</h2>
        <p>A useful pilot leaves IT, instructors and procurement with the same understanding of what can run, who operates it and which requirements still need work.</p>
        <div class="table-scroll"><table><thead><tr><th scope="col">Question</th><th scope="col">What the public project establishes</th><th scope="col">Your adoption decision</th></tr></thead><tbody>
          <tr><th scope="row">Who controls identity?</th><td>The platform has account, session, OAuth and authorization boundaries.</td><td>Validate required identity-provider integration, provisioning, role assignment and offboarding. Do not infer SAML or SCIM compatibility.</td></tr>
          <tr><th scope="row">Where does data go?</th><td>A self-hosted deployment uses databases, object storage, queues and derived search indexes. Optional Agent workflows have separate state and model-provider boundaries.</td><td>Choose hosting location, data classification, retention, access controls, subprocessors and any rules for external model use.</td></tr>
          <tr><th scope="row">Who is responsible for uptime?</th><td>The repository documents health checks, deployment and recovery procedures. It does not establish an operational service-level agreement.</td><td>Assign monitoring, incident response, maintenance windows and measured recovery objectives.</td></tr>
          <tr><th scope="row">How is submitted code isolated?</th><td>Judging runs in a sandbox. Production configuration requires an operator-owned remote or rootless Docker endpoint with TLS.</td><td>Review the threat model, network policy, runtime limits, host isolation and patching with your security team.</td></tr>
          <tr><th scope="row">What support is included?</th><td>Public Issues and pull requests provide project participation channels.</td><td>Assign an internal support owner. No response-time commitment or paid support agreement is offered by this website.</td></tr>
          <tr><th scope="row">What may we use and modify?</th><td>The repository is distributed under MIT.</td><td>Review third-party dependencies and the rights for any imported problem, test case, editorial or student content.</td></tr>
        </tbody></table></div>
      </section>
      <section aria-labelledby="pilot-sequence"><h2 id="pilot-sequence">A pilot with an exit decision</h2>
        <ol class="check-list">
          <li><strong>Define the scope.</strong> Choose a small teaching or practice workflow, an accountable sponsor and the operators. Record the data allowed in the pilot and the criteria for continuing.</li>
          <li><strong>Review the environment.</strong> Confirm identity, infrastructure, code-execution isolation, privacy and licensing requirements. Resolve gaps before using real student records.</li>
          <li><strong>Rehearse the workflow.</strong> Deploy an isolated environment, create authorized sample content, complete submissions and administration tasks, and verify monitoring and restore procedures.</li>
          <li><strong>Decide from evidence.</strong> Compare results with the agreed criteria, document remaining work and choose whether to expand, repeat or stop. Remove pilot data according to the agreed policy.</li>
        </ol>
        <p>Dates, cohort size and success thresholds belong to the institution’s pilot plan. No sample institution, adoption count or performance result is presented as a real case study.</p>
      </section>
      <section aria-labelledby="pilot-materials"><h2 id="pilot-materials">Bring the right material to the review</h2>
        <ul class="link-list"><li><a href="/security/">Security controls and their limits</a></li><li><a href="/deployment/">Deployment and operating responsibilities</a></li><li><a href="/licensing/">License and content rights</a></li><li><a href="/pricing/">Infrastructure and support costs to plan for</a></li></ul>
        <p><a class="button primary" href="/contact/">Start a pilot conversation</a></p>
        <p class="source-note">A pilot conversation uses the public project channel. It is not a booking, service agreement or guaranteed project response.</p>
      </section>
      ${sourceNote([['Product source', 'docs/PRODUCT.md'], ['Operations source', 'docs/OPERATIONS.md'], ['Authentication reference', 'docs/REFERENCE.md']])}
    `,
  },
  {
    path: '/deployment/',
    title: 'Choose a deployment you can operate',
    description: 'Understand prerequisites, data responsibilities, production boundaries, health checks and recovery before deploying UltiCode.',
    label: 'Deployment',
    body: `
      <section aria-labelledby="deployment-scope"><h2 id="deployment-scope">Self-hosting includes an operating responsibility</h2>
        <p>UltiCode provides a repository and documented deployment paths. Your institution supplies the environment, credentials, security policy, data authority and people who operate it.</p>
        <aside class="callout"><p><strong>Development startup is not production acceptance.</strong> The operations guide states that the repository has no production environment. Production configuration and disposable verification do not establish real traffic capacity, availability or successful institutional operation.</p></aside>
      </section>
      <section aria-labelledby="deployment-prerequisites"><h2 id="deployment-prerequisites">Prepare the documented development environment</h2>
        <p>The public quick start lists Docker Compose v2, mise, Node.js <code>^20.19.0 || &gt;=22.12.0</code>, pnpm 10+, PM2, curl, timeout and OpenSSL. Backend startup uses the repository Maven wrapper and mise-managed Zulu Java 17.</p>
        <p>The platform uses MySQL, Redis, Nacos, object storage and, for the full development mode, MeiliSearch. Object storage is a required dependency; the documented path does not provide a local-disk fallback. Credentials must be supplied through the documented configuration process.</p>
        <p>Use the repository startup entrypoints so preparation, migrations, manifests and readiness checks stay together. A Dev Container or Codespace installs dependencies and runs its default gate; it does not automatically start the full stack.</p>
        <p><a class="text-link" href="/get-started/">Follow the getting-started guide</a> · <a class="text-link" href="/docs/source/development/">Read the development source</a></p>
      </section>
      <section aria-labelledby="deployment-ownership"><h2 id="deployment-ownership">Assign these responsibilities</h2>
        <div class="table-scroll"><table><thead><tr><th scope="col">Area</th><th scope="col">Operator responsibility</th></tr></thead><tbody>
          <tr><th scope="row">Network and identity</th><td>HTTPS, DNS, certificates, identity-provider configuration and role policy. Internal database, queue, discovery and worker ports must not be exposed to the public internet.</td></tr>
          <tr><th scope="row">Code execution</th><td>A production remote or rootless Docker TLS endpoint, read-only client certificates, shared workspace, runtime limits and host isolation. Production Compose does not mount the Docker socket.</td></tr>
          <tr><th scope="row">Data and credentials</th><td>Storage location, least-privilege accounts, secret management, retention, content rights and applicable student-data requirements.</td></tr>
          <tr><th scope="row">Changes and incidents</th><td>A verified release input, migration authority, maintenance planning, monitoring, alert handling and an escalation owner.</td></tr>
          <tr><th scope="row">Capacity and recovery</th><td>Measure representative workload and restore time on the target environment. This website does not publish an unverified hardware minimum, concurrency figure, RPO or RTO.</td></tr>
        </tbody></table></div>
      </section>
      <section aria-labelledby="deployment-release"><h2 id="deployment-release">Release and recovery need their own review</h2>
        <p>The operations guide defines a complete release-manifest input, deployment preflight, ordered migrations, health checks and rollback descriptors. A partial health result is not a successful release. Keep the previous verified artifact and follow the compatibility requirements before restoring routes.</p>
        <p>Rollback does not mean downgrading the database schema. Full recovery must cover the control schema, all five data-owner schemas and required stored objects. The backup runbook documents encrypted archives and a restore drill into a disposable target; operators supply the key, retention policy and measured recovery evidence.</p>
        <p><a class="button primary" href="/docs/source/operations/">Read the deployment and recovery source</a></p>
      </section>
      ${sourceNote([['Public quick start', 'README.md'], ['Operations source', 'docs/OPERATIONS.md'], ['Architecture source', 'docs/ARCHITECTURE.md']])}
    `,
  },
  {
    path: '/security/',
    title: 'Review the controls and the remaining decisions',
    description: 'Documented authentication, authorization, code-execution and data boundaries, with explicit limits and safe security-reporting guidance.',
    label: 'Security',
    body: `
      <section aria-labelledby="security-position"><h2 id="security-position">Evidence for your security review</h2>
        <p>The public architecture and operations guides describe the controls below. They are implementation references for your assessment, not an independent audit, certification or guarantee about a deployment.</p>
        <p>No SOC 2, ISO 27001, legal-compliance certification, uptime commitment or production penetration-test result is claimed here. Your institution must assess the chosen revision and its own environment.</p>
      </section>
      <section aria-labelledby="security-identity"><h2 id="security-identity">Identity and browser sessions</h2>
        <ul class="check-list">
          <li><strong>Authorization is checked at the service.</strong> Unmatched HTTP routes are denied by default. Protected routes reject missing or invalid access tokens, and privileged administration routes require the documented roles.</li>
          <li><strong>Session tokens use HttpOnly cookies.</strong> Refresh credentials are stored as hashes and rotated through a conditional revoke-and-create operation. Production configuration requires secure cookies.</li>
          <li><strong>Unsafe browser requests require CSRF protection.</strong> Cookie-authenticated mutations, refresh and logout use a double-submit cookie and matching header.</li>
          <li><strong>Production access tokens use RS256 and JWKS.</strong> Resource services validate token claims and signatures using public keys; they do not share Auth’s private signing key.</li>
          <li><strong>WebSocket identity comes from the access cookie.</strong> Tokens in URLs, query parameters or client STOMP messages are not accepted as the identity source.</li>
        </ul>
        <aside class="callout"><p><strong>Revocation has a documented boundary.</strong> The current design has no immediate access-token blacklist writer. The documented access-token lifetime leaves a maximum residual window of 15 minutes for an existing valid token, with other account-state and authorization checks applying as described in the architecture guide. Do not promise instantaneous termination of every session.</p></aside>
        <p>OAuth support does not by itself establish compatibility with your identity provider, SAML, SCIM or provisioning process. Validate those requirements before adoption.</p>
      </section>
      <section aria-labelledby="security-execution"><h2 id="security-execution">Submitted code and internal access</h2>
        <p>The Judge worker executes submissions through the documented sandbox path. Production requires an operator-owned remote or rootless Docker endpoint with TLS, read-only client certificates, a shared workspace and a fixed seccomp policy. The development-only socket profile is not the production configuration.</p>
        <p>Internal access has additional boundaries: owner-scoped database access, deny-by-default Redis ACLs and authenticated service contracts. The gateway is not the sole authorization boundary. Operators still own network isolation, infrastructure hardening, runtime limits, patching and incident response.</p>
      </section>
      <section aria-labelledby="security-data"><h2 id="security-data">Data and optional model use</h2>
        <p>The self-hosting operator chooses data location and controls access, retention, backups and deletion policy. Self-hosting alone does not establish regulatory compliance.</p>
        <p>The optional Agent service keeps private conversation and workflow state separately from the business databases. Conversation history remains until the owner deletes it; saved learning plans have a separate lifecycle. Live model use and persistence have explicit deployment and authorization controls. Review external providers, per-run source-code consent, budgets and retention before enabling it for learners.</p>
        <p><a class="text-link" href="/docs/source/reference/">Read the authentication and Agent reference</a> · <a class="text-link" href="/deployment/">Review operator responsibilities</a></p>
      </section>
      <section aria-labelledby="security-report"><h2 id="security-report">Report a concern without exposing it</h2>
        <p>GitHub private vulnerability reporting was enabled and verified for the public repository on 22 October 2026. Use that channel to share a potential vulnerability privately with the repository’s maintainers.</p>
        <p><strong>Keep exploit details and unpublished vulnerabilities out of public Issues and this website’s ordinary enquiry form.</strong> Include only the information needed to explain and reproduce the concern, and remove credentials, student data and unrelated private material.</p>
        <p><a class="button primary" href="${repository}/security/advisories/new">Report a vulnerability privately on GitHub</a></p>
        <p class="source-note">GitHub sign-in may be required. Opening the link sends nothing until you submit the report. The project does not publish a security-response deadline. <a href="https://docs.github.com/en/code-security/how-tos/report-and-fix-vulnerabilities/report-privately">Read GitHub’s private reporting guidance</a> or <a href="${repository}/security">check the repository’s current security page</a>.</p>
      </section>
      ${sourceNote([['Security architecture', 'docs/ARCHITECTURE.md'], ['Authentication reference', 'docs/REFERENCE.md'], ['Operations source', 'docs/OPERATIONS.md']])}
    `,
  },
  {
    path: '/community/',
    title: 'Help improve an open-source online judge',
    description: 'Find the public repository, report a reproducible problem, propose an improvement or contribute code and documentation.',
    label: 'Community and contribution',
    body: `
      <section aria-labelledby="community-project"><h2 id="community-project">Start with the public project</h2>
        <p>UltiCode’s public repository is <a href="${repository}">DavidHLP/UltiCode</a>, maintained under the DavidHLP account and distributed under the MIT License. The repository is the place to inspect source, changes, Issues, pull requests and automated checks.</p>
        <p>Community participation is welcome. There is no published support-response guarantee or governing foundation claimed by this website.</p>
        <p><a class="button primary" href="${repository}">Explore the GitHub repository</a> · <a class="text-link" href="/licensing/">Read the license</a></p>
      </section>
      <section aria-labelledby="community-channel"><h2 id="community-channel">Choose the right kind of Issue</h2>
        <div class="table-scroll"><table><thead><tr><th scope="col">You need to</th><th scope="col">Include</th></tr></thead><tbody>
          <tr><th scope="row">Report a bug</th><td>The chosen revision, sanitized environment, reproduction steps, expected behavior, actual behavior and the smallest useful error excerpt.</td></tr>
          <tr><th scope="row">Ask for help</th><td>The task you are trying to complete, the documentation followed and what you already tried. Say that it is a usage or deployment question.</td></tr>
          <tr><th scope="row">Suggest a change</th><td>The user problem, affected workflow, proposed outcome and constraints. Discuss substantial scope before implementing it.</td></tr>
          <tr><th scope="row">Raise a security concern</th><td>Use the <a href="/security/#security-report">safe reporting guidance</a>. Keep vulnerabilities and private information out of public Issues.</td></tr>
        </tbody></table></div>
        <p>Search open and closed Issues first. GitHub Discussions is not enabled for this repository; Issues are the documented channel for questions and improvement proposals.</p>
        <p><a class="text-link" href="${repository}/issues">Search project Issues</a></p>
      </section>
      <section aria-labelledby="community-contribute"><h2 id="community-contribute">Make a contribution that can be reviewed</h2>
        <ol class="check-list">
          <li><strong>Understand the scope.</strong> Read the repository’s <a href="${snapshot}/AGENTS.md">contributor instructions</a>, relevant directory guidance and authoritative documentation. Discuss larger changes in an Issue.</li>
          <li><strong>Make a focused change.</strong> Follow existing conventions and preserve documented ownership, validation and security boundaries. Documentation fixes and clear reproductions are useful contributions too.</li>
          <li><strong>Verify the affected behavior.</strong> Follow the current development guide and run the matching repository checks. The README asks for behavior-change tests, <code>git diff --check</code> and the appropriate <code>./scripts/dev/test.sh</code> gate.</li>
          <li><strong>Explain the result.</strong> Open a pull request with the problem, final behavior, actual verification and known limits. Never include credentials, environment files, private keys, student records or generated runtime artifacts.</li>
        </ol>
        <p><a class="text-link" href="/docs/source/development/">Read the development guide</a> · <a class="text-link" href="${repository}/pulls">Browse pull requests</a></p>
      </section>
      <section aria-labelledby="community-direction"><h2 id="community-direction">Follow progress without assuming a promise</h2>
        <p>Issues describe problems and proposals; pull requests show work under review; merged source and verified releases show what shipped. A suggestion, open Issue or activity date is not a delivery commitment.</p>
        <p><a class="text-link" href="/updates/">Review project updates and release status</a></p>
      </section>
      ${sourceNote([['Contribution instructions', 'README.md'], ['Repository guidance', 'AGENTS.md'], ['Development source', 'docs/DEVELOPMENT.md']])}
    `,
  },
  {
    path: '/licensing/',
    title: 'Use the code with a clear view of the license',
    description: 'Read the UltiCode MIT License and distinguish project source from third-party dependencies, problem content and student work.',
    label: 'Licensing',
    body: `
      <section aria-labelledby="license-summary"><h2 id="license-summary">The repository is MIT licensed</h2>
        <p>The MIT License permits use, modification and distribution, including commercial use, subject to retaining the copyright and permission notice in copies or substantial portions of the software. The source is provided without warranty under the terms below.</p>
        <p><a class="text-link" href="${snapshot}/LICENSE">Read the license in the pinned source</a> · <a class="text-link" href="${repository}/blob/main/LICENSE">Check the current repository license</a></p>
      </section>
      <section aria-labelledby="license-text"><h2 id="license-text">MIT License</h2>
        <pre class="license-text">Copyright (c) 2026 UltiCode

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.</pre>
      </section>
      <section aria-labelledby="license-materials"><h2 id="license-materials">Review the materials you add</h2>
        <ul class="check-list">
          <li><strong>Dependencies keep their own terms.</strong> Review third-party packages, runtime images, fonts and other bundled assets for the distribution you intend to operate or redistribute.</li>
          <li><strong>Problem content needs its own permission.</strong> A code license does not establish rights to every problem statement, test case, editorial or dataset you import.</li>
          <li><strong>Student work remains a separate concern.</strong> Establish submission, retention, access and reuse policies before collecting learners’ code.</li>
          <li><strong>Public text is not automatic model consent.</strong> The architecture guide requires owned or explicitly authorized material for any future real retrieval corpus; public editorials do not automatically carry permission for model transmission or corpus reuse.</li>
        </ul>
        <p>This page identifies review areas and reproduces the repository license. It does not replace your institution’s legal or procurement review.</p>
      </section>
      ${sourceNote([['License text', 'LICENSE'], ['Architecture and corpus boundary', 'docs/ARCHITECTURE.md']])}
    `,
  },
  {
    path: '/pricing/',
    title: 'Plan the cost of self-hosting',
    description: 'UltiCode source is MIT licensed. Understand the infrastructure, staff, security and optional model costs of operating it.',
    label: 'Cost and availability',
    body: `
      <section aria-labelledby="pricing-source"><h2 id="pricing-source">Source code is available under MIT</h2>
        <p>You can obtain UltiCode’s public source without purchasing a software subscription from this website. Usage and distribution remain subject to the <a href="/licensing/">MIT License</a> and any applicable third-party or content terms.</p>
        <p>This website does not offer a managed hosting plan, paid support tier, service-level agreement or procurement contract. No price, discount, free-service allowance or commercial commitment is implied.</p>
        <p><a class="button primary" href="${repository}">Get the source on GitHub</a></p>
      </section>
      <section aria-labelledby="pricing-budget"><h2 id="pricing-budget">Budget for the service you will operate</h2>
        <div class="table-scroll"><table><thead><tr><th scope="col">Cost area</th><th scope="col">What to include in your estimate</th></tr></thead><tbody>
          <tr><th scope="row">Infrastructure</th><td>Application services, isolated judging capacity, databases, object storage, queues, search, networking, backups and monitoring.</td></tr>
          <tr><th scope="row">Operations</th><td>Deployment, upgrades, certificate and secret rotation, recovery rehearsals, incident response and ongoing support.</td></tr>
          <tr><th scope="row">Institutional review</th><td>Security, privacy, accessibility, content licensing, identity integration and any required local changes.</td></tr>
          <tr><th scope="row">Optional model services</th><td>Only if enabled: provider charges, per-run limits, budget controls and review of external data processing.</td></tr>
        </tbody></table></div>
        <p>Estimate from your expected workload and measured pilot results. The project does not publish a verified per-student price, concurrency allowance or minimum production hardware size here.</p>
        <p><a class="text-link" href="/institutions/">Plan a bounded pilot</a> · <a class="text-link" href="/deployment/">Review operating responsibilities</a></p>
      </section>
      ${sourceNote([['MIT License', 'LICENSE'], ['Product boundary', 'docs/PRODUCT.md'], ['Operations source', 'docs/OPERATIONS.md']])}
    `,
  },
  {
    path: '/contact/',
    title: 'Start with a clear, public project conversation',
    description: 'Use the verified GitHub project channel for adoption questions, help and proposals while keeping sensitive information private.',
    label: 'Contact',
    body: `
      <section aria-labelledby="contact-channel"><h2 id="contact-channel">Reach the project through GitHub Issues</h2>
        <p>The public repository documents Issues as the channel for questions, problem reports and improvement discussions. An Issue reaches the project’s real public tracker; it does not establish an email help desk, a support contract or a response deadline.</p>
        <p><a class="button primary" href="${repository}/issues">Browse existing Issues</a></p>
      </section>
      <section aria-labelledby="contact-pilot"><h2 id="contact-pilot">Describe an institutional evaluation</h2>
        <p>For a pilot conversation, briefly describe the intended teaching or practice workflow, whether you expect to self-host, and the deployment or identity questions that need an answer. Share only information appropriate for a public repository.</p>
        <p><a class="button primary" href="${repository}/issues/new?title=Institutional%20evaluation%20question&amp;body=Intended%20workflow%3A%20%0ASelf-hosting%20plan%3A%20%0AQuestions%20to%20resolve%3A%20%0A%0AThis%20is%20a%20public%20Issue.%20Please%20do%20not%20include%20personal%20data%2C%20credentials%20or%20confidential%20material.">Draft an evaluation question on GitHub</a></p>
        <p class="source-note">The link opens an editable draft on GitHub. It sends nothing until you publish the Issue. GitHub sign-in may be required. A draft does not reserve a pilot or create a service agreement.</p>
        <div id="contact-form-slot"></div>
      </section>
      <section aria-labelledby="contact-private"><h2 id="contact-private">Keep private material out of the public tracker</h2>
        <p>Do not include student records, private code, credentials, environment-file contents, confidential procurement material or complete logs. For a deployment problem, provide sanitized details and the smallest useful reproduction.</p>
        <p>For a potential vulnerability, use the <a href="${repository}/security/advisories/new">private GitHub vulnerability-reporting channel</a>. Keep vulnerability details out of public Issues and this website’s ordinary enquiry form. <a href="/security/#security-report">Read the reporting guidance</a> before sharing details.</p>
        <p>If you follow a GitHub link, any information you submit there is handled by GitHub and the public repository’s participants. Review where your message will be delivered before sending it.</p>
        <p><a class="text-link" href="/privacy/">Read this website’s privacy information</a> · <a class="text-link" href="/community/">Find help and contribution guidance</a></p>
      </section>
      ${sourceNote([['Documented contact and contribution channel', 'README.md']])}
    `,
  },
];
