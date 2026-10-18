import { Easing, interpolate } from "remotion";
import { TEXTS, SceneId } from "./texts";
import { ID, PEOPLE } from "./data/people";
import { CARD_H, Point, WORLD, genIds, meanX, pos, rowY } from "./data/layout";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// Начало каждой сцены (в секундах) — из длительностей в texts.ts.
export const SCENE_START = {} as Record<SceneId, number>;
export const SCENE_END = {} as Record<SceneId, number>;
let t = 0;
for (const s of TEXTS.scenes) {
  SCENE_START[s.id] = t;
  t += s.durationSec;
  SCENE_END[s.id] = t;
}
export const TOTAL_SEC = t;

const S = SCENE_START;

// ---- Когда появляется каждая карточка (секунды) ----
const APPEAR = new Map<string, number>();
const setRow = (ids: string[], at: number, step = 0.12) =>
  ids.forEach((id, i) => APPEAR.set(id, at + i * step));

setRow([ID.ruta], S.sisters + 0.5);
setRow([ID.mila], S.sisters + 0.9);
setRow([ID.alfonsas, ID.nelya], S.sisters + 3.2, 0.25);
setRow(genIds(2), S.branches + 1.0);
setRow(
  genIds(3).filter((id) => id !== ID.veremey && id !== ID.yakov),
  S.branches + 3.6,
);
APPEAR.set(ID.yakov, S.efimiya + 1.6);
APPEAR.set(ID.veremey, S.efimiya + 4.4);
for (let gen = 4; gen <= 9; gen++) {
  setRow(
    genIds(gen).sort((a, b) => pos(a).x - pos(b).x),
    S.ascent + 0.6 + (gen - 4) * 2,
    0.15,
  );
}
for (const p of PEOPLE) {
  if (!APPEAR.has(p.id)) throw new Error(`Нет времени появления: ${p.name}`);
}
export const appearAt = (id: string) => APPEAR.get(id)!;

// ---- Линии родитель → ребёнок ----
// У ребёнка с двумя известными родителями линия идёт вверх к «узлу пары»
// под родителями, от узла — короткие дуги к отцу и матери. Так линии
// сестёр и братьев не перекрещиваются. Все линии растут снизу вверх.
export type Segment = {
  key: string;
  from: Point;
  to: Point;
  start: number;
  drawSec: number;
  // Отрезки пути Веремей → Мария, которые подсвечиваются в сцене Ефимии.
  veremeyMaria: boolean;
};

const top = (id: string): Point => ({
  x: pos(id).x,
  y: pos(id).y - CARD_H / 2,
});
const bottom = (id: string): Point => ({
  x: pos(id).x,
  y: pos(id).y + CARD_H / 2,
});
const UNION_DROP = 60;
const CHILD_SEC = 0.7;
const PARENT_SEC = 0.45;
// «От Веремея линия к Марии» — отдельным жестом после его появления.
const VEREMEY_LINE = S.efimiya + 5.6;

const segments: Segment[] = [];
const unionStart = new Map<string, number>();
for (const child of PEOPLE) {
  const parents = [child.father, child.mother].filter((x): x is string =>
    Boolean(x),
  );
  if (parents.length === 0) continue;
  const firstParent = Math.min(...parents.map(appearAt));
  const start = Math.max(
    appearAt(child.id) + 0.25,
    firstParent - CHILD_SEC - PARENT_SEC,
  );
  if (parents.length === 1) {
    segments.push({
      key: `${parents[0]}>${child.id}`,
      from: top(child.id),
      to: bottom(parents[0]),
      start,
      drawSec: CHILD_SEC + PARENT_SEC,
      veremeyMaria: false,
    });
    continue;
  }
  const unionKey = parents.join("+");
  const union = {
    x: meanX(parents),
    y: Math.max(...parents.map((p) => bottom(p).y)) + UNION_DROP,
  };
  segments.push({
    key: `${unionKey}>${child.id}`,
    from: top(child.id),
    to: union,
    start,
    drawSec: CHILD_SEC,
    veremeyMaria: child.id === ID.maria,
  });
  unionStart.set(
    unionKey,
    Math.min(unionStart.get(unionKey) ?? Infinity, start + CHILD_SEC),
  );
}
for (const p of PEOPLE) {
  const unionKey = [p.father, p.mother].join("+");
  if (!p.father || !p.mother || segments.some((s) => s.key === unionKey)) {
    continue;
  }
  const union = {
    x: meanX([p.father, p.mother]),
    y: Math.max(bottom(p.father).y, bottom(p.mother).y) + UNION_DROP,
  };
  for (const parent of [p.father, p.mother]) {
    const isVeremey = parent === ID.veremey;
    segments.push({
      key: unionKey,
      from: union,
      to: bottom(parent),
      start: isVeremey
        ? VEREMEY_LINE
        : Math.max(unionStart.get(unionKey)!, appearAt(parent) - PARENT_SEC),
      drawSec: isVeremey ? 1.0 : PARENT_SEC,
      veremeyMaria: isVeremey,
    });
  }
}
export const SEGMENTS = segments;

