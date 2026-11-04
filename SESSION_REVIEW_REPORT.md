# InoConnect website: session review report

Date: 4 November 2026
Scope: everything changed in this session, re-checked from scratch.
State: all changes are local only. Nothing is committed and nothing is deployed. The live site (inoconnect.com) is still the August 2026 build.

---

## 1. Verification results (re-run during this review)

| Check | Result |
|---|---|
| Static audit, source: 64 pages, titles, meta descriptions, canonicals, OG/Twitter tags, one H1, JSON-LD validity, image alt and size attributes, internal links, sitemap coverage | 0 real issues |
| Static audit, `_deploy` build output, same checks | 0 real issues, 0 broken references |
| `_deploy` matches source | All 152 files are identical to source (text files and the video/poster checked byte for byte) |
| Browser crawl, every page at 375 px (phone) and 1280 px (desktop), 128 loads | 128/128 passed: no sideways scroll, no broken images, one `<main>` and one `<h1>` per page, nothing below the footer, sub-nav at 88 px, no unlabelled buttons, correct header mode, phone menu opens and closes |
| Script syntax: 285 inline scripts + 3 script files | 0 errors |
| Text clipping on the pages edited during this review | None at 375 px or 1280 px |
| Hero video file | 20 s, 1920×1080 H.264 + AAC, decodes with no errors, set up to start playing before the download finishes |
| Console errors | Only Cloudflare Turnstile error 400020 (the placeholder site key, see section 4) |

The audit's "placeholder text" warnings are all false positives: the check matches "NaN" inside words like *financial*, *dominance* and *maintenance*.

---

## 2. What was done, by request

### 2.1 Full site review (first request)
- **Tool result capture fixed.** `assets/tool-capture.js` looked for result elements that exist on no calculator page, so every "email me my result" submission would have been rejected. Each calculator's main result is now tagged with `data-result`. Number formatting is pinned to `en-US` so the server's format check also passes for visitors in other countries. All 4 tools were tested at their default and maximum values.
- **Tracking.** GTM + GA4 added to the 8 pages that had neither: About, Contact, AI Automation, AI Development and the 4 new posts. All 63 pages now have both.
- **Social tags** (OG + Twitter) added to the 4 new blog posts. The GEO post title was shortened from 68 to about 60 characters.
- **Deploy script** (`_plan/build_deploy.mjs`) now copies `framer-components.css/.js`, CSS background images and the new poster. Without this, the homepage, Services and Tools pages would have broken after deploy.
- **Page structure.** 17 pages had two `<main>` regions and 3 tool pages had none, which broke their skip links. Every page now has exactly one.
- **Duplicate sections.** The healthcare, e-commerce and SaaS pages each had a copy of a section injected below the footer. The copies were removed.
- **Claims.** The reintroduced "BAA Signed", "All analytics platforms operate under BAAs" and "0% PHI Leaks" claims were removed. The site-wide menu wording changed from "HIPAA-compliant" to "HIPAA-aware".
- The form scripts got cache-busting version numbers.

### 2.2 Hero video, blending and replacement sections (second request)
> **Update:** the hero video was later removed from the site at your request. See section 7. The replacement industry sections described below are still in place.

- **New 20 s hero film** made from your 4 Google Flow stills, animated in local ComfyUI (Wan 2.1, camera held still, low motion) and saved as PNG frames instead of compressed WebM. Frame rate interpolated from 16 to 30 fps, a slow push-in added, one colour grade across all scenes, crossfades between scenes and a soft dip at the loop point. It reuses the old film's 20 s soundtrack.
  - Size: **4.0 MB, down from 10.4 MB.** The poster is a 55 KB WebP; the old one was a 623 KB JPG.
  - Old film backed up as `videos/inoconnect-hero-showreel.v1-backup.mp4`.
