import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree, advance } from '@react-three/fiber';
import { OrbitControls, Environment, Lightformer } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing';
import { store, useStore, actions, CAPTURE, FPS } from '../store';
import { SCENES } from '../scenes';
import { LegModel } from './LegModel';
import { FiberBundle } from './FiberBundle';
import { Synapse } from './Synapse';
import { Dust } from './common';

const WORLD_LOOK = {
  leg: { bg: '#04060f', dust: '#9fc3ff', dustSpread: 30 },
  fibers: { bg: '#0b0410', dust: '#ffb3c6', dustSpread: 26 },
  synapse: { bg: '#05040d', dust: '#9ff0ff', dustSpread: 22 },
};

/** Advances the screenplay clock (real time, or fixed steps when capturing). */
function Director() {
  useFrame((_, delta) => {
    if (!CAPTURE) actions.tick(Math.min(delta, 1 / 20));
  }, -3);
  return null;
}

/** Exposes a frame-stepper so scripts/capture.mjs can record a perfect video. */
function CaptureBridge() {
  useEffect(() => {
    if (!CAPTURE) return;
    const raf = () => new Promise((r) => requestAnimationFrame(() => r()));
    window.__ITM = {
      ready: true,
      async step() {
        actions.tick(1 / FPS);
        await new Promise((r) => setTimeout(r, 0));
        advance(performance.now());
        await raf();
      },
      done: () => store.get().filmDone,
      state: () => ({ scene: store.get().scene, t: store.get().t }),
    };
  }, []);
  return null;
}

const v1 = new THREE.Vector3();
const v2 = new THREE.Vector3();
const v3 = new THREE.Vector3();
function cr(a, b, c, d, t, out) {
  const t2 = t * t;
  const t3 = t2 * t;
  for (let i = 0; i < 3; i++) {
    out.setComponent(i, 0.5 * (2 * b[i] + (-a[i] + c[i]) * t + (2 * a[i] - 5 * b[i] + 4 * c[i] - d[i]) * t2 + (-a[i] + 3 * b[i] - 3 * c[i] + d[i]) * t3));
  }
  return out;
}
/** Camera position & target from the scene's keyframes (Catmull-Rom, eased ends). */
function sampleCamera(keys, t, outP, outL) {
  const n = keys.length;
  let i = 0;
  while (i < n - 2 && t > keys[i + 1][0]) i++;
  const [t0] = keys[i];
  const [t1] = keys[i + 1];
  let u = Math.min(1, Math.max(0, (t - t0) / (t1 - t0)));
  if (i === 0 || i === n - 2) u = u * u * (3 - 2 * u) * 0.5 + u * 0.5;
  const k = (j) => keys[Math.max(0, Math.min(n - 1, j))];
  cr(k(i - 1)[1], k(i)[1], k(i + 1)[1], k(i + 2)[1], u, outP);
  cr(k(i - 1)[2], k(i)[2], k(i + 1)[2], k(i + 2)[2], u, outL);
}

function CameraRig() {
  const { camera, controls } = useThree();
  const last = useRef({ scene: -1, zoom: 0 });
  useFrame((_, delta) => {
    if (!controls) return;
    const s = store.get();
    const cfg = SCENES[s.scene];
    const frameDt = CAPTURE ? 1 / FPS : delta;
    controls.autoRotate = s.autoRotate;
    controls.autoRotateSpeed = 0.9;
    controls.minDistance = cfg.distance[0];
    controls.maxDistance = cfg.distance[1];

    if (s.zoomReq.n !== last.current.zoom) {
      last.current.zoom = s.zoomReq.n;
      v3.copy(camera.position).sub(controls.target).multiplyScalar(s.zoomReq.f);
      const len = THREE.MathUtils.clamp(v3.length(), cfg.distance[0], cfg.distance[1]);
      camera.position.copy(controls.target).add(v3.setLength(len));
    }

    sampleCamera(cfg.camera, s.t, v1, v2);
    // gentle "floating in fluid" drift
    v1.x += Math.sin(s.clock * 0.31) * 0.06;
    v1.y += Math.sin(s.clock * 0.23 + 1) * 0.05;
    if (last.current.scene !== s.scene) {
      last.current.scene = s.scene;
      camera.position.copy(v1);
      controls.target.copy(v2);
    } else if (s.guided) {
      const k = 1 - Math.exp(-frameDt * 3.2);
      camera.position.lerp(v1, k);
      controls.target.lerp(v2, k);
    }
  }, -2);
  return null;
}

