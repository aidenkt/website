// The aidenkt palette. Names are Aiden's; the display order is set by ORDER below. Third value: 1 = dark label on the swatch. Fourth: where it came
// from. Fifth (optional): [address, the words in the origin that link to it].
const COLORS = [
  ['Aiden Red', '#E41D4C', 0, "My favorite shade of red, and the color I used to identify myself from ages 5 to 18, before switching to green."], ['ID Coral', '#FF566A', 0, "The color of the digital student IDs I built for my high school.", ["https://aidenkt.medium.com/launching-digital-student-ids-to-over-13-000-students-without-storing-anything-82f891c27f06", "digital student IDs"]], ['3DS Red', '#B5121B', 0, "The color of my first ever Nintendo 3DS, a very bright flame red.", ["https://en.wikipedia.org/wiki/Nintendo_3DS", "Nintendo 3DS"]],
  ['Dragon Red', '#7D3230', 0, "The red paint on my elementary school."], ['Strawberry Lemonade', '#F76D53', 0, "The color of my playlist about the sunset, my favorite playlist."], ['Overwatch Orange', '#FF7D25', 1, "From my time as an administrator of r/Overwatch2.", ["https://www.reddit.com/r/Overwatch2/", "r/Overwatch2"]],
  ['Iced Latte', '#755640', 0, "My default coffee order."], ['Mocha', '#563A26', 0, "The dark part of my Caramel playlist cover."],
  ['Creamsicle', '#FCE3C8', 1, "A friend's playlist cover."], ['Starlight Gold', '#DCA021', 1, "The color the lights in my room at home in San Diego turn in the evening."],
  ['Berkeley Yellow', '#FBC81F', 1, "The yellow of the University of California, Berkeley.", ["https://www.berkeley.edu/", "University of California, Berkeley"]], ['Glasses Green', '#919762', 0, 'My Warby Parker Carltons, in Seaweed Crystal.'],
  ['Bot Green', '#5FE21D', 1, "The green end of the Lounge logo."],
  ['LAX Mint', '#B6EAB6', 1, 'The arrivals wall at Tom Bradley, LAX.'], ['Reveria Green', '#36FD98', 1, "The brand color of my first Minecraft server."], ['Matcha', '#0A864C', 0, "One of my playlist covers."],
  ['Payback Pine', '#14452F', 0, 'The ink on the Pay Aiden specimen.'], ['KT Green', '#15DD7D', 0, "Derived from Reveria Green, and now my primary brand color on the internet."], ['Scout Teal', '#08C6BE', 1, "The accent color of Scout, an app to map college campuses."],
  ['Park Sky', '#5FE4FF', 1, "The color of my first public Discord bot, ParksBot, which let users track theme park wait times.", ["https://aidenkt.medium.com/alium-progress-report-bye-bye-parksbot-4e4f304c35bc", "ParksBot"]], ['Space', '#1C3249', 0, "My Space playlist cover."],
  ['Airport Blue', '#69A6FD', 1, 'The arrivals wall at Tom Bradley, LAX.'], ['Snow', '#BAC1CB', 1, "The color of snow at Mammoth Mountain.", ["https://www.mammothmountain.com/", "Mammoth Mountain"]],
  ['Persian Sapphire', '#0445DF', 0, 'My playlist called Cobalt.'],
  ['Stardust Blue', '#225FFD', 0, "The UI color of a testing portal for my first startup.", ["https://aidenkt.medium.com/alium-progress-report-project-stardust-the-maintenance-roadmap-and-the-future-of-parksbot-f0601546f704", "testing portal"]], ['After Hours Indigo', '#252452', 0, "The theme color of my Discord podcast, Discord After Hours w/ Aiden. It peaked at 120 listeners."], ['Early Purple', '#7367FF', 0, "The brand color of Early, my first startup, now defunct.", ["https://aidenkt.medium.com/the-state-of-alium-potatoes-development-where-weve-been-6d3f9f393399", "Early"]], ['Coastal Lavender', '#D4CDFF', 1, "From CoastalCare, an advanced business project."],
  ['Turn Back Purple', '#6728EF', 0, "The color the lights in my room at home in San Diego turn in the evening."], ['Elementary Purple', '#3F0585', 0, "The purple in my elementary school's logo."], ['Booster Orchid', '#E46BF4', 0, "Discord's booster color."], ['Held Violet', '#DE5BB6', 0, "The color of Newbies, the playlist where new songs I discover are held."], ['Disney Pink', '#FC2F99', 0, "The color I associate with Disneyland Park in California.", ["https://disneyland.disney.go.com/destinations/disneyland/", "Disneyland Park"]],
  ['Tech White', '#FDFFFF', 1, "The slightly too blue white that most tech people use, including me."], ['House White', '#FBF7F0', 1, "The eggshell white of houses built in the 90s, including my childhood home."], ['Titanium', '#8F8A82', 0, "My Apple Watch Series 10, in natural titanium."],
  ['iPhone Gray', '#534D5B', 0, 'My iPhone 14 Pro, Deep Purple.'], ['Charcoal', '#4D4947', 0, "The color of New York City."], ['Black', '#0D0D0D', 0, "I don't know what to say about black, lol."],
];
// Display order: around the color wheel, each family running into the next, with the darkest blues and purples meeting
// in the middle, then the warm neutrals, then white to black. Eight to a row, so the last row is the neutrals.
const ORDER = [
  'Aiden Red', 'ID Coral', '3DS Red', 'Dragon Red', 'Strawberry Lemonade', 'Overwatch Orange', 'Starlight Gold', 'Berkeley Yellow',
  'Glasses Green', 'Bot Green', 'LAX Mint', 'Reveria Green', 'KT Green', 'Matcha', 'Payback Pine', 'Scout Teal',
  'Park Sky', 'Airport Blue', 'Stardust Blue', 'Persian Sapphire', 'Space', 'After Hours Indigo', 'Elementary Purple', 'Turn Back Purple',
  'Early Purple', 'Coastal Lavender', 'Booster Orchid', 'Held Violet', 'Disney Pink', 'Creamsicle', 'Iced Latte', 'Mocha',
  'Tech White', 'House White', 'Snow', 'Titanium', 'iPhone Gray', 'Charcoal', 'Black',
];
COLORS.sort((a, b) => ORDER.indexOf(a[0]) - ORDER.indexOf(b[0]));
const KT_GREEN = COLORS.find((c) => c[0] === 'KT Green');   // the brand color; the page opens in it
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
let current = KT_GREEN;

