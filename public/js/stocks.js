// ── صفحة الأسهم ──

let chart = null;
let currentStock = null;

async function loadStocks() {
  const data = await API.stocks();
  if (!data) return;

  const grid = document.getElementById('stocks-grid');
  const stocks = Object.values(data);

  grid.innerHTML = stocks.map(s => {
    const change = +((s.price - s.basePrice) / s.basePrice * 100).toFixed(2);
    const up = change >= 0;
    return `
      <div class="stock-card" id="sc-${s.id}" onclick="selectStock('${s.id}')">
        <div class="stock-card-top">
          <div class="stock-card-emoji">${s.emoji || '📈'}</div>
          <div>
            <div class="stock-card-name">${s.name}</div>
            <div class="stock-card-id">${s.id}</div>
          </div>
        </div>
        <div class="stock-card-price">${fmt(s.price)} $</div>
        <div class="stock-card-change ${up ? 'up' : 'down'}">
          ${up ? '▲' : '▼'} ${Math.abs(change)}% من السعر الأساسي
        </div>
      </div>`;
  }).join('');

  // افتح أول سهم تلقائياً
  if (stocks.length > 0) {
    selectStock(stocks[0].id);
  }
}

async function selectStock(id) {
  const data = await API.stocks();
  if (!data || !data[id]) return;

  const s = data[id];
  currentStock = id;

  // تفعيل الكارد
  document.querySelectorAll('.stock-card').forEach(c => c.classList.remove('active'));
  document.getElementById('sc-' + id)?.classList.add('active');

  const change   = +((s.price - s.basePrice) / s.basePrice * 100).toFixed(2);
  const up       = change >= 0;

  // تحديث هيدر الشارت
  document.getElementById('chart-title').textContent  = s.name;
  document.getElementById('chart-sub').textContent    = s.id + ' — سوق Dream Soul';
  document.getElementById('chart-price').textContent  = fmt(s.price) + ' $';
  document.getElementById('chart-change').textContent = (up ? '▲ +' : '▼ ') + change + '%';
  document.getElementById('chart-change').className   = 'chart-change ' + (up ? 'green' : 'red');

  // إحصائيات
  const hist = s.history || [];
  const high = hist.length ? Math.max(...hist, s.price) : s.price;
  const low  = hist.length ? Math.min(...hist, s.price) : s.price;

  document.getElementById('cs-base').textContent = fmt(s.basePrice) + ' $';
  document.getElementById('cs-high').textContent = fmt(high) + ' $';
  document.getElementById('cs-low').textContent  = fmt(low) + ' $';
  document.getElementById('cs-vol').textContent  = ((s.volatility || 0) * 100).toFixed(0) + '%';

  // الرسم البياني
  const labels = hist.map((_, i) => 'T-' + (hist.length - i));
  labels.push('الآن');
  const prices = [...hist, s.price];

  renderChart(labels, prices, up);

  document.getElementById('chart-section').style.display = 'block';
}

function renderChart(labels, prices, up) {
  const ctx = document.getElementById('stockChart').getContext('2d');
  const color = up ? '#34d399' : '#f87171';

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data: prices,
        borderColor: color,
        backgroundColor: color + '18',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: color,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid:  { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#7a7a99', font: { family: 'Cairo', size: 11 } }
        },
        y: {
          grid:  { color: 'rgba(255,255,255,0.05)' },
          ticks: {
            color: '#7a7a99',
            font: { family: 'Cairo', size: 11 },
            callback: v => fmt(v) + ' $'
          }
        }
      }
    }
  });
}

// ── تشغيل ──
loadStocks();
setInterval(loadStocks, CONFIG.REFRESH_INTERVAL * 1000);
