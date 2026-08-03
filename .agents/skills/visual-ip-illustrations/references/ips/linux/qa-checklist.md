# Linux Mascot QA Checklist

Use this gate before delivering, regenerating, or editing a Linux Mascot-route output.

Route id: `linux`.
Display name: Linux Mascot.
Route status: `source-reviewed`.
Output path: `assets/<article-slug>-linux/`.
Source authority: `source.md`.
Uploaded visual authority: `/Users/longnv/Downloads/Linux-logo.jpg`.
Tux source note: Tux creator Larry Ewing, Linux 2.0 Penguins source `https://isc.tamu.edu/~lewing/linux/`, and The GIMP attribution condition are recorded in `source.md`.
Linux trademark note: Linux Foundation trademark guidance, Linux mark ownership context, and Linux is the registered trademark of Linus Torvalds in the U.S. and other countries are recorded in `source.md`.
Public sample review boundary: public generated Linux Mascot samples require release review before appearing in public examples or release surfaces.
Linux Mascot identity note: preserve the uploaded Tux image markers together: glossy black rounded penguin head and body, white face eye patches, large oval eyes with dark pupils and small highlights, yellow-orange beak with two nostril dots, white oval belly, long black flippers, seated rounded posture, and oversized yellow-orange webbed feet.
Linux Mascot route block: generic penguin drift, generic server mascot drift, distro-logo drift, missing glossy black rounded penguin head and body, missing white face eye patches, missing large oval eyes with dark pupils and small highlights, missing yellow-orange beak with two nostril dots, missing white oval belly, missing long black flippers, missing seated rounded posture, missing oversized yellow-orange webbed feet, source-image pose copying, official endorsement claims, certification claims, compatibility claims, Linux Foundation logo use, product-poster drift, passive placement, route leakage, excessive text, and copied composition all fail the route.
Save accepted Linux Mascot output under `assets/<article-slug>-linux/` with an ordered English slug filename such as `01-topic-name.png`.

Linux Mascot QA source-reviewed gate.
Linux Mascot QA uploaded-image identity gate.
Linux Mascot QA source and trademark context gate.
Linux Mascot QA article-metaphor gate.
Linux Mascot QA route isolation gate.
Linux Mascot QA public sample review boundary gate.

## Pass Criteria

- Image is a 16:9 horizontal article illustration.
- Image explains one core idea.
- Image uses sparse hand-drawn style on a white or very light background with generous whitespace.
- Linux Mascot identity is clear through glossy black rounded penguin head and body, white face eye patches, large oval eyes with dark pupils and small highlights, yellow-orange beak with two nostril dots, white oval belly, long black flippers, seated rounded posture, and oversized yellow-orange webbed feet.
- Tux performs active cognitive participation. The visual metaphor depends on Tux inspecting, pointing, carrying, sorting, bridging, repairing, guiding, stamping, marking, tuning, shielding, weighing, connecting, untangling, mapping, comparing, lifting, assembling, or routing the concept.
- The scene is an original article metaphor created for the current article.
- Supporting objects are article metaphors such as maps, bridges, knots, compasses, stepping stones, hooks, levers, shelves, signposts, lamps, shields, stamps, keys, trails, gates, scales, buckets, envelopes, threads, lenses, source cards, review marks, or small hand-built machines.
- Visible labels are sparse, readable, short, and copied exactly in the user's requested language.
- Source and trademark boundary is preserved through `source.md`, `source-reviewed`, Larry Ewing Tux attribution, The GIMP attribution condition, Linux Foundation trademark guidance, Linux mark ownership context, uploaded visual authority `/Users/longnv/Downloads/Linux-logo.jpg`, and public sample review boundary.
- Route isolation is preserved for Linux Mascot, and Xiaohei, Littlebox, Tom, Ferris, Seal, OpenClaw, Go Gopher, Cai Xukun, and Hermes Agent identities stay outside the Linux Mascot route.
- Delivery path uses `assets/<article-slug>-linux/`.

## Identity Checks

Reject or repair any output with:

