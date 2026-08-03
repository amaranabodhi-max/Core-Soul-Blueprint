# Visual IP Routing

This file defines visual-IP selection rules and verifiable route metadata for the skill entrypoint. `SKILL.md` selects the visual IP first, then loads only the selected route's reference files.

## Route Selection Rules

- Omitted visual IP selects `xiaohei`.
- `小黑`, `Xiaohei`, `Ian`, and `ian-xiaohei` select the same `xiaohei` route.
- `小盒`, `Littlebox`, `纸盒`, `paper-box`, and `carton` select the same `littlebox` route.
- `Tom`, `Tom Cat`, `Tom and Jerry`, `汤姆`, and `汤姆猫` select the same `tom` route and keep route status `gated-authorized`.
- `Ferris`, `Rust mascot`, `Rust crab`, `Rustacean`, `Rust 吉祥物`, and `Rust 螃蟹` select the same `ferris` route and keep route status `source-reviewed`.
- `Seal`, `hoodie seal`, `white seal`, `blue hoodie seal`, `海豹`, `连帽衫海豹`, `白色海豹`, and `蓝色连帽衫海豹` select the same `seal` route and keep route status `active`.
- `OpenClaw`, `openclaw`, `OpenClaw logo`, `OpenClaw mascot`, `OpenClaw 助手`, and `OpenClaw 吉祥物` select the same `openclaw` route and keep route status `source-reviewed`.
- `Go Gopher`, `Gopher`, `golang gopher`, `Go mascot`, `Go 吉祥物`, and `Gopher 吉祥物` select the same `gopher` route and keep route status `source-reviewed`.
- Go Gopher route matching requires Go Gopher, Gopher, golang gopher, or a Go Gopher-qualified route phrase; generic aliases such as `go`, `blue mascot`, `animal`, and `logo` remain outside the Go Gopher alias set.
- `蔡徐坤`, `Cai Xukun`, `caixukun`, and `cxk` select the same `caixukun` route and keep route status `gated-public-figure`.
- Cai Xukun route matching requires `蔡徐坤`, `Cai Xukun`, `caixukun`, or `cxk`; broad celebrity, idol, duck, yellow mascot, and fandom words remain outside the Cai Xukun alias set.
- `Hermes Agent`, `Hermes`, `hermes`, `hermes-agent`, `Hermes logo`, and `Hermes Agent logo` select the same `hermes` route and keep route status `source-reviewed`.
- Hermes Agent route matching requires `Hermes Agent`, `Hermes`, `hermes`, `hermes-agent`, `Hermes logo`, or `Hermes Agent logo`; broad assistant, AI agent, logo, anime, monochrome girl, fashion figure, Greek messenger, winged sandals, and caduceus terms remain outside the Phase 48 Hermes alias set.
- `Linux Mascot`, `Linux mascot`, `Linux`, `linux`, `Tux`, `tux`, `Linux penguin`, and `Tux penguin` select the same `linux` route and keep route status `source-reviewed`.
- Linux Mascot route matching requires `Linux Mascot`, `Linux mascot`, `Linux`, `linux`, `Tux`, `tux`, `Linux penguin`, or `Tux penguin`; broad penguin, server, kernel, distro, distro-logo, Linux Foundation, operating-system, CLI, terminal, product, brand-campaign, and generic mascot terms remain outside the Phase 53 Linux Mascot alias set.
- Mixed requests across Xiaohei, Littlebox, Tom, Ferris, Seal, OpenClaw, Go Gopher, Cai Xukun, Hermes Agent, and Linux Mascot create separate route groups. Compatibility marker: 每个 route group 只加载自己的 `required_references`; each group writes to its own output directory.
- Routes store only selection, references, output suffixes, and attribution context. Style, character identity, prompt wording, and QA rules live in the selected IP's reference files.
- Ferris is an explicit Rust-community mascot route with status source-reviewed; generated public Ferris samples require release review for Rust trademark and endorsement-safe wording.
- Ferris route-local reference directory: `skills/visual-ip-illustrations/references/ips/ferris/`.
- Ferris source/trademark authority: `skills/visual-ip-illustrations/references/ips/ferris/source.md`.
- Seal is an explicit hoodie seal route with status active; generated public Seal samples require release review for hoodie seal identity and no-logo mascot identity.
- Seal route-local reference directory: `skills/visual-ip-illustrations/references/ips/seal/`.
- Seal source-history authority: `skills/visual-ip-illustrations/references/ips/seal/source.md`.
- OpenClaw is an explicit source-reviewed logo-mascot route; generated public OpenClaw samples require release review for uploaded-logo identity and source/license authority.
- OpenClaw route-local reference directory: `skills/visual-ip-illustrations/references/ips/openclaw/`.
- OpenClaw source and uploaded-logo authority: `skills/visual-ip-illustrations/references/ips/openclaw/source.md`.
- Go Gopher is an explicit source-reviewed article-illustration mascot route; generated public Go Gopher samples require release review for Go blog source context, Renee French attribution, Creative Commons Attribution 4.0 license boundary, route-local `skills/visual-ip-illustrations/references/ips/gopher/gopher.png` visual authority, Go logo boundary, and official Go project affiliation, approval, sponsorship, and endorsement claim boundaries.
- Go Gopher route-local reference directory: `skills/visual-ip-illustrations/references/ips/gopher/`.
- Go Gopher source and local visual authority: `skills/visual-ip-illustrations/references/ips/gopher/source.md`.
- Cai Xukun is an explicit gated-public-figure stylized mascot article-illustration route; generated public Cai Xukun samples require release review for route-local uploaded visual authority recorded in `references/ips/caixukun/source.md` as uploaded reference image A and uploaded reference image B, public-figure likeness boundary, stylized mascot route framing, and realistic-person portrait output, official endorsement, affiliation, impersonation, campaign, celebrity advertising, and fandom promotion claim boundaries.
- Cai Xukun route-local reference directory: `skills/visual-ip-illustrations/references/ips/caixukun/`.
- Cai Xukun source and uploaded-image authority: `skills/visual-ip-illustrations/references/ips/caixukun/source.md`.
- Hermes Agent is an explicit source-reviewed uploaded-image article-illustration route; generated public Hermes samples require release review for official Hermes Agent context, MIT license context, uploaded-image authority from conversation attachment `Generated image 1 (16).jpeg`, product-poster output boundary, mythology-drift boundary, and official endorsement, affiliation, sponsorship, approval, and impersonation claim boundaries.
- Hermes Agent route-local reference directory: `skills/visual-ip-illustrations/references/ips/hermes/`.
- Hermes Agent source and uploaded-image authority: `skills/visual-ip-illustrations/references/ips/hermes/source.md`.
- Linux Mascot is an explicit source-reviewed uploaded-image article-illustration route; generated public Linux Mascot samples require release review for Larry Ewing Tux attribution, The GIMP attribution condition, Linux Foundation trademark guidance, Linux mark ownership context, uploaded local image authority `/Users/longnv/Downloads/Linux-logo.jpg`, distro-logo boundary, and official endorsement, certification, compatibility, Linux Foundation logo use, product-poster output, CLI screenshots, web hero graphics, kernel dashboard screenshots, and operating-system marketing graphics boundaries.
- Linux Mascot route-local reference directory: `skills/visual-ip-illustrations/references/ips/linux/`.
- Linux Mascot source and uploaded-image authority: `skills/visual-ip-illustrations/references/ips/linux/source.md`.

