// ── صفحة المتصدرين ──

async function loadLeaderboard() {
  const data = await API.leaderboard();
  if (!data) return;

  // البودوم (أول 3)
  const medals  = ['🥇','🥈','🥉'];
  const posClass = ['pos-1','pos-2','pos-3'];
  const podium  = document.getElementById('podium');

  podium.innerHTML = data.slice(0, 3).map((p, i) => `
    <div class="podium-card ${posClass[i]}" onclick="location.href='player.html?id=${p.id}'">
      <div class="podium-medal">${medals[i]}</div>
      <div class="podium-name">#${p.id}</div>
      <div class="podium-rank">${p.rank} • مستوى ${p.level}</div>
      <div class="podium-amt">${fmt(p.total)} $</div>
    </div>
  `).join('');

  // الجدول الكامل
  const tbody = document.getElementById('lb-body');
  tbody.innerHTML = data.map((p, i) => `
    <tr class="clickable" onclick="location.href='player.html?id=${p.id}'">
      <td><span class="rank-medal">${rankMedal(i)}</span></td>
      <td class="td-name">#${p.id}</td>
      <td class="td-rank">${p.rank}</td>
      <td class="td-level">مستوى ${p.level}</td>
      <td class="td-wealth">${fmt(p.total)} $</td>
    </tr>
  `).join('');
}

loadLeaderboard();
setInterval(loadLeaderboard, CONFIG.REFRESH_INTERVAL * 1000);
