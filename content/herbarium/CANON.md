# Herbarium of the Forgotten Witch — Canon

**The single source of truth for the series.** It does not change from page to page. If any other file (`.claude/veyra-core.md`, `content/characters/the-witch.md`, `content/herbarium/episode-arc.md`, a page) says something different, this file wins.

The Monday agent reads this file and `INDEX.md` before every new page.

## World and story
- **Two times, no countries.** Never name a country or a city, not in videos, captions or book sheets. On screen and in captions only dates.
  - **Past:** "the old world, 1551".
  - **Present:** "our time" (*Now*).
- **Landscape:** northern and unmarked — fog, stone, wood, birches, moors, wooden houses and stone walls side by side. Nothing that identifies a place. Where she comes from is an open thread.
- **No real name, in either time.** Her real name is lost (open thread). Veyra never names her.
- **Voice:** Veyra off-screen, as guide and decoder, not the heroine.

### 1551 — Madame de Velmont
- An expensive healer whom the rich **invite to their homes**; she enters by the front door. Draughts for sleeplessness and melancholy, salves and care for the skin, remedies nobody names aloud. Common people fear her, the rich pay her.
- *Madame de Velmont* is a name she invented for herself. It is not her real name. **Dusklantern dims when she calls herself by this name.**
- **Her look:** dressed richly but not as nobility — dark teal velvet with gold, hair braided into a crown, **no white lead on her face** (every one of her clients wears white lead), a pomander on a chain, a case of small glass vials.
- **Her work:** pods and flowers set into mounts. Dusklantern is a glass flask on a worn bronze stand, holding ash and one live ember.

### Now — the clinic
- A modern young woman in a cardigan (the fixed photos) who remembers nothing.
- She works in a **cosmetic clinic**: masks, creams, skin care. Injections are done by the doctor; she stands beside.
- **The rhyme:** in 1551 the rich painted their faces with lead; now they inject a measured poison. **No judgement of the procedures.**
- **Places:** the clinic (bright, sterile) and her flat (rain, the herbarium, the flask). **The clinic enters from Page III.**

### Plants are orders
- Every plant is an order from a **rich client without a name or title**, only a role: "a merchant", "a widow", "a young wife". The page tells who asked, what they wanted, what she made, how it ended.
- The warnings in the margins were written after someone paid the price, sometimes she herself.

### The physician (1551)
- A learned physician who heals with metals. Clean-shaven, thin, a black cap, a black gown, spectacles on a cord, a grey metal cup at his belt. **No name.**
- In episodes he is one of "the new doctors who healed with metals". The historical teacher behind them is never named in videos (reference only: `ideas.md`).
- References: `content/herbarium/refs/physician-portrait.png` (not received yet), `content/herbarium/refs/physician-sheet.png`, `content/herbarium/refs/physician-sheet-flask.png` (same sheet, glass flask in hand).
- His role as accuser and his link with the clinic's owner are open threads: never reveal them.

### Truth of the period
- **How a video opens:** alternate between a truth of the period (real, verified, common across old Europe in general, never tied to one country) and a line of her own.
- Facts about the 16th century (beauty, skin, hygiene, healing, mourning; the life of the rich and the poor) are never recipes or compositions. No real historical figures.
- **Accused women:** scenes with accused women show no fire, no execution and no violence on screen. Veyra's voice never states historical facts about executions unless they are verified.
- **Only fiction:** everything about the witch and the plants is invented. No real plants passed off as invented ones, no recipes, no doses, no preparation, no use. What she made is named, never described as a recipe.

## Heroine (anchors for every prompt)
Fixed reference images, attached to every generation of her:
- **Now:** `content/characters/refs/witch-portrait.jpg` (face), `content/characters/refs/witch-master.jpg` (full figure, front, profile, back)
- **1551:** `content/characters/refs/velmont-portrait.jpg` (face and costume), `content/characters/refs/velmont-master.jpg` (full figure, front, profile, back, with cloak)

