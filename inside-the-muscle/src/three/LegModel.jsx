import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { store } from '../store';
import { limbGeometry, tube, curve, rng, smooth } from './geometry';
import { fresnelMaterial, striationTexture, GlowPoints } from './materials';
import { Label, approach } from './common';

// ─────────────────────────────────────────────────────────────────────────────
//  Stylized RIGHT lower leg, viewed from behind by default.
//  Units ≈ 4.5 cm. +Y up, +Z posterior (calf), −X medial.
//  Proportions and relations follow standard anatomy, but the shapes are
//  procedural: an educational illustration, not a patient-accurate model.
// ─────────────────────────────────────────────────────────────────────────────

const SKIN = [
  { y: 4.7, rx: 0.98, rz: 0.96, cz: 0 },
  { y: 3.9, rx: 0.93, rz: 0.86, cz: -0.02 },
  { y: 3.05, rx: 0.88, rz: 0.86, cz: 0.04 },
  { y: 2.4, rx: 0.82, rz: 0.84, cz: 0.1, b: 0.2, ba: 1.75 },
  { y: 1.6, rx: 0.82, rz: 0.84, cz: 0.16, b: 0.36, ba: 1.8 },
  { y: 0.8, rx: 0.73, rz: 0.73, cz: 0.13, b: 0.3, ba: 1.75 },
  { y: 0.0, rx: 0.6, rz: 0.55, cz: 0.05, b: 0.15 },
  { y: -1.0, rx: 0.48, rz: 0.44, cz: 0, b: 0.05 },
  { y: -2.0, rx: 0.41, rz: 0.39, cz: 0 },
  { y: -2.8, rx: 0.45, rz: 0.41, cz: 0 },
  { y: -3.35, rx: 0.47, rz: 0.52, cz: -0.08 },
];
// Foot built along its length (heel → toes), then rotated to point forward (−Z).
const FOOT = [
  { y: -0.82, rx: 0.02, rz: 0.02, cz: 0.36 },
  { y: -0.72, rx: 0.34, rz: 0.36, cz: 0.4 },
  { y: -0.3, rx: 0.42, rz: 0.52, cz: 0.52 },
  { y: 0.4, rx: 0.45, rz: 0.5, cz: 0.5 },
  { y: 1.4, rx: 0.55, rz: 0.33, cz: 0.33 },
  { y: 2.3, rx: 0.62, rz: 0.22, cz: 0.22 },
  { y: 2.95, rx: 0.56, rz: 0.17, cz: 0.17 },
  { y: 3.22, rx: 0.08, rz: 0.04, cz: 0.12 },
];
const FEMUR = [
  { y: 4.9, rx: 0.3, rz: 0.3, cz: -0.1 },
  { y: 4.0, rx: 0.36, rz: 0.36, cz: -0.1 },
  { y: 3.45, rx: 0.72, rz: 0.56, cz: -0.05 },
  { y: 3.12, rx: 0.68, rz: 0.52, cz: 0 },
  { y: 3.05, rx: 0.02, rz: 0.02, cz: 0 },
];
const TIBIA = [
  { y: 2.98, rx: 0.02, rz: 0.02, cx: -0.05, cz: -0.15 },
  { y: 2.95, rx: 0.64, rz: 0.48, cx: -0.05, cz: -0.15 },
  { y: 2.55, rx: 0.46, rz: 0.38, cx: -0.12, cz: -0.22 },
  { y: 1.9, rx: 0.27, rz: 0.27, cx: -0.2, cz: -0.3 },
  { y: 0.0, rx: 0.2, rz: 0.23, cx: -0.24, cz: -0.32 },
  { y: -2.2, rx: 0.22, rz: 0.22, cx: -0.24, cz: -0.28 },
  { y: -2.75, rx: 0.32, rz: 0.29, cx: -0.2, cz: -0.22 },
  { y: -3.05, rx: 0.3, rz: 0.24, cx: -0.2, cz: -0.2 },
  { y: -3.1, rx: 0.02, rz: 0.02, cx: -0.2, cz: -0.2 },
];
const FIBULA = [
  { y: 2.68, rx: 0.02, rz: 0.02, cx: 0.5, cz: -0.06 },
  { y: 2.6, rx: 0.15, rz: 0.15, cx: 0.5, cz: -0.06 },
  { y: 2.25, rx: 0.09, rz: 0.09, cx: 0.48, cz: -0.08 },
  { y: 0, rx: 0.08, rz: 0.09, cx: 0.44, cz: -0.06 },
  { y: -2.5, rx: 0.09, rz: 0.09, cx: 0.4, cz: -0.08 },
  { y: -3.1, rx: 0.13, rz: 0.12, cx: 0.4, cz: -0.08 },
  { y: -3.28, rx: 0.02, rz: 0.02, cx: 0.4, cz: -0.08 },
];
const SOLEUS = [
  { y: 2.6, rx: 0.02, rz: 0.02, cx: 0.2, cz: 0.12 },
  { y: 2.45, rx: 0.36, rz: 0.12, cx: 0.15, cz: 0.15 },
  { y: 1.6, rx: 0.58, rz: 0.24, cx: 0.04, cz: 0.3 },
  { y: 0.4, rx: 0.55, rz: 0.24, cx: 0.0, cz: 0.36 },
  { y: -0.6, rx: 0.4, rz: 0.17, cx: 0.0, cz: 0.36 },
  { y: -1.4, rx: 0.16, rz: 0.08, cx: 0.0, cz: 0.36 },
  { y: -1.6, rx: 0.02, rz: 0.02, cx: 0.0, cz: 0.36 },
];
const GASTRO_MED = [
  { y: 3.62, rx: 0.02, rz: 0.02, cx: -0.36, cz: 0.12 },
  { y: 3.5, rx: 0.1, rz: 0.1, cx: -0.36, cz: 0.16 },
  { y: 3.0, rx: 0.22, rz: 0.2, cx: -0.32, cz: 0.45 },
  { y: 2.2, rx: 0.33, rz: 0.3, cx: -0.27, cz: 0.62 },
  { y: 1.3, rx: 0.32, rz: 0.3, cx: -0.22, cz: 0.66 },
  { y: 0.5, rx: 0.2, rz: 0.15, cx: -0.14, cz: 0.6 },
  { y: -0.1, rx: 0.04, rz: 0.04, cx: -0.08, cz: 0.55 },
];
const GASTRO_LAT = [
  { y: 3.62, rx: 0.02, rz: 0.02, cx: 0.36, cz: 0.12 },
  { y: 3.5, rx: 0.1, rz: 0.1, cx: 0.36, cz: 0.15 },
  { y: 3.0, rx: 0.2, rz: 0.18, cx: 0.31, cz: 0.42 },
  { y: 2.2, rx: 0.28, rz: 0.26, cx: 0.27, cz: 0.58 },
  { y: 1.5, rx: 0.25, rz: 0.24, cx: 0.22, cz: 0.6 },
  { y: 0.9, rx: 0.14, rz: 0.1, cx: 0.14, cz: 0.56 },
  { y: 0.5, rx: 0.03, rz: 0.03, cx: 0.1, cz: 0.53 },
];
const ANTERIOR = [
  { y: 2.7, rx: 0.02, rz: 0.02, cx: 0.15, cz: -0.4 },
  { y: 2.5, rx: 0.24, rz: 0.18, cx: 0.15, cz: -0.42 },
  { y: 1.2, rx: 0.3, rz: 0.24, cx: 0.17, cz: -0.42 },
  { y: -0.6, rx: 0.2, rz: 0.17, cx: 0.12, cz: -0.42 },
  { y: -2.2, rx: 0.08, rz: 0.06, cx: 0.0, cz: -0.42 },
  { y: -2.5, rx: 0.02, rz: 0.02, cx: 0.0, cz: -0.42 },
];

