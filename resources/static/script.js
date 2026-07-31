function isiOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

const themeColor = document.querySelector('meta[name="theme-color"]');
const paletteColors = {
  base: { theme: "#fdaa58", root: "#df63bd" },
  blue: { theme: "#69d1b0", root: "#62cbb4" },
  magenta: { theme: "#d94b98", root: "#d653b7" },
};
let themeColorTimer = null;

function setBrowserColors({ theme, root }) {
  if (themeColor) {
    themeColor.content = theme;
  }

  document.documentElement.style.setProperty("--root-background-color", root);
}

function scheduleBrowserColors(colors) {
  window.clearTimeout(themeColorTimer);
  themeColorTimer = window.setTimeout(() => {
    setBrowserColors(colors);
  }, 3500);
}

// iOS 26+ Safari only composites real page pixels behind its translucent
// chrome when the document rests at a non-zero scroll offset; at scrollY 0 it
// paints a sampled solid color instead. The "runway" keeps the page visually
// one screen while resting scrolled down, so waves render under the chrome
// and during the first part of a pull-down. Tunables for on-device testing:
// ?edge=off | ?edge=bottom | ?edge=<top>,<bottom> | ?snap=off
const edgeExtend = (() => {
  if (!isiOS()) {
    return null;
  }

  const params = new URLSearchParams(window.location.search);
  const preset = params.get("edge");

  if (preset === "off") {
    return null;
  }

  let top = 140;
  let bottom = 140;

  if (preset === "bottom") {
    top = 0;
  } else if (preset) {
    const parts = preset.split(",").map((part) => Number.parseInt(part, 10));
    if (Number.isFinite(parts[0])) {
      top = Math.max(0, parts[0]);
    }
    if (Number.isFinite(parts[1])) {
      bottom = Math.max(0, parts[1]);
    }
  }

  return { top, bottom, snap: params.get("snap") !== "off" };
})();

function setupEdgeExtend() {
  if (!edgeExtend) {
    return;
  }

  const root = document.documentElement;
  root.style.setProperty("--edge-runway-top", `${edgeExtend.top}px`);
  root.style.setProperty("--edge-runway-bottom", `${edgeExtend.bottom}px`);
  root.classList.add("edge-extend");

  if (edgeExtend.snap) {
    root.classList.add("edge-snap");
  }

  let touchActive = false;
  let settleTimer = null;

  function settleToRest() {
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(() => {
      if (touchActive || window.scrollY < 0) {
        return;
      }

      if (Math.abs(window.scrollY - edgeExtend.top) > 1) {
        window.scrollTo({ top: edgeExtend.top, behavior: "smooth" });
      }
    }, 400);
  }

  window.addEventListener(
    "touchstart",
    () => {
      touchActive = true;
      window.clearTimeout(settleTimer);
    },
    { passive: true },
  );
  window.addEventListener(
    "touchend",
    () => {
      touchActive = false;
      settleToRest();
    },
    { passive: true },
  );
  window.addEventListener(
    "touchcancel",
    () => {
      touchActive = false;
      settleToRest();
    },
    { passive: true },
  );
  window.addEventListener("scroll", settleToRest, { passive: true });

  const jumpToRest = () => window.scrollTo(0, edgeExtend.top);
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  jumpToRest();
  window.addEventListener("load", jumpToRest);
  window.addEventListener("pageshow", jumpToRest);
}

setupEdgeExtend();

