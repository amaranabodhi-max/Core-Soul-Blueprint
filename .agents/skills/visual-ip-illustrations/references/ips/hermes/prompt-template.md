# Hermes Agent Prompt Template

Route id: `hermes`.
Display name: Hermes Agent.
Route status: `source-reviewed`.
Output path: `assets/<article-slug>-hermes/`.
Source authority: `source.md`.
Uploaded visual authority: conversation attachment `Generated image 1 (16).jpeg`.
Official source note: Hermes Agent source context is recorded in `source.md` with official Hermes Agent context and MIT license context.
Public sample review boundary: public generated Hermes samples require release review before appearing in public examples or release surfaces.
Hermes Agent identity note: preserve the monochrome full-body logo-style character, three-quarter side-facing standing pose, three-quarter left-facing manga face, large almond eyes with dark upper lashes, slim pointed nose, small slightly parted lips, pointed chin, cool reserved expression, blunt straight bangs, shoulder-length black hair with large C-shaped curled ends on both sides, bright white hair highlights, wide white over-head headset band, small black circular ear cup on the visible side, fitted black sleeveless spaghetti-strap mini dress, flared pleated skirt, small white neck/collar tag with an `A`-like mark, black thigh-high stockings, black Mary Jane platform high heels with strap and buckle, very long slim legs and reserved fashion-model posture.
Hermes Agent route block: generic anime or assistant drift, mythological Hermes imagery, missing wide white headset band, missing three-quarter left-facing face, missing large almond eyes with dark upper lashes, missing slim pointed nose, small slightly parted lips, or pointed chin, missing cool reserved expression, missing blunt bangs, missing large C-shaped curled hair ends, missing bright white hair highlights, missing fitted spaghetti-strap mini dress, missing flared pleated skirt, missing small white A-like collar tag, missing thigh-high stockings or Mary Jane platform high heels, product-poster drift, passive placement, route leakage, excessive text, copied composition, official endorsement, affiliation, sponsorship, approval claim, and impersonation all fail the route.
Save accepted Hermes Agent output under `assets/<article-slug>-hermes/` with an ordered English slug filename such as `01-topic-name.png`.

## Planning Output Format

Hermes Agent planning fields gate.

Return one planned image per selected article anchor:

- Placement:
- Core idea:
- Structure type:
- Hermes Agent state:
- Hermes Agent action:
- Supporting objects:
- Visible labels:
- Source context note:
- Mythology-drift note:
- Product-poster boundary note:
- Output path: `assets/<article-slug>-hermes/`

Hermes Agent state examples: focused, routing, verifying, tuning, sorting, shielding, comparing, repairing, stitching, trimming, bridging, mapping, balancing, filtering, and aligning.

Source context note: Hermes Agent is `source-reviewed`; `source.md` records official Hermes Agent context, MIT license context, uploaded visual authority, public sample policy, product boundary, mythology boundary, and status changes.

Mythology-drift note: mythological Hermes imagery fails the route, including winged sandals, winged helmet, caduceus, Greek messenger scenes, Olympian deity framing, mythology-first symbols, and deity-route framing.

Product-poster boundary note: product advertising, product-poster output, CLI screenshots, web hero graphics, official endorsement, affiliation, sponsorship, approval claim, and impersonation fail the route.

## One-Image Generation Prompt

Hermes Agent one-image generation gate.

