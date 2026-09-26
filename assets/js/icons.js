/* ==========================================================================
   Icônes SVG intégrées (pas d'images externes) — style "sérigraphie PCB"
   ========================================================================== */

const ICONS = {
  developpement: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="10" y="14" width="44" height="30" rx="2"/>
    <path d="M20 24l-6 6 6 6M44 24l6 6-6 6M36 22l-8 20"/>
    <path d="M24 50h16" stroke-opacity=".5"/>
  </svg>`,
  affichage: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="8" y="12" width="48" height="32" rx="2"/>
    <path d="M16 46h32M24 52h16"/>
    <circle cx="32" cy="28" r="7"/>
  </svg>`,
  alimentation: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="18" y="8" width="28" height="48" rx="3"/>
    <path d="M26 8V4h12v4M26 16h12M32 26v8M27 34h10l-10 12h10"/>
  </svg>`,
  composants: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="20" y="20" width="24" height="24" rx="2"/>
    <path d="M28 20v-8M36 20v-8M28 52v-8M36 52v-8M20 28h-8M20 36h-8M44 28h8M44 36h8"/>
  </svg>`,
  outils: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M42 12a10 10 0 0 0-13 13L10 44l6 6 19-19a10 10 0 0 0 13-13l-7 7-6-6z"/>
  </svg>`,
  robotique: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="14" y="22" width="36" height="26" rx="4"/>
    <circle cx="25" cy="34" r="3" fill="currentColor" stroke="none"/>
    <circle cx="39" cy="34" r="3" fill="currentColor" stroke="none"/>
    <path d="M32 22v-8M24 14h16M10 30v10M54 30v10"/>
  </svg>`
};

function categoryIcon(cat, cls){
  return ICONS[cat] ? ICONS[cat].replace('<svg ', `<svg class="${cls||''}" `) : ICONS.composants;
}

const CART_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`;
const MENU_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
