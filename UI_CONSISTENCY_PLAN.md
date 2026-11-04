# UI Consistency Audit & Fix Plan

Audited 2026-11-04 — 64 pages (`index`, `404`, about, contact, blog ×36, industries ×8, services ×10, tools ×5, privacy, terms).
Method: static scan of every class, hex value, inline style and `<style>` block, plus `tailwind.config.js`, `_plan/input.css` and the built `assets/site.css`.
Not done: visual check in a browser. The local preview server didn't respond, so every finding below comes from the source and should be screenshot-checked after each phase.

Severity: **P0** = visibly broken now · **P1** = obvious inconsistency a visitor notices · **P2** = token/code hygiene that causes future drift.

---

## 1. Findings

### 1.1 Typography: four different font setups across the site (P0/P1)

All 63 pages load Google Fonts Inter **and** Outfit. 17 pages load Inter twice. But which font actually renders depends on each page's own `<style>` block:

| Group | Pages | Body text | Headings |
|---|---|---|---|
| A. Service/industry detail | 13 (`services/{seo,ppc,…}`, `industries/{b2b,…}`) | Inter | Outfit (h1–h3 only; h4–h6 fall back to Inter) |
| B. Hub pages | blog index, services index, industries index, tools ×5, privacy, terms | **system UI font** (`font-sans` = Tailwind default) | Outfit |
| C. Older blog posts | 25 posts | Outfit | Outfit |
| D. **No custom font at all** | **Home page**, about, contact, ai-automation, ai-development, 404, 10 newer blog posts | system UI font | system UI font |

So the home page, about and contact pages render in Segoe UI on Windows and SF on Mac, while service pages render in Inter/Outfit. Both font files still download on those pages, so they cost bandwidth for nothing.
- `404.html` loads no web fonts at all.
- `.font-heading` is used on 13 pages and only defined inside those pages' `<style>` blocks. It isn't in `tailwind.config.js`.
- `font-mono` appears 122 times on 17 pages: stat numbers and labels use the system monospace on some pages and Outfit on others.

### 1.2 Article body styles are missing on 6 posts (P0)

`ai-marketing-tools`, `digital-marketing-strategy`, `how-to-improve-conversion-rate`, `ppc-vs-seo`, `roas-formula` and `what-is-cost-per-click` use `<article class="… article-body">` and unclassed `<h2>`/`<ul>`. But `.article-body` CSS lives only in the 25 older posts' inline `<style>`, and it isn't in `site.css`. Tailwind preflight resets headings, so **their section H2s render at 16px, the same size as body text, and their lists have no bullets.**
- 10 newer posts use `prose` / `prose-lg`, but `@tailwindcss/typography` isn't installed (`plugins: []`), so those classes do nothing.
- So there are three different article renderers: the old `.article-body` inline CSS, a dead `prose` class, and hand-classed h2s (the 4 newest posts).

### 1.3 Heading color: one token, two values (P1)

- `tailwind.config.js`: `heading: '#696969'` (mid grey).
- `_plan/input.css`: `--heading: #1e293b` (slate-800).
- Old blog CSS: `--text-heading: #1e293b`.