- generic penguin drift
- generic server mascot drift
- distro-logo drift
- missing glossy black rounded penguin head and body
- missing white face eye patches
- missing large oval eyes with dark pupils and small highlights
- missing yellow-orange beak with two nostril dots
- missing white oval belly
- missing long black flippers
- missing seated rounded posture
- missing oversized yellow-orange webbed feet
- source-image pose copying
- official endorsement claims
- certification claims
- compatibility claims
- Linux Foundation logo use
- distro branding
- product-poster drift
- passive placement
- route leakage
- excessive text
- copied composition
- missing uploaded visual authority
- missing output path
- missing source and trademark context

Linux Mascot QA generic penguin drift failure: Tux becomes a generic penguin, plush toy, naturalistic bird, generic mascot, server mascot, or vague black-and-white silhouette.

Linux Mascot QA distro-logo drift failure: the image uses distro logos, distro mascots, distro badges, package-manager marks, Linux Foundation logo use, or distro branding as route identity.

Linux Mascot QA passive placement failure: Tux sits beside the idea while props, arrows, labels, or supporting objects carry the meaning.

Linux Mascot QA trademark-boundary failure: active prompt, edit, QA, delivery, or visible text claims official endorsement, affiliation, sponsorship, approval, certification, compatibility, Linux Foundation campaign framing, Linux Foundation logo use, or distro approval.

Linux Mascot QA route leakage failure: active prompt, edit, QA, or delivery wording mixes Linux Mascot with Xiaohei black creature identity, Littlebox closed paper-box identity, Tom protected-character identity, Ferris crab identity, Seal hoodie identity, OpenClaw red logo-mascot identity, Go Gopher mascot identity, Cai Xukun stylized mascot identity, Hermes Agent uploaded-image identity, public approval claims, or cross-route vocabulary.

## Failure Signals

Regenerate or edit when:

- Tux is passive, removable, tiny, decorative, or only reacting.
- Tux identity reads as a generic penguin, generic server mascot, realistic bird, route-neutral mascot, different mascot, or over-rendered toy.
- The image misses the glossy black rounded penguin head and body, white face eye patches, large oval eyes with dark pupils and small highlights, yellow-orange beak with two nostril dots, white oval belly, long black flippers, seated rounded posture, or oversized yellow-orange webbed feet.
- The image has distro-logo drift, Linux Foundation logo use, distro branding, operating-system marketing graphics, product-poster drift, official endorsement claims, certification claims, compatibility claims, or generic technology mascot rendering.
- The image has excessive text, full-sentence annotations, bilingual clutter, clean digital typography, or labels crowding Tux's eyes, yellow-orange beak, white oval belly, long black flippers, seated rounded posture, or oversized yellow-orange webbed feet.
- The image becomes a formal diagram, dense PPT-like infographic, UI screenshot, CLI screenshot, web hero graphic, kernel dashboard screenshot, operating-system marketing graphic, poster layout, top-left title artifact, dense text block, or clean digital label layout.
- The scene uses copied prior route compositions, previous pack examples, source-image pose copying, or a reused route metaphor instead of a fresh article metaphor.
- The output lacks uploaded visual authority note or path reminder for `assets/<article-slug>-linux/`.
- The output lacks active cognitive participation, sparse labels, original article metaphor quality, source context, trademark-boundary note, or Linux Mascot route isolation.
- The visual metaphor still works after removing Tux from the scene.
- Public sample copy claims publication approval, release approval, or public example availability before release review.

## Iteration Moves