// Nerve paths
const TIBIAL_N = [
  [0.05, 4.9, 0.36], [0.03, 3.8, 0.38], [0.0, 3.05, 0.32], [-0.04, 2.4, 0.16],
  [-0.1, 1.2, 0.04], [-0.17, 0.0, 0.0], [-0.27, -1.5, 0.02], [-0.42, -2.65, 0.06], [-0.32, -3.35, 0.16],
];
const FIBULAR_N = [
  [0.05, 3.9, 0.38], [0.36, 3.1, 0.3], [0.64, 2.5, 0.04], [0.56, 2.2, -0.26], [0.4, 0.4, -0.5], [0.3, -2.0, -0.52],
];
const BR_MED = [[0.0, 3.1, 0.33], [-0.18, 2.9, 0.42], [-0.3, 2.55, 0.5]];
const BR_LAT = [[0.0, 3.1, 0.33], [0.16, 2.95, 0.4], [0.27, 2.6, 0.48]];
const BR_SOL = [[-0.04, 2.4, 0.16], [0.06, 2.0, 0.26], [0.08, 1.4, 0.32]];
const TWIGS = [
  [[-0.3, 2.55, 0.5], [-0.3, 2.3, 0.6], [-0.25, 1.95, 0.68], [-0.22, 1.6, 0.7]],
  [[-0.3, 2.3, 0.6], [-0.42, 2.1, 0.62], [-0.5, 1.85, 0.58]],
  [[-0.25, 1.95, 0.68], [-0.12, 1.8, 0.72], [-0.05, 1.55, 0.7]],
  [[-0.25, 1.95, 0.68], [-0.32, 1.7, 0.78], [-0.35, 1.45, 0.74]],
  [[-0.42, 2.1, 0.62], [-0.38, 2.0, 0.82], [-0.3, 1.9, 0.86]],
];
const ARTERY = [[-0.06, 4.9, 0.2], [-0.08, 3.05, 0.22], [-0.12, 2.3, 0.08], [-0.2, 0.0, -0.06], [-0.32, -1.6, -0.04], [-0.48, -2.7, 0.0]];
const ACHILLES = [[-0.04, 0.3, 0.52], [-0.02, -0.8, 0.42], [0.0, -2.2, 0.4], [0.0, -3.1, 0.52], [0.0, -3.55, 0.72]];

