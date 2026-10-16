import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { useFrame, useThree } from '@react-three/fiber';
import { store } from '../store';
import { SYN, SITE_COUNT, cutTime, blockedAt } from '../scenes';
import { rng, hash, smooth, clamp01, tube } from './geometry';
import { fresnelMaterial, membraneMaterial, fiberMaterial, GlowPoints } from './materials';
import { Label, approach } from './common';

// ─────────────────────────────────────────────────────────────────────────────
//  Neuromuscular junction (scene 4). Not to scale: molecules are enlarged and
//  the synaptic cleft (~50 nm in reality) is exaggerated so events are visible.
//  1 unit ≈ 0.1 µm.  Presynaptic terminal above (y > 0.35), cleft, then the
//  folded postsynaptic membrane of the muscle fiber (y ≈ −0.35).
// ─────────────────────────────────────────────────────────────────────────────

const SITES = [
  { x: -2.0, z: 0.25 },
  { x: -0.7, z: -0.3 },
  { x: 0.7, z: 0.3 },
  { x: 2.0, z: -0.2 },
];
const FOLDS = [-3.3, -2.0, -0.7, 0.7, 2.0, 3.3];
const MEM_Y = 0.35; // presynaptic membrane (bottom of terminal)
const POST_Y = -0.35; // postsynaptic crest
const DOCK_Y = 0.83;
const VES_R = 0.3;
const ACH_PER = 60;

const arrivals = SYN.AP.map((a) => a + SYN.TRAVEL);

// All vesicle release events, fixed in advance (deterministic film).
const RELEASES = [];
arrivals.forEach((a, j) => {
  if (blockedAt(a)) return;
  for (let i = 0; i < SITE_COUNT; i++) {
    if (hash(j * 13 + i * 3.7) < 0.12) continue; // release is probabilistic
    RELEASES.push({ site: i, r: a + 0.1 + hash(j * 7 + i) * 0.08 });
  }
});

/** Status of the transmission chain at time t (for the on-screen pipeline). */
export function synapseStatus(t) {
  let a = null;
  let ap = null;
  for (let j = 0; j < arrivals.length; j++) {
    if (SYN.AP[j] <= t) ap = SYN.AP[j];
    if (arrivals[j] <= t) a = arrivals[j];
  }
  const blocked = a !== null && blockedAt(a);
  const d = a === null ? 99 : t - a;
  const travelling = ap !== null && t - ap < SYN.TRAVEL + 0.2;
  const on = (lo, hi) => d >= lo && d < hi;
  return {
    blocked: blocked && d < 2.2,
    steps: [
      travelling,
      on(0, 0.7),
      !blocked && on(0.1, 0.8),
      !blocked && on(0.2, 1.4),
      !blocked && on(0.45, 1.9),
    ],
  };
}

function terminalRadius(y) {
  // matches the lathe profile below (roughly)
  const pts = [[0.35, 2.2], [0.55, 2.9], [0.8, 3.1], [1.4, 3.25], [2.2, 3.0], [3.0, 2.3], [3.7, 1.3], [4.3, 0.8]];
  for (let i = 0; i < pts.length - 1; i++) {
    if (y >= pts[i][0] && y <= pts[i + 1][0]) {
      const k = (y - pts[i][0]) / (pts[i + 1][0] - pts[i][0]);
      return pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k;
    }
  }
  return 0.8;
}

function foldDepth(x) {
  let d = 0;
  for (const f of FOLDS) d += 1.25 * Math.exp(-Math.pow((x - f) / 0.13, 2));
  return d;
}
function postY(x, z) {
  return POST_Y - foldDepth(x) - Math.pow(Math.max(0, Math.abs(x) - 4.2), 2) * 0.18 - Math.pow(Math.max(0, Math.abs(z) - 3), 2) * 0.18;
}