- **Blending (no layout change).** The top and bottom of the video fade into the dark bar above and the chapter cards below, with a soft vignette. The chapter card for the current scene highlights as the film plays, and clicking a card jumps to that scene; the cards are keyboard-accessible. The "35s" labels now say "20s". The video loads lazily (`preload="metadata"`) and doesn't autoplay for visitors with reduced motion turned on.
- **Replacement sections.** The 3 removed duplicates were replaced with new sections in the same style, inside the page above the footer:
  - E-commerce: "The Retention & AOV Flywheel", linking to the email simulator.
  - SaaS: "The Trial-to-Paid Activation Engine", linking to the LTV calculator.
  - Healthcare: "From First Search to Booked Appointment", linking to Contact.

### 2.3 UI fixes from your screenshots (third request)
- **Root cause:** `assets/site.css` was a stale Tailwind build, so classes added in recent edits (such as `py-28` and `pt-20`) did nothing. The "Scientific Methodology" and "Direct Comparison" sections and the footer had **0 px** top padding. The CSS was rebuilt from all pages, with the hand-written header/nav CSS kept. The hand-written CSS now lives in `_plan/input.css`, and the deploy script rebuilds `site.css` on every build.
- **Scaling Engine** on phones (SaaS, SEO, PPC, Content and Social pages): now a compact numbered list, about 1,600 px → 780 px tall. The pale step numbers were made readable.
- **Clutch badge** removed from the homepage.
- **Fake metrics replaced** with facts the site supports: 8 services, 7 industries, 4 free tools, 48-hour audit. Also removed: "< 45 days" and "30% signal loss" in the comparison table, and "CRM sync < 2.4s".
- **Footer on phones:** two link columns, bigger tap targets, centred bottom bar, about 25% shorter.
- An old-vs-new CSS comparison of all 64 pages showed only intended changes.

### 2.4 Header (fourth request)
- **Root cause:** 48 pages carried CSS for an older phone menu (offset 5 rem from the top, sliding in from the right on a light background, white submenu boxes), and 53 pages had inline copies of the header CSS with different values. So the menu behaved differently from page to page. Both were removed; `site.css` is now the only source for header styles.
- **Phone menu:** solid background, logo at top, close button in the same spot as the menu button, "All services" and "All industries" links, Tools link, one submenu open at a time, closes with Escape or a link tap, focus moves into and out of the menu, and hidden links can't be tabbed into.
- **Tablet (768–1023 px):** uses the phone menu instead of a crammed full nav. The sub-nav no longer slides under the header and no longer shows a scrollbar.
- **Desktop:** Tools added to the nav, short close delay on dropdowns, first tap opens a dropdown on touch screens, keyboard Tab opens and Escape closes, visible focus outlines.
- **About page:** the same fake stats (98.2%, $48M+, 4.8x) and the "< 45 Days Payback" card were replaced.
- The header markup is now identical on all 63 pages.

---

## 3. Issues found and fixed during this review

I had said these were done, but this review found more of the same class of fake numbers:
- **Homepage cards:** "99.8% search visibility", "4.2x ROAS", "< 2.4s" and "+68% conversion lift" were replaced with descriptions of what's included. "< 2.4s" was also removed from the growth-framework list.
- **AI Automation page:** "< 2.4s Response" became "Instant Response".
- **Services page:** card metrics "+318%", "84% Top 3", "Sub-Second", "+190%" and "12.4x" were replaced. The stats bar ("Scaled", "High retention", "3.5x+ ROAS") was replaced with the same facts used on the homepage and About page. "Reclaim 40+ hours per team weekly" was reworded.
- **Industries page:** stats bar "100% Regulatory Compliance", "< 8 Mo CAC payback" and "High retention" were replaced.
- **Healthcare page:** the "100% HIPAA & Regulatory Compliance" tile became "HIPAA-aware tracking & intake design".
- **E-commerce page:** "+42% 60-Day Repeat Order Rate" was replaced.

Kept on purpose: "> 3.8x" (labelled as a *target*), "4.2x" (labelled as a *target ROAS*), "99+ / < 0.4s LCP" (a build standard), and "100%" asset ownership (a contract term).

