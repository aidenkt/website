// KT-01 — a small machined aluminium instrument, rendered as a studio product shot.
// One self-contained ES module. three.js core only; every mesh, texture and the
// lighting environment is built in code.
//
// At rest it renders once and stops. While the pointer is over the tile the
// set tilts toward it, the key under it goes down and a knob under it turns;
// when the pointer leaves everything eases back to the exact rest pose and
// rendering stops again. With prefers-reduced-motion it stays a still image.
const THREE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js';
let THREE = null; // three.js core, loaded only when there is a canvas to draw on

const LOGO_PATH = 'M0 0h152v473H0zM321 0h387v473H556V121H403l-63 74 172 278H333L232 296V107zM788 0h75v121h-75z';
const ACCENT_DEFAULT = '#15DD7D';
const ORANGE = 0xff7d25;
const ORANGE_KEY = 0xff6c12;                  // albedo that photographs as #FF7D25 under the key light
const MONO = 'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, "DejaVu Sans Mono", monospace';

// ---- dimensions (1 unit = 100 mm) -------------------------------------------
const W = 1.62, D = 1.0, H = 0.17;          // body
const FOOT = 0.012;                          // gap under the body (rubber feet)
const RC = 0.07;                             // plan corner radius
const CHF = 0.014;                           // bright-cut chamfer round the top
const RBB = 0.006;                           // bottom edge fillet
const SEAM_Y = 0.05, SEAM_G = 0.006, SEAM_D = 0.008, BASE_IN = 0.004; // base plate: shadow gap + stepped lip

const DISP = { x0: -0.715, x1: -0.03, z0: -0.415, z1: -0.005, r: 0.028, depth: 0.014, c: 0.004 };
const KEY = { n: 8, r: 0.066, z: 0.285, x0: -0.647, pitch: 0.18486, gap: 0.0105, c: 0.005, depth: 0.034, h: 0.022, travel: 0.018, orange: 7 };
const KNOB = { r: 0.098, z: -0.235, xs: [0.2, 0.55], gap: 0.011, c: 0.005, depth: 0.03, top: 0.1105, range: 2.4 };
const SCREW = { r: 0.0165, top: 0.011, inset: 0.052 };
const LED = { r: 0.0095, z: 0.15, depth: 0.007 };
const GRILLE = { x: 0.375, z: 0.052, cols: 13, rows: 3, pitch: 0.03, r: 0.0074 };
const PORT = { z: -0.17, y: 0.106, w: 0.092, h: 0.03, c: 0.003, depth: 0.036, pad: 0.07 };

const CAM = { fov: 26, yaw: -21 * Math.PI / 180, pitch: 31 * Math.PI / 180, fill: 0.87, fillV: 0.8, cy: -0.012 };
const TILT_Y = 10 * Math.PI / 180, TILT_X = 7 * Math.PI / 180;

// lighting and finish, in one place
const KEYL = { k: 23, angle: 0.33, dist: 4, dir: [0.62, 0.68, -0.4], at: [0.46, 0, -0.24], color: 0xfffaf4 };
const ENV = { az: 25, el: 29.5, k: 0.85, r: 5 };
const MATS = { topRough: 0.68, topEnv: 0.36, wallEnv: 1, capEnv: 0.8 };
const FLOOR = { size: 40, color: 0x535456, env: 0.5 };
const GLASS = { x: -0.04, z: -0.464, rot: 0.673, hl: 0.7, hw: 0.2, k: 0.42 };

function boot() {
  const canvas = document.getElementById('hw3d');
  if (!canvas || !canvas.parentElement || typeof canvas.getContext !== 'function') return;
  // take the context ourselves so a missing WebGL is a quiet no-op
  const attrs = { alpha: false, depth: true, stencil: false, antialias: true, premultipliedAlpha: true, preserveDrawingBuffer: false, powerPreference: 'default' };
  let gl = null;
  try { gl = canvas.getContext('webgl2', attrs) || canvas.getContext('webgl', attrs); } catch (e) { gl = null; }
  if (!gl) return;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, context: gl, antialias: true, alpha: false });
  } catch (e) { return; }
  try {
    main(canvas, renderer);
  } catch (e) {
    try { renderer.dispose(); } catch (_) { /* nothing */ }
    if (typeof console !== 'undefined') console.warn('[hardware3d] disabled:', e);
  }
}

// ---- small helpers -----------------------------------------------------------
function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

// Accumulates indexed geometry with normals, uvs and a grey vertex colour used
// as baked occlusion.
class Geo {
  constructor() { this.p = []; this.nm = []; this.uv = []; this.col = []; this.idx = []; }
  count() { return this.p.length / 3; }
  v(x, y, z, nx, ny, nz, u, v, c) {
    const k = this.p.length / 3;
    this.p.push(x, y, z); this.nm.push(nx, ny, nz); this.uv.push(u, v); this.col.push(c, c, c);
    return k;
  }
  _cross(a, b, c) {
    const p = this.p;
    const ux = p[b * 3] - p[a * 3], uy = p[b * 3 + 1] - p[a * 3 + 1], uz = p[b * 3 + 2] - p[a * 3 + 2];
    const vx = p[c * 3] - p[a * 3], vy = p[c * 3 + 1] - p[a * 3 + 1], vz = p[c * 3 + 2] - p[a * 3 + 2];
    return [uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx];
  }
  // adds a triangle wound so that it faces the same way as its vertex normals
  tri(a, b, c) {
    const g = this._cross(a, b, c);
    if (g[0] * g[0] + g[1] * g[1] + g[2] * g[2] < 1e-20) return;
    const n = this.nm;
    const sx = n[a * 3] + n[b * 3] + n[c * 3], sy = n[a * 3 + 1] + n[b * 3 + 1] + n[c * 3 + 1], sz = n[a * 3 + 2] + n[b * 3 + 2] + n[c * 3 + 2];
    if (g[0] * sx + g[1] * sy + g[2] * sz >= 0) this.idx.push(a, b, c); else this.idx.push(a, c, b);
  }
  quad(a, b, c, d) { this.tri(a, b, c); this.tri(a, c, d); }
  build() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.p, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nm, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    g.setIndex(this.idx);
    g.computeBoundingSphere();
    return g;
  }
}

// contours: closed loops of {x, z, nx, nz}; n points away from the material.
function rrect(x0, x1, z0, z1, r, seg, inward) {
  const pts = [];
  const cs = [[x1 - r, z1 - r, 0], [x0 + r, z1 - r, 0.5], [x0 + r, z0 + r, 1], [x1 - r, z0 + r, 1.5]];
  for (const [ox, oz, a0] of cs) {
    for (let k = 0; k <= seg; k++) {
      const a = (a0 + (k / seg) * 0.5) * Math.PI;
      const nx = Math.cos(a), nz = Math.sin(a);
      pts.push({ x: ox + nx * r, z: oz + nz * r, nx: inward ? -nx : nx, nz: inward ? -nz : nz });
    }
  }
  return pts;
}
function circle(cx, cz, r, n, inward) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const nx = Math.cos(a), nz = Math.sin(a);
    pts.push({ x: cx + nx * r, z: cz + nz * r, nx: inward ? -nx : nx, nz: inward ? -nz : nz });
  }
  return pts;
}

// sweeps a profile [{o, y, nr, ny, c}] along a contour. o = offset along the
// contour normal, (nr, ny) = surface normal in the (contour normal, up) plane.
function strip(G, contour, prof, skip) {
  const n = contour.length, m = prof.length;
  const s = [0];
  for (let i = 0; i < n; i++) {
    const a = contour[i], b = contour[(i + 1) % n];
    s.push(s[i] + (Math.hypot(b.x - a.x, b.z - a.z) || 1 / n));
  }
  const t = [0];
  for (let j = 1; j < m; j++) t.push(t[j - 1] + Math.hypot(prof[j].o - prof[j - 1].o, prof[j].y - prof[j - 1].y));
  const base = G.count();
  for (let i = 0; i <= n; i++) {
    const q = contour[i % n];
    for (let j = 0; j < m; j++) {
      const p = prof[j];
      const l = Math.hypot(p.nr, p.ny) || 1;
      G.v(q.x + q.nx * p.o, p.y, q.z + q.nz * p.o, (q.nx * p.nr) / l, p.ny / l, (q.nz * p.nr) / l, s[i], t[j], p.c === undefined ? 1 : p.c);
    }
  }
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m - 1; j++) {
      if (skip && skip(i, j)) continue;
      const a = base + i * m + j, b = base + (i + 1) * m + j;
      G.quad(a, b, b + 1, a + 1);
    }
  }
}

