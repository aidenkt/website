// The aidenkt palette. Names are Aiden's; the display order is set by ORDER below. Third value: 1 = dark label on the swatch. Fourth: where it came
// from. Fifth (optional): [address, the words in the origin that link to it].
const COLORS = [
  ['Aiden Red', '#E41D4C', 0, "My favorite shade of red, and the color I used to identify myself from ages 5 to 18, before switching to green."], ['ID Coral', '#FF566A', 0, "The color of the digital student IDs I built for my high school.", ["https://aidenkt.medium.com/launching-digital-student-ids-to-over-13-000-students-without-storing-anything-82f891c27f06", "digital student IDs"]], ['3DS Red', '#B5121B', 0, "The color of my first ever Nintendo 3DS, a very bright flame red.", ["https://en.wikipedia.org/wiki/Nintendo_3DS", "Nintendo 3DS"]],
  ['Dragon Red', '#7D3230', 0, "The red paint on my elementary school."], ['Strawberry Lemonade', '#F76D53', 0, "The color of my playlist about the sunset, my favorite playlist."], ['Overwatch Orange', '#FF7D25', 1, "From my time as an administrator of r/Overwatch2.", ["https://www.reddit.com/r/Overwatch2/", "r/Overwatch2"]],
  ['Iced Latte', '#755640', 0, "My default coffee order."], ['Mocha', '#563A26', 0, "The dark part of my Caramel playlist cover."],
  ['Creamsicle', '#FCE3C8', 1, "A friend's playlist cover."], ['Starlight Gold', '#DCA021', 1, "The color the lights in my room at home in San Diego turn in the evening."],
  ['Berkeley Yellow', '#FBC81F', 1, "The yellow of the University of California, Berkeley.", ["https://www.berkeley.edu/", "University of California, Berkeley"]], ['Website Lemon', '#F4DD75', 1, "The yellow in the waves on my home page.", ["https://aidenkt.com/", "home page"]], ['Glasses Green', '#919762', 0, 'My Warby Parker Carltons, in Seaweed Crystal.'],
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
  'Aiden Red', 'ID Coral', '3DS Red', 'Dragon Red', 'Strawberry Lemonade', 'Overwatch Orange', 'Starlight Gold', 'Berkeley Yellow', 'Website Lemon',
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
  const dots = $('mk-dots'); if (dots) { for (const b of dots.children) b.setAttribute('aria-pressed', String(b.dataset.hex === hex)); $('mk-name').textContent = name; $('mk-hex').textContent = hex; if (mk) makerDraw(); }
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

// the nav follows the page: clear over the colored first screen, a frosted bar after it
{
  const nav = document.querySelector('.nav'), hero = $('top');
  const stick = () => nav.classList.toggle('stuck', scrollY > hero.offsetHeight - 56);
  addEventListener('scroll', stick, { passive: true }); addEventListener('resize', stick); stick();
}

function save(name, text, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
// The wordmark as outlines (League Spartan Bold, lowercase, the page's own letter spacing), so a download needs no font.
const WORD = 'M681.5 1376V1242.7Q672.5 1263.5 636.4 1301.3Q600.3 1339.2 540.3 1369.6Q480.3 1400 399.5 1400Q280.3 1400 190.1 1341.6Q100 1283.3 50 1184.8Q0 1086.4 0 966Q0 845.6 50 747.2Q100 648.7 190.1 589.9Q280.3 531 399.5 531Q477.4 531 535 555.7Q592.5 580.4 629 613.7Q665.4 647.1 678.5 674.7V555H980.6V1376ZM298.2 966Q298.2 1022.4 324.2 1066.8Q350.2 1111.3 393.6 1136.4Q436.9 1161.4 489.5 1161.4Q544.5 1161.4 586.7 1136.1Q629 1110.7 653.2 1066.3Q677.5 1021.8 677.5 966Q677.5 910.2 653.2 865.7Q629 821.3 586.7 795.4Q544.5 769.6 489.5 769.6Q436.9 769.6 393.6 795.1Q350.2 820.7 324.2 865.2Q298.2 909.6 298.2 966ZM1160.4 1376V555H1463.6V1376ZM1315.5 386.3Q1244.2 386.3 1194.3 335.6Q1144.4 285 1144.4 215.1Q1144.4 144.9 1194.4 93.5Q1244.5 42.2 1315.5 42.2Q1362.6 42.2 1401.8 65.7Q1440.9 89.3 1465 128.1Q1489 167 1489 215.1Q1489 285 1438.1 335.6Q1387.2 386.3 1315.5 386.3ZM2001.7 1400Q1882.5 1400 1794.6 1341.6Q1706.6 1283.3 1658.1 1184.8Q1609.5 1086.4 1609.5 966Q1609.5 845.6 1658.1 747.2Q1706.6 648.7 1794.6 589.9Q1882.5 531 2001.7 531Q2080.6 531 2141.7 555.4Q2202.8 579.8 2240.6 613.2Q2278.5 646.5 2287.3 674.7V0H2590.6V1376H2290.3V1242.7Q2270.5 1280 2227.6 1316.3Q2184.7 1352.5 2126.6 1376.3Q2068.5 1400 2001.7 1400ZM2094.6 1161.4Q2149.6 1161.4 2193.1 1136.1Q2236.6 1110.7 2262 1066.3Q2287.3 1021.8 2287.3 966Q2287.3 910.2 2262 865.7Q2236.6 821.3 2193.1 795.4Q2149.6 769.6 2094.6 769.6Q2042.4 769.6 1999.9 795.1Q1957.4 820.7 1932.5 865.2Q1907.6 909.6 1907.6 966Q1907.6 1022.4 1932.5 1066.8Q1957.4 1111.3 1999.9 1136.4Q2042.4 1161.4 2094.6 1161.4ZM2984.4 1029.5Q2987.9 1074 3012.7 1108.2Q3037.4 1142.5 3081.9 1161.7Q3126.4 1181 3187.9 1181Q3245.4 1181 3292.2 1169.2Q3338.9 1157.5 3373.4 1139.2Q3407.9 1121 3426.4 1102L3544.4 1290Q3519.4 1317 3474.2 1342.3Q3428.9 1367.5 3354.9 1383.8Q3280.9 1400 3167.9 1400Q3031.4 1400 2925.4 1349Q2819.4 1298 2758.9 1198.8Q2698.4 1099.5 2698.4 956.5Q2698.4 836.5 2750.9 740Q2803.4 643.5 2903.2 587.3Q3002.9 531 3143.9 531Q3277.9 531 3376.2 580Q3474.4 629 3527.9 725.5Q3581.4 822 3581.4 965.5Q3581.4 973.5 3580.9 997.8Q3580.4 1022 3578.4 1029.5ZM3295.9 871Q3294.9 838.5 3278.9 807Q3262.9 775.5 3230.9 755Q3198.9 734.5 3148.4 734.5Q3098.4 734.5 3064.2 754Q3029.9 773.5 3011.9 804.5Q2993.9 835.5 2991.4 871ZM4279.6 531Q4366.2 531 4448 565.8Q4529.8 600.6 4582.9 676.5Q4635.9 752.4 4635.9 875.1V1376H4331.4V925.2Q4331.4 837.5 4289.4 792.6Q4247.4 747.7 4179.4 747.7Q4134.3 747.7 4094.5 771.5Q4054.8 795.4 4030.6 837.5Q4006.4 879.7 4006.4 935.3V1376H3702.4V555H4006.4V675.7Q4017.5 642.6 4056.3 609.3Q4095.1 575.9 4153.6 553.5Q4212 531 4279.6 531ZM5349.3 555H5693.3L5305.5 946.7L5732.6 1376H5381.4L5064.2 1045.8V1376H4760.2V0H5064.2V840.5ZM5720.4 555H5860.1V218H6160.5V555H6345V805.2H6160.5V1033.6Q6160.5 1084.6 6175.9 1116.1Q6191.4 1147.6 6230.8 1147.6Q6258.2 1147.6 6277.2 1136Q6296.2 1124.4 6300.2 1120.1L6403.9 1336Q6396.7 1342.5 6360.5 1358.1Q6324.2 1373.7 6268 1386.9Q6211.9 1400 6143 1400Q6019.8 1400 5940 1330.5Q5860.1 1261 5860.1 1115.8V805.2H5720.4Z';
// Frames measured from Aiden's approved files in /brand/logo/. The mark is placed as in kt-white-on-green.png, the green file he
// first uploaded: in its 500 px square it runs from x 88.12 to 424.51 and y 170.06 to 354.75 (67.3% of the width, centred on 51.26%,
// 52.48%), scaled here to the 1563 square of kt-white-on-black.png. The wordmark is 1243 wide, centred on 963.5, 492.75 in
// 1920 x 1080 (aidenkt-wordmark-green.png). The shadows are measured from kt-white-on-black.png and the wordmark file: black,
// straight down, with a Gaussian blur of standard deviation sd; the mark's grows with the mark (25.1 and 22.7 at its own size).
const MK = 1563 / 500 * 0.3901;   // the mark's scale: 0.3901 per unit at 500 px
const SHAPES = {
  mark: { d: MARK, w: 863, h: 473, file: 'kt', W: 1563, H: 1563, x: 801.24 - 863 * MK / 2, y: 820.28 - 473 * MK / 2, k: MK, sh: { dy: 25.1 * MK, sd: 22.7 * MK, a: 0.12 } },
  word: { d: WORD, w: 6404, h: 1400, file: 'wordmark', W: 1920, H: 1080, x: 342, y: 492.75 - 700 * 1243 / 6404, k: 1243 / 6404, sh: { dy: 12, sd: 12.4, a: 0.14 } },
};
var mk = { shape: 'mark', bg: null, shadow: false };   // var, not const: pick() runs before this line and checks it

// One drawing for a shape, a color, a background (or none) and the shadow (or not). The PNG is drawn from the same numbers.
function artwork() {
  const s = SHAPES[mk.shape], f = s.sh, bg = mk.bg;
  const shadow = mk.shadow ? `<defs><filter id="mk-shadow" filterUnits="userSpaceOnUse" x="0" y="0" width="${s.W}" height="${s.H}">`
    + `<feGaussianBlur in="SourceAlpha" stdDeviation="${+f.sd.toFixed(2)}"/><feOffset dy="${+f.dy.toFixed(2)}" result="b"/>`
    + `<feFlood flood-color="#000000" flood-opacity="${f.a}"/><feComposite in2="b" operator="in"/>`
    + `<feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>` : '';
  const text = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s.W} ${s.H}" width="${s.W}" height="${s.H}">${shadow}`
    + (bg ? `<rect width="${s.W}" height="${s.H}" fill="${bg[1]}"/>` : '')
    + `<g${mk.shadow ? ' filter="url(#mk-shadow)"' : ''}><path fill="${current[1]}" transform="translate(${+s.x.toFixed(3)} ${+s.y.toFixed(3)}) scale(${+s.k.toFixed(6)})" d="${s.d}"/></g></svg>\n`;
  return { text, name: `aidenkt-${s.file}-${slug(current[0])}${bg ? '-on-' + slug(bg[0]) : ''}${mk.shadow ? '-shadow' : ''}` };
}
function artworkCanvas() {
  const s = SHAPES[mk.shape], c = document.createElement('canvas'); c.width = s.W; c.height = s.H;
  const x = c.getContext('2d');
  if (mk.bg) { x.fillStyle = mk.bg[1]; x.fillRect(0, 0, s.W, s.H); }
  if (mk.shadow) x.drawImage(shadowLayer(s), 0, 0);
  x.translate(s.x, s.y); x.scale(s.k, s.k); x.fillStyle = current[1]; x.fill(new Path2D(s.d));
  return c;
}
// The shadow is blurred here rather than with the canvas's own shadowBlur, which comes out narrower than asked for and differs between
// browsers. A true Gaussian, run over just the box the shadow can reach, so the PNG matches the SVG filter and Aiden's files.
function shadowLayer(s) {
  const f = s.sh, r = Math.ceil(f.sd * 3.5), m = document.createElement('canvas'); m.width = s.W; m.height = s.H;
  const x = m.getContext('2d', { willReadFrequently: true });
  x.translate(s.x, s.y + f.dy); x.scale(s.k, s.k); x.fill(new Path2D(s.d)); x.setTransform(1, 0, 0, 1, 0, 0);
  const x0 = Math.max(0, Math.floor(s.x - r)), y0 = Math.max(0, Math.floor(s.y + f.dy - r));
  const w = Math.min(s.W, Math.ceil(s.x + s.w * s.k + r)) - x0, h = Math.min(s.H, Math.ceil(s.y + f.dy + s.h * s.k + r)) - y0;
  const img = x.getImageData(x0, y0, w, h), px = img.data, n = w * h, a = new Float32Array(n), b = new Float32Array(n);
  const k = new Float32Array(2 * r + 1); let sum = 0;
  for (let i = -r; i <= r; i++) sum += k[i + r] = Math.exp(-i * i / (2 * f.sd * f.sd));
  for (let i = 0; i < k.length; i++) k[i] /= sum;
  for (let i = 0; i < n; i++) a[i] = px[i * 4 + 3] / 255;
  for (let yy = 0; yy < h; yy++) for (let xx = 0, o = yy * w; xx < w; xx++) {
    let v = 0; for (let t = Math.max(-r, -xx), e = Math.min(r, w - 1 - xx); t <= e; t++) v += a[o + xx + t] * k[t + r]; b[o + xx] = v;
  }
  for (let xx = 0; xx < w; xx++) for (let yy = 0; yy < h; yy++) {
    let v = 0; for (let t = Math.max(-r, -yy), e = Math.min(r, h - 1 - yy); t <= e; t++) v += b[(yy + t) * w + xx] * k[t + r]; a[yy * w + xx] = v;
  }
  for (let i = 0; i < n; i++) { px[i * 4] = px[i * 4 + 1] = px[i * 4 + 2] = 0; px[i * 4 + 3] = Math.round(a[i] * f.a * 255); }
  x.clearRect(0, 0, s.W, s.H); x.putImageData(img, x0, y0);
  return m;
}
function saveBlob(name, blob) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
function makerDraw() {
  $('mk-view').innerHTML = artwork().text;
  for (const b of document.querySelectorAll('[data-mk-shape]')) b.setAttribute('aria-pressed', String(b.dataset.mkShape === mk.shape));
  const bg = mk.bg ? mk.bg[1] : '';
  for (const b of $('mk-bg-dots').children) b.setAttribute('aria-pressed', String(b.dataset.hex === bg));
  $('mk-bg-none').setAttribute('aria-pressed', String(!mk.bg));
  $('mk-bg-name').textContent = mk.bg ? mk.bg[0] : ''; $('mk-bg-hex').textContent = bg;
}
for (const b of document.querySelectorAll('[data-mk-shape]')) b.addEventListener('click', () => { mk.shape = b.dataset.mkShape; makerDraw(); });
$('mk-bg-none').addEventListener('click', () => { mk.bg = null; makerDraw(); });
$('mk-shadow').addEventListener('change', (e) => { mk.shadow = e.target.checked; makerDraw(); });
for (const [row, choose] of [['mk-dots', (color) => pick(color, false)], ['mk-bg-dots', (color) => { mk.bg = color; makerDraw(); }]]) {
  for (const color of COLORS) {
    const [name, hex] = color;
    const b = document.createElement('button');
    b.type = 'button'; b.dataset.hex = hex; b.title = name; b.setAttribute('aria-label', `${name}, ${hex}`);
    b.className = EDGE.has(name) ? 'edge' : ''; b.style.setProperty('--c', hex);
    b.addEventListener('click', () => choose(color));
    $(row).appendChild(b);
  }
}
for (const b of $('mk-dots').children) b.setAttribute('aria-pressed', String(b.dataset.hex === current[1]));
mk.shadow = $('mk-shadow').checked;
$('mk-svg-dl').addEventListener('click', () => { const a = artwork(); save(a.name + '.svg', a.text, 'image/svg+xml'); });
$('mk-png-dl').addEventListener('click', () => {
  const name = artwork().name;
  artworkCanvas().toBlob((blob) => blob && saveBlob(name + '.png', blob), 'image/png');
});
makerDraw();

// The palette sheet is drawn from COLORS when asked for, so it can never fall behind the palette.
async function sheet() {
  const COLS = 8, M = 96, GAP = 20, W = 2400, SW = (W - M * 2 - GAP * (COLS - 1)) / COLS, SH = 300, HEAD = 150;
  const rows = Math.ceil(COLORS.length / COLS), H = M + HEAD + rows * SH + (rows - 1) * GAP + M;
  if (document.fonts && document.fonts.load) {
    await Promise.all([document.fonts.load('600 23px Geist'), document.fonts.load('500 17px "Geist Mono"')]).catch(() => {});
  }
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  x.fillStyle = '#FDFFFF'; x.fillRect(0, 0, W, H);
  const k = 84 / 1400;                                          // wordmark, 84 tall, top left
  x.save(); x.translate(M, M); x.scale(k, k); x.fillStyle = '#0D0D0D'; x.fill(new Path2D(WORD)); x.restore();
  const km = 84 / 473;                                          // mark, same height, top right
  x.save(); x.translate(W - M - 863 * km, M); x.scale(km, km); x.fillStyle = '#15DD7D'; x.fill(new Path2D(MARK)); x.restore();
  COLORS.forEach(([name, hex, dark], i) => {
    const px = M + (i % COLS) * (SW + GAP), py = M + HEAD + Math.floor(i / COLS) * (SH + GAP);
    x.beginPath(); x.roundRect(px, py, SW, SH, 28); x.fillStyle = hex; x.fill();
    if (EDGE.has(name)) { x.strokeStyle = 'rgba(13,13,13,.14)'; x.lineWidth = 2; x.stroke(); }
    x.fillStyle = dark ? '#0D0D0D' : '#FDFFFF';
    x.font = '500 17px "Geist Mono", ui-monospace, Menlo, monospace'; x.textBaseline = 'alphabetic';
    x.globalAlpha = 0.72; x.fillText(hex, px + 22, py + SH - 24); x.globalAlpha = 1;
    x.font = '600 23px Geist, system-ui, sans-serif';
    const lines = []; let line = '';                            // wrap the name to the swatch
    for (const word of name.split(' ')) {
      const t = line ? line + ' ' + word : word;
      if (line && x.measureText(t).width > SW - 44) { lines.push(line); line = word; } else line = t;
    }
    lines.push(line);
    lines.forEach((l, n) => x.fillText(l, px + 22, py + SH - 54 - (lines.length - 1 - n) * 28));
  });
  return c;
}

const FILES = {
  sheet: () => sheet().then((c) => c.toBlob((blob) => blob && saveBlob('aidenkt-palette.png', blob), 'image/png')),
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
  // It holds still on a fixed starting frame and only moves while the pointer is over the tile.
  const T0 = 48;   // chosen by looking at twenty candidates: stains on the top, left and lower right, with the middle clear
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let t = T0, hovering = false, raf = 0, lastNow = 0, px = 0, py = 0;
  const paint = () => { gl.uniform2f(uP, px, py); gl.uniform1f(uT, t); gl.drawArrays(gl.TRIANGLES, 0, 3); };
  const frame = (now) => {
    if (lastNow) t += Math.min(0.1, (now - lastNow) / 1000) * 2.5;       // a little faster than the Garden, so the seep is visible
    lastNow = now;
    const tx = parseFloat(tile.style.getPropertyValue('--mx')) || 0, ty = parseFloat(tile.style.getPropertyValue('--my')) || 0;
    px += (tx - px) * 0.12; py += (-ty - py) * 0.12;                     // the light eases toward the pointer; y is up in the shader
    paint();
    if (hovering) raf = requestAnimationFrame(frame); else lastNow = 0;
  };
  tile.addEventListener('pointerenter', () => { if (still || hovering) return; hovering = true; lastNow = 0; raf = requestAnimationFrame(frame); });
  tile.addEventListener('pointerleave', () => { hovering = false; cancelAnimationFrame(raf); lastNow = 0; });
  new ResizeObserver(() => { size(); paint(); }).observe(cv);
  size(); paint();
})();

