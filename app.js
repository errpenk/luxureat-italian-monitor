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
  renderChart(data.daily, data.summary);
  document.querySelectorAll('[data-chart-range]').forEach((tab) => tab.addEventListener('click', () => {
    document.querySelectorAll('[data-chart-range]').forEach((item) => item.classList.toggle('is-active', item === tab));
    const rows = tab.dataset.chartRange === 'summary'
      ? [{date: 'Oggi', pv: data.summary?.todayPv}, {date: 'Settimana', pv: data.summary?.weekPv}, {date: 'Mese', pv: data.summary?.monthPv}]
      : data.daily;
    renderChart(rows, data.summary);
  }));
}

function renderChart(daily, summary) {
  const chart = $('daily-chart');
  const rows = daily?.length ? daily : [{date: 'Oggi', pv: summary?.todayPv || 0}];
  const max = Math.max(...rows.map((row) => Number(row.pv) || 0), 1);
  chart.replaceChildren(...rows.map((row) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chart-bar';
    button.style.setProperty('--bar-size', `${Math.max(8, ((Number(row.pv) || 0) / max) * 100)}%`);
    button.innerHTML = `<span class="bar-value">${row.pv}</span><span class="bar-fill"></span><span class="bar-label">${row.date}</span>`;
    button.addEventListener('click', () => { $('chart-detail').textContent = `${row.date}: ${row.pv} visite`; });
    return button;
  }));
  $('chart-detail').textContent = `${rows[0].date}: ${rows[0].pv} visite`;
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
