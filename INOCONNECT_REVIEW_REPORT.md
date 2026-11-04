> **SUPERSEDED by `IMPLEMENTATION_PLAN.md`.** This first-pass report contains errors that were corrected on re-testing: homepage image weight is 28 MB not 48 MB; the "50 icon buttons without aria-label" finding was wrong (0 found in the browser); the sitemap DOES have lastmod; document-level overflow reproduced only on Headless CMS (408px), not Podcast. Use the plan instead.

# InoConnect website: in-depth review and fix plan

**Reviewed:** 3 Nov 2026, local export `D:\ino website` (53 pages). Method: static scan of every page (my own script), manual reads of home, about, contact, privacy, terms, and a 390px layout sweep in a browser against a local server.
**Not done:** live-site re-check (see the earlier report you pasted), real Lighthouse timings, a human visual pass of every page, legal review.
Severity: **P0** fix before launch, **P1** fix soon, **P2** polish.

## 0. Things I confirmed are fine
- 53 pages, all with unique titles, descriptions and canonicals (canonicals match their routes). One H1 per page. Every `<img>` has `alt`. `lang` and viewport set everywhere. No missing local images or scripts. All internal links resolve. JSON-LD present is valid.
- `sitemap.xml` has 53 URLs, matches the 53 local pages. `robots.txt` is fine.
- Header/footer markup is the same across pages. Phone (`tel:6502688102`) is consistent on all pages.
- (My first scan flagged noindex, missing descriptions and iframes; I checked by hand. All were false alarms: noindex was blog text, descriptions use a different attribute order, iframes are the GTM noscript.)

## 1. Plan item you asked for: remove zip / postal codes from addresses (P0)
Both postal codes will be removed everywhere. Addresses become "116 Mulberry Lane, Bellaire, TX" and "9 Highfield Ave, Orpington" (UK keeps the town only).
- **Footer address block on all 53 pages** (the ZIP and `Orpington`; 55 UK occurrences in total).
- **contact/index.html**: footer plus the contact-details block (~line 694), plus the **JSON-LD** `the US postalCode` and `the UK postalCode` (lines ~116, ~123). Remove both `postalCode` keys. Note: for Local Business rich results Google prefers a postal code, so this slightly weakens the structured data. Say if you want to keep it in the schema only.
- **about/index.html** has 4 occurrences (two footer copies of the block).
- Also search `outputs/`, `live-site-verification.md` and the Astro source at `D:\AI\inoconnect-site` (not in this folder) so the codes don't return on rebuild. Re-check the sitemap/privacy/terms pages too (privacy mentions the address).
- Verify after: `grep -r "<postal tokens>\|<postal tokens>"` returns nothing.

## 2. Critical issues (P0)

