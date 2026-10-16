// ─────────────────────────────────────────────────────────────────────────────
//  INSIDE THE MUSCLE — the screenplay.
//  Every scene is data: duration, captions (seconds from scene start),
//  camera keyframes [t, position, lookAt] and the anatomy layers it exposes.
//  To re-time the film or rewrite text, edit this file only.
// ─────────────────────────────────────────────────────────────────────────────

export const LAYERS = {
  skin: 'Skin',
  bones: 'Bones',
  muscles: 'Muscles',
  nerves: 'Nerves',
  sheath: 'Connective tissue',
  vessels: 'Capillaries',
  membrane: 'Membranes',
  vesicles: 'Vesicles & ACh',
  receptors: 'Receptors',
  labels: 'Labels',
};

// Timing of molecular events at the neuromuscular junction (scene 4).
export const SYN = {
  AP: [3.4, 6.6, 9.8, 26.2, 29.4, 32.6, 38.6], // impulse leaves top of the axon
  TRAVEL: 0.9, // seconds until it reaches the terminal
  TOX_IN: 13.0, // toxin enters the cleft
  BIND: 15.8, // heavy chain binds the nerve membrane
  ENDO: 17.4, // terminal swallows it (endocytosis)
  LC: 20.0, // light chain escapes into the terminal
  CUT: 22.4, // first SNAP-25 cut (one site after another, 0.35 s apart)
  RECOVER: 36.4, // "weeks later": SNAP-25 rebuilt
  DUR: 41.5,
};
export const SITE_COUNT = 4;
export const cutTime = (i) => SYN.CUT + i * 0.35;
export const blockedAt = (arrival) => arrival >= cutTime(SITE_COUNT - 1) + 0.2 && arrival < SYN.RECOVER + 0.6;

// Illustrative effect curve (fraction of junctions silenced) over weeks after treatment.
// Onset within days, strongest around weeks 2–6, fading by roughly 3–4 months.
export function effectAt(week) {
  const ss = (a, b, x) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };
  return 0.68 * ss(0.3, 2.6, week) * (1 - ss(6.5, 15, week));
}

