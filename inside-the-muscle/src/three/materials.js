import * as THREE from 'three';

const OUT = /* glsl */ `
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
`;

// ── Fresnel "x-ray" membrane: skin, nerve terminal, vesicles, sheaths ─────────
// uSolid = 1 → lit, opaque surface; uSolid = 0 → glassy rim-lit membrane.
const fresnelVert = /* glsl */ `
  varying vec3 vN; varying vec3 vV; varying vec3 vW;
  void main() {
    mat4 m = modelMatrix;
    #ifdef USE_INSTANCING
      m = modelMatrix * instanceMatrix;
    #endif
    vec4 wp = m * vec4(position, 1.0);
    vW = wp.xyz;
    vN = normalize(mat3(m) * normal);
    vV = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;
const fresnelFrag = /* glsl */ `
  uniform vec3 uColor; uniform vec3 uRim; uniform float uOpacity; uniform float uPower;
  uniform float uIntensity; uniform float uSolid; uniform float uFade; uniform float uFlash; uniform vec3 uFlashColor;
  varying vec3 vN; varying vec3 vV; varying vec3 vW;
  void main() {
    vec3 n = normalize(vN);
    if (!gl_FrontFacing) n = -n;
    float ndv = abs(dot(n, normalize(vV)));
    float f = pow(1.0 - ndv, uPower);
    vec3 L = normalize(vec3(0.45, 0.8, 0.55));
    float diff = max(dot(n, L), 0.0) * 0.75 + 0.25;
    float wrap = pow(1.0 - ndv, 1.5) * 0.35; // fake subsurface glow at grazing angles
    vec3 solid = uColor * diff + uRim * wrap;
    vec3 glass = uColor * 0.12 + uRim * f * uIntensity;
    vec3 col = mix(glass, solid, uSolid) + uFlashColor * uFlash * (0.25 + f);
    float a = mix(uOpacity + f * (1.0 - uOpacity) * 0.9, 1.0, uSolid) * uFade;
    gl_FragColor = vec4(col, clamp(a + uFlash * 0.2 * uFade, 0.0, 1.0));
    ${OUT}
  }
`;

export function fresnelMaterial({
  color = '#e9b9a3',
  rim = '#ffd6c4',
  opacity = 0.05,
  power = 2.2,
  intensity = 1,
  solid = 0,
  side = THREE.FrontSide,
  additive = false,
  flash = '#ffffff',
} = {}) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uRim: { value: new THREE.Color(rim) },
      uOpacity: { value: opacity },
      uPower: { value: power },
      uIntensity: { value: intensity },
      uSolid: { value: solid },
      uFade: { value: 1 },
      uFlash: { value: 0 },
      uFlashColor: { value: new THREE.Color(flash) },
    },
    vertexShader: fresnelVert,
    fragmentShader: fresnelFrag,
    transparent: true,
    depthWrite: false,
    side,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
  });
}

// ── Skeletal muscle fiber (instanced) ────────────────────────────────────────
// Cross-striations = sarcomeres (A/I bands, Z-lines). aState per fiber:
//   x = contraction 0..1, y = seconds since its last action potential, z = junction blocked 0..1
const fiberVert = /* glsl */ `
  attribute vec3 aState;
  varying float vY; varying vec3 vN; varying vec3 vV; varying vec3 vS; varying float vAng;
  void main() {
    vec3 p = position;
    float c = aState.x;
    vY = p.y;
    vAng = atan(p.z, p.x);
    p.y *= (1.0 - 0.16 * c);        // fiber shortens…
    p.xz *= (1.0 + 0.13 * c);       // …and thickens (constant volume)
    mat4 m = modelMatrix * instanceMatrix;
    vec4 wp = m * vec4(p, 1.0);
    vN = normalize(mat3(m) * normal);
    vV = normalize(cameraPosition - wp.xyz);
    vS = aState;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;
const fiberFrag = /* glsl */ `
  uniform vec3 uBase; uniform vec3 uBand; uniform vec3 uHot; uniform vec3 uRim; uniform vec3 uQuiet;
  uniform float uFreq; uniform float uSpeed; uniform float uFade;
  varying float vY; varying vec3 vN; varying vec3 vV; varying vec3 vS; varying float vAng;
  void main() {
    vec3 n = normalize(vN);
    float ndv = abs(dot(n, normalize(vV)));
    float f = pow(1.0 - ndv, 2.4);
    float ph = vY * uFreq;
    float band = 0.5 + 0.5 * sin(ph);                       // A (dark) / I (light) bands
    float zline = smoothstep(0.93, 1.0, abs(sin(ph * 0.5))); // thin Z-lines
    float myo = 0.85 + 0.15 * sin(vAng * 28.0);              // longitudinal myofibrils
    vec3 col = mix(uBase, uBand, band) * myo + zline * uBand * 0.35;
    vec3 L = normalize(vec3(0.5, 0.7, 0.6));
    col *= max(dot(n, L), 0.0) * 0.7 + 0.35;
    col = mix(col, uQuiet * (0.6 + 0.4 * band), vS.z * 0.45);
    // Action potential spreading from the endplate (y≈0) toward both tendon ends.
    float tt = vS.y;
    float front = tt * uSpeed;
    float wave = exp(-pow((abs(vY) - front) * 2.2, 2.0)) * exp(-tt * 1.4) * step(0.0, tt);
    col += uHot * (vS.x * 0.42 + wave * 1.6);
    col += uRim * f * 0.9;
    gl_FragColor = vec4(col, uFade);
    ${OUT}
  }
`;

export function fiberMaterial({ freq = 16 } = {}) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uBase: { value: new THREE.Color('#6f1325') },
      uBand: { value: new THREE.Color('#d0475b') },
      uHot: { value: new THREE.Color('#ff7a52') },
      uRim: { value: new THREE.Color('#ff9fb5') },
      uQuiet: { value: new THREE.Color('#5b3f8c') },
      uFreq: { value: freq },
      uSpeed: { value: 9 },
      uFade: { value: 1 },
    },
    vertexShader: fiberVert,
    fragmentShader: fiberFrag,
  });
}

