# The Forgotten Grimoire · Character Sheet — The Witch

**Серия:** The Forgotten Grimoire (рубрика 4, *The Witch*)
**Роль:** безымянная травница-ведьма, хранительница гримуара. Повторяется в каждом ролике.
**Статус:** черновик для Руты. Ничего не сгенерировано и не опубликовано.
**Основа:** девушка из ролика Руты про наперстянку (foxglove), два кадра. Описание взято только из заметок Руты. Всё, что придумано сверх них, помечено **[CHOICE]**; Рута утвердила все [CHOICE] как есть (2026-10-19), это канон. Непроверенное помечено **[CHECK]**.

> Язык. По `veyra-core.md` промпты на английском, пояснения для Руты на русском.
> Имя. У неё нет имени. Не называть её Veyra, не давать ей имени ни в промптах, ни в подписях. В промптах она "the witch" или "the woman".
> Одно лицо. По правилу рубрики: генерировать только от одного фиксированного референса и никогда её не перерисовывать.

---

## 1. Locked identity block

Вставлять **дословно** в каждый промпт с ней. Ни слова не менять, не сокращать, не переводить.

```
IDENTITY: a woman in her mid-to-late twenties with light skin and faint freckles across her nose and cheeks, a soft oval face, defined natural brows, warm brown eyes, a gentle closed-lip half-smile, rosy lips, natural minimal makeup; long voluminous loose-curled chestnut-brown hair with warm caramel-honey highlights, a soft centre part, slightly tousled, falling below her chest over both shoulders; wearing an oversized chunky-knit charcoal-grey V-neck cardigan sweater with loose, slightly long sleeves.
```

Короткая версия (только для платформ с жёстким лимитом длины, например поле motion-промпта в Seedance, когда лицо уже задано картинкой):

```
the same freckled woman with long chestnut-caramel wavy hair in the oversized charcoal-grey chunky knit sweater from the reference image
```

### Never change (запрещено менять)
- Лицо: овал, веснушки на носу и щеках, брови, карие глаза, мягкая полуулыбка с закрытыми губами.
- Цвет кожи (светлый), возраст (середина/конец 20-х). Не старить, не омолаживать до подростка.
- Волосы: длина ниже груди, объём, свободные волны, каштан с карамельно-медовыми прядями, пробор примерно по центру. Не стричь, не выпрямлять, не перекрашивать, не собирать в пучок.
- Свитер: оверсайз, крупная вязка, угольно-серый, V-вырез / кардиган. Без смены цвета.
- Макияж минимальный. Без стрелок, яркой помады, контуринга.
- Свет тёплый, свечной/ламповый. Её не снимают в холодном дневном или неоновом свете.
- Безымянность.

### Negative prompt (для платформ, где он есть)

```
different face, changing facial features, heavy makeup, red lipstick, eyeliner wings, straight hair, short hair, updo, ponytail, blonde hair, black hair, red hair, dyed hair, bangs, tattoos, piercings, glasses, pointed witch hat, green skin, crone, old woman, teenager, cosplay costume, Halloween costume, cleavage, sexualized pose, plastic skin, airbrushed skin, cold daylight, neon light, blue cast, text, letters, readable words, watermark, logo, signature, extra fingers, deformed hands, poison label, skull and crossbones, dropper, measuring spoon, pouring liquid
```

---

## 2. Канон: гардероб, волосы, свет, реквизит, сеты

### Гардероб
| | Канон |
|---|---|
| Верх | Оверсайз свитер-кардиган крупной вязки, угольно-серый, V-вырез, свободные рукава (из заметок). |
| Рукава | Слегка длинные, могут наполовину закрывать ладони **[CHOICE]** (уютный жест, помогает прятать сложные руки). |
| Под свитером | Простая кремовая (Pearl `#F4EFE6`) майка или рубашка, почти не видна в V-вырезе **[CHOICE]**. |
| Низ (только для full-body) | Длинная мягкая юбка или свободные брюки тёмного индиго/угольного цвета **[CHOICE]**, в кадрах не было. Босиком или шерстяные носки **[CHOICE]**. |
| Украшения | Нет **[CHOICE]**. Если Рута захочет одно, то тонкое золотое кольцо, всегда то же самое. |