## IP Routes

| id | display_name | aliases | default | output_suffix | required_references | attribution_context | status |
|----|--------------|---------|---------|---------------|---------------------|---------------------|--------|
| `xiaohei` | Xiaohei | `小黑`, `Xiaohei`, `Ian`, `ian-xiaohei` | `true` | `illustrations` | `references/ips/xiaohei/style-dna.md`; `references/ips/xiaohei/xiaohei-ip.md`; `references/ips/xiaohei/composition-patterns.md`; `references/ips/xiaohei/prompt-template.md`; `references/ips/xiaohei/qa-checklist.md` | Ian Xiaohei existing package | `active` |
| `littlebox` | Littlebox | `小盒`, `Littlebox`, `纸盒`, `paper-box`, `carton` | `false` | `littlebox` | `references/ips/littlebox/style-dna.md`; `references/ips/littlebox/littlebox-ip.md`; `references/ips/littlebox/composition-patterns.md`; `references/ips/littlebox/language-and-labels.md`; `references/ips/littlebox/prompt-template.md`; `references/ips/littlebox/qa-checklist.md` | 5km Littlebox Illustrations by okooo5km; source https://github.com/okooo5km/5km-littlebox-illustrations; MIT; inspected commit 37cd93e | `active` |
| `tom` | Tom | `Tom`, `Tom Cat`, `Tom and Jerry`, `汤姆`, `汤姆猫` | `false` | `tom` | `references/ips/tom/index.md`; `references/ips/tom/rights.md`; `references/ips/tom/style-dna.md`; `references/ips/tom/tom-ip.md`; `references/ips/tom/composition-patterns.md`; `references/ips/tom/prompt-template.md`; `references/ips/tom/qa-checklist.md` | Tom and Jerry / Tom source context; attribution records source identity while permission remains authorization-scope specific through `references/ips/tom/rights.md` | `gated-authorized` |
| `ferris` | Ferris | `Ferris`, `Rust mascot`, `Rust crab`, `Rustacean`, `Rust 吉祥物`, `Rust 螃蟹` | `false` | `ferris` | `references/ips/ferris/index.md`; `references/ips/ferris/source.md`; `references/ips/ferris/style-dna.md`; `references/ips/ferris/ferris-ip.md`; `references/ips/ferris/composition-patterns.md`; `references/ips/ferris/prompt-template.md`; `references/ips/ferris/qa-checklist.md` | Ferris source context from `rustacean.net` and Karen Rustad Tolva; attribution records source context while Rust trademark boundary is governed through `references/ips/ferris/source.md` | `source-reviewed` |
| `seal` | Seal | `Seal`, `hoodie seal`, `white seal`, `blue hoodie seal`, `海豹`, `连帽衫海豹`, `白色海豹`, `蓝色连帽衫海豹` | `false` | `seal` | `references/ips/seal/index.md`; `references/ips/seal/source.md`; `references/ips/seal/style-dna.md`; `references/ips/seal/seal-ip.md`; `references/ips/seal/composition-patterns.md`; `references/ips/seal/prompt-template.md`; `references/ips/seal/qa-checklist.md` | Historical Sealos uploaded mascot image source context; attribution records hoodie seal identity, no-logo mascot identity, and source-history boundary through `references/ips/seal/source.md` | `active` |
| `openclaw` | OpenClaw | `OpenClaw`, `openclaw`, `OpenClaw logo`, `OpenClaw mascot`, `OpenClaw 助手`, `OpenClaw 吉祥物` | `false` | `openclaw` | `references/ips/openclaw/index.md`; `references/ips/openclaw/source.md`; `references/ips/openclaw/style-dna.md`; `references/ips/openclaw/openclaw-ip.md`; `references/ips/openclaw/composition-patterns.md`; `references/ips/openclaw/prompt-template.md`; `references/ips/openclaw/qa-checklist.md` | Official OpenClaw repository https://github.com/openclaw/openclaw; MIT License; Copyright (c) 2026 OpenClaw Foundation; uploaded red OpenClaw logo visual authority; source-reviewed route status through `references/ips/openclaw/source.md` | `source-reviewed` |
| `gopher` | Go Gopher | `Go Gopher`, `Gopher`, `golang gopher`, `Go mascot`, `Go 吉祥物`, `Gopher 吉祥物` | `false` | `gopher` | `references/ips/gopher/index.md`; `references/ips/gopher/source.md`; `references/ips/gopher/style-dna.md`; `references/ips/gopher/gopher-ip.md`; `references/ips/gopher/composition-patterns.md`; `references/ips/gopher/prompt-template.md`; `references/ips/gopher/qa-checklist.md` | Official Go blog source https://go.dev/blog/gopher; Go Gopher created by Renee French; Creative Commons Attribution 4.0 license context; route-local `skills/visual-ip-illustrations/references/ips/gopher/gopher.png` visual authority; public generated Go Gopher samples require release review; Go logo identity and official Go project affiliation, approval, sponsorship, and endorsement claims stay outside positive route identity | `source-reviewed` |
| `caixukun` | Cai Xukun | `蔡徐坤`, `Cai Xukun`, `caixukun`, `cxk` | `false` | `caixukun` | `references/ips/caixukun/index.md`; `references/ips/caixukun/source.md`; `references/ips/caixukun/style-dna.md`; `references/ips/caixukun/caixukun-ip.md`; `references/ips/caixukun/composition-patterns.md`; `references/ips/caixukun/prompt-template.md`; `references/ips/caixukun/qa-checklist.md` | Route-local uploaded visual authority recorded in `references/ips/caixukun/source.md` as uploaded reference image A and uploaded reference image B; gated public-figure stylized mascot route; public generated Cai Xukun samples require release review; realistic-person portrait output, official endorsement, affiliation, impersonation, campaign, celebrity advertising, and fandom promotion claims stay outside route identity | `gated-public-figure` |
| `hermes` | Hermes Agent | `Hermes Agent`, `Hermes`, `hermes`, `hermes-agent`, `Hermes logo`, `Hermes Agent logo` | `false` | `hermes` | `references/ips/hermes/index.md`; `references/ips/hermes/source.md`; `references/ips/hermes/style-dna.md`; `references/ips/hermes/hermes-ip.md`; `references/ips/hermes/composition-patterns.md`; `references/ips/hermes/prompt-template.md`; `references/ips/hermes/qa-checklist.md` | Hermes Agent source-reviewed uploaded-image route; official website https://hermes-agent.nousresearch.com/; official repository https://github.com/NousResearch/hermes-agent; MIT license context https://github.com/NousResearch/hermes-agent/blob/main/LICENSE; documentation https://hermes-agent.nousresearch.com/docs/; conversation attachment `Generated image 1 (16).jpeg` visual authority; public generated Hermes samples require release review; product-poster output, mythology-first imagery, official endorsement, affiliation, sponsorship, approval, and impersonation claims stay outside route identity | `source-reviewed` |
| `linux` | Linux Mascot | `Linux Mascot`, `Linux mascot`, `Linux`, `linux`, `Tux`, `tux`, `Linux penguin`, `Tux penguin` | `false` | `linux` | `references/ips/linux/index.md`; `references/ips/linux/source.md`; `references/ips/linux/style-dna.md`; `references/ips/linux/linux-ip.md`; `references/ips/linux/composition-patterns.md`; `references/ips/linux/prompt-template.md`; `references/ips/linux/qa-checklist.md` | Linux Mascot source-reviewed uploaded-image article-illustration route; Tux creator Larry Ewing; Linux 2.0 Penguins source https://isc.tamu.edu/~lewing/linux/; The GIMP attribution condition; Linux Foundation trademark guidance https://www.linuxfoundation.org/legal/trademark-usage; Linux mark ownership context https://www.linuxfoundation.org/legal/the-linux-mark; uploaded local image `/Users/longnv/Downloads/Linux-logo.jpg` visual authority; public generated Linux Mascot samples require release review; official endorsement, certification, compatibility, Linux Foundation logo use, distro-logo drift, product-poster output, CLI screenshots, web hero graphics, kernel dashboard screenshots, and operating-system marketing graphics stay outside route identity | `source-reviewed` |

