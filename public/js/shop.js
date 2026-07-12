// ── منطق المتجر مع D3.js ──

let currentUser  = null;
let allItems     = [];
let selectedItem = null;

const RARITY_COLORS = {
  'شائع':     '#A0A0A0',
  'غير شائع': '#55E5FF',
  'نادر':     '#9B59B6',
  'ملحمي':    '#F1C40F',
  'أسطوري':   '#FF4444',
  'خرافي':    '#00EEFF',
  'فريد':     '#FFD700',
};

// ─── رسم أيقونة بـ D3.js ───
function renderItemIconD3(itemName, rarity, container) {
  // تنظيف الحاوية
  d3.select(container).html('');

  // استخراج النوع والصفة
  const parts = itemName.trim().split(/\s+/);
  const type = parts[0];
  const adjective = parts.slice(1).join(' ');

  // الحصول على SVG المسار
  const svgPath = TYPE_ICONS[type];
  if (!svgPath) {
    // احتياطي: إذا ما لقى النوع
    container.innerHTML = `<div style="font-size:40px;text-align:center">🎁</div>`;
    return;
  }

  const rarityColor = RARITY_COLORS[rarity] || '#A0A0A0';
  const themeInfo = ADJECTIVE_THEMES[adjective] || { theme: 'tint', color: rarityColor };

  // استخراج المسار من SVG
  const pathMatch = svgPath.match(/d="([^"]*)"/);
  if (!pathMatch) {
    container.innerHTML = `<div style="font-size:40px;text-align:center">🎁</div>`;
    return;
  }

  // إنشاء SVG
  const svg = d3.select(container)
    .append('svg')
    .attr('viewBox', '0 0 100 100')
    .attr('width', '80')
    .attr('height', '80')
    .style('display', 'block')
    .style('margin', '0 auto');

  // ── حلقة نيون حسب الندرة ──
  svg.append('circle')
    .attr('cx', 50)
    .attr('cy', 50)
    .attr('r', 42)
    .attr('fill', 'none')
    .attr('stroke', rarityColor)
    .attr('stroke-width', '2')
    .attr('opacity', 0.4)
    .style('filter', `drop-shadow(0 0 8px ${rarityColor}) drop-shadow(0 0 20px ${rarityColor})`);

  // ── شكل الأيقونة الرئيسي ──
  svg.append('path')
    .attr('d', pathMatch[1])
    .attr('fill', 'none')
    .attr('stroke', rarityColor)
    .attr('stroke-width', '2.5')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .style('filter', `drop-shadow(0 0 12px ${rarityColor})`);

  // ── تعبئة داخلية خفيفة ──
  svg.append('path')
    .attr('d', pathMatch[1])
    .attr('fill', rarityColor)
    .attr('opacity', 0.08);

  // ── إضافة جسيمات حسب الصفة ──
  addParticles(svg, themeInfo.theme, themeInfo.color, rarityColor);

  // ── تأثير نيون خلفي ──
  svg.append('circle')
    .attr('cx', 50)
    .attr('cy', 50)
    .attr('r', 48)
    .attr('fill', 'none')
    .attr('stroke', rarityColor)
    .attr('stroke-width', '0.5')
    .attr('opacity', 0.15)
    .style('filter', `blur(4px)`);
}