// ── Soft glowing points (impulses, molecules, dust) ──────────────────────────
const pointsVert = /* glsl */ `
  attribute float aSize; attribute float aAlpha; attribute vec3 aColor;
  uniform float uScale;
  varying float vA; varying vec3 vC;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uScale / max(0.1, -mv.z);
    gl_Position = projectionMatrix * mv;
    vA = aAlpha; vC = aColor;
  }
`;
const pointsFrag = /* glsl */ `
  varying float vA; varying vec3 vC;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.0, d);
    float a = core * core * vA;
    if (a < 0.003) discard;
    gl_FragColor = vec4(vC * (0.6 + core * 1.6), a);
  }
`;

export class GlowPoints extends THREE.Points {
  constructor(capacity, { additive = true } = {}) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(capacity * 3), 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(capacity), 1));
    g.setAttribute('aAlpha', new THREE.BufferAttribute(new Float32Array(capacity), 1));
    g.setAttribute('aColor', new THREE.BufferAttribute(new Float32Array(capacity * 3), 3));
    const m = new THREE.ShaderMaterial({
      uniforms: { uScale: { value: 400 } },
      vertexShader: pointsVert,
      fragmentShader: pointsFrag,
      transparent: true,
      depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    super(g, m);
    this.capacity = capacity;
    this.frustumCulled = false;
  }
  set(i, x, y, z, size, alpha, color) {
    const a = this.geometry.attributes;
    a.position.array[i * 3] = x;
    a.position.array[i * 3 + 1] = y;
    a.position.array[i * 3 + 2] = z;
    a.aSize.array[i] = size;
    a.aAlpha.array[i] = alpha;
    if (color) {
      a.aColor.array[i * 3] = color.r;
      a.aColor.array[i * 3 + 1] = color.g;
      a.aColor.array[i * 3 + 2] = color.b;
    }
  }
  commit(scale) {
    const a = this.geometry.attributes;
    a.position.needsUpdate = true;
    a.aSize.needsUpdate = true;
    a.aAlpha.needsUpdate = true;
    a.aColor.needsUpdate = true;
    if (scale) this.material.uniforms.uScale.value = scale;
  }
}

// ── Postsynaptic muscle membrane with junctional folds and depolarization wave ─
const membraneVert = /* glsl */ `
  varying vec3 vN; varying vec3 vV; varying vec3 vW;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vW = wp.xyz;
    vN = normalize(mat3(modelMatrix) * normal);
    vV = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;
const membraneFrag = /* glsl */ `
  uniform vec3 uColor; uniform vec3 uRim; uniform vec3 uWaveColor;
  uniform float uWaveT; uniform float uWaveAmp; uniform float uFade;
  varying vec3 vN; varying vec3 vV; varying vec3 vW;
  void main() {
    vec3 n = normalize(vN);
    if (!gl_FrontFacing) n = -n;
    float ndv = abs(dot(n, normalize(vV)));
    float f = pow(1.0 - ndv, 2.0);
    vec3 L = normalize(vec3(0.3, 0.9, 0.5));
    float diff = max(dot(n, L), 0.0) * 0.7 + 0.3;
    float depth = smoothstep(-0.4, -1.5, vW.y); // darker inside the folds
    vec3 col = uColor * diff * (1.0 - depth * 0.6) + uRim * f * 0.8;
    float r = length(vW.xz);
    float ring = exp(-pow((r - uWaveT * 4.5) * 1.6, 2.0)) * exp(-uWaveT * 0.9) * step(0.0, uWaveT);
    float core = exp(-r * r * 0.12) * exp(-uWaveT * 2.0) * step(0.0, uWaveT);
    col += uWaveColor * (ring * 1.3 + core * 0.5) * uWaveAmp;
    gl_FragColor = vec4(col, uFade);
    ${OUT}
  }
`;
export function membraneMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color('#7d2340') },
      uRim: { value: new THREE.Color('#ff8fb0') },
      uWaveColor: { value: new THREE.Color('#ff9a5c') },
      uWaveT: { value: -1 },
      uWaveAmp: { value: 0 },
      uFade: { value: 1 },
    },
    vertexShader: membraneVert,
    fragmentShader: membraneFrag,
    side: THREE.DoubleSide,
  });
}

// ── Canvas texture: longitudinal muscle striation for macro muscles ─────────
let striation;
export function striationTexture() {
  if (striation) return striation;
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 64;
  const g = c.getContext('2d');
  g.fillStyle = '#9a9a9a';
  g.fillRect(0, 0, c.width, c.height);
  let s = 7;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 260; i++) {
    const x = r() * c.width;
    const w = 0.6 + r() * 1.8;
    const l = 120 + r() * 135;
    g.fillStyle = `rgb(${l},${l},${l})`;
    g.globalAlpha = 0.55;
    g.fillRect(x, 0, w, c.height);
  }
  striation = new THREE.CanvasTexture(c);
  striation.wrapS = striation.wrapT = THREE.RepeatWrapping;
  striation.repeat.set(5, 1);
  striation.colorSpace = THREE.SRGBColorSpace;
  return striation;
}
