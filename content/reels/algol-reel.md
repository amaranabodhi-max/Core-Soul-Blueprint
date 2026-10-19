# Algol Reel — «Демоническая звезда моргает»

**Канал:** @veyra982, Instagram Reels (кросс-пост в TikTok и YouTube Shorts)
**Серия:** star and oracle explainers
**Опора:** 40% Revelation (объяснение одной неподвижной звезды)
**Хронометраж:** 30 с · 9:16 · 1080×1920
**Метод:** соединение по эклиптической долготе, тропический зодиак, орбис ≤1° (основной метод из `veyra-core.md`). Парантеллоны в ролике не используются.
**Статус:** черновик для Руты. Ничего не опубликовано и не сгенерировано, кредиты не потрачены.

> Язык. По `veyra-core.md` всё публичное (хук, озвучка, текст на экране, подпись, промпты) пишется на английском. Рабочие пояснения ниже на русском, к каждой реплике дан перевод.

---

## 0. Продюсерская карта

```
SEED: Reel про Алголь (β Persei). Зритель уходит с пониманием: «Демоническая звезда» —
      это затмение, а не зло. И у него остаётся вопрос: касается ли эта звезда его карты?
SPINE: Hero / Mission / Villain / Guide / Journey / Resolution (см. раздел 2)
MAP:
1. [veyra-tiktok-strategist]       → концепция, 3 хука, рекомендация, структура на 30 с
2. [veyra-story-weaver]            → 6-частный хребет, эмоциональная кривая, главная метафора
3. [veyra-tiktok-strategist]       → сценарий с таймкодами (озвучка + текст на экране)
4. [veyra-visual-prompt-architect] → шот-лист, Visual DNA, промпты для Grok / Seedance
5. [veyra-reels-editor]            → план монтажа, грейд, микс, субтитры, экспорт
6. [veyra-tiktok-strategist]       → подпись, хэштеги, CTA
7. [veyra-brand-guardian]          → проверка голоса (оценка /16)
8. [veyra-reality-checker]         → проверка фактов и спецификаций, флаги [CHECK]
```

---

## 1. Концепция и хуки

**Концепция (одна идея).** Алголь, самая пугающая звезда традиционной астрологии, каждые 2,867 суток тускнеет. Это затмение: одна звезда проходит перед другой. Ролик ведёт от факта к мифу (голова Медузы), потом к новому прочтению (голова становится щитом) и к зеркалу: «какая твоя планета на 26° Тельца?»

**Открытая петля:** хук «закрывает глаз» (0:00) закрывается на 0:22: «Демон — лишь проходящая тень».

### Три хука (≤10 слов, 0–2 с)

| # | Тип | Хук (EN) | Перевод | Слов |
|---|---|---|---|---|
| A | promise / факт | **Every 2.867 days, the Demon Star closes its eye.** | Каждые 2,867 суток Демоническая звезда закрывает глаз. | 8 |
| B | contradiction | The "Demon Star" isn't evil. It's blinking. | «Демоническая звезда» не злая. Она моргает. | 7 |
| C | question | Is astrology's most feared star touching your chart? | Касается ли самая пугающая звезда астрологии твоей карты? | 8 |

**Рекомендую A.** Конкретное число, образ виден в кадре (звезда гаснет на 1,5 с), и ролик честно объясняет, почему «глаз закрывается». B — для обложки и A/B-теста в TikTok. C ближе всех к продаже через страх, оставь на крайний случай.

---

## 2. Сюжетная арка (story-weaver)

**LOGLINE.** Звезда, которую тысячи лет называли демоном, просто моргает. Тень оказывается затмением, а голова Медузы — щитом.

**6-PART SPINE**
1. **Hero:** зритель с планетой или углом около 26° Тельца, или тот, кто слышал «Алголь — худшая звезда».
2. **Mission:** видеть в карте карту, а не приговор.
3. **Villain:** ошибочное прочтение, ярлык «демона», который люди примеряют на себя.
4. **Guide:** Veyra расшифровывает: механика, миф, градус. Без советов.
5. **Journey:** (1) две звезды и затмение; (2) Медуза и Птолемей; (3) голова становится щитом Афины.
6. **Resolution:** 26°32′ Тельца, орбис ≤1°. Вопрос остаётся у зрителя.

