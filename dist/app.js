const root = document.documentElement;
const themeButton = document.getElementById('theme-toggle');
const themeLabel = document.getElementById('theme-label');
const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)');

function updateThemeLabel() {
  const dark = root.dataset.theme ? root.dataset.theme === 'dark' : preferredTheme.matches;
  themeLabel.textContent = dark ? 'Light mode' : 'Dark mode';
  themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} mode`);
}

themeButton.hidden = false;
updateThemeLabel();
preferredTheme.addEventListener('change', updateThemeLabel);
themeButton.addEventListener('click', () => {
  const dark = root.dataset.theme ? root.dataset.theme === 'dark' : preferredTheme.matches;
  root.dataset.theme = dark ? 'light' : 'dark';
  updateThemeLabel();
});

const runButton = document.getElementById('run-sample');
runButton.hidden = false;
runButton.addEventListener('click', () => {
  document.getElementById('sample-verdict').classList.add('is-complete');
  document.getElementById('verdict-icon').textContent = '✓';
  document.getElementById('verdict-title').textContent = 'Accepted · sample result';
  document.getElementById('verdict-detail').textContent = 'Input: 2 3 → Output: 5. Illustration only; no code executed.';
  runButton.textContent = '↻ Run again';
});

function connectDialog(buttonId, dialogId) {
  const button = document.getElementById(buttonId);
  const dialog = document.getElementById(dialogId);
  button.hidden = false;
  button.addEventListener('click', () => dialog.showModal());
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
}

connectDialog('pilot-open', 'pilot-dialog');
connectDialog('resource-open', 'resource-dialog');

const copyButton = document.getElementById('copy-pilot');
copyButton.hidden = false;
copyButton.addEventListener('click', async () => {
  const status = document.getElementById('copy-status');
  const questions = [...document.querySelectorAll('#pilot-dialog .pilot-checklist li')].map(item => `• ${item.textContent}`).join('\n');
  try {
    await navigator.clipboard.writeText(`UltiCode pilot planning checklist\n\n${questions}\n\nPlanning only. Availability and terms are not confirmed.`);
    status.textContent = 'Checklist copied. Share it with your pilot team.';
  } catch {
    status.textContent = 'Copy is unavailable in this browser. Select and copy the questions above.';
  }
});
