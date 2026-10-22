const root = document.documentElement;
const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)');
const themeButton = document.getElementById('theme-toggle');
const themeLabel = document.getElementById('theme-label');

function stored(key, value) {
  try {
    if (value === undefined) return localStorage.getItem(key);
    localStorage.setItem(key, value);
  } catch { /* Restricted storage leaves preferences in this page only. */ }
  return null;
}

const savedTheme = stored('ulticode-theme');
if (savedTheme === 'dark' || savedTheme === 'light') root.dataset.theme = savedTheme;

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
  stored('ulticode-theme', root.dataset.theme);
  updateThemeLabel();
});

document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
});

const runButton = document.getElementById('run-sample');
if (runButton) {
  runButton.hidden = false;
  runButton.addEventListener('click', () => {
    document.getElementById('sample-verdict').classList.add('is-complete');
    document.getElementById('verdict-icon').textContent = '✓';
    document.getElementById('verdict-title').textContent = 'Accepted · sample result';
    document.getElementById('verdict-detail').textContent = 'Input: 2 3 → Output: 5. Illustration only; no code executed.';
    runButton.textContent = '↻ Run again';
  });
}

async function copyText(text, status) {
  try {
    await navigator.clipboard.writeText(text);
    status.textContent = 'Copied to clipboard.';
  } catch {
    status.textContent = 'Copy is unavailable. Select and copy the text directly.';
  }
}

const pilotButton = document.getElementById('pilot-open');
if (pilotButton) {
  pilotButton.hidden = false;
  pilotButton.addEventListener('click', () => {
    document.getElementById('pilot-dialog').showModal();
    track('pilot_open');
  });
  const copyButton = document.getElementById('copy-pilot');
  copyButton.hidden = false;
  copyButton.addEventListener('click', () => {
    const questions = [...document.querySelectorAll('#pilot-dialog .pilot-checklist li')].map(item => `• ${item.textContent}`).join('\n');
    copyText(`UltiCode pilot planning checklist\n\n${questions}\n\nPlanning only. Availability and terms are not confirmed.`, document.getElementById('copy-status'));
  });
}

document.querySelectorAll('.prose pre').forEach(pre => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'code-copy';
  button.textContent = 'Copy';
  button.setAttribute('aria-label', 'Copy code or source text');
  const status = document.createElement('span');
  status.className = 'code-copy-status';
  status.setAttribute('role', 'status');
  const text = pre.textContent;
  button.addEventListener('click', () => copyText(text, status));
  pre.append(button, status);
});

const searchDialog = document.getElementById('search-dialog');
const searchInput = document.getElementById('site-search');
const searchResults = document.getElementById('search-results');
const searchCount = document.getElementById('search-count');
let searchIndex;
let searchRequest;
async function showSearch() {
  searchDialog.showModal();
  searchInput.focus();
  if (!searchRequest) {
    searchRequest = fetch('/search-index.json').then(response => {
      if (!response.ok) throw new Error('Search index unavailable');
      return response.json();
    }).then(data => { searchIndex = data; }).catch(() => {
      searchRequest = undefined;
      searchCount.textContent = 'Search could not load. Browse the documentation or try opening search again.';
    });
  }
  await searchRequest;
  if (searchIndex) renderSearch();
}
document.querySelectorAll('[data-search-open]').forEach(button => {
  button.hidden = false;
  button.addEventListener('click', showSearch);
});
document.addEventListener('keydown', event => {
  const target = event.target;
  const editing = target instanceof Element && (target.matches('input,textarea,select') || target.isContentEditable);
  if (!editing && !document.querySelector('dialog[open]') && (event.key === '/' || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k'))) {
    event.preventDefault();
    showSearch();
  }
});
function renderSearch() {
  const query = searchInput.value.normalize('NFKC').toLowerCase().trim();
  searchResults.replaceChildren();
  if (!query) {
    searchCount.textContent = 'Search English guides or the original Chinese source documentation. Press Escape to close.';
    return;
  }
  const words = query.split(/\s+/);
  const matches = searchIndex.map(entry => {
    const title = entry.title.normalize('NFKC').toLowerCase();
    const haystack = `${title} ${entry.section} ${entry.text}`.normalize('NFKC').toLowerCase();
    return {...entry, score:words.every(word => haystack.includes(word)) ? words.reduce((sum,word) => sum + (title.includes(word) ? 5 : 1), 0) : 0};
  }).filter(entry => entry.score).sort((a,b) => b.score-a.score).slice(0,20);
  searchCount.textContent = matches.length ? `${matches.length} results shown. Queries stay in this browser.` : 'No matches. Try a shorter phrase, another language, or browse the documentation.';
  matches.forEach(entry => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = entry.path;
    link.textContent = entry.title;
    const section = document.createElement('span');
    section.className = 'search-section';
    section.textContent = entry.section;
    const excerpt = document.createElement('p');
    const index = entry.text.toLowerCase().indexOf(words[0]);
    const start = Math.max(0, index-50);
    excerpt.textContent = `${start ? '…' : ''}${entry.text.slice(start,start+190)}…`;
    li.append(section,link,excerpt);
    searchResults.append(li);
  });
}
searchInput.addEventListener('input', () => { if (searchIndex) renderSearch(); });
searchInput.addEventListener('keydown', event => {
  if (event.key === 'Escape') { event.preventDefault(); searchDialog.close(); }
});