## OpenClaw Metadata

- Route id: `openclaw`.
- Source authority: official OpenClaw repository, MIT License, and OpenClaw Foundation copyright.
- Uploaded-logo authority: the uploaded red OpenClaw logo is the route visual authority.
- Fixed uploaded-logo markers: red round body, side claw-like arms, two antennae, black eyes, cyan pupils, and short legs.
- Route status: `source-reviewed`.
- Output path: `assets/<article-slug>-openclaw/`; escaped marker `assets/&lt;article-slug&gt;-openclaw/`.

## Go Gopher Metadata

- Route id: `gopher`.
- Display name: Go Gopher.
- Default marker: `default=false`.
- Source authority: official Go blog source `https://go.dev/blog/gopher`, Renee French attribution, Creative Commons Attribution 4.0 license context, and route-local `skills/visual-ip-illustrations/references/ips/gopher/gopher.png` visual authority.
- Route status: `source-reviewed`.
- Output path: `assets/<article-slug>-gopher/`; escaped marker `assets/&lt;article-slug&gt;-gopher/`.
- Source record: `references/ips/gopher/source.md`.
- Route framing: Go Gopher is an article-illustration mascot route with attribution/license context and public generated sample release review.
- Identity boundary: Go logo identity and official Go project affiliation, approval, sponsorship, and endorsement claims stay outside positive route identity.