// Линии брака Ефимии (Яков — 1899, Веремей — 1910).
export const MARRIAGE_START = {
  [ID.yakov]: S.efimiya + 2.2,
  [ID.veremey]: S.efimiya + 5.0,
};

// ---- Камера ----
export type Camera = { x: number; y: number; s: number };
type Key = Camera & { t: number };

const cardsBetween = (g0: number, g1: number) => (rowY(g0) + rowY(g1)) / 2;
const right = (gen: number) =>
  meanX(
    genIds(gen).filter((id) =>
      ["holub", "skripko", "tretyak", "other"].includes(
        PEOPLE.find((p) => p.id === id)!.line,
      ),
    ),
  );
const fitAll = Math.min(
  (WIDTH - 60) / WORLD.width,
  (HEIGHT - 520) / WORLD.height,
);
const efimiyaTrio = meanX([ID.veremey, ID.efimiya, ID.yakov]);

const KEYS: Key[] = [
  { t: 0, x: meanX([ID.ruta, ID.mila]), y: cardsBetween(0, 1) + 80, s: 1.15 },
  {
    t: S.sisters + 2.4,
    x: meanX([ID.ruta, ID.mila]),
    y: cardsBetween(0, 1) + 40,
    s: 1.15,
  },
  {
    t: S.sisters + 4.8,
    x: meanX([ID.ruta, ID.mila]),
    y: cardsBetween(0, 1),
    s: 1.05,
  },
  {
    t: S.branches + 2.2,
    x: meanX(genIds(2)),
    y: cardsBetween(1, 2),
    s: 0.62,
  },
  {
    t: S.branches + 5.4,
    x: meanX(genIds(3)),
    y: cardsBetween(1, 3) - 40,
    s: (WIDTH - 40) / (WORLD.width * 0.92),
  },
  {
    t: S.efimiya + 1.4,
    x: efimiyaTrio,
    y: cardsBetween(2, 3) - CARD_H / 2,
    s: 1.0,
  },
  {
    t: S.efimiya + 6.8,
    x: efimiyaTrio,
    y: cardsBetween(2, 3) - 20,
    s: 0.98,
  },
  ...[4, 5, 6, 7, 8, 9].map((gen) => ({
    t: S.ascent + 1.4 + (gen - 4) * 2,
    x: (right(gen) + efimiyaTrio) / 2,
    y: rowY(gen) + ROW_HALF(gen),
    s: 0.72,
  })),
  {
    t: S.ascent + 13,
    x: right(9),
    y: rowY(9) + 260,
    s: 0.72,
  },
  {
    t: S.map + 3.2,
    x: WORLD.width / 2,
    y: WORLD.height / 2 - 260,
    s: fitAll,
  },
  {
    t: S.finale + 4,
    x: WORLD.width / 2,
    y: WORLD.height / 2 - 260,
    s: fitAll * 0.94,
  },
];

function ROW_HALF(gen: number) {
  // Держим в кадре и новый ряд, и тот, что под ним.
  return gen === 9 ? 260 : 220;
}

const ease = Easing.bezier(0.65, 0, 0.35, 1);

export const cameraAt = (sec: number): Camera => {
  const i = KEYS.findIndex((k) => k.t > sec);
  if (i === -1) return KEYS[KEYS.length - 1];
  if (i === 0) return KEYS[0];
  const a = KEYS[i - 1];
  const b = KEYS[i];
  const p = interpolate(sec, [a.t, b.t], [0, 1], { easing: ease });
  // Масштаб интерполируем в логарифмах, позицию — линейно,
  // чтобы наезд и отъезд ощущались равномерно.
  const s = Math.exp(Math.log(a.s) + (Math.log(b.s) - Math.log(a.s)) * p);
  return {
    s,
    x: a.x + (b.x - a.x) * p,
    y: a.y + (b.y - a.y) * p,
  };
};
