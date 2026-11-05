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
  renderLineChart('daily-chart', data.dailySeries, '24 ore');
  renderLineChart('weekly-chart', data.weeklySeries, '7 giorni');
}

function renderLineChart(id, series, label) {
  const chart = $(id);
  const width = 1000;
  const height = 330;
  const pad = {left: 52, right: 24, top: 42, bottom: 44};
  const points = series?.[0]?.values?.length || 1;
  const max = Math.max(...(series || []).flatMap((item) => item.values), 1);
  const x = (index) => pad.left + (index * (width - pad.left - pad.right)) / Math.max(points - 1, 1);
  const y = (value) => height - pad.bottom - (value * (height - pad.top - pad.bottom)) / max;
  const linePath = (values) => values.map((value, index) => {
    const currentX = x(index), currentY = y(value);
    if (!index) return `M ${currentX} ${currentY}`;
    const previousX = x(index - 1), previousY = y(values[index - 1]);
    const control = (currentX - previousX) / 2;
    return `C ${previousX + control} ${previousY}, ${currentX - control} ${currentY}, ${currentX} ${currentY}`;
  }).join(' ');
  const grid = [0, .25, .5, .75, 1].map((ratio) => `<line x1="${pad.left}" x2="${width - pad.right}" y1="${y(max * ratio)}" y2="${y(max * ratio)}" class="chart-grid"/><text x="${pad.left - 10}" y="${y(max * ratio) + 5}" text-anchor="end" class="chart-axis">${Math.round(max * ratio)}</text>`).join('');
  const paths = (series || []).map((item) => `<path d="${linePath(item.values)}" class="chart-line" style="--series-color:${item.color}"/>`).join('');
  const dots = (series || []).flatMap((item) => item.values.map((value, index) => `<circle cx="${x(index)}" cy="${y(value)}" r="5" class="chart-dot" style="--series-color:${item.color}" data-label="${item.label}" data-index="${index}" data-value="${value}"/>`)).join('');
  const labels = (series?.[0]?.labels || []).map((item, index) => `<text x="${x(index)}" y="${height - 14}" text-anchor="middle" class="chart-axis">${item}</text>`).join('');
  const legend = (series || []).map((item) => `<span><i style="background:${item.color}"></i>${item.label}</span>`).join('');
  const summary = (series || []).map((item) => `<span><i style="border-color:${item.color}"></i>${item.label} PV ${item.values.reduce((total, value) => total + Number(value || 0), 0)}</span>`).join('');
  chart.innerHTML = `<div class="chart-caption"><strong>${label}</strong><span>${legend}</span></div><div class="chart-canvas"><svg viewBox="0 0 ${width} ${height}" role="img"><rect class="chart-hit-area" x="${pad.left}" y="${pad.top}" width="${width - pad.left - pad.right}" height="${height - pad.top - pad.bottom}"/>${grid}<line class="chart-hover-line" x1="0" x2="0" y1="${pad.top}" y2="${height - pad.bottom}" hidden/>${paths}${dots}${labels}</svg><div class="chart-tooltip" hidden></div></div><div class="chart-summary">${summary}</div>`;
  const tooltip = chart.querySelector('.chart-tooltip');
  const hoverLine = chart.querySelector('.chart-hover-line');
  const svg = chart.querySelector('svg');
  const show = (event) => {
    const rect = svg.getBoundingClientRect();
    const index = Math.max(0, Math.min(points - 1, Math.round(((event.clientX - rect.left) / rect.width) * (points - 1))));
    const values = (series || []).map((item) => `<div><i style="background:${item.color}"></i>${item.label}: ${item.values[index] ?? 0} PV</div>`).join('');
    tooltip.innerHTML = `<strong>${series?.[0]?.labels?.[index] || ''}</strong>${values}`;
    tooltip.hidden = false;
    tooltip.style.left = `${Math.max(14, Math.min(86, (x(index) / width) * 100))}%`;
    tooltip.style.top = '4%';
    hoverLine.setAttribute('x1', x(index)); hoverLine.setAttribute('x2', x(index)); hoverLine.hidden = false;
  };
  svg.addEventListener('mousemove', show);
  svg.addEventListener('mouseleave', () => { tooltip.hidden = true; hoverLine.hidden = true; });
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