function pick(color, copy) {
  current = color;
  const [name, hex, dark, story, link] = color;
  const root = document.documentElement.style;
  root.setProperty('--accent', hex);
  root.setProperty('--on-accent', dark ? '#0D0D0D' : '#FDFFFF');
  document.querySelector('meta[name="theme-color"]').content = hex;
  $('hero-name').textContent = name; $('hero-hex').textContent = hex;
  for (const cap of document.querySelectorAll('.picked-cap')) cap.textContent = `${dark ? 'Black' : 'White'} on What You Picked`;
  $('d-name').textContent = name;
  const st = $('d-story'); st.textContent = '';
  const at = link ? story.indexOf(link[1]) : -1;          // link = [address, the words in the story to link]
  if (at < 0) st.textContent = story || '';
  else {
    const a = document.createElement('a'); a.href = link[0]; a.textContent = link[1]; a.target = '_blank'; a.rel = 'noopener';
    st.append(story.slice(0, at), a, story.slice(at + link[1].length));
  }

  const rows = [['HEX', hex], ['RGB', `rgb(${rgb(hex).join(' ')})`], ['OKLCH', oklch(hex)],
                ['CSS', `var(--${slug(name)})`]];
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

// the row of small icons: pressing one puts that color on the examples above it (and the rest of the page)
for (const color of COLORS) {
  const [name, hex, dark] = color;
  const b = document.createElement('button');
  b.type = 'button'; b.setAttribute('aria-label', `Show the examples in ${name}`);
  b.style.setProperty('--c', hex); b.style.setProperty('--t', dark ? '#0D0D0D' : '#FDFFFF');
  b.innerHTML = '<svg class="kt"><use href="#kt"/></svg>';
  b.addEventListener('click', () => pick(color, false));
  $('icons').appendChild(b);
}

pick(KT_GREEN, false);

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

// Suggested mixes for interfaces. Every value is one of the palette's own colors, by name.
const PALETTES = [
  // name, then background, surface, text, secondary text, accent, accent 2
  ['KT', 'Tech White', 'House White', 'Black', 'iPhone Gray', 'KT Green', 'Payback Pine'],
  ['Aiden at School', 'House White', 'Tech White', 'Black', 'Titanium', 'Aiden Red', 'ID Coral'],
  ['Campus', 'Tech White', 'House White', 'Black', 'Titanium', 'KT Green', 'Scout Teal'],
  ['Scout', 'Tech White', 'House White', 'Black', 'Titanium', 'Scout Teal', 'Berkeley Yellow'],
  ['Taskmaster', 'Tech White', 'House White', 'Black', 'Titanium', 'Early Purple', 'Coastal Lavender'],
  ['Tester', 'Tech White', 'House White', 'Black', 'Titanium', 'Stardust Blue', 'Overwatch Orange'],
  ['Booster', 'Tech White', 'Coastal Lavender', 'Black', 'iPhone Gray', 'Turn Back Purple', 'Booster Orchid'],
  ['Sunset', 'House White', 'Creamsicle', 'Mocha', 'Iced Latte', 'Strawberry Lemonade', 'Starlight Gold'],
  ['KT at Night', 'Black', 'Charcoal', 'Tech White', 'Snow', 'KT Green', 'Reveria Green'],
  ['After Hours', 'After Hours Indigo', 'Elementary Purple', 'Tech White', 'Coastal Lavender', 'Early Purple', 'Booster Orchid'],
  ['Parks', 'Space', 'After Hours Indigo', 'Tech White', 'Snow', 'Disney Pink', 'Park Sky'],
  ['Berkeley', 'Space', 'Persian Sapphire', 'Tech White', 'Snow', 'Berkeley Yellow', 'Airport Blue'],
  ['Gold', 'Black', 'Charcoal', 'House White', 'Titanium', 'Starlight Gold', 'Creamsicle'],
  ['Wood', 'Mocha', 'Iced Latte', 'Creamsicle', 'Snow', 'Creamsicle', 'Strawberry Lemonade'],
  ['Neon', 'Black', 'Turn Back Purple', 'Tech White', 'Coastal Lavender', 'Disney Pink', 'Bot Green'],
  ['Flow', 'Black', 'Charcoal', 'Tech White', 'Titanium', 'Tech White', 'Snow'],
];
const ROLES = ['bg', 'surface', 'text', 'muted', 'accent', 'accent-2'];
const ROLE_LABELS = ['Background', 'Surface', 'Text', 'Secondary text', 'Accent', 'Accent 2'];
const byName = Object.fromEntries(COLORS.map((c) => [c[0], c]));
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const pals = $('pals');
if (pals) for (const [title, ...names] of PALETTES) {
  const cs = names.map((n) => byName[n]);
  const [bg, surface, text, muted, accent, accent2] = cs.map((c) => c[1]);
  const on = (c) => (ratio('#0D0D0D', c[1]) >= ratio('#FDFFFF', c[1]) ? '#0D0D0D' : '#FDFFFF');   // whichever reads better
  const card = document.createElement('article');
  card.className = 'pal';
  card.style.cssText = `--bg:${bg};--surface:${surface};--text:${text};--muted:${muted};--accent:${accent};--on-accent:${on(cs[4])};--accent2:${accent2};--on-accent2:${on(cs[5])}`;
  card.innerHTML = `
    <div class="pal-ui">
      <p class="pal-title">${title}</p>
      <div class="pal-panel"><span class="pal-bar"><i></i></span><span class="pal-chip">New</span></div>
      <div class="pal-actions"><span class="pal-btn">Continue</span><span class="pal-link">Not now</span></div>
    </div>
    <ul class="pal-roles">${cs.map((c, i) => `<li><i style="background:${c[1]}"></i><span>${ROLE_LABELS[i]}</span><b>${c[0]}</b></li>`).join('')}</ul>
    <div class="pal-foot"><span>Text on background ${ratio(text, bg).toFixed(1)} : 1</span><button type="button">Copy CSS</button></div>`;
  const btn = card.querySelector('button');
  btn.addEventListener('click', () => {
    const css = `/* aidenkt · ${title} */\n:root {\n` + cs.map((c, i) => `  --${ROLES[i]}: ${c[1]}; /* ${c[0]} */`).join('\n') + '\n}\n';
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(css).then(() => { btn.textContent = 'Copied'; setTimeout(() => { btn.textContent = 'Copy CSS'; }, 1100); }).catch(() => {});
  });
  pals.appendChild(card);
}

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

// Materials react to the pointer: each tile gets --mx and --my (-1 to 1 across it) and --on while it is inside.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  for (const el of document.querySelectorAll('.mat-surface')) {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 2 - 1).toFixed(3));
      el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 2 - 1).toFixed(3));
      el.style.setProperty('--on', '1');
    });
    el.addEventListener('pointerleave', () => { for (const k of ['--mx', '--my', '--on']) el.style.setProperty(k, '0'); });
  }
}

