// ── صفحة اللاعب ──

const RARITY_XP = {
  1: 100, 2: 250, 3: 500, 4: 1000,
  5: 2500, 6: 5000, 7: 10000, 8: 999999
};

async function loadPlayer() {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  if (!id) {
    showError();
    return;
  }

  const data = await API.player(id);

  if (!data || data.error) {
    showError();
    return;
  }

  document.title = `Dream Soul — ${id}`;
  renderPlayer(data, id);
}

function showError() {
  document.getElementById('player-loading').style.display = 'none';
  document.getElementById('player-error').style.display = 'block';
}

function renderPlayer(d, id) {
  document.getElementById('player-loading').style.display = 'none';
  document.getElementById('player-profile').style.display = 'block';

  // الأفاتار — Discord CDN
  const avatarEl = document.getElementById('p-avatar');
  avatarEl.src = `https://cdn.discordapp.com/avatars/${id}/avatar.png?size=128`;
  avatarEl.onerror = () => {
    avatarEl.src = `https://cdn.discordapp.com/embed/avatars/${parseInt(id) % 5}.png`;
  };

  // الأساسيات
  document.getElementById('p-name').textContent   = '#' + id;
  document.getElementById('p-id').textContent     = 'ID: ' + id;
  document.getElementById('p-rank').textContent   = d.rank || 'مبتدئ';
  document.getElementById('p-level-badge').textContent = d.level || 1;

  // المهنة والعصابة
  const jobNames = {
    trader: '💼 تاجر', gambler: '🎰 مقامر', thief: '🗡️ لص',
    miner: '⛏️ عامل منجم', investor: '📈 مستثمر'
  };
  document.getElementById('p-job').textContent  = jobNames[d.job] || '🔧 بدون مهنة';
  document.getElementById('p-gang').textContent = d.gang ? ('🏴 ' + d.gang) : '🏴 بدون عصابة';

  // XP Bar
  const maxXp = RARITY_XP[d.level] || 100;
  const xpPct = Math.min(100, Math.round((d.xp / maxXp) * 100));
  document.getElementById('p-xp-text').textContent = `${fmt(d.xp)} / ${fmt(maxXp)} XP`;
  document.getElementById('p-xp-bar').style.width  = xpPct + '%';

  // المال
  document.getElementById('p-balance').textContent = fmt(d.balance) + ' $';
  document.getElementById('p-bank').textContent    = fmt(d.bank) + ' $';
  document.getElementById('p-games').textContent   = fmt(d.gamesPlayed);
  document.getElementById('p-wins').textContent    = fmt(d.wins);

  // الإحصائيات
  document.getElementById('p-steals').textContent  = fmt(d.steals);
  document.getElementById('p-items').textContent   = fmt(d.totalItems);
  document.getElementById('p-winrate').textContent = pct(d.wins, d.gamesPlayed);
  document.getElementById('p-total').textContent   = fmt((d.balance || 0) + (d.bank || 0)) + ' $';

  // المقتنيات حسب الندرة
  const rc = d.rarityCount || {};
  const rarityMap = {
    common: 'r-common', uncommon: 'r-uncommon', rare: 'r-rare',
    epic: 'r-epic', legendary: 'r-legendary', mythic: 'r-mythic', unique: 'r-unique'
  };
  Object.entries(rarityMap).forEach(([key, elId]) => {
    const el = document.getElementById(elId);
    if (el) el.textContent = rc[key] || 0;
  });
}

loadPlayer();