## Cai Xukun Metadata

- Route id: `caixukun`.
- Display name: Cai Xukun.
- Default marker: `default=false`.
- Uploaded image authority: route-local uploaded visual authority recorded in `references/ips/caixukun/source.md` as uploaded reference image A and uploaded reference image B.
- Route status: `gated-public-figure`.
- Output path: `assets/<article-slug>-caixukun/`; escaped marker `assets/&lt;article-slug&gt;-caixukun/`.
- Source record: `references/ips/caixukun/source.md`.
- Route framing: Cai Xukun is a gated public-figure stylized mascot article-illustration route with uploaded-image authority and public generated sample release review.
- Source-image context: green reference background is source-image context; generated article illustrations keep the skill's sparse 16:9 white-background style.
- Likeness boundary: realistic-person portrait output, official endorsement, affiliation, impersonation, campaign, celebrity advertising, and fandom promotion claims stay outside route identity.

## Hermes Agent Metadata

- Route id: `hermes`.
- Display name: Hermes Agent.
- Default marker: `default=false`.
- Uploaded image authority: conversation attachment `Generated image 1 (16).jpeg`.
- Route status: `source-reviewed`.
- Output path: `assets/<article-slug>-hermes/`; escaped marker `assets/&lt;article-slug&gt;-hermes/`.
- Source record: `references/ips/hermes/source.md`.
- Route framing: Hermes Agent is a source-reviewed uploaded-image article-illustration route with official Hermes Agent context and MIT license context.
- Source authority: official website `https://hermes-agent.nousresearch.com/`, official repository `https://github.com/NousResearch/hermes-agent`, MIT license URL `https://github.com/NousResearch/hermes-agent/blob/main/LICENSE`, and documentation URL `https://hermes-agent.nousresearch.com/docs/`.
- Source-image context: monochrome full-body logo-style character, three-quarter side-facing standing pose, three-quarter left-facing manga face, large almond eyes with dark upper lashes, slim pointed nose, small slightly parted lips, pointed chin, cool reserved expression, blunt straight bangs, shoulder-length black hair with large C-shaped curled ends on both sides, bright white hair highlights, wide white over-head headset band, small black circular ear cup on the visible side, fitted black sleeveless spaghetti-strap mini dress, flared pleated skirt, small white neck/collar tag with an `A`-like mark, black thigh-high stockings, black Mary Jane platform high heels with strap and buckle, very long slim legs and reserved fashion-model posture.
- Sample policy: public generated Hermes samples require release review before publication.
- Output boundary: Generated Hermes outputs stay sparse 16:9 article illustrations.
- Product boundary: product advertising, product-poster output, CLI screenshots, web hero graphics, official endorsement, affiliation, sponsorship, approval, and impersonation stay outside route identity.
- Mythology boundary: mythological Hermes imagery stays outside default route behavior; winged sandals, winged helmet, caduceus, Greek messenger scenes, Olympian deity framing, and mythology-first symbols are mythology-drift markers.
- Drift boundary: generic anime assistant drift, generic logo mascot drift, passive placement, route leakage, excessive text, and copied composition stay outside positive route identity.

