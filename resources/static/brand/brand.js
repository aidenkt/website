// The aidenkt palette. Order and names are Aiden's. Third value: 1 = dark label on the swatch. Fourth: where it came from.
const COLORS = [
  ['Aiden Red', '#E41D4C', 0], ['ID Coral', '#FF566A', 0], ['3DS Red', '#B5121B', 0, 'my flame red 3ds.'],
  ['Dragon Red', '#7D3230', 0], ['Strawberry Lemonade', '#F76D53', 0], ['Overwatch Orange', '#FF7D25', 1],
  ['Iced Latte', '#755640', 0, 'my playlist called caramel.'], ['Mocha', '#563A26', 0],
  ['Creamsicle', '#FCE3C8', 1], ['Starlight Gold', '#DCA021', 1, "the amber in the aiden's lounge logo."],
  ['Berkeley Yellow', '#FBC81F', 1], ['Glasses Green', '#919762', 0, 'my warby parker carltons, in seaweed crystal.'],
  ['Bot Green', '#5FE21D', 1, "the green end of the lounge logo."],
  ['LAX Mint', '#B6EAB6', 1, 'the arrivals wall at tom bradley, lax.'], ['Reveria Green', '#36FD98', 1], ['Matcha', '#0A864C', 0],
  ['Payback Pine', '#14452F', 0, 'the ink on the pay aiden specimen.'], ['KT Green', '#29EA97', 1], ['Scout Teal', '#08C6BE', 1],
  ['Park Sky', '#5FE4FF', 1], ['Space', '#1C3249', 0],
  ['Airport Blue', '#69A6FD', 1, 'the arrivals wall at tom bradley, lax.'], ['Snow', '#BAC1CB', 1],
  ['Persian Sapphire', '#0445DF', 0, 'my playlist called cobalt.'],
  ['Stardust Blue', '#225FFD', 0], ['After Hours Indigo', '#252452', 0], ['Early Purple', '#7367FF', 0], ['Coastal Lavender', '#D4CDFF', 1],
  ['Turn Back Purple', '#6728EF', 0], ['Booster Orchid', '#E46BF4', 0], ['Held Violet', '#DE5BB6', 0], ['Disney Pink', '#FC2F99', 0],
  ['Tech White', '#FDFFFF', 1], ['House White', '#FBF7F0', 1, 'the cream from collegeos.'], ['Titanium', '#8F8A82', 0],
  ['iPhone Gray', '#534D5B', 0, 'my iphone 14 pro, deep purple.'], ['Charcoal', '#4D4947', 0], ['Black', '#0D0D0D', 0],
];
const LOGO_GREEN = ['Logo Green', '#15DD7D', 0, 'the green of the wordmark and the mark.'];
const EDGE = new Set(['Tech White', 'House White']);
const MARK = 'M0 0h152v473H0zM321 0h387v473H556V121H403l-63 74 172 278H333L232 296V107zM788 0h75v121h-75z';

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
function oklch(hex) {
  const [r, g, b] = rgb(hex).map(lin);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.hypot(A, B);
  return `oklch(${L.toFixed(2)} ${C.toFixed(2)} ${Math.round(C < 0.002 ? 0 : (Math.atan2(B, A) * 180 / Math.PI + 360) % 360)})`;
}
const lum = (hex) => { const [r, g, b] = rgb(hex).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return ((x + 0.05) / (y + 0.05)).toFixed(1) + ' : 1'; };
const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const $ = (id) => document.getElementById(id);

const grid = $('grid');
let current = LOGO_GREEN;

