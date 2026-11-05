const PASSWORD_SHA256 = 'f16ba757861b8f2bf1a99438dcf7a080869ef9a4ab9f52517e4f890c1892794d';
const $ = (id) => document.getElementById(id);

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function setMetric(id, value) { $(id).textContent = value ?? '—'; }
function renderRanked(id, rows) {
  const list = $(id);
  list.replaceChildren(...(rows?.length ? rows : [{label: 'Nessun dato disponibile.', value: ''}]).map((row) => {
    const item = document.createElement('li');
    item.textContent = row.value ? `${row.label} — ${row.value}` : row.label;
    return item;
  }));
}
function render(data) {
  setMetric('today-pv', data.summary?.todayPv);
  setMetric('yesterday-pv', data.summary?.yesterdayPv);
  setMetric('week-pv', data.summary?.weekPv);
  setMetric('month-pv', data.summary?.monthPv);
  renderRanked('pages', data.pages);
  if (data.daily?.length) {
    $('daily-chart').classList.remove('empty');
    $('daily-chart').textContent = data.daily.map((row) => `${row.date}: ${row.pv}`).join('  ·  ');
  }
  if (data.notice) { $('notice').textContent = data.notice; $('notice').hidden = false; }
}

async function loadData() {
  const response = await fetch('data.json', { cache: 'no-store' });
  if (!response.ok) throw new Error('data.json non disponibile');
  render(await response.json());
}

if (sessionStorage.getItem('luxureat-monitor-auth') === '1') { $('login').hidden = true; $('dashboard').hidden = false; loadData().catch(() => {}); }
$('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const valid = (await sha256($('password').value)) === PASSWORD_SHA256;
  if (!valid) { $('login-error').hidden = false; return; }
  sessionStorage.setItem('luxureat-monitor-auth', '1');
  $('login').hidden = true; $('dashboard').hidden = false; loadData().catch(() => {});
});
