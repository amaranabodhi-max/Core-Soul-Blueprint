import family from "./family.json";

export type Person = {
  id: string;
  name: string;
  gen: number;
  line: string;
  color: string;
  born: string | null;
  died: string | null;
  place: string | null;
  father: string | null;
  mother: string | null;
  sex: "M" | "F";
  note: string | null;
};

// Первый муж Ефимии. Его нет в family.json — он взят из раскадровки
// задания («Яков Шевченко (1899)»). 1899 — год брака, а не рождения,
// поэтому дат на карточке нет; год стоит на линии брака.
export const YAKOV_ID = "@storyboard-yakov@";
const yakov: Person = {
  id: YAKOV_ID,
  name: "Яков Шевченко",
  gen: 3,
  line: "other",
  color: "#6B7280",
  born: null,
  died: null,
  place: null,
  father: null,
  mother: null,
  sex: "M",
  note: null,
};

export const PEOPLE: Person[] = [...(family.people as Person[]), yakov];

export const byId = (id: string): Person => {
  const p = PEOPLE.find((x) => x.id === id);
  if (!p) throw new Error(`Нет человека ${id}`);
  return p;
};

export const ID = {
  ruta: "@I10@",
  mila: "@I2@",
  alfonsas: "@I4@",
  nelya: "@I5@",
  maria: "@I9@",
  veremey: "@I17@",
  efimiya: "@I15@",
  yakov: YAKOV_ID,
};

export type Marriage = { husband: string; wife: string; year: number | null };

const coupleYear = (husband: string, wife: string) =>
  (family.couples as [string, string, number | null][]).find(
    ([h, w]) => h === husband && w === wife,
  )?.[2] ?? null;

// Два брака Ефимии, которые показываются в сцене «efimiya».
export const EFIMIYA_MARRIAGES: Marriage[] = [
  { husband: ID.yakov, wife: ID.efimiya, year: 1899 }, // из раскадровки
  {
    husband: ID.veremey,
    wife: ID.efimiya,
    year: coupleYear(ID.veremey, ID.efimiya),
  },
];

const ancestorsOf = (id: string, acc = new Set<string>()): Set<string> => {
  const p = byId(id);
  for (const parent of [p.father, p.mother]) {
    if (parent && !acc.has(parent)) {
      acc.add(parent);
      ancestorsOf(parent, acc);
    }
  }
  return acc;
};

// Прямые предки Руты (и Милы) — у них золотая двойная рамка.
export const DIRECT_ANCESTORS = ancestorsOf(ID.ruta);
// Сторона дерева: отцовская (литовская, слева) или материнская (справа).
export const PATERNAL = new Set([ID.alfonsas, ...ancestorsOf(ID.alfonsas)]);

export type ParentLink = { child: string; parent: string };
export const PARENT_LINKS: ParentLink[] = PEOPLE.flatMap((p) =>
  [p.father, p.mother]
    .filter((x): x is string => Boolean(x))
    .map((parent) => ({ child: p.id, parent })),
);

export const formatDates = (
  p: Person,
  t: { bornPrefix: string; diedPrefix: string; dateDash: string },
): string | null => {
  const end = p.note ?? p.died;
  if (p.born && end) return `${p.born}${t.dateDash}${end}`;
  if (p.born) return `${t.bornPrefix}${p.born}`;
  if (p.died) return `${t.diedPrefix}${p.died}`;
  return p.note;
};
