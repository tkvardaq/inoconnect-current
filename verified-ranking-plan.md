# InoConnect verified audit reconciliation and ranking plan

**Prepared:** 3 November 2026. This reconciles the two AI-generated audit reports against the live domain, supplied static snapshot, source build, and supplied Search Console exports. “Verified” below means directly observed in those materials. It does not mean independent proof of private business claims or a guarantee about Google rankings.

## Executive decision

Use the live website as the release target until the owner explicitly chooses otherwise. The live homepage is the 51-page static export (home HTML is 128,028 bytes), not the alternate 68-page Astro build. The live domain has 41 indexed URLs reported in Search Console as of 23 Oct 2026, so the other report’s claim that `site:inoconnect.com` shows zero results is not reliable and is contradicted by the Search Console data. Do not use a `site:` query as an indexation count.

Both reports correctly identify a severe article H1 defect, sitemap pollution, unsupported trust/marketing claims, old content, and release-source mismatch. Fixing the H1 and sitemap is urgent, but no evidence establishes that either alone caused weak rankings. A better plan is: (1) protect trust and legal accuracy, (2) correct live technical defects and URL inventory, (3) improve the content users actually search for, (4) replace generic imagery with real and useful assets, and (5) measure the right outcomes.

## Claims reconciled

| Claim in supplied reports | Verification | Treatment in updated plan |
|---|---|---|
| 24 of 25 article pages share the accessibility H1 | **Verified in the local live snapshot:** 25 `blog/**/index.html` files including blog index; 24 article detail files all have one H1 reading “Accessibility (A11Y): The Untapped Market”; the accessibility article is the one correct case. Live homepage/blog fetched successfully; the published site corresponds to this snapshot. | P0: fix article template and regenerate each article page. Update visible H1, title/description, breadcrumb, schema headline, social metadata, and card copy from one source record. Recheck all 24 routes after deployment. |
| The sitemap contains 204 old deployment-folder URLs | **Verified in local `sitemap.xml`:** 255 unique URLs, 204 containing `InoConnect_Hostinger_Deploy`. The 51-page local snapshot does not have these path directories. I did not independently HTTP-check all 204 URLs, so “all 204 return 404” is **not verified here**. | P0: remove archive paths from sitemap; test every URL status before deployment. Keep only canonical, intended, indexable production pages. |
| The site is not indexed; `site:` returns zero | **Contradicted by GSC export:** 41 indexed URLs and nonzero performance clicks/impressions. Search Console is more useful than a `site:` search for this question. | Do not repeat. Work on the 257 reported not-indexed URLs using URL-level evidence; the 41 indexed count is not a quality score. |
| 38 pages lack canonicals | **Verified in local snapshot by prior page scan.** Alternate source build has all canonicals in its post-build check. | P1: canonicalize the chosen live build and verify final live HTML and redirects. |
| 220 images and 100% alt attribute presence; 31.8 MB homepage images; image dimensions/lazy-load figures | The **220 `<img>` count** is confirmed in the local snapshot. Alt-attribute presence was reported by another audit but not independently rescanned here. The byte totals, counts above size thresholds, width/height and loading figures were not independently reproduced. The live homepage uses 13 Unsplash URLs and generic stock-style visuals. | Treat exact byte/attribute counts as unconfirmed until measured. Run a repeatable asset audit (network transfer sizes, intrinsic dimensions, loading priority, alt usefulness) and mobile PageSpeed/CrUX assessment before setting performance fixes. |
| One JSON-LD block with fake NAP, 555 number, fake address, seven broken OG images | The precise JSON-LD values were not independently reproduced against live source in this pass. The live site has visible conflicting/unverified identity and contact claims elsewhere, and current source data differs from live. | High priority to inspect raw live JSON-LD and all rendered NAP/OG references. Publish only verified business identity, phone, address, social profiles, and images. Do not assert exact values until captured from live markup. |
| Contact GET method and unassociated labels | A separate audit reports these after browser inspection; I have not independently confirmed the submit handler or accessible names in this verification pass. | Inspect actual client JS and network behavior before claiming details are transmitted. In any case, enforce POST/server-side handling, label associations, safe validation, consent/privacy clarity, and keyboard/error behavior if needed. |
| Security headers absent / Tailwind CDN / security score | Not independently measured in this verification pass. Earlier build/source checks do not prove live security headers. | Capture live response headers and third-party scripts, inventory form endpoints and dependencies. Do not call the site insecure or secure without that evidence. |
| All 51 pages return 200 | Only representative routes were checked here, not all 51. Several sitemap URLs were spot-checked 200; `/sitemap-index.xml` was confirmed 404. | Validate all intended routes from sitemap and crawl links using a status crawler. |
| Homepage testimonials/client logos/badges are false | **Their presence is verified**, truth is not. The screenshot/page includes names and partner marks; no authorization or credential evidence was provided. Stock-like photos do not prove whether testimonials are authentic. | P0: obtain client permission, testimonial source/approval, partner directory evidence and certificate details. Remove claims that cannot be substantiated. Do not label them “fabricated” absent proof. |
| `$120M+`, `500+`, sector metrics and “#1” are unsupported | The claims appear in the live snapshot and have no adjacent methodology/evidence there. That establishes “unsupported on page,” not that they are false. | P0: keep only figures with source data, definitions, time window, denominator, client permission and accountable owner. Otherwise remove/replace with concrete non-quantified process facts. |
| Report says 25 live articles; inventory is 24 detail pages | Local snapshot has 25 blog directories only because one is `/blog/` index; it has **24 article detail pages**. The alternate source has 31 Markdown posts, 7 more than live. | Use 24 as the live detail-article count and 31 as source Markdown count until exact route diff is documented. |
| Google Ads Quality Score is an auction cost multiplier | **Incorrect claim in blog-card copy.** Google Ads Help states the displayed Quality Score is diagnostic, not an auction input or KPI. | P0 editorial correction; explain diagnostic score versus auction-time signals and avoid guaranteed CPC cuts. |
| FAQ/schema promises rich results; FAQ ended May 2026 | FAQ rich results were retired in May 2026 per current Search Central updates. Generic structured data does not guarantee rich results or rankings. | P1: remove FAQ rich-result promises and “CTR lift” claims unless directly evidenced; make schema accurate and visible-content-aligned. |
| Core Web Vitals are “new ranking signals” and direct revenue effect | Not a responsible current framing. Current metrics are LCP, INP, CLS; user-experience thresholds are measurable, while ranking/revenue causal claims need qualification. | P1: refresh article and reference real field data; no ranking or revenue guarantee. |