**EMOTIONAL CURVE.** любопытство (0–3 с) → узнавание (3–9 с) → напряжение (9–15 с) → **откровение, пик на 19,5 с (≈65%)** → тишина (22–24 с) → приглашение (24–30 с).

**MASTER METAPHOR:** *глаз, который закрывается и открывается.* Затмение в начале, открытые глаза Медузы на пике, звезда снова вспыхивает перед финалом.

---

## 3. Сценарий 30 с (озвучка + текст на экране)

Темп около 2,4 слова/с, голос низкий и тёплый (ElevenLabs). Текст на экране короче озвучки и стоит в безопасной зоне.

| Таймкод | Озвучка (EN) | Перевод для Руты | Текст на экране (EN) |
|---|---|---|---|
| **0:00–0:03** | Every 2.867 days, the Demon Star closes its eye. | Каждые 2,867 суток Демоническая звезда закрывает глаз. | **Every 2.867 days, the Demon Star closes its eye.** (Cinzel) |
| 0:03–0:09 | Algol is two stars. One passes in front of the other, and the light fades. | Алголь — это две звезды. Одна проходит перед другой, и свет гаснет. | ALGOL · β PERSEI → 2 stars · 1 eclipse · ~10 h |
| 0:09–0:15 | The Greeks saw Medusa's head in Perseus's hand. Ptolemy gave it the nature of Saturn and Jupiter. | Греки видели в руке Персея голову Медузы. Птолемей дал ей природу Сатурна и Юпитера. | Medusa's head · Saturn + Jupiter (Ptolemy) |
| **0:15–0:22** (пик) | But her head became Athena's shield. What was feared became protection. | Но её голова стала щитом Афины. То, чего боялись, стало защитой. | From feared → to shield |
| 0:22–0:24 | The demon was only a shadow passing. | Демон — лишь проходящая тень. | (без текста, звезда снова вспыхивает) |
| 0:24–0:30 | In 2026, Algol sits at 26°32′ Taurus. Which of your planets is within one degree? | В 2026 году Алголь стоит на 26°32′ Тельца. Какая из твоих планет в пределах одного градуса? | **26°32′ Taurus · orb ≤ 1°** · Which planet of yours is here? |

Озвучка: 74 слова, около 30 с при паузах 0,3 с между битами.

**Что убрано из 40-секундной версии:** кадр с созвездием Персея, кадр «Сатурн + Юпитер», отдельный кадр кривой блеска (теперь она накладывается на двойную систему), строки «They feared it for two thousand years», «Tradition named it: losing one's head», «Rage that was silenced…», «Algol marks where your intensity…» и «Tell me below» (призыв остался в вопросе и в подписи).

---

## 4. Шот-лист и промпты (visual-prompt-architect)

Шесть кадров: пять генерируются (К1, К3, К5, К7, К9), К8 — реверс К1. В 40-секундной версии генераций было семь.

### Visual DNA (вставлять дословно в каждый промпт)
```
VISUAL DNA: cosmic-oracle aesthetic, deep night background #0B0D24, indigo #1B1F4B nebula haze,
teal #1F8A8A rim glow, warm gold #D4AF37 highlights and star light, pearl #F4EFE6 specular points,
rare touch of deep violet #3A1F5C only in the deepest shadows, fine star dust, soft volumetric glow,
subtle sacred-geometry linework, cinematic, film grain like Cinestill 800T, ultra-detailed, 9:16 vertical,
no text, no watermark, no logos.
```

### Лист персонажа «Медуза» (без изменений во всех кадрах)
```
MEDUSA: a serene woman's face sculpted from dark obsidian-like stone with veins of gold light, eyes closed,
calm and dignified, her hair made of slender luminous teal serpents drawn like constellation lines,
no blood, no wound, no gore, not a severed head — a face emerging from nebula.
```
> Правило безопасности. Никакой отрубленной головы и крови. Медуза — только светящаяся маска или созвездие.

### Негативный промпт (для платформ, где он есть)
```
text, letters, watermark, logo, blood, gore, severed neck, wound, horror, screaming face, cartoon,
neon pink, oversaturated, extra fingers, deformed face, low resolution, recognisable famous painting
```

---

