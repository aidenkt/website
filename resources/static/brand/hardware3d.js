// Standalone, demand-rendered instrument. No work is scheduled while settled.
const canvas = document.getElementById('hw3d');
if (canvas) {
  import('https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js')
    .then(THREE => mountHardware(THREE, canvas))
    .catch(() => { /* The tile remains its CSS background without WebGL/CDN access. */ });
}

function mountHardware(T, canvas) {
  const tile = canvas.parentElement;
  if (!tile) return;
  let renderer;
  try {
    renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: false });
  } catch { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor('#2A2928');
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.VSMShadowMap;
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.22;
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(34, 4 / 3, 0.1, 80);
  const device = new T.Group();
  device.position.y = 0.14;
  scene.add(device);
  const metal = new T.MeshStandardMaterial({ color: '#bfc1bf', metalness: 0.62, roughness: 0.64 });
  const edge = new T.MeshStandardMaterial({ color: '#929794', metalness: 0.65, roughness: 0.52 });
  const dark = new T.MeshStandardMaterial({ color: '#202321', roughness: 0.88 });
  const recess = new T.MeshStandardMaterial({ color: '#454a47', metalness: 0.5, roughness: 0.68 });
  const orange = new T.MeshStandardMaterial({ color: '#FF7D25', roughness: 0.82 });
  const white = new T.MeshStandardMaterial({ color: '#e9e6dc', roughness: 0.64 });
  function mesh(geometry, material, x, y, z, parent = device) {
    const m = new T.Mesh(geometry, material);
    m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true;
    parent.add(m); return m;
  }
  function rounded(w, d, h, radius, material, x, y, z) {
    const s = new T.Shape(), a = -w / 2, b = -d / 2, r = radius;
    s.moveTo(a + r, b); s.lineTo(-a - r, b); s.quadraticCurveTo(-a, b, -a, b + r);
    s.lineTo(-a, -b - r); s.quadraticCurveTo(-a, -b, -a - r, -b);
    s.lineTo(a + r, -b); s.quadraticCurveTo(a, -b, a, -b - r);
    s.lineTo(a, b + r); s.quadraticCurveTo(a, b, a + r, b);
    const g = new T.ExtrudeGeometry(s, { depth: h - 0.04, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2, steps: 1, curveSegments: 8 });
    g.rotateX(-Math.PI / 2);
    return mesh(g, material, x, y + 0.02, z);
  }
  rounded(6.48, 4, 0.48, 0.16, metal, 0, 0, 0);
  rounded(6.4, 3.92, 0.08, 0.14, edge, 0, -0.06, 0);
  // A recessed display pocket with a narrow machined bezel.
  rounded(3.20, 1.65, 0.035, 0.12, edge, -1.12, 0.481, -0.68);
  rounded(3.04, 1.49, 0.025, 0.09, dark, -1.12, 0.512, -0.68);
  const screen = document.createElement('canvas'); screen.width = 768; screen.height = 352;
  const ctx = screen.getContext('2d');
  const displayTexture = new T.CanvasTexture(screen); displayTexture.colorSpace = T.SRGBColorSpace;
  const displayMaterial = new T.MeshBasicMaterial({ map: displayTexture, toneMapped: false });
  const display = mesh(new T.PlaneGeometry(2.88, 1.32), displayMaterial, -1.12, 0.542, -0.68);
  display.rotation.x = -Math.PI / 2; display.castShadow = false;
  const glass = mesh(new T.PlaneGeometry(2.88, 1.32), new T.MeshPhysicalMaterial({ color: '#c6d4cc', metalness: 0, roughness: 0.28, transparent: true, opacity: 0.055, clearcoat: 0.25, depthWrite: false }), -1.12, 0.545, -0.68);
  glass.rotation.x = -Math.PI / 2; glass.castShadow = false;
  let accent;
  function drawDisplay() {
    const next = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#15DD7D';
    if (accent === next) return;
    accent = next;
    ctx.fillStyle = '#101713'; ctx.fillRect(0, 0, 768, 352);
    ctx.fillStyle = '#15DD7D'; ctx.fillStyle = accent;
    const glyphs = ['1001011111', '1010000100', '1100000100', '1010000100', '1001000100'];
    glyphs.forEach((row, y) => [...row].forEach((bit, x) => { if (bit === '1') ctx.fillRect(40 + x * 23, 45 + y * 23, 19, 19); }));
    ctx.font = 'bold 49px monospace'; ctx.fillText('KT-01', 38, 267);
    [5, 8, 6, 10].forEach((height, x) => {
      for (let y = 0; y < 10; y++) {
        ctx.globalAlpha = y < height ? 1 : 0.11;
        ctx.fillRect(414 + x * 75, 279 - y * 23, 47, 15);
      }
    });
    ctx.globalAlpha = 1; displayTexture.needsUpdate = true;
  }
  drawDisplay();
  // One transparent print layer keeps tiny engraved-style markings inexpensive.
  const print = document.createElement('canvas'); print.width = 1620; print.height = 1000;
  const p = print.getContext('2d'); p.textAlign = 'center'; p.fillStyle = '#515652';
  function label(text, x, z, size = 30) {
    p.font = `${size}px monospace`; p.fillText(text, (x / 6.48 + 0.5) * 1620, (z / 4 + 0.5) * 1000);
  }
  label('LEVEL', 1.0, 0.32); label('TONE', 2.29, 0.32);
  label('POCKET INSTRUMENT', -1.7, 1.73, 22); label('01 / STEREO', 2.0, 1.73, 22);
  const pt = new T.CanvasTexture(print); pt.colorSpace = T.SRGBColorSpace;
  const ink = mesh(new T.PlaneGeometry(6.48, 4), new T.MeshStandardMaterial({ map: pt, transparent: true, roughness: 0.9, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1 }), 0, 0.484, 0);
  ink.rotation.x = -Math.PI / 2; ink.castShadow = false;
  const screwMat = new T.MeshStandardMaterial({ color: '#797e7a', metalness: 0.8, roughness: 0.46 });
  for (const x of [-2.94, 2.94]) for (const z of [-1.7, 1.7]) {
    mesh(new T.CylinderGeometry(0.105, 0.105, 0.015, 32), recess, x, 0.489, z);
    mesh(new T.CylinderGeometry(0.083, 0.083, 0.018, 32), screwMat, x, 0.503, z);
    mesh(new T.CylinderGeometry(0.037, 0.037, 0.003, 6), dark, x, 0.514, z);
  }
  const targets = [], keys = [], knobs = [];
  for (let i = 0; i < 8; i++) {
    const x = -2.52 + i * 0.72, z = 1.03;
    mesh(new T.CylinderGeometry(0.281, 0.281, 0.018, 40), edge, x, 0.49, z);
    mesh(new T.CylinderGeometry(0.25, 0.25, 0.024, 40), dark, x, 0.503, z);
    const key = mesh(new T.CylinderGeometry(0.207, 0.219, 0.11, 40), i === 7 ? orange : dark, x, 0.559, z);
    key.userData.kind = 'key'; key.userData.rest = key.position.y;
    keys.push(key); targets.push(key); label(String(i + 1), x, 0.59, 28);
  }
  pt.needsUpdate = true;
  const ridgeGeometry = new T.BoxGeometry(0.037, 0.32, 0.038);
  [1.0, 2.29].forEach((x, i) => {
    mesh(new T.CylinderGeometry(0.48, 0.48, 0.025, 64), recess, x, 0.50, -0.69);
    const knob = new T.Group(); knob.position.set(x, 0.53, -0.69); device.add(knob);
    const barrel = mesh(new T.CylinderGeometry(0.398, 0.398, 0.40, 64), edge, 0, 0.22, 0, knob);
    barrel.userData.kind = 'knob'; barrel.userData.knob = knob; targets.push(barrel);
    for (let k = 0; k < 48; k++) {
      const a = k / 48 * Math.PI * 2;
      const ridge = mesh(ridgeGeometry, metal, Math.sin(a) * 0.4, 0.22, Math.cos(a) * 0.4, knob); ridge.rotation.y = a;
    }
    const cap = mesh(new T.CylinderGeometry(0.386, 0.386, 0.035, 64), metal, 0, 0.435, 0, knob);
    cap.userData.kind = 'knob'; cap.userData.knob = knob; targets.push(cap);
    mesh(new T.BoxGeometry(0.042, 0.008, 0.21), i ? white : orange, 0, 0.456, -0.21, knob);
    knob.rotation.y = i ? 0.65 : -0.4; knobs.push(knob);
  });
  const ground = mesh(new T.PlaneGeometry(200, 200), new T.MeshBasicMaterial({ color: '#2A2928', toneMapped: false }), 0, -0.13, 0, scene);
  ground.rotation.x = -Math.PI / 2; ground.castShadow = false;
  const shadowReceiver = mesh(new T.PlaneGeometry(200, 200), new T.ShadowMaterial({ opacity: 0.32 }), 0, -0.129, 0, scene);
  shadowReceiver.rotation.x = -Math.PI / 2; shadowReceiver.castShadow = false;
  for (const x of [-2.5, 2.5]) for (const z of [-1.25, 1.25]) mesh(new T.CylinderGeometry(0.22, 0.24, 0.20, 24), dark, x, -0.17, z);
  // Soft baked contact term complements the real directional shadow.
  const shadowCanvas = document.createElement('canvas'); shadowCanvas.width = shadowCanvas.height = 128;
  const sc = shadowCanvas.getContext('2d'), gradient = sc.createRadialGradient(64, 64, 8, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(0,0,0,.40)'); gradient.addColorStop(0.65, 'rgba(0,0,0,.22)'); gradient.addColorStop(1, 'rgba(0,0,0,0)');
  sc.fillStyle = gradient; sc.fillRect(0, 0, 128, 128);
  const contact = mesh(new T.PlaneGeometry(8.1, 5.8), new T.MeshBasicMaterial({ map: new T.CanvasTexture(shadowCanvas), transparent: true, depthWrite: false }), 0, -0.125, 0, scene);
  contact.rotation.x = -Math.PI / 2; contact.castShadow = false;
  scene.add(new T.HemisphereLight('#f3f5f0', '#46433f', 2.2));
  const keyLight = new T.DirectionalLight('#fff5e9', 3.4); keyLight.position.set(-4, 9, 5); scene.add(keyLight);
  keyLight.castShadow = true; keyLight.shadow.mapSize.set(1024, 1024);
  Object.assign(keyLight.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 0.1, far: 30 });
  keyLight.shadow.bias = -0.0005; keyLight.shadow.normalBias = 0.025; keyLight.shadow.radius = 5; keyLight.shadow.blurSamples = 8;
  const fill = new T.DirectionalLight('#dce7ed', 1.6); fill.position.set(5, 4, -4); scene.add(fill);
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const raycaster = new T.Raycaster(), pointer = new T.Vector2(10, 10);
  let over = false, tx = 0, tz = 0, frame = 0, previous = 0, pressed = null;
  function requestRender() { if (!frame) frame = requestAnimationFrame(render); }
  function render(now) {
    frame = 0;
    const dt = Math.min((now - previous) / 1000 || 1 / 60, 0.05); previous = now;
    const ease = 1 - Math.exp(-dt * 16);
    let moving = false;
    function approach(object, prop, target) {
      const delta = target - object[prop];
      if (Math.abs(delta) < 0.0003) object[prop] = target;
      else { object[prop] += delta * ease; moving = true; }
    }
    approach(device.rotation, 'x', motion.matches ? 0 : tx);
    approach(device.rotation, 'z', motion.matches ? 0 : tz);
    scene.updateMatrixWorld(true); camera.updateMatrixWorld(true);
    pressed = null;
    if (over && !motion.matches) {
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(targets, false)[0];
      if (hit?.object.userData.kind === 'key') pressed = hit.object;
    }
    keys.forEach(k => approach(k.position, 'y', k.userData.rest - (k === pressed ? 0.065 : 0)));
    renderer.render(scene, camera);
    if (moving && !motion.matches) requestRender();
  }
  function reset() { over = false; tx = tz = 0; pointer.set(10, 10); requestRender(); }
  tile.addEventListener('pointermove', event => {
    if (motion.matches || event.pointerType === 'touch') return;
    const rect = tile.getBoundingClientRect();
    const oldX = pointer.x;
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, 1 - (event.clientY - rect.top) / rect.height * 2);
    const wasOver = over; over = true;
    tx = -pointer.y * 0.14; tz = -pointer.x * 0.14;
    scene.updateMatrixWorld(true); camera.updateMatrixWorld(true); raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(targets, false)[0];
    if (wasOver && hit?.object.userData.kind === 'knob') hit.object.userData.knob.rotation.y += T.MathUtils.clamp(pointer.x - oldX, -0.15, 0.15) * 3;
    requestRender();
  }, { passive: true });
  tile.addEventListener('pointerleave', reset); tile.addEventListener('pointercancel', reset);
  window.addEventListener('blur', reset);
  document.addEventListener('visibilitychange', () => { if (document.hidden) reset(); });
  motion.addEventListener('change', () => {
    device.rotation.set(0, 0, 0); keys.forEach(k => { k.position.y = k.userData.rest; }); reset();
  });
  function resize() {
    const { width, height } = tile.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false); camera.aspect = width / height;
    camera.position.set(7.4, 10.8, 12.8).multiplyScalar(0.80 * Math.max(1, (4 / 3) / camera.aspect));
    camera.lookAt(0, 0.15, 0); camera.updateProjectionMatrix(); requestRender();
  }
  new ResizeObserver(resize).observe(tile);
  new MutationObserver(() => { drawDisplay(); requestRender(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class'] });
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); if (frame) cancelAnimationFrame(frame); frame = 0; });
  canvas.addEventListener('webglcontextrestored', requestRender);
  resize();
}
