// ── صفحة اللاعب ──

const RARITY_XP = {
  1: 100, 2: 250, 3: 500, 4: 1000,
  5: 2500, 6: 5000, 7: 10000, 8: 999999
};

let currentPlayerId = null;

async function loadPlayer() {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  currentPlayerId = id;

  if (!id) {
    showError();
    return;
  }

  const data = await API.player(id);

  if (!data || data.error) {
    showError();
    return;
  }

  document.title = `Dream Soul — ${data.username || id}`;
  renderPlayer(data, id);
}

function copyPlayerId() {
  if (!currentPlayerId) return;
  navigator.clipboard?.writeText(currentPlayerId).then(() => {
    const btn = document.querySelector('.copy-id-btn');
    if (!btn) return;
    const original = btn.textContent;
    btn.textContent = '✅';
    setTimeout(() => { btn.textContent = original; }, 1200);
  });
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
  document.getElementById('p-name').textContent   = d.username || ('...' + id.slice(-4));
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

  // المقتنيات حسب الندرة (rarityCount من الـ API مفاتيحه عربية: "شائع"، "نادر"...)
  const rc = d.rarityCount || {};
  const rarityMap = {
    'شائع': 'r-common', 'غير شائع': 'r-uncommon', 'نادر': 'r-rare',
    'ملحمي': 'r-epic', 'أسطوري': 'r-legendary', 'خرافي': 'r-mythic', 'فريد': 'r-unique'
  };
  Object.entries(rarityMap).forEach(([key, elId]) => {
    const el = document.getElementById(elId);
    if (el) el.textContent = rc[key] || 0;
  });

  // بطاقة VIP (بيانات حقيقية من vip.json عبر الـAPI)
  const vip = d.vip || { active: false };
  const vipTitle   = document.getElementById('vip-title');
  const vipSub     = document.getElementById('vip-sub');
  const vipWrap    = document.getElementById('vip-progress-wrap');
  const vipFill    = document.getElementById('vip-progress-fill');
  const vipDays    = document.getElementById('vip-days');
  const vipCta     = document.getElementById('vip-cta');
  const vipCard    = document.getElementById('vip-card');
  const vipBenefits = document.getElementById('vip-benefits');

  if (vip.active) {
    vipTitle.textContent = 'VIP ACTIVE';
    vipSub.textContent   = 'عضويتك VIP سارية';
    vipWrap.style.display = 'block';
    const pctLeft = Math.min(100, Math.round((vip.daysLeft / 30) * 100));
    vipFill.style.width = pctLeft + '%';
    vipDays.textContent = vip.daysLeft;
    vipCta.textContent = 'تجديد الاشتراك 💜';
    vipCard.classList.add('is-active');
    vipBenefits.classList.add('unlocked');
  } else {
    vipTitle.textContent = 'بدون VIP';
    vipSub.textContent   = 'اشترك الآن واحصل على مزايا إضافية';
    vipWrap.style.display = 'none';
    vipCta.textContent = 'الاشتراك بـ VIP 💜';
  }
}

loadPlayer();
