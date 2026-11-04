# Brief for per-group UI agents (phases 3 judgment, 4, 5)

Repo: `D:\ino website` (static Tailwind site, Windows, Git Bash + Node). Read `UI_CONSISTENCY_PLAN.md` (audit + target) first.
The sitewide mechanical pass is DONE: one font link per page, Inter body / Outfit headings via base layer, brand hex → tokens, gradient text → `.text-gradient-brand`, inline style blocks de-forked, blog prose fixed.

You own ONLY the files listed in your task. Other agents are editing other pages in parallel.
**Do not edit** `tailwind.config.js`, `_plan/input.css`, `assets/*.css`, or any page outside your list. If you need a new shared class, don't add it — use utilities and mention it in your report.
Don't change copy, links, scripts, meta/SEO/schema. Don't commit.

## Tokens available (tailwind.config.js)
`primary` `primary-dark` `primary-soft` `secondary` `secondary-dark` `secondary-ink` `accent` `accent-dark` `accent-ink` `heading` (#1e293b), plus slate.
Components in input.css: `.btn` + `.btn-primary|.btn-secondary|.btn-accent|.btn-white|.btn-ghost`, `.btn-sm`, `.text-gradient-brand`, `.eyebrow` (text-xs bold uppercase tracking-[0.2em]), `.article-body`.

## Rules to apply on your pages

**Colour / contrast**
- On LIGHT backgrounds (white, slate-50/100, white cards): text must not be `text-slate-400`, `text-secondary`, `text-accent`, `text-primary-soft`. Use `text-slate-500` (meta/labels), `text-secondary-ink`, `text-accent-ink`, `text-primary`. Decide light vs dark by the nearest ancestor background (dark = bg-slate-800/900/950, bg-black, bg-primary, dark gradients, dark image overlays). On dark backgrounds those colours are fine — leave them.
- Off-palette families (purple, violet, teal, cyan, sky, indigo, blue, orange, amber, yellow, green, emerald, gray, etc.) → map to brand/slate: blue/indigo/sky → primary; teal/emerald/green/cyan → secondary (or secondary-ink for text on light); orange/amber/yellow → accent (accent-ink text on light); purple/violet → primary; gray → slate. Keep opacity suffixes. Keep `red-*` only for error/status meaning. Third-party brand hex (LinkedIn #0A66C2/#0077b5, Google #4285F4, Meta #0668E1) stays.
- Headings: colour on light = `text-heading` (replace `text-slate-900`, `text-slate-950`, `text-slate-800` on h1–h3); on dark = `text-white`.

**Type scale (replace existing size/leading/tracking/weight classes on these elements)**
- Page H1 (light hero): `text-4xl md:text-6xl font-black tracking-tight leading-[1.05] text-heading` (dark hero: `text-white`). Keep margin/max-width/alignment classes.
- Section H2: `text-3xl md:text-5xl font-black tracking-tight leading-tight` + colour. Huge display H2s (6xl–9xl) come down to this too.
- Card/item H3: `text-xl font-bold` (small list-item h3s that are text-sm/base can stay small, but `font-bold`, not black).
- Eyebrow labels (small uppercase tracked text above headings): replace with `eyebrow` + colour class.
- Body paragraphs: `font-normal` or `font-medium`, never `font-black`/`font-bold` for running copy. Lead paragraph under H1: `text-lg md:text-xl leading-relaxed`.
- Labels, nav-ish chips, stat captions: `font-bold` max; reserve `font-black` for H1/H2 and big stat numbers.
- Micro sizes: `text-[11px]` → `text-xs`. Arbitrary leading values → `leading-none|tight|snug|relaxed` (except the H1's `leading-[1.05]`).
- Tracking: only `tracking-tight` (headings), `tracking-tighter` (big stat numbers), `tracking-wider`/`tracking-widest`/`tracking-[0.2em]` (uppercase labels). Drop `tracking-[0.3em]` → `tracking-[0.2em]`.

**Shape / elevation / spacing**
- Radius allowed: `rounded-full` (pills/buttons/avatars/dots), `rounded-xl` (inputs, chips, small icon tiles), `rounded-2xl` (cards), `rounded-[2rem]` (large panels/media/hero visuals), plus side variants of those. Map: `rounded`/`rounded-md`/`rounded-lg` → `rounded-xl`; `rounded-3xl` → `rounded-[2rem]` if large panel else `rounded-2xl`; `rounded-[2.5rem]`/`[3rem]`/`[3.5rem]`/`[4rem]` → `rounded-[2rem]`; `rounded-bl-[100px]` decorative corners → `rounded-bl-[2rem]`.
- Shadows: `shadow-sm` (rest), `shadow-xl` (raised), `hover:shadow-2xl` (hover). Brand glow only `shadow-primary/20` (map /30 /40 /50 /60 and secondary/accent-tinted glows to `shadow-primary/20` or drop). Arbitrary `shadow-[0_0_10px_rgba(...)]` on tiny status dots may stay; larger arbitrary glows → `shadow-xl`.
- Section vertical padding: standard sections `py-20 md:py-28`; compact bands (logo strips, CTA ribbons, stat strips) `py-16`. Don't touch the hero top padding that clears the fixed header (e.g. `pt-32`/`pt-40`).
- Containers: `max-w-7xl mx-auto px-6` (keep existing px if it's px-4/px-6/sm:px-6/lg:px-8 pattern — don't fight it). Drop `max-w-[1400px]` → `max-w-7xl`.
- Buttons: CTA links/buttons → `btn btn-primary` (or `btn-white` on blue/dark CTA banners, `btn-secondary`/`btn-accent` when the page clearly uses that colour for the CTA, `btn-ghost` for outlined secondary). Remove the replaced bg/px/py/rounded/font/uppercase/tracking/shadow/hover-scale classes; keep layout classes (w-full, mt-*, etc.) and any icon children. The fixed header CTA (`bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest …`) → `btn btn-primary btn-sm`. `hover:scale-110` → gone (btn has hover:scale-[1.03]). Leave form `<button type="submit">` behaviour intact.

## Check before reporting
Run `node _plan/check_ui_tokens.mjs` and filter to your files (e.g. `| grep "^services/"`). Target: zero ERROR lines for your files (off-palette, radius, brand-hex, etc.). `low-contrast-light` is a heuristic WARN — review each hit on your pages: fix real ones; false positives (dark section the parser missed) are OK, note how many you left.
Also: every page still ends with `</html>`, tag balance unchanged (count `<div` vs `</div` before/after per file and keep the delta the same).

Write any codemod helpers as `_plan/ui_g<N>_*.mjs`. Prefer a scripted pass for the safe mappings + hand edits for judgment calls.

Report (under 300 words): files changed, what you normalised, counts, remaining guardrail hits on your files and why, anything you were unsure about.
