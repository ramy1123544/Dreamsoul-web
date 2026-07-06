// ── منطق المتجر ──

let currentUser  = null;
let allItems     = [];
let selectedItem = null;

const RARITY_COLORS = {
  'شائع':     '#A0A0A0',
  'غير شائع': '#55E5FF',
  'نادر':     '#9B59B6',
  'ملحمي':    '#F1C40F',
  'أسطوري':   '#FF4444',
  'خرافي':    '#00EEFF',
  'فريد':     '#FFD700',
};

// ─── تهيئة الصفحة ───
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

function renderItems(items) {
  const grid = document.getElementById('shop-grid');
  if (!items.length) {
    grid.innerHTML = '<p class="empty-msg">لا توجد منتجات في هذا التصنيف</p>';
    return;
  }

  grid.innerHTML = items.map(item => {
    const color = RARITY_COLORS[item.rarity] || '#fff';
    return `
      <div class="shop-item-card" onclick="openBuyModal('${item.id}')">
        <div class="item-rarity-badge" style="color:${color}">${item.rarity}</div>
        <div class="item-icon">${item.emoji || '🎁'}</div>
        <div class="item-name">${item.name}</div>
        <div class="item-desc">${item.description || ''}</div>
        <div class="item-footer">
          <span class="item-price">${fmt(item.price)} $</span>
          <button class="btn-buy">شراء</button>
        </div>
      </div>`;
  }).join('');
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

// ─── تأكيد الشراء ───
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

// ─── إشعار بسيط ───
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

initShop();