// The paper tile carries the signature: the same pen strokes as the one under the statement, shown whole.
(function () {
  const to = $('paper-sig'), from = document.querySelector('#sign .ink'); if (!to || !from) return;
  for (const path of from.querySelectorAll('path')) { const c = path.cloneNode(false); c.removeAttribute('mask'); to.appendChild(c); }
})();

// Particles: the logo in thousands of specks of ink, behaving like the hands on the Garden sign-in. At rest it is
// still. While the pointer is over the tile the specks breathe and twinkle, and a pointer moving THROUGH them knocks
// some loose at random (how fast it moves matters, not where it sits); each wanders on its own, then slowly finds
// its way home. It keeps running after the pointer leaves until every speck is back.
(function () {
  const cv = $('grains'); if (!cv) return;
  const ctx = cv.getContext('2d'), tile = cv.parentElement;
  const gcv = $('grains-glow'), gctx = gcv.getContext('2d'), GR = 1 / 3;   // a low-resolution copy, blurred in CSS: the specks' light
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let n = 0, hx, hy, x, y, vx, vy, loose, heal, base, rad, cosPh, sinPh, cosPh13, sinPh13, ph;
  let W = 0, H = 0, dpr = 1, hovering = false, raf = 0, last = 0, t = 0;
  const ptr = { x: -1e4, y: -1e4, vx: 0, vy: 0 };
  const build = () => {
    dpr = Math.min(2, devicePixelRatio || 1);
    W = cv.clientWidth; H = cv.clientHeight; cv.width = Math.max(2, Math.round(W * dpr)); cv.height = Math.max(2, Math.round(H * dpr));
    gcv.width = Math.max(2, Math.round(W * GR)); gcv.height = Math.max(2, Math.round(H * GR));
    const mw = W * 0.6, sc = mw / 863, mh = 473 * sc, ox = (W - mw) / 2, oy = (H - mh) / 2;
    const shape = new Path2D(MARK), step = Math.max(1.6, W / 190);
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;     // the same specks every time
    const P = [];
    for (let py = 0; py < mh; py += step) for (let px = 0; px < mw; px += step) {
      const jx = px + (rnd() - .5) * step * 1.6, jy = py + (rnd() - .5) * step * 1.6;
      if (!ctx.isPointInPath(shape, jx / sc, jy / sc)) continue;
      if (rnd() < 0.22) continue;                                                           // a few gaps, so it reads as specks and not a fill
      P.push([ox + jx, oy + jy, rnd(), rnd() * 6.2832, 150 + rnd() * 330]);
    }
    n = P.length; const F = () => new Float32Array(n);
    hx = F(); hy = F(); x = F(); y = F(); vx = F(); vy = F(); loose = F(); heal = F(); base = F(); rad = F(); ph = F(); cosPh = F(); sinPh = F(); cosPh13 = F(); sinPh13 = F();
    for (let i = 0; i < n; i++) {
      const [a, b, shade, phase, h] = P[i];
      hx[i] = x[i] = a; hy[i] = y[i] = b; heal[i] = h; ph[i] = phase;
      base[i] = 0.34 + shade * 0.66; rad[i] = (1.15 + shade * 0.55) * Math.max(1, W / 420);
      cosPh[i] = Math.cos(phase); sinPh[i] = Math.sin(phase); cosPh13[i] = Math.cos(phase * 1.3); sinPh13[i] = Math.sin(phase * 1.3);
    }
    paint(false);
  };
  const paint = (live) => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#E8E4DB';
    gctx.setTransform(GR, 0, 0, GR, 0, 0); gctx.clearRect(0, 0, W, H); gctx.fillStyle = 'rgb(255,226,184)';
    const s13 = Math.sin(t * 1.3), c13 = Math.cos(t * 1.3);
    for (let i = 0; i < n; i++) {
      const tw = live ? s13 * cosPh[i] + c13 * sinPh[i] : 0.75;
      ctx.globalAlpha = base[i] * (0.55 + 0.45 * tw * tw);
      const r = rad[i]; ctx.fillRect(x[i] - r / 2, y[i] - r / 2, r, r);
      gctx.globalAlpha = Math.min(1, ctx.globalAlpha * 0.55); gctx.fillRect(x[i] - 4, y[i] - 4, 8, 8);
    }
    ctx.globalAlpha = gctx.globalAlpha = 1;
  };
  const frame = (now) => {
    const dt = Math.min(48, now - (last || now)) / 16.67; last = now; t += dt / 60;
    const stir = Math.min(1, Math.hypot(ptr.vx, ptr.vy) / 14); ptr.vx *= Math.pow(0.8, dt); ptr.vy *= Math.pow(0.8, dt);
    const s9 = Math.sin(t * 0.9), c9 = Math.cos(t * 0.9), s7 = Math.sin(t * 0.7), c7 = Math.cos(t * 0.7);
    const pull = 0.012 * 1.4, heldDrag = Math.pow(0.86, dt), stirring = stir > 0.02, reach = W * 0.3, soft = reach * reach * 0.24;
    let free = 0;
    for (let i = 0; i < n; i++) {
      const tx = hx[i] + (s9 * cosPh[i] + c9 * sinPh[i]) * 2.6, ty = hy[i] + (c7 * cosPh13[i] - s7 * sinPh13[i]) * 2.6;   // a slow breathing drift
      if (stirring) {
        const dx = x[i] - ptr.x, dy = y[i] - ptr.y, d2 = dx * dx + dy * dy;
        if (d2 < reach * reach && Math.random() < Math.exp(-d2 / soft) * stir * 0.85 * dt) {
          const a = Math.random() * 6.2832, kick = (0.6 + Math.random() * 3.4) * (0.4 + stir) * 0.95;
          vx[i] += Math.cos(a) * kick + ptr.vx * 0.12 * Math.random(); vy[i] += Math.sin(a) * kick + ptr.vy * 0.12 * Math.random();
          loose[i] = 1;
        }
      }
      const L = loose[i];
      if (L > 0) {
        free++;
        const grip = (1 - L) * (1 - L);                                   // home's pull returns gradually as it calms
        vx[i] += (tx - x[i]) * pull * grip; vy[i] += (ty - y[i]) * pull * grip;
        const w = ph[i] + Math.sin(t * 0.6 + ph[i] * 3.1) * 2.4 + y[i] * 0.01;   // while loose it wanders on its own
        vx[i] += Math.cos(w) * 0.06 * L * dt; vy[i] += Math.sin(w) * 0.06 * L * dt;
        loose[i] = Math.max(0, L - dt / heal[i]);
        const drag = Math.pow(0.86 + 0.115 * L, dt); vx[i] *= drag; vy[i] *= drag;   // loose specks glide
      } else { vx[i] = (vx[i] + (tx - x[i]) * pull) * heldDrag; vy[i] = (vy[i] + (ty - y[i]) * pull) * heldDrag; }
      x[i] += vx[i] * dt; y[i] += vy[i] * dt;
    }
    paint(true);
    if (hovering || free > 0) raf = requestAnimationFrame(frame); else { last = 0; }
  };
  tile.addEventListener('pointermove', (e) => {
    const b = cv.getBoundingClientRect(), nx = e.clientX - b.left, ny = e.clientY - b.top;
    if (ptr.x > -1e3) { ptr.vx += (nx - ptr.x) * 0.5; ptr.vy += (ny - ptr.y) * 0.5; }
    ptr.x = nx; ptr.y = ny;
  }, { passive: true });
  tile.addEventListener('pointerenter', () => { if (still || hovering) return; hovering = true; cancelAnimationFrame(raf); last = 0; raf = requestAnimationFrame(frame); });
  tile.addEventListener('pointerleave', () => { hovering = false; ptr.x = ptr.y = -1e4; });
  new ResizeObserver(() => { if (!hovering) build(); }).observe(cv);
  build();
})();