function Background() {
  if (window.location.search == "?start") {
    var conf = {
      nx: 50,
      ny: 100,
      cscale: chroma
        .scale([
          "#0B383F",
          "#094876",
          "#0CC4A0",
          "#0F9C95",
          "#0B7487",
          "#0B4B5B",
        ])
        .mode("lch"),
      darken: -1.1,
      angle: Math.PI * 1.4,
      timeCoef: 0.035,
    };
  } else {
    var conf = {
      nx: 60,
      ny: 90,
      cscale: chroma
        .scale([
          "#c73524",
          "#e28240",
          "#d0b64f",
          "#db4e46",
          "#bb55c6",
          "#d0247d",
        ])
        .mode("lch"),
      darken: -1.1,
      angle: Math.PI * 1.4,
      timeCoef: 0.035,
    };
  }

  const saturationBoost = isiOS() ? 0.3 : 0;

  // "#f9442c",
  // "#fc9f58",
  // "#EBCF6B",
  // "#f9695e",
  // "#e46bf4",
  // "#fc2f99",

  let renderer, scene, camera;
  let width, height;
  const { randFloat: rnd } = THREE.Math;

  const uTime = { value: 0 },
    uTimeCoef = { value: conf.timeCoef };
  const polylines = [];

  init();

  function init() {
    renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById("canvas"),
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    camera = new THREE.PerspectiveCamera();

    updateSize();
    window.addEventListener("resize", updateSize, false);

    initScene();
    requestAnimationFrame(animate);
  }

  function initScene() {
    scene = new THREE.Scene();
    const vertexShader = `
      uniform float uTime, uTimeCoef;
      uniform float uSize;
      uniform mat2 uMat2;
      uniform vec3 uRnd1;
      uniform vec3 uRnd2;
      uniform vec3 uRnd3;
      uniform vec3 uRnd4;
      uniform vec3 uRnd5;
      attribute vec3 next, prev; 
      attribute float side;
      varying vec2 vUv;

      vec2 dp(vec2 sv) {
        return (1.5 * sv * uMat2);
      }

      void main() {
        vUv = uv;

        vec2 pos = dp(position.xy);

        // Well... I know I should update geometry instead...
        // Computing normal here is not needed
        // vec2 sprev = dp(prev.xy);
        // vec2 snext = dp(next.xy);
        // vec2 tangent = normalize(snext - sprev);
        // vec2 normal = vec2(-tangent.y, tangent.x);
        // float dist = length(snext - sprev);
        // normal *= smoothstep(0.0, 0.02, dist);

        vec2 normal = dp(vec2(1, 0));
        normal *= uSize;

        float time = uTime * uTimeCoef;
        vec3 rnd1 = vec3(cos(time * uRnd1.x + uRnd3.x), cos(time * uRnd1.y + uRnd3.y), cos(time * uRnd1.z + uRnd3.z));
        vec3 rnd2 = vec3(cos(time * uRnd2.x + uRnd4.x), cos(time * uRnd2.y + uRnd4.y), cos(time * uRnd2.z + uRnd4.z));
        normal *= 1.0
          + uRnd5.x * (cos((position.y + rnd1.x) * 20.0 * rnd1.y) + 1.0)
          + uRnd5.y * (sin((position.y + rnd2.x) * 20.0 * rnd2.y) + 1.0)
          + uRnd5.z * (cos((position.y + rnd1.z) * 20.0 * rnd2.z) + 1.0);
        pos.xy -= normal * side;

        gl_Position = vec4(pos, 0.0, 1.0);
      }
    `;

    const fragmentShader = `
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      varying vec2 vUv;
      void main() {
        gl_FragColor = vec4(mix(uColor1, uColor2, vUv.x), 1.0);
      }
    `;

    const dx = 2 / conf.nx,
      dy = -2 / (conf.ny - 1);
    const ox = -1 + dx / 2,
      oy = 1;
    const mat2 = Float32Array.from([
      Math.cos(conf.angle),
      -Math.sin(conf.angle),
      Math.sin(conf.angle),
      Math.cos(conf.angle),
    ]);
    for (let i = 0; i < conf.nx; i++) {
      const points = [];
      for (let j = 0; j < conf.ny; j++) {
        const x = ox + i * dx,
          y = oy + j * dy;
        points.push(new THREE.Vector3(x, y, 0));
      }
      const polyline = new Polyline({ points });
      polylines.push(polyline);

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime,
          uTimeCoef,
          uMat2: { value: mat2 },
          uSize: { value: 1.5 / conf.nx },
          uRnd1: {
            value: new THREE.Vector3(rnd(-1, 1), rnd(-1, 1), rnd(-1, 1)),
          },
          uRnd2: {
            value: new THREE.Vector3(rnd(-1, 1), rnd(-1, 1), rnd(-1, 1)),
          },
          uRnd3: {
            value: new THREE.Vector3(rnd(-1, 1), rnd(-1, 1), rnd(-1, 1)),
          },
          uRnd4: {
            value: new THREE.Vector3(rnd(-1, 1), rnd(-1, 1), rnd(-1, 1)),
          },
          uRnd5: {
            value: new THREE.Vector3(
              rnd(0.2, 0.5),
              rnd(0.3, 0.6),
              rnd(0.4, 0.7),
            ),
          },
          uColor1: {
            value: new THREE.Color(
              conf.cscale(i / conf.nx).saturate(saturationBoost).hex(),
            ),
          },
          uColor2: {
            value: new THREE.Color(
              conf
                .cscale(i / conf.nx)
                .darken(conf.darken)
                .saturate(saturationBoost)
                .hex(),
            ),
          },
        },

        vertexShader,
        fragmentShader,
      });

      const mesh = new THREE.Mesh(polyline.geometry, material);
      scene.add(mesh);
    }
  }

  /*
  function initRandomScene() {
    conf.nx = Math.floor(rnd(20, 200));
    conf.cscale = randomCScale();
    conf.darken = rnd(0, 1) > 0.5 ? rnd(-4, -0.5) : rnd(0.5, 4);
    conf.angle = rnd(0, 2 * Math.PI);
    uTimeCoef.value = rnd(0.05, 0.2);
    disposeScene();
    initScene();
  }
*/
  function disposeScene() {
    for (let i = 0; i < scene.children.length; i++) {
      const mesh = scene.children[i];
      scene.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
    }
    scene.dispose();
  }

  function randomCScale() {
    const colors = [],
      n = 2 + Math.floor(rnd(0, 4));
    for (let i = 0; i < n; i++) {
      colors.push(chroma.random());
    }
    return chroma.scale(colors).mode("lch");
  }

  function animate(t) {
    uTime.value = t * 0.001;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  function updateSize() {
    width = window.innerWidth;
    height = edgeExtend
      ? Math.max(window.innerHeight, document.body.scrollHeight)
      : window.innerHeight;
    renderer.setSize(width, height);
  }
}