export const TOXIN_CENTER = new THREE.Vector3(-0.27, 1.88, 0.66);

let cache;
function build() {
  if (cache) return cache;
  const foot = limbGeometry(FOOT, { radial: 48, rings: 64 });
  foot.rotateX(-Math.PI / 2);
  foot.translate(0, -4.2, 0.05);
  const metatarsals = [];
  for (let i = 0; i < 5; i++) {
    const x = -0.36 + i * 0.18;
    const g = new THREE.CylinderGeometry(0.045, 0.055, 1.3, 10);
    g.rotateX(Math.PI / 2 - 0.22);
    g.translate(x, -3.82, -1.35 - Math.abs(i - 1) * 0.06);
    metatarsals.push(g);
  }
  const twigCurves = TWIGS.map((p) => curve(p));
  cache = {
    skin: limbGeometry(SKIN, { radial: 72, rings: 140 }),
    foot,
    femur: limbGeometry(FEMUR, { radial: 36, rings: 40 }),
    tibia: limbGeometry(TIBIA, { radial: 36, rings: 90 }),
    fibula: limbGeometry(FIBULA, { radial: 20, rings: 80 }),
    soleus: limbGeometry(SOLEUS, { radial: 48, rings: 80 }),
    gastroMed: limbGeometry(GASTRO_MED, { radial: 48, rings: 80 }),
    gastroLat: limbGeometry(GASTRO_LAT, { radial: 48, rings: 80 }),
    anterior: limbGeometry(ANTERIOR, { radial: 36, rings: 60 }),
    achilles: tube(ACHILLES, 0.1, 80, 12),
    metatarsals,
    nerveCurves: {
      tibial: curve(TIBIAL_N),
      fibular: curve(FIBULAR_N),
      med: curve(BR_MED),
      lat: curve(BR_LAT),
      sol: curve(BR_SOL),
    },
    tibialN: tube(TIBIAL_N, 0.055, 160, 10),
    fibularN: tube(FIBULAR_N, 0.04, 120, 8),
    branches: [BR_MED, BR_LAT, BR_SOL].map((b) => tube(b, 0.022, 40, 6)),
    twigs: twigCurves.map((c) => tube(c, 0.011, 30, 5)),
    twigCurves,
    artery: tube(ARTERY, 0.035, 120, 8),
  };
  return cache;
}

