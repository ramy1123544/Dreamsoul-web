// ── صفحة الأسهم — Candlestick Chart ──

let chart       = null;
let currentId   = null;
let allStocks   = {};

// ─── تحميل قائمة الأسهم ───
const VISIBLE_COUNT = 3;
let showAllStocks = false;

async function loadStocks() {
  const data = await API.stocks();
  if (!data) return;
  allStocks = data;
  renderStockList();

  // افتح أول سهم تلقائياً
  if (!currentId && Object.keys(data).length > 0) {
    selectStock(Object.keys(data)[0]);
  } else if (currentId) {
    updateChartHeader(data[currentId]);
  }
}

function buildSparkline(history, price, up) {
  const points = (history && history.length ? [...history, price] : [price, price]);
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = (max - min) || 1;
  const w = 100, h = 30, pad = 3;

  const coords = points.map((v, i) => {
    const x = (i / (points.length - 1 || 1)) * w;
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  const color = up ? '#34d399' : '#f87171';
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <polyline points="${coords}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
  </svg>`;
}

function renderStockList() {
  const grid = document.getElementById('stocks-grid');
  const entries = Object.values(allStocks);

  grid.innerHTML = entries.map((s, idx) => {
    const change = +((s.price - s.basePrice) / s.basePrice * 100).toFixed(2);
    const up     = change >= 0;
    const hideMe = !showAllStocks && idx >= VISIBLE_COUNT;
    return `
      <div class="stock-row ${currentId === s.id ? 'active' : ''} ${hideMe ? 'hidden-row' : ''}"
           id="sc-${s.id}" onclick="selectStock('${s.id}')">
        <div class="stock-row-emoji">${s.emoji || '📈'}</div>
        <div class="stock-row-name-wrap">
          <div class="stock-row-name">${s.name}</div>
          <div class="stock-row-id">${s.id}</div>
        </div>
        <div class="stock-row-spark">${buildSparkline(s.history, s.price, up)}</div>
        <div class="stock-row-price-wrap">
          <div class="stock-row-price">${fmt(s.price)} $</div>
          <div class="stock-row-change ${up ? 'up' : 'down'}">${up ? '▲' : '▼'} ${Math.abs(change)}%</div>
        </div>
      </div>`;
  }).join('');

  if (entries.length > VISIBLE_COUNT) {
    grid.insertAdjacentHTML('beforeend', `
      <button class="stock-list-more-btn" onclick="toggleShowAllStocks()">
        ${showAllStocks ? 'إخفاء' : `عرض جميع الأسهم (${entries.length})`}
      </button>`);
  }
}

function toggleShowAllStocks() {
  showAllStocks = !showAllStocks;
  renderStockList();
}

// ─── اختيار سهم وعرض الشارت ───
async function selectStock(id) {
  currentId = id;
  const s = allStocks[id];
  if (!s) return;

  // تفعيل الصف
  document.querySelectorAll('.stock-row').forEach(c => c.classList.remove('active'));
  document.getElementById('sc-' + id)?.classList.add('active');

  updateChartHeader(s);

  // اجلب الشموع
  const candles = await API.candles(id);
  renderCandlestick(candles, s);

  document.getElementById('chart-section').style.display = 'block';
}

function updateChartHeader(s) {
  if (!s) return;
  const change = +((s.price - s.basePrice) / s.basePrice * 100).toFixed(2);
  const up     = change >= 0;
  const hist   = s.history || [];
  const high   = hist.length ? Math.max(...hist, s.price) : s.price;
  const low    = hist.length ? Math.min(...hist, s.price) : s.price;

  document.getElementById('chart-title').textContent  = s.name;
  document.getElementById('chart-sub').textContent    = s.id + ' — Dream Soul Market';
  document.getElementById('chart-price').textContent  = fmt(s.price) + ' $';
  document.getElementById('chart-change').textContent = (up ? '▲ +' : '▼ ') + change + '%';
  document.getElementById('chart-change').className   = 'chart-change ' + (up ? 'green' : 'red');

  document.getElementById('cs-base').textContent = fmt(s.basePrice) + ' $';
  document.getElementById('cs-high').textContent = fmt(high) + ' $';
  document.getElementById('cs-low').textContent  = fmt(low) + ' $';
  document.getElementById('cs-vol').textContent  = ((s.volatility || 0) * 100).toFixed(0) + '%';
}

// ─── رسم Candlestick ───
function renderCandlestick(candles, stock) {
  const ctx   = document.getElementById('stockChart').getContext('2d');
  const GREEN = '#34d399';
  const RED   = '#f87171';
  const GRID  = 'rgba(255,255,255,0.05)';
  const TICK  = '#7a7a99';

  if (chart) { chart.destroy(); chart = null; }

  // لو ما في شموع، ارسم line chart من history
  if (!candles || candles.length === 0) {
    const hist   = stock.history || [stock.price];
    const prices = [...hist, stock.price];
    const labels = prices.map((_, i) => i === prices.length - 1 ? 'الآن' : 'T-' + (prices.length - 1 - i));
    const up     = prices[prices.length - 1] >= prices[0];
    const color  = up ? GREEN : RED;

    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data: prices,
          borderColor: color,
          backgroundColor: color + '18',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 2,
          pointBackgroundColor: color,
        }]
      },
      options: chartOptions(GRID, TICK),
    });
    return;
  }

  // ─── Candlestick حقيقي ───
  const labels = candles.map((c, i) =>
    i === candles.length - 1 ? 'الآن' : 'T-' + (candles.length - 1 - i)
  );

  // كل شمعة: مستطيل body + خطوط wick
  const barData = candles.map(c => ({
    x: c.t,
    o: c.o, h: c.h, l: c.l, c: c.c,
  }));

  const colors = candles.map(c => c.c >= c.o ? GREEN : RED);

  // نرسمه كـ bar chart مخصص
  const openCloseData  = candles.map(c => [Math.min(c.o, c.c), Math.max(c.o, c.c)]);
  const highLowData    = candles.map(c => [c.l, c.h]);

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        // الفتيل (high-low)
        {
          label: 'wick',
          data: highLowData,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1,
          barThickness: 2,
        },
        // الجسم (open-close)
        {
          label: 'body',
          data: openCloseData,
          backgroundColor: colors.map(c => c + 'CC'),
          borderColor: colors,
          borderWidth: 1,
          barThickness: 8,
        },
      ]
    },
    options: {
      ...chartOptions(GRID, TICK),
      plugins: { legend: { display: false } },
      scales: {
        x: {
          stacked: false,
          grid:  { color: GRID },
          ticks: { color: TICK, font: { family: 'Cairo', size: 10 }, maxTicksLimit: 10 },
        },
        y: {
          grid:  { color: GRID },
          ticks: {
            color: TICK,
            font: { family: 'Cairo', size: 11 },
            callback: v => fmt(v) + ' $',
          }
        }
      }
    }
  });
}

function chartOptions(GRID, TICK) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: GRID }, ticks: { color: TICK, font: { family: 'Cairo', size: 11 } } },
      y: {
        grid: { color: GRID },
        ticks: { color: TICK, font: { family: 'Cairo', size: 11 }, callback: v => fmt(v) + '$' }
      }
    }
  };
}

// ─── تشغيل ───
loadStocks();
setInterval(loadStocks, CONFIG.REFRESH_INTERVAL * 1000);
