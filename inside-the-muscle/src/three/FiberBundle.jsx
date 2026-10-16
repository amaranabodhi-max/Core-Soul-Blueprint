import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { useFrame, useThree } from '@react-three/fiber';
import { store, live, compareState } from '../store';
import { SCENES, effectAt } from '../scenes';
import { tube, curve, rng, hash, smooth } from './geometry';
import { fiberMaterial, fresnelMaterial, GlowPoints } from './materials';
import { Label, approach } from './common';

// ─────────────────────────────────────────────────────────────────────────────
//  A fascicle of skeletal muscle fibers (scenes 2 & 5).
//  Fibers belong to 5 intermingled motor units. Every unit has its own axon;
//  spikes travel down it and, at each fiber's neuromuscular junction (the
//  endplate band near mid-fiber), trigger an action potential and a twitch.
//  Twitches summate at higher firing rates (partial tetanus) → higher tone.
// ─────────────────────────────────────────────────────────────────────────────

const R = 2.3;
const LEN = 15;
const UNITS = 5;
const BIN = 0.04; // spike-lottery bin (s)
const TRAVEL = 0.55; // axon conduction time in this view (s)
const TWIG = 0.06;

function build() {
  const r = rng(11);
  const fibers = [];
  const gap = 0.6;
  for (let q = -6; q <= 6; q++) {
    for (let w = -6; w <= 6; w++) {
      const x = gap * (q + w / 2) + (r() - 0.5) * 0.08;
      const z = gap * (w * Math.sqrt(3) / 2) + (r() - 0.5) * 0.08;
      if (Math.hypot(x, z) > R) continue;
      fibers.push({ x, z, rad: 0.25 + r() * 0.05, unit: Math.floor(r() * UNITS), ey: (r() - 0.5) * 0.9, tilt: (r() - 0.5) * 0.04 });
    }
  }
  const split = new THREE.Vector3(R + 1.7, 0.25, 0.4);
  const trunk = [new THREE.Vector3(R + 8, 3.2, 2.6), new THREE.Vector3(R + 4.2, 1.2, 1.4), split];
  const hubs = [];
  for (let u = 0; u < UNITS; u++) {
    const a = -0.85 + u * 0.42;
    hubs.push(new THREE.Vector3((R + 0.75) * Math.cos(a), (u - 2) * 0.32, (R + 0.75) * Math.sin(a) + 0.5));
  }
  const unitPaths = hubs.map((h) => new THREE.CatmullRomCurve3([...trunk, h.clone().lerp(split, 0.45).add(new THREE.Vector3(0, 0.15, 0)), h]));
  const twigGeos = Array.from({ length: UNITS }, () => []);
  const plates = [];
  fibers.forEach((f, i) => {
    const h = hubs[f.unit];
    const dir = new THREE.Vector3(h.x - f.x, 0, h.z - f.z).normalize();
    const p = new THREE.Vector3(f.x + dir.x * f.rad, f.ey, f.z + dir.z * f.rad);
    plates.push({ p, dir });
    const mid = h.clone().lerp(p, 0.5).add(new THREE.Vector3(0, 0.25 * Math.sin(i), 0));
    twigGeos[f.unit].push(tube(curve([h.toArray(), mid.toArray(), p.toArray()]), 0.022, 16, 5));
  });
  const twigs = twigGeos.map((list) => mergeGeometries(list));
  const trunkGeo = tube(new THREE.CatmullRomCurve3(trunk), 0.17, 60, 12);
  const axonGeos = unitPaths.map((c) => {
    const pts = c.points.slice(2); // from the split onwards
    return tube(new THREE.CatmullRomCurve3(pts), 0.065, 30, 8);
  });
  const caps = [];
  for (let i = 0; i < 5; i++) {
    const a0 = r() * Math.PI * 2;
    const pts = [];
    for (let k = 0; k <= 12; k++) {
      const y = -LEN / 2 + (k / 12) * LEN;
      const a = a0 + k * 0.35 * (i % 2 ? 1 : -1);
      pts.push([(R + 0.12) * Math.cos(a), y, (R + 0.12) * Math.sin(a)]);
    }
    caps.push(tube(pts, 0.028, 120, 6));
  }
  return { fibers, hubs, unitPaths, twigs, plates, trunkGeo, axonGeos, caps: mergeGeometries(caps) };
}

// Firing rate (Hz) of each motor unit's axon at scene time t.
function stretchCurve(ev, t) {
  if (!ev) return { x: 0, v: 0 };
  const quick = ev.kind === 'quick';
  const up = quick ? 0.3 : 2.2;
  const hold = quick ? 1.2 : 0.6;
  const down = quick ? 0.7 : 0.9;
  const amp = 0.14;
  const tt = t - ev.at;
  if (tt < 0 || tt > up + hold + down) return { x: 0, v: 0 };
  if (tt < up) return { x: amp * smooth(0, up, tt), v: amp / up };
  if (tt < up + hold) return { x: amp, v: 0 };
  return { x: amp * (1 - smooth(up + hold, up + hold + down, tt)), v: 0 };
}

