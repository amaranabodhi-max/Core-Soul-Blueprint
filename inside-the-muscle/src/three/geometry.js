import * as THREE from 'three';

// Catmull-Rom interpolation of one scalar.
function cr(p0, p1, p2, p3, t) {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}

const FIELDS = ['y', 'rx', 'rz', 'cx', 'cz', 'b', 'ba'];
const DEF = { cx: 0, cz: 0, b: 0, ba: Math.PI / 2 };

function sampleKeys(keys, v) {
  const n = keys.length - 1;
  const f = v * n;
  const i = Math.min(Math.floor(f), n - 1);
  const t = f - i;
  const k0 = keys[Math.max(i - 1, 0)];
  const k1 = keys[i];
  const k2 = keys[i + 1];
  const k3 = keys[Math.min(i + 2, n)];
  const out = {};
  for (const key of FIELDS) {
    const g = (k) => k[key] ?? DEF[key] ?? 0;
    out[key] = cr(g(k0), g(k1), g(k2), g(k3), t);
  }
  return out;
}

/**
 * "Limb" generator: sweeps elliptical cross-sections along Y.
 * keys: [{ y, rx, rz, cx, cz, b (bulge), ba (bulge direction, radians) }]
 * Used for skin, bones and muscle bellies. Swap with sculpted GLTF meshes later
 * (see README → "Upgrading the anatomy").
 */
export function limbGeometry(keys, { radial = 48, rings = 96 } = {}) {
  const pos = [];
  const uv = [];
  const idx = [];
  for (let j = 0; j <= rings; j++) {
    const v = j / rings;
    const k = sampleKeys(keys, v);
    for (let i = 0; i <= radial; i++) {
      const u = i / radial;
      const th = u * Math.PI * 2;
      const bulge = 1 + k.b * Math.pow(Math.max(0, Math.cos(th - k.ba)), 2);
      pos.push(k.cx + Math.max(k.rx, 0.001) * Math.cos(th) * bulge, k.y, k.cz + Math.max(k.rz, 0.001) * Math.sin(th) * bulge);
      uv.push(u, v);
    }
  }
  const row = radial + 1;
  for (let j = 0; j < rings; j++) {
    for (let i = 0; i < radial; i++) {
      const a = j * row + i;
      const b = a + row;
      idx.push(a, a + 1, b, b, a + 1, b + 1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  // Ascending rings would wind inward; flip so normals always face outward.
  if (keys[0].y < keys[keys.length - 1].y) idx.reverse();
  g.setIndex(idx);
  g.computeVertexNormals();
  // Weld the seam normals so the shading has no visible stitch.
  const n = g.attributes.normal;
  for (let j = 0; j <= rings; j++) {
    const a = j * row;
    const b = a + radial;
    const x = n.getX(a) + n.getX(b);
    const y = n.getY(a) + n.getY(b);
    const z = n.getZ(a) + n.getZ(b);
    const l = Math.hypot(x, y, z) || 1;
    n.setXYZ(a, x / l, y / l, z / l);
    n.setXYZ(b, x / l, y / l, z / l);
  }
  return g;
}

export function curve(points, closed = false) {
  return new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)), closed, 'catmullrom', 0.5);
}

export function tube(points, radius, segs = 64, radial = 10) {
  const c = points instanceof THREE.Curve ? points : curve(points);
  return new THREE.TubeGeometry(c, segs, radius, radial, false);
}

// Deterministic pseudo-random numbers (same film on every render).
export function rng(seed = 1) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function hash(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
export const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
export const clamp01 = (x) => Math.min(1, Math.max(0, x));