export function LegModel({ mode }) {
  const geo = useMemo(build, []);
  const treat = mode === 'treat';
  const { size, gl } = useThree();

  const mats = useMemo(() => {
    const tex = striationTexture();
    const muscle = (color, emissive) =>
      new THREE.MeshStandardMaterial({ color, map: tex, roughness: 0.42, metalness: 0.05, emissive, emissiveMap: tex, emissiveIntensity: 0.12, transparent: true });
    return {
      skin: fresnelMaterial({ color: '#d9a089', rim: '#ffd8c6', opacity: 0.035, power: 2.6, intensity: 1.1, solid: treat ? 0 : 1 }),
      bone: new THREE.MeshStandardMaterial({ color: '#efe4cf', roughness: 0.55, emissive: '#3b2f22', emissiveIntensity: 0.35, transparent: true }),
      gastro: muscle('#c63a4f', '#ff3048'),
      soleus: muscle('#a8303f', '#ff3048'),
      anterior: muscle('#7a2738', '#ff3048'),
      tendon: new THREE.MeshStandardMaterial({ color: '#f3e9dc', roughness: 0.3, emissive: '#4a3b2c', emissiveIntensity: 0.4, transparent: true }),
      nerve: new THREE.MeshStandardMaterial({ color: '#ffd166', emissive: '#ffb020', emissiveIntensity: 1.1, roughness: 0.35, transparent: true }),
      twig: new THREE.MeshStandardMaterial({ color: '#ffe08a', emissive: '#ffc040', emissiveIntensity: 1.6, roughness: 0.35, transparent: true }),
      artery: new THREE.MeshStandardMaterial({ color: '#d2283d', emissive: '#7a0a1a', emissiveIntensity: 0.7, roughness: 0.4, transparent: true }),
      halo: fresnelMaterial({ color: '#000000', rim: '#c58bff', opacity: 0, power: 1.6, intensity: 2.2, additive: true }),
    };
  }, [treat]);

  const impulses = useMemo(() => new GlowPoints(26), []);
  const cloud = useMemo(() => {
    const n = 460;
    const p = new GlowPoints(n);
    const r = rng(7);
    const violet = new THREE.Color('#b77dff');
    const pink = new THREE.Color('#ff7ad9');
    p.seeds = [];
    for (let i = 0; i < n; i++) {
      // random point inside a unit sphere
      let x, y, z;
      do {
        x = r() * 2 - 1; y = r() * 2 - 1; z = r() * 2 - 1;
      } while (x * x + y * y + z * z > 1);
      const tw = geo.twigCurves[i % geo.twigCurves.length].getPointAt(0.15 + r() * 0.85);
      tw.x += (r() - 0.5) * 0.05; tw.y += (r() - 0.5) * 0.05; tw.z += (r() - 0.5) * 0.05;
      p.seeds.push({ d: new THREE.Vector3(x, y, z), tw, ph: r() * 6.28, size: 0.05 + r() * 0.09 });
      p.set(i, 0, 0, 0, 0, 0, r() < 0.7 ? violet : pink);
    }
    p.commit();
    return p;
  }, [geo]);

  const fades = useRef({ skin: 1, bones: 1, muscles: 1, nerves: 1 });
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const gold = useMemo(() => new THREE.Color('#ffe6a0'), []);

  useFrame((_, delta) => {
    const s = store.get();
    const t = s.t;
    const dt = s.dt || (s.playing ? 0 : delta);
    const f = fades.current;
    for (const k of ['skin', 'bones', 'muscles', 'nerves']) f[k] = approach(f[k], s.layers[k] ? 1 : 0, dt, 6);

    // Skin: opaque → x-ray glass during scene 1; glass throughout scene 3.
    const solid = treat ? 0 : 1 - smooth(1.4, 4.8, t);
    const sk = mats.skin.uniforms;
    sk.uSolid.value = solid;
    sk.uFade.value = f.skin;
    mats.skin.depthWrite = solid > 0.97 && f.skin > 0.97;

    const reveal = treat ? 1 : smooth(2.0, 5.0, t);
    const setOp = (m, o) => {
      m.opacity = o;
      m.transparent = o < 0.995;
      m.depthWrite = o > 0.6;
      m.visible = o > 0.01;
    };
    setOp(mats.bone, f.bones * (treat ? 0.45 : 1));
    setOp(mats.tendon, f.muscles * (treat ? 0.55 : 1));
    // In scene 3 the chosen muscle turns glassy so the toxin and nerve endings inside are visible.
    setOp(mats.gastro, f.muscles * (treat ? 1 - 0.68 * smooth(6.6, 8.4, t) : 1));
    setOp(mats.soleus, f.muscles * (treat ? 0.3 : 1));
    setOp(mats.anterior, f.muscles * (treat ? 0.15 : 0.7));
    setOp(mats.nerve, f.nerves);
    setOp(mats.artery, f.nerves * (treat ? 0.35 : 0.9));

    // Muscles breathe gently with resting tone; in scene 3 the chosen muscle is highlighted.
    const breathe = 0.5 + 0.5 * Math.sin(s.clock * 1.6);
    mats.gastro.emissiveIntensity = 0.1 + 0.06 * breathe * reveal;
    mats.soleus.emissiveIntensity = 0.08 + 0.05 * breathe * reveal;
    const select = treat ? smooth(3.8, 5.2, t) * (1 - 0.6 * smooth(10, 12, t)) : 0;
    mats.halo.uniforms.uIntensity.value = select * (1.4 + 0.8 * Math.sin(s.clock * 3.2)) * f.muscles;
    mats.halo.visible = select > 0.01;

    // Intramuscular nerve twigs light up as the toxin heads for them.
    const twigGlow = treat ? 0.25 + smooth(10.8, 12.5, t) * 1.0 : 0.25;
    setOp(mats.twig, f.nerves * (treat ? 0.5 + 0.5 * smooth(9, 11, t) : 0.6));
    mats.twig.emissiveIntensity = 0.8 + twigGlow * 2.2;

    // Nerve impulses travelling down the tibial nerve into the calf.
    const C = geo.nerveCurves;
    const paths = [C.tibial, C.tibial, C.med, C.lat, C.sol, C.tibial, C.med];
    for (let i = 0; i < impulses.capacity; i++) {
      const path = paths[i % paths.length];
      const speed = path === C.tibial ? 0.16 : 0.5;
      const u = (s.clock * speed + i * 0.137) % 1;
      path.getPointAt(u, tmp);
      const a = Math.sin(Math.PI * u) * f.nerves * (treat ? 0.5 : 1) * reveal;
      impulses.set(i, tmp.x, tmp.y, tmp.z, 0.16, a * 0.95, gold);
    }
    const scale = size.height * gl.getPixelRatio() * 0.5;
    impulses.commit(scale);

    // Toxin cloud (scene 3): appears inside the muscle, spreads locally, then gathers on nerve endings.
    const appear = treat ? smooth(7.6, 8.8, t) : 0;
    const spread = 0.12 + 0.88 * smooth(7.8, 11.5, t);
    const gather = smooth(11.0, 14.2, t) * 0.85;
    cloud.visible = appear > 0.001;
    if (cloud.visible) {
      for (let i = 0; i < cloud.capacity; i++) {
        const sd = cloud.seeds[i];
        tmp.set(sd.d.x * 0.3, sd.d.y * 0.62, sd.d.z * 0.26).multiplyScalar(spread).add(TOXIN_CENTER);
        tmp.x += Math.sin(s.clock * 0.9 + sd.ph) * 0.02;
        tmp.y += Math.cos(s.clock * 0.7 + sd.ph) * 0.02;
        tmp.lerp(sd.tw, gather);
        const a = appear * (0.55 + 0.45 * Math.sin(s.clock * 2 + sd.ph));
        cloud.set(i, tmp.x, tmp.y, tmp.z, sd.size, a);
      }
      cloud.commit(scale);
    }
  });

  return (
    <group>
      {/* Bones */}
      <mesh geometry={geo.femur} material={mats.bone} />
      <mesh geometry={geo.tibia} material={mats.bone} />
      <mesh geometry={geo.fibula} material={mats.bone} />
      <mesh position={[0, 3.15, -0.68]} scale={[0.3, 0.36, 0.14]} material={mats.bone}>
        <sphereGeometry args={[1, 24, 16]} />
      </mesh>
      <mesh position={[-0.08, -3.42, -0.12]} scale={[0.36, 0.22, 0.42]} material={mats.bone}>
        <sphereGeometry args={[1, 24, 16]} />
      </mesh>
      <mesh position={[0, -3.86, 0.36]} scale={[0.27, 0.3, 0.55]} material={mats.bone}>
        <sphereGeometry args={[1, 24, 16]} />
      </mesh>
      {geo.metatarsals.map((g, i) => (
        <mesh key={i} geometry={g} material={mats.bone} />
      ))}

      {/* Muscles & tendon */}
      <mesh geometry={geo.anterior} material={mats.anterior} />
      <mesh geometry={geo.soleus} material={mats.soleus} />
      <mesh geometry={geo.gastroMed} material={mats.gastro} />
      <mesh geometry={geo.gastroLat} material={mats.gastro} />
      <mesh geometry={geo.gastroMed} material={mats.halo} scale={1.0} renderOrder={6} />
      <mesh geometry={geo.gastroLat} material={mats.halo} renderOrder={6} />
      <mesh geometry={geo.achilles} material={mats.tendon} />

      {/* Nerves & vessels */}
      <mesh geometry={geo.tibialN} material={mats.nerve} />
      <mesh geometry={geo.fibularN} material={mats.nerve} />
      {geo.branches.map((g, i) => (
        <mesh key={i} geometry={g} material={mats.nerve} />
      ))}
      {geo.twigs.map((g, i) => (
        <mesh key={i} geometry={g} material={mats.twig} />
      ))}
      <mesh geometry={geo.artery} material={mats.artery} />
      <primitive object={impulses} />
      <primitive object={cloud} />

      {/* Skin last so it layers over everything */}
      <mesh geometry={geo.skin} material={mats.skin} renderOrder={10} />
      <mesh geometry={geo.foot} material={mats.skin} renderOrder={10} />

      {!treat ? (
        <>
          <Label at={[-0.32, -0.9, -0.3]} pos={[-1.1, -1.35, 0.3]} text="Tibia" sub="shin bone" show={(s) => s.t > 7 && s.layers.bones} />
          <Label at={[0.44, -0.4, -0.06]} pos={[1.1, -0.8, 0.2]} text="Fibula" show={(s) => s.t > 7.4 && s.layers.bones} />
          <Label at={[-0.45, 2.1, 0.82]} pos={[-1.1, 2.85, 0.8]} text="Gastrocnemius" sub="medial & lateral heads" tone="muscle" show={(s) => s.t > 9.9 && s.layers.muscles} />
          <Label at={[0.5, 0.7, 0.5]} pos={[1.15, 1.0, 0.6]} text="Soleus" tone="muscle" show={(s) => s.t > 10.6 && s.layers.muscles} />
          <Label at={[0.0, -1.9, 0.5]} pos={[1.05, -2.45, 0.5]} text="Achilles tendon" show={(s) => s.t > 11.3 && s.layers.muscles} />
          <Label at={[0.0, 3.05, 0.34]} pos={[0.95, 3.75, 0.6]} text="Tibial nerve" tone="nerve" show={(s) => s.t > 13.9 && s.layers.nerves} />
        </>
      ) : (
        <>
          <Label at={[-0.5, 2.3, 0.8]} pos={[-0.85, 3.05, 0.9]} text="Muscle chosen by the specialist" sub="here: gastrocnemius" tone="toxin" show={(s) => s.t > 4.2 && s.t < 10.6} />
          <Label at={[-0.05, 1.55, 0.7]} pos={[0.95, 1.2, 0.9]} text="Motor nerve endings" tone="nerve" show={(s) => s.t > 11.4} />
          <Label at={[-0.27, 1.6, 0.7]} pos={[-0.95, 1.25, 0.9]} text="Botulinum toxin" sub="conceptual view" tone="toxin" show={(s) => s.t > 8.4 && s.t < 11} />
        </>
      )}
    </group>
  );
}