## Linux Mascot Metadata

- Route id: `linux`.
- Display name: Linux Mascot.
- Default marker: `default=false`.
- Uploaded image authority: `/Users/longnv/Downloads/Linux-logo.jpg`.
- Route status: `source-reviewed`.
- Output path: `assets/<article-slug>-linux/`; escaped marker `assets/&lt;article-slug&gt;-linux/`.
- Source record: `references/ips/linux/source.md`.
- Route framing: Linux Mascot is a source-reviewed uploaded-image article-illustration route with Tux attribution and Linux trademark-boundary context.
- Source authority: Tux creator Larry Ewing, Linux 2.0 Penguins source `https://isc.tamu.edu/~lewing/linux/`, The GIMP attribution condition, Linux Foundation trademark guidance `https://www.linuxfoundation.org/legal/trademark-usage`, and Linux mark ownership context `https://www.linuxfoundation.org/legal/the-linux-mark`.
- Source-image context: glossy black rounded penguin head and body, white face eye patches, large oval eyes with dark pupils and small highlights, yellow-orange beak with two nostril dots, white oval belly, long black flippers, seated rounded posture, and oversized yellow-orange webbed feet.
- Sample policy: public generated Linux Mascot samples require release review before publication.
- Output boundary: Generated Linux Mascot outputs stay sparse 16:9 article illustrations.
- Trademark boundary: official endorsement, affiliation, sponsorship, approval, certification, compatibility, Linux Foundation campaign framing, Linux Foundation logo use, distro-logo use, and distro branding stay outside route identity.
- Product boundary: product advertising, product-poster output, CLI screenshots, web hero graphics, kernel dashboard screenshots, and operating-system marketing graphics stay outside route identity.
- Drift boundary: generic penguin drift, generic server mascot drift, distro-logo drift, passive placement, route leakage, excessive text, and copied composition stay outside positive route identity.

## Seal Metadata