### Волосы
Распущены всегда. Объём и лёгкий беспорядок обязательны. В движении (Grok / Seedance) волосы могут чуть колыхаться, но причёска не меняется.

### Свет (канон)
- Ключ: тёплый золотой свет свечи или лампы, янтарное свечение, 2200–2700 K **[CHOICE: диапазон температуры]**.
- Контровой мягкий свет в волосах (rim light) из заметок, ставим его сзади-сбоку, со стороны второй свечи **[CHOICE: направление]**.
- Ключ сбоку-спереди, низко (как от свечи на столе), поэтому мягкие тени ложатся вверх-назад, на противоположную сторону лица. Описывая тени, не противоречить этому.
- Малая глубина резкости, боке из свечей.
- Тени уходят в индиго/ночь (`#1B1F4B` / `#0B0D24`), не в чистый чёрный и не в коричневый.

### Палитра в кадре (бренд)
- **Gold ведёт:** пламя, янтарь, золото на книге (`#C9A227` / `#D4AF37`).
- **Parchment/Pearl как светлый тон:** страницы, свет на коже, белое одеяло.
- **Indigo/Night в тенях** и в окне с ночным небом.
- **Teal тихий акцент:** один предмет, например стеклянная бутылочка или лента-закладка цвета `#1F8A8A` **[CHOICE]**.
- Приглушённый фиолетовый в ботанической иллюстрации допустим как редкий акцент (Deep violet).

### Реквизит
| Предмет | Канон |
|---|---|
| **Гримуар** (главный) | Толстая старая книга, рваные неровные (deckled) пергаментные страницы, золотой орнамент из сусального золота, ботаническая иллюстрация в приглушённых фиолетово-зелёных тонах, заголовок готическим шрифтом (blackletter). В генерации заголовок **нечитаем** (см. п. 5), шрифт и текст добавляются в CapCut/Remotion. |
| Сушёные травы | Пучки, подвешенные вниз головками; травы россыпью на столе. |
| Свечи | Несколько, разной высоты, кремовый воск. |
| Фонарь | Старый металлический фонарь со свечой. |
| Янтарные аптекарские бутылочки | Только как фон и декор, закрытые, **без этикеток с надписями**. Никто их не открывает, не наливает, не отмеряет (п. 5). |
| Оловянные кубки | На столе, пустые или не видно содержимого. |

### Сеты
1. **Спальня (cosy bedroom).** Лежит на белом одеяле, читает гримуар, рядом лампа.
2. **Кабинет (study).** Тёмный деревянный стол, книжные полки, пучки трав над головой, свечи, фонарь, янтарные бутылочки, оловянные кубки, травы на столе.
3. Новые сеты допускаются, только если в них есть: тёплый свечной свет + старая книга + сушёные травы (правило рубрики).

### Что может меняться и что никогда
| Может меняться | Никогда не меняется |
|---|---|
| Сет (спальня / кабинет / окно с ночным небом) | Лицо, веснушки, глаза, улыбка |
| Поза (лежит, сидит, стоит у полки) | Волосы: длина, цвет, волна, пробор |
| Направление взгляда: обычно опущен в книгу, изредка поднят в камеру (для обложек) | Свитер и его цвет |
| Какая страница открыта (растение, сигил, звезда) | Тёплый свечной свет и rim light |
| Кадр: от макро рук до общего плана | Гримуар (один и тот же объект) |
| Время: вечер или ночь | Минимальный макияж, без украшений сверх канона |
| Движение: перелистывание, дыхание, пламя, пылинки | Безымянность, отсутствие читаемого текста в картинке |

---

## 3. Промпты

### Visual DNA (общий хвост, дословно в каждый промпт серии)

```
DNA: warm candlelit world, golden amber key light from low candles, soft gold rim light in her hair, shadows falling into deep indigo and night blue, aged parchment and pearl highlights, one quiet teal accent, dried herb bundles hanging, faint dust motes in the light, shallow depth of field with candle bokeh, painterly cinematic realism, Kodak Portra 400 skin tones, highly detailed, no text, no letters, no watermark, no logo.
```

