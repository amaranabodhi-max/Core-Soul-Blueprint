# Herbarium of the Forgotten Witch — Canon

**The single source of truth for the series.** It does not change from page to page. If any other file (`.claude/veyra-core.md`, `content/characters/the-witch.md`, `content/herbarium/episode-arc.md`, a page) says something different, this file wins.

The Monday agent reads this file and `INDEX.md` before every new page.

## World and story
- **Two worlds:** dark folk fairytale, candle and moon, in two times.
  - **Past:** the Grand Duchy of Lithuania, Vilnius and its outskirts, around 1550. She is a herbalist. Wooden houses with steep roofs, birches, a wooden chapel.
  - **Present:** Yorkshire, 2026. Wet paths, dry-stone walls, fog, heather moors.
- **Heroine:** in the past, a herbalist with a braid, in a linen dress. In the present, a modern young woman in a cardigan (the fixed photos) who remembers nothing and does not remember that she wrote the herbarium herself. Every page is a plant tied to her forgotten life.
- **No name, in either time.** Nobody names her, not even Veyra.
- **Voice:** Veyra off-screen, as guide and decoder, not the heroine.
- **The book is an inventory of her losses:** she wrote each warning after she had paid that price herself.
- **History:** no real historical figures. Facts of the period (daily life, clothing, hygiene, healing) are only real and verified, kept general, never recipes. Everything about the witch and the plants is fiction.
- **How an episode opens:** alternate between a fact of the period and a line of her own.
- **Only fiction:** invented plants, invented properties, invented "poisons". No real plants passed off as invented ones, no recipes, no doses, no preparation, no use.

## Heroine (anchors for every prompt)
Fixed reference images, attached to every generation of her:
- `content/characters/refs/witch-portrait.jpg` (face)
- `content/characters/refs/witch-master.jpg` (full figure, front, profile, back)

- **HEROINE (present):** young woman, long wild wavy chestnut hair with copper highlights, hazel-green eyes, light freckles, soft knowing half-smile, oversized charcoal knit cardigan
- **HEROINE (past):** the same young woman, hair in a single loose braid, plain linen dress, cold blue misty light, the plant's teal glow on her face
- No ring, no jewellery, in the present or the past.
- **Framing:** in present-day scenes the heroine is never shown full length. The shot is set in each scene.
- Detailed generation sheet (identity block, light, sets, tool workflow): `content/characters/the-witch.md`.

## Plant and series references
- Every plant that has a reference image is drawn from it in every prompt, like the heroine's photos: the image is attached and the page's FLOWER anchor points to it.
- **Hollowbell:** `content/herbarium/refs/hollowbell-ref.png` — the main image of the flower for all prompts.
- **Series cover:** `content/herbarium/refs/herbarium-cover.png` — the sheet with four plants, for carousels and previews.
- **Book sheets:** `content/herbarium/refs/NN-name-page.png` (`01-hollowbell-page.png`, `02-dusklantern-page.png`) — the style model for every new book sheet.
- **Bride's Shadow sheet:** `content/herbarium/refs/bride-shadow-page.png` (text in `NN-brides-shadow.md`).

## Look
- **Palette:** gold–teal–indigo. Teal is the colour of the plants' magic.
- **Present:** warm candle gold against deep indigo shadows. Warm candlelight appears only in the present.
- **Past:** cold, blue and misty, lit by the plant's teal glow on her face. No warm amber, no candle gold.
- **Style tail (present):** `painterly cinematic, dark folk fairytale, Yorkshire 2026, wet paths, dry-stone walls, fog, heather moors, soft film grain, 4K, highly detailed, vertical 9:16`
- **Style tail (past):** `painterly cinematic, dark folk fairytale, Grand Duchy of Lithuania around 1550, Vilnius outskirts, wooden houses with steep roofs, birches, wooden chapel, soft film grain, 4K, highly detailed, vertical 9:16`
- **Text on herbarium pages** (Latin names, margin notes) is **never written in the prompt**, only `blank margin with faded handwriting`. Ruta adds the real text in CapCut.

