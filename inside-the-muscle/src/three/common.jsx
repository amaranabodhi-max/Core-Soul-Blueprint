import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { store } from '../store';
import { GlowPoints } from './materials';
import { rng } from './geometry';

/**
 * Anatomical label with a leader line.
 *  at:     point on the structure
 *  pos:    where the text sits (or `follow` → function returning a Vector3 each frame)
 *  show:   (state) => boolean
 */
export function Label({ at, pos, text, sub, show, follow, tone = 'default' }) {
  const el = useRef();
  const group = useRef();
  const line = useRef();
  const dot = useRef();
  const vis = useRef(0);
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
    return g;
  }, []);
  const mat = useMemo(() => new THREE.LineBasicMaterial({ color: '#dfe8ff', transparent: true, opacity: 0, depthWrite: false }), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const s = store.get();
    const want = s.layers.labels && show(s) ? 1 : 0;
    const k = 1 - Math.exp(-(s.dt || delta) * 6);
    vis.current += (want - vis.current) * (s.dt === 0 && !s.playing ? 1 : k);
    const v = vis.current;
    const target = follow ? follow(s) : null;
    const anchor = target ?? (at ? tmp.set(...at) : null);
    const textPos = pos ? tmp.clone().set(...pos) : anchor;
    if (target && pos) textPos.copy(target).add(new THREE.Vector3(...pos));
    if (group.current && textPos) group.current.position.copy(textPos);
    if (anchor && textPos) {
      const p = geom.attributes.position.array;
      p[0] = anchor.x; p[1] = anchor.y; p[2] = anchor.z;
      p[3] = textPos.x; p[4] = textPos.y; p[5] = textPos.z;
      geom.attributes.position.needsUpdate = true;
      if (dot.current) dot.current.position.copy(anchor);
    }
    mat.opacity = v * 0.55;
    if (dot.current) dot.current.material.opacity = v;
    if (el.current) {
      el.current.style.opacity = v.toFixed(3);
      el.current.style.transform = `translateY(${(1 - v) * 6}px)`;
    }
  });

  return (
    <>
      {(pos || follow) && <lineSegments geometry={geom} material={mat} frustumCulled={false} />}
      <mesh ref={dot} frustumCulled={false}>
        <sphereGeometry args={[0.035, 10, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} toneMapped={false} depthWrite={false} />
      </mesh>
      <group ref={group}>
        <Html center zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
          <div ref={el} className={`tag tag--${tone}`} style={{ opacity: 0 }}>
            <span className="tag__name">{text}</span>
            {sub && <span className="tag__sub">{sub}</span>}
          </div>
        </Html>
      </group>
    </>
  );
}

/** Floating particles in tissue fluid: gives the "shrunk inside the body" depth. */
export function Dust({ count = 650, spread = 26, color = '#9fc3ff', center = [0, 0, 0] }) {
  const pts = useMemo(() => {
    const p = new GlowPoints(count);
    const r = rng(42);
    const c = new THREE.Color(color);
    p.seeds = [];
    for (let i = 0; i < count; i++) {
      const s = [(r() - 0.5) * spread, (r() - 0.5) * spread, (r() - 0.5) * spread, r() * 6.28, 0.3 + r() * 0.7];
      p.seeds.push(s);
      p.set(i, s[0], s[1], s[2], 0.05 + r() * 0.12, 0.08 + r() * 0.3, c);
    }
    p.commit();
    return p;
  }, [count, spread, color]);
  const { size, gl } = useThree();
  useFrame(() => {
    const t = store.get().clock;
    const a = pts.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const s = pts.seeds[i];
      a[i * 3] = center[0] + s[0] + Math.sin(t * 0.13 * s[4] + s[3]) * 0.6;
      a[i * 3 + 1] = center[1] + s[1] + Math.cos(t * 0.11 * s[4] + s[3]) * 0.5 + t * 0.03 * s[4];
      a[i * 3 + 2] = center[2] + s[2] + Math.sin(t * 0.09 * s[4] + s[3] * 2.0) * 0.6;
      // wrap vertically so the field never empties
      const half = spread / 2;
      const y = a[i * 3 + 1] - center[1];
      a[i * 3 + 1] = center[1] + ((((y + half) % spread) + spread) % spread) - half;
    }
    pts.commit(size.height * gl.getPixelRatio() * 0.5);
  });
  return <primitive object={pts} />;
}

/** Smoothly approach a 0/1 target, honouring pause (dt=0 snaps only when not playing). */
export function approach(cur, target, dt, speed = 5) {
  return cur + (target - cur) * (1 - Math.exp(-dt * speed));
}