// adapted from https://github.com/oframe/ogl/blob/master/src/extras/Polyline.js
const Polyline = (function () {
  const tmp = new THREE.Vector3();

  class Polyline {
    constructor(params) {
      const { points } = params;
      this.points = points;
      this.count = points.length;
      this.init();
      this.updateGeometry();
    }

    init() {
      this.geometry = new THREE.BufferGeometry();
      this.position = new Float32Array(this.count * 3 * 2);
      this.prev = new Float32Array(this.count * 3 * 2);
      this.next = new Float32Array(this.count * 3 * 2);
      const side = new Float32Array(this.count * 1 * 2);
      const uv = new Float32Array(this.count * 2 * 2);
      const index = new Uint16Array((this.count - 1) * 3 * 2);

      for (let i = 0; i < this.count; i++) {
        const i2 = i * 2;
        side.set([-1, 1], i2);
        const v = i / (this.count - 1);
        uv.set([0, v, 1, v], i * 4);

        if (i === this.count - 1) continue;
        index.set([i2 + 0, i2 + 1, i2 + 2], (i2 + 0) * 3);
        index.set([i2 + 2, i2 + 1, i2 + 3], (i2 + 1) * 3);
      }

      this.geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(this.position, 3),
      );
      this.geometry.setAttribute(
        "prev",
        new THREE.BufferAttribute(this.prev, 3),
      );
      this.geometry.setAttribute(
        "next",
        new THREE.BufferAttribute(this.next, 3),
      );
      this.geometry.setAttribute("side", new THREE.BufferAttribute(side, 1));
      this.geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
      this.geometry.setIndex(new THREE.BufferAttribute(index, 1));
    }

    updateGeometry() {
      this.points.forEach((p, i) => {
        p.toArray(this.position, i * 3 * 2);
        p.toArray(this.position, i * 3 * 2 + 3);

        if (!i) {
          tmp
            .copy(p)
            .sub(this.points[i + 1])
            .add(p);
          tmp.toArray(this.prev, i * 3 * 2);
          tmp.toArray(this.prev, i * 3 * 2 + 3);
        } else {
          p.toArray(this.next, (i - 1) * 3 * 2);
          p.toArray(this.next, (i - 1) * 3 * 2 + 3);
        }

        if (i === this.points.length - 1) {
          tmp
            .copy(p)
            .sub(this.points[i - 1])
            .add(p);
          tmp.toArray(this.next, i * 3 * 2);
          tmp.toArray(this.next, i * 3 * 2 + 3);
        } else {
          p.toArray(this.prev, (i + 1) * 3 * 2);
          p.toArray(this.prev, (i + 1) * 3 * 2 + 3);
        }
      });

      this.geometry.attributes.position.needsUpdate = true;
      this.geometry.attributes.prev.needsUpdate = true;
      this.geometry.attributes.next.needsUpdate = true;
    }
  }
  return Polyline;
})();

