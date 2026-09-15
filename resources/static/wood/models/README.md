# Leaf models for `/wood`

The vines on `/wood` currently use procedural leaves generated in `wood.js`.
This folder is the drop point for real 3D leaf models. Nothing in here is
loaded until a file is listed in `LEAF_MODEL_URLS` at the top of `wood.js`.

## Contract

- **Format:** `.glb` (binary glTF 2.0), no Draco compression. Textures embedded.
- **Content:** one leaf per file, including its short petiole if you want one.
  Several files give several leaf variants; the vine picks one per leaf.
- **Orientation:** the leaf points along **+Y**, base of the petiole toward the
  origin, blade face toward **+Z**. Left/right is X.
- **Scale and origin:** anything. On load the model is normalised so its base
  sits at the origin and its height along Y is exactly 1 unit. Leaves are then
  scaled to roughly 0.3 to 1.1 units on the vine. If a model still lands too
  large or small, adjust `LEAF_MODEL_SCALE` in `wood.js`.
- **Materials:** standard glTF PBR (`MeshStandardMaterial`). Base colour, normal,
  roughness and optional alpha cutout all work. Materials are forced to
  double-sided and given an environment map intensity on load.
- **Budget:** aim for under 3,000 triangles per leaf and 1k textures. Around
  60 to 90 leaves are on screen at once and every one casts a shadow.

## Enabling

```js
const LEAF_MODEL_URLS = [
  "/wood/models/leaf-01.glb",
  "/wood/models/leaf-02.glb",
];
```

Reload the page. If a file fails to load, the console gets a warning and the
procedural leaf is used in its place.

## Animation

Leaves are not animated internally. Each leaf is attached to a pivot at its
base that the page gently rotates for sway and flutter, so a rigid mesh is fine.