Headings currently use **five different colors**: `text-heading` (#696969, 126 uses, 21 pages), `text-[#1e293b]` (112), `text-slate-900` (1,395), `text-slate-950` (17), `text-slate-800` (409). For example, an H2 on `/services/seo/` is grey #696969, while the H1 on `/about/` is white and the hub H2s are slate-900.
- `<body>` default text color also varies: `text-heading` (grey), `text-slate-800`, `text-[#334155]`, `text-slate-900`, or none.

### 1.4 Brand colors: hard-coded hex vs tokens, and drifting hover shades (P1/P2)

- Hex is used instead of tokens: `#4169E1` ×1,042, `#44D7A8` ×913, `#FF7518` ×654, against `bg-primary` ×219 etc. Any brand change means find-and-replace across 64 files.
- Primary hover uses three shades: `hover:bg-primary-dark` (#3152B3), `hover:bg-[#3152B3]`, and `hover:bg-blue-600` (#2563EB, a different hue) on the home hero CTAs.
- Secondary hover/dark `#33b88e` is used on 6 pages but isn't a token.
- Accent hover uses `#e06612`, `#ea580c` (orange-600), `#EA580C` and `hover:bg-orange-500`: four values.
- Off-palette colors:
  - `#6e6e73` (Apple grey): 93 uses, `blog/index.html` only.
  - `#00FFFF` (cyan card): home.
  - `#05070d` / `#060810`: near-black backgrounds that differ from `slate-950`.
  - `#D97706`: education page.
  - purple-400/500/600: home, about, blog.
  - teal-*: ai-development.
  - blue-*: ai-automation.
  - orange-*: ecommerce.
  - amber-400: about.
- Secondary text on light backgrounds `#44D7A8` (271 uses) has a contrast of **1.8:1** on white, which fails WCAG for any text. `secondary-ink #0F766E` and `accent-ink #C2410C` exist for exactly this case, but they're used **0 times**. `#FF7518` text on white is 2.7:1, which also fails for normal-size text.
- `text-slate-400` (#94a3b8) is the most-used text color (3,526 uses) and is 2.6:1 on white. It's fine on dark sections, but every use on a white or slate-50 background fails AA.
- Gradient headline text uses 10 different stop combinations (`from-[#4169E1] via-[#44D7A8] to-[#FF7518]` ×11, then 9 one-off variants, including `via-teal-500` and `via-blue-500`).

### 1.5 Type scale: no fixed H1/H2 sizes (P1)

- **H1: 13 different class sets.** Mobile size is 3xl or 4xl. Desktop size is 5xl, 6xl or 7xl. Line height takes 6 values (tight, `[1.05]`, `[1.08]`, `[1.12]`, none, default).
- **H2: 40+ different class sets.** Desktop size runs from 2xl to 9xl (`lg:text-9xl` on home). Letter spacing mixes `tracking-tight`, `tracking-tighter`, `tracking-[-0.05em]` and the broken `tracking-[ -0.05em]` (the space makes it invalid, so it's ignored on 9 pages).
- `blog/index.html` H1 has conflicting `md:text-5xl md:text-7xl`.
- Line heights: 11 values, including 7 arbitrary ones (`[0.85]`, `[0.9]`, `[0.95]`, `[1.05]`, `[1.08]`, `[1.1]`, `[1.12]`).
- Letter spacing for eyebrows/labels: `tracking-widest`, `tracking-wider`, `tracking-[0.2em]`, `tracking-[0.3em]`.
- `text-[11px]` (4 pages) sits between `text-xs` (12px) and nothing. The TOC uses an inline `font-size:0.74rem` on 25 pages, and the category nav uses `0.8rem`. That's three micro-sizes.
- Weights: `font-black` is used 4,014 times, including on body copy, buttons, labels and nav. With almost everything at 900, weight no longer signals hierarchy. `font-medium` and `font-normal` are rare (59 uses).

### 1.6 Shape, elevation, spacing (P2)

- **Radius: 11 values.** `rounded`, `md`, `lg`, `xl`, `2xl`, `3xl`, `[2rem]`, `[2.5rem]`, `[3rem]`, `[3.5rem]`, `[4rem]`, plus `rounded-bl-[100px]`. Cards alone use 2xl, 3xl, [2rem], [2.5rem] and [3rem]. Mega menu: `1.5rem` in `site.css` vs `24px` in the old blog CSS (same value), but the menu offset is 14px vs 20px and the dot size is 10px vs 12px.
- **Shadows:** 14 variants, including 5 arbitrary glow shadows. Brand-tinted shadows mix `/20`, `/30`, `/40`, `/50` and `/60` opacity.
- **Section vertical padding:** `py-12`, `20`, `24`, `28`, `32`, `40`. Hub pages use 24, detail pages use 32, and home uses all of them.
- **Container width:** `max-w-7xl` (standard) plus a one-off `max-w-[1400px]` on home. Body copy width varies between `max-w-2xl`, `3xl` and `4xl` for the same role.
- **Buttons:** the header CTA (63 pages) is `px-8 py-3 text-sm`. Home hero CTAs are `px-10 py-5` with `hover:scale-110` on one and `hover:scale-105` on the other. The banner CTA is `py-4 px-10` and has no uppercase or tracking. That's three button sizes and two scale amounts with no system.

### 1.7 Structural / template drift (P1)

- **404** has its own header (not fixed, no nav) and footer (`py-10`, different border).
- **25 older blog posts** carry ~6.5 KB of inline CSS that re-declares `.nav-link`, `.mega-menu` and `.mega-circle` with different values from `site.css`. Their header and mega menu animate and look slightly different from every other page.
- The other templates each repeat ~2–5.7 KB of near-identical inline CSS (4 variants). Each one is a fork that drifts.
- The home page has 10 inline `style="color:#ffffff !important"`, 5 `#94a3b8 !important` and 1 `#060810 !important` overrides.
- `input.css` uses `!important` about 60 times (category nav, mega menu), which forces later fixes to use `!important` too.
- `framer-components.css` (20 KB) is linked by only 3 pages.

---

## 2. Target system (decisions to confirm before fixing)

| Token | Proposal |
|---|---|
| Fonts | **Outfit** for headings, **Inter** for body. One `<link>` per page: `Inter:wght@400;500;600;700` + `Outfit:wght@600;700;800;900`, `display=swap`. Set it once in `tailwind.config.js` `fontFamily.sans/heading` plus `body`/`h1–h6` base rules in `input.css`. |
| Heading color | `#1e293b` (slate-800). Change `heading` in the Tailwind config to match the CSS var. Drop `#696969`. |
| Body text | slate-600 (#475569) on light, slate-300 on dark. Muted/meta: slate-500 (4.8:1). slate-400 only on dark backgrounds. |
| Brand | `primary #4169E1` / hover `primary-dark #3152B3`. `secondary #44D7A8` / new `secondary-dark #33B88E`. `accent #FF7518` / new `accent-dark #E06612`. For text on light backgrounds, always use `secondary-ink #0F766E` / `accent-ink #C2410C` / `primary`. |
| Off-palette | Remove purple / teal / blue-* / orange-* / amber / cyan / `#6e6e73` / `#05070d` / `#060810`, and map each to the brand or slate equivalent. |
| Gradient text | One utility, `.text-gradient-brand` (primary → secondary → accent). |
| Type scale | H1 `text-4xl md:text-6xl leading-[1.05] tracking-tight font-black`. Section H2 `text-3xl md:text-5xl leading-tight tracking-tight font-black`. Card H3 `text-xl font-bold`. Eyebrow `text-xs font-bold uppercase tracking-[0.2em]`. Body `text-base md:text-lg leading-relaxed font-normal`. Small/meta `text-sm`. Micro `text-xs` (drop 11px, 0.74rem, 0.8rem). |
| Weights | 900 for H1/H2 only, 700 for H3/buttons/nav, 400–500 for body. |
| Radius | `rounded-full` (pills, buttons), `rounded-xl` (inputs, small chips), `rounded-2xl` (cards), `rounded-[2rem]` (feature panels, media). Nothing else. |
| Shadow | `shadow-sm` (rest), `shadow-xl` (raised), `shadow-2xl` (hover). One brand glow: `shadow-primary/20`. |
| Section spacing | `py-20 md:py-28` standard. `py-16` for compact bands. |
| Buttons | `.btn` base (pill, `font-bold uppercase tracking-widest text-sm`, `px-8 py-4`, `hover:scale-[1.03]`) with variants `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-white`. |

---

## 3. Execution plan

Each phase is a small Node script in `_plan/`, matching the existing pattern, so you can rerun it. Each phase ends with `npm run build` (Tailwind) and a screenshot check of 6 reference pages: home, about, `services/seo`, `blog/roas-formula`, `blog/meta-ads-scaling` and `tools/roas-calculator`, at 1280px and 375px.

**Phase 1 – P0 fixes (small, low risk)**
1. Move the `.article-body` rules from the old blog inline CSS into `_plan/input.css`. This fixes the 16px H2s on 6 posts.
2. Put the 10 `prose` posts on `.article-body` too: remove `prose`/`prose-lg`. Don't install the typography plugin; `.article-body` already covers it.
3. Fix `tracking-[ -0.05em]` → `tracking-tighter` (9 pages), and `md:text-5xl md:text-7xl` on the blog H1.
4. Add web fonts to `404.html`.

**Phase 2 – Fonts (one source of truth)**
1. `tailwind.config.js`: `fontFamily: { sans: ['Inter', …], heading: ['Outfit', …] }`.
2. `input.css` base layer: `body { @apply font-sans text-slate-600 }` and `h1–h6 { @apply font-heading text-heading }`.
3. Replace every page's font `<link>` with the single combined link, so no page loads Inter twice.
4. Delete the `font-family` / `.font-heading` / `body` / `h1…` rules from all inline `<style>` blocks.
5. Review the 122 `font-mono` uses: keep them for code/stat numerals only, or switch to `tabular-nums`.

**Phase 3 – Color tokens**
1. Config: `heading: '#1e293b'`, and add `secondary-dark` and `accent-dark`.
2. Codemod: `[#4169E1]` → `primary`, `[#3152B3]` → `primary-dark`, `[#44D7A8]` → `secondary`, `[#33b88e]` → `secondary-dark`, `[#FF7518]` → `accent`, `[#e06612|#ea580c]` + `orange-600` → `accent-dark`, `[#1e293b]` / `slate-900` (when on a heading) → `heading`, `[#334155]` → `slate-700`, `[#64748b]` → `slate-500`.
3. Fix contrast: `text-secondary` / `text-accent` on light sections → `-ink` variants. `text-slate-400` on light sections → `slate-500`. This needs a per-section check of the dark/light ancestor; the script flags them and I review each.
4. Replace the off-palette colors (purple, teal, blue-*, orange-*, amber, cyan, `#6e6e73`, `#05070d`, `#060810`, `#D97706`, `blue-600` hover) with brand or slate equivalents.
5. Add a `.text-gradient-brand` utility and replace the 10 gradient variants.
6. Remove the home page's inline `!important` color styles.

**Phase 4 – Type scale & weights**
1. Normalise H1 (13 variants → 1, with a separate white-on-dark version) and section H2 (40+ → 2: light and dark).
2. Normalise eyebrows to the single eyebrow class, and collapse leading/tracking arbitrary values.
3. Lower `font-black` on body copy, card text and labels to `font-bold` or `font-medium`, per the weight rule above.
4. Micro sizes: `text-[11px]`, the inline `0.74rem` and the `0.8rem` category link → `text-xs`.

**Phase 5 – Shape, elevation, spacing, buttons**
1. Radius map: `[2.5rem]`, `[3rem]`, `[3.5rem]`, `[4rem]`, `3xl` → `[2rem]` for panels. `lg`, `md` → `xl`.
2. Shadow map onto the 3-step scale plus one glow. Remove the arbitrary glow shadows except the status-dot glow.
3. Section padding → `py-20 md:py-28`. Drop the home page's `max-w-[1400px]`.
4. Add `.btn*` components in `input.css` and swap the header CTA, hero CTAs and banner CTAs to use them.

**Phase 6 – Template de-forking**
1. Delete the remaining inline `<style>` blocks (header, mega menu, nav and article CSS are all in `input.css` by now). Keep only page-specific keyframes, moved into `input.css`.
2. Give `404.html` the standard header and footer.
3. Cut the `input.css` `!important`s where the inline overrides they fought are now gone.

**Phase 7 – Guardrail**
- Add `_plan/check_ui_tokens.mjs`. It fails if any page contains: a brand hex in a class, an off-palette color family, a radius outside the allowed set, a `font-family` in an inline style, `text-slate-400` / `text-secondary` inside a light section, or more than one font `<link>`. Run it in `build_deploy.mjs` before deploy.

## 4. Risk notes
- Phases 3–5 touch thousands of class strings. Codemods are deterministic but take a judgment call on dark vs light sections. Contrast changes and heading-color swaps get a flagged review list instead of blind replacement.
- Changing the heading color from grey to slate-800 will make headings visibly darker on the 21 pages that currently use `text-heading`. That's intended, but it's a visible change.
- Going from `font-black` to `font-bold` on body copy changes the brand feel. Phase 4 can be skipped or tuned on its own.
- Nothing is committed per phase unless you ask. Each phase is a separate diff you can review.
