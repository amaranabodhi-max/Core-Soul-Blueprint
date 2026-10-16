# INSIDE THE MUSCLE: HOW BOTOX WORKS

An interactive, vertical (9:16) 3D film about how botulinum toxin type A reduces
spasticity in the calf muscles, as used in cerebral palsy (CP). The viewer shrinks
from the whole lower leg down to single molecules at the neuromuscular junction.

> Educational visualization. Stylized anatomy, not to scale. Not medical advice:
> doses, muscles and injection sites are decided individually by specialists, and
> none are shown here.

*Интерактивный вертикальный 3D-фильм о действии ботулотоксина типа A на мышцы
голени при спастичности (ДЦП). Самостоятельный проект в папке `inside-the-muscle/`;
лендинг Core Soul Blueprint в корне репозитория не изменялся.*

## Run it

```bash
cd inside-the-muscle
npm install
npm run dev          # http://localhost:5173  (also on your LAN, so you can open it on a phone)
```

Production build: `npm run build` → `dist/`. One self-contained HTML file for sharing:
`npm run build:single` → `dist-single/index.html`.

Useful URL parameters: `?scene=4` start at a scene · `&t=20` start time (s) ·
`&film` start in film mode · `&paused`.

## The five scenes

| # | Scene | What you see | Interaction |
|---|-------|--------------|-------------|
| 1 | Inside the Leg | Skin turns to glass; tibia, fibula, gastrocnemius (2 heads), soleus, Achilles tendon, tibial & common fibular nerves with travelling impulses | Rotate, zoom, show/hide layers |
| 2 | What Is Spasticity? | A fascicle of striated fibers in 5 intermingled motor units. Spikes run down each axon; endplates flash; fibers twitch, summate and shorten. The reflex circuit card shows the brain's "calming control" weakening | **Quick stretch / Slow stretch** buttons: the reflex response depends on stretch speed |
| 3 | Botulinum Toxin Treatment | The specialist-chosen muscle is highlighted; a toxin cloud appears inside it, spreads locally and gathers on intramuscular nerve endings. No needle, doses or points | Rotate, zoom, layers |
| 4 | The Neuromuscular Junction | Impulse → Ca²⁺ entry → SNARE-driven vesicle fusion → ACh crosses the cleft → nicotinic receptors open → depolarisation wave → myofibril twitch. Then: heavy chain binds → endocytosis → light chain escapes → **SNAP-25 is cut** → impulses and Ca²⁺ still arrive but no release → recovery weeks later | **Before / After** jumps between normal and blocked transmission; live signal-chain chips |
| 5 | Before and After | The same fascicle: nerve impulses keep coming, but blocked junctions (violet) no longer pass them on. EMG-style traces and an illustrative effect-over-weeks curve | **Before / After** toggle; drag the week marker (0–16 weeks) |

Controls: Play/Pause · Previous/Next · Rotate (auto-orbit) · Zoom ± · Anatomy (layer
sheet) · Before/After · Film. Drag to orbit, pinch/scroll to zoom; "Follow the story"
returns the camera to the screenplay. Keyboard: Space, ←/→, R, +/−, B, F, Esc.

## Recording the vertical video

**Film** mode hides the controls and plays all scenes with a title and end card, ready
for screen recording. For a perfect, frame-exact MP4 (no dropped frames, any machine):

```bash
npm run dev                                   # terminal 1
npm run capture -- http://localhost:5173/ film.mp4 1920   # terminal 2 → 1080×1920, 30 fps
```

The capture script (`scripts/capture.mjs`) steps the film's clock by exactly 1/30 s per
frame and pipes screenshots to `ffmpeg` (must be installed). It uses Playwright's
Chromium; set `CHROME=/path/to/chrome` if yours lives elsewhere. `npm run shots` grabs
still frames, e.g. `npm run shots -- http://localhost:5173/ shots "4:23" "5:10:ui"`.

## How it is built

- **React + React Three Fiber (Three.js)**, drei, and `@react-three/postprocessing`
  (bloom, vignette, grain, slight chromatic aberration).