---

## 4. Still open: needs you

### Blockers (the site works, but leads are lost until these are fixed)
1. **Forms backend not deployed.** The contact form and all 4 calculator forms post to a placeholder Apps Script URL (`AKfycbx-inoconnect-lead-capture`, which returns 404). The Turnstile key is `0x4AAAAAAAMQ-placeholder`, and `_plan/Code.gs` has `SHEET_ID = 'PASTE_SHEET_ID'`. You need to create the Sheet and a Turnstile site, deploy `Code.gs`, and send me the URL and site key.
2. **Test the redirects right after deploying.** The new `.htaccess` rule `RewriteCond %{HTTPS} off` can cause a redirect loop behind Hostinger's CDN. Today both `www.` and the bare domain serve the site, which counts as duplicate content.

### Decisions
3. ~~29 more unsupported result numbers on service and industry pages~~ **Done on your go-ahead.** See section 6.
4. **The ROAS calculator page has a "Performance Case Study"** (1.9x → 4.4x ROAS, $35k → $115k/mo spend) with no named client.
5. **The attribution blog post** describes client results ("34.2% lower CAC, ROAS 2.9x → 4.8x").
6. **The new blog posts' statistics have no sources** ("42% of queries", "3.8x more likely", "391% lift"). They also call Google's AI Overviews "SGE" and use five different author names.
7. **The benchmark tables on the Tools pages** (industry ROAS and payback ranges) have no source.
8. **Double counting.** Both GTM and GA4 are loaded directly. If your GTM container also fires GA4, visits are counted twice; check this in GTM.

### Optional
- (Video removed; the Google Flow idea no longer applies.)
- Add links between the new posts and older posts.

---

## 5. Technical notes for whoever maintains this

- **CSS pipeline:** edit `_plan/input.css` for hand-written CSS. `node _plan/build_deploy.mjs` rebuilds `assets/site.css` (Tailwind, from every page) and assembles `_deploy/`. Bump `site.css?v=` on all pages when the CSS changes; the current version is `v=20261109`. `.htaccess` caches CSS for a year.
- **Header:** the markup between `INOCONNECT_HEADER_START` and `INOCONNECT_MOBILE_END` and the script between `INOCONNECT_JS_START` and `INOCONNECT_JS_END` are identical on all 63 pages. Change all of them together.
- **Hero film (no longer used):** generation and assembly scripts are in the session scratchpad (`gen_hero.py`, `assemble_hero.py`). ComfyUI runs from `C:\Users\talha\ComfyUI-Installs\ComfyUI (2)` using its `.venv`.
- **Local preview:** `.claude/launch.json` (Python static server on port 8080). It doesn't support byte-range requests, so seeking in the video doesn't work locally; Hostinger does support them.

---

## 6. Follow-up: the 29 stat tiles replaced

Each made-up result became a short, true description of what the service covers, in the same tile and style. No new numbers were invented.