**Кадр 1 · 0:00–0:03 · Хук «звезда закрывает глаз»** (Grok Image → Grok Animate)
- **Main prompt:** Extreme close-up of a single brilliant blue-white star with a faint orange companion beside it, floating in deep space, 100 mm macro telephoto look, shallow depth of field with bokeh of distant stars, the star's golden diffraction spikes and teal halo, volumetric nebula haze in indigo behind, mysterious and hypnotic mood, cinematic astrophotography style. + VISUAL DNA
- **Motion (Grok):** "Hold for 1 second, then the orange companion slides in front of the bright star; the light dims to a soft ember like an eye closing, halo shrinks; slow push-in throughout. 3 s."
- **Key decisions:** затемнение на 1–1,5 с совпадает со словом «closes»; оранжевый компаньон соответствует данным (Algol B — субгигант класса K).
- **Alt:** звезда в форме вертикального глаза, веко из тёмной туманности медленно закрывается.

**Кадр 3 · 0:03–0:09 · Двойная система + кривая блеска** (Seedance 6 с + Remotion-оверлей)
- **Main prompt:** Medium shot, cinematic scientific visualisation of a close binary star system: a large blue-white star and a smaller orange subgiant orbiting each other, a faint stream of gas flowing from the orange star toward the blue one, 50 mm, side lighting from the blue star casting the orange star's shadow into space, gold dust, quiet awe. + VISUAL DNA
- **Motion (Seedance):** start: две звезды рядом, оранжевая справа → motion: оранжевая проходит перед голубой, камера стоит → end: голубая наполовину затенена.
- **Оверлей (Remotion или CapCut), с 0:05:** тонкая золотая кривая блеска в нижней трети безопасной зоны: плато, провал, возврат; подписи `2.867 d`, `~10 h`. Фон под кривой затемнить на 30%.
- **Key decisions:** поток газа отсылает к «парадоксу Алголя»; одно действие на шот.

**Кадр 5 · 0:09–0:15 · Медуза появляется из туманности** (Grok Image → Grok Animate)
- **Main prompt:** Close-up portrait, MEDUSA [character sheet], emerging from an indigo nebula, her serpent-hair as luminous teal constellation lines slowly moving, 85 mm portrait lens, f/1.8, Rembrandt light from upper left in warm gold, rim light teal on the right, star dust drifting, solemn and mysterious, painterly cinematic realism. + VISUAL DNA
- **Motion:** "Serpent lines drift like underwater kelp, face remains still, eyes closed; slow pull-out. 6 s."
- **Key decisions:** закрытые глаза откроются в кадре 7; к 0:12 (слово «Ptolemy») в фоне туманности проступают два тусклых золотых орба — Сатурн и Юпитер — это можно сделать оверлеем в CapCut вместо отдельного кадра.
- **Alt:** силуэт профиля из звёзд, змеи — линии созвездий.

**Кадр 7 · 0:15–0:22 · Поворот: голова становится щитом (ПИК)** (Seedance, 7 с)
- **Main prompt:** Medium close-up, a round polished bronze-gold shield floating in space, on its surface the serene face of MEDUSA [character sheet] in relief, eyes now OPEN and glowing gold, calm not threatening, teal light radiating outward as a protective ring of sacred geometry, 50 mm, frontal backlight bloom, awe and quiet power, cinematic. + VISUAL DNA
- **Motion (Seedance):** start: туманный круг → motion: круг застывает в щит, лицо проявляется, глаза открываются → end: защитное кольцо света расходится волной.
- **Key decisions:** открытие глаз на 0:19,5 = единственная вспышка-белый; эгида с горгонейоном мифологически точна.
- **Alt:** женская рука (без лица) поднимает зеркальный щит, в нём отражается звезда.

**Кадр 8 · 0:22–0:24 · Звезда снова вспыхивает** (реверс кадра 1 в CapCut, без генерации)
- Последние 2 с анимации кадра 1 в обратную сторону: компаньон уходит, свет возвращается.

**Кадр 9 · 0:24–0:30 · Градус и вопрос** (Grok Image + текст в Remotion)
- **Main prompt:** Close-up of a luminous golden zodiac wheel segment for Taurus, a single bright point marked by a thin teal ring at the late degrees of the sign, the rest of the wheel fading into indigo night, 50 mm, soft frontal glow, inviting and intimate, sacred geometry, cinematic. + VISUAL DNA
- **Key decisions:** градус «26°32′» не генерируем в картинке, его даёт Remotion. Кольцо — это орбис ±1°.

