# Herbarium of the Forgotten Witch — Canon

**The single source of truth for the series.** It does not change from page to page. If any other file (`.claude/veyra-core.md`, `content/characters/the-witch.md`, `content/herbarium/episode-arc.md`, a page) says something different, this file wins.

The Monday agent reads this file and `INDEX.md` before every new page.

## World and story
- **Two times, no countries.** Never name a country or a city: not in videos, captions or book sheets. Only dates: ***1551*** and ***Now***.
  - **Past:** "the old world, mid-16th century".
  - **Present:** "our time".
- **Landscape:** northern and unmarked — fog, stone, wood, birches, moors, wooden houses and stone walls side by side. Nothing that identifies a place. Where she comes from is an open thread.
- **Heroine, past:** a healer whom the rich visit in secret — draughts for sleeplessness and melancholy, salves for the skin, remedies nobody names aloud. Common people fear her, the rich pay her, nobody knows her name.
- **Heroine, present:** a modern young woman in a cardigan (the fixed photos) who remembers nothing.
- **No real name, in either time.** Her real name is lost (open thread). Veyra never names her.
- **Madame de Velmont.** In the past the rich call her *Madame de Velmont*: a name she invented for herself so she could enter by the front door. It is not her real name. **Dusklantern dims when she calls herself by this name.**
- **Voice:** Veyra off-screen, as guide and decoder, not the heroine.
- **Plants are orders.** Every herbarium page is an order from the past: who asked, what they wanted, what she made, how it ended. The client has no name and no title, only a role: "a widow", "a merchant", "a young wife". The warnings in the margins were written after someone paid the price, sometimes she herself.
- **Truth of the period.** Facts about the 16th century (the life of the rich and the poor: beauty, skin, hygiene, healing, mourning) are only real, verified and common across old Europe in general, never tied to one country, never recipes or compositions. No real historical figures. Everything about the witch and the plants is fiction.
- **How an episode opens:** alternate between a real 16th-century fact and a line of her own.
- **Now, a quiet parallel.** People still chase youth and smooth skin; instead of lead there are filters and injections. She has already seen how it ends. A possible direction (not canon, Ruta decides): in the present, people start coming to her again.
- **Only fiction:** invented plants, invented properties, invented "poisons". No real plants passed off as invented ones, no recipes, no doses, no preparation, no use. What she "made" for a client is named, never described as a recipe.

## Heroine (anchors for every prompt)
Fixed reference images, attached to every generation of her:
- `content/characters/refs/witch-portrait.jpg` (face)
- `content/characters/refs/witch-master.jpg` (full figure, front, profile, back)

- **HEROINE (present):** young woman, long wild wavy chestnut hair with copper highlights, hazel-green eyes, light freckles, soft knowing half-smile, oversized charcoal knit cardigan
- **HEROINE (past):** the same young woman, a healer, hair in a single loose braid, plain linen dress; old-film look (see Look)
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
- **Past (1551):** old film — sepia, grain, flicker.
- **Present (Now):** live documentary footage, handheld camera. Warm candlelight appears only in the present.
- **Magic is barely visible:** one impossible detail in a realistic shot.
- **Style tail (present):** `live documentary footage, handheld camera, present day, northern landscape without landmarks, fog, stone walls, moors, natural light and candlelight, realistic, one barely visible impossible detail, vertical 9:16`
- **Style tail (past):** `old film footage, sepia, film grain, gentle flicker, mid-16th century, northern landscape without landmarks, fog, stone, wood, birches, moors, wooden houses and stone walls, realistic, one barely visible impossible detail, vertical 9:16`
- **Dates on screen:** only *1551* and *Now*.
- **Text on herbarium pages** (Latin names, margin notes) is **never written in the prompt**, only `blank margin with faded handwriting`. Ruta adds the real text in CapCut.

## Page and video
- **Length:** 45 s for every page. Vertical 9:16.
- **Page structure:** anchors → scenes with timing, lines and prompts → plant card with **the order** (client by role, what they wanted, what she made, how it ended) → **book sheet** (all fields below, ready to hand to Nayara).
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
- **Landscapes on the sheet:** only the past, unmarked and northern — fog, stone, wood, birches, moors, wooden houses, stone walls, gates, thresholds. No country, no city. **One exception:** next to a teal margin note, a small sketch in teal ink from Now (a stone wall, a path, fog) is allowed — a trace of the present on the pages of the past.
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

A noble client demands a remedy against old age. The healer refuses and warns her of the price, but the lady gets her way: Bride's Shadow. The lady falls asleep and never wakes. The healer is accused of witchcraft. On the night they come for her, she breathes in the same rose: *"If they come for me, I will sleep."* She did not know its whole price. She wakes five hundred years later, with the herbarium.

Tomas was her betrothed; the wedding never took place. Hollowbell: she gave the flower his name to hold on to him, and lost her own.

## Open threads of the season
Agents never close these:
- her name;
- where she comes from;
- what each plant took, and whether it can be returned;
- what became of the lady;
- who knocks from the inside of the door;
- who left her the cardigan and brought the herbarium.

## New plants (Monday agent)
Every new plant is an order from the past: a client without name or title ("a widow", "a merchant", "a young wife"), what they wanted, what she made, how it ended. It takes something from her. It never reveals the backstory and never closes an open thread.