```text
Create one sparse 16:9 horizontal article illustration for this article idea:

Core idea: [one sentence]
Structure type: [Workflow / System Local View / Before/After / Character State / Concept Metaphor / Method Layers / Map Route / Mini Comic]
Hermes Agent state: [focused / routing / verifying / tuning / sorting / shielding / comparing / repairing / stitching / trimming / bridging / mapping / balancing / filtering / aligning]
Hermes Agent action: [physical action that performs the central cognitive article action]
Supporting objects: [3-6 sparse article metaphor objects]
Visible labels: [2-6 short labels copied exactly in the user's requested language]
Source context note: Hermes Agent is source-reviewed; source.md records official Hermes Agent context and MIT license context.
Mythology-drift note: keep mythological Hermes imagery outside the route.
Product-poster boundary note: keep product-poster output outside the route.
Output path: assets/<article-slug>-hermes/

Draw Hermes Agent from the uploaded-image visual authority note: conversation attachment Generated image 1 (16).jpeg. Preserve the monochrome full-body logo-style character, three-quarter side-facing standing pose, three-quarter left-facing manga face, large almond eyes with dark upper lashes, slim pointed nose, small slightly parted lips, pointed chin, cool reserved expression, blunt straight bangs, shoulder-length black hair with large C-shaped curled ends on both sides, bright white hair highlights, wide white over-head headset band, small black circular ear cup on the visible side, fitted black sleeveless spaghetti-strap mini dress, flared pleated skirt, small white neck/collar tag with an A-like mark, black thigh-high stockings, black Mary Jane platform high heels with strap and buckle, very long slim legs and reserved fashion-model posture.

Hermes Agent must perform the central cognitive action. The visual metaphor should lose its meaning if Hermes Agent is removed.

Style: white or very light background, rough black hand-drawn linework, sparse 16:9 horizontal article-illustration composition, generous whitespace, low-density objects, restrained accent marks, sparse handwritten visible labels copied exactly in the user's requested language, no title, no full-sentence annotations.

Official source context and MIT license context: use source.md as the authority for official Hermes Agent context, MIT license context, uploaded visual authority, public sample policy, product boundary, mythology boundary, and status changes.

Output reminder: save accepted Hermes Agent output under assets/<article-slug>-hermes/ with an ordered English slug filename such as 01-topic-name.png.

Reject these failures: generic anime or assistant drift, mythological Hermes imagery, winged sandals, winged helmet, caduceus, Greek messenger scenes, Olympian deity framing, missing wide white headset band, missing small black circular ear cup, missing three-quarter left-facing face, missing large almond eyes with dark upper lashes, missing slim pointed nose, small slightly parted lips, or pointed chin, missing cool reserved expression, missing blunt bangs, missing large C-shaped curled hair ends, missing bright white hair highlights, missing fitted spaghetti-strap mini dress, missing flared pleated skirt, missing small white A-like collar tag, missing thigh-high stockings or Mary Jane platform high heels, product-poster drift, passive placement, route leakage, excessive text, copied composition, official endorsement, affiliation, sponsorship, approval claim, impersonation, formal diagrams, dense PPT-like infographics, UI screenshots, CLI screenshots, web hero graphics, poster layouts, top-left title artifacts, and clean digital labels.
```

## Editing Prompts

Each edit prompt keeps the Hermes Agent route status, official source context, MIT license context, uploaded visual authority, public sample policy, product boundary, mythology boundary, and output path explicit. Preserve unaffected content unless the named failure requires regeneration.

### Stronger Hermes Participation

Stronger Hermes Participation repair gate.

```text
Regenerate the image with the same core idea, same sparse 16:9 article-illustration style, same visible labels copied exactly in the user's requested language, same aspect ratio, and the same unaffected supporting objects, but make Hermes Agent perform the central cognitive action.

Route status note: Hermes Agent is a source-reviewed uploaded-image article-illustration route. Use source.md as authority for official Hermes Agent context, MIT license context, uploaded visual authority from Generated image 1 (16).jpeg, public sample policy, product boundary, mythology boundary, and status changes.

Hermes Agent should physically sort, route, tune, inspect, stitch, shield, compare, assemble, stamp, trim, prune, map, bridge, balance, filter, untangle, carry, pin, align, or repair the concept through the scene. The metaphor should depend on Hermes Agent's action. Preserve the uploaded marker set: monochrome full-body logo-style character, three-quarter side-facing standing pose, three-quarter left-facing manga face, large almond eyes with dark upper lashes, slim pointed nose, small slightly parted lips, pointed chin, cool reserved expression, blunt straight bangs, shoulder-length black hair with large C-shaped curled ends on both sides, bright white hair highlights, wide white over-head headset band, small black circular ear cup on the visible side, fitted black sleeveless spaghetti-strap mini dress, flared pleated skirt, small white neck/collar tag with an A-like mark, black thigh-high stockings, black Mary Jane platform high heels with strap and buckle, very long slim legs and reserved fashion-model posture.
```

### Uploaded-Image Identity Repair

Uploaded-Image Identity Repair gate.