---

## 5. Монтаж, звук, субтитры, экспорт (reels-editor)

### CUT PLAN
```
0:00.0  К1 макро-звезда, push-in            | TXT хук (Cinzel 56px) с 0:00.2           | низкий дрон + на 0:01.5 «вдох» тишины на затмении
0:03.0  жёсткий срез → К3 двойная система    | ALGOL · β PERSEI (Cinzel 48px)           | пульс (сердцебиение, −20 dB)
0:05.0  оверлей кривой блеска                | 2 stars · 1 eclipse · ~10 h              | на провале кривой пульс глушится на 0,5 с
0:09.0  срез → К5 Медуза                     | Medusa's head                            | вступает струнный пэд
0:12.0  оверлей орбов Сатурна и Юпитера      | Saturn + Jupiter (Ptolemy)               | пэд темнеет, LPF
0:15.0  РАСТВОРЕНИЕ 0,5 с → К7 щит            | From feared → to shield                  | на 0:19.5 открытие глаз = ВСПЫШКА-БЕЛЫЙ (1 раз) + шиммер (−14 dB)
0:22.0  срез → К8 звезда вспыхивает (реверс)  | —                                        | музыка раскрывается, мажорный аккорд
0:24.0  срез → К9 колесо Тельца               | 26°32′ Taurus · orb ≤ 1° + вопрос        | музыка до −26 dB, голос сухой и близкий
0:30.0  конец (луп на К1)                     |                                          | хвост дрона перетекает в старт
```
Переходы: срезы, одно растворение, одна вспышка. Последний кадр по яркости и цвету близок к первому — бесшовный луп.

### GRADE NOTES
1. Первичная коррекция: выровнять экспозицию и баланс белого между Grok и Seedance (у Seedance часто холоднее).
2. Look: тени в teal/indigo, света в тёплое золото, чёрные слегка приподняты, glow 10–15%, мелкое зерно.
3. LUT на 60–80%, тот же грейд, что у других star explainers.
4. Глубокий фиолет только в тенях кадра 5.

### MIX LEVELS
- Голос: от −12 до −6 dB (ElevenLabs: стабильность ~45%, низкий, тёплый, неспешный).
- Музыка: от −24 до −18 dB, эфирный скор (дрон + пэд) или трендовый звук из «ambient / cinematic».
- SFX от −18 до −12 dB: пульс, «вдох» тишины, один шиммер.
- Итог около −14 LUFS, пики ниже −1 dBFS.
- Цепочка голоса: лёгкое шумоподавление (оставить 10–20% комнаты) → high-pass 100 Hz → +2 dB на 3–4 kHz → компрессия 3:1.

### SUBTITLE STYLE
- Автосубтитры CapCut, потом ручная проверка: **Algol, Perseus, Medusa, Ptolemy, Athena, 26°32′**. Символ «′» часто ломается, вставь вручную или пиши «26°32'».
- Jost 32–34 px, pearl `#F4EFE6`, мягкая тень, ключевые слова золотом `#D4AF37`. Заголовки Cinzel 48–64 px.
- Безопасная зона: не занимать верхние 15% (0–288 px) и нижние 20% (1536–1920 px), поля по бокам 108 px. Субтитры примерно на 1150–1450 px; кривая блеска выше субтитров.
- Строка 1–4 с, появляется за 0,2–0,5 с до слова, мягкое проявление 0,3 с.

### EXPORT SETTINGS
- 1080×1920, 9:16, 30 fps, H.264, 12 Mbps, AAC 256 kbps, 48 kHz.
- Один раз посмотри экспорт с телефона: чёрные кадры, рассинхрон, опечатки в «26°32′».
- Обложка: кадр 7 (щит с открытыми глазами) + текст хука B «The "Demon Star" isn't evil.» Cinzel, в безопасной зоне.

---

## 6. Подпись, хэштеги, CTA