Background();

function updateColors() {
  const blueOverlay = document.querySelector(".blue-overlay");
  const greenOverlay = document.querySelector(".green-overlay");

  if (blueOverlay.style.opacity == 0 && greenOverlay.style.opacity == 0) {
    blueOverlay.style.transition = "opacity 10s";
    blueOverlay.style.opacity = 1;
    scheduleBrowserColors(paletteColors.blue);
  } else if (blueOverlay.style.opacity == 1) {
    greenOverlay.style.transition = "opacity 10s";
    blueOverlay.style.transition = "opacity 10s";
    blueOverlay.style.opacity = 0;
    greenOverlay.style.opacity = 1;
    scheduleBrowserColors(paletteColors.magenta);
  } else if (greenOverlay.style.opacity == 1) {
    greenOverlay.style.transition = "opacity 10s";
    greenOverlay.style.opacity = 0;
    scheduleBrowserColors(paletteColors.base);
  }
}

let runColors = true;

if (window.location.search == "?start") {
  runColors = false;
  setBrowserColors({ theme: "#094876", root: "#0b4b5b" });
} else {
  document.querySelector(".content-container").style.display = "flex";
}

if (runColors) {
  setInterval(updateColors, 20000);
}

function enableCardTilt() {
  const card = document.querySelector(".content-container");

  if (!card || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const maxTilt = 9;
  const dragDistance = 140;
  let activePointer = null;
  let start = { x: 0, y: 0 };
  let current = start;
  let animationFrame = null;
  let moved = false;
  let suppressClicksUntil = 0;
  let iconPointer = null;
  let iconLink = null;

  function renderTilt() {
    const clamp = (value) => Math.max(-maxTilt, Math.min(maxTilt, value));
    const rotateX = clamp((-(current.y - start.y) / dragDistance) * maxTilt);
    const rotateY = clamp(((current.x - start.x) / dragDistance) * maxTilt);

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    animationFrame = null;
  }

  function finishDrag(event) {
    if (event.pointerId !== activePointer) {
      return;
    }

    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    if (moved) {
      suppressClicksUntil = performance.now() + 400;
    }

    activePointer = null;
    card.classList.remove("is-dragging");
    card.style.transform = "";
  }

  card.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    const pressedIconLink = event.target.closest(".icon-container a");

    if (pressedIconLink) {
      event.preventDefault();
      suppressClicksUntil = 0;
      iconPointer = event.pointerId;
      iconLink = pressedIconLink;
      card.setPointerCapture(event.pointerId);
      return;
    }

    activePointer = event.pointerId;
    start = { x: event.clientX, y: event.clientY };
    current = start;
    moved = false;
    card.classList.add("is-dragging");
    card.setPointerCapture(event.pointerId);
  });

  card.addEventListener("pointermove", (event) => {
    if (event.pointerId !== activePointer) {
      return;
    }

    current = { x: event.clientX, y: event.clientY };
    moved ||= Math.hypot(current.x - start.x, current.y - start.y) > 4;

    if (animationFrame === null) {
      animationFrame = requestAnimationFrame(renderTilt);
    }
  });

  card.addEventListener("pointerup", (event) => {
    if (event.pointerId === iconPointer) {
      const linkToActivate = iconLink;
      iconPointer = null;
      iconLink = null;
      linkToActivate.click();
      return;
    }

    finishDrag(event);
  });

  card.addEventListener("pointercancel", (event) => {
    if (event.pointerId === iconPointer) {
      iconPointer = null;
      iconLink = null;
      return;
    }

    finishDrag(event);
  });
  card.addEventListener("dragstart", (event) => event.preventDefault());
  card.addEventListener(
    "click",
    (event) => {
      if (performance.now() < suppressClicksUntil) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    true,
  );
}