function helix(x, z, y0, y1, a0, turns = 2.4, r = 0.065) {
  const pts = [];
  for (let k = 0; k <= 12; k++) {
    const u = k / 12;
    const a = a0 + u * turns;
    pts.push([x + Math.cos(a) * r, y0 + (y1 - y0) * u, z + Math.sin(a) * r]);
  }
  return tube(pts, 0.017, 24, 5);
}

function build() {
  const r = rng(5);
  const profile = [
    [0.0, MEM_Y], [2.2, MEM_Y], [2.9, 0.55], [3.1, 0.8], [3.25, 1.4], [3.0, 2.2], [2.3, 3.0], [1.3, 3.7], [0.8, 4.3], [0.72, 5.0],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const terminal = new THREE.LatheGeometry(profile, 72);
  terminal.scale(1.25, 1, 0.85);

  const reserve = [];
  while (reserve.length < 30) {
    const y = 1.55 + r() * 1.7;
    const rad = terminalRadius(y) * 0.72;
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r()) * rad;
    reserve.push(new THREE.Vector3(Math.cos(a) * d * 1.25, y, Math.sin(a) * d * 0.85));
  }

  const mem = new THREE.PlaneGeometry(11, 8, 330, 48);
  mem.rotateX(-Math.PI / 2);
  const p = mem.attributes.position;
  for (let i = 0; i < p.count; i++) p.setY(i, postY(p.getX(i), p.getZ(i)));
  mem.computeVertexNormals();

  const receptors = [];
  while (receptors.length < 150) {
    const x = (r() - 0.5) * 8.2;
    const z = (r() - 0.5) * 5.4;
    if (FOLDS.some((f) => Math.abs(x - f) < 0.3)) continue;
    receptors.push(new THREE.Vector3(x, postY(x, z) + 0.1, z));
  }
  const lobes = [];
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2;
    const g = new THREE.CylinderGeometry(0.036, 0.042, 0.22, 8);
    g.translate(Math.cos(a) * 0.055, 0, Math.sin(a) * 0.055);
    lobes.push(g);
  }
  const receptorGeo = mergeGeometries(lobes);

  const strands = SITES.map(({ x, z }) => ({
    syntaxin: helix(x, z, MEM_Y, 0.56, 0.0),
    vamp: helix(x, z, 0.55, MEM_Y + 0.02, 1.05),
    snapLow: [helix(x, z, MEM_Y, 0.45, 2.1, 1.2), helix(x, z, MEM_Y, 0.45, 4.2, 1.2)],
    snapHigh: [helix(x, z, 0.45, 0.56, 3.3, 1.2), helix(x, z, 0.45, 0.56, 5.4, 1.2)],
  }));

  const myelin = [
    [7.2, 11.2],
    [11.6, 17],
  ].map(([a, b]) => {
    const g = new THREE.CylinderGeometry(1.15, 1.15, b - a, 40, 1, true);
    g.translate(0, (a + b) / 2, 0);
    return g;
  });

  const tox = SITES.map(({ x, z }, i) => {
    const S = new THREE.Vector3(x * 1.3 - 1.6, -0.05 + 0.14 * (i % 2), 3.3 + 0.45 * i);
    const B = new THREE.Vector3(x + 0.5, 0.17, z + 0.8);
    const M = S.clone().lerp(B, 0.5).add(new THREE.Vector3(0.2, 0.3 * Math.sin(i * 2.1), 0));
    return {
      path: new THREE.CatmullRomCurve3([S, M, B]),
      B,
      E: new THREE.Vector3(B.x + 0.1, 1.3, B.z - 0.15),
      K: new THREE.Vector3(x + 0.12, 0.5, z + 0.12),
      d: i * 0.3,
    };
  });

  return { terminal, reserve, mem, receptors, receptorGeo, strands, myelin, tox };
}

