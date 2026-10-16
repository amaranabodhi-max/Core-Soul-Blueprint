import { useEffect, useRef } from 'react';
import { useStore, actions, store, live, compareState, CAPTURE } from '../store';
import { SCENES, LAYERS, INTRO, OUTRO, effectAt } from '../scenes';
import { synapseStatus } from '../three/Synapse';
import { Icon } from './icons';

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const pad = (n) => String(n).padStart(2, '0');

// ── Story-style progress + scene title ──────────────────────────────────────
function TopBar() {
  const scene = useStore((s) => s.scene);
  const t = useStore((s) => Math.round(s.t * 20) / 20);
  const film = useStore((s) => s.film);
  return (
    <header className="top">
      <nav className="progress" aria-label="Scenes">
        {SCENES.map((sc, i) => {
          const fill = i < scene ? 1 : i > scene ? 0 : Math.min(1, t / sc.duration);
          return (
            <button key={sc.id} className="progress__seg" onClick={() => actions.goto(i)} aria-label={`Scene ${i + 1}: ${sc.title}`} disabled={film} tabIndex={film ? -1 : 0}>
              <span style={{ transform: `scaleX(${fill})` }} />
            </button>
          );
        })}
      </nav>
      <div className="top__title">
        <span className="top__num">{pad(scene + 1)} / {pad(SCENES.length)}</span>
        <span className="top__name">{SCENES[scene].title}</span>
      </div>
    </header>
  );
}

// ── Captions, timed to the screenplay ────────────────────────────────────────
function Caption() {
  const scene = useStore((s) => s.scene);
  const t = useStore((s) => s.t);
  const film = useStore((s) => s.film);
  const filmT = useStore((s) => s.filmT);
  const filmEnd = useStore((s) => s.filmEnd);
  const override = useStore((s) => s.treated !== null || s.week !== null);
  const cfg = SCENES[scene];
  let i = 0;
  cfg.captions.forEach((c, k) => {
    if (t >= c.at) i = k;
  });
  let cap = cfg.captions[i];
  const next = cfg.captions[i + 1]?.at ?? cfg.duration + 0.3;
  let o = smooth(cap.at, cap.at + 0.45, t) * (1 - smooth(next - 0.3, next, t));
  if (cap.at === 0) o = 1 - smooth(next - 0.3, next, t);
  // Scene 5 explored by hand: the caption follows the chosen state, not the clock.
  if (cfg.id === 'compare' && override) {
    const cs = compareState(store.get());
    const c = cfg.captions;
    cap = !cs.treated ? c[0] : cs.week < 1.5 ? c[2] : cs.week < 7 ? c[3] : cs.week < 11 ? c[1] : c[4];
    if (cs.treated && cap === c[1]) cap = { ...c[1], kicker: `After · week ${Math.round(cs.week)}` };
    o = 1;
  }
  if (film && scene === 0 && filmT < INTRO) o = 0;
  if (filmEnd) o = 0;
  return (
    <section className="caption" aria-live="polite" style={{ opacity: o, transform: `translateY(${(1 - o) * 10}px)` }}>
      <p className="caption__kicker">{cap.kicker}</p>
      <p className="caption__text">{cap.text}</p>
      {cfg.note && <p className="caption__note">{cfg.note}</p>}
    </section>
  );
}

// ── Dip to black (and a violet "shrink" flash into the micro-world) ─────────
function Fader() {
  const scene = useStore((s) => s.scene);
  const t = useStore((s) => s.t);
  const cfg = SCENES[scene];
  const last = scene === SCENES.length - 1;
  const fin = 1 - smooth(0, 0.8, t);
  const fout = last ? 0 : smooth(cfg.duration - 0.6, cfg.duration, t);
  const dive = (scene === 2 && fout > fin) || (scene === 3 && fin >= fout);
  return <div className={`fader ${dive ? 'fader--dive' : ''}`} style={{ opacity: Math.max(fin, fout) }} />;
}