Сборка любого промпта: `[SHOT] + IDENTITY + [SCENE/ACTION] + [CAMERA] + DNA + [ASPECT]`.

---

### 3.1 Reference sheet (база для всех будущих генераций)

Генерировать сначала их. Лучший кадр из 3.1-B (лицо крупно) становится **master reference** (см. п. 4).

**A. Turnaround: front / three-quarter / profile** (16:9, чтобы три фигуры поместились)

```
Character reference sheet, three views of the same woman side by side on a plain warm parchment-toned studio background: front view, three-quarter view, and left profile view, head-and-shoulders to waist, neutral relaxed posture, eyes looking straight ahead in each view. IDENTITY: [paste locked identity block]. Even soft warm key light from the front-left at 2700K, gentle gold rim light on the hair from behind, consistent lighting across all three views, no harsh shadows. 85mm lens, f/8 so all three views are sharp, eye-level camera. Clean model-sheet layout, identical face, hair, sweater and proportions in every view, photorealistic, highly detailed skin texture with visible freckles, no text, no labels, no watermark. --ar 16:9
```

Варианты для Midjourney: добавить `--style raw --ar 16:9`.

**B. Close-up face (master reference кандидат)** 4:5

```
Close-up portrait, head and shoulders. IDENTITY: [paste locked identity block]. She looks softly down toward an open book just below frame, eyelids lowered, gentle closed-lip half-smile, a few loose curls falling across one cheek. Low warm candle light from the front-left lights her face at 2400K, the right side falls into soft shadow tinted indigo, a thin gold rim light outlines her hair from behind-right. 85mm portrait lens, f/1.8, eye-level, focus on the freckles and lashes, candle bokeh behind her. DNA: [paste DNA]. --ar 4:5
```

Второй вариант того же кадра для набора референсов: `she lifts her eyes and looks directly into the camera, same half-smile` (нужно для обложек).

**C. Hands on the book** 4:5 (руки в заметках не описаны: светлая кожа как у лица, короткие ухоженные ногти без лака **[CHOICE]**)

```
Macro detail shot of her hands resting on an open old grimoire, sleeves of an oversized chunky-knit charcoal-grey sweater falling over her wrists, light skin, short natural unpainted nails, one fingertip touching the edge of a page. The grimoire: thick antique book with torn deckled parchment pages, gold-leaf ornamental borders, a botanical illustration in muted violet and sage green, a blackletter title that is blurred and illegible. Low warm candle light from the left, gold glow on the gilding, soft shadow under the fingers falling to the right. 100mm macro lens, f/2.8, overhead three-quarter angle, a few dried herb leaves on the page edge. DNA: [paste DNA]. --ar 4:5
```

**D. Full body, seated at the study table** 9:16

```
Full-body shot, seated. IDENTITY: [paste locked identity block]. Below the sweater a long soft skirt in deep indigo-charcoal, bare feet tucked beside the chair leg. She sits at a dark wooden table, one elbow on the table, reading an open grimoire, eyes lowered to the page. Behind her tall bookshelves fall into indigo shadow, bundles of dried herbs hang from a beam above, closed unlabeled amber apothecary bottles and pewter cups stand at the edge of the table, an old iron lantern and several candles light the scene. Key light from the candles on the table, front-left and low, soft shadows rising behind her to the right, gold rim light on her hair from a candle behind. 35mm lens, f/2.8, eye-level, camera slightly to the left. Her face sits between 25% and 50% of frame height; the top 15% is dim beam and herbs, the bottom 20% is dark table surface, calm and free for titles. DNA: [paste DNA]. --ar 9:16
```

---

### 3.2 Сцены (9:16, 1080×1920, safe zone)

Правило композиции для всех сцен: лицо и книга внутри центральной зоны (между 15% сверху и 20% снизу, 10% поля по бокам). Верх и низ кадра спокойные, тёмные или мягко размытые, чтобы туда легли титры в CapCut. Никакого текста в самой картинке.

**S1. Herbarium (страница растения)**