**Caption (EN):**
```
For two thousand years they called it the Demon Star, because every 2.867 days its light fades.
Now we know why: Algol is two stars, and one passes in front of the other.

Medusa's head in Perseus's hand. Ptolemy's star of Saturn and Jupiter.
And in the myth itself, her head becomes Athena's shield.
What was feared becomes protection.

In 2026 Algol sits at 26°32′ Taurus (tropical). I read it by longitude, within a 1° orb only.

Which of your planets lives here? Tell me below 👁️
Save this for when someone calls it "the worst star".

#fixedstars #astrology #Algol #Medusa #starseed #astrologytok #VeyraOracle
```
Перевод для Руты: «Две тысячи лет её называли Демонической звездой, потому что каждые 2,867 суток её свет гаснет. Теперь мы знаем, почему: Алголь — это две звезды, и одна проходит перед другой. Голова Медузы в руке Персея. Звезда Сатурна и Юпитера у Птолемея. И в самом мифе её голова становится щитом Афины. То, чего боялись, становится защитой. В 2026 году Алголь стоит на 26°32′ Тельца (тропический зодиак). Я читаю её по долготе и только в орбисе 1°. Какая из твоих планет живёт здесь? Напиши внизу. Сохрани, когда кто-то назовёт её „худшей звездой“».