```text
Edit the image to keep the same composition, labels, style, 16:9 aspect ratio, and unaffected objects, but repair the character so it follows the Hermes Agent uploaded-image identity.

Route status note: Hermes Agent is a source-reviewed uploaded-image article-illustration route. Use source.md as authority for official Hermes Agent context, MIT license context, uploaded visual authority from Generated image 1 (16).jpeg, public sample policy, product boundary, mythology boundary, and status changes.

Restore these markers together: monochrome full-body logo-style character, three-quarter side-facing standing pose, three-quarter left-facing manga face, large almond eyes with dark upper lashes, slim pointed nose, small slightly parted lips, pointed chin, cool reserved expression, blunt straight bangs, shoulder-length black hair with large C-shaped curled ends on both sides, bright white hair highlights, wide white over-head headset band, small black circular ear cup on the visible side, fitted black sleeveless spaghetti-strap mini dress, flared pleated skirt, small white neck/collar tag with an A-like mark, black thigh-high stockings, black Mary Jane platform high heels with strap and buckle, very long slim legs and reserved fashion-model posture. Remove generic anime or assistant drift, generic logo mascot drift, missing wide white headset band, missing small black circular ear cup, missing three-quarter left-facing face, missing large almond eyes with dark upper lashes, missing slim pointed nose, small slightly parted lips, or pointed chin, missing cool reserved expression, missing blunt bangs, missing large C-shaped curled hair ends, missing fitted spaghetti-strap mini dress, missing flared pleated skirt, missing small white A-like collar tag, missing thigh-high stockings or Mary Jane platform high heels, product-poster drift, mythological Hermes imagery, and route leakage.
```

### Title Removal

Title Removal edit gate.

```text
Edit the provided image. Remove only the title text, title card, top-left heading, or underline: [text to remove].

Route status note: Hermes Agent is a source-reviewed uploaded-image article-illustration route. Use source.md as authority for official Hermes Agent context, MIT license context, uploaded visual authority from Generated image 1 (16).jpeg, public sample policy, product boundary, mythology boundary, and status changes.

Fill the removed area with the same white or very light background and preserve everything else: Hermes Agent identity, Hermes Agent action, existing composition, visible labels that remain correct, supporting objects, paths, rough black hand-drawn line style, sparse accent marks, 16:9 aspect ratio, and image quality. Add no new text, title cards, UI screenshots, CLI screenshots, web hero graphics, poster layout, clean digital labels, or mythology-first symbols.
```

### Text Reduction

Text Reduction edit gate.

```text
Edit or regenerate the image with the same core idea, same Hermes Agent action, same sparse 16:9 article-illustration style, same aspect ratio, and the same unaffected supporting objects, but reduce visible text.

Route status note: Hermes Agent is a source-reviewed uploaded-image article-illustration route. Use source.md as authority for official Hermes Agent context, MIT license context, uploaded visual authority from Generated image 1 (16).jpeg, public sample policy, product boundary, mythology boundary, and status changes.

Keep only these short visible labels, copied exactly in the user's requested language: [quoted labels]. Remove full sentences, dense annotations, bilingual clutter, clean digital typography, top-left titles, and labels that crowd Hermes Agent's face, wide white headset band, hair highlights, fitted spaghetti-strap mini dress, small white A-like collar tag, stockings, or Mary Jane platform high heels. Preserve Hermes Agent identity, Hermes Agent action, supporting objects, labels that remain correct, line style, accent marks, aspect ratio, image quality, source context note, and MIT license context.
```

### Mythology-Drift Repair

Mythology-Drift Repair gate.

```text
Edit or regenerate the image with the same core idea, same successful Hermes Agent action, same sparse 16:9 article-illustration style, same visible labels copied exactly in the user's requested language, and the same unaffected supporting objects, but remove mythology-drift content.

Route status note: Hermes Agent is a source-reviewed uploaded-image article-illustration route. Use source.md as authority for official Hermes Agent context, MIT license context, uploaded visual authority from Generated image 1 (16).jpeg, public sample policy, product boundary, mythology boundary, and status changes.

Remove winged sandals, winged helmet, caduceus, Greek messenger scenes, Olympian deity framing, mythology-first symbols, deity-route framing, classical messenger costume cues, and mythological Hermes imagery. Keep Hermes Agent as the uploaded-image article-illustration character with a three-quarter left-facing manga face, large almond eyes with dark upper lashes, slim pointed nose, small slightly parted lips, pointed chin, cool reserved expression, wide white over-head headset band, small black circular ear cup, blunt straight bangs, shoulder-length black hair with large C-shaped curled ends on both sides, bright white hair highlights, fitted black sleeveless spaghetti-strap mini dress, flared pleated skirt, small white neck/collar tag with an A-like mark, black thigh-high stockings, black Mary Jane platform high heels with strap and buckle, very long slim legs and reserved fashion-model posture.
```