## Page and video
- **Length:** 45 s for every page. Vertical 9:16.
- **Page structure:** anchors → scenes with timing, lines and prompts → plant card → **book sheet** (all fields below, ready to hand to Nayara).
- **Arc of every video:** `episode-arc.md`.
- **Ending of every video:** a blank page, a new plant bleeds through, *"See you on Monday."*
- **Numbering:** `NN-name.md`, one row per page in `INDEX.md`.
- **All channel text is in English.**

## Book sheet
The series becomes a printed book. Besides the video, every plant gets a book sheet in the style of the Hollowbell and Dusklantern sheets (`refs/01-hollowbell-page.png`, `refs/02-dusklantern-page.png`). Nayara draws it. Every page file ends with a `## Book sheet` section that holds all its text.

### Fields
1. **Number in Roman numerals and name**, plus the Latin name (e.g. *I. Hollowbell — Oblivaria cava*).
2. **The plant's pentacle**, inspired by the planetary pentacles of the *Key of Solomon* and Papus but invented: its name and a one-line motto.
3. **Habitat** — one or two lines.
4. **Gift & Poison** — the gift and the poison.
5. **Gathering** — the heavenly conditions for gathering (as the heading, e.g. *Gathering — Dark Moon*) and a short invented rite.
6. **Margin notes in three inks:**
   - **brown** — the first, confident entry;
   - **faded grey** — doubts and failed attempts;
   - **teal** — the heroine of today, who does not remember writing this.
7. **Footer:** *An imagined herbarium · All plants and rites are fictional*

### Rules
- **One planet per plant.** The pentacle and the gathering conditions follow its planet. The pair **planet + Moon phase** never repeats (check the Planet and Moon columns of `INDEX.md`).
- **Heavenly conditions are real phenomena** (Moon phases, planetary stations, fixed stars), never specific dates.
- **Every plant takes something from the witch.** This is the through-line of the book: Hollowbell takes her name, Dusklantern her voice. Each new plant takes something new (check the Takes column of `INDEX.md`).
- **Landscapes on the sheet:** only the past world, Vilnius and its outskirts around 1550 — birches, wooden houses with steep roofs, wooden chapels, gates, thresholds. **One exception:** next to a teal margin note, a small sketch in teal ink from Yorkshire (a dry-stone wall, a path, fog) is allowed — a trace of the present on the pages of the past.
- **Rites are poetic and impossible:** no real plants, no recipes, no doses, nothing taken by mouth.
- **Margin notes:** at least one note on every sheet. The other inks appear only where the plant has its own story for them. Empty margin fields are allowed; never invent notes just to fill them.

### Template (end of every page file)
```
## Book sheet
- Number & name: <Roman numeral>. <Name> — <Latin name>
- Planet: <planet> · Moon: <phase>
- Pentacle: The Pentacle of <…> — "<one-line motto>"
- Habitat: <one or two lines>
- Gift & Poison: <gift>. <poison>.
- Gathering — <phase or heavenly condition>: <conditions>. <short impossible rite>.
- Takes: <what it takes from the witch>
- Margin (brown): "<first confident entry>"            (at least one margin note in total;
- Margin (grey): "<doubt or failed attempt>"           leave a line out when the plant has
- Margin (teal): "<the heroine today, not remembering>" no story for that ink)
- Footer: An imagined herbarium · All plants and rites are fictional
```

## Secret canon (backstory)
**Revealed in videos only gradually and only by Ruta's decision.** Agents never reveal it on their own.

Tomas was fading; she gave Hollowbell his name and lost her own. A whisper spread through the town about a nameless herbalist who does not age. To hide, she chose sleep through Bride's Shadow herself, but did not know its whole price. She woke in Yorkshire in 2026.

## Open threads of the season
Agents never close these:
- her name;
- what each plant took, and whether it can be returned;
- what she was running from;
- who knocks from the inside of the door;
- who brought the herbarium to Yorkshire;
- who left her the cardigan when she woke.

## New plants (Monday agent)
New plants fit into this story and may take something new from her, but they never reveal the backstory and never close an open thread.