// Parchment: the lit plaster from the Garden sign-in, drawn by its fragment shader. Stains seep in from beyond the
// edges, spread with a ragged front, leave a tide line, dry and fade; a lamp in front of the page throws one soft pool
// of light, which here leans toward the pointer. Runs only while the tile is on screen, at about 30 frames a second.
(function () {
  const cv = $('plaster'); if (!cv) return;
  const gl = cv.getContext('webgl', { premultipliedAlpha: true, antialias: false, alpha: true });
  if (!gl) return;                                   // no WebGL: the plain parchment gradient is the whole effect
  const FRAG = `
precision mediump float;
uniform vec2 uRes; uniform float uT; uniform vec3 uCol; uniform float uStrength; uniform vec3 uLift; uniform float uStain; uniform vec3 uGlint; uniform float uSpark; uniform vec3 uSink; uniform vec2 uP;
float hash(float n) { return fract(sin(n) * 43758.5453); }
float h2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h2(i), h2(i + vec2(1., 0.)), f.x), mix(h2(i + vec2(0., 1.)), h2(i + vec2(1., 1.)), f.x), f.y); }
float fb(vec2 p) { float a = .5, s = 0.; for (int i = 0; i < 5; i++) { s += a * vn(p); p = p * 2.03 + vec2(17., 9.); a *= .5; } return s; }
void main() {
  vec2 uv = gl_FragCoord.xy / uRes; float asp = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * asp, uv.y);
  vec2 q = p * 1.5;
  vec2 flow = vec2(fb(q + vec2(0., uT * .011)), fb(q + vec2(5.2, -uT * .009)));
  float ragA = fb(p * 3.2 + flow), ragB = fb(p * 6.5 - flow + 11.);
  float fine = fb(p * 9. + flow) - .5;
  float lift = 0., sink = 0., tide = 0., wet = 0.;
  for (int i = 0; i < 6; i++) {
    float fi = float(i), period = 46. + fi * 9.;
    float ph = uT / period + fi * .37, k = floor(ph), f = fract(ph);
    float side = floor(h2(vec2(k, fi)) * 4.), along = h2(vec2(fi + 3.1, k)), off = .06 + .1 * h2(vec2(k + 2.2, fi));
    vec2 c = side < 1. ? vec2(along * asp, 1. + off) : side < 2. ? vec2(asp + off, along) : side < 3. ? vec2(along * asp, -off) : vec2(-off, along);
    float maxR = .42 + .4 * h2(vec2(k + 7., fi));
    float r = maxR * (1. - exp(-f * 4.2));
    float life = smoothstep(0., .03, f) * (1. - smoothstep(.62, 1., f));
    float an = h2(vec2(fi, k + 1.3)) * 6.283; vec2 dv = p - c; dv = vec2(dv.x * cos(an) - dv.y * sin(an), dv.x * sin(an) + dv.y * cos(an));
    dv.y *= 1.25 + .7 * h2(vec2(k, fi + 9.));
    float d = length(dv) * (1. + (ragA - .5) * 1.5 * cos(fi * 1.7 + k) + (ragB - .5) * .8 * sin(fi * 2.3 + k));
    float inside = smoothstep(r, r - .07, d) * life;
    float front = exp(-pow((d - r) / .014, 2.)) * life * smoothstep(0., .04, r) * (.35 + ragB);
    if (mod(fi, 2.) < 1.) lift += inside; else sink += inside;
    tide += front; wet += inside;
  }
  tide = clamp(tide, 0., 1.); wet = clamp(wet, 0., 1.);
  lift = clamp(lift + fine * .2, 0., 1.) * uStain;
  sink = clamp(sink + tide * .35 - fine * .15, 0., 1.) * uStain;
  vec2 cell = floor(gl_FragCoord.xy);
  float r = h2(cell), where = clamp(tide * 1.2 + wet * .3, 0., 1.);
  lift += max(r - .55, 0.) * where * uStain * 1.6; sink += max(.45 - r, 0.) * where * uStain * 1.6;
  float tw = sin(uT * (.9 + r * 2.6) + r * 60.) * .5 + .5;
  float glint = step(.972, h2(cell + 31.7)) * pow(tw, 5.) * where * uSpark;
  vec4 col = vec4(uLift * lift + uSink * sink * (1. - lift), lift + sink * (1. - lift));
  col = vec4(uGlint * glint, glint) + col * (1. - glint);
  vec3 lamp = vec3(asp * .5 - .42, .5 - .34, .95);
  vec3 aim = normalize(vec3(asp * .5 + .08 + uP.x * .5, .5 + .06 + uP.y * .34, 0.) - lamp);
  vec3 toL = lamp - vec3(p, 0.); float r2 = dot(toL, toL); vec3 l = toL / sqrt(r2);
  float facing = l.z;
  float cone = smoothstep(.72, .97, dot(-l, aim));
  float uneven = .88 + .12 * fb(p * 2.2 + flow * .6 + uT * .006);
  float a = facing * cone * (lamp.z * lamp.z / r2) * uneven * uStrength;
  a += (hash(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) - .5) / 255.;
  a = clamp(a, 0., 1.);
  gl_FragColor = vec4(uCol * a, a) + col * (1. - a);
}`;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, 'attribute vec2 p; void main() { gl_Position = vec4(p, 0., 1.); }'));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = (n) => gl.getUniformLocation(prog, n);
  // the Garden's daytime values
  gl.uniform3f(U('uCol'), 255 / 255, 252 / 255, 242 / 255); gl.uniform1f(U('uStrength'), 0.5);
  gl.uniform3f(U('uLift'), 255 / 255, 250 / 255, 236 / 255); gl.uniform1f(U('uStain'), 0.2);
  gl.uniform3f(U('uGlint'), 255 / 255, 246 / 255, 214 / 255); gl.uniform1f(U('uSpark'), 0.8);
  gl.uniform3f(U('uSink'), 122 / 255, 84 / 255, 38 / 255);
  const uRes = U('uRes'), uT = U('uT'), uP = U('uP');
  const tile = cv.parentElement;
  const size = () => { cv.width = Math.max(2, Math.round(cv.clientWidth * 1.5)); cv.height = Math.max(2, Math.round(cv.clientHeight * 1.5)); gl.viewport(0, 0, cv.width, cv.height); gl.uniform2f(uRes, cv.width, cv.height); };
  size(); new ResizeObserver(size).observe(cv);
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const t0 = performance.now(); let last = 0, raf = 0, seen = false, px = 0, py = 0;
  const draw = (now) => {
    if (now - last > 32) {
      last = now;
      const tx = parseFloat(tile.style.getPropertyValue('--mx')) || 0, ty = parseFloat(tile.style.getPropertyValue('--my')) || 0;
      px += (tx - px) * 0.12; py += (-ty - py) * 0.12;       // the light eases toward the pointer; y is up in the shader
      gl.uniform2f(uP, px, py); gl.uniform1f(uT, 40 + (now - t0) / 1000); gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    if (seen && !still) raf = requestAnimationFrame(draw);
  };
  new IntersectionObserver((es) => {
    seen = es.some((e) => e.isIntersecting); cancelAnimationFrame(raf);
    if (seen) raf = requestAnimationFrame(draw);
  }).observe(cv);
  requestAnimationFrame(draw);
})();
