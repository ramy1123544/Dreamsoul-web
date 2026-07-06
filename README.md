# Dream Soul — الموقع (المرحلة 1)

## الصفحات
- `/` — الرئيسية (إحصائيات + أسهم + ترتيب)
- `/player.html?id=ID` — ملف اللاعب
- `/stocks.html` — سوق الأسهم مع الرسم البياني
- `/leaderboard.html` — المتصدرون

## الإعداد

### 1. عدّل `public/js/config.js`
```js
const CONFIG = {
  API_URL: 'http://YOUR_BOT_IP:3001',  // IP البوت على Wispbyte
  API_KEY: 'YOUR_API_KEY_HERE',         // نفس API_KEY في .env
  REFRESH_INTERVAL: 30,
};
```

### 2. ارفع على Vercel
- اربط الـ repo من GitHub
- الـ root directory: `dreamsoul-web`
- لا تحتاج build command — static site

### 3. تأكد البوت شغال
في logs Wispbyte تشوف:
```
✅ Dream Soul API شغّال على port 3001
```

## ملاحظة CORS
لو الموقع على Vercel والبوت على Wispbyte، تحتاج تضيف رابط الموقع في `api.js`:
```js
res.setHeader('Access-Control-Allow-Origin', 'https://dreamsoul.vercel.app');
```