// Waves: the home page's background, redrawn here from its own recipe. Sixty ribbons lie side by side along a tilted
// axis; each one's width swells and thins along its length by three slow cosines of its own, and each is shaded
// across its width from its color to a brighter version. The colors run through the home page's six anchors, and
// the green and blue wash on top is the home page's too. Still until the pointer is over the tile.
(function () {
  const cv = $('ribbons'); if (!cv) return;
  const tile = cv.parentElement;
  const NX = 60, NY = 90, ANG = Math.PI * 1.4, COS = Math.cos(ANG), SIN = Math.sin(ANG), SIZE = 1.5 / NX;
  const dp = (x, y) => [1.5 * (x * COS - y * SIN), 1.5 * (x * SIN + y * COS)];
  // color: interpolate the six anchors in LCH, as the home page does, and brighten for the far edge of each ribbon
  const toLab = (hex) => {
    const [r, g, b] = rgb(hex).map(lin);
    const f = (v) => (v > 0.008856 ? Math.cbrt(v) : 7.787 * v + 16 / 116);
    const X = f((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / 0.95047), Y = f(0.2126729 * r + 0.7151522 * g + 0.072175 * b), Z = f((0.0193339 * r + 0.119192 * g + 0.9503041 * b) / 1.08883);
    return [116 * Y - 16, 500 * (X - Y), 200 * (Y - Z)];
  };
  const fromLab = ([L, a, b]) => {
    const fy = (L + 16) / 116, fx = fy + a / 500, fz = fy - b / 200, g = (v) => (v * v * v > 0.008856 ? v * v * v : (v - 16 / 116) / 7.787);
    const X = g(fx) * 0.95047, Y = g(fy), Z = g(fz) * 1.08883;
    const out = [3.2404542 * X - 1.5371385 * Y - 0.4985314 * Z, -0.969266 * X + 1.8760108 * Y + 0.041556 * Z, 0.0556434 * X - 0.2040259 * Y + 1.0572252 * Z];
    return 'rgb(' + out.map((v) => Math.round(255 * Math.max(0, Math.min(1, v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055)))).join(',') + ')';
  };
  const ANCH = ['#C73524', '#E28240', '#D0B64F', '#DB4E46', '#BB55C6', '#D0247D'].map((h) => { const [L, a, b] = toLab(h); return [L, Math.hypot(a, b), Math.atan2(b, a)]; });
  const scale = (t) => {
    const f = t * (ANCH.length - 1), i = Math.min(ANCH.length - 2, Math.floor(f)), k = f - i, A = ANCH[i], B = ANCH[i + 1];
    let dh = B[2] - A[2]; if (dh > Math.PI) dh -= 2 * Math.PI; if (dh < -Math.PI) dh += 2 * Math.PI;
    const L = A[0] + (B[0] - A[0]) * k, C = A[1] + (B[1] - A[1]) * k, h = A[2] + dh * k;
    return [L, C * Math.cos(h), C * Math.sin(h)];
  };
  let seed = 11; const rnd = (lo, hi) => lo + ((seed = (seed * 16807) % 2147483647) / 2147483647) * (hi - lo);   // the same ribbons every time
  const R = [];
  for (let i = 0; i < NX; i++) {
    const v3 = (lo, hi) => [rnd(lo, hi), rnd(lo, hi), rnd(lo, hi)];
    R.push({ r1: v3(-1, 1), r2: v3(-1, 1), r3: v3(-1, 1), r4: v3(-1, 1), r5: [rnd(0.2, 0.5), rnd(0.3, 0.6), rnd(0.4, 0.7)] });
  }
  // Drawn with the home page's own two shaders. Each ribbon is a strip whose two edges are pushed apart in the vertex
  // shader; the fragment shader blends from the ribbon's color at one edge to its brighter version at the other.
  // Later ribbons overlap earlier ones, so what shows of each is its bright edge fading into shade under the next:
  // that is what makes the surface look folded.
  const gl = cv.getContext('webgl', { antialias: true, alpha: false }); if (!gl) return;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, `
    uniform float uTime, uSize, uZoom; uniform mat2 uMat2; uniform vec3 uRnd1, uRnd2, uRnd3, uRnd4, uRnd5;
    attribute vec2 position; attribute float side; varying float vU;
    vec2 dp(vec2 sv) { return (1.5 * sv * uMat2); }
    void main() {
      vU = side * .5 + .5;
      vec2 pos = dp(position);
      vec2 normal = dp(vec2(1, 0)) * uSize;
      vec3 rnd1 = vec3(cos(uTime * uRnd1.x + uRnd3.x), cos(uTime * uRnd1.y + uRnd3.y), cos(uTime * uRnd1.z + uRnd3.z));
      vec3 rnd2 = vec3(cos(uTime * uRnd2.x + uRnd4.x), cos(uTime * uRnd2.y + uRnd4.y), cos(uTime * uRnd2.z + uRnd4.z));
      normal *= 1.0
        + uRnd5.x * (cos((position.y + rnd1.x) * 20.0 * rnd1.y) + 1.0)
        + uRnd5.y * (sin((position.y + rnd2.x) * 20.0 * rnd2.y) + 1.0)
        + uRnd5.z * (cos((position.y + rnd1.z) * 20.0 * rnd2.z) + 1.0);
      pos -= normal * side;
      gl_Position = vec4(pos * uZoom, 0.0, 1.0);
    }`));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, `
    precision mediump float; uniform vec3 uColor1, uColor2; varying float vU;
    void main() { gl_FragColor = vec4(mix(uColor1, uColor2, vU), 1.0); }`));
  gl.linkProgram(prog); if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);
  const U = (n) => gl.getUniformLocation(prog, n);
  gl.uniformMatrix2fv(U('uMat2'), false, new Float32Array([COS, -SIN, SIN, COS]));
  gl.uniform1f(U('uSize'), SIZE); gl.uniform1f(U('uZoom'), 1.9);        // zoomed in: fewer, larger folds than on the full page
  const aPos = gl.getAttribLocation(prog, 'position'), aSide = gl.getAttribLocation(prog, 'side');
  const num = (css) => css.match(/\d+/g).map((v) => v / 255);
  for (let i = 0; i < NX; i++) {
    const r = R[i], x0 = -1 + 1 / NX + i * (2 / NX), data = new Float32Array(NY * 2 * 3);
    for (let k = 0; k < NY; k++) { const y = 1 - k * (2 / (NY - 1)); data.set([x0, y, -1, x0, y, 1], k * 6); }
    r.buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, r.buf); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const lab = scale(i / NX); r.k1 = num(fromLab(lab)); r.k2 = num(fromLab([lab[0] + 19.8, lab[1], lab[2]]));
  }
  gl.enableVertexAttribArray(aPos); gl.enableVertexAttribArray(aSide);
  const uT = U('uTime'), uR = [1, 2, 3, 4, 5].map((n) => U('uRnd' + n)), uC1 = U('uColor1'), uC2 = U('uColor2');
  let time = 600, hovering = false, raf = 0, last = 0;
  const size = () => { const d = Math.min(2, devicePixelRatio || 1); cv.width = Math.max(2, Math.round(cv.clientWidth * d)); cv.height = Math.max(2, Math.round(cv.clientHeight * d)); gl.viewport(0, 0, cv.width, cv.height); };
  const paint = () => {
    gl.uniform1f(uT, time * 0.035);
    for (const r of R) {
      gl.bindBuffer(gl.ARRAY_BUFFER, r.buf);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 12, 0); gl.vertexAttribPointer(aSide, 1, gl.FLOAT, false, 12, 8);
      [r.r1, r.r2, r.r3, r.r4, r.r5].forEach((v, n) => gl.uniform3f(uR[n], v[0], v[1], v[2]));
      gl.uniform3f(uC1, r.k1[0], r.k1[1], r.k1[2]); gl.uniform3f(uC2, r.k2[0], r.k2[1], r.k2[2]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, NY * 2);
    }
  };
  const frame = (now) => {
    time += Math.min(100, now - (last || now)) / 1000;            // the home page's own pace
    last = now; paint();
    if (hovering) raf = requestAnimationFrame(frame); else last = 0;
  };
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  tile.addEventListener('pointerenter', () => { if (still || hovering) return; hovering = true; last = 0; raf = requestAnimationFrame(frame); });
  tile.addEventListener('pointerleave', () => { hovering = false; cancelAnimationFrame(raf); last = 0; });
  new ResizeObserver(() => { size(); paint(); }).observe(cv);
  size(); paint();
})();