### Product-Poster Repair

Product-Poster Repair gate.

```text
Edit or regenerate the image with the same article idea and successful Hermes Agent identity, but convert the scene into a sparse 16:9 article illustration.

Route status note: Hermes Agent is a source-reviewed uploaded-image article-illustration route. Use source.md as authority for official Hermes Agent context, MIT license context, uploaded visual authority from Generated image 1 (16).jpeg, public sample policy, product boundary, mythology boundary, and status changes.

Remove product advertising, product-poster output, CLI screenshots, web hero graphics, launch poster framing, repository banner layout, official endorsement, affiliation, sponsorship, approval claim, and impersonation. Use a white or very light background, rough black hand-drawn linework, generous whitespace, and one original article metaphor carried by Hermes Agent's action.
```

### Route Leakage Repair

Route Leakage Repair gate.

```text
Edit or regenerate the image prompt with the same core idea, same successful Hermes Agent action, same sparse 16:9 article-illustration style, same visible labels, and the same unaffected supporting objects, but remove route leakage.

Route status note: Hermes Agent is a source-reviewed uploaded-image article-illustration route. Use source.md as authority for official Hermes Agent context, MIT license context, uploaded visual authority from Generated image 1 (16).jpeg, public sample policy, product boundary, mythology boundary, and status changes.

Keep Hermes Agent as the uploaded-image article character. Remove Xiaohei black creature identity, Littlebox paper-box identity, Tom protected-character identity, Ferris crab identity, Seal hoodie identity, OpenClaw red logo-mascot identity, Go Gopher mascot identity, Cai Xukun stylized public-figure mascot identity, mythology-first Hermes imagery, generic anime or assistant drift, official endorsement claims, public approval claims, and cross-route vocabulary. Preserve the uploaded marker set and keep successful article-metaphor content.
```

### Unaffected-Content Preservation

Unaffected-Content Preservation gate.

```text
Edit only the named failure: [participation / uploaded-image identity / title / text density / mythology drift / product-poster drift / route leakage / label typo]. First name the exact failure being repaired. Preserve all successful content outside that failure: successful Hermes Agent action, uploaded-image identity cues, existing composition, visible labels that are already correct, supporting objects, paths, rough black hand-drawn line style, sparse accent marks, 16:9 aspect ratio, and image quality.

Route status note: Hermes Agent is a source-reviewed uploaded-image article-illustration route. Use source.md as authority for official Hermes Agent context, MIT license context, uploaded visual authority from Generated image 1 (16).jpeg, public sample policy, product boundary, mythology boundary, and status changes.

Keep the scene an original article metaphor. Add no generic anime or assistant drift, mythological Hermes imagery, winged sandals, winged helmet, caduceus, missing wide white headset band, missing small black circular ear cup, missing three-quarter left-facing face, missing large almond eyes with dark upper lashes, missing slim pointed nose, small slightly parted lips, or pointed chin, missing cool reserved expression, missing blunt bangs, missing large C-shaped curled hair ends, missing bright white hair highlights, missing fitted spaghetti-strap mini dress, missing flared pleated skirt, missing small white A-like collar tag, missing thigh-high stockings or Mary Jane platform high heels, product-poster drift, passive placement, route leakage, excessive text, copied composition, formal diagrams, UI screenshots, CLI screenshots, web hero graphics, title cards, dense PPT-like infographics, or official endorsement claims.
```

## Output Reminder

Accepted Hermes Agent images are saved under `assets/<article-slug>-hermes/`. The delivery report states selected visual IP, image count, purpose per image, saved path, source context note, MIT license context, uploaded-image identity status, mythology-drift status, product-poster boundary status, route isolation status, public sample boundary status, and stability notes.