function pick(color, copy) {
  current = color;
  const [name, hex, dark, story] = color;
  const root = document.documentElement.style;
  root.setProperty('--accent', hex);
  root.setProperty('--on-accent', dark ? '#0D0D0D' : '#FDFFFF');
  document.querySelector('meta[name="theme-color"]').content = hex;
  $('hero-name').textContent = name; $('hero-hex').textContent = hex;
  $('d-name').textContent = name; $('d-story').textContent = story || '';
  const rows = [['hex', hex], ['rgb', `rgb(${rgb(hex).join(' ')})`], ['oklch', oklch(hex)],
                ...(color === LOGO_GREEN ? [] : [['css', `var(--${slug(name)})`]])];
  $('d-values').innerHTML = rows.map(([k, v]) => `<button type="button" data-copy="${v}"><span>${k}</span><span>${v}</span></button>`).join('')
    + `<button type="button" class="static" tabindex="-1"><span>on white / on black</span><span>${contrast(hex, '#FFFFFF')} · ${contrast(hex, '#000000')}</span></button>`;
  for (const b of grid.children) b.setAttribute('aria-pressed', String(b.dataset.hex === hex));
  if (copy && navigator.clipboard) navigator.clipboard.writeText(hex).catch(() => {});
}

for (const color of COLORS) {
  const [name, hex, dark] = color;
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'sw' + (EDGE.has(name) ? ' edge' : ''); b.dataset.hex = hex;
  b.style.setProperty('--c', hex); b.style.setProperty('--t', dark ? '#0D0D0D' : '#FDFFFF');
  b.setAttribute('aria-label', `${name}, ${hex}`); b.setAttribute('aria-pressed', 'false');
  b.innerHTML = `<b>${name}</b><code>${hex}</code>`;
  b.addEventListener('click', () => pick(color, true));
  grid.appendChild(b);
}

$('d-values').addEventListener('click', (e) => {
  const b = e.target.closest('[data-copy]'); if (!b || !navigator.clipboard) return;
  const label = b.firstElementChild, was = label.textContent;
  navigator.clipboard.writeText(b.dataset.copy).then(() => { label.textContent = 'copied'; setTimeout(() => { label.textContent = was; }, 1100); }).catch(() => {});
});

// the hero mark steps through the palette
$('shuffle').addEventListener('click', () => {
  const pool = COLORS.filter((c) => c[1] !== current[1] && !EDGE.has(c[0]));
  pick(pool[Math.floor(Math.random() * pool.length)], false);
});

$('icons').innerHTML = COLORS.map(([, hex, dark]) =>
  `<i style="--c:${hex};--t:${dark ? '#0D0D0D' : '#FDFFFF'}"><svg class="kt"><use href="#kt"/></svg></i>`).join('');

pick(LOGO_GREEN, false);

function save(name, text, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
const svg = (fill) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 863 473"><path fill="${fill}" d="${MARK}"/></svg>\n`;
const FILES = {
  'svg-black': () => save('aidenkt-kt-black.svg', svg('#0D0D0D'), 'image/svg+xml'),
  'svg-white': () => save('aidenkt-kt-white.svg', svg('#FDFFFF'), 'image/svg+xml'),
  'svg-green': () => save('aidenkt-kt-green.svg', svg('#15DD7D'), 'image/svg+xml'),
  css: () => save('aidenkt-colors.css', ':root {\n' + COLORS.map(([n, h]) => `  --${slug(n)}: ${h};`).join('\n') + '\n}\n', 'text/css'),
  json: () => save('aidenkt-colors.json',
    JSON.stringify(COLORS.map(([n, h]) => ({ name: n, hex: h, rgb: rgb(h), oklch: oklch(h) })), null, 2) + '\n', 'application/json'),
};
for (const btn of document.querySelectorAll('[data-file]')) btn.addEventListener('click', () => FILES[btn.dataset.file]());

// light / dark switch: follows the system until chosen, then remembers the choice
const themeBtn = $('theme');
function setTheme(t, keep) {
  document.documentElement.dataset.theme = t;
  themeBtn.lastElementChild.textContent = t === 'dark' ? 'dark' : 'light';
  themeBtn.setAttribute('aria-pressed', String(t === 'dark'));
  if (keep) { try { localStorage.setItem('brand-theme', t); } catch (e) {} }
}
setTheme(document.documentElement.dataset.theme || 'light', false);
themeBtn.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark', true));
