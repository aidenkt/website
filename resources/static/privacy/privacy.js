const accent = document.querySelector(".page-accent");
const palettes = ["blue", "green", "base"];
let paletteIndex = 0;

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  window.setInterval(() => {
    accent.dataset.palette = palettes[paletteIndex];
    paletteIndex = (paletteIndex + 1) % palettes.length;
  }, 20000);
}
