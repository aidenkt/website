## 🌐 My Personal Website

<img width="1631" height="988" alt="file-4174c40d5329bff37a5589ef3a2057c7" src="https://github.com/user-attachments/assets/3b3e8c95-f008-4c84-9619-eb475068fdb6" />


[**aidenkt.com**](https://aidenkt.com) — a single-screen landing page with an animated WebGL gradient, a frosted-glass contact card, and not much else. It loads fast, works offline of any framework, and gets out of the way.

-# Easter egg: append `?start` to the URL for a deep-teal palette with the card hidden. I use it as my New Tab page on browsers.

### Stack

| | |
|---|---|
| Rendering | [Three.js](https://threejs.org) r110 + custom GLSL, [chroma-js](https://gka.github.io/chroma.js/) |
| Page | Hand-written HTML/CSS/JS — no framework, no build step |
| Icons | Inline SVG |
| Server | Express (local dev + analytics middleware) |
| Analytics | [PostHog](https://posthog.com), reverse-proxied through `wsp.aidenkt.com` |
| Hosting | Vercel static |

---

<sub>© Aiden Tabrizi · <a href="https://github.com/aidenkt">GitHub</a> · <a href="https://www.linkedin.com/in/aidenkt/">LinkedIn</a></sub>