/** Shifts the picture up so the subject sits above the caption & controls. */
function ViewOffset() {
  const { camera, size } = useThree();
  const film = useStore((s) => s.film);
  const apply = () => {
    const d = Math.round(size.height * (film ? 0.06 : 0.12));
    const aspect = size.width / (size.height + 2 * d);
    if (Math.abs(camera.aspect - aspect) < 1e-6 && camera.view?.offsetY === 2 * d && camera.view?.fullHeight === size.height + 2 * d) return;
    camera.aspect = aspect;
    camera.setViewOffset(size.width, size.height + 2 * d, 0, 2 * d, size.width, size.height);
    camera.updateProjectionMatrix();
  };
  useLayoutEffect(apply, [camera, size, film]);
  // R3F resets the aspect on resize; re-assert every frame (cheap no-op when unchanged).
  useFrame(apply, -4);
  return null;
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.35} color="#b9c6ff" />
      <directionalLight position={[4, 9, 7]} intensity={2.2} color="#fff0e0" />
      <directionalLight position={[-6, 3, -5]} intensity={1.6} color="#5a7dff" />
      <pointLight position={[5, -3, 4]} intensity={30} distance={22} color="#ff4f8b" />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#ffd9b8" position={[0, 6, 6]} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#4f6dff" position={[-8, 0, -4]} rotation-y={Math.PI / 2} scale={[8, 8, 1]} />
        <Lightformer form="ring" intensity={1.4} color="#ff5fa2" position={[6, -2, -6]} scale={4} />
      </Environment>
    </>
  );
}

function World() {
  const scene = useStore((s) => s.scene);
  const cfg = SCENES[scene];
  const look = WORLD_LOOK[cfg.world];
  return (
    <>
      <color attach="background" args={[look.bg]} />
      {cfg.world === 'leg' && <LegModel key={scene} mode={cfg.id === 'treatment' ? 'treat' : 'explore'} />}
      {cfg.world === 'fibers' && <FiberBundle key={scene} mode={cfg.id === 'compare' ? 'compare' : 'spasticity'} />}
      {cfg.world === 'synapse' && <Synapse key={scene} />}
      <Dust key={cfg.world} color={look.dust} spread={look.dustSpread} />
    </>
  );
}

function Effects() {
  const offset = useMemo(() => new THREE.Vector2(0.0007, 0.0005), []);
  return (
    <EffectComposer multisampling={CAPTURE ? 0 : 4}>
      <Bloom mipmapBlur intensity={0.95} luminanceThreshold={0.62} luminanceSmoothing={0.25} radius={0.72} />
      <ChromaticAberration offset={offset} radialModulation={false} modulationOffset={0} />
      <Noise opacity={0.045} />
      <Vignette offset={0.28} darkness={0.78} />
    </EffectComposer>
  );
}

export default function Stage() {
  return (
    <Canvas
      className="stage"
      dpr={CAPTURE ? window.devicePixelRatio : [1, 2]}
      frameloop={CAPTURE ? 'never' : 'always'}
      gl={{ antialias: false, powerPreference: 'high-performance', preserveDrawingBuffer: CAPTURE }}
      camera={{ fov: 48, near: 0.03, far: 200, position: [7.5, 3.2, 17] }}
    >
      <Director />
      <CaptureBridge />
      <CameraRig />
      <ViewOffset />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        rotateSpeed={0.6}
        zoomSpeed={0.7}
        onStart={() => store.get().guided && store.set({ guided: false })}
      />
      <Lights />
      <World />
      <Effects />
    </Canvas>
  );
}