// ── Scene 2: the reflex circuit ──────────────────────────────────────────────
function SignalMap() {
  const t = useStore((s) => s.t);
  const clock = useStore((s) => s.clock);
  const sp = smooth(8.6, 12.2, t);
  const act = live.activity;
  const motorSpeed = 20 + 160 * Math.min(1, act * 1.6);
  return (
    <div className="widget signal">
      <svg viewBox="0 0 320 112" role="img" aria-label="Brain, spinal cord and muscle reflex circuit">
        <defs>
          <marker id="arr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0L8 4L0 8z" fill="currentColor" />
          </marker>
        </defs>
        <g className="signal__brake" style={{ opacity: 1 - 0.78 * sp }}>
          <path d="M58 30 C 100 30, 120 58, 146 72" strokeDasharray="5 5" strokeDashoffset={-clock * 14} markerEnd="url(#arr)" />
          <text x="66" y="20">calming control</text>
        </g>
        {sp > 0.4 && (
          <text className="signal__x" x="98" y="47" style={{ opacity: smooth(0.4, 0.9, sp) }}>
            weakened
          </text>
        )}
        <path className="signal__motor" d="M178 76 C 220 76, 238 52, 262 42" strokeDasharray="4 6" strokeDashoffset={-clock * motorSpeed} markerEnd="url(#arr)" />
        <path className="signal__sense" d="M262 58 C 236 72, 214 92, 180 90" strokeDasharray="2 6" strokeDashoffset={-clock * 30} markerEnd="url(#arr)" />
        <text className="signal__lbl" x="214" y="40">motor signal</text>
        <text className="signal__lbl" x="190" y="108">stretch sensor</text>
        <circle className="node node--brain" cx="40" cy="30" r="17" />
        <text className="node__t" x="40" y="34">Brain</text>
        <circle className="node node--cord" cx="162" cy="80" r="16" />
        <text className="node__t" x="162" y="84">Spinal</text>
        <circle className="node node--muscle" cx="282" cy="48" r="20" style={{ filter: `brightness(${1 + act * 1.2})` }} />
        <text className="node__t" x="282" y="52">Muscle</text>
      </svg>
      <div className="meter">
        <span className="meter__lbl">Muscle activity</span>
        <span className="meter__bar">
          <span style={{ transform: `scaleX(${Math.min(1, act * 1.25)})` }} />
        </span>
      </div>
    </div>
  );
}

function StretchButtons() {
  return (
    <div className="chips" role="group" aria-label="Test the stretch reflex">
      <button className="chip" onClick={() => actions.stretch('quick')}>
        Quick stretch
      </button>
      <button className="chip" onClick={() => actions.stretch('slow')}>
        Slow stretch
      </button>
    </div>
  );
}

// ── Scene 4: transmission chain ──────────────────────────────────────────────
const STEPS = ['Impulse', 'Ca²⁺ in', 'Fusion', 'ACh → receptor', 'Contraction'];
function Pipeline() {
  const t = useStore((s) => s.t);
  const st = synapseStatus(t);
  return (
    <div className="pipeline" aria-label="Signal chain">
      {STEPS.map((label, i) => {
        const fail = st.blocked && i >= 2;
        return (
          <span key={label} className={`step ${st.steps[i] ? 'is-on' : ''} ${fail ? 'is-fail' : ''}`}>
            {label}
          </span>
        );
      })}
      <span className="pipeline__scale">Not to scale · molecules enlarged</span>
    </div>
  );
}

