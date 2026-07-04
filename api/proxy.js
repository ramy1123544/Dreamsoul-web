const BOT_URL = process.env.BOT_URL || 'http://93.115.101.140:15345';
const API_KEY = process.env.API_KEY || 'dreamsoul_secret';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'x-api-key');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  let targetPath = req.query.path || '/health';
  if (!targetPath.startsWith('/')) targetPath = '/' + targetPath;

  try {
    const response = await fetch(`${BOT_URL}${targetPath}`, {
      headers: { 'x-api-key': API_KEY }
    });
    
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (e) {
    res.status(502).json({ 
      error: 'Bot unreachable', 
      detail: e.message,
      url: `${BOT_URL}${targetPath}`
    });
  }
