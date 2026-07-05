/**
 * itemVisual.js
 * يفكك اسم العنصر (مثلاً "خاتم الرعد") إلى نوع + صفة،
 * ويرجع HTML جاهز لعرض الأيقونة + تأثير الطابع + توهج الندرة.
 *
 * ترتيب التحميل بالـ HTML (بعد config.js وقبل shop.js):
 *   link rel="stylesheet" href="css/item-fx.css"
 *   script src="js/type-icons.js"
 *   script src="js/adjective-themes.js"
 *   script src="js/itemVisual.js"
 *   script src="js/shop.js"
 *
 * الاستخدام داخل shop.js أو player.js:
 *   container.innerHTML = renderItemIcon(item.name, item.rarity);
 *
 * يعتمد على المتغيرات العامة TYPE_ICONS و ADJECTIVE_THEMES
 * المعرّفة بملفي type-icons.js و adjective-themes.js.
 */

// نفس ترتيب الندرة المعتمد بالمشروع
const RARITY_COLORS = {
  'شائع':     '#a0a0a0',
  'غير شائع': '#3498db',
  'نادر':     '#9b59b6',
  'ملحمي':    '#f1c40f',
  'أسطوري':   '#ff4444',
  'خرافي':    '#00eeff',
  'فريد':     '#ffd700',
};

// أسماء العناصر الخاصة جداً (أسطوري/خرافي/فريد) اللي ما تتبع نمط "نوع + صفة"
const SPECIAL_ITEM_VISUALS = {
  'عرش الآلهة':          { type: 'تاج',   theme: 'royal',  color: '#f1c40f' },
  'مطرقة الفناء':        { type: 'مطرقة', theme: 'shadow', color: '#8b0000' },
  'تاج الكون':           { type: 'تاج',   theme: 'cosmic', color: '#8a50ff' },
  'روح الأزل':           { type: 'روح',   theme: 'cosmic', color: '#c084fc' },
  'سيف الخلق':           { type: 'سيف',   theme: 'holy',   color: '#fff4c2' },
  'درع الأبدية':         { type: 'درع',   theme: 'cosmic', color: '#c084fc' },
  'كتاب الكون':          { type: 'كتاب',  theme: 'cosmic', color: '#8a50ff' },
  'عصا الأقدار':         { type: 'عصا',   theme: 'cosmic', color: '#c084fc' },
  'خاتم الزمن':          { type: 'خاتم',  theme: 'cosmic', color: '#8a50ff' },
  'قلادة الكواكب':       { type: 'قلادة', theme: 'cosmic', color: '#c084fc' },
  'قلب التنين الأبدي':   { type: 'قلب',   theme: 'fire',   color: '#ff5e2d' },
  'جوهرة نهاية العالم':  { type: 'جوهرة', theme: 'shadow', color: '#8b0000' },
  'صولجان إله الظلام':   { type: 'صولجان',theme: 'shadow', color: '#7a3fa0' },
  'تاج ملك الجن':        { type: 'تاج',   theme: 'shadow', color: '#a80000' },
  'روح الإله المنسي':    { type: 'روح',   theme: 'shadow', color: '#6b6b8a' },
  'الشيء الذي لا يُسمى': { type: 'طلسم',  theme: 'cosmic', color: '#ffffff' },
  'ظل الوجود الأول':     { type: 'روح',   theme: 'shadow', color: '#3a3a4a' },
  'الفراغ المطلق':       { type: 'بلورة', theme: 'cosmic', color: '#000000' },
};

const FX_TEMPLATES = {
  fire:    () => `<div class="flame"></div><div class="flame"></div><div class="flame"></div>`,
  ice:     () => `<div class="shard"></div><div class="shard"></div><div class="shard"></div>`,
  thunder: () => `<div class="bolt"></div><div class="bolt"></div>`,
  royal:   () => `<div class="ray"></div><div class="ray"></div><div class="ray"></div><div class="ray"></div>`,
  shadow:  () => `<div class="wisp"></div><div class="wisp"></div>`,
  cosmic:  () => `<div class="star"></div><div class="star"></div><div class="star"></div>`,
  holy:    () => `<div class="beam"></div><div class="beam"></div><div class="beam"></div>`,
  wind:    () => `<div class="gust"></div><div class="gust"></div><div class="gust"></div>`,
  water:   () => `<div class="bubble"></div><div class="bubble"></div>`,
  desert:  () => `<div class="grain"></div><div class="grain"></div><div class="grain"></div>`,
  forest:  () => `<div class="leaf"></div><div class="leaf"></div>`,
  ancient: () => `<div class="crack"></div><div class="crack"></div>`,
  tint:    () => ``,
};

/**
 * يفكك اسم العنصر إلى {type, adjective} — أول كلمة = النوع، البقية = الصفة
 * (تدعم صفات مركبة من كلمتين مثل "التنين الأبدي").
 */
function splitItemName(name) {
  const parts = name.trim().split(/\s+/);
  const type = parts[0];
  const adjective = parts.slice(1).join(' ');
  return { type, adjective };
}

/**
 * يحدد النوع + الطابع + اللون لأي اسم عنصر.
 */
function resolveItemVisual(name) {
  if (SPECIAL_ITEM_VISUALS[name]) {
    return SPECIAL_ITEM_VISUALS[name];
  }

  const { type, adjective } = splitItemName(name);
  const themeInfo = ADJECTIVE_THEMES[adjective];

  if (themeInfo) {
    return { type, theme: themeInfo.theme, color: themeInfo.color };
  }

  // احتياط: صفة غير معروفة -> بدون تأثير خاص، تلوين محايد بدل ما ينكسر العرض
  return { type, theme: 'tint', color: '#8a8a8a' };
}

/**
 * يرجع HTML كامل جاهز للحقن المباشر في بطاقة العنصر.
 * @param {string} name   اسم العنصر الكامل (مثال: "خاتم الرعد")
 * @param {string} rarity اسم الندرة بالعربي (مثال: "نادر")
 */
function renderItemIcon(name, rarity) {
  const { type, theme, color } = resolveItemVisual(name);
  const iconSvg = TYPE_ICONS[type];
  const ringColor = RARITY_COLORS[rarity] || RARITY_COLORS['شائع'];

  if (!iconSvg) {
    console.warn(`[itemVisual] لا توجد أيقونة للنوع: "${type}" (من العنصر: "${name}")`);
    return `
      <div class="icon-stage" style="--ring-color:${ringColor}">
        <div class="rarity-ring"></div>
        <div style="font-size:28px">📦</div>
      </div>`;
  }

  return `
    <div class="icon-stage" style="--ring-color:${ringColor}">
      <div class="fx fx-${theme}" style="--fx-color:${color}">${FX_TEMPLATES[theme]()}</div>
      <div class="rarity-ring"></div>
      <div style="color:${color}">${iconSvg}</div>
    </div>`;
}