| # | Issue | Evidence | Fix |
|---|---|---|---|
| 1 | **Mobile horizontal overflow** on blog posts | `grid grid-cols-3 gap-4` with no breakpoint, 25 blog posts + ai-automation, ai-development, ltv-calculator. Headless CMS measured 397px at 390px viewport; you measured 410 and Podcast 392 | `grid-cols-1 sm:grid-cols-3` (or `grid-cols-3` with smaller text/gap on mobile) on all 28 pages |
| 2 | **Contact form does nothing** | `onsubmit="event.preventDefault(); alert('Audit request received…4 business hours')"`. No `name` attributes, 7 inputs, 7 labels, 0 linked (`for`/`id`), select has no label link, no action/endpoint | Wire to a real endpoint (Formspree, Apps Script, your API), add `name`, `id`/`for`, success/error states, honeypot. Until then, remove the false "received" message: it tells visitors something that did not happen |
| 3 | **Homepage weight** | Homepage references ~48 MB of images plus a 19 MB video (`preload=metadata`, `controls`). Biggest: two Unsplash JPEGs of 6.2 and 6.0 MB, 3.4, 3.1, 2.6 MB; two 1.7 MB PNG heroes. Site total 158 MB, of which **75 of 102 media files (102 MB) are unreferenced** | Resize to display size (≤1600px), convert to WebP/AVIF, compress the video (H.264/AV1, ≤3 MB or lazy-load on click), delete unused files from the deploy |
| 4 | **Tailwind via CDN (`cdn.tailwindcss.com`) on all 53 pages** | Runtime compiler: ~300 KB JS, render-blocking, flash of unstyled content, not for production; CSP and caching risk | Build Tailwind to a static CSS file (your Astro source already exists) |
| 5 | **Unsubstantiated claims** | About: "98.4% Annual Client Retention", "$420M+ Attributed Pipeline", "4.2x Average Blended ROAS", "EST. 2021 • GLOBAL". Contact: "4-Hour Response Guarantee" with a **free teardown if missed**, "SOC 2 Type II", "HIPAA BAA", "bank-grade encryption", "Dedicated team max 4 client ratio". Home: "Exclusivity… cap client engagements". 7 "Market Leader" mentions | Needs your proof, or remove/soften. SOC 2 and HIPAA claims are legal/regulatory exposure if untrue. The 4-hour guarantee also has no working form behind it (see #2) |
| 6 | **Dead links** | 206 `href="#"` anchors (6 per blog post: Twitter/LinkedIn share and footer social). About has 2 | Real share URLs (`twitter.com/intent/tweet?url=…`, LinkedIn `sharing/share-offsite`) and real profile URLs, or remove |
| 7 | **Deployment mismatch (from your live check)** | Live sitemap 255 URLs (204 under an old path); live titles/H1s differ from local; live Headless CMS and Podcast still show the Accessibility H1 | Deploy this 53-page set, 301 the old paths, submit the new sitemap |
| 8 | **No security headers (live homepage)** | Only `upgrade-insecure-requests` in CSP; no HSTS, `X-Content-Type-Options`, Referrer-Policy, Permissions-Policy, frame protection | Set at the host/CDN. One route checked, verify others |

## 3. High priority (P1)

**Content accuracy**
- **All 25 blog posts are dated 10 April 2024** (`datetime="2024-04-10"`). No author names found. Identical dates look auto-generated and stale. Give real dates and authors, add `dateModified`.
- **51 of 53 pages have no JSON-LD** (only home and contact do). Add `Organization` sitewide, `BlogPosting` + `BreadcrumbList` for posts, `Service` for services.
- `/blog/*` meta titles: 14 posts over 60 characters (truncated in Google). Descriptions: check lengths; many fall outside 70-160.
- **Heading order:** my script found a skipped heading level (e.g. h2 to h4) on every page. I did not check where; likely the shared menu/footer. Fix for screen readers.
- Phone is a US 650 (California) number while addresses are Texas and UK. Confirm it's the right number to show; add an international format for UK visitors.
- Legal pages "Last updated: January 15, 2026" but the privacy page is only ~5,000 characters. **Does not mention** Google Analytics/GTM (two IDs: `G-4P94TTME1B`, `GTM-WQWXHJ3M`, both loaded, check double counting), form data, or the lead tool script. Terms say Delaware law while the company has Texas and UK addresses. Needs a legal review.
- `assets/tool-leads.js` posts name/email/company plus calculator inputs to a Google Apps Script URL, but **no tool page includes it**. Either wire it (and disclose it in the privacy policy, with consent) or delete it. The exposed script URL is public.
- No cookie/consent banner despite GA/GTM and UK visitors (UK GDPR/PECR). Check Consent Mode.
- Tools: **I did not test the calculators or validate their formulas** (your earlier report confirmed the controls update outputs). Someone should check ROAS, LTV, CRO and email maths against your intended assumptions.

**Accessibility**
- 50 icon-only buttons (`<button><svg>`) have no `aria-label`.
- **Colour contrast fails:** green `#44D7A8` on white 1.82:1, orange `#FF7518` on white 2.69:1, white text on orange 2.69:1 and on green 1.82:1 (need 4.5:1 for text, 3:1 for large). `slate-400` on white 2.56:1. `slate-500` on slate-900 3.75:1. Blue `#4169E1` on dark slate 3.68:1. 45 uses of the accent colours as text on the homepage alone.
- 18 uses of `text-[10px]` and 15 of `text-[11px]`, plus 32 `text-xs`: too small on mobile.
- Touch targets: on the 390px sweep, an average of ~17 links/buttons per page are under 32px tall (43 of 53 pages have more than 10).
- Video has `controls` but no captions/track and no `muted`/`autoplay` policy.

**UI / UX / colour consistency**
- Brand palette is consistent in principle (3 core colours = ~2,500 uses: blue `#4169E1`, green `#44D7A8`, orange `#FF7518`), but there are strays: `#6e6e73`, `#696969`, `#33b88e`, `#ea580c`, `#d97706`, `#0284c7`, `#7c3aed`, `#db2777`, LinkedIn blues, `#4285f4`. Define tokens and ban the rest.
- **Hard-coded hex values everywhere** (`text-[#4169E1]`, `bg-[#44D7A8]`…) instead of the `primary`/`accent` config. Makes theming and fixes slow.
- About page has CSS hack comment "Absolute Guarantee of High-Contrast White Text on Dark Sections", a sign of text-colour overrides fighting each other. Fix at source.
- Footer text on dark uses `text-slate-300/400`, fine, but icon colours in the contact block use three different colours for three identical icon types (blue phone, orange pin, green pin): looks arbitrary.
- Duplicate header: every page contains both a desktop and a full mobile menu list (Services/Industries repeated). Fine but heavy: ~100 KB HTML per page (home 104 KB, text ~1,500 words).

**Performance (beyond images)**
- 93 of 228 `<img>` lack `loading="lazy"`; **all 228 lack `width`/`height`** (layout shift/CLS). No `fetchpriority` on the LCP image. No `preload` of fonts. Google Fonts is loaded from the CDN.
- Third-party: Tailwind CDN, GTM, gtag, Google Fonts. GA is loaded twice (gtag + GTM). Pick one.
- `reveal-on-scroll` hides content until JS runs: invisible if JS fails or slow, and bad for print/screenshots. Add a no-JS fallback.

## 4. Lower priority (P2)
- 75 unreferenced media files and `__pycache__`, `.manus/`, `build_hero_video.py`, `insert_hero_video.py`, prompt books and audit `.md` files sit in the web root: **do not deploy these** (some are publicly fetchable if the root is uploaded as-is).
- `/blog/` has 25 posts and the nav has no search, categories or pagination: fine for now.
- Sitemap has no `lastmod`.
- Add 404 page, `/favicon.ico` fallback, apple-touch icon, web manifest.
- `Ino Connect` (logo text) vs `InoConnect` elsewhere: pick one spelling.
- Copyright says "InoConnect Digital LLC": confirm the registered legal name and state.
- Add `rel="noopener"` if external social links are added.

## 5. Suggested fix order
1. Remove zip/postal codes (section 1), run grep to verify.
2. Mobile grid fix on 28 pages and re-run 390px sweep.
3. Contact form: real endpoint, labels, `name`s, honest message.
4. Images/video compression, delete unused files, add dimensions and lazy loading.
5. Replace Tailwind CDN with a built stylesheet.
6. Replace `href="#"`, add schema, real dates/authors.
7. Substantiate or remove claims (SOC 2, HIPAA, $420M, 98.4%, guarantee).
8. Contrast and font-size pass. Privacy/terms/consent update. Deploy the right build, set headers.

## 6. Questions for you
1. Postal codes: remove from the JSON-LD too, or only from visible text?
2. Can you supply evidence for the retention, pipeline, ROAS, SOC 2 and HIPAA claims? If not, remove them.
3. Where should the contact form send submissions (email, CRM, Google Sheet)?
4. Do you want me to apply these fixes now, starting with sections 1 and 2?
5. Is `D:\AI\inoconnect-site` (Astro) the source of truth, or this static folder?
