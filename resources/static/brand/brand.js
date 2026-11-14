// The aidenkt palette. Order and names are Aiden's. The third value is the label color on the swatch (1 = dark text).
const COLORS = [
  ['Aiden Red', '#E41D4C', 0], ['ID Coral', '#FF566A', 0], ['3DS Red', '#B5121B', 0], ['Dragon Red', '#7D3230', 0],
  ['Strawberry Lemonade', '#F76D53', 0], ['Overwatch Orange', '#FF7D25', 1], ['Iced Latte', '#755640', 0], ['Mocha', '#563A26', 0],
  ['Creamsicle', '#FCE3C8', 1], ['Starlight Gold', '#DCA021', 1], ['Berkeley Yellow', '#FBC81F', 1], ['Glasses Green', '#919762', 0],
  ['Bot Green', '#5FE21D', 1], ['LAX Mint', '#B6EAB6', 1], ['Reveria Green', '#36FD98', 1], ['Matcha', '#0A864C', 0],
  ['Payback Pine', '#14452F', 0], ['KT Green', '#29EA97', 1], ['Scout Teal', '#08C6BE', 1], ['Park Sky', '#5FE4FF', 1],
  ['Space', '#1C3249', 0], ['Airport Blue', '#69A6FD', 1], ['Snow', '#BAC1CB', 1], ['Persian Sapphire', '#0445DF', 0],
  ['Stardust Blue', '#225FFD', 0], ['After Hours Indigo', '#252452', 0], ['Early Purple', '#7367FF', 0], ['Coastal Lavender', '#D4CDFF', 1],
  ['Turn Back Purple', '#6728EF', 0], ['Booster Orchid', '#E46BF4', 0], ['Held Violet', '#DE5BB6', 0], ['Disney Pink', '#FC2F99', 0],
  ['Tech White', '#FDFFFF', 1], ['House White', '#FBF7F0', 1], ['Titanium', '#8F8A82', 0], ['iPhone Gray', '#534D5B', 0],
  ['Charcoal', '#4D4947', 0], ['Black', '#0D0D0D', 0],
];
const EDGE = new Set(['Tech White', 'House White', 'Black']);   // swatches that need an outline against the page

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
function oklch(hex) {
  const [r, g, b] = rgb(hex).map((v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.hypot(A, B);
  const H = C < 0.002 ? 0 : (Math.atan2(B, A) * 180 / Math.PI + 360) % 360;
  return `oklch(${L.toFixed(2)} ${C.toFixed(2)} ${Math.round(H)})`;
}
const FORMATS = { hex: (h) => h, rgb: (h) => `rgb(${rgb(h).join(' ')})`, oklch };
const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

let fmt = 'hex';
const grid = document.getElementById('grid');
const live = document.getElementById('live');

document.getElementById('strip').innerHTML = COLORS.map(([, hex]) => `<i style="background:${hex}"></i>`).join('');

function draw() {
  grid.innerHTML = '';
  for (const [name, hex, dark] of COLORS) {
    const value = FORMATS[fmt](hex);
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'sw' + (EDGE.has(name) ? ' edge' : '');
    b.style.setProperty('--c', hex);
    b.style.setProperty('--t', dark ? '#0D0D0D' : '#FDFFFF');
    b.setAttribute('aria-label', `${name}, ${value}. Copy.`);
    b.innerHTML = `<em>Copied</em><b>${name}</b><code>${value}</code>`;
    b.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(value); } catch (e) { return; }
      b.classList.add('done'); live.textContent = `Copied ${name}, ${value}`;
      setTimeout(() => b.classList.remove('done'), 1200);
    });
    grid.appendChild(b);
  }
}
draw();

for (const btn of document.querySelectorAll('.seg button')) {
  btn.addEventListener('click', () => {
    fmt = btn.dataset.fmt;
    document.querySelectorAll('.seg button').forEach((x) => x.setAttribute('aria-pressed', String(x === btn)));
    draw();
  });
}

function save(name, text, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
const FILES = {
  css: () => save('aidenkt-colors.css',
    ':root {\n' + COLORS.map(([n, h]) => `  --${slug(n)}: ${h};`).join('\n') + '\n}\n', 'text/css'),
  json: () => save('aidenkt-colors.json',
    JSON.stringify(COLORS.map(([n, h]) => ({ name: n, hex: h, rgb: rgb(h), oklch: oklch(h) })), null, 2) + '\n', 'application/json'),
};
for (const btn of document.querySelectorAll('[data-file]')) btn.addEventListener('click', () => FILES[btn.dataset.file]());
