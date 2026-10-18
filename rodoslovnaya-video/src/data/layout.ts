import { ID, PATERNAL, PEOPLE, byId } from "./people";

export const CARD_W = 270;
export const CARD_H = 170;
export const ROW = 430;
const GAP = 36;
const SPACING = CARD_W + GAP;
const SIDE_GAP = 140; // дополнительный зазор между литовской и черкасской ветвью
const MARGIN = 160;
const MAX_GEN = Math.max(...PEOPLE.map((p) => p.gen));

export type Point = { x: number; y: number };

// y = ряд по gen: чем старше поколение, тем выше.
export const rowY = (gen: number) =>
  MARGIN + CARD_H / 2 + (MAX_GEN - gen) * ROW;

// Раскладка снизу вверх: каждый родитель стремится встать над своим
// ребёнком (отец левее, мать правее), затем ряд раздвигается так, чтобы
// карточки не налезали, с минимальным сдвигом от идеальных позиций.
const computeX = (): Map<string, number> => {
  const x = new Map<string, number>();
  const order = new Map<string, number>();
  PEOPLE.forEach((p, i) => order.set(p.id, i));

  x.set(ID.ruta, -SPACING / 2);
  x.set(ID.mila, SPACING / 2);

  for (let gen = 1; gen <= MAX_GEN; gen++) {
    const row = PEOPLE.filter((p) => p.gen === gen && p.id !== ID.yakov).map(
      (p) => {
        let ideal: number;
        {
          const children = PEOPLE.filter(
            (c) => (c.father === p.id || c.mother === p.id) && x.has(c.id),
          );
          const cx =
            children.reduce((s, c) => s + x.get(c.id)!, 0) / children.length;
          const hasBoth = children[0].father && children[0].mother;
          const side = p.sex === "M" ? -1 : 1;
          ideal = cx + (hasBoth ? (side * SPACING) / 2 : 0);
        }
        return { id: p.id, ideal, paternal: PATERNAL.has(p.id) };
      },
    );

    row.sort(
      (a, b) =>
        Number(b.paternal) - Number(a.paternal) ||
        a.ideal - b.ideal ||
        order.get(a.id)! - order.get(b.id)!,
    );
    const efimiya = row.findIndex((r) => r.id === ID.efimiya);
    if (efimiya !== -1) {
      // Яков стоит сразу справа от Ефимии.
      row.splice(efimiya + 1, 0, {
        id: ID.yakov,
        ideal: row[efimiya].ideal + SPACING,
        paternal: false,
      });
    }

    // Смещения внутри ряда относительно первого элемента.
    const offset = [0];
    for (let i = 1; i < row.length; i++) {
      const crossing = row[i].paternal !== row[i - 1].paternal;
      offset.push(offset[i - 1] + SPACING + (crossing ? SIDE_GAP : 0));
    }

    // Объединение в блоки (pool adjacent violators): позиция блока —
    // среднее желаемых позиций его элементов.
    type Block = { start: number; end: number; pos: number };
    const blocks: Block[] = [];
    row.forEach((r, i) => {
      blocks.push({ start: i, end: i, pos: r.ideal - offset[i] });
      while (blocks.length > 1) {
        const b = blocks[blocks.length - 1];
        const a = blocks[blocks.length - 2];
        if (a.pos <= b.pos) break;
        const n1 = a.end - a.start + 1;
        const n2 = b.end - b.start + 1;
        blocks.splice(-2, 2, {
          start: a.start,
          end: b.end,
          pos: (a.pos * n1 + b.pos * n2) / (n1 + n2),
        });
      }
    });
    for (const b of blocks) {
      for (let i = b.start; i <= b.end; i++) {
        x.set(row[i].id, b.pos + offset[i]);
      }
    }
  }
  return x;
};

const rawX = computeX();
const minX = Math.min(...rawX.values()) - CARD_W / 2 - MARGIN;

export const POS = new Map<string, Point>(
  PEOPLE.map((p) => [p.id, { x: rawX.get(p.id)! - minX, y: rowY(p.gen) }]),
);

export const pos = (id: string): Point => POS.get(id)!;

export const WORLD = {
  width: Math.max(...[...POS.values()].map((p) => p.x)) + CARD_W / 2 + MARGIN,
  height: rowY(0) + CARD_H / 2 + MARGIN,
};

export const meanX = (ids: string[]) =>
  ids.reduce((s, id) => s + pos(id).x, 0) / ids.length;

export const genIds = (gen: number) =>
  PEOPLE.filter((p) => p.gen === gen).map((p) => p.id);

export const isPaternal = (id: string) =>
  PATERNAL.has(id) || byId(id).gen === 0;