- **HEROINE (present):** young woman, long wild wavy chestnut hair with copper highlights, hazel-green eyes, light freckles, soft knowing half-smile, oversized charcoal knit cardigan
- **HEROINE (past):** the same young woman as Madame de Velmont, hair braided into a crown, dark teal velvet gown with gold embroidery, lace at the collar and cuffs, no white lead on her face, a silver pomander on a chain at her waist, a leather case of small corked glass vials
- **Jewellery:** none in the present. In 1551: the pomander and its chain, and her rings as on the 1551 reference images.
- **Framing:** in present-day scenes the heroine is never shown full length. The shot is set in each scene.
- Detailed generation sheet (identity block, light, sets, tool workflow): `content/characters/the-witch.md`.

## Plant and series references
- Every plant that has a reference image is drawn from it in every prompt, like the heroine's photos: the image is attached and the page's FLOWER anchor points to it.
- **Hollowbell:** `content/herbarium/refs/hollowbell-ref.png` — the main image of the flower for all prompts.
- **Dusklantern in 1551:** `content/herbarium/refs/dusklantern-flask-1551.jpg` — the flask on its bronze stand, with a client in white lead.
- **A 1551 client (the merchant):** `content/herbarium/refs/client-merchant-1551.jpg`.
- **Rustveil sheet:** `content/herbarium/refs/03-rustveil-page.png` (text in `03-rustveil.md`).
- **Series cover:** `content/herbarium/refs/herbarium-cover.png` — the sheet with four plants, for carousels and previews.
- **Book sheets:** `content/herbarium/refs/NN-name-page.png` (`01-hollowbell-page.png`, `02-dusklantern-page.png`) — the style model for every new book sheet.
- **Bride's Shadow sheet:** `content/herbarium/refs/bride-shadow-page.png` (text in `NN-brides-shadow.md`).

## Look
- **Photorealism.** No glow, no fairytale.
- **Past (1551):** old film — sepia, grain, flicker.
- **Present (Now):** live handheld camera.
- **One impossible detail** in an otherwise real shot. That is all the magic.
- **Palette:** gold–teal–indigo: her teal velvet and gold in 1551, candle gold and night indigo.
- **Style tail (present):** `photorealistic, live handheld camera, present day, natural light, realistic skin texture, one barely noticeable impossible detail, no glow, vertical 9:16`
- **Style tail (past):** `photorealistic, old film footage, sepia, film grain, gentle flicker, 1551, candlelight, realistic skin texture, one barely noticeable impossible detail, no glow, vertical 9:16`
- **Dates on screen:** only *1551* and *Now*.
- **Text on herbarium pages** (Latin names, margin notes) is **never written in the prompt**, only `blank margin with faded handwriting`. Ruta adds the real text in CapCut.

## Page and video
- **Length:** about 55 s. Vertical 9:16.
- **Page structure:** anchors → scenes with timing, lines and prompts → plant card with **the order** (client by role, what they wanted, what she made, how it ended) → **book sheet** (all fields below, ready to hand to Nayara).
- **Arc of every video:** `episode-arc.md`.
- **Ideas:** `ideas.md` is a store of ideas, not canon. Agents take from it only by Ruta's decision.
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

A noble client demands a remedy against old age: Bride's Shadow. The lady falls asleep and never wakes. The healer is accused. She breathes in the rose herself, not knowing its whole price, and wakes five hundred years later, with the herbarium.

Tomas was her betrothed; the wedding never took place. Hollowbell: she gave the flower his name to hold on to him, and lost her own.

## Open threads of the season
Agents never close these:
- her name;
- where she comes from;
- what each plant took;
- what became of the lady;
- who knocks from the inside of the door;
- who left her the cardigan and gave her the job without papers;
- the physician's role as her accuser;
- the physician's link with the clinic's owner.

## New plants (Monday agent)
Every new plant is an order from a rich client in 1551, without name or title ("a merchant", "a widow", "a young wife"): what they wanted, what she made (set into a mount, named, never a recipe), how it ended. It takes something from her. It never reveals the backstory and never closes an open thread. The clinic appears from Page III on.