- Хэштегов 7: 2 широких (#astrology, #astrologytok), 4 нишевых (#fixedstars, #Algol, #Medusa, #starseed), 1 брендовый (#VeyraOracle). Эмодзи один.
- **CTA:** комментарий («which planet») плюс сохранение («save this»). Без продажи.
- **Закреплённый комментарий (мост к продукту):** `Want to see which fixed stars sit within 1° of your planets? Fixed Star Oracle shows them.` Подтверждено Рутой: приложение это умеет.
- **Кросс-пост.** TikTok: тот же файл, 3–5 хэштегов (#fixedstars #Algol #astrologytok #VeyraOracle), хук B для A/B-теста. YouTube Shorts: заголовок `Why Algol Is Called the Demon Star (It's an Eclipse)`, в описании одна строка с градусом.

---

## 7. Проверка голоса (brand-guardian) — 16/16

| Критерий | Балл | Комментарий |
|---|---|---|
| 1. Hero — зритель | 2 | «your planets» |
| 2. Зеркало, не совет | 2 | нет «you must», финал — вопрос |
| 3. Проверяемый факт | 2 | 2,867 сут, 26°32′ Тельца, орбис ≤1° |
| 4. Палитра и шрифты | 2 | DNA-блок, Cinzel/Jost |
| 5. Хук ≤10 слов | 2 | 8 слов |
| 6. Без страха и гарантий | 2 | «Demon Star» — историческое имя, сразу переосмыслено; «losing one's head» в 30-секундной версии убрано |
| 7. Естественный английский | 2 | |
| 8. CTA приглашает | 2 | вопрос + сохранение, продукт только в закреплённом комментарии |

---

## 8. Факт-лист для проверки (reality-checker)

**VERDICT: почти READY.** Остаются пункты [CHECK] ниже, особенно цитата Птолемея и даты Солнца.

### Астрономия
| Факт | Значение | Статус |
|---|---|---|
| Обозначение | Algol = β Persei (Beta Persei), 26 Per, HIP 14576, HR 936 | надёжно |
| Тип | затменная переменная, прототип класса EA; тройная система: Algol A (B8 V), Algol B (K0–K2 IV субгигант), Algol C (≈A–F, орбита ≈1,86 г) | надёжно; спектр. классы ±подкласс [CHECK] |
| Период затмения | **2,867 сут ≈ 2 сут 20 ч 49 мин** (2,8673 сут) | надёжно |
| Блеск | ≈ 2,1 m в максимуме → ≈ 3,4 m в главном минимуме | [CHECK] точные значения (2,12 / 3,39 по GCVS) |
| Длительность затмения | ≈ 10 ч | [CHECK], на экране «~10 h» |
| Расстояние | ≈ 90 св. лет (≈ 28 пк) | надёжно в пределах ±3 св. лет |
| Открытие | переменность отметил Монтанари (1667); период и объяснение затмением — Гудрайк (1782–1783) | год Монтанари [CHECK] (1667 или 1669); в ролике не упоминается |
| «Парадокс Алголя» | менее массивная звезда B эволюционировала дальше, потому что отдала массу звезде A | надёжно (кадр 3) |
| Гипотеза о Египте | Jetsu et al. (2013), «Каирский календарь» | **спорная, в ролик НЕ включено** |

### Положение (тропическое, по долготе, рассчитано)
Исходные данные: RA 03h 08m 10,13s, Dec +40° 57′ 20,3″ (J2000, Hipparcos). Наклон эклиптики 23,4392911°. Общая прецессия по долготе 5028,80″/столетие (IAU 2006). Собственным движением (~3 mas/г) можно пренебречь.

| Эпоха | Тропическая долгота |
|---|---|
| J2000,0 | **26°10′ Тельца** (λ = 56,168°), β ≈ +22°26′ |
| 2026,0 | **26°32′ Тельца** |
| 2026,8 (19.10.2026) | 26°32,5′ Тельца |
| 2030,0 | 26°35′ Тельца |
| ≈2060 | 27°00′ Тельца |

- **Метод (по `veyra-core.md`):** основной — соединение по эклиптической долготе, орбис ≤1°. В 2026 г. засчитываются планеты и углы от **25°32′ до 27°32′ Тельца**.
- **Парантеллоны** — дополнительный слой. У Алголя широта ≈ +22°, поэтому паран-картина может заметно отличаться от долготной; для неё нужны дата, время и место рождения. В ролике не используются; если когда-нибудь цитируются, подписываются словом «paran».
- **Солнце на Алголе:** примерно **16–17 мая** (окно орбиса ≈ 15–18 мая) [CHECK по эфемериде].
- Сидерически (Лахири ≈24°13′ в 2026) около **2°20′ Тельца** [CHECK]. Поэтому в подписи стоит «tropical».

### Традиция
- **Название.** Араб. *ra's al-ghūl*, «голова гуля». Caput Medusae / Gorgonea Prima. Евр. *Rosh ha-Satan* [CHECK источник]. Кит. 大陵五 [CHECK].
- **Птолемей, «Тетрабиблос» I.9:** звёзды в голове Горгоны «подобны Сатурну и Юпитеру» [CHECK формулировку по Robbins, Loeb 1940].
- **Классическая традиция** (Робсон, 1923): самая «злотворная» звезда, «потеря головы». В 30-секундной версии эта линия не звучит.
- **Миф.** Персей отсекает голову Медузы, глядя в зеркальный щит; горгонейон потом на эгиде Афины (Гесиод, Овидий, Метаморфозы IV–V).

### Современное прочтение
- Брейди (*Brady's Book of Fixed Stars*, 1998): сильная женская страсть и сила [CHECK формулировку].
- Сиксу, «Смех Медузы» (1975).
- Позиция Veyra: то, чего боялись, становится щитом. Это потенциал, не прогноз и не совет.

### Продукт
- Fixed Star Oracle показывает звёзды в пределах 1° от планет — подтверждено Рутой 19.10.2026.

### Что не говорим
- Нет «ты потеряешь голову», «опасности», «проклятия», медицинских утверждений и обещаний судьбы. Нет отрубленной головы и крови.

---

## 9. RUTA'S HANDS-ON STEPS

1. **Сверь [CHECK]:** Птолемей (Robbins), даты Солнца на Алголе, блеск по GCVS.
2. **Grok Image:** кадры 1, 5, 9 (Visual DNA + Medusa sheet дословно).
3. **Анимация:** К1 и К5 в Grok Animate, К3 и К7 в Seedance (6–7 с, одно действие). К8 — реверс К1 в CapCut.
4. **ElevenLabs** по колонке «Озвучка (EN)»; произношение *AL-gol*, *PER-see-us*, *TOL-uh-mee*.
5. **Remotion или CapCut:** кривая блеска поверх К3, орбы Сатурна и Юпитера поверх К5, финальный градус «26°32′ Taurus · orb ≤ 1°».
6. **CapCut:** собрать по CUT PLAN, грейд, −14 LUFS, проверить субтитры.
7. **Экспорт** 1080×1920 / 30 fps / H.264 / 12 Mbps, один просмотр с телефона.
8. **Опубликуй сама**, когда будешь готова; закрепи комментарий про Fixed Star Oracle. Лучшее окно по смыслу — около 16–17 мая, но ролик вечнозелёный.