- `source_history`: former Sealos Seal route identity migrated to product-neutral Seal
- `canonical_image_status`: uploaded-image-canonical
- `drift_boundary`: uploaded-image-locked
- Fixed visual markers: white rounded seal body, plain navy cap with no logo, plain deep-blue hoodie chest with no logo, glossy dark eyes, black nose, whisker dots, small smile, short rounded flippers, compact legs, and side-rear white tail.
- No-logo markers: no cap logo, no chest logo, no mascot logos, no logo patches, no logo-like wave/cloud mark, no emblem, and no text badge.
- Authority boundary: the uploaded mascot image is the v1.3 shape authority; prior Sealos context remains historical source evidence.

## Legacy Path Availability

Root Xiaohei reference paths remain available during migration and point to canonical pack files:

- `references/style-dna.md` -> `references/ips/xiaohei/style-dna.md`
- `references/xiaohei-ip.md` -> `references/ips/xiaohei/xiaohei-ip.md`
- `references/composition-patterns.md` -> `references/ips/xiaohei/composition-patterns.md`
- `references/prompt-template.md` -> `references/ips/xiaohei/prompt-template.md`
- `references/qa-checklist.md` -> `references/ips/xiaohei/qa-checklist.md`

## Output Paths

- `xiaohei` output directory remains `assets/<article-slug>-illustrations/`; validation also keeps escaped marker `assets/&lt;article-slug&gt;-illustrations/`.
- `xiaohei` filenames continue to use ordered English slugs such as `01-topic-name.png`.
- `littlebox` output directory is `assets/<article-slug>-littlebox/`; validation also keeps escaped marker `assets/&lt;article-slug&gt;-littlebox/`.
- `littlebox` filenames use ordered English slugs such as `01-topic-name.png`.
- `tom` output directory is `assets/<article-slug>-tom/`; validation also keeps escaped marker `assets/&lt;article-slug&gt;-tom/`.
- `tom` filenames use ordered English slugs such as `01-topic-name.png`.
- `ferris` output directory is `assets/<article-slug>-ferris/`; validation also keeps escaped marker `assets/&lt;article-slug&gt;-ferris/`.
- `ferris` filenames use ordered English slugs such as `01-topic-name.png`.
- `seal` output directory is `assets/<article-slug>-seal/`; validation also keeps escaped marker `assets/&lt;article-slug&gt;-seal/`.
- `seal` filenames use ordered English slugs such as `01-topic-name.png`.
- `openclaw` output directory is `assets/<article-slug>-openclaw/`; validation also keeps escaped marker `assets/&lt;article-slug&gt;-openclaw/`.
- `openclaw` filenames use ordered English slugs such as `01-topic-name.png`.
- `gopher` output directory is `assets/<article-slug>-gopher/`; validation also keeps escaped marker `assets/&lt;article-slug&gt;-gopher/`.
- `gopher` filenames use ordered English slugs such as `01-topic-name.png`.
- `caixukun` output directory is `assets/<article-slug>-caixukun/`; validation also keeps escaped marker `assets/&lt;article-slug&gt;-caixukun/`.
- `caixukun` filenames use ordered English slugs such as `01-topic-name.png`.
- `hermes` output directory is `assets/<article-slug>-hermes/`; validation also keeps escaped marker `assets/&lt;article-slug&gt;-hermes/`.
- `hermes` filenames use ordered English slugs such as `01-topic-name.png`.
- `linux` output directory is `assets/<article-slug>-linux/`; validation also keeps escaped marker `assets/&lt;article-slug&gt;-linux/`.
- `linux` filenames use ordered English slugs such as `01-topic-name.png`.
- Mixed-IP requests split by IP into separate route groups: `xiaohei` 写入 `assets/<article-slug>-illustrations/`, `littlebox` 写入 `assets/<article-slug>-littlebox/`, `tom` 写入 `assets/<article-slug>-tom/`, `ferris` 写入 `assets/<article-slug>-ferris/`, `seal` writes to `assets/<article-slug>-seal/`, `openclaw` writes to `assets/<article-slug>-openclaw/`, `gopher` writes to `assets/<article-slug>-gopher/`, `caixukun` writes to `assets/<article-slug>-caixukun/`, `hermes` writes to `assets/<article-slug>-hermes/`, and `linux` writes to `assets/<article-slug>-linux/`.
- Before output, inspect the target directory and choose a new filename to preserve historical results.

## Delivery Report Fields

Each generated-image delivery states:

- selected visual IP
- image count
- purpose per image
- saved path
- stability notes: strongest images and optional images