// lathe: pts = [r, y, smooth]; revolved about the y axis, bottom -> up -> inward.
function lathe(G, pts, seg, colFn) {
  const segN = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const dr = pts[i + 1][0] - pts[i][0], dy = pts[i + 1][1] - pts[i][1];
    const l = Math.hypot(dr, dy) || 1;
    segN.push([dy / l, -dr / l]);
  }
  const prof = [];
  for (let i = 0; i < pts.length; i++) {
    const [r, y, smooth] = pts[i];
    const c = colFn ? colFn(r, y) : 1;
    const a = segN[i - 1], b = segN[i];
    if (a && b && smooth) prof.push({ o: r, y, nr: a[0] + b[0], ny: a[1] + b[1], c });
    else {
      if (a) prof.push({ o: r, y, nr: a[0], ny: a[1], c });
      if (b) prof.push({ o: r, y, nr: b[0], ny: b[1], c });
    }
  }
  strip(G, circle(0, 0, 0, seg, false), prof);
}

// ---- procedural textures -----------------------------------------------------
function aluminiumTextures() {
  const n = 256, r = rng(11);
  const wrap = (i) => ((i % n) + n) % n;
  // white noise, lightly blurred -> bead-blast grain height
  let h = new Float32Array(n * n);
  for (let i = 0; i < h.length; i++) h[i] = r();
  const blur = new Float32Array(n * n);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    let s = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) s += h[wrap(y + dy) * n + wrap(x + dx)] * (dx === 0 && dy === 0 ? 4 : dx === 0 || dy === 0 ? 2 : 1);
    blur[y * n + x] = s / 16;
  }
  h = blur;
  // tileable value noise for slow roughness drift
  const lattice = (p) => {
    const g = new Float32Array(p * p);
    for (let i = 0; i < g.length; i++) g[i] = r();
    return (u, v) => {
      const x = u * p, y = v * p;
      const x0 = Math.floor(x), y0 = Math.floor(y);
      let fx = x - x0, fy = y - y0;
      fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
      const a = g[(y0 % p) * p + (x0 % p)], b = g[(y0 % p) * p + ((x0 + 1) % p)];
      const c = g[((y0 + 1) % p) * p + (x0 % p)], d = g[((y0 + 1) % p) * p + ((x0 + 1) % p)];
      return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
    };
  };
  const n1 = lattice(3), n2 = lattice(7), n3 = lattice(19);
  // faint streaks along x: the last pass of the finishing line
  const streak = new Float32Array(n * n);
  for (let y = 0; y < n; y++) {
    let v = r();
    for (let x = 0; x < n * 2; x++) { v += (r() - v) * 0.06; if (x >= n) streak[y * n + x - n] = v; }
  }

  const nc = makeCanvas(n, n), nctx = nc.getContext('2d');
  const rc = makeCanvas(n, n), rctx = rc.getContext('2d');
  const nd = nctx.createImageData(n, n), rd = rctx.createImageData(n, n);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const i = y * n + x, o = i * 4;
    const dx = (h[y * n + wrap(x + 1)] - h[y * n + wrap(x - 1)]) * 2.2;
    const dy = (h[wrap(y + 1) * n + x] - h[wrap(y - 1) * n + x]) * 2.2;
    const l = Math.hypot(dx, dy, 1);
    nd.data[o] = 127.5 + (127.5 * -dx) / l;
    nd.data[o + 1] = 127.5 + (127.5 * dy) / l;
    nd.data[o + 2] = 127.5 + 127.5 / l;
    nd.data[o + 3] = 255;
    const u = x / n, v = y / n;
    const cloud = 0.5 * n1(u, v) + 0.3 * n2(u, v) + 0.2 * n3(u, v);
    const rough = 0.84 + 0.1 * cloud + 0.07 * (h[i] - 0.5) * 2 + 0.07 * (streak[i] - 0.5);
    const q = clamp(rough, 0, 1) * 255;
    rd.data[o] = q; rd.data[o + 1] = q; rd.data[o + 2] = q; rd.data[o + 3] = 255;
  }
  nctx.putImageData(nd, 0, 0); rctx.putImageData(rd, 0, 0);
  // a few hairline handling marks, in roughness only
  for (let k = 0; k < 9; k++) {
    const x = r() * n, y = r() * n, a = r() * Math.PI, len = 14 + r() * 46;
    rctx.strokeStyle = k % 3 ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.06)';
    rctx.lineWidth = 0.6 + r() * 0.5;
    rctx.beginPath(); rctx.moveTo(x, y);
    rctx.quadraticCurveTo(x + Math.cos(a + 0.1) * len * 0.5, y + Math.sin(a + 0.1) * len * 0.5, x + Math.cos(a) * len, y + Math.sin(a) * len);
    rctx.stroke();
  }
  const mk = (c, rep) => {
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(rep, rep);
    t.anisotropy = 4;
    return t;
  };
  return { normal: mk(nc, 5), rough: mk(rc, 1.15) };
}

// radial "spun" direction field for the anisotropic knob caps
function spunTexture() {
  const n = 128, c = makeCanvas(n, n), ctx = c.getContext('2d');
  const d = ctx.createImageData(n, n);
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const du = (i + 0.5) / n - 0.5, dv = 0.5 - (j + 0.5) / n;
    const l = Math.hypot(du, dv) || 1;
    const o = (j * n + i) * 4;
    d.data[o] = 127.5 + 127.5 * (du / l);
    d.data[o + 1] = 127.5 + 127.5 * (dv / l);
    d.data[o + 2] = 255 * clamp(l / 0.06, 0, 1);
    d.data[o + 3] = 255;
  }
  ctx.putImageData(d, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.generateMipmaps = false; t.minFilter = THREE.LinearFilter;
  return t;
}

// concentric turning marks for the knob caps (roughness, so they only show in the highlight)
function turnedTexture() {
  const n = 256, c = makeCanvas(n, n), ctx = c.getContext('2d'), r = rng(31);
  const ring = new Float32Array(n);
  let v = 0.5;
  for (let i = 0; i < n; i++) { v += (r() - v) * 0.55; ring[i] = v; }
  const d = ctx.createImageData(n, n);
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const l = Math.hypot(i + 0.5 - n / 2, j + 0.5 - n / 2) * 1.9;
    const k = Math.min(n - 2, Math.floor(l)), f = Math.min(1, l - k);
    const q = 255 * clamp(0.72 + 0.56 * (ring[k] + (ring[k + 1] - ring[k]) * f - 0.5), 0, 1);
    const o = (j * n + i) * 4;
    d.data[o] = q; d.data[o + 1] = q; d.data[o + 2] = q; d.data[o + 3] = 255;
  }
  ctx.putImageData(d, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = 4;
  return t;
}

