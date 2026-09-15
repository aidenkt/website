(function () {
  "use strict";

  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const canvas = document.getElementById("canvas");

  const CAMERA_Z = 10;
  const FOV = 38;
  const PLANE_MARGIN = 1.35;
  const SEED = 90210;
  // World units covered by one repeat of the scanned wood texture.
  const TILE = 7.5;

  // Scanned PBR set: "Teak Veneer" by Poly Haven (CC0). A continuous veneer, so
  // the wall reads as one wooden surface rather than boards. The arm map packs
  // ambient occlusion (R), roughness (G) and metalness (B).
  const TEXTURES = {
    map: "/wood/tex/teak_diff.webp",
    normalMap: "/wood/tex/teak_nor.webp",
    arm: "/wood/tex/teak_arm.webp",
  };

  /* ------------------------------------------------------------------ */
  /* Leaf models (hook for future 3D assets)                             */
  /*                                                                     */
  /* Drop .glb files in /wood/models and list them here. See             */
  /* /wood/models/README.md for the contract. Each file is normalised on */
  /* load: petiole base at the origin, blade pointing +Y, length 1 unit. */
  /* While the list is empty the procedural leaves below are used.       */
  /* ------------------------------------------------------------------ */
  const LEAF_MODEL_URLS = [
    // "/wood/models/leaf-01.glb",
    // "/wood/models/leaf-02.glb",
  ];
  const LEAF_MODEL_SCALE = 1.0;
  let leafTemplates = [];

  /* Where the sun patch lands on the wall (world units, wall is z = 0). */
  const SUN_PATCH_CENTER = new THREE.Vector3(-0.9, 1.1, 0);
  const WINDOW_WIDTH = 3.8;
  const WINDOW_HEIGHT = 4.8;

  let renderer, scene, camera;
  let woodMesh, woodMaterial;
  let sun, windowGroup;
  let dust = [];
  const SUN_INTENSITY = 1.55;
  const dustBox = { halfW: 1.9, halfH: 2.5, zMin: 0.15, zMax: 3.4 };
  const towardSun = new THREE.Vector3();
  let vineRoot = null;
  let vines = [];
  let leafMaterials = [];
  let stemMaterial;
  let width = 1, height = 1, aspect = 1;
  let animationFrameId = null;
  let elapsed = 0;
  let lastTime = null;
  let resizeTimer = null;
  let ready = false;

  const pointerTarget = new THREE.Vector2();
  const pointer = new THREE.Vector2();

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function visibleHeightAt(z) {
    return 2 * (CAMERA_Z - z) * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
  }

  /* ------------------------------------------------------------------ */
  /* Image-based lighting: a room with a bright window, baked to a PMREM  */
  /* ------------------------------------------------------------------ */

  function buildEnvironment() {
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new THREE.Scene();

    room.add(
      new THREE.Mesh(
        new THREE.BoxGeometry(24, 24, 24),
        new THREE.MeshBasicMaterial({ color: 0x1a140f, side: THREE.BackSide }),
      ),
    );

    function panel(w, h, color, intensity, x, y, z) {
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity) }),
      );
      mesh.position.set(x, y, z);
      mesh.lookAt(0, 0, 0);
      room.add(mesh);
    }

    // The window itself: bright, warm daylight, upper left, in front of the wall.
    panel(4.4, 5.4, 0xfff1dc, 9.0, -7, 9, 12);
    // Blue sky glow around it.
    panel(9, 8, 0xbcd2ff, 1.1, -6, 7, 11);
    // Dim warm bounce from the room's floor.
    panel(14, 8, 0xa07a52, 0.55, 0, -10, 3);
    // Pale wall behind the camera.
    panel(12, 10, 0xd8cdbf, 0.35, 2, 0, 11);

    const texture = pmrem.fromScene(room, 0.04).texture;
    pmrem.dispose();
    return texture;
  }

  /* ------------------------------------------------------------------ */
  /* Procedural leaves: albedo, height-derived normal and roughness maps  */
  /* ------------------------------------------------------------------ */

  function canvas2d(size) {
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    return c;
  }

  function quadPoint(p0, c, p1, s) {
    const a = (1 - s) * (1 - s);
    const b = 2 * (1 - s) * s;
    const d = s * s;
    return [a * p0[0] + b * c[0] + d * p1[0], a * p0[1] + b * c[1] + d * p1[1]];
  }

  function makeLeafMaps(variant) {
    const size = 1024;
    const rng = mulberry32(SEED + 101 * (variant + 1));
    const mid = size / 2;

    const veins = [];
    const veinCount = 12;
    for (let i = 0; i < veinCount; i++) {
      const t = 0.05 + (i / veinCount) * 0.84 + (rng() - 0.5) * 0.02;
      const y0 = size - t * size;
      for (const side of [-1, 1]) {
        const reach = mid * (0.86 + rng() * 0.14);
        const x1 = mid + side * reach;
        const y1 = y0 - size * (0.17 + rng() * 0.09);
        const cx = mid + side * reach * 0.42;
        const cy = y0 - size * 0.015;
        veins.push({ p0: [mid, y0], c: [cx, cy], p1: [x1, y1], side, t });
      }
    }

    function strokeVeins(ctx, widthMain, widthSub, styleMain, styleSub) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      veins.forEach(function (v) {
        ctx.strokeStyle = styleMain;
        ctx.lineWidth = widthMain * (1 - v.t * 0.45);
        ctx.beginPath();
        ctx.moveTo(v.p0[0], v.p0[1]);
        ctx.quadraticCurveTo(v.c[0], v.c[1], v.p1[0], v.p1[1]);
        ctx.stroke();
        for (let k = 0; k < 6; k++) {
          const s = 0.18 + k * 0.14;
          const b = quadPoint(v.p0, v.c, v.p1, s);
          ctx.strokeStyle = styleSub;
          ctx.lineWidth = widthSub;
          ctx.beginPath();
          ctx.moveTo(b[0], b[1]);
          ctx.quadraticCurveTo(b[0] + v.side * 28, b[1] - 30, b[0] + v.side * 44, b[1] - 70);
          ctx.stroke();
        }
      });
      for (let i = 0; i < 24; i++) {
        const t0 = i / 24;
        const t1 = (i + 1) / 24;
        ctx.strokeStyle = styleMain;
        ctx.lineWidth = widthMain * 2.1 * (1 - t0) + widthSub;
        ctx.beginPath();
        ctx.moveTo(mid, size - t0 * size);
        ctx.lineTo(mid, size - t1 * size);
        ctx.stroke();
      }
    }

    const heightCanvas = canvas2d(size);
    const hctx = heightCanvas.getContext("2d");
    hctx.fillStyle = "rgb(120,120,120)";
    hctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 260; i++) {
      const x = rng() * size;
      const y = rng() * size;
      const r = 40 + rng() * 90;
      const g = hctx.createRadialGradient(x, y, 0, x, y, r);
      const up = rng() > 0.45;
      g.addColorStop(0, up ? "rgba(150,150,150,0.35)" : "rgba(95,95,95,0.35)");
      g.addColorStop(1, "rgba(120,120,120,0)");
      hctx.fillStyle = g;
      hctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
    strokeVeins(hctx, 9, 3.5, "rgba(170,170,170,0.5)", "rgba(150,150,150,0.35)");
    strokeVeins(hctx, 4.5, 1.6, "rgba(70,70,70,0.9)", "rgba(90,90,90,0.55)");
    for (let i = 0; i < 40000; i++) {
      const v = 108 + Math.floor(rng() * 24);
      hctx.fillStyle = "rgba(" + v + "," + v + "," + v + ",0.45)";
      hctx.fillRect(rng() * size, rng() * size, 2, 2);
    }

    const hdata = hctx.getImageData(0, 0, size, size).data;
    const normalCanvas = canvas2d(size);
    const nctx = normalCanvas.getContext("2d");
    const nimg = nctx.createImageData(size, size);
    const ndata = nimg.data;
    const strength = 2.6;
    function h(x, y) {
      x = Math.max(0, Math.min(size - 1, x));
      y = Math.max(0, Math.min(size - 1, y));
      return hdata[(y * size + x) * 4] / 255;
    }
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const tl = h(x - 1, y - 1), t = h(x, y - 1), tr = h(x + 1, y - 1);
        const l = h(x - 1, y), r = h(x + 1, y);
        const bl = h(x - 1, y + 1), b = h(x, y + 1), br = h(x + 1, y + 1);
        const dx = (tr + 2 * r + br) - (tl + 2 * l + bl);
        const dy = (bl + 2 * b + br) - (tl + 2 * t + tr);
        let nx = -dx * strength;
        let ny = dy * strength;
        let nz = 1;
        const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
        nx /= len; ny /= len; nz /= len;
        const idx = (y * size + x) * 4;
        ndata[idx] = (nx * 0.5 + 0.5) * 255;
        ndata[idx + 1] = (ny * 0.5 + 0.5) * 255;
        ndata[idx + 2] = (nz * 0.5 + 0.5) * 255;
        ndata[idx + 3] = 255;
      }
    }
    nctx.putImageData(nimg, 0, 0);

    const palettes = [
      ["#2d5224", "#3f6e2e", "#537f37"],
      ["#2b4f27", "#3a6a31", "#4d7a3a"],
      ["#335a26", "#477531", "#5b8a3c"],
    ];
    const p = palettes[variant % palettes.length];
    const albedoCanvas = canvas2d(size);
    const actx = albedoCanvas.getContext("2d");
    const base = actx.createLinearGradient(0, size, 0, 0);
    base.addColorStop(0, p[0]);
    base.addColorStop(0.5, p[1]);
    base.addColorStop(1, p[2]);
    actx.fillStyle = base;
    actx.fillRect(0, 0, size, size);
    const lateral = actx.createLinearGradient(0, 0, size, 0);
    lateral.addColorStop(0, "rgba(10,25,5,0.34)");
    lateral.addColorStop(0.2, "rgba(10,25,5,0.08)");
    lateral.addColorStop(0.5, "rgba(140,170,80,0.06)");
    lateral.addColorStop(0.8, "rgba(10,25,5,0.08)");
    lateral.addColorStop(1, "rgba(10,25,5,0.34)");
    actx.fillStyle = lateral;
    actx.fillRect(0, 0, size, size);
    for (let i = 0; i < 14000; i++) {
      const x = rng() * size;
      const y = rng() * size;
      const r = 2 + rng() * 9;
      const k = rng();
      actx.fillStyle =
        k > 0.93
          ? "rgba(190,200,110," + (0.04 + rng() * 0.08) + ")"
          : k > 0.5
            ? "rgba(150,185,90," + (0.03 + rng() * 0.05) + ")"
            : "rgba(5,25,5," + (0.03 + rng() * 0.07) + ")";
      actx.beginPath();
      actx.arc(x, y, r, 0, Math.PI * 2);
      actx.fill();
    }
    const shade = actx.createImageData(size, size);
    for (let i = 0; i < size * size; i++) {
      const hv = hdata[i * 4] / 255;
      const dark = Math.max(0, 0.47 - hv) * 1.4;
      shade.data[i * 4] = 0;
      shade.data[i * 4 + 1] = 12;
      shade.data[i * 4 + 2] = 0;
      shade.data[i * 4 + 3] = Math.min(255, dark * 255);
    }
    const shadeCanvas = canvas2d(size);
    shadeCanvas.getContext("2d").putImageData(shade, 0, 0);
    actx.drawImage(shadeCanvas, 0, 0);
    strokeVeins(actx, 4.2, 1.5, "rgba(196,214,140,0.62)", "rgba(196,214,140,0.28)");

    const roughCanvas = canvas2d(size);
    const rctx = roughCanvas.getContext("2d");
    const rg = rctx.createLinearGradient(0, 0, size, 0);
    rg.addColorStop(0, "rgb(150,150,150)");
    rg.addColorStop(0.5, "rgb(104,104,104)");
    rg.addColorStop(1, "rgb(150,150,150)");
    rctx.fillStyle = rg;
    rctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 6000; i++) {
      const v = 90 + Math.floor(rng() * 70);
      rctx.fillStyle = "rgba(" + v + "," + v + "," + v + ",0.5)";
      rctx.beginPath();
      rctx.arc(rng() * size, rng() * size, 3 + rng() * 14, 0, Math.PI * 2);
      rctx.fill();
    }
    strokeVeins(rctx, 5, 1.8, "rgba(175,175,175,0.9)", "rgba(165,165,165,0.6)");

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const map = new THREE.CanvasTexture(albedoCanvas);
    map.encoding = THREE.sRGBEncoding;
    map.anisotropy = maxAniso;
    const normalMap = new THREE.CanvasTexture(normalCanvas);
    normalMap.anisotropy = maxAniso;
    const roughnessMap = new THREE.CanvasTexture(roughCanvas);
    roughnessMap.anisotropy = maxAniso;
    return { map, normalMap, roughnessMap };
  }

  function makeLeafMaterial(maps, rng) {
    const tint = 0.9 + rng() * 0.2;
    return new THREE.MeshPhysicalMaterial({
      map: maps.map,
      normalMap: maps.normalMap,
      normalScale: new THREE.Vector2(0.75, 0.75),
      roughnessMap: maps.roughnessMap,
      roughness: 1,
      metalness: 0,
      color: new THREE.Color(tint, tint * (0.98 + rng() * 0.04), tint * 0.97),
      clearcoat: 0.22,
      clearcoatRoughness: 0.42,
      envMapIntensity: 0.75,
      side: THREE.DoubleSide,
    });
  }

  function gridGeometry(fn, slices, stacks) {
    const positions = [];
    const uvs = [];
    const indices = [];
    const p = new THREE.Vector3();
    for (let i = 0; i <= stacks; i++) {
      const v = i / stacks;
      for (let j = 0; j <= slices; j++) {
        const u = j / slices;
        fn(u, v, p);
        positions.push(p.x, p.y, p.z);
        uvs.push(u, v);
      }
    }
    for (let i = 0; i < stacks; i++) {
      for (let j = 0; j < slices; j++) {
        const a = i * (slices + 1) + j;
        const b = a + slices + 1;
        indices.push(a, b, a + 1);
        indices.push(b, b + 1, a + 1);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setIndex(indices);
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geometry.computeVertexNormals();
    return geometry;
  }

  function makeLeafGeometry(rng) {
    const w = 0.40 + rng() * 0.12;
    const cup = 0.20 + rng() * 0.22;
    const fold = 0.05 + rng() * 0.06;
    const droop = 0.16 + rng() * 0.28;
    const twist = (rng() - 0.5) * 0.5;
    const ripple = 0.012 + rng() * 0.018;
    const rippleFreq = 9 + rng() * 6;
    const phase = rng() * Math.PI * 2;
    const skew = (rng() - 0.5) * 0.08;
    function halfWidth(v) {
      const s = Math.sin(Math.PI * Math.pow(v, 0.64));
      return w * Math.pow(Math.max(s, 0), 0.78);
    }
    return gridGeometry(function (u, v, target) {
      const hw = halfWidth(v);
      const side = u * 2 - 1;
      const x = side * hw + skew * v * (1 - v) * 4;
      const y = v;
      let z = -cup * x * x * 2.2;
      z -= fold * Math.abs(side) * hw * 2;
      z -= droop * v * v;
      z += twist * x * v;
      z += ripple * Math.sin(v * rippleFreq + phase) * Math.abs(side);
      target.set(x, y, z);
    }, 14, 36);
  }

  /* ------------------------------------------------------------------ */
  /* Leaf factory: glTF templates when available, procedural otherwise    */
  /* ------------------------------------------------------------------ */

  function normaliseLeafModel(root) {
    // Petiole base at the origin, blade along +Y, overall length 1.
    const box = new THREE.Box3().setFromObject(root);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const scale = size.y > 0 ? 1 / size.y : 1;
    const wrapper = new THREE.Group();
    root.position.set(-center.x, -box.min.y, -center.z);
    wrapper.add(root);
    wrapper.scale.setScalar(scale * LEAF_MODEL_SCALE);
    root.traverse(function (obj) {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
        materials.forEach(function (material) {
          if ("envMapIntensity" in material) material.envMapIntensity = 0.75;
          material.side = THREE.DoubleSide;
          if (material.map) material.map.encoding = THREE.sRGBEncoding;
          material.needsUpdate = true;
        });
      }
    });
    return wrapper;
  }

  function loadLeafModels(onDone) {
    if (!LEAF_MODEL_URLS.length || typeof THREE.GLTFLoader !== "function") {
      onDone();
      return;
    }
    const loader = new THREE.GLTFLoader();
    let remaining = LEAF_MODEL_URLS.length;
    function finish() {
      remaining -= 1;
      if (remaining === 0) onDone();
    }
    LEAF_MODEL_URLS.forEach(function (url) {
      loader.load(
        url,
        function (gltf) {
          leafTemplates.push(normaliseLeafModel(gltf.scene));
          finish();
        },
        undefined,
        function () {
          console.warn("Leaf model failed to load, using procedural leaf:", url);
          finish();
        },
      );
    });
  }

  function createLeaf(rng, leafGeometries) {
    if (leafTemplates.length) {
      return leafTemplates[Math.floor(rng() * leafTemplates.length)].clone(true);
    }
    const geometry = leafGeometries[Math.floor(rng() * leafGeometries.length)];
    const material = leafMaterials[Math.floor(rng() * leafMaterials.length)];
    const leaf = new THREE.Mesh(geometry, material);
    leaf.castShadow = true;
    leaf.receiveShadow = true;
    return leaf;
  }

  /* ------------------------------------------------------------------ */
  /* Vines                                                               */
  /* ------------------------------------------------------------------ */

  function makeStemGeometry(curve, segments, radial, r0, r1) {
    const frames = curve.computeFrenetFrames(segments, false);
    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];
    const P = new THREE.Vector3();
    const N = new THREE.Vector3();
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      curve.getPointAt(t, P);
      const r = r0 * (1 - t) + r1 * t;
      const fn = frames.normals[i];
      const fb = frames.binormals[i];
      for (let j = 0; j <= radial; j++) {
        const v = (j / radial) * Math.PI * 2;
        const sin = Math.sin(v);
        const cos = -Math.cos(v);
        N.set(cos * fn.x + sin * fb.x, cos * fn.y + sin * fb.y, cos * fn.z + sin * fb.z).normalize();
        normals.push(N.x, N.y, N.z);
        positions.push(P.x + r * N.x, P.y + r * N.y, P.z + r * N.z);
        uvs.push(j / radial, t * 12);
      }
    }
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < radial; j++) {
        const a = (radial + 1) * i + j;
        const b = (radial + 1) * (i + 1) + j;
        indices.push(a, b, a + 1);
        indices.push(b, b + 1, a + 1);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setIndex(indices);
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    return geometry;
  }

  function makeStemMaterial() {
    const size = 256;
    const c = canvas2d(size);
    const ctx = c.getContext("2d");
    const rng = mulberry32(SEED + 7);
    ctx.fillStyle = "#4f5c2e";
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 1400; i++) {
      const x = rng() * size;
      const y = rng() * size;
      const len = 20 + rng() * 80;
      const k = rng();
      ctx.strokeStyle = k > 0.5 ? "rgba(30,38,18," + (0.15 + rng() * 0.3) + ")" : "rgba(130,140,80," + (0.08 + rng() * 0.2) + ")";
      ctx.lineWidth = 0.6 + rng() * 1.6;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (rng() - 0.5) * 6, y + len);
      ctx.stroke();
    }
    const map = new THREE.CanvasTexture(c);
    map.encoding = THREE.sRGBEncoding;
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    return new THREE.MeshStandardMaterial({ map, roughness: 0.78, metalness: 0, envMapIntensity: 0.6 });
  }

  function buildVine(config, rng, leafGeometries, scale) {
    const group = new THREE.Group();
    const length = config.length;
    const side = config.side;

    const points = [];
    const segments = 8;
    const wobbleAmp = (0.25 + rng() * 0.35) * scale * (0.5 + 0.5 * edgeScale());
    const wobblePhase = rng() * Math.PI * 2;
    const wobbleFreq = 1.2 + rng() * 1.2;
    for (let k = 0; k <= segments; k++) {
      const t = k / segments;
      const y = -t * length;
      const lean = -side * config.lean * scale * t;
      const x = lean + wobbleAmp * Math.sin(t * Math.PI * wobbleFreq + wobblePhase) * Math.min(1, t * 3);
      const z = 0.18 * scale * Math.sin(t * 6.0 + wobblePhase * 1.7) * Math.min(1, t * 3);
      points.push(new THREE.Vector3(x, y, z));
    }
    const curve = new THREE.CatmullRomCurve3(points, false, "centripetal", 0.5);

    const stem = new THREE.Mesh(makeStemGeometry(curve, 90, 8, 0.04 * scale, 0.011 * scale), stemMaterial);
    stem.castShadow = true;
    stem.receiveShadow = true;
    stem.userData.ownsGeometry = true;
    group.add(stem);

    const leaves = [];
    const count = Math.max(6, Math.round(length * 2.1));
    const point = new THREE.Vector3();

    for (let i = 0; i < count; i++) {
      const t = Math.min(0.985, 0.05 + (i / count) * 0.93 + (rng() - 0.5) * 0.04);
      curve.getPointAt(t, point);
      const s = i % 2 === 0 ? 1 : -1;

      const pivot = new THREE.Group();
      pivot.position.copy(point);
      const baseZ = Math.PI + s * (0.45 + rng() * 0.75) - side * 0.1;
      const baseY = s * (0.25 + rng() * 0.55) * (rng() > 0.5 ? 1 : -1);
      const baseX = (rng() - 0.5) * 0.6;
      pivot.rotation.set(baseX, baseY, baseZ);

      const size = (0.62 + rng() * 0.48) * scale * (1 - t * 0.28);
      const petioleLen = 0.12 * scale;

      const petiole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008 * scale, 0.013 * scale, petioleLen, 6),
        stemMaterial,
      );
      petiole.position.y = petioleLen / 2;
      petiole.castShadow = true;
      petiole.userData.ownsGeometry = true;
      pivot.add(petiole);

      const leaf = createLeaf(rng, leafGeometries);
      leaf.position.y = petioleLen;
      leaf.scale.multiplyScalar(size);
      pivot.add(leaf);

      group.add(pivot);
      leaves.push({
        pivot,
        baseX,
        baseY,
        baseZ,
        phase: rng() * Math.PI * 2,
        speed: 1.3 + rng() * 1.1,
        amp: 0.03 + rng() * 0.035,
      });
    }

    return {
      group,
      leaves,
      phase: rng() * Math.PI * 2,
      swayAmp: 0.028 + rng() * 0.02,
      swaySpeed: 0.42 + rng() * 0.2,
      config,
    };
  }

  const VINE_CONFIGS = [
    { side: -1, inset: 0.15, z: 1.7, frac: 0.78, lean: 0.35 },
    { side: -1, inset: 1.35, z: 0.9, frac: 0.92, lean: -0.15 },
    { side: -1, inset: 0.65, z: 0.35, frac: 0.55, lean: 0.25 },
    { side: 1, inset: 0.25, z: 1.5, frac: 0.86, lean: 0.3 },
    { side: 1, inset: 1.5, z: 0.75, frac: 0.7, lean: -0.1 },
    { side: 1, inset: 0.8, z: 0.3, frac: 0.98, lean: 0.2 },
  ];

  function layoutScale() {
    const visibleW = visibleHeightAt(1) * aspect;
    return THREE.MathUtils.clamp(visibleW / 13, 0.42, 1);
  }

  function edgeScale() {
    const visibleW = visibleHeightAt(1) * aspect;
    return THREE.MathUtils.clamp((visibleW - 2.5) / 10, 0.12, 1);
  }

  function disposeVines() {
    if (!vineRoot) return;
    vineRoot.traverse(function (obj) {
      // Stem and petiole geometry is unique per vine; leaf geometry and glTF
      // template geometry are shared and kept.
      if (obj.isMesh && obj.userData.ownsGeometry) obj.geometry.dispose();
    });
    scene.remove(vineRoot);
    vineRoot = null;
    vines = [];
  }

  function buildVines() {
    disposeVines();
    const scale = layoutScale();
    const edge = edgeScale();
    const rng = mulberry32(SEED);
    const leafGeometries = [];
    for (let i = 0; i < 6; i++) leafGeometries.push(makeLeafGeometry(rng));

    vineRoot = new THREE.Group();
    VINE_CONFIGS.forEach(function (config) {
      const hAtZ = visibleHeightAt(config.z);
      const wAtZ = hAtZ * aspect;
      const vine = buildVine(
        { side: config.side, lean: config.lean * edge, length: hAtZ * config.frac },
        rng,
        leafGeometries,
        scale,
      );
      vine.group.position.set(
        config.side * (wAtZ / 2 - config.inset * scale * edge),
        hAtZ / 2 + 0.3,
        config.z,
      );
      vineRoot.add(vine.group);
      vines.push(vine);
    });
    scene.add(vineRoot);
  }

  /* ------------------------------------------------------------------ */
  /* Sunlight through a window                                           */
  /*                                                                     */
  /* A directional "sun" shines through an invisible window frame placed */
  /* on the light path between the sun and the wall. The frame's material */
  /* writes neither colour nor depth, so it never appears in the picture, */
  /* but the shadow pass still renders it and it casts the pane pattern.  */
  /* ------------------------------------------------------------------ */

  function buildWindow() {
    const group = new THREE.Group();
    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      colorWrite: false,
      depthWrite: false,
    });

    // Solid wall with the window opening cut out.
    const outer = new THREE.Shape();
    outer.moveTo(-40, -40);
    outer.lineTo(40, -40);
    outer.lineTo(40, 40);
    outer.lineTo(-40, 40);
    outer.closePath();
    const hole = new THREE.Path();
    const hw = WINDOW_WIDTH / 2;
    const hh = WINDOW_HEIGHT / 2;
    hole.moveTo(-hw, -hh);
    hole.lineTo(hw, -hh);
    hole.lineTo(hw, hh);
    hole.lineTo(-hw, hh);
    hole.closePath();
    outer.holes.push(hole);
    const wall = new THREE.Mesh(new THREE.ShapeGeometry(outer), material);
    group.add(wall);

    // Mullions: one vertical, two horizontal, giving six panes.
    const bar = 0.075;
    const vertical = new THREE.Mesh(new THREE.BoxGeometry(bar, WINDOW_HEIGHT, 0.12), material);
    group.add(vertical);
    for (const y of [-WINDOW_HEIGHT / 6, WINDOW_HEIGHT / 6]) {
      const horizontal = new THREE.Mesh(new THREE.BoxGeometry(WINDOW_WIDTH, bar, 0.12), material);
      horizontal.position.y = y;
      group.add(horizontal);
    }

    group.traverse(function (obj) {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = false;
        obj.frustumCulled = false;
      }
    });
    return group;
  }

  function placeWindow() {
    // Slide the frame along the sun's ray so the light patch lands where wanted.
    towardSun.copy(sun.position).sub(sun.target.position).normalize();
    windowGroup.position.copy(SUN_PATCH_CENTER).addScaledVector(towardSun, 6);
    // A little off-parallel to the wall so the patch skews like a real window.
    windowGroup.rotation.set(0.05, -0.32, 0.03);
  }

  /* ------------------------------------------------------------------ */
  /* Dust drifting through the sunbeam                                   */
  /* ------------------------------------------------------------------ */

  function makeMoteSprite() {
    const size = 64;
    const c = canvas2d(size);
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,240,215,1)");
    g.addColorStop(0.35, "rgba(255,230,190,0.55)");
    g.addColorStop(1, "rgba(255,220,170,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(c);
  }

  // The beam is the window opening swept along the sun direction, so a mote at
  // height z above the wall sits offset from the wall patch by that much ray.
  function beamOffsetAt(z) {
    return new THREE.Vector2(towardSun.x / towardSun.z, towardSun.y / towardSun.z).multiplyScalar(z);
  }

  function buildDust() {
    dust.forEach(function (d) {
      scene.remove(d.points);
      d.points.geometry.dispose();
    });
    dust = [];

    const sprite = makeMoteSprite();
    const rng = mulberry32(SEED + 99);
    const groups = [
      { count: coarsePointer ? 90 : 190, size: 0.028, opacity: 0.55 },
      { count: coarsePointer ? 30 : 60, size: 0.05, opacity: 0.35 },
    ];

    groups.forEach(function (spec) {
      const positions = new Float32Array(spec.count * 3);
      const velocities = [];
      for (let i = 0; i < spec.count; i++) {
        const z = dustBox.zMin + rng() * (dustBox.zMax - dustBox.zMin);
        const off = beamOffsetAt(z);
        positions[i * 3] = SUN_PATCH_CENTER.x + off.x + (rng() * 2 - 1) * dustBox.halfW;
        positions[i * 3 + 1] = SUN_PATCH_CENTER.y + off.y + (rng() * 2 - 1) * dustBox.halfH;
        positions[i * 3 + 2] = z;
        velocities.push({
          x: (rng() - 0.5) * 0.05,
          y: -0.012 - rng() * 0.03,
          z: (rng() - 0.5) * 0.02,
          phase: rng() * Math.PI * 2,
          wobble: 0.4 + rng() * 0.8,
        });
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({
        map: sprite,
        color: 0xffe6c2,
        size: spec.size,
        sizeAttenuation: true,
        transparent: true,
        opacity: spec.opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const points = new THREE.Points(geometry, material);
      points.frustumCulled = false;
      scene.add(points);
      dust.push({ points, velocities });
    });
  }

  function animateDust(t, dt) {
    for (let g = 0; g < dust.length; g++) {
      const d = dust[g];
      const arr = d.points.geometry.attributes.position.array;
      for (let i = 0; i < d.velocities.length; i++) {
        const v = d.velocities[i];
        const k = i * 3;
        arr[k] += (v.x + Math.sin(t * v.wobble + v.phase) * 0.02) * dt;
        arr[k + 1] += (v.y + Math.cos(t * v.wobble * 0.7 + v.phase) * 0.012) * dt;
        arr[k + 2] += v.z * dt;

        // Keep every mote inside the tilted beam volume; wrap, do not clamp.
        let z = arr[k + 2];
        if (z < dustBox.zMin) z = arr[k + 2] = dustBox.zMax;
        if (z > dustBox.zMax) z = arr[k + 2] = dustBox.zMin;
        const off = beamOffsetAt(z);
        const cx = SUN_PATCH_CENTER.x + off.x;
        const cy = SUN_PATCH_CENTER.y + off.y;
        if (arr[k] < cx - dustBox.halfW) arr[k] += dustBox.halfW * 2;
        if (arr[k] > cx + dustBox.halfW) arr[k] -= dustBox.halfW * 2;
        if (arr[k + 1] < cy - dustBox.halfH) arr[k + 1] += dustBox.halfH * 2;
        if (arr[k + 1] > cy + dustBox.halfH) arr[k + 1] -= dustBox.halfH * 2;
      }
      d.points.geometry.attributes.position.needsUpdate = true;
    }
  }

  // Sunlight is never perfectly steady: thin cloud, haze, a breeze in the
  // trees outside. Two slow incommensurate waves give a natural breathing.
  function sunBreath(t) {
    const a = Math.sin(t * 0.27 + 1.3);
    const b = Math.sin(t * 0.071 + 0.4);
    const c = Math.sin(t * 0.53 + 2.1);
    return 0.86 + 0.09 * a + 0.04 * b + 0.01 * c;
  }

  /* ------------------------------------------------------------------ */
  /* Scene                                                               */
  /* ------------------------------------------------------------------ */

  function loadWoodTextures(onDone) {
    const manager = new THREE.LoadingManager();
    const loader = new THREE.TextureLoader(manager);
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    function prep(texture, srgb) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.anisotropy = maxAniso;
      if (srgb) texture.encoding = THREE.sRGBEncoding;
      return texture;
    }
    const map = prep(loader.load(TEXTURES.map), true);
    const normalMap = prep(loader.load(TEXTURES.normalMap), false);
    const arm = prep(loader.load(TEXTURES.arm), false);
    woodMaterial.map = map;
    woodMaterial.normalMap = normalMap;
    woodMaterial.roughnessMap = arm;
    woodMaterial.aoMap = arm;
    woodMaterial.needsUpdate = true;
    applyTextureRepeat();
    manager.onLoad = onDone;
    manager.onError = onDone;
  }

  function init() {
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
    } catch (error) {
      document.documentElement.classList.add("no-webgl");
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.setClearColor(0x2c1c10, 1);

    scene = new THREE.Scene();
    scene.environment = buildEnvironment();

    camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 60);
    camera.position.set(0, 0, CAMERA_Z);

    // Skylight: cool from above, warm bounce from the room below.
    scene.add(new THREE.HemisphereLight(0xc7d6f5, 0x3a2716, 0.6));

    // Sun. Parallel rays, warm, coming from the upper left and in front.
    sun = new THREE.DirectionalLight(0xffe4c0, SUN_INTENSITY);
    sun.position.set(-7, 9, 12);
    sun.target.position.set(0, 0, 0);
    sun.castShadow = true;
    const shadowRes = coarsePointer ? 2048 : 4096;
    sun.shadow.mapSize.set(shadowRes, shadowRes);
    const sc = sun.shadow.camera;
    sc.near = 1;
    sc.far = 40;
    sc.left = -16;
    sc.right = 16;
    sc.top = 12;
    sc.bottom = -12;
    sc.updateProjectionMatrix();
    sun.shadow.bias = -0.0002;
    sun.shadow.radius = coarsePointer ? 3 : 5;
    scene.add(sun);
    scene.add(sun.target);

    // Faint warm fill so the shaded wall keeps its colour.
    const fill = new THREE.DirectionalLight(0xffd9b5, 0.2);
    fill.position.set(6, -3, 6);
    scene.add(fill);

    windowGroup = buildWindow();
    placeWindow();
    scene.add(windowGroup);

    woodMaterial = new THREE.MeshStandardMaterial({
      color: 0xe2d2bd,
      roughness: 1,
      metalness: 0,
      normalScale: new THREE.Vector2(1.0, 1.0),
      aoMapIntensity: 1.0,
      envMapIntensity: 0.65,
    });
    woodMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), woodMaterial);
    woodMesh.receiveShadow = true;
    scene.add(woodMesh);

    stemMaterial = makeStemMaterial();
    const leafRng = mulberry32(SEED + 3);
    for (let i = 0; i < 3; i++) {
      const maps = makeLeafMaps(i);
      leafMaterials.push(makeLeafMaterial(maps, leafRng));
      leafMaterials.push(makeLeafMaterial(maps, leafRng));
    }

    updateSize();

    window.addEventListener("resize", onResize, false);
    window.addEventListener("pointermove", updatePointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", resetPointer);
    document.addEventListener("visibilitychange", syncAnimationState);
    motionPreference.addEventListener("change", syncAnimationState);

    let pending = 2;
    function loaded() {
      pending -= 1;
      if (pending !== 0) return;
      buildVines();
      buildDust();
      ready = true;
      syncAnimationState();
    }
    loadLeafModels(loaded);
    loadWoodTextures(loaded);
  }

  function applyTextureRepeat() {
    const visibleH = visibleHeightAt(0);
    const planeH = visibleH * PLANE_MARGIN;
    const planeW = visibleH * aspect * PLANE_MARGIN;
    [woodMaterial.map, woodMaterial.normalMap, woodMaterial.roughnessMap].forEach(function (texture) {
      if (texture) texture.repeat.set(planeW / TILE, planeH / TILE);
    });
  }

  function updateSize() {
    width = window.innerWidth;
    height = window.innerHeight;
    aspect = width / Math.max(height, 1);

    renderer.setSize(width, height);
    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    const visibleH = visibleHeightAt(0);
    const planeH = visibleH * PLANE_MARGIN;
    const planeW = visibleH * aspect * PLANE_MARGIN;

    woodMesh.geometry.dispose();
    const geometry = new THREE.PlaneGeometry(planeW, planeH);
    geometry.setAttribute("uv2", geometry.attributes.uv);
    woodMesh.geometry = geometry;
    applyTextureRepeat();
  }

  function onResize() {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      updateSize();
      if (ready) buildVines();
      if (ready && (motionPreference.matches || document.hidden)) renderScene();
    }, 150);
  }

  function animateVines(t) {
    for (let i = 0; i < vines.length; i++) {
      const vine = vines[i];
      const g = vine.group;
      g.rotation.z =
        vine.swayAmp * Math.sin(t * vine.swaySpeed + vine.phase) +
        vine.swayAmp * 0.3 * Math.sin(t * vine.swaySpeed * 3.1 + vine.phase * 2.0);
      g.rotation.x = vine.swayAmp * 0.7 * Math.sin(t * vine.swaySpeed * 0.8 + vine.phase * 1.3);
      for (let j = 0; j < vine.leaves.length; j++) {
        const leaf = vine.leaves[j];
        leaf.pivot.rotation.z = leaf.baseZ + leaf.amp * Math.sin(t * leaf.speed + leaf.phase);
        leaf.pivot.rotation.x = leaf.baseX + leaf.amp * 0.8 * Math.sin(t * leaf.speed * 0.73 + leaf.phase * 1.9);
      }
    }
  }

  function renderScene() {
    camera.position.x = pointer.x * 0.35;
    camera.position.y = pointer.y * 0.25;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    document.documentElement.classList.add("webgl-ready");
  }

  function animate(t) {
    animationFrameId = null;
    if (motionPreference.matches || document.hidden) {
      lastTime = null;
      renderScene();
      return;
    }
    if (lastTime === null) lastTime = t;
    const frameDelta = Math.min(t - lastTime, 100);
    elapsed += frameDelta;
    lastTime = t;
    pointer.lerp(pointerTarget, 0.05);
    const seconds = elapsed * 0.001;
    animateVines(seconds);
    animateDust(seconds, frameDelta * 0.001);
    sun.intensity = SUN_INTENSITY * sunBreath(seconds);
    // The whole patch creeps very slowly, as the sun does.
    windowGroup.rotation.z = 0.03 + Math.sin(seconds * 0.045) * 0.012;
    renderScene();
    animationFrameId = requestAnimationFrame(animate);
  }

  function syncAnimationState() {
    if (!ready) return;
    if (motionPreference.matches || document.hidden) {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      lastTime = null;
      pointerTarget.set(0, 0);
      pointer.set(0, 0);
      renderScene();
      return;
    }
    if (animationFrameId === null) {
      animationFrameId = requestAnimationFrame(animate);
    }
  }

  function updatePointer(event) {
    if (motionPreference.matches || event.pointerType === "touch") return;
    const nx = (event.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
    const ny = (event.clientY / Math.max(window.innerHeight, 1)) * 2 - 1;
    pointerTarget.set(nx, -ny);
  }

  function resetPointer() {
    pointerTarget.set(0, 0);
  }

  init();
})();
