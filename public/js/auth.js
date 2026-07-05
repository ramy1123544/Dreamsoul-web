// ── إدارة جلسة اللاعب ──

const CLIENT_ID    = '1476245341291544606';
const REDIRECT_URI = 'https://dreamsoul-web.vercel.app/auth/callback';
const SCOPES       = 'identify';

const Auth = {
  // اقرأ بيانات اللاعب من الـ cookie
  getUser() {
    const match = document.cookie.match(/ds_user=([^;]+)/);
    if (!match) return null;
    try {
      return JSON.parse(atob(match[1]));
    } catch { return null; }
  },

  // تسجيل الخروج
  logout() {
    document.cookie = 'ds_user=; Path=/; Max-Age=0';
    window.location.href = '/';
  },

  // رابط تسجيل الدخول
  loginURL() {
    const params = new URLSearchParams({
      client_id:     CLIENT_ID,
      redirect_uri:  REDIRECT_URI,
      response_type: 'code',
      scope:         SCOPES,
    });
    return `https://discord.com/oauth2/authorize?${params}`;
  },

  // رسم زر الهيدر
  renderHeader() {
    const user = this.getUser();
    const el   = document.getElementById('auth-btn');
    if (!el) return;

    if (user) {
      const avatar = user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=32`
        : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.id) % 5}.png`;

      el.innerHTML = `
        <div class="user-menu" onclick="toggleUserMenu()">
          <img src="${avatar}" class="header-avatar" alt="">
          <span class="header-username">${user.username}</span>
          <span class="header-chevron">▾</span>
        </div>
        <div class="user-dropdown" id="user-dropdown">
          <a href="player.html?id=${user.id}">👤 ملفي</a>
          <a href="shop.html">🛒 المتجر</a>
          <a onclick="Auth.logout()" style="cursor:pointer;color:#f87171">🚪 تسجيل خروج</a>
        </div>`;
    } else {
      el.innerHTML = `
        <a href="${this.loginURL()}" class="login-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.034.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
          </svg>
          تسجيل الدخول
        </a>`;
    }
  }
};

function toggleUserMenu() {
  document.getElementById('user-dropdown')?.classList.toggle('show');
}

document.addEventListener('click', e => {
  if (!e.target.closest('.user-menu')) {
    document.getElementById('user-dropdown')?.classList.remove('show');
  }
});

// شغّل عند تحميل الصفحة
Auth.renderHeader();