```
Medium close-up from a slightly high angle. IDENTITY: [paste locked identity block]. She sits at a dark wooden study table and turns a page of her grimoire; the open spread shows a hand-painted botanical illustration of a flowering plant in muted violet and sage green, edges of the parchment torn and deckled, gold-leaf ornament in the corners, a pressed dried flower lying in the gutter of the book. Her eyes are lowered to the drawing, gentle half-smile. Bundles of dried herbs hang above her, out of focus. Warm candle key light from the front-left, low; gold rim light in her hair from a candle behind-right; shadows fall into deep indigo. 50mm lens, f/2, her face at about 35% of frame height, the book at about 60%; top 15% soft dark herbs, bottom 20% dim table, 10% calm margins at the sides. DNA: [paste DNA]. --ar 9:16
```

**S2. Sigils (печать загорается)**

```
Close-up over-the-shoulder shot. IDENTITY: [paste locked identity block]. She leans over an open grimoire at night; on the parchment page a single circular hand-drawn seal of fine lines and geometric strokes begins to glow gold, light rising from the ink and catching her face from below. Her eyes are lowered to the glowing seal, lips softly closed. The rest of the room falls into indigo night, two candles in soft bokeh, a single teal glass bottle as a quiet accent in the background. Underlight from the seal plus a warm candle key from the left; gold rim on her hair from behind. 50mm lens, f/1.8, shot from behind her right shoulder, seal centred at about 55% of frame height; top 15% and bottom 20% stay dark and empty. DNA: [paste DNA]. --ar 9:16
```

Примечание для Руты: сам сигил (его линии) вставлять из твоего настоящего рисунка поверх в CapCut/Remotion. В промпте он нарочно общий, чтобы модель не придумала «чужой» знак. Значение сигила только от тебя, иначе `[CHECK]`.

**S3. Star Pages (звёздная страница)**

```
Medium shot. IDENTITY: [paste locked identity block]. She sits by a tall window at night with the grimoire open on her knees; the spread shows a hand-inked star chart with fine gold constellation lines and tiny gilded stars on dark parchment. Through the window a deep indigo night sky with soft nebula haze and scattered stars. She looks up from the book toward the window, gentle half-smile, eyes catching starlight. Warm candle light on the sill lights her face from the front-left; cool indigo night light from the window outlines her right side; gold rim light in her hair. 35mm lens, f/2.2, eye-level, her face at about 40% of frame height; top 15% calm night sky without bright stars, bottom 20% dim blanket and book edge. DNA: [paste DNA]. --ar 9:16
```

Звёздная карта в кадре декоративная. Никакие реальные позиции, градусы и орбы в картинку не закладываются; все данные о звезде идут текстом в монтаже по правилам Facts.

**S4. Carousel cover (обложка, 9:16 для TikTok-карусели; для Instagram пересобрать в 4:5)**

```
Cinematic portrait cover. IDENTITY: [paste locked identity block]. She lies on her stomach on a white duvet in a cosy candlelit bedroom, the open grimoire in front of her, chin resting on one hand in a loose sleeve; she lifts her eyes from the page and looks directly into the camera with a calm knowing half-smile. A warm bedside lamp to the left, several candles in soft bokeh, a bundle of dried herbs hanging from the bedpost. Lamp key light from the left at 2700K, gold rim light in her hair from a candle behind; the far side of the room dissolves into indigo shadow. 85mm lens, f/1.6, low angle at mattress level, her eyes at about 45% of frame height; top 15% soft dark wall free for the Cinzel title, bottom 20% blurred white duvet free for the subtitle. DNA: [paste DNA]. --ar 9:16
```

4:5 версия: тот же промпт, `--ar 4:5`, лицо на 40% высоты, сверху 12% свободно.

---

### Альтернативный вариант (другое настроение)

Для смены ритма раз в несколько недель: «рассвет над гримуаром». Тот же IDENTITY и DNA, но свечи догорели, из окна идёт первый холодный рассвет, перламутровый, а единственная свеча ещё горит золотом.

```
Wide quiet shot at blue hour. IDENTITY: [paste locked identity block]. She has fallen asleep at the study table, cheek resting on the open grimoire, hair spilling over the parchment pages. Candles burned down to stubs, one last flame still glowing gold beside her; pale pearl dawn light enters from a window on the right, mixing with the indigo room; dried herbs hang in silhouette. 24mm lens, f/4, eye-level from across the table; she sits in the middle third, top 15% hanging herbs in silhouette, bottom 20% dark table. DNA: [paste DNA]. --ar 9:16
```