// Hologram: the logo as a slab of points in space, turning, with the color split slightly at its edges (a red copy
// one way, a cyan copy the other). Still until the pointer is over the tile; then it turns, and leans with the pointer.
(function () {
  const cv = $('holo'); if (!cv) return;
  const ctx = cv.getContext('2d'), tile = cv.parentElement;
  const REST = -0.42; let P = [], W = 0, H = 0, dpr = 1, ang = REST, hovering = false, raf = 0, last = 0;
  const build = () => {
    dpr = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight;
    cv.width = Math.max(2, Math.round(W * dpr)); cv.height = Math.max(2, Math.round(H * dpr));
    const shape = new Path2D(MARK), step = 15; P = [];
    let seed = 3; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let y = 0; y <= 473; y += step) for (let x = 0; x <= 863; x += step) {
      if (!ctx.isPointInPath(shape, x + .5, y + .5)) continue;
      const edge = !(ctx.isPointInPath(shape, x + step, y) && ctx.isPointInPath(shape, x - step, y) && ctx.isPointInPath(shape, x, y + step) && ctx.isPointInPath(shape, x, y - step));
      for (const z of (edge ? [-45, -22, 0, 22, 45] : [-45, 45])) P.push([x - 431.5 + (rnd() - .5) * 7, y - 236.5 + (rnd() - .5) * 7, z, rnd()]);   // faces front and back, walls round the edge
    }
    paint();
  };
  const paint = () => {
    const yaw = ang, pitch = -0.12, cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    const sc = W * 0.56 / 863, F = 2600, t = performance.now() / 1000;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H); ctx.globalCompositeOperation = 'lighter';
    const proj = P.map(([x, y, z, r]) => {
      const x1 = x * cy + z * sy, z1 = -x * sy + z * cy, y1 = y * cp - z1 * sp, z2 = y * sp + z1 * cp, k = F / (F + z2);
      return [W / 2 + x1 * k * sc, H * 0.47 + y1 * k * sc, k, r];
    });
    for (const [dx, col] of [[-1.6, 'rgba(255,60,90,.55)'], [1.6, 'rgba(60,220,255,.6)'], [0, 'rgba(225,255,245,.75)']]) {
      ctx.fillStyle = col;
      for (const [x, y, k, r] of proj) {
        const s = Math.max(1, 1.5 * k * W / 420), fl = hovering ? 0.75 + 0.25 * Math.sin(t * 7 + r * 40) : 1;
        ctx.globalAlpha = Math.min(1, (0.42 + (k - 0.97) * 7) * fl);
        ctx.fillRect(x + dx * (W / 420) - s / 2, y - s / 2, s, s);
      }
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  };
  // turns while the pointer is over the tile; when it leaves, eases back to its resting angle and stops there
  const frame = (now) => {
    const dt = Math.min(48, now - (last || now)) / 1000; last = now;
    if (hovering) ang += dt * 0.55;
    else { let d = (REST - ang) % 6.2832; if (d > 3.1416) d -= 6.2832; if (d < -3.1416) d += 6.2832; ang += d * Math.min(1, dt * 5); if (Math.abs(d) < 0.004) { ang = REST; paint(); last = 0; return; } }
    paint(); raf = requestAnimationFrame(frame);
  };
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  tile.addEventListener('pointerenter', () => { if (still || hovering) return; hovering = true; cancelAnimationFrame(raf); last = 0; raf = requestAnimationFrame(frame); });
  tile.addEventListener('pointerleave', () => { hovering = false; });
  new ResizeObserver(build).observe(cv); build();
})();