- Custom GLSL shaders (`src/three/materials.js`): glassy fresnel membranes, instanced
  skeletal-muscle fibers with sarcomere bands that compress on contraction and an action
  potential spreading from the endplate, a folded postsynaptic membrane with a
  depolarisation ring, and soft glowing particles.
- **The screenplay is data** (`src/scenes.js`): durations, captions, camera keyframes,
  layer lists and the molecular timeline of scene 4. Re-time or rewrite the film there.
- Everything is deterministic (seeded randomness, clock-driven animation), so the
  recorded video matches the interactive version exactly.

```
src/
  scenes.js            screenplay, timings, effect curve
  store.js             tiny state store + actions (play, seek, zoom, layers, film…)
  three/Stage.jsx      canvas, scripted camera rig, lights, post-processing, capture bridge
  three/LegModel.jsx   scenes 1 & 3 (procedural lower-leg anatomy)
  three/FiberBundle.jsx scenes 2 & 5 (motor units, spikes, reflex, block)
  three/Synapse.jsx    scene 4 (neuromuscular junction & toxin mechanism)
  three/materials.js   shaders · three/geometry.js procedural shapes · three/common.jsx labels, dust
  ui/Overlay.jsx       captions, progress, controls, scene widgets, film cards
scripts/capture.mjs    frame-exact MP4 recorder · scripts/shots.mjs still frames
```

## Scientific notes and honest limits

- **Anatomy is procedural and stylized.** Shapes are swept ellipses following standard
  relations (gastrocnemius from the femoral condyles over soleus; both into the Achilles
  tendon; tibial nerve deep to soleus; common fibular nerve around the fibular neck). It
  is not a scan-accurate model.
- **Scale is exaggerated** in scene 4: the real synaptic cleft is ~50 nm and molecules are
  far smaller relative to vesicles. Timings are slowed (ACh crosses the cleft in
  microseconds; a full cycle takes milliseconds).
- **Spasticity** is shown per Lance's definition: a velocity-dependent increase in
  stretch reflexes from loss of descending (upper motor neuron) control. CP also involves
  weakness, reduced selective control and muscle/tendon changes, which a reflex model
  cannot show.
- **Mechanism**: BoNT/A heavy chain binds gangliosides and SV2 on motor nerve terminals,
  is endocytosed; the light chain (a zinc protease) translocates and cleaves SNAP-25,
  preventing SNARE-mediated vesicle fusion and ACh release. Receptors and muscle are not
  damaged. Function returns as SNAP-25 is renewed and the terminal sprouts.
- **Timeline** in scene 5 is illustrative: onset within days, peak around weeks 2–6,
  wearing off over ~3–4 months. Responses vary; reduced tone does not guarantee better
  walking.

References: Lance JW (1980), *Spasticity: Disordered Motor Control*; Pirazzini M et al.
(2017), *Botulinum neurotoxins: biology, pharmacology and toxicology*, Pharmacol Rev
69:200–235; NICE CG145 (2012), *Spasticity in under 19s: management*.

## Upgrading the anatomy

Each structure is one mesh with its own material, so it can be swapped for a sculpted or
scanned model without touching the animation logic:

1. Export a GLB (e.g. from Z-Anatomy / BodyParts3D-based sets, CC BY-SA, or a licensed
   medical model) with separate meshes for skin, tibia, fibula, gastrocnemius heads,
   soleus, tendon and nerves, in metres, +Y up, calf toward +Z.
2. Load it with drei's `useGLTF` in `LegModel.jsx` and assign the existing materials
   (`mats.skin`, `mats.gastro`, …) to the matching meshes; keep the label anchor points
   in sync.
3. Nerve impulses and the toxin cloud follow the `TIBIAL_N` / `TWIGS` curves: redraw
   them along the new model's nerves.

The same applies to the synapse: replace the lathe terminal, receptor rosettes or
toxin shapes (e.g. from PDB 3BTA rendered as a surface) while keeping the timeline.
