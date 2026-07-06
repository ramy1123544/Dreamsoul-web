/**
 * stocks-heatmap.js
 * خريطة حرارية للسوق باستخدام D3.js — treemap حيث:
 *   - حجم كل مربع = مقدار الحركة (|التغير %|)
 *   - لون المربع = الاتجاه (أخضر=صعود، أحمر=هبوط) بشدة تتناسب مع قوة الحركة
 * الضغط على أي مربع يفتح نفس شارت السهم التفصيلي (يعيد استخدام selectStock من stocks.js)
 */

async function loadHeatmap() {
  const data = await API.stocks();
  if (!data) return;
  renderHeatmap(Object.values(data));
}

function renderHeatmap(stocks) {
  const stage = document.getElementById('market-heatmap');
  if (!stage || !stocks.length) return;

  stage.innerHTML = '';
  const width  = stage.clientWidth || 600;
  const height = 220;

  const changeOf = s => +((s.price - s.basePrice) / s.basePrice * 100).toFixed(2);

  // القيمة اللي تحدد حجم المربع = مقدار الحركة (مع حد أدنى عشان ما يختفي أي سهم)
  const root = d3.hierarchy({ children: stocks })
    .sum(s => Math.max(Math.abs(changeOf(s)), 2))
    .sort((a, b) => b.value - a.value);

  d3.treemap()
    .size([width, height])
    .paddingInner(3)
    .round(true)(root);

  // شدة اللون حسب قوة الحركة (0% إلى 30%+)
  const intensity = d3.scaleLinear().domain([0, 30]).range([0.35, 1]).clamp(true);

  const svg = d3.select(stage)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('width', '100%')
    .attr('height', height);

  const nodes = svg.selectAll('g')
    .data(root.leaves())
    .join('g')
    .attr('transform', d => `translate(${d.x0},${d.y0})`)
    .style('cursor', 'pointer')
    .on('click', (event, d) => {
      if (typeof selectStock === 'function') selectStock(d.data.id);
      document.getElementById('chart-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

  nodes.append('rect')
    .attr('width',  d => Math.max(d.x1 - d.x0, 0))
    .attr('height', d => Math.max(d.y1 - d.y0, 0))
    .attr('rx', 6)
    .attr('fill', d => {
      const c = changeOf(d.data);
      const up = c >= 0;
      const base = up ? [52, 211, 153] : [248, 113, 113]; // --green / --red
      const a = intensity(Math.abs(c));
      return `rgba(${base[0]},${base[1]},${base[2]},${a})`;
    })
    .attr('stroke', 'rgba(255,255,255,0.06)');

  // النص: يظهر بس إذا المربع كبير كفاية
  const label = nodes.filter(d => (d.x1 - d.x0) > 46 && (d.y1 - d.y0) > 34);

  label.append('text')
    .attr('x', 8).attr('y', 18)
    .attr('fill', '#fff')
    .style('font-family', 'Cairo, sans-serif')
    .style('font-size', '11px')
    .style('font-weight', '700')
    .text(d => d.data.emoji ? `${d.data.emoji} ${d.data.name}` : d.data.name);

  label.append('text')
    .attr('x', 8).attr('y', 34)
    .attr('fill', 'rgba(255,255,255,0.9)')
    .style('font-family', 'Cairo, sans-serif')
    .style('font-size', '12px')
    .style('font-weight', '800')
    .text(d => {
      const c = changeOf(d.data);
      return (c >= 0 ? '▲ +' : '▼ ') + Math.abs(c) + '%';
    });

  // tooltip بسيط بالـtitle العادي كحد أدنى (بدون مكتبات إضافية)
  nodes.append('title')
    .text(d => `${d.data.name} — ${fmt(d.data.price)} $ (${changeOf(d.data) >= 0 ? '+' : ''}${changeOf(d.data)}%)`);
}

loadHeatmap();
setInterval(loadHeatmap, CONFIG.REFRESH_INTERVAL * 1000);

// إعادة الرسم لو تغير حجم الشاشة (مثلاً تدوير الجوال)
window.addEventListener('resize', () => {
  clearTimeout(window._heatmapResizeT);
  window._heatmapResizeT = setTimeout(loadHeatmap, 250);
});