| Page | Was | Now |
|---|---|---|
| /industries/b2b/ | -28% Reduction in Sales Cycle | ABM, Account-Based Targeting |
| /industries/ecommerce/ | 2.5x Repeat Purchase Rate Increase | LTV, Retention Flows |
| /industries/ecommerce/ | -18% Cart Abandonment | CRO, Checkout Testing |
| /industries/education/ | -25% Lower CPE | CPE, Enrollment Focus |
| /industries/education/ | 100k+ students reached | Global, domestic and international campaigns |
| /industries/healthcare/ | -20% Cost-Per-Appointment | Local, Patient Search |
| /industries/professional-services/ | -30% Sales Effort | Inbound, Lead Qualification |
| /industries/saas/ | 48% Trial-to-Paid Increase | PLG, Trial-to-Paid Funnels |
| /industries/saas/ | -35% Reduction in CAC | CAC, Efficiency Focus |
| /industries/saas/ | 48% Funnel Optimization | Trials, Funnel Optimization |
| /industries/saas/ | < 8 Months CAC Payback ("inside two quarters") | Payback, tracked per channel |
| /industries/saas/ | > 4.5x LTV to CAC | LTV:CAC, Unit Economics |
| /industries/saas/ | 125%+ NRR ("routinely offsets churn") | NRR, helps expansion offset churn |
| /industries/startups/ | -50% Time to Validation | Sprints, Rapid Validation |
| /services/ai-development/ | < 150ms First-Token Latency | Streaming, Low-Latency Responses |
| /services/ai-development/ | SOC2 Ready | Private, Data Governance |
| /services/content-marketing/ | 4.5x More Leads for Companies Who Blog | Inbound, Leads From Content That Keeps Ranking |
| /services/content-marketing/ | 70% Prefer Content Over Ads | Trust, Built Through Content |
| /services/ppc/ | 5.4x Average ROAS Across All Campaigns | ROAS, Optimized for Profit, Not Clicks |
| /services/ppc/ | -42% Decrease in Acquisition Cost | CAPI, Server-Side Tracking |
| /services/ppc/ | $150M Annual Spend Managed | 3 Ad Networks: Google, Meta, LinkedIn |
| /services/ppc/ | 500% Scale Potential | Full Funnel Coverage |
| /services/seo/ | 215% Organic Traffic Increase in Year 1 | GEO, Google + AI Search Visibility |
| /services/seo/ | #1 Rank for Core Keywords | Intent, High-Intent Keyword Targeting |
| /services/seo/ | 10k+ Content Pieces Optimized | On-Page, Content Optimization |
| /services/seo/ | 99.9% Uptime Integrity | CWV, Core Web Vitals |
| /services/social-media/ | 3.2x Growth in Inbound Leads | Inbound, Leads From Social |

**Kept on purpose:**
- the AI Automation savings calculator outputs (3,456 hrs, $155,520), which are computed live from the visitor's inputs;
- "< 30 Days Production Rollout", which matches the page's own 30-Day Deployment Framework;
- "100% Own" code and IP rights, which is a contract term.

**Fixed while checking text fit:**
- **Startups page:** a card had a broken attribute (`class-=` instead of `class=`), so it lost all its styling (no green background, squeezed to 79 px). This was there before this session.
- **Stat words:** step down one size below 1024 px, so long words like "Post-Purchase" fit the cards at tablet width.
- **Card headings:** "Thought Leadership", "Conversion Rate Opt. (CRO)", "LinkedIn Domination", "Professional", "E-commerce" and "Professionalism" were slightly too wide at tablet width; they now step down one size.
- **Verified:** the 12 edited pages at 375, 768, 1024 and 1280 px show no clipped or overflowing text.


---

## 7. Follow-up: hero video removed

Removed at your request, because the video didn't look good enough.

- **Homepage:** the whole video player is gone (the "showreel" title bar, play/pause and sound buttons, the video itself and the chapter cards under it). So are the "Watch Showcase Film" button, the video control script and the video-only CSS. The hero now runs headline → text → "Claim Your Free Growth Audit" button → trust badges → the facts strip (8 services, 7 industries, 4 tools, 48-hour audit).
- **Deploy:** `_plan/build_deploy.mjs` no longer copies anything from `videos/`. `_deploy/` dropped from 22.9 MB to 18.9 MB and has no video folder.
- **CSS:** rebuilt, version bumped to `site.css?v=20261110`.
- **Checked:** no `<video>` on any page, homepage scripts parse with no console errors, the full-site crawl passes at phone and desktop width, and the deploy audit is clean.
- **Local files kept:** `videos/inoconnect-hero-showreel.mp4`, `videos/inoconnect-hero-showreel.v1-backup.mp4` and `videos/inoconnect_hero_poster.webp` are still on your disk but unused. Delete them if you don't want them.
- **On the server:** if an earlier upload put a `/videos/` folder on Hostinger, delete it there too. The new build doesn't need it.