function softboxTexture() {
  const c = makeCanvas(96, 96), ctx = c.getContext('2d');
  ctx.shadowColor = '#fff'; ctx.shadowBlur = 14; ctx.shadowOffsetX = 300;
  ctx.fillStyle = '#fff';
  ctx.fillRect(-300 + 15, 15, 66, 66);
  ctx.shadowColor = 'transparent';
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// the seamless paper: a touch deeper behind the object than in front of it
function floorTexture() {
  const w = 64, h = 256, c = makeCanvas(w, h), ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#a8a6a4');
  g.addColorStop(0.34, '#c4c2bf');
  g.addColorStop(0.6, '#f2f0ed');
  g.addColorStop(1, '#e6e3df');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// occlusion where the body meets the surface: a tight dark line at the contact
// that widens and fades in the direction the light throws it
function contactTexture(pxPerUnit, cw, ch) {
  const c = makeCanvas(cw, ch), ctx = c.getContext('2d');
  const OFF = 2000;
  const rr = (w, d, r, dx, dz) => {
    const x = cw / 2 - (w / 2 - dx) * pxPerUnit - OFF, y = ch / 2 - (d / 2 - dz) * pxPerUnit, ww = w * pxPerUnit, dd = d * pxPerUnit, q = r * pxPerUnit;
    ctx.beginPath();
    ctx.moveTo(x + q, y); ctx.arcTo(x + ww, y, x + ww, y + dd, q); ctx.arcTo(x + ww, y + dd, x, y + dd, q);
    ctx.arcTo(x, y + dd, x, y, q); ctx.arcTo(x, y, x + ww, y, q); ctx.closePath(); ctx.fill();
  };
  ctx.shadowOffsetX = OFF; ctx.fillStyle = '#000';
  ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 0.26 * pxPerUnit; rr(W + 0.02, D + 0.02, RC, -0.085, 0.05);
  ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 0.085 * pxPerUnit; rr(W - 0.01, D - 0.01, RC, -0.03, 0.018);
  ctx.shadowColor = 'rgba(0,0,0,0.95)'; ctx.shadowBlur = 0.022 * pxPerUnit; rr(W - 0.03, D - 0.03, RC, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ---- geometry ----------------------------------------------------------------
function stadium(ac, bc, w, h, n, inward) {
  const r = h / 2, pts = [];
  for (const [ox, a0] of [[ac + w / 2 - r, -Math.PI / 2], [ac - w / 2 + r, Math.PI / 2]]) {
    for (let k = 0; k <= n; k++) {
      const a = a0 + (k / n) * Math.PI;
      const nx = Math.cos(a), nz = Math.sin(a);
      pts.push({ x: ox + nx * r, z: bc + nz * r, nx: inward ? -nx : nx, nz: inward ? -nz : nz });
    }
  }
  return pts;
}

const WALL_C = 0.97;                         // baked shade at the foot of the upper wall

// The port is cut into the left wall. It is built lying flat (x = along the
// wall, y = out of the wall, z = up) and then stood up against the body.
function buildPort(yBot, yTop) {
  const P = new Geo();
  const ac = -PORT.z, bc = PORT.y;
  const mouth = stadium(ac, bc, PORT.w, PORT.h, 8, true);
  // the piece of wall round the hole
  const rect = [[ac - PORT.pad, yBot], [ac + PORT.pad, yBot], [ac + PORT.pad, yTop], [ac - PORT.pad, yTop]].map((q) => new THREE.Vector2(q[0], q[1]));
  const hole = mouth.map((q) => new THREE.Vector2(q.x - q.nx * PORT.c, q.z - q.nz * PORT.c));
  const all = rect.concat(hole), base = P.count();
  for (const v of all) P.v(v.x, 0, v.y, 0, 1, 0, v.x, v.y, WALL_C + (1 - WALL_C) * (v.y - yBot) / (yTop - yBot));
  for (const f of THREE.ShapeUtils.triangulateShape(rect, [hole])) P.tri(base + f[0], base + f[1], base + f[2]);
  // lip, then the bore
  strip(P, mouth, [
    { o: -PORT.c, y: 0, nr: 1, ny: 1, c: 1 }, { o: 0, y: -PORT.c, nr: 1, ny: 1, c: 0.9 },
    { o: 0, y: -PORT.c, nr: 1, ny: 0, c: 0.55 }, { o: 0, y: -PORT.depth * 0.35, nr: 1, ny: 0, c: 0.16 }, { o: 0, y: -PORT.depth, nr: 1, ny: 0, c: 0.03 },
  ]);
  const fan = (contour, y, c) => {
    const c0 = P.v(ac, y, bc, 0, 1, 0, 0, 0, c);
    const ring = contour.map((q) => P.v(q.x, y, q.z, 0, 1, 0, 0, 0, c));
    for (let i = 0; i < ring.length; i++) P.tri(c0, ring[i], ring[(i + 1) % ring.length]);
  };
  fan(mouth, -PORT.depth, 0.02);
  // contact tongue
  const tongue = stadium(ac, bc, PORT.w * 0.7, PORT.h * 0.27, 4, false);
  strip(P, tongue, [{ o: 0, y: -PORT.depth, nr: 1, ny: 0, c: 0.05 }, { o: 0, y: -0.007, nr: 1, ny: 0, c: 0.3 }]);
  fan(tongue, -0.007, 0.42);
  const g = P.build();
  g.applyMatrix4(new THREE.Matrix4().set(0, -1, 0, -W / 2, 0, 0, 1, 0, -1, 0, 0, 0, 0, 0, 0, 1));
  return g;
}

function buildBody() {
  const G = new Geo();
  const SEG = 10;
  const outer = rrect(-W / 2, W / 2, -D / 2, D / 2, RC, SEG, false);
  // two extra stations on the left wall, either side of the port
  const portCol = 2 * (SEG + 1);
  outer.splice(portCol, 0, { x: -W / 2, z: PORT.z + PORT.pad, nx: -1, nz: 0 }, { x: -W / 2, z: PORT.z - PORT.pad, nx: -1, nz: 0 });

  // bright-cut chamfer: a 45 degree flat with a slight crown, hard edges
  const yWall = H - CHF;
  const edge = [];
  for (let k = 0; k <= 6; k++) {
    const t = k / 6, a = ((33 + 24 * t) * Math.PI) / 180;
    edge.push({ o: -CHF * (1 - t), y: H - CHF * t, nr: Math.sin(a), ny: Math.cos(a) });
  }
  const E = new Geo();
  strip(E, outer, edge);

  // wall, shadow gap, base plate set back a little, rounded underside.
  // Vertex colour: darker under the lip, lifted by floor bounce lower down.
  const Wl = new Geo();
  const sA = SEAM_Y + SEAM_G, bi = -BASE_IN;
  const yMid = sA + 0.022;
  const prof = [{ o: 0, y: yWall, nr: 1, ny: 0, c: 1 }, { o: 0, y: yMid, nr: 1, ny: 0, c: WALL_C }, { o: 0, y: sA, nr: 1, ny: 0, c: 0.86 }];
  prof.push({ o: 0, y: sA, nr: 0, ny: -1, c: 0.2 }, { o: -SEAM_D, y: sA, nr: 0, ny: -1, c: 0.03 });
  prof.push({ o: -SEAM_D, y: sA, nr: 1, ny: 0, c: 0.03 }, { o: -SEAM_D, y: SEAM_Y, nr: 1, ny: 0, c: 0.03 });
  prof.push({ o: -SEAM_D, y: SEAM_Y, nr: 0, ny: 1, c: 0.03 }, { o: bi, y: SEAM_Y, nr: 0, ny: 1, c: 0.1 });
  prof.push({ o: bi, y: SEAM_Y, nr: 1, ny: 0, c: 0.5 }, { o: bi, y: SEAM_Y - 0.014, nr: 1, ny: 0, c: 0.84 }, { o: bi, y: RBB + 0.01, nr: 1, ny: 0, c: 0.9 }, { o: bi, y: RBB, nr: 1, ny: 0, c: 0.74 });
  for (let k = 1; k <= 4; k++) {
    const a = (k / 4) * Math.PI / 2;
    prof.push({ o: bi - RBB * (1 - Math.cos(a)), y: RBB * (1 - Math.sin(a)), nr: Math.cos(a), ny: -Math.sin(a), c: 0.74 - 0.5 * (k / 4) });
  }
  strip(Wl, outer, prof, (i, j) => i === portCol && j === 0);

  // milled features in the top face
  const feats = [];
  const recess = (contour, c, depth, floor, cx, cz) => feats.push({ contour, c, depth, floor, cx, cz });
  for (let i = 0; i < KEY.n; i++) {
    const x = KEY.x0 + i * KEY.pitch;
    recess(circle(x, KEY.z, KEY.r + KEY.gap, 48, true), KEY.c, KEY.depth, true, x, KEY.z);
    recess(circle(x, LED.z, LED.r, 14, true), 0.002, LED.depth, true, x, LED.z);
  }
  for (const x of KNOB.xs) recess(circle(x, KNOB.z, KNOB.r + KNOB.gap, 60, true), KNOB.c, KNOB.depth, true, x, KNOB.z);
  recess(rrect(DISP.x0, DISP.x1, DISP.z0, DISP.z1, DISP.r, 7, true), DISP.c, DISP.depth, false);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const x = sx * (W / 2 - SCREW.inset), z = sz * (D / 2 - SCREW.inset);
    feats.push({ contour: circle(x, z, SCREW.r, 24, true), c: SCREW.top, depth: SCREW.top, floor: false, cone: true });
  }
  // speaker grille: drilled holes
  for (let r = 0; r < GRILLE.rows; r++) for (let q = 0; q < GRILLE.cols; q++) {
    const x = GRILLE.x + (q - (GRILLE.cols - 1) / 2) * GRILLE.pitch, z = GRILLE.z + (r - (GRILLE.rows - 1) / 2) * GRILLE.pitch;
    recess(circle(x, z, GRILLE.r, 10, true), 0.0016, 0.03, true, x, z);
  }

  for (const f of feats) {
    const p = [{ o: -f.c, y: H, nr: 1, ny: 1, c: 1 }, { o: 0, y: H - f.c, nr: 1, ny: 1, c: f.cone ? 0.45 : 0.95 }];
    if (!f.cone) p.push({ o: 0, y: H - f.c, nr: 1, ny: 0, c: 0.6 }, { o: 0, y: H - f.c - (f.depth - f.c) * 0.35, nr: 1, ny: 0, c: 0.16 }, { o: 0, y: H - f.depth, nr: 1, ny: 0, c: 0.04 });
    strip(G, f.contour, p);
    if (f.floor) {
      const y = H - f.depth, n = f.contour.length;
      const c0 = G.v(f.cx, y, f.cz, 0, 1, 0, f.cx, f.cz, 0.03);
      const ring = f.contour.map((q) => G.v(q.x, y, q.z, 0, 1, 0, q.x, q.z, 0.03));
      for (let i = 0; i < n; i++) G.tri(c0, ring[i], ring[(i + 1) % n]);
    }
  }

  // top face, triangulated around every feature
  const off = (contour, o) => contour.map((q) => new THREE.Vector2(q.x + q.nx * o, q.z + q.nz * o));
  const top = off(outer, -CHF);
  const holes = feats.map((f) => off(f.contour, -f.c));
  const all = top.concat(...holes);
  const faces = THREE.ShapeUtils.triangulateShape(top, holes);
  const base = G.count();
  for (const v of all) G.v(v.x, H, v.y, 0, 1, 0, v.x, v.y, 1);
  for (const f of faces) G.tri(base + f[0], base + f[1], base + f[2]);

  // underside
  const bot = off(outer, bi - RBB);
  const bf = THREE.ShapeUtils.triangulateShape(bot, []);
  const bb = Wl.count();
  for (const v of bot) Wl.v(v.x, 0, v.y, 0, -1, 0, v.x, v.y, 0.24);
  for (const f of bf) Wl.tri(bb + f[0], bb + f[1], bb + f[2]);

  return { top: G.build(), wall: Wl.build(), edge: E.build(), port: buildPort(yMid, yWall) };
}

// a dished cap with a tight rolled rim
function buildKeyGeometry() {
  const G = new Geo();
  const R = KEY.r, h = KEY.h, f = 0.0062, f2 = 0.008, A = (30 * Math.PI) / 180;
  const Rc = R - 0.001 - f;                                    // crest of the rim
  const pts = [[R, -KEY.depth + 0.004, 0], [R - 0.001, h - f, 1]];
  for (let k = 1; k <= 6; k++) {
    const a = (k / 6) * Math.PI / 2;
    pts.push([Rc + f * Math.cos(a), h - f + f * Math.sin(a), 1]);
  }
  for (let k = 1; k <= 3; k++) {
    const a = (k / 3) * A;
    pts.push([Rc - f2 * Math.sin(a), h - f2 * (1 - Math.cos(a)), 1]);
  }
  const Rd = Rc - f2 * Math.sin(A), yd = h - f2 * (1 - Math.cos(A)), dd = (Math.tan(A) * Rd) / 2;
  for (let k = 1; k <= 8; k++) {
    const r = Rd * (1 - k / 8);
    pts.push([r, yd - dd * (1 - (r / Rd) * (r / Rd)), 1]);
  }
  lathe(G, pts, 48, (r, y) => (y > h - f - 1e-6 ? 0.66 + 0.34 * Math.min(1, (r / Rd) * (r / Rd)) : clamp(0.1 + (y + 0.003) / 0.012, 0.1, 1)));
  for (let i = 0; i < G.count(); i++) { G.uv[i * 2] = G.p[i * 3]; G.uv[i * 2 + 1] = G.p[i * 3 + 2]; }
  return G.build();
}

const KNOB_CAP_R = KNOB.r - 0.0085;
function buildKnobGeometry() {
  const G = new Geo();
  const R = KNOB.r;
  const occ = (r, y) => clamp(0.15 + (y + 0.004) / 0.014, 0.15, 1);
  lathe(G, [[R, -KNOB.depth + 0.004, 0], [R, 0.0155, 0], [R - 0.0045, 0.0195, 0]], 64, occ);
  lathe(G, [[R - 0.0045, 0.0855, 0], [R, 0.0895, 0], [R, 0.1035, 0], [R - 0.007, KNOB.top, 0], [KNOB_CAP_R, KNOB.top, 0]], 64, null);
  return G.build();
}

// diamond knurl: real pyramids. Fine pitch, low teeth; the normals lean a little
// toward the cylinder so the band keeps a soft highlight instead of glittering.
function buildKnurlGeometry() {
  const Rv = KNOB.r - 0.0042, amp = 0.0036, y0 = 0.0195, band = 0.066, N = 60, M = 6;
  const pos = [], col = [], nor = [];
  const P = (u, v, h) => {
    const th = (2 * Math.PI * u) / N, r = Rv + amp * h;
    return [Math.sin(th) * r, y0 + (v * band) / M, Math.cos(th) * r, 0.5 + 0.5 * h];
  };
  const tri = (a, b, c) => {
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
    const mx = a[0] + b[0] + c[0], mz = a[2] + b[2] + c[2];
    const out = nx * mx + nz * mz >= 0;
    if (!out) { nx = -nx; ny = -ny; nz = -nz; }
    for (const q of out ? [a, b, c] : [a, c, b]) {
      const rl = Math.hypot(q[0], q[2]) || 1;
      const bx = nx * 0.6 + (q[0] / rl) * 0.4, by = ny * 0.6, bz = nz * 0.6 + (q[2] / rl) * 0.4, bl = Math.hypot(bx, by, bz) || 1;
      pos.push(q[0], q[1], q[2]); col.push(q[3], q[3], q[3]); nor.push(bx / bl, by / bl, bz / bl);
    }
  };
  for (let k = 1; k <= 2 * M - 1; k++) {
    const v = k / 2, o = k % 2 ? 0.5 : 0;
    for (let j = 0; j < N; j++) {
      const u = j + o;
      const pk = P(u, v, 1), e = P(u + 0.5, v, 0), n = P(u, v + 0.5, 0), w = P(u - 0.5, v, 0), s = P(u, v - 0.5, 0);
      tri(pk, e, n); tri(pk, n, w); tri(pk, w, s); tri(pk, s, e);
    }
  }
  for (let j = 0; j < N; j++) {
    tri(P(j - 0.5, 0, 0), P(j + 0.5, 0, 0), P(j, 0.5, 0));
    tri(P(j - 0.5, M, 0), P(j + 0.5, M, 0), P(j, M - 0.5, 0));
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.computeBoundingSphere();
  return g;
}

function buildScrewGeometry() {
  const s = new THREE.Shape();
  s.absarc(0, 0, 0.0222, 0, Math.PI * 2, false);
  const hex = new THREE.Path();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.3;
    const x = Math.cos(a) * 0.0105, y = Math.sin(a) * 0.0105;
    if (i === 0) hex.moveTo(x, y); else hex.lineTo(x, y);
  }
  hex.closePath();
  s.holes.push(hex);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.009, bevelEnabled: false, curveSegments: 20 });
  g.rotateX(Math.PI / 2); // extrude downwards from y = 0
  return g;
}

// ---- lighting environment ----------------------------------------------------
// A small studio: a dark room, a large overhead softbox, a strip light, a few
// bounce cards. Rendered to a cube map and prefiltered once.
function buildEnvironment(renderer) {
  const env = new THREE.Scene();
  const disposables = [];
  const sph = new THREE.SphereGeometry(30, 32, 16);
  const cols = [];
  const pa = sph.attributes.position;
  for (let i = 0; i < pa.count; i++) {
    const y = pa.getY(i) / 30;
    // warm dim floor below, cooler dark walls above
    let l, warm;
    if (y < 0) { l = 0.03 + 0.03 * (1 + y); warm = 1.06; } else { l = 0.05 - 0.035 * Math.min(1, y * 1.6); warm = 1.0; }
    cols.push(l * warm, l, l * (2 - warm));
  }
  sph.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  const roomMat = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide });
  env.add(new THREE.Mesh(sph, roomMat));
  disposables.push(sph, roomMat);

  const tex = softboxTexture();
  disposables.push(tex);
  const plane = new THREE.PlaneGeometry(1, 1);
  disposables.push(plane);
  const card = (x, y, z, w, h, intensity, tint, roll) => {
    const col = new THREE.Color(tint || 0xffffff).multiplyScalar(intensity);
    const m = new THREE.MeshBasicMaterial({ map: tex, color: col, transparent: true, depthWrite: false, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(plane, m);
    mesh.position.set(x, y, z);
    mesh.scale.set(w, h, 1);
    mesh.lookAt(0, 0, 0);
    if (roll) mesh.rotateZ(roll);
    env.add(mesh);
    disposables.push(m);
  };
  const polar = (az, el, d) => [d * Math.sin(az * Math.PI / 180) * Math.cos(el * Math.PI / 180), d * Math.sin(el * Math.PI / 180), -d * Math.cos(az * Math.PI / 180) * Math.cos(el * Math.PI / 180)];
  // overhead softbox: edge highlights on the chamfer, top light on the keys
  card(0.8, 9.5, 1.8, 12, 13, 3.4, 0xfffaf4);
  // card behind and to the right, where the top face mirrors the lens: this
  // is the hot-spot on the plate and the wedge on the knob caps
  card(...polar(ENV.az, ENV.el, 12), 4.6, 7, ENV.k, 0xf4f7ff, 0.4);
  // rim strip, back-left
  card(-6.2, 4.2, -8.6, 2.6, 8, 9, 0xffffff);
  // right fill
  card(11, 2.2, 2.5, 7, 6, 0.5, 0xffffff);
  // long low card in front: a streak along the front wall
  card(3.5, -2.6, 9.5, 14, 4.2, 0.36, 0xfff0e0);
  // low back-left bounce (lifts the left side face)
  card(-7.5, -2.6, -6.5, 10, 5, 0.42, 0xfff0e0);
  // small front-left kicker for the knob flanks and key rims
  card(-7.5, 3.2, 8.5, 3.2, 5.5, 2, 0xffffff);

  const pm = new THREE.PMREMGenerator(renderer);
  const rt = pm.fromScene(env, 0.035, 0.1, 100);
  pm.dispose();
  for (const d of disposables) d.dispose();
  return rt;
}

// An environment map is infinitely far away, which lights every flat face one
// even tone. This bends the reflection lookup as if the studio were a sphere of
// radius ENV.r round the set, so the softboxes fall off across the plate and
// slide over it when the object tilts.
function studio(mat) {
  mat.onBeforeCompile = (sh) => {
    const chunk = THREE.ShaderChunk && THREE.ShaderChunk.envmap_physical_pars_fragment;
    const hook = 'reflectVec = inverseTransformDirection( reflectVec, viewMatrix );';
    const inc = '#include <envmap_physical_pars_fragment>';
    if (!chunk || chunk.indexOf(hook) < 0 || sh.fragmentShader.indexOf(inc) < 0 || sh.vertexShader.indexOf('#include <project_vertex>') < 0) return;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vHwW;')
      .replace('#include <project_vertex>', '#include <project_vertex>\nvHwW = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz;');
    sh.fragmentShader = sh.fragmentShader.replace(inc, `varying vec3 vHwW;
vec3 hwPx( vec3 r ) {
  vec3 p = vHwW * ${(1 / ENV.r).toFixed(6)};
  float b = dot( p, r );
  float t = - b + sqrt( max( b * b - dot( p, p ) + 1.0, 0.0 ) );
  return normalize( p + t * r );
}
` + chunk.replace(hook, hook + '\n\t\t\treflectVec = hwPx( reflectVec );'));
  };
  mat.customProgramCacheKey = () => 'hw3d-studio';
  return mat;
}

// Cover glass. Polished glass needs a crisper reflection than the prefiltered
// environment gives, so it mirrors one overhead softbox analytically: a lit
// rectangle with a hard edge, Fresnel weighted, fading out under the pocket rim.
function glassMaterial(camDir) {
  const hgt = 0.8;                                           // softbox height above the glass
  // where the mirrored softbox centre lands on the glass, and its plan angle
  const land = new THREE.Vector2(GLASS.x, GLASS.z), a = GLASS.rot;
  const centre = new THREE.Vector2(land.x - (camDir.x / camDir.y) * hgt, land.y - (camDir.z / camDir.y) * hgt);
  return new THREE.ShaderMaterial({
    uniforms: {
      uY: { value: FOOT + H + hgt }, uC: { value: centre },
      uU: { value: new THREE.Vector2(Math.cos(a), Math.sin(a)) }, uV: { value: new THREE.Vector2(-Math.sin(a), Math.cos(a)) },
      uHalf: { value: new THREE.Vector2(GLASS.hl, GLASS.hw) }, uBox: { value: GLASS.k }, uRoom: { value: 0.02 },
      uRect: { value: new THREE.Vector4((DISP.x0 + DISP.x1) / 2, (DISP.z0 + DISP.z1) / 2, (DISP.x1 - DISP.x0) / 2, (DISP.z1 - DISP.z0) / 2) },
      uRad: { value: DISP.r },
    },
    vertexShader: `
      varying vec3 vPos; varying vec3 vNrm; varying vec2 vLoc;
      void main() {
        vec4 wp = modelMatrix * vec4( position, 1.0 );
        vPos = wp.xyz; vNrm = normalize( mat3( modelMatrix ) * normal ); vLoc = position.xz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: `
      uniform float uY, uBox, uRoom, uRad; uniform vec2 uC, uU, uV, uHalf; uniform vec4 uRect;
      varying vec3 vPos; varying vec3 vNrm; varying vec2 vLoc;
      void main() {
        vec3 v = normalize( cameraPosition - vPos ), n = normalize( vNrm );
        vec3 r = reflect( - v, n );
        float box = 0.0;
        if ( r.y > 0.05 ) {
          vec2 h = vPos.xz + r.xz * ( ( uY - vPos.y ) / r.y ) - uC;
          vec2 q = vec2( dot( h, uU ), dot( h, uV ) );
          vec2 e = smoothstep( uHalf + 0.004, uHalf - 0.004, abs( q ) );
          // brightest along the diffuser's centre line, falling toward the frame
          box = e.x * e.y * ( 0.5 + 0.5 * smoothstep( 1.0, 0.0, abs( q.y ) / uHalf.y ) );
        }
        float f = 0.04 + 0.96 * pow( 1.0 - max( dot( n, v ), 0.0 ), 5.0 );
        vec2 d = abs( vLoc - uRect.xy ) - ( uRect.zw - uRad );
        float sd = length( max( d, 0.0 ) ) + min( max( d.x, d.y ), 0.0 ) - uRad;
        float rim = smoothstep( -0.002, -0.011, sd );
        gl_FragColor = vec4( vec3( uRoom + uBox * box ) * f * rim, 1.0 );
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  });
}

// ---- main --------------------------------------------------------------------
function main(canvas, renderer) {
  const parent = canvas.parentElement;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1b1a19);
  const envRT = buildEnvironment(renderer);
  scene.environment = envRT.texture;

  const camera = new THREE.PerspectiveCamera(CAM.fov, 4 / 3, 1, 30);
  const camDir = new THREE.Vector3(Math.sin(CAM.yaw) * Math.cos(CAM.pitch), Math.sin(CAM.pitch), Math.cos(CAM.yaw) * Math.cos(CAM.pitch));

  // key light: a soft spot from behind and to the right. Its cone is the pool
  // of light on the plate and the paper; shadows fall forward, toward the lens.
  const key = new THREE.SpotLight(KEYL.color, KEYL.k, 0, KEYL.angle, 1, 2);
  key.position.set(...KEYL.dir).normalize().multiplyScalar(KEYL.dist).add(new THREE.Vector3(...KEYL.at));
  key.target.position.set(...KEYL.at);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = KEYL.dist - 1.6; key.shadow.camera.far = KEYL.dist + 2.2;
  key.shadow.bias = -0.0006; key.shadow.normalBias = 0.003;
  key.shadow.radius = 7; key.shadow.blurSamples = 16;
  scene.add(key, key.target);

  const stage = new THREE.Group();
  scene.add(stage);
  const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  // materials
  const alu = aluminiumTextures();
  const aluCol = new THREE.Color(0.76, 0.766, 0.775);
  const aluBase = { color: aluCol, metalness: 1, roughness: 0.5, roughnessMap: alu.rough, normalMap: alu.normal, normalScale: new THREE.Vector2(0.2, 0.2), vertexColors: true };
  const topMat = studio(new THREE.MeshStandardMaterial({ ...aluBase, roughness: MATS.topRough, envMapIntensity: MATS.topEnv }));
  const wallMat = studio(new THREE.MeshStandardMaterial({ ...aluBase, roughness: 0.46, normalScale: new THREE.Vector2(0.09, 0.09), envMapIntensity: MATS.wallEnv }));
  // the chamfer is cut after blasting, so it is bright and smooth
  const edgeMat = studio(new THREE.MeshStandardMaterial({ color: new THREE.Color(0.86, 0.865, 0.87), metalness: 1, roughness: 0.2, vertexColors: true }));
  const knobMat = studio(new THREE.MeshStandardMaterial({ color: new THREE.Color(0.74, 0.745, 0.755), metalness: 1, roughness: 0.34, vertexColors: true }));
  const knurlMat = studio(new THREE.MeshStandardMaterial({ color: new THREE.Color(0.56, 0.565, 0.58), metalness: 1, roughness: 0.46, vertexColors: true }));
  const capMat = studio(new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0.7, 0.705, 0.715), metalness: 1, roughness: 0.4, roughnessMap: turnedTexture(), anisotropy: 0.8, anisotropyMap: spunTexture(), envMapIntensity: MATS.capEnv }));
  const rubN = alu.normal.clone(); rubN.repeat.set(11, 11); rubN.needsUpdate = true;
  const rubR = alu.rough.clone(); rubR.repeat.set(5, 5); rubR.needsUpdate = true;
  const rubber = { metalness: 0, roughness: 0.46, roughnessMap: rubR, normalMap: rubN, normalScale: new THREE.Vector2(0.14, 0.14), vertexColors: true };
  const rubberMat = new THREE.MeshStandardMaterial({ color: 0x1d1e20, ...rubber });
  const orangeMat = new THREE.MeshPhysicalMaterial({ color: ORANGE_KEY, ...rubber, roughness: 0.56, specularIntensity: 0.4 });
  const steelMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(0.3, 0.3, 0.31), metalness: 1, roughness: 0.36 });
  const pitMat = new THREE.MeshStandardMaterial({ color: 0x050505, metalness: 0, roughness: 0.9 });
  const paintOrange = new THREE.MeshStandardMaterial({ color: ORANGE, metalness: 0, roughness: 0.5 });
  const paintWhite = new THREE.MeshStandardMaterial({ color: 0xe9e6de, metalness: 0, roughness: 0.5 });
  const ledOff = new THREE.MeshStandardMaterial({ color: 0x161717, metalness: 0, roughness: 0.28 });
  const ledOn = new THREE.MeshBasicMaterial({ color: ACCENT_DEFAULT, toneMapped: false });

  // device
  const device = new THREE.Group();
  device.position.y = FOOT;
  stage.add(device);

  const bodyGeo = buildBody();
  const body = new THREE.Mesh(bodyGeo.top, topMat);
  const bodyWall = new THREE.Mesh(bodyGeo.wall, wallMat);
  const bodyEdge = new THREE.Mesh(bodyGeo.edge, edgeMat);
  const port = new THREE.Mesh(bodyGeo.port, wallMat);
  for (const m of [body, bodyWall, bodyEdge]) { m.castShadow = true; m.receiveShadow = true; }
  device.add(body, bodyWall, bodyEdge, port);

  // feet
  const footGeo = new THREE.CylinderGeometry(0.05, 0.05, FOOT, 20);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const f = new THREE.Mesh(footGeo, pitMat);
    f.position.set(sx * (W / 2 - 0.13), -FOOT / 2, sz * (D / 2 - 0.13));
    device.add(f);
  }

  // screws
  const screwGeo = buildScrewGeometry();
  const hexFloor = new THREE.CircleGeometry(0.0108, 6);
  hexFloor.rotateX(-Math.PI / 2);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const g = new THREE.Group();
    g.position.set(sx * (W / 2 - SCREW.inset), H - 0.0062, sz * (D / 2 - SCREW.inset));
    g.rotation.y = sx * 0.9 + sz * 0.4;
    const head = new THREE.Mesh(screwGeo, steelMat);
    head.receiveShadow = true;
    const pit = new THREE.Mesh(hexFloor, pitMat);
    pit.position.y = -0.0085; pit.rotation.y = 0.3;
    g.add(head, pit);
    device.add(g);
  }

  // status LEDs, one above each key
  const ledGeo = new THREE.CircleGeometry(LED.r - 0.0004, 16);
  ledGeo.rotateX(-Math.PI / 2);
  const leds = [];
  for (let i = 0; i < KEY.n; i++) {
    const m = new THREE.Mesh(ledGeo, i === 0 ? ledOn : ledOff);
    m.position.set(KEY.x0 + i * KEY.pitch, H - 0.0042, LED.z);
    device.add(m);
    leds.push(m);
  }

  // display: emissive panel under a sheet of glass
  const dw = DISP.x1 - DISP.x0, dd = DISP.z1 - DISP.z0;
  const dcan = makeCanvas(768, Math.round((768 * dd) / dw));
  const dctx = dcan.getContext('2d');
  const dtex = new THREE.CanvasTexture(dcan);
  dtex.colorSpace = THREE.SRGBColorSpace;
  dtex.anisotropy = maxAniso;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(dw, dd), new THREE.MeshBasicMaterial({ map: dtex, toneMapped: false }));
  screen.rotation.x = -Math.PI / 2;
  screen.position.set((DISP.x0 + DISP.x1) / 2, H - DISP.depth + 0.002, (DISP.z0 + DISP.z1) / 2);
  device.add(screen);

  const gshape = new THREE.Shape(rrect(DISP.x0, DISP.x1, DISP.z0, DISP.z1, DISP.r, 7, false).map((q) => new THREE.Vector2(q.x, -q.z)));
  const glassGeo = new THREE.ShapeGeometry(gshape);
  glassGeo.rotateX(-Math.PI / 2);
  const glass = new THREE.Mesh(glassGeo, glassMaterial(camDir));
  glass.position.y = H - DISP.c - 0.0005;
  glass.renderOrder = 4;
  device.add(glass);

  // keys
  const keyGeo = buildKeyGeometry();
  const keyPickGeo = new THREE.CylinderGeometry(KEY.r + 0.004, KEY.r + 0.004, KEY.h + 0.008, 20);
  const pickMat = new THREE.MeshBasicMaterial({ visible: false });
  const keys = [];
  for (let i = 0; i < KEY.n; i++) {
    const m = new THREE.Mesh(keyGeo, i === KEY.orange ? orangeMat : rubberMat);
    m.position.set(KEY.x0 + i * KEY.pitch, H, KEY.z);
    m.castShadow = true; m.receiveShadow = true;
    device.add(m);
    // a fixed, invisible target for the pointer, so a key that has gone down
    // is still the key under the pointer
    const pick = new THREE.Mesh(keyPickGeo, pickMat);
    pick.position.set(m.position.x, H + KEY.h / 2 - 0.004, KEY.z);
    device.add(pick);
    keys.push({ mesh: m, pick, y: 0, v: 0, down: false, kind: 'key', index: i });
    pick.userData.ref = keys[i];
  }

  // knobs
  const knobGeo = buildKnobGeometry(), knurlGeo = buildKnurlGeometry();
  const capGeo = new THREE.CircleGeometry(KNOB_CAP_R, 48);
  capGeo.rotateX(-Math.PI / 2);
  const lineGeo = new THREE.BoxGeometry(0.0135, 0.0012, 0.064);
  const slotGeo = new THREE.BoxGeometry(0.0205, 0.0006, 0.0685);
  const pickGeo = new THREE.CylinderGeometry(KNOB.r + 0.004, KNOB.r + 0.004, KNOB.top, 20);
  const knobs = [];
  KNOB.xs.forEach((x, i) => {
    const g = new THREE.Group();
    g.position.set(x, H, KNOB.z);
    const a = new THREE.Mesh(knobGeo, knobMat), b = new THREE.Mesh(knurlGeo, knurlMat), c = new THREE.Mesh(capGeo, capMat);
    c.position.y = KNOB.top;
    const paint = i === 0 ? paintOrange : paintWhite;
    const line = new THREE.Mesh(lineGeo, paint);
    line.position.set(0, KNOB.top + 0.0003, -KNOB_CAP_R + 0.0325);
    const slot = new THREE.Mesh(slotGeo, pitMat);
    slot.position.set(0, KNOB.top + 0.0001, -KNOB_CAP_R + 0.0335);
    for (const m of [a, b, c]) { m.castShadow = true; m.receiveShadow = true; }
    g.add(a, b, c, slot, line);
    const pick = new THREE.Mesh(pickGeo, pickMat);
    pick.position.y = KNOB.top / 2;
    g.add(pick);
    device.add(g);
    const rest = i === 0 ? -0.8 : 1.25;
    const k = { group: g, pick, value: rest, target: rest, rest, kind: 'knob', index: i };
    pick.userData.ref = k;
    g.rotation.y = -rest;
    knobs.push(k);
  });

  // paint-filled engraving, baked occlusion round everything that meets the
  // top face, and the faint marks a real part carries
  const S = 1536 / W;
  const lcan = makeCanvas(1536, Math.round(D * S)), lctx = lcan.getContext('2d');
  const px = (x) => (x + W / 2) * S, pz = (z) => (z + D / 2) * S;
  const lr = rng(23);
  // anodising tone drift: a few very large, very faint patches
  for (const [x, z, rad, col] of [[-0.5, 0.3, 0.75, '0,0,0'], [0.62, -0.38, 0.6, '0,0,0'], [0.25, 0.2, 0.55, '255,250,244'], [-0.2, -0.45, 0.5, '0,0,0']]) {
    const g = lctx.createRadialGradient(px(x), pz(z), 0, px(x), pz(z), rad * S);
    g.addColorStop(0, `rgba(${col},0.05)`); g.addColorStop(1, `rgba(${col},0)`);
    lctx.fillStyle = g; lctx.fillRect(0, 0, lcan.width, lcan.height);
  }
  const halo = (x, z, r0, r1, a) => {
    const g = lctx.createRadialGradient(px(x), pz(z), r0 * S, px(x), pz(z), r1 * S);
    g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(0.45, `rgba(0,0,0,${a * 0.3})`); g.addColorStop(1, 'rgba(0,0,0,0)');
    lctx.fillStyle = g;
    lctx.beginPath(); lctx.arc(px(x), pz(z), r1 * S, 0, Math.PI * 2); lctx.arc(px(x), pz(z), r0 * S, 0, Math.PI * 2, true); lctx.fill();
  };
  // concentric tool marks left by the cutter round a bore
  const marks = (x, z, r0, r1, n, a) => {
    for (let k = 0; k < n; k++) {
      const r = r0 + ((r1 - r0) * (k + lr() * 0.7)) / n;
      lctx.strokeStyle = k % 2 ? `rgba(255,255,255,${a * (0.5 + lr())})` : `rgba(0,0,0,${a * (0.7 + lr())})`;
      lctx.lineWidth = 0.7 + lr() * 0.9;
      lctx.beginPath(); lctx.arc(px(x), pz(z), r * S, 0, Math.PI * 2); lctx.stroke();
    }
  };
  for (let i = 0; i < KEY.n; i++) {
    const x = KEY.x0 + i * KEY.pitch, r0 = KEY.r + KEY.gap + KEY.c;
    halo(x, KEY.z, r0, KEY.r + 0.056, 0.36);
    marks(x, KEY.z, r0 + 0.002, r0 + 0.009, 3, 0.07);
  }
  for (const x of KNOB.xs) {
    const r0 = KNOB.r + KNOB.gap + KNOB.c;
    halo(x, KNOB.z, r0, KNOB.r + 0.095, 0.46);
    marks(x, KNOB.z, r0 + 0.002, r0 + 0.019, 8, 0.1);
  }
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) marks(sx * (W / 2 - SCREW.inset), sz * (D / 2 - SCREW.inset), SCREW.r + SCREW.top + 0.002, SCREW.r + SCREW.top + 0.012, 4, 0.09);
  // keep all of that off the glass
  lctx.save();
  lctx.globalCompositeOperation = 'destination-out';
  lctx.fillRect(px(DISP.x0 - DISP.c), pz(DISP.z0 - DISP.c), (dw + 2 * DISP.c) * S, (dd + 2 * DISP.c) * S);
  lctx.restore();
  // a hairline of shade where the plate drops into the display pocket
  lctx.strokeStyle = 'rgba(0,0,0,0.22)'; lctx.lineWidth = 0.006 * S;
  lctx.beginPath();
  rrect(DISP.x0 - DISP.c - 0.003, DISP.x1 + DISP.c + 0.003, DISP.z0 - DISP.c - 0.003, DISP.z1 + DISP.c + 0.003, DISP.r + DISP.c + 0.003, 6, false).forEach((q, i) => (i ? lctx.lineTo(px(q.x), pz(q.z)) : lctx.moveTo(px(q.x), pz(q.z))));
  lctx.closePath(); lctx.stroke();

  const ink = 'rgba(11,11,12,0.96)';
  const legend = (txt, x, z, size, track) => {
    const fs = size * S;
    lctx.font = `700 ${fs}px ${MONO}`;
    lctx.textBaseline = 'middle'; lctx.textAlign = 'left'; lctx.fillStyle = ink;
    const ws = [...txt].map((ch) => lctx.measureText(ch).width);
    const tr = track * fs;
    let x0 = px(x) - (ws.reduce((a, b) => a + b, 0) + tr * (txt.length - 1)) / 2;
    [...txt].forEach((ch, i) => {
      // lit lower lip, then the dark fill: reads as a shallow engraving
      lctx.fillStyle = 'rgba(255,255,255,0.34)'; lctx.fillText(ch, x0, pz(z) + 1.6);
      lctx.fillStyle = ink; lctx.fillText(ch, x0, pz(z));
      x0 += ws[i] + tr;
    });
  };
  for (let i = 0; i < KEY.n; i++) legend(String(i + 1), KEY.x0 + i * KEY.pitch, KEY.z + KEY.r + 0.058, 0.04, 0);
  legend('LEVEL', KNOB.xs[0], KNOB.z + KNOB.r + 0.083, 0.038, 0.14);
  legend('TONE', KNOB.xs[1], KNOB.z + KNOB.r + 0.083, 0.038, 0.14);
  // dial ticks
  for (const x of KNOB.xs) for (let k = 0; k <= 10; k++) {
    const a = -KNOB.range + (k / 10) * KNOB.range * 2;
    const rr = KNOB.r + 0.041, tx = px(x + Math.sin(a) * rr), tz = pz(KNOB.z - Math.cos(a) * rr), tr = (k % 5 === 0 ? 0.0058 : 0.0038) * S;
    lctx.fillStyle = 'rgba(255,255,255,0.3)';
    lctx.beginPath(); lctx.arc(tx, tz + 1.2, tr, 0, Math.PI * 2); lctx.fill();
    lctx.fillStyle = ink;
    lctx.beginPath(); lctx.arc(tx, tz, tr, 0, Math.PI * 2); lctx.fill();
  }
  const ltex = new THREE.CanvasTexture(lcan);
  ltex.colorSpace = THREE.SRGBColorSpace;
  ltex.anisotropy = maxAniso;
  const legendMesh = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshBasicMaterial({ map: ltex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
  legendMesh.rotation.x = -Math.PI / 2;
  legendMesh.position.y = H + 0.0004;
  legendMesh.renderOrder = 3;
  device.add(legendMesh);

  // the surface: lit matte paper that takes the key light's pool and shadow,
  // plus baked contact occlusion
  const ftex = floorTexture();
  ftex.repeat.set(FLOOR.size / 9, FLOOR.size / 9); ftex.offset.set(0.5 - FLOOR.size / 18, 0.5 - FLOOR.size / 18);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(FLOOR.size, FLOOR.size), new THREE.MeshStandardMaterial({ color: FLOOR.color, map: ftex, metalness: 0, roughness: 0.94, dithering: true, envMapIntensity: FLOOR.env }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  stage.add(ground);
  const CPX = 150, cw = 450, ch = 360;
  const contact = new THREE.Mesh(new THREE.PlaneGeometry(cw / CPX, ch / CPX), new THREE.MeshBasicMaterial({ map: contactTexture(CPX, cw, ch), transparent: true, depthWrite: false, opacity: 0.92 }));
  contact.rotation.x = -Math.PI / 2;
  contact.position.set(0, 0.0006, 0);
  contact.renderOrder = 2;
  stage.add(contact);

  // ---- display graphics ------------------------------------------------------
  const logo = new Path2D(LOGO_PATH);
  const probe = makeCanvas(1, 1).getContext('2d', { willReadFrequently: true });
  let accent = '';
  let pressed = -1;
  function readAccent() {
    try {
      return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || ACCENT_DEFAULT;
    } catch (e) { return ACCENT_DEFAULT; }
  }
  function drawDisplay() {
    const c = dctx, cw2 = dcan.width, ch2 = dcan.height;
    c.globalAlpha = 1;
    c.fillStyle = '#020303'; c.fillRect(0, 0, cw2, ch2);
    // lit panel area sits inside a black border, as on a real module
    c.fillStyle = '#070909';
    c.fillRect(22, 22, cw2 - 44, ch2 - 44);
    c.fillStyle = ACCENT_DEFAULT; c.fillStyle = accent;
    // the mark, 55% of the glass wide, with the model name set under it
    const m = 0.07 * cw2, lw = 0.55 * cw2, s = lw / 863, lh = 473 * s;
    let fs = 0.115 * cw2;
    c.font = `700 ${fs}px ${MONO}`;
    fs *= (0.64 * lw) / c.measureText('KT-01').width;
    c.font = `700 ${fs}px ${MONO}`;
    const blockH = lh + 0.05 * cw2 + fs * 0.72, lx = m, ly = (ch2 - blockH) / 2;
    c.save(); c.translate(lx, ly); c.scale(s, s); c.fill(logo); c.restore();
    c.textBaseline = 'alphabetic'; c.textAlign = 'left';
    c.fillText('KT-01', lx - fs * 0.03, ly + blockH);
    // four tall segmented level bars driven by the two knobs
    const lvl = (knobs[0].value + KNOB.range) / (2 * KNOB.range);
    const tone = knobs[1].value / KNOB.range;
    const rx = lx + lw + 0.07 * cw2, rw = cw2 - m - rx, gap = rw * 0.1, bw = (rw - 3 * gap) / 4, shape = [0.86, 1.0, 0.7, 0.52];
    const rows = 8, rg = blockH * 0.04, rh = (blockH - rg * (rows - 1)) / rows;
    for (let i = 0; i < 4; i++) {
      const v = clamp((0.16 + 0.84 * lvl) * 1.3 * shape[i] * (1 + tone * (i - 1.5) * 0.34), 0.04, 1);
      const lit = Math.max(1, Math.round(v * rows));
      for (let k = 0; k < rows; k++) {
        c.globalAlpha = k < lit ? 1 : 0.16;
        c.fillRect(rx + i * (bw + gap), ly + blockH - (k + 1) * rh - k * rg, bw, rh);
      }
    }
    c.globalAlpha = 1;
    dtex.needsUpdate = true;
  }
  function refreshAccent() {
    const a = readAccent();
    if (a === accent) return false;
    accent = a;
    drawDisplay();
    // the lit LED takes the same colour; read it back so any CSS colour syntax works
    try {
      probe.fillStyle = ACCENT_DEFAULT; probe.fillStyle = accent; probe.fillRect(0, 0, 1, 1);
      const d = probe.getImageData(0, 0, 1, 1).data;
      ledOn.color.setRGB(d[0] / 255, d[1] / 255, d[2] / 255, THREE.SRGBColorSpace);
    } catch (e) { /* keep the previous colour */ }
    return true;
  }
  refreshAccent();
  let litLed = 0;
  function showLed(i) {
    if (i === litLed) return;
    leds[litLed].material = ledOff; leds[i].material = ledOn; litLed = i;
  }

  // ---- framing ---------------------------------------------------------------
  const corners = [];
  for (const x of [-W / 2, W / 2]) for (const z of [-D / 2, D / 2]) for (const y of [0, FOOT + H]) corners.push(new THREE.Vector3(x, y, z));
  for (const x of KNOB.xs) corners.push(new THREE.Vector3(x, FOOT + H + KNOB.top, KNOB.z - KNOB.r), new THREE.Vector3(x + KNOB.r, FOOT + H + KNOB.top, KNOB.z));
  const tmp = new THREE.Vector3(), right = new THREE.Vector3(), up = new THREE.Vector3();
  let sizeW = 0, sizeH = 0, sizeR = 0;
  // sizes the drawing buffer and fits the camera; false when nothing changed
  function frame() {
    const w = canvas.clientWidth || parent.clientWidth, h = canvas.clientHeight || parent.clientHeight;
    if (!w || !h) return false;
    const pr = Math.min(window.devicePixelRatio || 1, 2);
    if (w === sizeW && h === sizeH && pr === sizeR) return false; // nothing changed
    sizeW = w; sizeH = h; sizeR = pr;
    renderer.setPixelRatio(pr);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const target = new THREE.Vector3(0, 0.08, 0);
    let dist = 6;
    const th = Math.tan((CAM.fov * Math.PI) / 360);
    for (let it = 0; it < 8; it++) {
      camera.position.copy(target).addScaledVector(camDir, dist);
      camera.lookAt(target);
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld(true);
      let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
      for (const c of corners) {
        tmp.copy(c).project(camera);
        x0 = Math.min(x0, tmp.x); x1 = Math.max(x1, tmp.x); y0 = Math.min(y0, tmp.y); y1 = Math.max(y1, tmp.y);
      }
      const k = Math.max((x1 - x0) / 2 / CAM.fill, (y1 - y0) / 2 / CAM.fillV);
      right.setFromMatrixColumn(camera.matrixWorld, 0);
      up.setFromMatrixColumn(camera.matrixWorld, 1);
      target.addScaledVector(right, ((x0 + x1) / 2) * dist * th * camera.aspect);
      target.addScaledVector(up, ((y0 + y1) / 2 - CAM.cy) * dist * th);
      dist *= k;
    }
    camera.position.copy(target).addScaledVector(camDir, dist);
    camera.lookAt(target);
    camera.near = Math.max(0.5, dist - 2.5); camera.far = dist + 4;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld(true);
    return true;
  }
  function render() { if (sizeW) renderer.render(scene, camera); }

  // ---- motion ----------------------------------------------------------------
  const reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  const tilt = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 };
  let raf = 0, last = 0, hot = null, lastX = 0, inside = false, shownLevel = [knobs[0].value, knobs[1].value], shownPressed = -1;

  function spring(cur, vel, target, w, zeta, dt) {
    // semi-implicit damped spring
    const a = -2 * zeta * w * vel - w * w * (cur - target);
    vel += a * dt;
    return [cur + vel * dt, vel];
  }
  function step(dt) {
    let busy = false;
    // tilt
    [tilt.x, tilt.vx] = spring(tilt.x, tilt.vx, tilt.tx, 9, 1, dt);
    [tilt.y, tilt.vy] = spring(tilt.y, tilt.vy, tilt.ty, 9, 1, dt);
    if (Math.abs(tilt.x - tilt.tx) < 2e-4 && Math.abs(tilt.vx) < 2e-3) { tilt.x = tilt.tx; tilt.vx = 0; } else busy = true;
    if (Math.abs(tilt.y - tilt.ty) < 2e-4 && Math.abs(tilt.vy) < 2e-3) { tilt.y = tilt.ty; tilt.vy = 0; } else busy = true;
    stage.rotation.set(tilt.x, tilt.y, 0);
    // keys
    for (const k of keys) {
      const t = k.down ? -KEY.travel : 0;
      [k.y, k.v] = spring(k.y, k.v, t, k.down ? 62 : 46, k.down ? 0.8 : 0.5, dt);
      if (k.y < -KEY.travel - 0.0015) { k.y = -KEY.travel - 0.0015; if (k.v < 0) k.v = 0; }
      if (k.y > 0.0035) { k.y = 0.0035; if (k.v > 0) k.v = 0; }
      if (Math.abs(k.y - t) < 5e-5 && Math.abs(k.v) < 2e-3) { k.y = t; k.v = 0; } else busy = true;
      k.mesh.position.y = H + k.y;
    }
    // knobs
    knobs.forEach((k, i) => {
      const d = k.target - k.value;
      if (Math.abs(d) < 1e-3) k.value = k.target; else { k.value += d * (1 - Math.exp(-dt * (inside ? 22 : 7))); busy = true; }
      k.group.rotation.y = -k.value;
      if (Math.abs(k.value - shownLevel[i]) > 0.01 || (k.value === k.target && k.value !== shownLevel[i])) shownLevel[i] = NaN;
    });
    if (Number.isNaN(shownLevel[0]) || Number.isNaN(shownLevel[1]) || shownPressed !== pressed) {
      const redraw = Number.isNaN(shownLevel[0]) || Number.isNaN(shownLevel[1]);
      shownLevel = [knobs[0].value, knobs[1].value]; shownPressed = pressed;
      showLed(pressed >= 0 ? pressed : 0);
      if (redraw) drawDisplay();
    }
    return busy;
  }
  function tick(now) {
    raf = 0;
    const dt = clamp((now - last) / 1000, 0.001, 1 / 30);
    last = now;
    // sub-step so the stiff key springs stay stable at low frame rates
    let busy = false;
    // the body is still easing under a resting pointer: keep the pick honest
    if (inside && (tilt.x !== tilt.tx || tilt.y !== tilt.ty)) pick();
    const n = Math.max(1, Math.ceil(dt / (1 / 120)));
    for (let i = 0; i < n; i++) busy = step(dt / n);
    render();
    if (busy) raf = requestAnimationFrame(tick);
  }
  function wake() {
    if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
  }

  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const pickables = keys.map((k) => k.pick).concat(knobs.map((k) => k.pick));
  function release() {
    for (const k of keys) k.down = false;
    pressed = -1; hot = null;
  }
  // which control is under the pointer; the key there goes down
  function pick() {
    stage.updateMatrixWorld(true);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(pickables, false)[0];
    const ref = hit ? hit.object.userData.ref : null;
    for (const k of keys) k.down = k === ref;
    pressed = ref && ref.kind === 'key' ? ref.index : -1;
    return ref;
  }
  function onMove(e) {
    if (reduce.matches || !sizeW) return;
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    inside = true;
    const nx = clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1);
    const ny = clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1);
    ndc.set(nx, -ny);
    const ref = pick();
    if (ref && ref.kind === 'knob') {
      // horizontal travel turns the knob; the body holds still meanwhile so
      // the knob stays under the pointer
      if (hot === ref) ref.target = clamp(ref.target + (e.clientX - lastX) * 0.022, -KNOB.range, KNOB.range);
      hot = ref;
    } else {
      hot = null;
      tilt.ty = nx * TILT_Y;
      tilt.tx = ny * TILT_X;
    }
    lastX = e.clientX;
    wake();
  }
  function onLeave() {
    if (!inside && !raf) return; // already at rest
    // everything heads back to the exact rest pose
    inside = false;
    tilt.tx = 0; tilt.ty = 0;
    release();
    for (const k of knobs) k.target = k.rest;
    if (reduce.matches) return;
    wake();
  }
  parent.addEventListener('pointerenter', onMove, { passive: true });
  parent.addEventListener('pointermove', onMove, { passive: true });
  parent.addEventListener('pointerdown', onMove, { passive: true });
  parent.addEventListener('pointerleave', onLeave, { passive: true });
  parent.addEventListener('pointercancel', onLeave, { passive: true });
  window.addEventListener('blur', onLeave);
  document.addEventListener('visibilitychange', () => { if (document.hidden) onLeave(); });

  function settle() {
    // jump straight to the rest pose (reduced motion)
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    tilt.x = tilt.y = tilt.vx = tilt.vy = tilt.tx = tilt.ty = 0;
    stage.rotation.set(0, 0, 0);
    release();
    for (const k of keys) { k.y = 0; k.v = 0; k.mesh.position.y = H; }
    inside = false;
    for (const k of knobs) { k.value = k.target = k.rest; k.group.rotation.y = -k.value; }
    shownLevel = [knobs[0].value, knobs[1].value]; shownPressed = -1;
    showLed(0);
    drawDisplay();
    render();
  }
  const onReduce = () => { if (reduce.matches) settle(); };
  if (reduce.addEventListener) reduce.addEventListener('change', onReduce);
  else if (reduce.addListener) reduce.addListener(onReduce);

  // ---- observers -------------------------------------------------------------
  const onResize = () => { if (frame() && !raf) render(); };
  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(onResize);
    ro.observe(parent); ro.observe(canvas);
  }
  window.addEventListener('resize', onResize, { passive: true }); // also catches pixel-ratio changes
  if (typeof MutationObserver !== 'undefined') {
    new MutationObserver(() => { if (refreshAccent() && !raf) render(); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class', 'data-theme'] });
  }
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); if (raf) { cancelAnimationFrame(raf); raf = 0; } });
  canvas.addEventListener('webglcontextrestored', () => {
    // the prefiltered studio lived on the GPU; build it again, then redraw at rest
    try { scene.environment = buildEnvironment(renderer).texture; } catch (e) { /* keep going unlit */ }
    sizeW = 0;
    settle();
    if (frame()) render();
  });

  if (frame()) render();
}

if (typeof document !== 'undefined' && document.getElementById('hw3d')) {
  import(THREE_URL)
    .then((mod) => { THREE = mod; boot(); })
    .catch(() => { /* no three.js: the tile keeps its CSS background */ });
}