- Stronger Linux Mascot Participation: use `### Stronger Linux Mascot Participation` from `prompt-template.md`; keep the same core idea and make Tux perform the central cognitive action.
- Uploaded-Image Identity Repair: use `### Uploaded-Image Identity Repair`; preserve composition and labels while restoring glossy black rounded penguin head and body, white face eye patches, large oval eyes with dark pupils and small highlights, yellow-orange beak with two nostril dots, white oval belly, long black flippers, seated rounded posture, and oversized yellow-orange webbed feet.
- Title Removal: use `### Title Removal`; remove only title text, title cards, top-left headings, or underlines and preserve the rest.
- Text Reduction: use `### Text Reduction`; keep only 2-6 short visible labels copied exactly in the user's requested language.
- Trademark-Boundary Repair: use `### Trademark-Boundary Repair`; remove official endorsement claims, certification claims, compatibility claims, Linux Foundation logo use, distro-logo use, distro branding, Linux Foundation campaign framing, and operating-system marketing graphics.
- Route Leakage Repair: use `### Route Leakage Repair`; restore `source-reviewed`, restore the `source.md` pointer, keep Linux Mascot rules route-local, use article metaphors, and remove Xiaohei black creature identity, Littlebox closed paper-box identity, Tom protected-character identity, Ferris crab identity, Seal hoodie identity, OpenClaw red logo-mascot identity, Go Gopher mascot identity, Cai Xukun stylized mascot identity, Hermes Agent uploaded-image identity, distro-logo identity, Linux Foundation logo use, official endorsement cues, public approval claims, certification claims, compatibility claims, and cross-route vocabulary.
- Unaffected-Content Preservation: use `### Unaffected-Content Preservation`; name the exact failure being repaired and preserve all successful content outside that failure.
- Article-metaphor repair: keep the same core idea, invent a new physical metaphor, change supporting objects, preserve the working labels, aspect ratio, sparse line style, and successful article meaning.
- Excessive text repair: reduce labels to sparse labels, move explanation into the article text, and keep labels away from Tux's eyes, yellow-orange beak, white oval belly, long black flippers, seated posture, and oversized webbed feet.
- Trademark drift repair: remove distro logos, Linux Foundation logo use, official endorsement claims, certification claims, compatibility claims, operating-system marketing graphics, product-poster output, and campaign framing while preserving source context and article meaning.
- Public sample boundary repair: remove public sample approval or gallery claims and keep the output framed as internal review until release review approves public use.

Linux Mascot QA unaffected-content preservation gate: edit only the named failure and preserve successful Tux action, uploaded-image identity cues, existing composition, correct labels, supporting objects, paths, line style, color accents, 16:9 aspect ratio, and image quality.

## Route Leakage Repair

Route leakage repair restores Linux Mascot as the only selected visual IP for the current image. Keep `source-reviewed`, `source.md`, uploaded visual authority `/Users/longnv/Downloads/Linux-logo.jpg`, Larry Ewing Tux attribution, The GIMP attribution condition, Linux Foundation trademark guidance, Linux mark ownership context, public sample review boundary, and `assets/<article-slug>-linux/` attached to the Linux Mascot route.

Remove Xiaohei, Littlebox, Tom, Ferris, Seal, OpenClaw, Go Gopher, Cai Xukun, Hermes Agent, distro-logo identity, Linux Foundation logo use, official endorsement cues, public approval claims, certification claims, compatibility claims, public sample approval claims, and cross-route vocabulary. Preserve successful Tux content, successful article metaphor, correct labels, line style, aspect ratio, and unaffected supporting objects.

## Public Sample Boundary

Public sample boundary: public generated Linux Mascot samples require release review before appearing in `examples/images/`, `examples/images-en/`, `skills/visual-ip-illustrations/assets/examples/`, README previews, release galleries, agent metadata previews, or public release surfaces.

Phase 54 creates no public generated Linux Mascot sample images. Internal review outputs stay under `assets/<article-slug>-linux/` and keep the source/trademark context attached.

## Delivery Judgment

Accepted Linux Mascot images keep Tux as the action subject, preserve uploaded-image identity markers, preserve source and trademark boundary, preserve route isolation, explain one article idea through an original article metaphor, use sparse labels copied exactly in the user's requested language, point source and trademark-sensitive use to `source.md`, report `source-reviewed` status, report public sample review boundary when relevant, and report the saved output path under `assets/<article-slug>-linux/`.

Linux Mascot route block: generic penguin drift, generic server mascot drift, distro-logo drift, missing glossy black rounded penguin head and body, missing white face eye patches, missing large oval eyes with dark pupils and small highlights, missing yellow-orange beak with two nostril dots, missing white oval belly, missing long black flippers, missing seated rounded posture, missing oversized yellow-orange webbed feet, source-image pose copying, official endorsement claims, certification claims, compatibility claims, Linux Foundation logo use, product-poster drift, passive placement, route leakage, excessive text, and copied composition all fail the route.
