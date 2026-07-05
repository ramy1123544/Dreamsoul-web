const API = {
  async get(endpoint) {
    try {
      const res = await fetch(CONFIG.API_URL + encodeURIComponent(endpoint), {
        headers: { 'x-api-key': CONFIG.API_KEY }
      });
      if (!res.ok) throw new Error(res.status);
      return await res.json();
    } catch (e) {
      console.error('API Error:', e);
      return null;
    }
  },

  async stats()       { return this.get('/api/stats'); },
  async player(id)    { return this.get('/api/player/' + id); },
  async leaderboard() { return this.get('/api/leaderboard'); },
  async stocks()      { return this.get('/api/stocks'); },
  async candles(id)   { return this.get('/api/candles/' + id); },
};

function fmt(n) {
  if (n == null) return '—';
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)         return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString();
}

function pct(a, b) {
  if (!b) return '0%';
  return Math.round((a / b) * 100) + '%';
}

function rankMedal(i) {
  return ['🥇','🥈','🥉'][i] || (i + 1);
}
