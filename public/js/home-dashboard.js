/**
 * home-dashboard.js
 * يعرض لوحة شخصية بالرئيسية لو المستخدم مسجل دخول (نفس بيانات player.html الحقيقية)
 * أما المكافأة اليومية والإنجازات والمراهنات فهي عناصر بصرية ثابتة حالياً
 * (لا يوجد نظام حقيقي لها بعد بالبوت).
 */

const RARITY_XP_TABLE = { 1: 100, 2: 150, 3: 220, 4: 320 }; // نفس جدول player.js تقريباً كحد أدنى للعرض

async function initHomeDashboard() {
  const user = window.Auth ? Auth.getUser() : null;
  if (!user) return; // خليه مخفي، يبقى القسم الترحيبي العام للزوار

  const data = await API.player(user.id);
  if (!data || data.error) return;

  document.getElementById('user-dash').style.display  = 'flex';
  document.getElementById('guest-hero').style.display  = 'none';

  // الأفاتار
  const avatarEl = document.getElementById('ud-avatar');
  avatarEl.src = data.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${data.avatar}.png?size=128`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.id) % 5}.png`;
  avatarEl.onerror = () => {
    avatarEl.onerror = null;
    avatarEl.src = `https://cdn.discordapp.com/embed/avatars/${parseInt(user.id) % 5}.png`;
  };

  document.getElementById('ud-name').textContent  = data.username || user.id;
  document.getElementById('ud-rank').textContent  = data.rank || 'مبتدئ';
  document.getElementById('ud-id').textContent    = user.id;
  document.getElementById('ud-level').textContent   = data.level || 1;
  document.getElementById('ud-level-2').textContent = data.level || 1;

  // XP
  const maxXp = RARITY_XP_TABLE[data.level] || (100 + (data.level - 1) * 80);
  const pct = Math.min(100, Math.round(((data.xp || 0) / maxXp) * 100));
  document.getElementById('ud-xp-fill').style.width = pct + '%';
  document.getElementById('ud-xp-text').textContent = `${fmt(data.xp || 0)} / ${fmt(maxXp)} XP`;

  // العصابة والمهنة
  if (data.gang) document.getElementById('ud-gang').textContent = `🚩 ${data.gang}`;
  if (data.job)  document.getElementById('ud-job').textContent  = `🔧 ${data.job}`;

  // الشبكة المالية (بنك ومحفظة حقيقية — الإنجازات والمراهنات عناصر بصرية ثابتة حالياً)
  document.getElementById('ud-bank').textContent   = '$' + fmt(data.bank || 0);
  document.getElementById('ud-wallet').textContent = '$' + fmt(data.balance || 0);

  loadStocksPreview();
}

// fmt() مستخدم من api.js مباشرة (معرّف عالمياً هناك)

function buildMiniSparkline(history, price, up) {
  const points = (history && history.length ? [...history, price] : [price, price]);
  const min = Math.min(...points), max = Math.max(...points);
  const range = (max - min) || 1;
  const w = 100, h = 26, pad = 2;
  const coords = points.map((v, i) => {
    const x = (i / (points.length - 1 || 1)) * w;
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const color = up ? '#34d399' : '#f87171';
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><polyline points="${coords}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
}

async function loadStocksPreview() {
  const data = await API.stocks();
  const box = document.getElementById('ud-stocks-list');
  if (!data || !box) return;

  const top3 = Object.values(data).slice(0, 3);
  box.innerHTML = top3.map(s => {
    const change = +((s.price - s.basePrice) / s.basePrice * 100).toFixed(2);
    const up = change >= 0;
    return `
      <div class="ud-stock-row">
        <div class="ud-stock-emoji">${s.emoji || '📈'}</div>
        <div class="ud-stock-name-wrap">
          <div class="ud-stock-name">${s.name}</div>
          <div class="ud-stock-id">${s.id}</div>
        </div>
        <div class="ud-stock-spark">${buildMiniSparkline(s.history, s.price, up)}</div>
        <div class="ud-stock-price-wrap">
          <div class="ud-stock-price">${fmt(s.price)} $</div>
          <div class="ud-stock-change ${up ? 'up' : 'down'}">${up ? '▲' : '▼'} ${Math.abs(change)}%</div>
        </div>
      </div>`;
  }).join('');
}

function copyDashId() {
  const user = window.Auth ? Auth.getUser() : null;
  if (!user) return;
  navigator.clipboard?.writeText(user.id).then(() => {
    const btn = document.querySelector('#user-dash .copy-id-btn');
    if (!btn) return;
    const original = btn.textContent;
    btn.textContent = '✅';
    setTimeout(() => { btn.textContent = original; }, 1200);
  });
}

document.addEventListener('DOMContentLoaded', initHomeDashboard);