### Key decisions
- **85 мм для лица, 35–50 мм для сцен, 100 мм макро для рук:** портретное сжатие держит черты лица стабильными; 35–50 мм показывают сет и не искажают лицо.
- **Ключ свечой спереди-слева и низко, rim сзади-справа:** одна схема света во всех кадрах, поэтому её проще узнать; тени всегда уходят вправо-вверх и в индиго.
- **Глаза опущены в книгу по умолчанию:** так в заметках; это держит жанр «зритель листает вместе с ней». Взгляд в камеру только для обложек.
- **Portra 400 и painterly realism:** Portra даёт тёплую кожу и сохраняет веснушки; painterly связывает её с иллюстрированными страницами.
- **Никакого текста в генерации:** blackletter-заголовок и подписи кладутся поверх в CapCut/Remotion (Cinzel/Jost), иначе модель напишет абракадабру или запрещённое слово.

---

## 4. Workflow консистентности

**Главное правило:** всегда прикладывать её **master reference** (лучший кадр лица) как image reference. Плюс всегда вставлять IDENTITY дословно. Картинка держит лицо, текст держит волосы и свитер.

### Шаг 0. Выбрать master reference
1. Взять лучший кадр из твоего foxglove-видео **или** лучший результат 3.1-B. Критерии: лицо анфас или 3/4, глаза видны, веснушки читаются, волосы и свитер в кадре, тёплый свет, без размытия движения.
2. Обрезать до головы и плеч, без текста и без бутылочек в кадре. Сохранить как `witch-master.png` (рекомендую положить в `content/characters/refs/`, в репо его пока нет, Рута пришлёт **[CHECK]**).
3. Дополнительно собрать набор из 3–5 картинок: master, turnaround (3.1-A), руки (3.1-C), full body (3.1-D). Каждый новый удачный кадр не добавлять в референсы автоматически, иначе лицо «уплывёт». Набор обновлять только осознанно.

### Grok (Imagine / Aurora)
- Загрузить `witch-master.png`, затем промпт: `Use the woman in the attached image as the exact same character. Keep her face, freckles, hair and sweater identical.` + IDENTITY + сцена + DNA.
- Для анимации описывать движение явно: `slow push-in, she turns one page, hair drifting slightly, candle flames flicker, she raises her eyes on the beat`. Одно действие на клип.
- Если лицо поплыло, не править словами, а перегенерировать от той же master-картинки.

### Midjourney
Версии и параметры меняются, перед использованием проверить в документации **[CHECK]**.
- **V7:** omni reference: `--oref <URL witch-master> --ow 100` (вес 1–1000; 100 по умолчанию; поднимать до 250–400, если лицо уходит; слишком высокий вес тянет за собой позу и фон референса).
- **V6.x:** character reference: `--cref <URL witch-master> --cw 100` (лицо + волосы + одежда). `--cw 0` держит только лицо, полезно, если в редком кадре нужна другая одежда (по канону почти никогда).
- **Стиль:** `--sref <URL лучшей сцены из 3.2> --sw 100` держит свет и палитру серии (sw 0–1000). Стиль-референс и персонаж-референс это разные картинки: в `--sref` не класть лицо, иначе смешаются.
- Всегда `--style raw --ar 9:16`. Вес частей промпта через `::`, например `candlelit grimoire scene::2 nebula haze::0.5`.
- Пример хвоста: `--ar 9:16 --style raw --oref https://…/witch-master.png --ow 150 --sref https://…/scene-herbarium.png --sw 120`

### Flux Kontext
- Работать как редактор от master-картинки: загрузить master и писать **что меняется**, а не всю сцену заново:
  `Keep the same woman: identical face, freckles, brown eyes, long chestnut-caramel wavy hair and oversized charcoal-grey chunky knit sweater. Change only the setting: she now sits at a dark wooden study table with hanging dried herbs, candles and an open old grimoire, warm candle light from the left, gold rim light in her hair.`