// ── Scene 5: before/after, EMG-style trace and effect timeline ───────────────
function hash(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
function Emg({ level }) {
  const ref = useRef();
  const clock = useStore((s) => s.clock);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const w = (c.width = c.clientWidth * 2);
    const h = (c.height = c.clientHeight * 2);
    const g = c.getContext('2d');
    g.clearRect(0, 0, w, h);
    const rows = [
      { a: 1, color: 'rgba(200,205,230,.55)', y: h * 0.27 },
      { a: level, color: '#ff6b7f', y: h * 0.75 },
    ];
    for (const r of rows) {
      g.beginPath();
      g.lineWidth = 2;
      g.strokeStyle = r.color;
      for (let x = 0; x < w; x += 2) {
        const tau = clock - ((w - x) / w) * 2.5;
        const k = Math.floor(tau * 320);
        const env = 0.55 + 0.45 * Math.sin(tau * 5.3) * Math.sin(tau * 1.7 + 1);
        const v = (hash(k + (r === rows[0] ? 0 : 999)) - 0.5) * 2 * env * r.a + (hash(k * 0.37) - 0.5) * 0.06;
        const y = r.y - v * h * 0.2;
        if (x === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.stroke();
    }
  });
  return <canvas ref={ref} className="emg__canvas" aria-hidden="true" />;
}

const X0 = 30;
const X1 = 306;
const Y0 = 86;
const Y1 = 14;
const wx = (w) => X0 + (w / 16) * (X1 - X0);
const ey = (e) => Y0 - (e / 0.7) * (Y0 - Y1);
const CURVE = (() => {
  let d = '';
  for (let w = 0; w <= 16.001; w += 0.25) d += `${w === 0 ? 'M' : 'L'}${wx(w).toFixed(1)} ${ey(effectAt(w)).toFixed(1)} `;
  return d;
})();

function WeekChart({ week, treated }) {
  const svg = useRef();
  const drag = useRef(false);
  const setFromEvent = (e) => {
    const r = svg.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 320;
    actions.setWeek(((x - X0) / (X1 - X0)) * 16);
  };
  const onKey = (e) => {
    if (e.key === 'ArrowRight') actions.setWeek(week + 0.5);
    if (e.key === 'ArrowLeft') actions.setWeek(week - 0.5);
  };
  return (
    <svg
      ref={svg}
      className="chart"
      viewBox="0 0 320 112"
      role="slider"
      tabIndex={0}
      aria-label="Weeks after treatment"
      aria-valuemin={0}
      aria-valuemax={16}
      aria-valuenow={Math.round(week)}
      onKeyDown={onKey}
      onPointerDown={(e) => {
        drag.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        setFromEvent(e);
      }}
      onPointerMove={(e) => drag.current && setFromEvent(e)}
      onPointerUp={() => (drag.current = false)}
    >
      <defs>
        <linearGradient id="eff" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b98cff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#b98cff" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <rect x={wx(2)} y={Y1} width={wx(6) - wx(2)} height={Y0 - Y1} className="chart__peak" />
      {[0, 2, 6, 12, 16].map((w) => (
        <g key={w}>
          <line x1={wx(w)} x2={wx(w)} y1={Y0} y2={Y0 + 4} className="chart__tick" />
          <text x={wx(w)} y={Y0 + 15} className="chart__ax">
            {w === 0 ? '0' : `${w} wk`}
          </text>
        </g>
      ))}
      <line x1={X0} x2={X1} y1={Y0} y2={Y0} className="chart__base" />
      <path d={`${CURVE} L${X1} ${Y0} L${X0} ${Y0} Z`} fill="url(#eff)" />
      <path d={CURVE} className="chart__line" />
      <text x={X0} y={6} className="chart__note">effect over time (illustrative)</text>
      <text x={wx(4)} y={Y1 + 12} className="chart__zone">peak</text>
      <text x={wx(11.8)} y={Y1 + 34} className="chart__zone">fading</text>
      <g style={{ opacity: treated ? 1 : 0.35 }}>
        <line x1={wx(week)} x2={wx(week)} y1={Y1 - 4} y2={Y0} className="chart__marker" />
        <circle cx={wx(week)} cy={ey(effectAt(week))} r="6" className="chart__dot" />
      </g>
      <text x={X1} y={Y0 + 26} className="chart__ax chart__ax--end">drag to explore</text>
    </svg>
  );
}

function Compare({ film }) {
  useStore((s) => s.t);
  const cs = compareState(store.get());
  const e = cs.treated ? effectAt(cs.week) : 0;
  const level = 1 - e;
  const wk = cs.week < 1 ? `day ${Math.max(1, Math.round(cs.week * 7))}` : `week ${Math.round(cs.week)}`;
  return (
    <div className="widget compare">
        <div className="emg">
          <span className="emg__lbl emg__lbl--a">Before</span>
          <span className="emg__lbl emg__lbl--b">{cs.treated ? wk : 'Now'}</span>
          <Emg level={level} />
        </div>
        <WeekChart week={cs.week} treated={cs.treated} />
      {!film && <p className="compare__hint">Illustrative curve, not patient data. Each person’s response is different.</p>}
    </div>
  );
}

function CompareBadge() {
  useStore((s) => s.t);
  const cs = compareState(store.get());
  const wk = cs.week < 1 ? `day ${Math.max(1, Math.round(cs.week * 7))}` : `week ${Math.round(cs.week)}`;
  return (
    <div className={`badge ${cs.treated ? 'badge--after' : ''}`}>
      <span className="badge__main">{cs.treated ? 'After' : 'Before'}</span>
      {cs.treated && <span className="badge__sub">{wk}</span>}
    </div>
  );
}

function TopWidgets() {
  const scene = useStore((s) => s.scene);
  const id = SCENES[scene].id;
  return (
    <div className="upper">
      {id === 'spasticity' && <SignalMap />}
      {id === 'compare' && <CompareBadge />}
    </div>
  );
}

function SceneWidgets() {
  const scene = useStore((s) => s.scene);
  const film = useStore((s) => s.film);
  const id = SCENES[scene].id;
  return (
    <>
      {id === 'nmj' && <Pipeline />}
      {id === 'compare' && <Compare film={film} />}
      {id === 'spasticity' && !film && <StretchButtons />}
    </>
  );
}

// ── Controls ─────────────────────────────────────────────────────────────────
function Btn({ icon, label, onClick, active, disabled, big, primary }) {
  return (
    <button
      className={`btn ${big ? 'btn--big' : ''} ${primary ? 'btn--primary' : ''} ${active ? 'is-active' : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active === undefined ? undefined : !!active}
      aria-label={label}
    >
      <Icon name={icon} size={big ? 30 : 22} />
      {!big && <span>{label}</span>}
    </button>
  );
}

function Controls() {
  const playing = useStore((s) => s.playing);
  const scene = useStore((s) => s.scene);
  const autoRotate = useStore((s) => s.autoRotate);
  const panel = useStore((s) => s.panel);
  const id = SCENES[scene].id;
  const canCompare = id === 'nmj' || id === 'compare';
  return (
    <footer className="controls">
      <div className="tools">
        <Btn icon="rotate" label="Rotate" active={autoRotate} onClick={actions.rotate} />
        <Btn icon="zoomOut" label="Zoom out" onClick={() => actions.zoom(1.3)} />
        <Btn icon="zoomIn" label="Zoom in" onClick={() => actions.zoom(0.75)} />
        <Btn icon="layers" label="Anatomy" active={panel === 'layers'} onClick={() => actions.togglePanel('layers')} />
        <Btn icon="split" label="Before / After" disabled={!canCompare} onClick={actions.beforeAfter} />
        <Btn icon="film" label="Film" onClick={actions.startFilm} />
      </div>
      <div className="transport">
        <Btn icon="prev" label="Previous scene" big onClick={actions.prev} />
        <Btn icon={playing ? 'pause' : 'play'} label={playing ? 'Pause' : 'Play'} big primary onClick={actions.toggle} />
        <Btn icon="next" label="Next scene" big onClick={actions.next} disabled={scene === SCENES.length - 1} />
      </div>
    </footer>
  );
}

function LayersPanel() {
  const panel = useStore((s) => s.panel);
  const scene = useStore((s) => s.scene);
  const layers = useStore((s) => s.layers);
  if (panel !== 'layers') return null;
  return (
    <div className="sheet" role="dialog" aria-label="Show or hide anatomy">
      <div className="sheet__head">
        <span>Show / hide</span>
        <button className="icon-btn" onClick={() => actions.togglePanel('layers')} aria-label="Close">
          <Icon name="close" />
        </button>
      </div>
      <div className="sheet__grid">
        {SCENES[scene].layers.map((k) => (
          <button key={k} className={`toggle ${layers[k] ? 'is-on' : ''}`} onClick={() => actions.toggleLayer(k)} aria-pressed={layers[k]}>
            <span className="toggle__dot" />
            {LAYERS[k]}
          </button>
        ))}
      </div>
    </div>
  );
}

function Recenter() {
  const guided = useStore((s) => s.guided);
  const film = useStore((s) => s.film);
  if (guided || film) return null;
  return (
    <button className="recenter" onClick={actions.recenter}>
      <Icon name="target" size={18} /> Follow the story
    </button>
  );
}

// ── Film mode: title and end cards ───────────────────────────────────────────
function FilmCards() {
  const filmT = useStore((s) => s.filmT);
  const filmEnd = useStore((s) => s.filmEnd);
  const filmDone = useStore((s) => s.filmDone);
  const t = useStore((s) => s.t);
  const scene = useStore((s) => s.scene);
  const intro = scene === 0 && t < INTRO + 1 && filmT < INTRO + 0.6 ? smooth(0.2, 0.9, filmT) * (1 - smooth(INTRO - 0.4, INTRO + 0.5, filmT)) : 0;
  const outT = filmEnd ? t - SCENES[SCENES.length - 1].duration : -1;
  const outro = filmEnd ? smooth(0, 0.8, outT) : 0;
  return (
    <>
      {intro > 0 && (
        <div className="card card--intro" style={{ opacity: intro }}>
          <p className="card__eyebrow">A journey into the lower leg</p>
          <h1 className="card__title">
            Inside
            <br />
            the Muscle
          </h1>
          <p className="card__sub">How botulinum toxin works in spasticity</p>
        </div>
      )}
      {outro > 0 && (
        <div className="card card--outro" style={{ opacity: outro }}>
          <h2 className="card__title card__title--sm">
            Inside
            <br />
            the Muscle
          </h2>
          <p className="card__sub">Fewer signals delivered. Calmer fibers. A temporary window for therapy and movement.</p>
          <p className="card__fine">Educational visualization. Stylized anatomy, not to scale. Not medical advice: treatment decisions belong to your care team.</p>
          {filmDone && !CAPTURE && (
            <div className="card__actions">
              <button className="chip" onClick={actions.startFilm}>Replay</button>
              <button className="chip" onClick={actions.exitFilm}>Explore</button>
            </div>
          )}
        </div>
      )}
      {!CAPTURE && !filmDone && (
        <button className="film-exit" onClick={actions.exitFilm} aria-label="Exit film mode">
          <Icon name="close" size={18} />
        </button>
      )}
    </>
  );
}

function useKeys() {
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest && e.target.closest('[role="slider"]')) return;
      const k = e.key;
      if (k === ' ') {
        e.preventDefault();
        actions.toggle();
      } else if (k === 'ArrowRight') actions.next();
      else if (k === 'ArrowLeft') actions.prev();
      else if (k === 'r' || k === 'R') actions.rotate();
      else if (k === '+' || k === '=') actions.zoom(0.75);
      else if (k === '-') actions.zoom(1.3);
      else if (k === 'f' || k === 'F') actions.startFilm();
      else if (k === 'b' || k === 'B') actions.beforeAfter();
      else if (k === 'Escape') {
        if (store.get().film) actions.exitFilm();
        else store.set({ panel: null });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}

export default function Overlay() {
  const film = useStore((s) => s.film);
  useKeys();
  return (
    <div className="overlay">
      <Fader />
      <TopBar />
      <TopWidgets />
      <div className="lower">
        <SceneWidgets />
        <Caption />
        {!film && <p className="fine">Stylized anatomy · Educational · Not medical advice</p>}
        {!film && <Controls />}
      </div>
      {!film && <LayersPanel />}
      {film && <FilmCards />}
      <Recenter />
    </div>
  );
}
