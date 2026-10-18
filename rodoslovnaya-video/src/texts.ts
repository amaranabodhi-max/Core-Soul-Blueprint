// Весь текст на экране — здесь. Чтобы сменить язык, замените этот файл
// (или добавьте TEXTS_EN с той же формой и экспортируйте его как TEXTS).
//
// durationSec — длительность сцены в секундах. Под озвучку (ElevenLabs)
// меняйте только эти числа: камера и появление карточек считаются
// от начала каждой сцены, общая длина видео — сумма длительностей.

export type SceneId =
  | "intro"
  | "sisters"
  | "branches"
  | "efimiya"
  | "ascent"
  | "map"
  | "finale";

export type SceneText = {
  id: SceneId;
  durationSec: number;
  caption: string;
  voice: string;
};

export const TEXTS = {
  lang: "ru",
  title: "Родословная Руты",
  scenes: [
    {
      id: "intro",
      durationSec: 4,
      caption: "Моей прабабушке Ефимии — 1880 год. Будище.",
      voice:
        "Мою прабабушку звали Ефимия. Она родилась в 1880 году в селе Будище.",
    },
    {
      id: "sisters",
      durationSec: 6,
      caption: "Нас двое. Мы начинаем отсюда.",
      voice: "Нас двое сестёр. Мы начинаем отсюда.",
    },
    {
      id: "branches",
      durationSec: 8,
      caption: "Две страны. Два рода.",
      voice: "Папа из Литвы. Мама из Черкасщины.",
    },
    {
      id: "efimiya",
      durationSec: 9,
      caption: "1899. Первый брак. 1910. Второй.",
      voice:
        "Ефимия венчалась дважды. Второй раз с Веремеем. Их дочь Мария — моя бабушка.",
    },
    {
      id: "ascent",
      durationSec: 13,
      caption: "Девять поколений вверх.",
      voice:
        "Дальше — Голуб, Третяк, Скрипко. Метрики, ревизия 1795 года. Всё глубже в землю.",
    },
    {
      id: "map",
      durationSec: 6,
      caption: "Вся карта.",
      voice: "Это моя карта. Я её собрала по документам.",
    },
    {
      id: "finale",
      durationSec: 4,
      caption: "Книга рода Руты",
      voice: "Какую историю хранит ваша семья?",
    },
  ] satisfies SceneText[],
  branchLeft: "Литва",
  branchRight: "Черкасщина",
  bornPrefix: "р. ",
  diedPrefix: "† ",
  dateDash: " – ",
} as const;
