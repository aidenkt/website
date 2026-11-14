// The aidenkt palette. Order and names are Aiden's. Third value: 1 = dark label on the swatch. Fourth: where it came from.
const COLORS = [
  ['Aiden Red', '#E41D4C', 0], ['ID Coral', '#FF566A', 0, "The color I used to promote digital student IDs.", ["https://aidenkt.medium.com/launching-digital-student-ids-to-over-13-000-students-without-storing-anything-82f891c27f06", "Read the article"]], ['3DS Red', '#B5121B', 0, 'My Flame Red 3DS.'],
  ['Dragon Red', '#7D3230', 0, "The red paint on my elementary school."], ['Strawberry Lemonade', '#F76D53', 0, "The color of my playlist about the sunset, my favorite playlist."], ['Overwatch Orange', '#FF7D25', 1, "From my time as an administrator of r/Overwatch2."],
  ['Iced Latte', '#755640', 0, "My default coffee order."], ['Mocha', '#563A26', 0, "The dark part of my Caramel playlist cover."],
  ['Creamsicle', '#FCE3C8', 1, "A friend's playlist cover."], ['Starlight Gold', '#DCA021', 1, "The color the lights in my room at home in San Diego turn in the evening."],
  ['Berkeley Yellow', '#FBC81F', 1], ['Glasses Green', '#919762', 0, 'My Warby Parker Carltons, in Seaweed Crystal.'],
  ['Bot Green', '#5FE21D', 1, "The green end of the Lounge logo."],
  ['LAX Mint', '#B6EAB6', 1, 'The arrivals wall at Tom Bradley, LAX.'], ['Reveria Green', '#36FD98', 1, "The brand color of my first Minecraft server."], ['Matcha', '#0A864C', 0, "One of my playlist covers."],
  ['Payback Pine', '#14452F', 0, 'The ink on the Pay Aiden specimen.'], ['KT Green', '#29EA97', 1, "A mint green from the Dorms app."], ['Scout Teal', '#08C6BE', 1, "The accent color of Scout."],
  ['Park Sky', '#5FE4FF', 1, "The color of my first public Discord bot."], ['Space', '#1C3249', 0, "My Space playlist cover."],
  ['Airport Blue', '#69A6FD', 1, 'The arrivals wall at Tom Bradley, LAX.'], ['Snow', '#BAC1CB', 1, "The color of snow at Mammoth Mountain."],
  ['Persian Sapphire', '#0445DF', 0, 'My playlist called Cobalt.'],
  ['Stardust Blue', '#225FFD', 0, "The UI color of a testing portal for my first startup."], ['After Hours Indigo', '#252452', 0, "The theme color of my Discord podcast, Discord After Hours w/ Aiden. It peaked at 120 listeners."], ['Early Purple', '#7367FF', 0, "The brand color of Early, my first startup, now defunct.", ["https://aidenkt.medium.com", "Read about it"]], ['Coastal Lavender', '#D4CDFF', 1, "From CoastalCare, an advanced business project."],
  ['Turn Back Purple', '#6728EF', 0, "The color the lights in my room at home in San Diego turn in the evening."], ['Booster Orchid', '#E46BF4', 0, "Discord's booster color."], ['Held Violet', '#DE5BB6', 0, "The color of Newbies, the playlist where new songs I discover are held."], ['Disney Pink', '#FC2F99', 0, "From a brighter version of this site's background that I never switched on."],
  ['Tech White', '#FDFFFF', 1], ['House White', '#FBF7F0', 1, 'The cream from CollegeOS.'], ['Titanium', '#8F8A82', 0, "My Apple Watch Series 10, in natural titanium."],
  ['iPhone Gray', '#534D5B', 0, 'My iPhone 14 Pro, Deep Purple.'], ['Charcoal', '#4D4947', 0, "The color of New York City."], ['Black', '#0D0D0D', 0],
];
const LOGO_GREEN = ['Logo Green', '#15DD7D', 0, 'The green of the wordmark and the mark.'];
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
  const [name, hex, dark, story, link] = color;
  const root = document.documentElement.style;
  root.setProperty('--accent', hex);
  root.setProperty('--on-accent', dark ? '#0D0D0D' : '#FDFFFF');
  document.querySelector('meta[name="theme-color"]').content = hex;
  $('hero-name').textContent = name; $('hero-hex').textContent = hex;
  $('d-name').textContent = name;
  const st = $('d-story'); st.textContent = story || '';
  if (link) {
    const a = document.createElement('a'); a.href = link[0]; a.textContent = link[1]; a.target = '_blank'; a.rel = 'noopener';
    st.append(' ', a);
  }
  const rows = [['HEX', hex], ['RGB', `rgb(${rgb(hex).join(' ')})`], ['OKLCH', oklch(hex)],
                ...(color === LOGO_GREEN ? [] : [['CSS', `var(--${slug(name)})`]])];
  $('d-values').innerHTML = rows.map(([k, v]) => `<button type="button" data-copy="${v}"><span>${k}</span><span>${v}</span></button>`).join('')
    + `<button type="button" class="static" tabindex="-1"><span>On white / on black</span><span>${contrast(hex, '#FFFFFF')} · ${contrast(hex, '#000000')}</span></button>`;
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
  navigator.clipboard.writeText(b.dataset.copy).then(() => { label.textContent = 'Copied'; setTimeout(() => { label.textContent = was; }, 1100); }).catch(() => {});
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
  themeBtn.lastElementChild.textContent = t === 'dark' ? 'Dark' : 'Light';
  themeBtn.setAttribute('aria-pressed', String(t === 'dark'));
  if (keep) { try { localStorage.setItem('brand-theme', t); } catch (e) {} }
}
setTheme(document.documentElement.dataset.theme || 'light', false);
themeBtn.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark', true));

