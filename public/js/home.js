// ── الصفحة الرئيسية ──

async function loadStats() {
  const data = await API.stats();
  if (!data) return;

  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.dataset.key;
    const val = data[key];
    if (val != null) el.textContent = fmt(val);
  });
}

async function loadStocksTicker() {
  const data = await API.stats();
  if (!data?.stocks) return;

  const row = document.getElementById('stocks-row');
  row.innerHTML = data.stocks.map(s => {
    const up = s.change >= 0;
    return `
      <div class="stock-chip" onclick="location.href='stocks.html'">
        <div class="stock-emoji">${s.emoji || '📈'}</div>
        <div class="stock-info">
          <div class="stock-name">${s.id}</div>
          <div class="stock-price">${fmt(s.price)} $</div>
        </div>
        <div class="stock-change ${up ? 'up' : 'down'}">
          ${up ? '▲' : '▼'} ${Math.abs(s.change)}%
        </div>
      </div>`;
  }).join('');
}

async function loadLeaderboard() {
  const data = await API.leaderboard();
  if (!data) return;

  const medals = ['gold', 'silver', 'bronze'];
  const list = document.getElementById('leaderboard-list');
  list.innerHTML = data.slice(0, 5).map((p, i) => `
    <a class="lb-row" href="player.html?id=${p.id}">
      <div class="lb-rank ${medals[i] || ''}">${rankMedal(i)}</div>
      <div class="lb-info">
        <div class="lb-name">#${p.id}</div>
        <div class="lb-sub">${p.rank} • مستوى ${p.level}</div>
      </div>
      <div class="lb-amount">${fmt(p.total)} $</div>
    </a>
  `).join('');
}

function goToPlayer() {
  const id = document.getElementById('search-id').value.trim();
  if (id) location.href = 'player.html?id=' + encodeURIComponent(id);
}

document.getElementById('search-id')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') goToPlayer();
});

// ── تشغيل ──
loadStats();
loadStocksTicker();
loadLeaderboard();

setInterval(() => {
  loadStats();
  loadStocksTicker();
  loadLeaderboard();
}, CONFIG.REFRESH_INTERVAL * 1000);