export const SCENES = [
  {
    id: 'leg',
    title: 'Inside the Leg',
    world: 'leg',
    duration: 17.5,
    layers: ['skin', 'bones', 'muscles', 'nerves', 'labels'],
    captions: [
      { at: 0, kicker: 'Scene 1', text: 'Let’s step inside a human leg.' },
      { at: 3.6, kicker: 'The lower leg', text: 'Under the skin: bones, muscles and nerves working as one system.' },
      { at: 6.9, kicker: 'Bones', text: 'The tibia (shin bone) carries your weight. The slimmer fibula runs beside it.' },
      { at: 9.8, kicker: 'Calf muscles', text: 'Gastrocnemius, with its two heads, lies near the surface. The soleus lies beneath. Both pull on the Achilles tendon to point the foot.' },
      { at: 13.8, kicker: 'The messenger', text: 'The tibial nerve carries electrical commands from the spinal cord into these muscles.' },
    ],
    camera: [
      [0, [5.2, 2.4, 13.5], [0, 0.2, 0]],
      [5, [3.6, 1.6, 10.8], [0, 0.4, 0.2]],
      [10, [-3.6, 2.4, 8.4], [-0.1, 1.0, 0.4]],
      [14.5, [3.4, 3.4, 7.4], [0, 2.0, 0.3]],
      [17.5, [3.9, 3.8, 6.8], [0, 2.2, 0.3]],
    ],
    distance: [3, 26],
  },
  {
    id: 'spasticity',
    title: 'What Is Spasticity?',
    world: 'fibers',
    duration: 20,
    layers: ['sheath', 'nerves', 'vessels', 'labels'],
    captions: [
      { at: 0, kicker: 'Scene 2', text: 'Inside the calf: thousands of muscle fibers, each one waiting for a nerve signal.' },
      { at: 3.4, kicker: 'Normal tone', text: 'A quick stretch triggers a small reflex. The brain’s steady “calming” control keeps it in proportion.' },
      { at: 8.4, kicker: 'Cerebral palsy', text: 'An early injury to the developing brain weakens that descending control over the spinal cord.' },
      { at: 12.2, kicker: 'Over-excitable reflex', text: 'Motor neurons fire too easily. Fibers stay partly switched on, raising muscle tone.' },
      { at: 15.4, kicker: 'Spasticity', text: 'The faster the stretch, the stronger the reflex fights back. Clinicians call this velocity-dependent resistance.' },
    ],
    camera: [
      [0, [0.6, 7.5, 16], [0, 0.4, 0]],
      [5, [8.4, 2.4, 10.5], [0.8, 0.3, 0]],
      [11, [8.0, 1.2, 7.6], [1.4, 0.1, 0.4]],
      [16, [4.4, 2.0, 9.8], [0.2, 0.2, 0]],
      [20, [3.0, 2.4, 10.6], [0, 0.2, 0]],
    ],
    distance: [2.5, 24],
    stretches: [
      { at: 4.6, kind: 'quick' },
      { at: 15.6, kind: 'quick' },
    ],
  },
  {
    id: 'treatment',
    title: 'Botulinum Toxin Treatment',
    world: 'leg',
    duration: 15,
    layers: ['skin', 'bones', 'muscles', 'nerves', 'labels'],
    captions: [
      { at: 0, kicker: 'Scene 3', text: 'Botulinum toxin type A is a purified protein, used in tiny, precisely measured amounts.' },
      { at: 4.0, kicker: 'A clinical decision', text: 'A trained specialist decides which muscles to treat, based on an individual assessment.' },
      { at: 7.8, kicker: 'Local action', text: 'Injected into the chosen muscle, it spreads only a short distance and acts where it is placed.' },
      { at: 11.2, kicker: 'The target', text: 'It seeks out the tiny endings of motor nerves inside the muscle. Let’s shrink down and follow it…' },
    ],
    camera: [
      [0, [6.4, 2.6, 11.5], [0, 1.0, 0.3]],
      [4, [3.6, 2.4, 8.4], [-0.2, 1.6, 0.5]],
      [9, [-3.4, 2.3, 5.8], [-0.27, 1.8, 0.6]],
      [13, [-1.9, 2.0, 3.5], [-0.27, 1.8, 0.62]],
      [15, [-0.8, 1.9, 2.0], [-0.27, 1.8, 0.62]],
    ],
    distance: [0.6, 22],
    note: 'Concept only. No doses or injection points are shown: these are decided individually by specialists.',
  },
  {
    id: 'nmj',
    title: 'The Neuromuscular Junction',
    world: 'synapse',
    duration: SYN.DUR,
    layers: ['membrane', 'vesicles', 'receptors', 'labels'],
    captions: [
      { at: 0, kicker: 'Scene 4 · ~100,000× zoom', text: 'The neuromuscular junction: where a motor nerve ending meets a muscle fiber.' },
      { at: 3.2, kicker: '1 · The signal arrives', text: 'An electrical impulse races down the motor nerve to its ending.' },
      { at: 5.0, kicker: '2 · Calcium & SNAREs', text: 'Calcium rushes in. SNARE proteins zip a vesicle onto the membrane and it releases acetylcholine (ACh).' },
      { at: 8.0, kicker: '3 · Message delivered', text: 'ACh crosses the gap in a fraction of a millisecond and opens receptors. The fiber is told to contract.' },
      { at: 10.9, kicker: '4 · Reset', text: 'An enzyme, acetylcholinesterase, clears ACh away, ready for the next signal.' },
      { at: 13.2, kicker: 'Botulinum toxin arrives', text: 'Its heavy chain recognises and binds to receptors found on motor nerve endings.' },
      { at: 17.4, kicker: 'Taken inside', text: 'The nerve ending draws the toxin in, wrapped in a small bubble of membrane.' },
      { at: 20.0, kicker: 'Molecular scissors', text: 'The light chain slips out into the nerve ending. It is an enzyme.' },
      { at: 22.4, kicker: 'The cut', text: 'It cuts SNAP-25, one of the SNARE proteins a vesicle needs in order to fuse.' },
      { at: 26.2, kicker: 'Signal blocked', text: 'The impulse still arrives. Calcium still enters. But the vesicles can no longer release ACh.' },
      { at: 30.6, kicker: 'A quieter muscle', text: 'Receptors stay silent, so the fiber relaxes. The muscle and the receptors are not damaged.' },
      { at: 34.8, kicker: 'Weeks to months later', text: 'The nerve ending rebuilds SNAP-25 and grows new sprouts. Transmission returns, so the effect is temporary.' },
    ],
    camera: [
      [0, [1.5, 14, 11], [0, 8.5, 0]],
      [3.4, [6.0, 4.4, 10.4], [0, 1.4, 0]],
      [8.5, [4.6, 1.3, 8.4], [0, 0.3, 0]],
      [13, [-6.2, 1.4, 8.6], [-0.4, 0.4, 0.4]],
      [17.5, [-4.0, 1.4, 6.0], [-0.6, 0.6, 0.6]],
      [21, [-2.6, 1.2, 3.8], [-0.7, 0.6, 0.3]],
      [24.5, [-2.2, 0.95, 3.3], [-0.75, 0.5, 0.0]],
      [28, [3.6, 1.6, 8.2], [0, 0.3, 0]],
      [32.5, [0.6, 0.1, 8.0], [0, -0.1, 0]],
      [37, [4.6, 3.0, 9.4], [0, 0.9, 0]],
      [41.5, [5.4, 3.6, 10.6], [0, 1.0, 0]],
    ],
    distance: [1, 26],
    seekBefore: 2.8,
    seekAfter: 25.8,
  },
  {
    id: 'compare',
    title: 'Before and After',
    world: 'fibers',
    duration: 27,
    layers: ['sheath', 'nerves', 'vessels', 'labels'],
    captions: [
      { at: 0, kicker: 'Before', text: 'Before treatment: overactive signals keep many fibers firing. The muscle resists stretch.' },
      { at: 4.6, kicker: 'After · week 4', text: 'Nerve impulses still arrive, but fewer junctions pass them on. Muscle tone drops.' },
      { at: 8.6, kicker: 'Days', text: 'The effect builds gradually. It usually starts within days, not hours.' },
      { at: 12.2, kicker: 'Weeks 2–6', text: 'It is usually strongest a few weeks after treatment.' },
      { at: 15.8, kicker: '~3–4 months', text: 'As nerve endings recover, the effect fades. Further treatment, if any, is planned by the care team.' },
      { at: 19.6, kicker: 'Every body is different', text: 'How much tone changes, and for how long, varies from person to person.' },
      { at: 23.0, kicker: 'An honest note', text: 'Less spasticity does not automatically mean better walking. Strength, control, muscle length and therapy all play a part.' },
    ],
    camera: [
      [0, [5.6, 1.8, 11.5], [0, 0.2, 0]],
      [9, [1.5, 2.6, 11.8], [0, 0.2, 0]],
      [18, [-4.2, 1.6, 10.8], [0, 0.2, 0]],
      [27, [-6.2, 2.4, 9.2], [0, 0.2, 0]],
    ],
    distance: [2.5, 24],
  },
];

// Scripted (default) before/after state and week for scene 5.
export function compareScript(t) {
  if (t < 4.6) return { treated: false, week: 4 };
  if (t < 8.6) return { treated: true, week: 4 };
  if (t < 19.6) return { treated: true, week: Math.min(16, ((t - 8.6) / 10.6) * 16) };
  return { treated: true, week: 16 };
}

export const INTRO = 3.4; // film title card
export const OUTRO = 5.5; // film end card
