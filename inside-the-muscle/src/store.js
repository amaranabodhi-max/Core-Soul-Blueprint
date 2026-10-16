import { useSyncExternalStore } from 'react';
import { SCENES, LAYERS, OUTRO, compareScript } from './scenes';

const params = new URLSearchParams(window.location.search);
export const CAPTURE = params.has('capture'); // deterministic frame-by-frame rendering
export const FPS = Number(params.get('fps')) || 30;

const clampScene = (i) => Math.max(0, Math.min(SCENES.length - 1, i));
const startScene = clampScene(Number(params.get('scene') || 1) - 1);

let state = {
  scene: startScene,
  t: Number(params.get('t')) || 0, // seconds since scene start
  clock: 0, // ever-running ambient time
  dt: 0,
  playing: !params.has('paused'),
  film: params.has('film') || (CAPTURE && !params.has('ui')),
  filmT: 0,
  filmEnd: false,
  filmDone: false,
  guided: true, // camera follows the screenplay
  autoRotate: false,
  zoomReq: { n: 0, f: 1 },
  panel: null,
  layers: Object.fromEntries(Object.keys(LAYERS).map((k) => [k, true])),
  treated: null, // scene 5 user override
  week: null, // scene 5 user override
  stretch: null, // user-triggered stretch in scene 2 {at, kind}
};

const listeners = new Set();
function emit() {
  listeners.forEach((l) => l());
}
export const store = {
  get: () => state,
  set(patch) {
    state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) };
    emit();
  },
  subscribe(l) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useStore(selector) {
  return useSyncExternalStore(store.subscribe, () => selector(state));
}

// Mutable per-frame measurements written by the 3D layer and read by the UI.
export const live = { activity: 0, resistance: 0, stretch: 0 };

const sceneReset = { t: 0, guided: true, treated: null, week: null, stretch: null, autoRotate: false };

export const actions = {
  tick(dt) {
    const s = state;
    const patch = { clock: s.clock + dt, dt: s.playing ? dt : 0 };
    if (s.playing) {
      let { scene, t } = s;
      t += dt;
      const dur = SCENES[scene].duration;
      if (s.film) patch.filmT = s.filmT + dt;
      if (t >= dur && !s.filmEnd) {
        if (scene < SCENES.length - 1) {
          Object.assign(patch, sceneReset, { scene: scene + 1 });
          t = 0;
        } else if (s.film) {
          patch.filmEnd = true;
        } else {
          t = dur;
          patch.playing = false;
        }
      }
      if (s.filmEnd && t - SCENES[scene].duration > OUTRO) {
        patch.playing = false;
        patch.filmDone = true;
      }
      patch.t = t;
    }
    state = { ...s, ...patch };
    emit();
  },
  toggle() {
    if (state.filmDone) return actions.startFilm();
    if (!state.playing && state.scene === SCENES.length - 1 && state.t >= SCENES[state.scene].duration) {
      return store.set({ ...sceneReset, scene: 0, playing: true });
    }
    store.set({ playing: !state.playing });
  },
  goto(i) {
    store.set({ ...sceneReset, scene: clampScene(i), playing: true, panel: null, filmEnd: false });
  },
  next() {
    actions.goto(state.scene + 1);
  },
  prev() {
    // Restart current scene if we're well into it, otherwise go back.
    actions.goto(state.t > 2.5 ? state.scene : state.scene - 1);
  },
  seek(t) {
    store.set({ t, playing: true, guided: true });
  },
  zoom(f) {
    store.set({ zoomReq: { n: state.zoomReq.n + 1, f }, guided: false });
  },
  rotate() {
    store.set({ autoRotate: !state.autoRotate, guided: false });
  },
  recenter() {
    store.set({ guided: true, autoRotate: false });
  },
  togglePanel(name) {
    store.set({ panel: state.panel === name ? null : name });
  },
  toggleLayer(key) {
    store.set({ layers: { ...state.layers, [key]: !state.layers[key] } });
  },
  beforeAfter() {
    const cfg = SCENES[state.scene];
    if (cfg.id === 'nmj') {
      const after = state.t >= cfg.seekAfter - 0.5 && state.t < SCENES[3].duration - 6;
      actions.seek(after ? cfg.seekBefore : cfg.seekAfter);
    } else if (cfg.id === 'compare') {
      const cur = state.treated ?? compareScript(state.t).treated;
      store.set({ treated: !cur, week: state.week ?? 4 });
    }
  },
  setWeek(w) {
    store.set({ week: Math.max(0, Math.min(16, w)), treated: true });
  },
  stretch(kind) {
    store.set({ stretch: { at: state.t, kind } });
  },
  startFilm() {
    store.set({ ...sceneReset, scene: 0, film: true, filmT: 0, filmEnd: false, filmDone: false, playing: true, panel: null });
  },
  exitFilm() {
    store.set({ film: false, filmEnd: false, filmDone: false });
  },
};

// Scene-5 values: user override first, then the screenplay.
export function compareState(s) {
  const scripted = compareScript(s.t);
  return { treated: s.treated ?? scripted.treated, week: s.week ?? scripted.week };
}
