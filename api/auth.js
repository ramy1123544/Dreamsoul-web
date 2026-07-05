// ── Discord OAuth2 Callback ──
module.exports = async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.redirect('/');
  }

  const CLIENT_ID     = process.env.DISCORD_CLIENT_ID;
  const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
  const REDIRECT_URI  = 'https://dreamsoul-web.vercel.app/auth/callback';

  try {
    // استبدل الـ code بـ token
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id:     CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type:    'authorization_code',
        code,
        redirect_uri:  REDIRECT_URI,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error('No token');

    // اجلب بيانات اللاعب
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const user = await userRes.json();

    // احفظ في cookie بسيط (base64)
    const userData = JSON.stringify({
      id:       user.id,
      username: user.username,
      avatar:   user.avatar,
    });

    const encoded = Buffer.from(userData).toString('base64');
    res.setHeader('Set-Cookie', `ds_user=${encoded}; Path=/; Max-Age=604800; SameSite=Lax`);
    res.redirect('/shop.html');

  } catch (err) {
    console.error('Auth error:', err);
    res.redirect('/?error=auth_failed');
  }
};