- Одна правка за проход (сет, потом поза, потом свет). Несколько правок сразу размывают лицо.
- Для длинных фотореалистичных описаний (Flux Pro / Dev без Kontext) вставлять IDENTITY + DNA полностью и добавлять `photorealistic, natural skin texture, visible freckles`.

### Seedance (и Hedra)
- Режим image-to-video: первым кадром ставить готовую картинку из Grok/MJ/Flux, уже сделанную от master. Не генерировать её с нуля из текста.
- Одно действие на шот, 3–6 с. Описывать: **начало → движение → конец**.
  Пример: `Start: she reads with eyes lowered. Motion: she slowly turns one parchment page, a curl slides over her shoulder, candle flames flicker. End: she rests her hand on the new page, half-smile. Camera: slow push-in, no shake.`
- Описание персонажа одинаковое во всех шотах (короткая версия IDENTITY из п. 1).
- Если доступен reference-to-video с несколькими картинками, давать master + full body **[CHECK: зависит от версии Seedance]**.
- Hedra (если нужен lip-sync голосом из ElevenLabs): только кадр лица анфас/3/4 от master, рот виден, руки вне кадра.

### Общие советы
- Генерировать пачкой в одной сессии и одним сидом (`--seed` в MJ), когда возможно.
- Не делать её улыбку шире: широкая улыбка меняет лицо сильнее всего.
- Руки самая частая ошибка: прятать в рукава, держать на книге, снимать макро отдельно.
- Каждую финальную картинку сверять с master рядом: веснушки, пробор, цвет свитера. Не совпало, значит в корзину.

---

## 5. Правило Herbarium и кадр с наперстянкой

- **Решение Руты (2026-10-19):** заголовок страницы наперстянки теперь латинский: ***Digitalis***. Слово "Poison" больше не используется.
- В двух старых кадрах foxglove-ролика заголовок "Foxglove Poison" размыт: `refs/foxglove-bedroom-digitalis-blur.jpg` и `refs/foxglove-study-digitalis-blur.jpg`. Если эти кадры идут в ролик, брать только эти версии. На видео (не на стоп-кадрах) заголовок размыть или закрыть в CapCut тем же способом. Новую надпись *Digitalis* добавляет монтаж.
- Фольклорную подпись (например, легенды о «перчатках фей», folk's glove) проверить по источнику перед публикацией **[CHECK]**.
- В подписи к ролику можно добавлять: "Folklore only. Foxglove is toxic; this is not a remedy." (или подобное, на твой вкус).
- **Не показывать:** бутылочки с этикеткой «poison», череп с костями, капельницы, ложки-мерки, весы, ступку в процессе, наливание жидкости в кубок, то, как она растирает или заваривает растение, растение рядом с едой или питьём. Оловянные кубки и янтарные бутылочки остаются фоном: закрытые, без этикеток, никто их не трогает.
- **Можно:** сушёные пучки на балке, иллюстрация растения на странице, засушенный цветок между страницами, она читает и улыбается.
- Генерации никогда не пишут читаемый текст (`no text, no letters` в DNA). Все заголовки добавляет монтаж, значит формулировку контролирует Рута.

---

## 6. Проверка
- Имени нет, нигде не названа Veyra.
- Внешность только из заметок Руты; придуманное отмечено [CHOICE] и утверждено Рутой (рукава на ладонях, майка под свитером, низ и обувь для full-body, руки/ногти, температура и направление света, teal-акцент, отсутствие украшений).
- Палитра: золото ведёт, пергамент светлый тон, индиго/ночь в тенях, teal тихий акцент, фиолетовый только в иллюстрации.
- Все сцены 9:16 с safe zone (верх 15%, низ 20%, бока 10%), текста в картинках нет.
- Нет рецептов, доз, «ядовитой» инструкции. Заголовок наперстянки заменён на *Digitalis*, в старых кадрах размыт. [CHECK] стоит на легенде о наперстянке, на версиях параметров MJ/Seedance и на файле master reference.
- Сходства с реальными людьми и чужими персонажами не закладываем: если результат похож на знаменитость, перегенерировать.
- Ничего не опубликовано. Публикует только Рута вручную.