export function Synapse() {
  const geo = useMemo(build, []);
  const { size, gl } = useThree();

  const mats = useMemo(
    () => ({
      terminal: fresnelMaterial({ color: '#ffc768', rim: '#ffd88a', opacity: 0.05, power: 2.0, intensity: 1.15, side: THREE.DoubleSide, flash: '#fff2c4' }),
      myelin: fresnelMaterial({ color: '#d6e6ff', rim: '#eef5ff', opacity: 0.18, power: 1.6, intensity: 0.8, side: THREE.DoubleSide }),
      mito: fresnelMaterial({ color: '#ff9a4d', rim: '#ffb070', opacity: 0.25, power: 1.6, intensity: 1.0 }),
      vesicle: fresnelMaterial({ color: '#78f0ff', rim: '#a8f7ff', opacity: 0.22, power: 1.5, intensity: 1.6, additive: true }),
      membrane: membraneMaterial(),
      receptor: new THREE.MeshBasicMaterial({ toneMapped: false }),
      channel: new THREE.MeshBasicMaterial({ color: '#ff9b3d', toneMapped: false, transparent: true }),
      syntaxin: new THREE.MeshBasicMaterial({ color: '#ff6b6b', toneMapped: false, transparent: true }),
      vamp: new THREE.MeshBasicMaterial({ color: '#69a8ff', toneMapped: false, transparent: true }),
      snapLow: new THREE.MeshBasicMaterial({ color: '#5dff9b', toneMapped: false, transparent: true }),
      snapHigh: SITES.map(() => new THREE.MeshBasicMaterial({ color: '#5dff9b', toneMapped: false, transparent: true })),
      hc: new THREE.MeshStandardMaterial({ color: '#8f63ff', emissive: '#6a3dff', emissiveIntensity: 1.2, roughness: 0.35, transparent: true }),
      lc: new THREE.MeshStandardMaterial({ color: '#ff5fd2', emissive: '#ff2fbf', emissiveIntensity: 2.2, roughness: 0.3, transparent: true }),
      bubble: fresnelMaterial({ color: '#d9b8ff', rim: '#d0a8ff', opacity: 0.08, power: 1.4, intensity: 1.4, additive: true }),
      ring: new THREE.MeshBasicMaterial({ color: '#fff3c2', toneMapped: false, transparent: true }),
      fibril: fiberMaterial({ freq: 7 }),
    }),
    []
  );

  const reserveMesh = useMemo(() => {
    const m = new THREE.InstancedMesh(new THREE.SphereGeometry(VES_R, 20, 14), mats.vesicle, geo.reserve.length);
    m.frustumCulled = false;
    return m;
  }, [geo, mats]);
  const receptorMesh = useMemo(() => {
    const m = new THREE.InstancedMesh(geo.receptorGeo, mats.receptor, geo.receptors.length);
    const d = new THREE.Object3D();
    geo.receptors.forEach((p, i) => {
      d.position.copy(p);
      d.rotation.y = i;
      d.scale.setScalar(0.62);
      d.updateMatrix();
      m.setMatrixAt(i, d.matrix);
      m.setColorAt(i, new THREE.Color('#1d4f78'));
    });
    return m;
  }, [geo, mats]);
  const fibrils = useMemo(() => {
    const n = 6;
    const g = new THREE.CylinderGeometry(0.45, 0.45, 13, 20, 60, true);
    g.setAttribute('aState', new THREE.InstancedBufferAttribute(new Float32Array(n * 3), 3));
    const m = new THREE.InstancedMesh(g, mats.fibril, n);
    const d = new THREE.Object3D();
    for (let i = 0; i < n; i++) {
      d.position.set(0, -2.15 - (i % 2) * 0.35, -2.5 + i * 1.0);
      d.rotation.set(0, 0, Math.PI / 2);
      d.updateMatrix();
      m.setMatrixAt(i, d.matrix);
    }
    return m;
  }, [mats]);

  const ach = useMemo(() => {
    const p = new GlowPoints(SITE_COUNT * 2 * ACH_PER);
    const r = rng(3);
    const cyan = new THREE.Color('#58f2ff');
    p.seeds = [];
    for (let i = 0; i < p.capacity; i++) {
      p.seeds.push({ a: r() * Math.PI * 2, k: Math.pow(r(), 0.7), sp: 0.7 + r() * 0.6, ph: r() * 6.28 });
      p.set(i, 0, -99, 0, 0.13, 0, cyan);
    }
    p.commit();
    return p;
  }, []);
  const ions = useMemo(() => {
    const p = new GlowPoints(SITE_COUNT * 8);
    const orange = new THREE.Color('#ffb04a');
    for (let i = 0; i < p.capacity; i++) p.set(i, 0, -99, 0, 0.12, 0, orange);
    p.commit();
    return p;
  }, []);
  const flashes = useMemo(() => {
    const p = new GlowPoints(SITE_COUNT * 2);
    const c = new THREE.Color('#ffd1f5');
    for (let i = 0; i < p.capacity; i++) p.set(i, 0, -99, 0, 1.2, 0, c);
    p.commit();
    return p;
  }, []);

  const vesRefs = useRef([]);
  const stRefs = useRef([]);
  const highRefs = useRef([]);
  const hcRefs = useRef([]);
  const lcRefs = useRef([]);
  const bubRefs = useRef([]);
  const chanRefs = useRef([]);
  const ring = useRef();
  const fades = useRef({ membrane: 1, vesicles: 1, receptors: 1 });
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const base = useMemo(() => new THREE.Color('#24506f'), []);
  const hot = useMemo(() => new THREE.Color(0.55, 2.4, 2.8), []);
  const col = useMemo(() => new THREE.Color(), []);
  // Positions published for moving labels.
  const tracked = useMemo(() => ({ hc: new THREE.Vector3(), lc: new THREE.Vector3() }), []);

  useFrame((_, delta) => {
    const s = store.get();
    const t = s.t;
    const clk = s.clock;
    const dt = s.dt || (s.playing ? 0 : delta);
    const F = fades.current;
    for (const k of ['membrane', 'vesicles', 'receptors']) F[k] = approach(F[k], s.layers[k] ? 1 : 0, dt, 6);
    const scale = size.height * gl.getPixelRatio() * 0.5;

    // ── Action potential down the axon, flash at the terminal ──
    let lastA = -99;
    let ringY = null;
    SYN.AP.forEach((ap, j) => {
      const tau = t - ap;
      const run = SYN.TRAVEL * 0.8;
      if (tau >= 0 && tau < run) ringY = 16.5 - (16.5 - 4.6) * (tau / run);
      if (arrivals[j] <= t) lastA = arrivals[j];
    });
    if (ring.current) {
      ring.current.visible = ringY !== null;
      if (ringY !== null) ring.current.position.y = ringY;
    }
    const sinceA = t - lastA;
    mats.terminal.uniforms.uFlash.value = sinceA >= 0 ? Math.exp(-sinceA * 3.5) * 0.9 : 0;
    mats.terminal.uniforms.uFade.value = F.membrane;
    mats.myelin.uniforms.uFade.value = F.membrane;
    mats.mito.uniforms.uFade.value = F.membrane;

    // Calcium channels + Ca²⁺ ions (these still work when the toxin has acted).
    chanRefs.current.forEach((m) => m && m.scale.setScalar(1 + (sinceA < 0.6 ? 0.6 * Math.exp(-sinceA * 5) : 0)));
    mats.channel.color.set('#ff9b3d').multiplyScalar(1 + (sinceA < 1 ? 2.5 * Math.exp(-sinceA * 4) : 0));
    for (let i = 0; i < SITE_COUNT; i++) {
      for (let k = 0; k < 8; k++) {
        const idx = i * 8 + k;
        const tau = sinceA;
        if (tau < 0 || tau > 1.1) {
          ions.set(idx, 0, -99, 0, 0.12, 0);
          continue;
        }
        const side = k % 2 ? 1 : -1;
        const u = clamp01(tau / 0.5);
        const x = SITES[i].x + side * (0.45 - u * 0.2) + Math.sin(k * 3.1) * 0.08 * u;
        const z = SITES[i].z + Math.cos(k * 2.3) * 0.18 * u;
        const y = 0.05 + u * 0.55 + Math.sin(k) * 0.05;
        ions.set(idx, x, y, z, 0.13, (1 - smooth(0.6, 1.1, tau)) * 0.95);
      }
    }
    ions.commit(scale);

    // ── Vesicles: fusion, ACh release, re-docking ──
    const lastRel = SITES.map(() => []);
    for (const ev of RELEASES) if (ev.r <= t) lastRel[ev.site].push(ev.r);
    let lastAny = -99;
    SITES.forEach((site, i) => {
      const list = lastRel[i];
      const r = list.length ? list[list.length - 1] : -99;
      lastAny = Math.max(lastAny, r);
      const tau = t - r;
      const v = vesRefs.current[i];
      let y = DOCK_Y;
      let sc = 1;
      let x = site.x;
      let z = site.z;
      let strand = 1;
      if (tau < 0.35) {
        const p = tau / 0.35;
        y = DOCK_Y - 0.42 * p;
        sc = 1 - 0.8 * p;
        strand = 1 - p;
      } else if (tau < 1.0) {
        sc = 0;
        strand = 0;
      } else if (tau < 2.2) {
        const q = smooth(1.0, 2.2, tau);
        x = site.x + 0.35 * (1 - q);
        z = site.z + 0.2 * (1 - q);
        y = 1.9 + (DOCK_Y - 1.9) * q;
        sc = 0.5 + 0.5 * q;
        strand = smooth(1.7, 2.2, tau);
      }
      // A docked vesicle that can't fuse trembles when calcium comes in.
      const tremble = blockedAt(lastA) && sinceA < 0.8 ? Math.sin(clk * 60 + i) * 0.015 * (1 - sinceA / 0.8) : 0;
      if (v) {
        v.position.set(x + tremble, y, z);
        v.scale.setScalar(Math.max(0.001, sc));
        v.visible = sc > 0.01 && F.vesicles > 0.01;
      }
      const g = stRefs.current[i];
      if (g) g.visible = strand > 0.05;
      // SNAP-25: cut by the light chain, rebuilt weeks later.
      const cut = cutTime(i);
      const hi = highRefs.current[i];
      let op = strand;
      if (t > cut && t < SYN.RECOVER - 1.2) {
        const k = smooth(cut, cut + 1.3, t);
        if (hi) hi.position.set(0.18 * k, 0.1 * k, 0.12 * k);
        op = strand * (1 - smooth(cut + 0.3, cut + 1.8, t));
      } else if (t >= SYN.RECOVER - 1.2) {
        if (hi) hi.position.set(0, 0, 0);
        op = strand * smooth(SYN.RECOVER - 1.2, SYN.RECOVER, t);
      } else if (hi) hi.position.set(0, 0, 0);
      mats.snapHigh[i].opacity = op;

      // ACh quanta from the last two releases at this site.
      for (let slot = 0; slot < 2; slot++) {
        const rr = list.length > slot ? list[list.length - 1 - slot] : -99;
        const ta = t - rr - 0.06;
        for (let k = 0; k < ACH_PER; k++) {
          const idx = (i * 2 + slot) * ACH_PER + k;
          const sd = ach.seeds[idx];
          if (ta < 0 || ta > 2.3 || F.vesicles < 0.01) {
            ach.set(idx, 0, -99, 0, 0.09, 0);
            continue;
          }
          const down = smooth(0, 0.45 / sd.sp, ta);
          const rad = 0.06 + 1.05 * sd.k * (1 - Math.exp(-ta * 3.2));
          const px = site.x + Math.cos(sd.a) * rad;
          const pz = site.z + Math.sin(sd.a) * rad;
          const floor = postY(px, pz) + 0.2;
          const py = MEM_Y - 0.05 + (floor - (MEM_Y - 0.05)) * down + Math.sin(clk * 3 + sd.ph) * 0.02;
          const alpha = smooth(0, 0.06, ta) * (1 - smooth(1.0, 2.1, ta)) * F.vesicles;
          ach.set(idx, px, py, pz, 0.13, alpha * 0.95);
        }
      }
    });
    ach.commit(scale);

    // Reserve pool drifts (Brownian-ish jiggle).
    geo.reserve.forEach((p, i) => {
      dummy.position.set(p.x + Math.sin(clk * 0.7 + i) * 0.04, p.y + Math.cos(clk * 0.6 + i * 1.3) * 0.04, p.z + Math.sin(clk * 0.5 + i * 2.1) * 0.04);
      dummy.scale.setScalar(0.85 + 0.15 * hash(i));
      dummy.updateMatrix();
      reserveMesh.setMatrixAt(i, dummy.matrix);
    });
    reserveMesh.instanceMatrix.needsUpdate = true;
    reserveMesh.visible = F.vesicles > 0.01;
    mats.vesicle.uniforms.uFade.value = F.vesicles;

    // ── Receptors: open when ACh binds ──
    for (let i = 0; i < geo.receptors.length; i++) {
      const rp = geo.receptors[i];
      let a = 0;
      for (const ev of RELEASES) {
        const tau = t - ev.r;
        if (tau < 0.12 || tau > 2.2) continue;
        const sx = SITES[ev.site].x - rp.x;
        const sz = SITES[ev.site].z - rp.z;
        a += Math.exp(-(sx * sx + sz * sz) / 1.1) * smooth(0.12, 0.32, tau) * (1 - smooth(0.6, 1.5, tau));
      }
      a = Math.min(1, a);
      col.copy(base).lerp(hot, a);
      receptorMesh.setColorAt(i, col);
    }
    receptorMesh.instanceColor.needsUpdate = true;
    receptorMesh.visible = F.receptors > 0.01;

    // ── Muscle membrane depolarisation + myofibril twitch ──
    const wt = t - lastAny - 0.3;
    mats.membrane.uniforms.uWaveT.value = wt;
    mats.membrane.uniforms.uWaveAmp.value = wt > -0.3 && wt < 3 ? 1 : 0;
    const tw = wt > 0 ? Math.min(1, wt / 0.12) * Math.exp(-wt * 2.2) : 0;
    const fs = fibrils.geometry.attributes.aState.array;
    for (let i = 0; i < 6; i++) {
      fs[i * 3] = tw * 0.6;
      fs[i * 3 + 1] = wt > 0 ? wt : 99;
      fs[i * 3 + 2] = 0;
    }
    fibrils.geometry.attributes.aState.needsUpdate = true;

    // ── Botulinum toxin ──
    geo.tox.forEach((m, i) => {
      const hc = hcRefs.current[i];
      const lc = lcRefs.current[i];
      const bub = bubRefs.current[i];
      if (!hc || !lc || !bub) return;
      const t0 = SYN.TOX_IN + m.d;
      const tb = SYN.BIND + m.d;
      const te = SYN.ENDO + m.d;
      const tl = SYN.LC + m.d;
      const cut = cutTime(i);
      const fadeOut = 1 - smooth(SYN.RECOVER - 1.4, SYN.RECOVER, t);
      const vis = t >= t0 && fadeOut > 0.01;
      hc.visible = lc.visible = vis;
      bub.visible = vis && t > te && t < tl + 2.6;
      if (!vis) return;
      const appear = smooth(t0, t0 + 0.8, t);
      mats.hc.opacity = appear * fadeOut;
      mats.lc.opacity = appear * fadeOut;
      let bubScale = 0;
      if (t < tb) {
        const u = smooth(t0, tb, t);
        m.path.getPointAt(u, tmp);
        hc.position.copy(tmp);
        const spin = (1 - u) * 2.5;
        hc.rotation.set(Math.sin(clk * 0.8 + i) * spin, clk * 0.6 * spin, Math.cos(clk * 0.7 + i) * spin);
      } else if (t < te) {
        hc.position.copy(m.B);
        hc.rotation.set(0, i, 0);
      } else {
        const u = smooth(te + 0.6, tl, t);
        hc.position.copy(m.B).lerp(m.E, u);
        hc.position.y = Math.max(hc.position.y, m.B.y + 0.18 * smooth(te, te + 0.6, t));
        hc.rotation.set(0, i + (t - te) * 0.4, 0);
        bubScale = smooth(te, te + 0.6, t) * (1 - smooth(tl + 1.2, tl + 2.6, t));
        mats.hc.opacity = appear * fadeOut * (1 - 0.6 * smooth(tl + 1.2, tl + 2.6, t));
      }
      bub.position.copy(hc.position).add(tmp.set(0, 0.15, 0));
      bub.scale.setScalar(Math.max(0.001, bubScale) * 0.55);
      // Light chain: attached to the heavy chain until it escapes into the terminal.
      if (t < tl) {
        lc.position.copy(hc.position).add(tmp.set(0, -0.12, 0).applyEuler(hc.rotation));
      } else {
        const u = smooth(tl, Math.min(cut - 0.05, tl + 2.2), t);
        const from = hc.position;
        lc.position.copy(from).lerp(m.K, u);
        if (t > cut) {
          lc.position.x += Math.sin(clk * 1.5 + i) * 0.05;
          lc.position.z += Math.cos(clk * 1.3 + i) * 0.05;
        }
      }
      lc.scale.setScalar(1 + (t > cut && t < cut + 0.6 ? 0.5 * Math.sin(((t - cut) / 0.6) * Math.PI) : 0));
      if (i === 1) {
        tracked.hc.copy(hc.position);
        tracked.lc.copy(lc.position);
      }
      // Flashes: binding (gold-violet) and cleavage (pink-white).
      const fb = t >= tb ? Math.exp(-(t - tb) * 3) : 0;
      flashes.set(i * 2, m.B.x, m.B.y + 0.15, m.B.z, 1.0, fb * 0.9);
      const fc = t >= cut ? Math.exp(-(t - cut) * 2.5) : 0;
      flashes.set(i * 2 + 1, m.K.x, m.K.y, m.K.z, 1.6, fc);
    });
    flashes.commit(scale);
  });

  return (
    <group>
      {/* Presynaptic: axon, myelin, terminal */}
      <mesh geometry={geo.terminal} material={mats.terminal} renderOrder={9} />
      <mesh position={[0, 10.8, 0]} material={mats.terminal} renderOrder={9}>
        <cylinderGeometry args={[0.72, 0.72, 11.6, 40, 1, true]} />
      </mesh>
      {geo.myelin.map((g, i) => (
        <mesh key={i} geometry={g} material={mats.myelin} renderOrder={9} />
      ))}
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]} material={mats.ring}>
        <torusGeometry args={[0.8, 0.07, 10, 48]} />
      </mesh>
      {[[-1.4, 2.4, 0.4, 0.6], [1.5, 2.7, -0.3, -0.4], [0.2, 3.2, 0.6, 1.2]].map(([x, y, z, rot], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[0, rot, Math.PI / 2.4]} material={mats.mito}>
          <capsuleGeometry args={[0.28, 0.9, 8, 16]} />
        </mesh>
      ))}

      {/* Active zones: docked vesicle, SNARE complex, calcium channels */}
      {SITES.map((site, i) => (
        <group key={i}>
          <mesh ref={(el) => (vesRefs.current[i] = el)} material={mats.vesicle} position={[site.x, DOCK_Y, site.z]}>
            <sphereGeometry args={[VES_R, 24, 16]} />
          </mesh>
          <group ref={(el) => (stRefs.current[i] = el)}>
            <mesh geometry={geo.strands[i].syntaxin} material={mats.syntaxin} />
            <mesh geometry={geo.strands[i].vamp} material={mats.vamp} />
            {geo.strands[i].snapLow.map((g, k) => (
              <mesh key={k} geometry={g} material={mats.snapLow} />
            ))}
            <group ref={(el) => (highRefs.current[i] = el)}>
              {geo.strands[i].snapHigh.map((g, k) => (
                <mesh key={k} geometry={g} material={mats.snapHigh[i]} />
              ))}
            </group>
          </group>
          {[-1, 1].map((side) => (
            <mesh key={side} ref={(el) => (chanRefs.current[i * 2 + (side > 0 ? 1 : 0)] = el)} position={[site.x + side * 0.45, MEM_Y, site.z]} material={mats.channel}>
              <cylinderGeometry args={[0.06, 0.06, 0.2, 10]} />
            </mesh>
          ))}
        </group>
      ))}
      <primitive object={reserveMesh} />
      <primitive object={ach} />
      <primitive object={ions} />

      {/* Postsynaptic muscle fiber */}
      <mesh geometry={geo.mem} material={mats.membrane} />
      <primitive object={receptorMesh} />
      <primitive object={fibrils} />

      {/* Toxin molecules: heavy chain (binding + translocation) and light chain (protease) */}
      {geo.tox.map((_, i) => (
        <group key={i}>
          <group ref={(el) => (hcRefs.current[i] = el)} visible={false}>
            <mesh position={[0, 0.22, 0]} material={mats.hc}>
              <capsuleGeometry args={[0.085, 0.34, 6, 12]} />
            </mesh>
            <mesh position={[0.05, 0.5, 0]} material={mats.hc}>
              <sphereGeometry args={[0.12, 16, 12]} />
            </mesh>
          </group>
          <mesh ref={(el) => (lcRefs.current[i] = el)} material={mats.lc} visible={false}>
            <icosahedronGeometry args={[0.1, 1]} />
          </mesh>
          <mesh ref={(el) => (bubRefs.current[i] = el)} material={mats.bubble} visible={false}>
            <sphereGeometry args={[1, 24, 16]} />
          </mesh>
        </group>
      ))}
      <primitive object={flashes} />

      <Label at={[2.9, 2.3, 0.6]} pos={[2.6, 3.9, 1.0]} text="Motor nerve ending" tone="nerve" show={(s) => s.t > 1 && s.t < 12.8} />
      <Label at={[0.9, 2.0, 0.6]} pos={[2.2, 2.7, 1.6]} text="Synaptic vesicles" sub="each packed with thousands of ACh" tone="ach" show={(s) => s.t > 4.4 && s.t < 12.8 && s.layers.vesicles} />
      <Label at={[2.45, 0.35, -0.2]} pos={[2.6, 1.4, 1.4]} text="Calcium channels" tone="nerve" show={(s) => s.t > 5 && s.t < 7.6} />
      <Label at={[2.7, -0.25, 1.3]} pos={[2.4, -1.4, 2.4]} text="ACh receptors" sub="on the muscle fiber" tone="ach" show={(s) => ((s.t > 7.6 && s.t < 12.8) || (s.t > 30.8 && s.t < 34.6)) && s.layers.receptors} />
      <Label at={[3.4, 0, 0.6]} pos={[2.6, 0.2, 2.6]} text="Synaptic cleft" sub="~50 nm wide in reality" show={(s) => s.t > 9.6 && s.t < 12.8} />
      <Label follow={() => tracked.hc} pos={[-0.7, 0.8, 0.3]} text="Botulinum toxin" sub="heavy chain + light chain" tone="toxin" show={(s) => s.t > 13.6 && s.t < 17.6} />
      <Label follow={() => tracked.lc} pos={[-0.5, 0.45, 0.3]} text="Light chain" sub="an enzyme" tone="toxin" show={(s) => s.t > 20.2 && s.t < 22.6} />
      <Label at={[-0.58, 0.47, -0.25]} pos={[-1.05, 0.15, 0.25]} text="SNAP-25" sub="cut" tone="snare" show={(s) => s.t > 22.6 && s.t < 26} />
      <Label at={[0.7, 1.05, 0.3]} pos={[2.6, 2.0, 1.4]} text="Vesicles can’t fuse" tone="toxin" show={(s) => s.t > 27.4 && s.t < 30.6} />
    </group>
  );
}
