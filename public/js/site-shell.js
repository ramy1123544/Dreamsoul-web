/**
 * site-shell.js
 * يضيف زر الهمبرغر بالهيدر + شريط تنقل سفلي ثابت، بدون ما يلمس
 * منطق auth.js أو محتوى الصفحة. يشتغل بكل الصفحات بعد إضافة:
 *   <link rel="stylesheet" href="css/site-shell.css">
 *   <script src="js/site-shell.js"></script>
 * (تحطه بعد auth.js بالـ body)
 */

(function () {
  const CURRENT_PAGE = location.pathname.split('/').pop() || 'index.html';

  // ✅ الترتيب الصحيح من اليمين لليسار (RTL)
  const NAV_ITEMS = [
    { href: 'index.html',       icon: '🏠', label: 'الرئيسية' },
    { href: 'stocks.html',      icon: '📈', label: 'الأسهم' },
    { href: 'leaderboard.html', icon: '🏆', label: 'المتصدرون' },
    { href: 'shop.html',        icon: '🛒', label: 'المتجر' },
    { href: 'player.html',      icon: '👤', label: 'الحساب' },
  ];

  function buildBottomNav() {
    const nav = document.createElement('nav');
    nav.className = 'bottom-nav';

    NAV_ITEMS.forEach(item => {
      const a = document.createElement('a');
      const isActive = CURRENT_PAGE === item.href;
      a.className = 'bottom-nav-item' + (isActive ? ' active' : '');

      // صفحة الحساب: لو المستخدم مسجل دخول ودّيه لملفه، غير كذا زر الدخول
      if (item.href === 'player.html') {
        const user = window.Auth ? Auth.getUser() : null;
        a.href = user ? `player.html?id=${user.id}` : (window.Auth ? Auth.loginURL() : 'player.html');
      } else {
        a.href = item.href;
      }

      a.innerHTML = `<span class="bn-icon">${item.icon}</span><span>${item.label}</span>`;
      nav.appendChild(a);
    });

    document.body.appendChild(nav);
    document.body.classList.add('has-bottom-nav');
  }

  function buildHamburger() {
    const headerInner = document.querySelector('.header-inner');
    if (!headerInner) return;

    const wrap = document.createElement('div');
    wrap.style.position = 'relative';

    const btn = document.createElement('button');
    btn.className = 'hamburger-btn';
    btn.setAttribute('aria-label', 'القائمة');
    btn.innerHTML = '☰';

    const dropdown = document.createElement('div');
    dropdown.className = 'hamburger-dropdown';
    dropdown.innerHTML = `
      <a href="index.html">i️ عن الموقع</a>
      <hr>
      <div class="disabled-item">⚙️ الإعدادات <span class="soon-tag">قريباً</span></div>
      <div class="disabled-item">💬 الدعم <span class="soon-tag">قريباً</span></div>
      <div class="disabled-item">🌐 اللغة <span class="soon-tag">قريباً</span></div>
      <hr>
      <a onclick="window.Auth && Auth.logout()" style="cursor:pointer;color:#f87171">🚪 تسجيل خروج</a>
    `;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('show');
    });
    document.addEventListener('click', () => dropdown.classList.remove('show'));

    wrap.appendChild(btn);
    wrap.appendChild(dropdown);
    headerInner.insertBefore(wrap, headerInner.firstChild);
  }

  document.addEventListener('DOMContentLoaded', () => {
    buildHamburger();
    buildBottomNav();
  });
})();
