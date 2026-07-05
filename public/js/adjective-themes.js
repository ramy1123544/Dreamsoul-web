// خريطة: صفة العنصر -> {theme, color} (طابع التأثير البصري ولونه)
const ADJECTIVE_THEMES = {
  "الظلال": {
    "theme": "shadow",
    "color": "#9b59b6"
  },
  "التنين": {
    "theme": "fire",
    "color": "#ff5e2d"
  },
  "الملكي": {
    "theme": "royal",
    "color": "#f1c40f"
  },
  "القديم": {
    "theme": "ancient",
    "color": "#a68a5b"
  },
  "السحري": {
    "theme": "cosmic",
    "color": "#c084fc"
  },
  "المقدس": {
    "theme": "holy",
    "color": "#fff4c2"
  },
  "الأبدي": {
    "theme": "cosmic",
    "color": "#c084fc"
  },
  "المحترق": {
    "theme": "fire",
    "color": "#ff3d00"
  },
  "الجليدي": {
    "theme": "ice",
    "color": "#55e5ff"
  },
  "الريحي": {
    "theme": "wind",
    "color": "#a8e6cf"
  },
  "الصاعق": {
    "theme": "thunder",
    "color": "#55e5ff"
  },
  "السامي": {
    "theme": "holy",
    "color": "#fff4c2"
  },
  "المظلم": {
    "theme": "shadow",
    "color": "#7a3fa0"
  },
  "النوري": {
    "theme": "holy",
    "color": "#ffe680"
  },
  "الفضي": {
    "theme": "tint",
    "color": "#cfd8dc"
  },
  "الذهبي": {
    "theme": "royal",
    "color": "#f1c40f"
  },
  "الكوني": {
    "theme": "cosmic",
    "color": "#8a50ff"
  },
  "المنسي": {
    "theme": "shadow",
    "color": "#6b6b8a"
  },
  "المقدار": {
    "theme": "cosmic",
    "color": "#c084fc"
  },
  "الغامض": {
    "theme": "shadow",
    "color": "#7a3fa0"
  },
  "الملعون": {
    "theme": "shadow",
    "color": "#8b0000"
  },
  "المبارك": {
    "theme": "holy",
    "color": "#ffe680"
  },
  "المجهول": {
    "theme": "shadow",
    "color": "#6b6b8a"
  },
  "الأسطوري": {
    "theme": "royal",
    "color": "#ff4444"
  },
  "الخالد": {
    "theme": "cosmic",
    "color": "#c084fc"
  },
  "الشيطاني": {
    "theme": "shadow",
    "color": "#a80000"
  },
  "الإلهي": {
    "theme": "holy",
    "color": "#fff4c2"
  },
  "الأحمر": {
    "theme": "tint",
    "color": "#ff4444"
  },
  "الأزرق": {
    "theme": "tint",
    "color": "#3498db"
  },
  "الأخضر": {
    "theme": "tint",
    "color": "#2ecc71"
  },
  "الأسود": {
    "theme": "tint",
    "color": "#3a3a4a"
  },
  "الأبيض": {
    "theme": "tint",
    "color": "#f0f0f5"
  },
  "المنهوب": {
    "theme": "ancient",
    "color": "#a68a5b"
  },
  "المكسور": {
    "theme": "ancient",
    "color": "#8a8a8a"
  },
  "الحي": {
    "theme": "forest",
    "color": "#4caf50"
  },
  "الميت": {
    "theme": "shadow",
    "color": "#5a5a5a"
  },
  "الطائر": {
    "theme": "wind",
    "color": "#a8e6cf"
  },
  "الغارق": {
    "theme": "water",
    "color": "#2196f3"
  },
  "المتجمد": {
    "theme": "ice",
    "color": "#55e5ff"
  },
  "المشتعل": {
    "theme": "fire",
    "color": "#ff7b3d"
  },
  "الروحاني": {
    "theme": "cosmic",
    "color": "#c084fc"
  },
  "السماوي": {
    "theme": "holy",
    "color": "#87ceeb"
  },
  "الأرضي": {
    "theme": "forest",
    "color": "#8b5e34"
  },
  "البحري": {
    "theme": "water",
    "color": "#2196f3"
  },
  "الصحراوي": {
    "theme": "desert",
    "color": "#e2b04a"
  },
  "الجبلي": {
    "theme": "ancient",
    "color": "#8a8a8a"
  },
  "الغابوي": {
    "theme": "forest",
    "color": "#2e7d32"
  },
  "الليلي": {
    "theme": "shadow",
    "color": "#2c2c54"
  },
  "الصباحي": {
    "theme": "holy",
    "color": "#ffd580"
  },
  "الزمني": {
    "theme": "cosmic",
    "color": "#8a50ff"
  }
};