// The signature is tied to scrolling: it is written as it rises through the screen and unwritten on the way back.
// Stroke order and relative speeds are Aiden's (from his recording); pauses are shortened so no scrolling is dead.
const sign = $('sign');
if (sign && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const pens = [...sign.querySelectorAll('.pen')].map((el) => ({
    el, len: parseFloat(el.style.getPropertyValue('--len')), at: parseFloat(el.style.getPropertyValue('--at')) }));
  let clock = 0, last = 0;
  for (const p of pens) {               // rebuild the timeline with every pause capped
    clock += Math.min(p.at - last, 0.1); p.from = clock; clock += p.len; last = p.at + p.len;
  }
  const total = clock;
  const ease = (x) => x * x * (3 - 2 * x);
  let queued = false;
  const draw = () => {
    queued = false;
    const r = sign.getBoundingClientRect(), vh = window.innerHeight;
    // starts once "Only then I sign" has finished lighting (signature top 76% down the screen) and
    // finishes a short scroll later (top 50% down)
    const start = vh * 0.76, end = vh * 0.50;
    const t = Math.max(0, Math.min(1, (start - r.top) / (start - end))) * total;
    for (const p of pens) {
      const x = Math.max(0, Math.min(1, (t - p.from) / p.len));
      p.el.style.strokeDashoffset = String(1 - ease(x));
      p.el.style.opacity = x > 0 ? '1' : '0';
    }
  };
  const ask = () => { if (!queued) { queued = true; requestAnimationFrame(draw); } };
  addEventListener('scroll', ask, { passive: true }); addEventListener('resize', ask);
  draw();
}

// The statement lights up as you read down it: each word goes from dim to full as it passes the reading line,
// left to right within a line, and dims again when you scroll back up.
const lines = [...document.querySelectorAll('.statement')];
if (lines.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const words = [];
  for (const p of lines) {
    for (const node of [...p.childNodes]) {
      if (node.nodeType !== 3) continue;                      // keep the <br>s where they are
      const frag = document.createDocumentFragment();
      for (const part of node.textContent.split(/(\s+)/)) {
        if (!part.trim()) { frag.append(part); continue; }
        const s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.append(s); words.push({ el: s });
      }
      node.replaceWith(frag);
    }
  }
  const measure = () => {
    for (const w of words) {
      const r = w.el.getBoundingClientRect();
      w.y = r.top + scrollY + r.height / 2; w.x = r.left / Math.max(1, innerWidth); w.h = r.height;
    }
  };
  let pending = false;
  const light = () => {
    pending = false;
    const vh = innerHeight, from = vh * 0.80, band = vh * 0.20;
    for (const w of words) {
      const y = w.y - scrollY + w.x * w.h * 1.6;              // words further right light a little later
      const lit = Math.max(0, Math.min(1, (from - y) / band));
      w.el.style.setProperty('--lit', (0.22 + 0.78 * lit).toFixed(3));
    }
  };
  const tick = () => { if (!pending) { pending = true; requestAnimationFrame(light); } };
  measure(); light();
  addEventListener('scroll', tick, { passive: true });
  addEventListener('resize', () => { measure(); tick(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); tick(); });
}