// ─── إضافة جسيمات حسب الصفة ───
function addParticles(svg, theme, color, rarityColor) {
  const particles = {
    'fire': () => {
      for (let i = 0; i < 5; i++) {
        svg.append('circle')
          .attr('cx', 20 + Math.random() * 60)
          .attr('cy', 65 + Math.random() * 25)
          .attr('r', 2 + Math.random() * 4)
          .attr('fill', color)
          .attr('opacity', 0.3 + Math.random() * 0.4)
          .style('filter', `blur(1px)`);
      }
    },
    'ice': () => {
      for (let i = 0; i < 6; i++) {
        svg.append('rect')
          .attr('x', 15 + Math.random() * 70)
          .attr('y', 15 + Math.random() * 70)
          .attr('width', 3)
          .attr('height', 6)
          .attr('fill', color)
          .attr('opacity', 0.3 + Math.random() * 0.4)
          .attr('transform', `rotate(${Math.random() * 360}, 50, 50)`);
      }
    },
    'thunder': () => {
      for (let i = 0; i < 4; i++) {
        svg.append('line')
          .attr('x1', 20 + Math.random() * 60)
          .attr('y1', 10 + Math.random() * 30)
          .attr('x2', 25 + Math.random() * 50)
          .attr('y2', 60 + Math.random() * 30)
          .attr('stroke', color)
          .attr('stroke-width', 1.5)
          .attr('opacity', 0.3 + Math.random() * 0.4);
      }
    },
    'royal': () => {
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * 2 * Math.PI;
        svg.append('line')
          .attr('x1', 50 + 38 * Math.cos(angle))
          .attr('y1', 50 + 38 * Math.sin(angle))
          .attr('x2', 50 + 44 * Math.cos(angle))
          .attr('y2', 50 + 44 * Math.sin(angle))
          .attr('stroke', color)
          .attr('stroke-width', 1.5)
          .attr('opacity', 0.4 + Math.random() * 0.3);
      }
    },
    'shadow': () => {
      for (let i = 0; i < 5; i++) {
        svg.append('circle')
          .attr('cx', 15 + Math.random() * 70)
          .attr('cy', 15 + Math.random() * 70)
          .attr('r', 3 + Math.random() * 5)
          .attr('fill', color)
          .attr('opacity', 0.15 + Math.random() * 0.2)
          .style('filter', `blur(3px)`);
      }
    },
    'cosmic': () => {
      for (let i = 0; i < 10; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const dist = 20 + Math.random() * 35;
        svg.append('circle')
          .attr('cx', 50 + dist * Math.cos(angle))
          .attr('cy', 50 + dist * Math.sin(angle))
          .attr('r', 1 + Math.random() * 2)
          .attr('fill', '#ffffff')
          .attr('opacity', 0.4 + Math.random() * 0.5)
          .style('filter', `drop-shadow(0 0 4px ${color})`);
      }
    },
    'holy': () => {
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * 2 * Math.PI + Math.PI / 6;
        svg.append('line')
          .attr('x1', 50)
          .attr('y1', 50)
          .attr('x2', 50 + 40 * Math.cos(angle))
          .attr('y2', 50 + 40 * Math.sin(angle))
          .attr('stroke', color)
          .attr('stroke-width', 1.5)
          .attr('opacity', 0.2 + Math.random() * 0.2);
      }
    },
    'wind': () => {
      for (let i = 0; i < 5; i++) {
        svg.append('path')
          .attr('d', `M${15 + i * 15},${20 + Math.random() * 60} Q${25 + i * 15},${10 + Math.random() * 20} ${35 + i * 15},${20 + Math.random() * 60}`)
          .attr('stroke', color)
          .attr('stroke-width', 1)
          .attr('fill', 'none')
          .attr('opacity', 0.3 + Math.random() * 0.3);
      }
    },
    'water': () => {
      for (let i = 0; i < 4; i++) {
        svg.append('circle')
          .attr('cx', 20 + Math.random() * 60)
          .attr('cy', 65 + Math.random() * 25)
          .attr('r', 3 + Math.random() * 5)
          .attr('fill', 'none')
          .attr('stroke', color)
          .attr('stroke-width', 1.5)
          .attr('opacity', 0.3 + Math.random() * 0.3);
      }
    },
    'desert': () => {
      for (let i = 0; i < 8; i++) {
        svg.append('circle')
          .attr('cx', 15 + Math.random() * 70)
          .attr('cy', 60 + Math.random() * 30)
          .attr('r', 1.5 + Math.random() * 2)
          .attr('fill', color)
          .attr('opacity', 0.2 + Math.random() * 0.3);
      }
    },
    'forest': () => {
      for (let i = 0; i < 5; i++) {
        svg.append('path')
          .attr('d', `M${20 + i * 15},${70} L${25 + i * 15},${50} L${30 + i * 15},${70}`)
          .attr('fill', color)
          .attr('opacity', 0.2 + Math.random() * 0.2);
      }
    },
    'ancient': () => {
      for (let i = 0; i < 4; i++) {
        svg.append('line')
          .attr('x1', 20 + Math.random() * 60)
          .attr('y1', 20 + Math.random() * 60)
          .attr('x2', 25 + Math.random() * 50)
          .attr('y2', 25 + Math.random() * 50)
          .attr('stroke', color)
          .attr('stroke-width', 1)
          .attr('opacity', 0.2 + Math.random() * 0.2);
      }
    },
    'tint': () => {
      // تأثير بسيط جداً للعناصر العادية
      svg.append('circle')
        .attr('cx', 50)
        .attr('cy', 50)
        .attr('r', 35)
        .attr('fill', color)
        .attr('opacity', 0.04);
    }
  };

  const particleFn = particles[theme];
  if (particleFn) particleFn();
}