export function FiberBundle({ mode }) {
  const geo = useMemo(build, []);
  const compare = mode === 'compare';
  const n = geo.fibers.length;
  const { size, gl } = useThree();
  const cfg = SCENES[compare ? 4 : 1];

  const fibers = useMemo(() => {
    const g = new THREE.CylinderGeometry(1, 1, LEN, 22, 90, true);
    const state = new THREE.InstancedBufferAttribute(new Float32Array(n * 3), 3);
    g.setAttribute('aState', state);
    const m = new THREE.InstancedMesh(g, fiberMaterial(), n);
    const d = new THREE.Object3D();
    geo.fibers.forEach((f, i) => {
      d.position.set(f.x, 0, f.z);
      d.rotation.set(f.tilt, 0, -f.tilt);
      d.scale.set(f.rad, 1, f.rad);
      d.updateMatrix();
      m.setMatrixAt(i, d.matrix);
    });
    m.frustumCulled = false;
    return m;
  }, [geo, n]);

  const plates = useMemo(() => {
    const m = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 14, 10), new THREE.MeshBasicMaterial({ toneMapped: false }), n);
    const d = new THREE.Object3D();
    geo.plates.forEach(({ p, dir }, i) => {
      d.position.copy(p);
      d.lookAt(p.clone().add(dir));
      d.scale.set(0.15, 0.2, 0.055);
      d.updateMatrix();
      m.setMatrixAt(i, d.matrix);
      m.setColorAt(i, new THREE.Color('#ffc65c'));
    });
    return m;
  }, [geo, n]);

  const mats = useMemo(
    () => ({
      sheath: fresnelMaterial({ color: '#ffb6c8', rim: '#ff9ab8', opacity: 0.015, power: 2.0, intensity: 0.7, side: THREE.DoubleSide }),
      trunk: new THREE.MeshStandardMaterial({ color: '#ffd166', emissive: '#ffae1a', emissiveIntensity: 0.8, roughness: 0.4, transparent: true }),
      axon: new THREE.MeshStandardMaterial({ color: '#ffd98a', emissive: '#ffb020', emissiveIntensity: 1.0, roughness: 0.4, transparent: true }),
      twigs: Array.from({ length: UNITS }, () => new THREE.MeshBasicMaterial({ color: '#ffcf70', transparent: true, toneMapped: false })),
      caps: new THREE.MeshStandardMaterial({ color: '#c41f3a', emissive: '#6d0716', emissiveIntensity: 0.9, roughness: 0.35, transparent: true }),
    }),
    []
  );

  const dots = useMemo(() => new GlowPoints(UNITS * 18), []);
  const group = useRef();
  const fades = useRef({ sheath: 1, nerves: 1, vessels: 1 });
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const gold = useMemo(() => new THREE.Color('#fff0b8'), []);
  const plateOn = useMemo(() => new THREE.Color(), []);
  const cGold = useMemo(() => new THREE.Color('#ffc65c'), []);
  const cHot = useMemo(() => new THREE.Color('#fff4d0'), []);
  const cBlock = useMemo(() => new THREE.Color('#8a5cff'), []);

  useFrame((_, delta) => {
    const s = store.get();
    const t = s.t;
    const dt = s.dt || (s.playing ? 0 : delta);
    const f = fades.current;
    f.sheath = approach(f.sheath, s.layers.sheath ? 1 : 0, dt, 6);
    f.nerves = approach(f.nerves, s.layers.nerves ? 1 : 0, dt, 6);
    f.vessels = approach(f.vessels, s.layers.vessels ? 1 : 0, dt, 6);

    // ── Physiology parameters for this moment ──
    let spastic;
    let block = 0;
    let ev = null;
    if (compare) {
      spastic = 1;
      const cs = compareState(s);
      block = cs.treated ? effectAt(cs.week) : 0;
    } else {
      spastic = smooth(8.6, 12.2, t);
      // most recent stretch (scripted or user-triggered)
      for (const e of cfg.stretches) if (t >= e.at) ev = e;
      if (s.stretch && t >= s.stretch.at && (!ev || s.stretch.at > ev.at)) ev = s.stretch;
    }
    const st = stretchCurve(ev, t);
    const gain = 0.22 + 0.78 * spastic; // reflex gain rises when descending inhibition is lost
    const base = compare ? 7.0 : 0.6 + 6.4 * spastic;
    const reflexRate = 210 * st.v * gain; // velocity-dependent drive
    const rateAt = (time) => {
      const sv = compare ? null : stretchCurve(ev, time);
      const rr = compare ? 0 : 210 * sv.v * gain;
      return base + rr;
    };

    // ── Spikes: deterministic lottery per unit per bin ──
    let sumC = 0;
    let dotI = 0;
    const unitC = new Array(UNITS).fill(0);
    const unitLast = new Array(UNITS).fill(-99);
    const kNow = Math.floor(t / BIN);
    const kFrom = Math.floor((t - 1.8) / BIN);
    for (let u = 0; u < UNITS; u++) {
      let sum = 0;
      for (let k = Math.max(0, kFrom); k <= kNow; k++) {
        const tb = k * BIN;
        const p = Math.min(0.92, rateAt(tb) * BIN * (0.75 + 0.5 * hash(u * 31 + 7)));
        if (hash(k * 7.13 + u * 101.7 + (compare ? 500 : 0)) >= p) continue;
        const dep = tb + hash(k * 3.1 + u) * BIN; // departs the top of the nerve
        const arr = dep + TRAVEL;
        if (dep <= t && t < arr && dotI < dots.capacity) {
          geo.unitPaths[u].getPointAt((t - dep) / TRAVEL, tmp);
          dots.set(dotI++, tmp.x, tmp.y, tmp.z, 0.28, f.nerves, gold);
        }
        const fire = arr + TWIG;
        if (fire <= t) {
          const tt = t - fire;
          sum += Math.min(1, tt / 0.07) * Math.exp(-Math.max(0, tt - 0.07) * 3.2) * 0.36;
          unitLast[u] = fire;
        }
      }
      unitC[u] = 1 - Math.exp(-sum * 1.6);
    }
    for (let i = dotI; i < dots.capacity; i++) dots.set(i, 0, -999, 0, 0, 0);
    dots.commit(size.height * gl.getPixelRatio() * 0.5);

    // ── Fibers ──
    const arr = fibers.geometry.attributes.aState.array;
    for (let i = 0; i < n; i++) {
      const fb = geo.fibers[i];
      const blocked = hash(i * 17.3 + 3) < block ? 1 : 0;
      const c = blocked ? 0.02 : unitC[fb.unit];
      const since = blocked ? 99 : t - unitLast[fb.unit];
      arr[i * 3] = c;
      arr[i * 3 + 1] = since;
      arr[i * 3 + 2] = blocked * (compare ? 1 : 0);
      sumC += c;
      const flash = blocked ? 0 : Math.exp(-Math.max(0, since) * 6);
      plateOn.copy(blocked ? cBlock : cGold).lerp(cHot, flash * 0.9).multiplyScalar(blocked ? 0.9 : 1 + flash * 1.6);
      plates.setColorAt(i, plateOn);
    }
    fibers.geometry.attributes.aState.needsUpdate = true;
    plates.instanceColor.needsUpdate = true;

    for (let u = 0; u < UNITS; u++) {
      const fl = Math.exp(-Math.max(0, t - unitLast[u]) * 7);
      mats.twigs[u].color.set('#c99a3c').lerp(cHot, fl);
      mats.twigs[u].opacity = f.nerves * (0.75 + 0.25 * fl);
      mats.twigs[u].visible = f.nerves > 0.01;
    }
    mats.trunk.opacity = mats.axon.opacity = f.nerves;
    mats.trunk.visible = mats.axon.visible = plates.visible = f.nerves > 0.01;
    mats.caps.opacity = f.vessels;
    mats.caps.visible = f.vessels > 0.01;
    mats.sheath.uniforms.uFade.value = f.sheath;

    // Passive stretch lengthens the bundle; reflex contraction fights it.
    const meanC = sumC / n;
    if (group.current) group.current.scale.y = 1 + st.x * (1 - 0.45 * meanC);
    live.activity = meanC;
    live.stretch = st.x;
    live.resistance = st.x > 0.001 ? meanC : 0;
    live.reflex = reflexRate;
    live.block = block;
  });

  return (
    <group>
      <group ref={group}>
        <primitive object={fibers} />
        <mesh material={mats.sheath} renderOrder={8}>
          <cylinderGeometry args={[R + 0.32, R + 0.32, LEN, 72, 1, true]} />
        </mesh>
        <mesh geometry={geo.caps} material={mats.caps} />
      </group>
      <primitive object={plates} />
      <mesh geometry={geo.trunkGeo} material={mats.trunk} />
      {geo.axonGeos.map((g, i) => (
        <mesh key={i} geometry={g} material={mats.axon} />
      ))}
      {geo.twigs.map((g, i) => (
        <mesh key={i} geometry={g} material={mats.twigs[i]} />
      ))}
      <primitive object={dots} />

      <Label at={[-1.0, 3.6, 2.05]} pos={[-1.5, 4.4, 2.6]} text="Muscle fibers" sub="striped by sarcomeres" tone="muscle" show={(s) => s.t > 1} />
      <Label at={[R + 4.2, 1.2, 1.4]} pos={[3.6, 2.9, 1.2]} text="Motor nerve" tone="nerve" show={(s) => s.t > 2 && s.layers.nerves} />
      <Label at={[geo.plates[0].p.x, geo.plates[0].p.y, geo.plates[0].p.z]} pos={[2.6, -1.8, 1.8]} text="Neuromuscular junctions" sub={compare ? 'violet = blocked' : 'where nerve meets fiber'} tone="nerve" show={(s) => (compare ? s.t > 5 : s.t > 3.2) && s.layers.nerves} />
      <Label at={[-(R + 0.12) * 0.6, -4.2, (R + 0.12) * 0.8]} pos={[0.8, -4.6, 2.4]} text="Capillary" show={(s) => !compare && s.t > 5 && s.t < 12 && s.layers.vessels} />
    </group>
  );
}
