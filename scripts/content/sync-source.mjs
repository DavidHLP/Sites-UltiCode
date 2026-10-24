import { mkdir, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const REPOSITORY = 'DavidHLP/UltiCode';
const SOURCE_COMMIT = 'ec4e9b135ac1404348e0b57d58b5b745301f7d5f';
const SCREENSHOT_COMMIT = '7d0eca225ce448d497bcb69af3a2e45ab0e9d1ba';
const SOURCE_URL = `https://github.com/${REPOSITORY}`;
const API_URL = `https://api.github.com/repos/${REPOSITORY}`;
const RAW_URL = `https://raw.githubusercontent.com/${REPOSITORY}/${SOURCE_COMMIT}`;
const SCREENSHOT_RAW_URL = `https://raw.githubusercontent.com/${REPOSITORY}/${SCREENSHOT_COMMIT}`;
const DOCUMENTS = [
  'README.md', 'README.zh-CN.md', 'LICENSE', 'docs/index.md',
  'docs/PRODUCT.md', 'docs/ARCHITECTURE.md', 'docs/DEVELOPMENT.md',
  'docs/OPERATIONS.md', 'docs/REFERENCE.md', 'assets/screenshots/README.md',
];
// These public design/regression references are examples, not customer evidence.
const SCREENSHOTS = [
  ['problem-detail-dark.png', 'Solve a problem', 'Sample problem statement beside a C++ code editor and test-case panel, in dark mode'],
  ['problem-set-dark.png', 'Browse the problem library', 'Sample problem library with collections, filters and problem rows, in dark mode'],
  ['contests-dark.png', 'Find a contest', 'Sample contest listings, virtual-contest links and rankings, in dark mode'],
  ['submissions-list-dark.png', 'Review submissions', 'Sample submissions with verdicts, language and run details, in dark mode'],
  ['admin-dashboard-dark.png', 'Manage the platform', 'Sample administration dashboard with example activity numbers, in dark mode'],
  ['user-management-dark.png', 'Manage users', 'Sample user administration with example accounts, in dark mode'],
  ['contest-management-dark.png', 'Organize contests', 'Sample contest administration with example events and participation numbers, in dark mode'],
  ['forum-list-light.png', 'Share a discussion', 'Sample community discussion listings, in light mode'],
];

async function download(url, maxBytes = 2_000_000) {
  const response = await fetch(url, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'UltiCode-website-source-sync' },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`Source request failed: ${response.status} ${url}`);
  if (Number(response.headers.get('content-length')) > maxBytes) {
    await response.body?.cancel();
    throw new Error(`Source exceeds ${maxBytes} bytes: ${url}`);
  }
  const reader = response.body.getReader();
  const chunks = [];
  let bytes = 0;
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    bytes += chunk.value.length;
    if (bytes > maxBytes) {
      await reader.cancel();
      throw new Error(`Source exceeds ${maxBytes} bytes: ${url}`);
    }
    chunks.push(chunk.value);
  }
  if (!bytes) throw new Error(`Source is empty: ${url}`);
  return Buffer.concat(chunks);
}

async function json(path) {
  return JSON.parse((await download(`${API_URL}${path}`)).toString('utf8'));
}

async function atomicWrite(path, data) {
  await mkdir(dirname(path), { recursive: true });
  const temporary = `${path}.${process.pid}.tmp`;
  try {
    await writeFile(temporary, data, { flag: 'wx' });
    await rename(temporary, path);
  } finally {
    await rm(temporary, { force: true });
  }
}

async function sync() {
  // Fetch and validate everything before replacing any existing snapshot files.
  const [repository, source, releases, commits, documents, screenshots] = await Promise.all([
    json(''), json(`/commits/${SOURCE_COMMIT}`), json('/releases?per_page=6'),
    json(`/commits?sha=${SOURCE_COMMIT}&per_page=6`),
    Promise.all(DOCUMENTS.map(async path => ({ path, data: await download(`${path === 'assets/screenshots/README.md' ? SCREENSHOT_RAW_URL : RAW_URL}/${path}`) }))),
    Promise.all(SCREENSHOTS.map(async ([filename, title, alt]) => {
      const data = await download(`${SCREENSHOT_RAW_URL}/assets/screenshots/${filename}`);
      if (data.length < 24 || !data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
        throw new Error(`Invalid PNG: ${filename}`);
      }
      const width = data.readUInt32BE(16);
      const height = data.readUInt32BE(20);
      if (width !== 1496 || height !== 933) throw new Error(`Unexpected image size: ${filename} (${width} × ${height})`);
      return { filename, title, alt, width, height, data };
    })),
  ]);
  if (repository.full_name !== REPOSITORY || source.sha !== SOURCE_COMMIT || !repository.default_branch ||
      !source.commit?.committer?.date || !Array.isArray(releases) || !Array.isArray(commits) || !commits.length) {
    throw new Error('GitHub returned an incomplete source snapshot; existing files were preserved.');
  }
  if (repository.license?.spdx_id !== 'MIT' || !documents.find(doc => doc.path === 'LICENSE').data.toString('utf8').includes('MIT License')) {
    throw new Error('Source license changed; review the website license text before updating.');
  }
  const snapshot = {
    repository: REPOSITORY,
    description: repository.description,
    defaultBranch: repository.default_branch,
    license: repository.license.spdx_id,
    sourceCommit: SOURCE_COMMIT,
    screenshotSourceCommit: SCREENSHOT_COMMIT,
    sourceUrl: `${SOURCE_URL}/tree/${SOURCE_COMMIT}`,
    sourceDate: source.commit.committer.date,
    checkedAt: new Date().toISOString(),
    archived: repository.archived,
    discussionsEnabled: repository.has_discussions,
    releases: releases.filter(release => !release.draft).map(release => ({
      tag: release.tag_name, name: release.name || release.tag_name,
      date: release.published_at, url: release.html_url, prerelease: release.prerelease,
    })),
    // This feed ends at the pinned documentation revision, so the pages stay consistent.
    commits: commits.map(commit => ({
      sha: commit.sha, title: commit.commit.message.split('\n')[0],
      date: commit.commit.committer.date, url: commit.html_url,
    })),
    documents: documents.map(({ path, data }) => ({ path, bytes: data.length })),
    screenshots: screenshots.map(({ data, ...metadata }) => metadata),
  };
  for (const { path, data } of documents) await atomicWrite(join(ROOT, 'content/upstream', path), data);
  for (const { filename, data } of screenshots) await atomicWrite(join(ROOT, 'public/assets/screenshots', filename), data);
  await atomicWrite(join(ROOT, 'content/upstream.json'), `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`Updated public documents at ${SOURCE_COMMIT} and ${screenshots.length} screenshots plus their index at ${SCREENSHOT_COMMIT} from ${REPOSITORY}.`);
  console.log(`${snapshot.releases.length} public releases; ${snapshot.commits.length} commits through ${snapshot.sourceDate}.`);
}

sync().catch(error => {
  console.error(`Source synchronization failed: ${error.message}`);
  process.exitCode = 1;
});