enableCardTilt();

// Temporary on-device diagnostics for the Safari edge-to-edge work.
// Only active with ?safari-debug=1 in the URL; inert otherwise.
function setupSafariDebug() {
  const params = new URLSearchParams(window.location.search);

  if (!params.has("safari-debug")) {
    return;
  }

  const panel = document.createElement("pre");
  panel.id = "safari-debug";
  document.body.appendChild(panel);

  const insetProbe = document.createElement("div");
  insetProbe.style.cssText =
    "position:absolute;visibility:hidden;pointer-events:none;" +
    "padding-top:env(safe-area-inset-top,0px);" +
    "padding-bottom:env(safe-area-inset-bottom,0px);";
  document.body.appendChild(insetProbe);

  const recentEvents = [];
  const noteEvent = (name) => {
    recentEvents.unshift(`${name}@${Math.round(performance.now())}`);
    recentEvents.length = Math.min(recentEvents.length, 5);
  };

  window.addEventListener("resize", () => noteEvent("resize"));
  window.addEventListener("scroll", () => noteEvent("scroll"), {
    passive: true,
  });

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", () =>
      noteEvent("vv-resize"),
    );
    window.visualViewport.addEventListener("scroll", () =>
      noteEvent("vv-scroll"),
    );
  }

  let frames = 0;
  let fps = 0;
  let fpsWindowStart = performance.now();
  let fpsWindowFrames = 0;
  let lastRender = 0;

  function render(now) {
    const html = document.documentElement;
    const body = document.body;
    const vv = window.visualViewport;
    const canvas = document.getElementById("canvas");
    const canvasRect = canvas ? canvas.getBoundingClientRect() : null;
    const htmlStyle = window.getComputedStyle(html);
    const bodyStyle = window.getComputedStyle(body);
    const probeStyle = window.getComputedStyle(insetProbe);

    panel.textContent = [
      `frames ${frames} | ~${fps}fps (watch during rubber-band)`,
      `scrollY ${window.scrollY.toFixed(1)} scrollX ${window.scrollX.toFixed(1)}`,
      `inner ${window.innerWidth}x${window.innerHeight} outer ${window.outerWidth}x${window.outerHeight} screen ${screen.width}x${screen.height}`,
      `html client ${html.clientWidth}x${html.clientHeight} scroll ${html.scrollWidth}x${html.scrollHeight}`,
      `body client ${body.clientWidth}x${body.clientHeight} scroll ${body.scrollWidth}x${body.scrollHeight}`,
      vv
        ? `vv ${vv.width.toFixed(1)}x${vv.height.toFixed(1)} offsetTop ${vv.offsetTop.toFixed(1)} pageTop ${vv.pageTop.toFixed(1)} scale ${vv.scale}`
        : "vv unavailable",
      `safe-area top ${probeStyle.paddingTop} bottom ${probeStyle.paddingBottom}`,
      `edge ${edgeExtend ? `top ${edgeExtend.top} bottom ${edgeExtend.bottom} snap ${edgeExtend.snap}` : "off"}`,
      `getCSSCanvasContext ${typeof document.getCSSCanvasContext} | touch-callout ${CSS.supports("-webkit-touch-callout", "none")}`,
      `html bg ${htmlStyle.backgroundColor} img ${htmlStyle.backgroundImage.slice(0, 40)}`,
      `body bg ${bodyStyle.backgroundColor} img ${bodyStyle.backgroundImage.slice(0, 40)}`,
      canvasRect
        ? `canvas css ${Math.round(canvasRect.width)}x${Math.round(canvasRect.height)} rect top ${canvasRect.top.toFixed(1)} bottom ${canvasRect.bottom.toFixed(1)}`
        : "canvas missing",
      `events ${recentEvents.join(" ") || "none"}`,
      `ua ${navigator.userAgent}`,
    ].join("\n");
    lastRender = now;
  }

  function tick(now) {
    frames += 1;
    fpsWindowFrames += 1;

    if (now - fpsWindowStart >= 1000) {
      fps = Math.round((fpsWindowFrames * 1000) / (now - fpsWindowStart));
      fpsWindowStart = now;
      fpsWindowFrames = 0;
    }

    if (now - lastRender >= 200) {
      render(now);
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

setupSafariDebug();