// Blueprint: line art in the manner of the Anchor House model. The logo is the floor plan of three blocks; each is
// drawn as lines only (structure strong, frame lighter, detail faint), and faces are filled with the background
// navy so the walls behind are hidden. Still until hovered; then it turns, and eases back to rest when you leave.
(function () {
  const cv = $('blueprint'); if (!cv) return;
  const ctx = cv.getContext('2d'), tile = cv.parentElement, NAVY = '#0B1630', LINE = '184,203,232', REST = -0.34;
  const B = [
    { h: 190, p: [[0, 0], [152, 0], [152, 473], [0, 473]] },
    { h: 190, p: [[321, 0], [708, 0], [708, 473], [556, 473], [556, 121], [403, 121], [340, 195], [512, 473], [333, 473], [232, 296], [232, 107]] },
    { h: 190, p: [[788, 0], [863, 0], [863, 121], [788, 121]] },
  ];
  let W = 0, H = 0, dpr = 1, ang = REST, hovering = false, raf = 0, last = 0;
  const size = () => { dpr = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight; cv.width = Math.max(2, Math.round(W * dpr)); cv.height = Math.max(2, Math.round(H * dpr)); };
  const paint = () => {
    const c = Math.cos(ang), s = Math.sin(ang), PITCH = 0.98, cp = Math.cos(PITCH), sp = Math.sin(PITCH), sc = W * 0.62 / 863;
    // plan coordinates (x, z on the ground, y up) -> screen, plus depth for ordering
    const pr = (x, y, z) => { const X = x - 431.5, Z = z - 236.5, x1 = X * c + Z * s, z1 = -X * s + Z * c; return [W / 2 + x1 * sc, H * 0.56 + (z1 * sp - y * cp) * sc, z1]; };
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const stroke = (pts, o, w, close) => { ctx.strokeStyle = `rgba(${LINE},${o})`; ctx.lineWidth = w; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); if (close) ctx.closePath(); ctx.stroke(); };
    const fill = (pts) => { ctx.fillStyle = NAVY; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fill(); };
    const lw = Math.max(1, W / 420);
    // the site: a faint ground grid
    for (let g = -200; g <= 1063; g += 105) { stroke([pr(g, 0, -260), pr(g, 0, 733)], 0.1, lw * .7); }
    for (let g = -260; g <= 733; g += 105) { stroke([pr(-200, 0, g), pr(1063, 0, g)], 0.1, lw * .7); }
    const order = B.map((b) => ({ b, d: b.p.reduce((a, q) => a + pr(q[0], 0, q[1])[2], 0) / b.p.length })).sort((a, b) => a.d - b.d);   // far blocks first
    for (const { b } of order) {
      const n = b.p.length, walls = [];
      let area = 0; for (let i = 0; i < n; i++) { const a = b.p[i], q = b.p[(i + 1) % n]; area += a[0] * q[1] - q[0] * a[1]; }
      const wind = area > 0 ? 1 : -1;
      for (let i = 0; i < n; i++) {
        const a = b.p[i], q = b.p[(i + 1) % n], A0 = pr(a[0], 0, a[1]), Q0 = pr(q[0], 0, q[1]), A1 = pr(a[0], b.h, a[1]), Q1 = pr(q[0], b.h, q[1]);
        const nx = (q[1] - a[1]) * wind, nz = -(q[0] - a[0]) * wind;                                              // the wall's outward direction on the plan
        if (-nx * s + nz * c <= 0) continue;                                                                      // faces away from the viewer
        walls.push({ a, q, A0, Q0, A1, Q1, d: (A0[2] + Q0[2]) / 2 });
      }
      walls.sort((x, y) => x.d - y.d);
      for (const w of walls) {
        fill([w.A0, w.Q0, w.Q1, w.A1]);
        const len = Math.hypot(w.q[0] - w.a[0], w.q[1] - w.a[1]), at = (t, y) => pr(w.a[0] + (w.q[0] - w.a[0]) * t, y, w.a[1] + (w.q[1] - w.a[1]) * t);
        for (let y = 42; y < b.h - 8; y += 42) stroke([at(0, y), at(1, y)], 0.28, lw * .7);                        // floors
        for (let k = 1, m = Math.max(1, Math.round(len / 46)); k < m; k++) stroke([at(k / m, 0), at(k / m, b.h)], 0.28, lw * .7);   // mullions
        stroke([w.A0, w.Q0, w.Q1, w.A1], 0.6, lw, true);
        stroke([w.A0, w.A1], 0.95, lw * 1.2); stroke([w.Q0, w.Q1], 0.95, lw * 1.2);
      }
      const top = b.p.map((q) => pr(q[0], b.h, q[1])); ctx.fillStyle = '#132447'; ctx.beginPath(); top.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.fill(); stroke(top, 1, lw * 1.7, true);   // the roof is a shade lighter, so the logo reads
    }
  };
  const frame = (now) => {
    const dt = Math.min(48, now - (last || now)) / 1000; last = now;
    if (hovering) ang += dt * 0.4;
    else { let d = (REST - ang) % 6.2832; if (d > 3.1416) d -= 6.2832; if (d < -3.1416) d += 6.2832; ang += d * Math.min(1, dt * 5); if (Math.abs(d) < 0.004) { ang = REST; paint(); last = 0; return; } }
    paint(); raf = requestAnimationFrame(frame);
  };
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  tile.addEventListener('pointerenter', () => { if (still || hovering) return; hovering = true; cancelAnimationFrame(raf); last = 0; raf = requestAnimationFrame(frame); });
  tile.addEventListener('pointerleave', () => { hovering = false; });
  new ResizeObserver(() => { size(); paint(); }).observe(cv); size(); paint();
})();