## Live and Search Console facts to retain

- Live `/`, `/about/`, `/contact/`, `/blog/`, `/robots.txt`, `/sitemap.xml` returned HTTP 200 in direct checks; `/sitemap-index.xml` returned 404.
- Live sitemap has 255 unique URLs; 204 use the `InoConnect_Hostinger_Deploy` prefix.
- Search Console coverage at 23 Oct: 41 indexed, 257 not indexed; categories: 94 not found, 22 redirects, 1 duplicate without selected canonical, 119 discovered not indexed, 21 crawled not indexed. The export did not include affected URL examples, and validation is “Not Started.”
- Performance daily chart, Aug 1–Oct 31: 179 clicks, 1,816 impressions, 9.86% CTR. Pages export totals differ and should not be treated as the same aggregate.
- Three brand spellings total 149/179 clicks (83.2%). Malaysia reports 164 clicks/1,017 impressions; US 2/305; UK 0/54. Whether this is good depends on intended market.
- Current live copy includes “#1” and revenue-growth certainty, logos, named testimonials and platform badges. Those are observed claims, not independently validated credentials or customer relationships.
- The Blog hub promotes claims including “in 2025,” “Google SGE,” “Quality Score … determines your ad cost,” “increase CTR by 30%,” “40% higher cart value,” “20% lower churn,” and “70%” checkout loss. These need updating, direct sourcing or removal.

## Updated action plan

### P0 — establish what is true and fix high-impact defects

