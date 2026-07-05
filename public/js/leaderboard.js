// ── صفحة المتصدرين ──

async function loadLeaderboard() {
  const data = await API.leaderboard();
  if (!data) return;

  const medals  = ['🥇','🥈','🥉'];
  const posClass = ['pos-1','pos-2','pos-3'];
  const podium  = document.getElementById('podium');

  podium.innerHTML = data.slice(0, 3).map((p, i) => `
    <div class="podium-card ${posClass[i]}" onclick="location.href='player.html?id=${p.id}'">
      <div class="podium-medal">${medals[i]}</div>
      <img class="podium-avatar" 
           src="https://cdn.discordapp.com/avatars/${p.id}/${p.avatar}.png?size=64"
           onerror="this.src='https://cdn.discordapp.com/embed/avatars/${parseInt(p.id||0) % 5}.png'"
           alt="avatar">
      <div class="podium-name">${p.username || shortId(p.id)}</div>
      <div class="podium-rank">${p.rank} • مستوى ${p.level}</div>
      <div class="podium-amt">${fmt(p.total)} $</div>
    </div>
  `).join('');

  const tbody = document.getElementById('lb-body');
  tbody.innerHTML = data.map((p, i) => `
    <tr class="clickable" onclick="location.href='player.html?id=${p.id}'">
      <td><span class="rank-medal">${rankMedal(i)}</span></td>
      <td class="td-name">
        <img class="mini-avatar"
             src="https://cdn.discordapp.com/avatars/${p.id}/${p.avatar}.png?size=32"
             onerror="this.src='https://cdn.discordapp.com/embed/avatars/${parseInt(p.id||0) % 5}.png'"
             alt="">
        ${p.username || shortId(p.id)}
      </td>
      <td class="td-rank">${p.rank}</td>
      <td class="td-level">مستوى ${p.level}</td>
      <td class="td-wealth">${fmt(p.total)} $</td>
    </tr>
  `).join('');
}

function shortId(id) {
  return id ? '...' + String(id).slice(-4) : '—';
}

loadLeaderboard();
setInterval(loadLeaderboard, CONFIG.REFRESH_INTERVAL * 1000);