// HUD: a head-up display hanging in space. A menu panel is turned one way and a ring instrument the other, the logo
// is held at the centre of the rings, and a wire runs from the selected row to the instrument. Lines are projected
// in perspective point by point; type and the logo are set on the local slope of their sheet. Still at rest. While
// the pointer is over the tile the rings turn and the selected row follows the pointer; when it leaves, everything
// eases back to exactly where it started and the drawing stops.
(function () {
  const cv = $('hud'); if (!cv) return;
  const ctx = cv.getContext('2d'), tile = cv.parentElement, shape = new Path2D(MARK), TAU = Math.PI * 2;
  const FONT = getComputedStyle(document.documentElement).getPropertyValue('--mono').trim() || 'monospace';
  const PINK = '252,47,153', SKY = '95,228,255', ORCHID = '228,107,244', PURPLE = '103,40,239', WHITE = '253,255,255';
  const ROWS = [['01', 'LINK', 'ON'], ['02', 'SIGNAL', '072'], ['03', 'RANGE', 'AUTO'], ['04', 'STATUS', 'READY']];
  const F = 560, YAW = 0.5, HOME = 1, REST = [-TAU / 6, TAU / 12, TAU * 3 / 8], RATE = [0.2, -0.32, 0.46];   // focal length, the menu's turn, the row selected at rest, each ring's resting angle and speed
  const PANEL = [[-70, -90], [56, -90], [70, -76], [70, 90], [-56, 90], [-70, 76]], ROW_H = 25, LIFT = 9, SHIFT = LIFT * Math.tan(YAW);
  const rowTop = (i) => -56 + i * 31;
  let W = 0, H = 0, dpr = 1, s = 1, lw = 1, ang = REST.slice(), sel = HOME, want = HOME, spin = 0, hovering = false, raf = 0, last = 0;
  // a flat sheet standing in space, turned about its upright axis: (u, v) on the sheet, lifted toward the viewer -> the screen
  const plane = (ox, oy, oz, yaw) => { const c = Math.cos(yaw), n = Math.sin(yaw);
    return (u, v, lift = 0) => { const k = F / (F + oz + u * n - lift * c); return [W / 2 + (ox + u * c + lift * n) * k * s, H / 2 + (oy + v) * k * s]; }; };
  const MENU = plane(-98, -6, 0, YAW), BACK = plane(-84, -18, 80, YAW), RING = plane(82, -8, 0, -0.4);
  const size = () => {
    dpr = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight;
    cv.width = Math.max(2, Math.round(W * dpr)); cv.height = Math.max(2, Math.round(H * dpr));
    s = Math.min(W / 400, H / 300); lw = Math.max(1, W / 420);                                    // drawn on a 400 by 300 board
  };
  const path = (P, pts, lift, close, dx = 0) => { pts.forEach((q, i) => { const p = P(q[0], q[1], lift); if (i) ctx.lineTo(p[0] + dx, p[1]); else ctx.moveTo(p[0] + dx, p[1]); }); if (close) ctx.closePath(); };
  const arc = (P, r, from, to) => { const n = Math.max(2, Math.ceil(Math.abs(to - from) / 0.06)); for (let i = 0; i <= n; i++) { const a = from + (to - from) * i / n, p = P(r * Math.cos(a), r * Math.sin(a)); if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); } };
  const tick = (P, r0, r1, a) => { const c = Math.cos(a), n = Math.sin(a), p = P(r0 * c, r0 * n), q = P(r1 * c, r1 * n); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); };
  const line = (col, a, w) => { ctx.lineWidth = w; ctx.strokeStyle = `rgba(${col},${a})`; ctx.stroke(); };
  const neon = (col, a, w, h = w) => { line(col, a * .09, w + h * 3.4); line(col, a * .2, w + h * 1.4); line(col, a, w); };   // a tight halo, then the line itself
  const word = (P, str, u, v, d, align, col, lift = 0) => {
    const o = P(u, v, lift), a = P(u + 1, v, lift), b = P(u, v + 1, lift);
    ctx.setTransform(dpr * (a[0] - o[0]), dpr * (a[1] - o[1]), dpr * (b[0] - o[0]), dpr * (b[1] - o[1]), dpr * o[0], dpr * o[1]);
    ctx.font = `500 ${d}px ${FONT}`; ctx.textAlign = align; ctx.fillStyle = col; ctx.fillText(str, 0, d * 0.36);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const paint = () => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H); ctx.lineJoin = 'miter'; ctx.lineCap = 'butt';
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0.5px';
    const ty = (d) => Math.max(d, 6 / s);                                                          // type is sized on the board, but never under 6px on screen
    const snap = (v) => (Math.round(v * dpr) + .5) / dpr, [a0, a1, a2] = ang, st = TAU / 72, D = TAU / 24;   // ring one is ticked every 5 degrees; the arcs are cut in 15s, so at rest their ends sit on its long ticks

    // the back wall: a fine grid with a cross at every fifth line, fading toward the corners
    ctx.beginPath();
    for (let g = -200; g <= 200; g += 20) { const x = snap(W / 2 + g * s); ctx.moveTo(x, 0); ctx.lineTo(x, H); }
    for (let g = -160; g <= 160; g += 20) { const y = snap(H / 2 + g * s); ctx.moveTo(0, y); ctx.lineTo(W, y); }
    line(WHITE, dpr > 1 ? .085 : .05, 1 / dpr);
    ctx.beginPath();
    for (let gx = -100; gx <= 100; gx += 100) for (let gy = -120; gy <= 120; gy += 240) {
      const x = snap(W / 2 + gx * s), y = snap(H / 2 + gy * s), r = 3 * s;
      ctx.moveTo(x - r, y); ctx.lineTo(x + r, y); ctx.moveTo(x, y - r); ctx.lineTo(x, y + r);
    }
    line(WHITE, .34, 1 / dpr);
    const fade = ctx.createRadialGradient(W / 2, H / 2, W * .16, W / 2, H / 2, W * .68); fade.addColorStop(0, 'rgba(0,0,0,1)'); fade.addColorStop(1, 'rgba(0,0,0,.12)');
    ctx.globalCompositeOperation = 'destination-in'; ctx.fillStyle = fade; ctx.fillRect(0, 0, W, H);

    // a second sheet standing behind the menu
    const ba = BACK(-70, 0), bb = BACK(70, 0), frost = ctx.createLinearGradient(ba[0], 0, bb[0], 0); frost.addColorStop(0, `rgba(${SKY},.05)`); frost.addColorStop(1, `rgba(${ORCHID},.16)`);
    ctx.globalCompositeOperation = 'source-over'; ctx.beginPath(); path(BACK, PANEL, 0, true); ctx.fillStyle = frost; ctx.fill();
    ctx.globalCompositeOperation = 'lighter'; line(WHITE, .34, lw * .8);

    // the instrument: a fixed bezel, then three rings that turn, each at its own pace
    ctx.beginPath(); arc(RING, 92, 0, TAU); for (let q = 0; q < 4; q++) tick(RING, 92, 98, q * TAU / 4); line(PURPLE, 1, lw);
    ctx.beginPath(); arc(RING, 84, a0 + 6 * st, a0 + 72 * st); for (let i = 6; i <= 72; i++) if (i % 6) tick(RING, 84, 80.5, a0 + i * st); line(WHITE, .42, lw * .8);
    ctx.beginPath(); for (let i = 6; i <= 72; i += 6) tick(RING, 84, 76.5, a0 + i * st); line(WHITE, .95, lw);
    const am = a0 + 3 * st, mk = (r, a) => [r * Math.cos(a), r * Math.sin(a)];
    ctx.beginPath(); path(RING, [mk(85, am - .05), mk(85, am + .05), mk(77.5, am)], 0, true); ctx.fillStyle = `rgb(${PINK})`; ctx.fill();
    ctx.beginPath(); arc(RING, 70, a1, a1 + 8 * D); arc(RING, 70, a1 + 9 * D, a1 + 12 * D); neon(PINK, 1, lw * 1.1);
    ctx.beginPath(); arc(RING, 70, a1 + 14 * D, a1 + 20 * D); neon(PINK, 1, lw * 3.2, lw * 1.2);
    const b0 = -a0 * 1.5;
    ctx.beginPath(); for (let i = 0; i < 60; i++) arc(RING, 62.5, b0 + i * TAU / 60, b0 + (i + .5) * TAU / 60); line(ORCHID, .7, lw * 1.2);
    ctx.beginPath(); arc(RING, 55.5, a2, a2 + 14 * D); arc(RING, 55.5, a2 + 16 * D, a2 + 20 * D); neon(SKY, 1, lw);
    const nd = RING(55.5 * Math.cos(a2), 55.5 * Math.sin(a2)); ctx.beginPath(); ctx.arc(nd[0], nd[1], 2.1 * lw, 0, TAU); ctx.fillStyle = `rgb(${SKY})`; ctx.fill();
    // the logo at the centre, on a faintly tinted lens, its color split a little at the edges, inside four corner marks that keep one stroke of clear space around it
    const la = RING(-50, 0), lb = RING(50, 0), lens = ctx.createLinearGradient(la[0], 0, lb[0], 0); lens.addColorStop(0, `rgba(${SKY},.1)`); lens.addColorStop(1, `rgba(${ORCHID},.1)`);
    ctx.beginPath(); arc(RING, 50, 0, TAU); ctx.fillStyle = lens; ctx.fill(); line(WHITE, .2, lw * .8);
    ctx.beginPath(); for (const [x, y] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) path(RING, [[x * 39.5, y * 19.5], [x * 39.5, y * 26.5], [x * 32.5, y * 26.5]], 0, false); line(WHITE, .6, lw * .8);
    const o = RING(0, 0), ux = RING(1, 0), vy = RING(0, 1), mw = 58, mh = mw * 473 / 863, k = mw / 863;
    const e = [ux[0] - o[0], ux[1] - o[1], vy[0] - o[0], vy[1] - o[1]];
    const logo = (dx, fill) => {
      ctx.setTransform(dpr * e[0] * k, dpr * e[1] * k, dpr * e[2] * k, dpr * e[3] * k, dpr * (o[0] - e[0] * mw / 2 - e[2] * mh / 2 + dx), dpr * (o[1] - e[1] * mw / 2 - e[3] * mh / 2));
      ctx.fillStyle = fill; ctx.fill(shape); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    logo(-1.2 * lw, `rgba(${PINK},.9)`); logo(1.2 * lw, `rgba(${SKY},.9)`);
    ctx.globalCompositeOperation = 'source-over'; logo(0, `rgb(${WHITE})`);
    // its read-out, on a short lead from the bezel: the bearing of the pink pointer on ring one, counted clockwise from the top
    const deg = ((am * 360 / TAU + 90) % 360 + 360) % 360;
    ctx.globalCompositeOperation = 'lighter';
    ctx.beginPath(); path(RING, [mk(92, .9), [66, 81], [92, 81]], 0, false); line(WHITE, .5, lw * .8);
    word(RING, 'AZ ' + deg.toFixed(1).padStart(5, '0'), 92, 89.5, ty(7), 'right', `rgba(${WHITE},.86)`);
    word(RING, 'READY', 92, 89.5 + ty(7) * 1.55, ty(7), 'right', `rgb(${SKY})`);

    // the wire from the selected row to the instrument
    const top = rowTop(sel), S = MENU(72, top + (ROW_H - 8) / 2, LIFT), E = RING(-92, 0);
    const xm = (S[0] + E[0]) / 2, dy = E[1] - S[1], sg = Math.sign(dy), c = Math.min(5 * s, Math.abs(dy) / 2);
    ctx.beginPath(); ctx.moveTo(S[0], S[1]); ctx.lineTo(xm - c, S[1]); ctx.lineTo(xm, S[1] + sg * c); ctx.lineTo(xm, E[1] - sg * c); ctx.lineTo(xm + c, E[1]); ctx.lineTo(E[0], E[1]); neon(SKY, 1, lw);
    const dm = 3 * lw; ctx.beginPath(); ctx.moveTo(E[0] - dm, E[1]); ctx.lineTo(E[0], E[1] - dm); ctx.lineTo(E[0] + dm, E[1]); ctx.lineTo(E[0], E[1] + dm); ctx.closePath(); ctx.fillStyle = `rgb(${SKY})`; ctx.fill();

    // the menu: a dark sheet with two corners cut, a faint wash of color, a pink outline with a cyan ghost beside it
    ctx.globalCompositeOperation = 'source-over';
    const pa = MENU(-70, 0), pb = MENU(70, 0), wash = ctx.createLinearGradient(pa[0], 0, pb[0], 0);
    wash.addColorStop(0, `rgba(${SKY},.09)`); wash.addColorStop(.55, `rgba(${ORCHID},.06)`); wash.addColorStop(1, `rgba(${PINK},.1)`);
    ctx.beginPath(); path(MENU, PANEL, 0, true); ctx.fillStyle = 'rgba(7,9,13,.9)'; ctx.fill(); ctx.fillStyle = wash; ctx.fill();
    ctx.globalCompositeOperation = 'lighter';
    ctx.beginPath(); path(MENU, PANEL, 0, true, 1.5 * lw); line(SKY, .5, lw * .8);
    ctx.beginPath(); path(MENU, PANEL, 0, true); neon(PINK, 1, lw);
    ctx.beginPath(); path(MENU, [[-70, -90], [-30, -90]], 0, false); line(PINK, 1, lw * 3.2);
    ctx.beginPath(); path(MENU, [[54, -87], [67, -74]], 0, false); path(MENU, [[51.5, -84.5], [64.5, -71.5]], 0, false); line(PINK, .8, lw * .8);
    ctx.beginPath(); path(MENU, [[-70, -65], [70, -65]], 0, false); path(MENU, [[-70, 65], [70, 65]], 0, false); line(WHITE, .3, lw * .8);
    ctx.beginPath(); for (let i = 0; i < 3; i++) path(MENU, [[-60, rowTop(i) + ROW_H + 3], [60, rowTop(i) + ROW_H + 3]], 0, false); line(WHITE, .13, lw * .8);
    word(MENU, 'MENU', -60, -77.5, ty(7), 'left', `rgba(${WHITE},.86)`);
    word(MENU, '0' + (Math.round(sel) + 1) + '/04', 50, -77.5, ty(7), 'right', `rgb(${PINK})`);
    word(MENU, 'INDEX', -56, 77.5, ty(7), 'left', `rgba(${WHITE},.5)`);
    ROWS.forEach(([num, name, val], i) => {
      const v = rowTop(i) + ROW_H / 2, on = Math.max(0, 1 - Math.abs(sel - i)), px = 64 - 5 - (3 - i) * 9;
      word(MENU, num, -60, v, ty(7), 'left', `rgb(${PINK})`); word(MENU, name, -41, v, ty(8.5), 'left', `rgba(${WHITE},.88)`); word(MENU, val, 60, v, ty(7), 'right', `rgb(${SKY})`);
      ctx.beginPath(); path(MENU, [[px, 75], [px + 5, 75], [px + 5, 80], [px, 80]], 0, true); ctx.fillStyle = `rgba(${WHITE},${on})`; ctx.fill(); line(PINK, .75 * (1 - on), lw * .8);
    });

    // the selected row: a pale bar standing a little in front of the sheet, with the type under it turned dark
    const bar = [[-78, top], [72, top], [72, top + ROW_H - 8], [64, top + ROW_H], [-78, top + ROW_H]], bl = MENU(-78, top, LIFT), br = MENU(72, top, LIFT);
    ctx.beginPath(); path(MENU, bar, LIFT, true, -1.3 * lw); ctx.fillStyle = `rgba(${PINK},.85)`; ctx.fill();
    ctx.beginPath(); path(MENU, bar, LIFT, true, 1.3 * lw); ctx.fillStyle = `rgba(${SKY},.85)`; ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    const pale = ctx.createLinearGradient(bl[0], 0, br[0], 0); pale.addColorStop(0, '#D6F8FF'); pale.addColorStop(.5, '#FDFFFF'); pale.addColorStop(1, '#F6D4FB');
    ctx.save(); ctx.beginPath(); path(MENU, bar, LIFT, true); ctx.fillStyle = pale; ctx.fill(); ctx.clip();
    ctx.beginPath(); path(MENU, [[-78, top], [-73, top], [-73, top + ROW_H], [-78, top + ROW_H]], LIFT, true); ctx.fillStyle = `rgb(${PINK})`; ctx.fill();
    ROWS.forEach(([num, name, val], i) => {
      const v = rowTop(i) + ROW_H / 2;
      word(MENU, num, -60 - SHIFT, v, ty(7), 'left', '#6728EF', LIFT); word(MENU, name, -41 - SHIFT, v, ty(8.5), 'left', '#07090D', LIFT); word(MENU, val, 60 - SHIFT, v, ty(7), 'right', 'rgba(7,9,13,.74)', LIFT);
    });
    ctx.restore();
  };
  // while the pointer is over the tile the rings turn and the bar goes to the row nearest the pointer; after it
  // leaves, the bar and each ring ease home, land exactly on their resting values, and the drawing stops
  const frame = (now) => {
    const dt = Math.min(48, now - (last || now)) / 1000; last = now;
    let moving = hovering;
    const ds = want - sel; if (Math.abs(ds) < 0.003) sel = want; else { sel += ds * Math.min(1, dt * 11); moving = true; }
    if (hovering) { spin += (1 - spin) * Math.min(1, dt * 4); for (let i = 0; i < 3; i++) ang[i] += RATE[i] * spin * dt; }
    else {
      spin = 0;
      for (let i = 0; i < 3; i++) {
        let d = (REST[i] - ang[i]) % TAU; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU;
        if (Math.abs(d) < 0.003) ang[i] = REST[i]; else { ang[i] += d * Math.min(1, dt * 5); moving = true; }
      }
    }
    paint();
    if (moving) raf = requestAnimationFrame(frame); else last = 0;
  };
  const run = () => { cancelAnimationFrame(raf); last = 0; raf = requestAnimationFrame(frame); };
  const over = (ev) => {
    const y = ev.clientY - cv.getBoundingClientRect().top; let near = 1e9;
    ROWS.forEach((_, i) => { const d = Math.abs(MENU(0, rowTop(i) + ROW_H / 2)[1] - y); if (d < near) { near = d; want = i; } });
    if (!hovering) { hovering = true; run(); }
  };
  const out = () => { if (!hovering) return; hovering = false; want = HOME; run(); };
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    tile.addEventListener('pointerenter', over); tile.addEventListener('pointermove', over, { passive: true });
    tile.addEventListener('pointerleave', out); tile.addEventListener('pointercancel', out);
    // so it can never be left turning: the pointer showing up over anything else, or the window losing focus, counts as leaving too
    document.addEventListener('pointerover', (ev) => { if (hovering && !tile.contains(ev.target)) out(); }, { passive: true });
    addEventListener('blur', out);
  }
  if (document.fonts && document.fonts.load) document.fonts.load('500 12px ' + FONT).then(() => { if (!hovering) paint(); }, () => {});   // the labels are set again once the mono face has arrived
  new ResizeObserver(() => { size(); paint(); }).observe(cv); size(); paint();
})();

// KT Accounts only answers aidenkt.com. On a preview or local copy it cannot say who is
// here, so the permission-gated parts are shown there.
if (!/^(www\.)?aidenkt\.com$/.test(location.hostname)) {
  for (const el of document.querySelectorAll('[data-kt-if]')) { el.removeAttribute('data-kt-if'); el.hidden = false; }
}