1. **Evidence register:** for every numerical outcome, client logo, testimonial, award, partner badge, office, staff credential, and “#1/market leader” claim, record the owner, primary evidence, date range, denominator/method, permission, and expiry/review date. Remove any item without evidence/permission. Do not assume a claim is false solely because evidence is absent from the page.
2. **Article template:** fix all 24 live detail-article H1s. Align each page’s visible title, metadata, index card, breadcrumb and JSON-LD. Add QA asserting page title/H1/slug consistency.
3. **Sitemap and route cleanup:** remove 204 deployment-folder entries. Crawl the final set and record status, canonical, redirect chain and indexability for every URL. Then reconcile the 94 GSC 404 examples and 22 redirect examples individually. Restore valuable URLs, use one-hop 301 only to a close equivalent, or 410 intentionally removed URLs; update internal links and sitemap.
4. **Choose release source:** live old snapshot (51 pages/24 articles) versus Astro source (68 pages/31 posts). Produce a route-diff and migration map. Do not deploy new routes or swap sitemaps until redirects, canonical URLs, content, form behavior and assets are validated.
5. **Business identity/About:** confirm legal/business name, actual service geographies, public phone/email, real office status, team, founder story and SAP Leader relationship/phone sharing. Rewrite About with these verified facts and real people/process; user specifically plans to remove 120m+ style figures and improve About.
6. **High-risk editorial fixes:** Quality Score, accessibility legal/statistical assertions, schema/FAQ rich results, dated AI Search/SGE, local SEO year claims, healthcare compliance, link-velocity penalties and quantified performance promises.

### P1 — improve crawl quality and conversion trust

7. Inspect GSC URL examples and URL Inspection for all high-value exclusions; internal linking, uniqueness and soft-404/canonical issues should be fixed by cause, not by bulk indexing requests.
8. Verify live page metadata, OG assets, JSON-LD, canonicals, redirect behavior, security headers, form POST/network behavior and analytics consent. The alternate build’s passing check is not a live-site verification.
9. Fix Contact labels and keyboard usability, if confirmed by DOM/accessibility inspection; provide honest privacy information and secure server-side processing.
10. Improve snippets for relevant high-impression/low-CTR pages only after reviewing the specific query set. Prioritize Contact, Education, Services and About from GSC, but use qualified clicks/leads rather than average position alone.

### P2 — improve substance and imagery while preserving UI

11. For each retained article, provide a named author/reviewer, current primary sources, original example or tested workflow, limitations, internal links to relevant services, and meaningful update notes. Merge overlapping posts only after query/backlink mapping. Do not publish for volume or trends alone.
12. Replace generic stock visuals with permissioned real team/work imagery, bespoke diagrams, annotated tool outputs, and genuine anonymized case data. No fake dashboards or visuals that imply unverified clients. Keep layout and colors; update assets, responsive image delivery, useful alt text and captions.
13. Measure live mobile and desktop Core Web Vitals and image transfer sizes before making image-performance claims or selecting optimizations.
14. Build ongoing reporting around non-brand qualified leads by target country, landing page and query group; compare matching date ranges and annotate releases. Avoid ranking guarantees.

## Primary evidence and references

- InoConnect live site: [Homepage](https://inoconnect.com/), [Blog](https://inoconnect.com/blog/), [Sitemap](https://inoconnect.com/sitemap.xml), [robots.txt](https://inoconnect.com/robots.txt).
- Google Search Central: [Helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [spam policies](https://developers.google.com/search/docs/essentials/spam-policies), [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features), [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals), [structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).
- Google Ads Help: [Quality Score for Search campaigns](https://support.google.com/google-ads/answer/6167118).
- Google Search Central update: FAQ rich result feature removal (May 2026), in [Search documentation updates](https://developers.google.com/search/updates).

## Confidence boundary

I am confident in the file counts, article H1 mismatch, sitemap URL count/prefix count, sampled live HTTP statuses, Search Console export totals/categories, brand-click calculation, and the public presence of claims described above. I have not confirmed every sitemap route status, every page’s live metadata/schema, actual form network submission, production security headers, exact image transfer totals, or the truth/authorization behind company claims. The plan explicitly calls those out for verification; it does not convert them into facts.