let analyticsChoice = stored('ulticode-analytics') || 'off';
const privacyDialog = document.getElementById('privacy-dialog');
function updateAnalyticsChoice() {
  document.getElementById('analytics-choice').textContent = navigator.globalPrivacyControl ? 'Global Privacy Control is enabled. Analytics stay off.' : analyticsChoice === 'on' ? 'Aggregate click counts are enabled in this browser.' : 'Analytics are off in this browser.';
}
document.querySelectorAll('[data-privacy-open]').forEach(button => {
  button.hidden = false;
  button.addEventListener('click', () => { updateAnalyticsChoice(); privacyDialog.showModal(); });
});
document.getElementById('analytics-allow').addEventListener('click', () => {
  analyticsChoice = navigator.globalPrivacyControl ? 'off' : 'on';
  stored('ulticode-analytics', analyticsChoice);
  updateAnalyticsChoice();
});
document.getElementById('analytics-decline').addEventListener('click', () => {
  analyticsChoice = 'off';
  stored('ulticode-analytics', 'off');
  updateAnalyticsChoice();
});
function track(event) {
  if (analyticsChoice !== 'on' || navigator.globalPrivacyControl) return;
  fetch('/api/analytics/', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event,consent:true}),keepalive:true}).catch(() => {});
}
document.addEventListener('click', event => {
  const target = event.target instanceof Element ? event.target.closest('[data-track]') : null;
  if (target) track(target.dataset.track);
});

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const status = document.getElementById('contact-status');
  const retry = document.getElementById('contact-retry');
  const formButton = contactForm.querySelector('button[type=submit]');
  const topic = new URLSearchParams(location.search).get('topic');
  if (['pilot','deployment','support','contribution'].includes(topic)) contactForm.elements.topic.value = topic;
  async function loadEnquiries({preserveStatus = false} = {}) {
    try {
      const response = await fetch('/api/contact/', {cache:'no-store'});
      if (response.status === 401) {
        contactForm.hidden = true;
        document.getElementById('your-enquiries').hidden = true;
        document.getElementById('contact-auth').hidden = false;
        return;
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Enquiries are temporarily unavailable.');
      retry.hidden = true;
      document.getElementById('contact-auth').hidden = true;
      contactForm.hidden = false;
      if (!contactForm.elements.name.value) contactForm.elements.name.value = data.identity.name;
      if (!contactForm.elements.email.value) contactForm.elements.email.value = data.identity.email;
      const list = document.getElementById('enquiry-list');
      list.replaceChildren();
      document.getElementById('your-enquiries').hidden = false;
      if (!data.enquiries.length) {
        const empty = document.createElement('p');
        empty.textContent = 'No saved enquiries for this account.';
        list.append(empty);
      }
      data.enquiries.forEach(enquiry => {
        const article = document.createElement('article');
        article.className = 'enquiry';
        const heading = document.createElement('h4');
        heading.textContent = `${enquiry.topic} · ${enquiry.createdAt}`;
        const message = document.createElement('p');
        message.textContent = enquiry.message;
        const receipt = document.createElement('p');
        receipt.className = 'enquiry-receipt';
        receipt.textContent = `Reference: ${enquiry.id}`;
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'text-link';
        remove.textContent = 'Delete enquiry';
        remove.addEventListener('click', async () => {
          if (!window.confirm('Permanently delete this enquiry from the application database?')) return;
          remove.disabled = true;
          try {
            const deletion = await fetch(`/api/contact/?id=${encodeURIComponent(enquiry.id)}`, {method:'DELETE'});
            const result = await deletion.json();
            if (!deletion.ok) throw new Error(result.error || 'The enquiry could not be deleted.');
            status.textContent = 'Enquiry deleted from the application database.';
            await loadEnquiries({preserveStatus:true});
            status.tabIndex = -1;
            status.focus();
          } catch (error) { status.textContent = error.message; remove.disabled = false; }
        });
        article.append(heading,message,receipt,remove);
        list.append(article);
      });
    } catch (error) {
      const warning = error.message || 'The enquiry history is temporarily unavailable.';
      status.textContent = preserveStatus ? `${status.textContent} History could not refresh: ${warning}` : warning;
      retry.hidden = false;
    }
  }
  retry.addEventListener('click', () => loadEnquiries({preserveStatus:true}));
  contactForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    formButton.disabled = true;
    status.textContent = 'Saving your enquiry…';
    const values = new FormData(contactForm);
    const payload = Object.fromEntries(values);
    payload.consent = values.has('consent');
    let receivedResponse = false;
    try {
      const response = await fetch('/api/contact/', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const result = await response.json();
      receivedResponse = true;
      if (response.status === 401) {
        const auth = document.getElementById('contact-auth');
        auth.hidden = false;
        auth.querySelector('a').target = '_blank';
        auth.querySelector('a').rel = 'noopener';
        throw new Error('Your session expired. Your draft remains here. Sign in in a new tab, then return and send it again.');
      }
      if (!response.ok) throw new Error(result.error || 'The enquiry could not be saved.');
      status.textContent = `Enquiry saved for the site owner. Reference: ${result.id}. No automatic email has been sent.`;
      contactForm.elements.message.value = '';
      contactForm.elements.consent.checked = false;
      track('contact_saved');
      await loadEnquiries({preserveStatus:true});
    } catch (error) {
      status.textContent = receivedResponse ? error.message : 'The save could not be confirmed. Refresh saved enquiries before sending again to avoid a duplicate.';
      retry.hidden = false;
    }
    finally { formButton.disabled = false; }
  });
  loadEnquiries();
}