// ─── تهيئة الصفحة ───
async function initShop() {
  currentUser = Auth.getUser();

  if (!currentUser) {
    document.getElementById('shop-login').style.display    = 'block';
    document.getElementById('shop-login-btn').href         = Auth.loginURL();
    document.getElementById('shop-content').style.display  = 'none';
    return;
  }

  document.getElementById('shop-login').style.display   = 'none';
  document.getElementById('shop-content').style.display = 'block';

  await loadPlayerBalance();
  await loadShopItems();
  startCountdown();
}

// ─── رصيد اللاعب ───
async function loadPlayerBalance() {
  const data = await API.player(currentUser.id);
  if (!data) return;
  document.getElementById('player-balance').textContent = fmt(data.balance) + ' $';
}

// ─── منتجات المتجر ───
async function loadShopItems() {
  const data = await API.get('/api/shop');
  if (!data || !data.items) {
    document.getElementById('shop-grid').innerHTML =
      '<p class="empty-msg">المتجر فارغ حالياً — تعال لاحقاً!</p>';
    return;
  }

  allItems = data.items;
  renderItems(allItems);
}

// ─── عرض المنتجات ───
function renderItems(items) {
  const grid = document.getElementById('shop-grid');
  if (!items.length) {
    grid.innerHTML = '<p class="empty-msg">لا توجد منتجات في هذا التصنيف</p>';
    return;
  }

  grid.innerHTML = items.map((item, index) => {
    const color = RARITY_COLORS[item.rarity] || '#fff';
    const iconId = `icon-${item.id}-${index}`;
    
    return `
      <div class="shop-item-card" onclick="openBuyModal('${item.id}')">
        <div class="item-rarity-badge" style="color:${color}">${item.rarity}</div>
        <div class="item-icon-wrapper" id="${iconId}"></div>
        <div class="item-name">${item.name}</div>
        <div class="item-desc">${item.description || ''}</div>
        <div class="item-footer">
          <span class="item-price">${fmt(item.price)} $</span>
          <button class="btn-buy">شراء</button>
        </div>
      </div>`;
  }).join('');

  // ── رسم الأيقونات بـ D3.js ──
  items.forEach((item, index) => {
    const iconId = `icon-${item.id}-${index}`;
    const container = document.getElementById(iconId);
    if (container) {
      renderItemIconD3(item.name, item.rarity, container);
    }
  });
}

// ─── فلترة ───
function filterItems(rarity) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  const filtered = rarity === 'all' ? allItems : allItems.filter(i => i.rarity === rarity);
  renderItems(filtered);
}

// ─── Modal الشراء ───
function openBuyModal(itemId) {
  selectedItem = allItems.find(i => i.id === itemId);
  if (!selectedItem) return;

  const color = RARITY_COLORS[selectedItem.rarity] || '#fff';
  document.getElementById('modal-icon').textContent  = selectedItem.emoji || '🎁';
  document.getElementById('modal-title').textContent = selectedItem.name;
  document.getElementById('modal-desc').textContent  = selectedItem.description || '';
  document.getElementById('modal-price').innerHTML   =
    `<span style="color:${color}">${selectedItem.rarity}</span> — <strong>${fmt(selectedItem.price)} $</strong>`;
  document.getElementById('buy-modal').style.display = 'flex';
}

function closeModal(e) {
  if (e.target.id === 'buy-modal') document.getElementById('buy-modal').style.display = 'none';
}

// ─── تأكيد الشراء ───
async function confirmBuy() {
  if (!selectedItem || !currentUser) return;

  const btn = document.getElementById('modal-confirm');
  btn.textContent = '⏳';
  btn.disabled    = true;

  const res = await API.get(
    `/api/shop/buy?itemId=${selectedItem.id}&userId=${currentUser.id}`
  );

  btn.textContent = 'شراء ✓';
  btn.disabled    = false;
  document.getElementById('buy-modal').style.display = 'none';

  if (res?.success) {
    showToast(`✅ اشتريت ${selectedItem.name} بنجاح!`, 'success');
    await loadPlayerBalance();
    await loadShopItems();
  } else {
    showToast(`❌ ${res?.reason || 'فشلت عملية الشراء'}`, 'error');
  }
}

// ─── إشعار بسيط ───
function showToast(msg, type = 'success') {
  const t  = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3000);
}

// ─── عداد تجديد المتجر ───
function startCountdown() {
  function update() {
    const now  = new Date();
    const next = new Date();
    next.setUTCHours(24, 0, 0, 0);
    const diff = next - now;
    const h    = Math.floor(diff / 3600000);
    const m    = Math.floor((diff % 3600000) / 60000);
    const s    = Math.floor((diff % 60000) / 1000);
    document.getElementById('shop-countdown').textContent =
      `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }
  update();
  setInterval(update, 1000);
}

// ─── تشغيل ───
initShop();
