// ============================================
// Dream Soul API Proxy — لـ Vercel
// ============================================

const BOT_URL = process.env.BOT_URL || 'http://93.115.101.140:15345';
const API_KEY = process.env.API_KEY || 'dreamsoul_secret';

module.exports = async function handler(req, res) {
  // ── CORS ──
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'x-api-key');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ── استخراج المسار ──
  let targetPath = req.query.path || '/health';
  if (!targetPath.startsWith('/')) targetPath = '/' + targetPath;

  // ── منع تكرار الـ slash ──
  const cleanPath = targetPath.replace(/\/+/g, '/');

  try {
    const response = await fetch(`${BOT_URL}${cleanPath}`, {
      headers: {
        'x-api-key': API_KEY,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy Error:', error.message);
    res.status(502).json({
      error: 'Bot unreachable',
      message: error.message,
      path: cleanPath,
      url: `${BOT_URL}${cleanPath}`
    });
  }
};
