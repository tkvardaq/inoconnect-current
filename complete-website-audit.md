# Live InoConnect site verification and content review

**Checked:** 3 November 2026 (Asia/Karachi). **Scope:** public live domain `https://inoconnect.com/`, local static export in `D:\ino website`, source project in `D:\AI\inoconnect-site`, and the supplied Search Console exports. This report distinguishes observations from interpretation. A web audit cannot guarantee Google rankings or independently verify private client, staffing, credential, and performance claims without owner evidence.

## Critical scope correction

The live domain matches the older 51-page static export, not the newer 68-page Astro source build. I verified live HTTP 200 responses for `/`, `/about/`, `/contact/`, `/blog/`, `/robots.txt`, and `/sitemap.xml`. Live `/sitemap-index.xml` returns 404. The root page source length (128,028 bytes) matches the local export. Search Console is therefore reporting the old deployed site, not the current Astro `dist` build. Do not deploy or submit the newer sitemap until deciding which build is the launch source and doing a route migration/reconciliation.

## Verified live findings

### Search indexing / sitemap

- Live `robots.txt` is 200 and matches the local file: `User-agent: *`, `Allow: /`, sitemap set to `https://inoconnect.com/sitemap.xml`.
- Live `/sitemap.xml` is 200 XML with 255 URLs. It uses no trailing slash on most URLs, while the rendered site exposes slash URLs in links/canonicals. Both forms appear in Search Console Pages export for multiple routes. This mismatch is real; whether the server consistently redirects every non-slash URL and which canonical Google selects requires response-level checks for all 255 URLs. Spot checks of sitemap URLs `/`, `/about`, `/blog`, `/blog/accessibility-growth-lever`, `/blog/authority-assets-strategy` returned 200.
- Live `/sitemap-index.xml` is 404. The current source launch guide asks for this route, but it does not match the live deployed website. A sitemap may be submitted through either sitemap URL or index; use the one actually served by the deployed build.
- Search Console's provided 94 404s cannot be mapped to exact routes because the export omitted affected URL examples. Do not assign redirects based on the count alone.

### Public claims needing owner evidence before they are trusted

The live homepage currently displays:

- “The #1 Growth-Focused Digital Marketing Agency,” “Market Leader” labels, “predictable revenue,” and “0% fluff. 100% math.”
- Brand/client marquee names including SAP Leader, FHS Payments, Parcely Express, IndoAmerican News, Artiqube, Cupcura.
- Three named testimonials attributed to Sarah Jenkins / TechFlow, Michael Ross / GlobalStart, and Dr. James Chen / HealthPlus, including a specific 200% qualified-lead claim.
- Google Partner, Meta Certified, HubSpot Partner, Shopify Expert badges.
- Professional assertions about a team of specialists and “certified specialists.”

These claims are present on the live site; this audit cannot verify that the people, companies, relationships, certifications, or outcomes are real and authorized. Obtain the underlying permission, credential, and case-study evidence. If any are placeholders, remove them promptly: fabricated testimonials/certifications are a trust and consumer-protection risk. Do not substitute new figures without evidence.

### Homepage content / positioning

The homepage makes strong, repeated claims (“engineer predictable revenue,” “market dominance,” “autonomously,” “statistical significance,” and algorithmic/scientific framing) without visible methodology, named practitioners, case studies, or citations in the page content. Replace unverifiable certainty with specific deliverables, constraints, process, and measurable examples supported by evidence. “The #1” requires a defined category, market, source, and date or should be removed.

The public blog hub has 24 article cards and includes explicitly year-bound/promotional claims such as “in 2025,” “Google SGE,” “steal rich snippets,” and “increase CTR by 30%.” As of this review in November 2026, these need revision or removal. SGE is outdated product terminology; use current product names only where relevant. The 30% and 40% outcome claims need direct study attribution and context or should be removed.

## Article accuracy and usefulness review

This is a targeted factual and editorial review of all 24 live articles using the live hub/card copy and corresponding checked local content where available. Search Console data shows most article pages receive very few impressions/clicks; it does not by itself prove content quality or causation. The content should be reviewed by named, qualified practitioners and linked to primary references. No article should claim to be “current” merely because its date is recent.

| Live article | Main review finding / required action |
|---|---|
| Professional Services Authority | Generic claims; substantiate with concrete positioning, expert examples, and evidence. Avoid implying a formula guarantees premium fees. |
| Healthcare Patient Acquisition | High-stakes privacy/compliance implications. Replace vague “HIPAA compliance” marketing with accurate scope and legal review; separate marketing advice from legal advice. Cite official HHS/FTC and platform policies. |
| D2C Ecommerce Funnels | Hub claims “losing 70% of sales at checkout”; define source, market, and abandonment method or remove. Include device, payment, shipping, and measurement caveats. |
| B2B Enterprise ABM | Avoid promising predictable pipeline. Add buying-committee measurement, account selection, sales alignment, and pipeline attribution limits. |
| SaaS Churn Reduction | Hub promises “reduce churn by 20%”; evidence and cohort context required. Clarify logo vs revenue churn, gross vs net retention, and measurement window. |
| Accessibility (A11Y) | Local source states ADA lawsuit growth, settlement amounts, disability market-size figures and a simplistic Googlebot/screen-reader equivalence without citations. Remove unsupported legal/financial assertions; explain accessibility as a user and compliance concern, not a guaranteed growth lever. Reference WCAG 2.2 and test with users/assistive tech. |
| Pricing Page Psychology | Avoid universal claims about decoy/anchoring effects. Provide test design, ethical disclosure, and segment/context caveats. |
| Design Systems at Scale | Useful topic but generic. Add actual governance, tokens, adoption, contribution, and maintenance examples rather than unsupported “faster” claims. |
| Core Web Vitals | Hub calls them ranking signals and correlates directly to conversion. Explain current metrics LCP, INP, CLS and their thresholds; distinguish field from lab data and avoid implying CWV alone causes rankings/revenue. Cite official Google docs. |
| Headless CMS ROI | Hub says enterprise brands are moving away from monolithic CMS and names vendors, implying a trend without evidence. Include decision criteria, migration cost, preview/editorial workflow, SEO rendering, caching, and when headless is not a fit. |
| LinkedIn Thought Leadership | Generic platform advice. Add current platform-specific format/policy evidence and a credible practitioner workflow; avoid guaranteed inbound outcomes. |
| Podcast Networking | “Best sales tool…even if nobody listens” is hyperbolic and self-contradictory. Define measurable goals and include production/distribution costs and alternative formats. |
| Video Marketing Hybrid | Avoid unsupported “TikTok attention spans” generalization. Align format and distribution to audience behavior, accessibility/captions, retention metrics, and platform specs with current references. |
| Zero-Click Content | Hub mentions Google SGE; update terminology and claims. Explain zero-click measurement and tradeoffs using current Search Console limitations and actual examples, not fear framing. |
| Authority Assets | Hub says “500-word blog posts are dead”; unsupported blanket assertion. Recommend satisfying intent and unique value rather than word-count folklore. |
| Pinterest Ads | Hub claims 40% higher cart value without a source and treats audience purchase intent as universal. Remove or properly cite/sample-limit; identify which advertisers/products benefit. |
| Retargeting Omnipresence | “Everywhere” strategy needs consent, frequency caps, exclusion windows, platform limitations, and privacy safeguards. Avoid normalizing invasive tracking. |
| Meta Ads Scaling | Hub labels “in 2025” and presents Advantage+ vs manual control. Refresh platform product names/settings and ensure advice reflects current account controls and campaign objectives. |
| LinkedIn ABM targeting | Explain audience scale, match rates, data quality, privacy, creative fatigue, and test design. Do not promise precision beyond platform targeting capabilities. |
| Google Ads Quality Score | Hub says Quality Score “determines your ad cost” and promises CPC reduction by 40% / 10/10 score. This is materially misleading: Google states Quality Score is a diagnostic metric, not an auction input or KPI. Correct urgently; separate real-time ad quality/auction factors from the 1–10 diagnostic. |
| Schema Markup | Hub says FAQ/schema can “steal rich snippets” and boost CTR by 30%. FAQ rich results were retired in Google Search in May 2026; generic schema does not guarantee rich results. Rewrite around valid supported types, eligibility, accuracy, and no ranking guarantee. |
| Link Velocity | Hub claims building links too fast can penalize and too slow prevents progress. “Link velocity” is not a safe standalone optimization target; replace with policy-compliant editorial link earning and warn against link schemes. |
| Local SEO | Hub’s “Winning the Map Pack in 2025” is stale. Refresh for 2026, cite current Google Business Profile guidance, explain eligibility/proximity/prominence/relevance and avoid guaranteed ranking language. |
| Programmatic SEO | “Scaling to 100k pages” risks promoting scale as an objective. Emphasize unique utility, data quality, index controls, maintenance, and scaled-content abuse policy. Include a page quality gate and examples where not to use it. |
| Technical SEO Audit | Hub “200-point” title is not evidence of completeness; article title claims enterprise relevance. Publish a usable, prioritized checklist with current platform/crawl/index evidence, not a large checklist as a sales hook. |

### Additional quality signals

The local source contains 31 Markdown posts, but live blog has 24 cards and the local export has 24 article directories. The latest source posts are dated October 2026, while much of the older corpus uses January 29, 2026. This confirms build/version drift and that the live content is behind the source. Many source posts lack external citation URLs and internal links in Markdown. A content date is not evidence of an update. Retain/merge/remove pages only after URL-level performance and link review.

## Imagery and visual direction

The live homepage uses a stock Unsplash hero/team image plus numerous generic business/analytics stock images; the page source contains 13 Unsplash URLs. The usefulness and accuracy of every image alt string have not been independently assessed; stock visuals do not prove the named team, client work, or results. The page’s image-heavy storytelling is visually generic and inconsistent with claims of an identifiable expert agency.

Improve distinctiveness without redesigning the UI:

1. Use a mix of genuine, permissioned photos of actual team/work and custom explanatory diagrams, as requested. Do not imply an office/team that does not exist.
2. Replace generic business imagery in service/article heroes with a mix of genuine brand photography and custom diagrams, annotated screenshots, process maps, experiments, and data visualizations that directly teach the topic.
3. Create a consistent photo art direction (natural light, real environments, coherent crop/color treatment) and image rules per category. Avoid unrelated laptop/dashboard stock.
4. Add captions/source notes to charts; use alt text that conveys an image’s useful information and empty alt for decorative images. Avoid keyword-stuffed alt text.
5. Optimize responsive dimensions/formats and verify all image URLs, dimensions, compression, and layout stability on mobile. Keep text claims readable without depending on image text.

## Live technical and content verification results

- Live HTTP status 200 verified for homepage, About, Contact, Blog, robots.txt, sitemap.xml; sitemap-index.xml is 404.
- Live homepage title: `InoConnect | Marketing Agency for Growth`; description: `InoConnect | Premium Digital Growth Partners`; canonical: `https://inoconnect.com/`.
- Live About title: `About InoConnect | The Anti-Agency Manifesto`; canonical: `/about/`.
- Live blog hub title is `Insights & Intelligence | InoConnect` and the card copy contains dated claims noted above.
- Local source project `npm run check` passed 73 tests, built 68 pages, and its script reported no broken internal links, missing canonicals, or duplicate descriptions. Build emitted a warning that `src/icons` is missing. This result applies to the source build only; it does not validate the live deployment or current claims.
- Search Console export (last three months) reports 179 daily-chart clicks and 1,816 impressions. Queries show 149 of 179 clicks (83.2%) from three brand-name variants. Country table reports Malaysia 164 clicks / 1,017 impressions; US 2 / 305, UK 0 / 54. The owner confirmed US and UK are target markets; Malaysia currently dominates the reported traffic, so investigate query intent, language, referrals, location signals, and lead quality.

## Recommendations by priority

**P0 — trust / accuracy:** remove testimonial, client-logo, partner-badge, and quantified-performance proof sections for now. Remove unsupported #1/market-leader claims; reintroduce proof only after evidence and permission are documented. Correct Google Ads Quality Score, schema/FAQ rich-result, stale SGE, and unsupported market/legal statistics.

**P1 — indexing / deployment:** reconcile live 51-page site, newer 68-page source build, sitemap routes, and Search Console 404s. Obtain the exact 94 404 URLs and 119/21 excluded URL samples before deciding individual redirects or content changes. Use URL Inspection and server status checks.

**P1 — market fit:** Target the US and UK, and compare query/page/country data; review why Malaysia currently dominates impressions and clicks. Homepage positioning and local trust signals should match the actual audience and operating footprint.

**P2 — editorial:** review the 24 live articles against query intent; add named expert authors/reviewers, official primary references, specific examples, limitations, update notes tied to substantial edits, and contextual internal links. Reduce generic promotional copy.

**P2 — visual credibility:** replace generic/stock depictions with authentic brand-owned imagery and useful explanatory graphics while retaining existing page structure.

## What cannot be made 100% certain from current access

The audit cannot determine the truth of business credentials/testimonials without owner documentation, the cause of every GSC exclusion without affected URL examples and URL Inspection, actual visual contrast/focus behavior from static source alone, or guaranteed ranking outcomes. The report makes no such claims. The Search Console performance export is aggregate/limited; the Pages table totals differ from daily chart totals, so use daily chart for site-level totals and table exports only for listed-row comparisons.


---

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
| Homepage testimonials/client logos/badges are false | **Their presence is verified**, truth is not. The screenshot/page includes names and partner marks; no authorization or credential evidence was provided. Stock-like photos do not prove whether testimonials are authentic. | P0: Remove testimonials, customer logos, partner badges, and performance figures for now, as requested. Reintroduce only after documentary verification and permissions. Do not label them “fabricated” absent proof. |
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
- Three brand spellings total 149/179 clicks (83.2%). Malaysia reports 164 clicks/1,017 impressions; US 2/305; UK 0/54. This conflicts with the stated target market (US and UK) and should be treated as a market-fit priority, not evidence of invalid traffic.
- Current live copy includes “#1” and revenue-growth certainty, logos, named testimonials and platform badges. Those are observed claims, not independently validated credentials or customer relationships.
- The Blog hub promotes claims including “in 2025,” “Google SGE,” “Quality Score … determines your ad cost,” “increase CTR by 30%,” “40% higher cart value,” “20% lower churn,” and “70%” checkout loss. These need updating, direct sourcing or removal.

## Updated action plan

### P0 — establish what is true and fix high-impact defects

1. **Evidence register:** for every numerical outcome, client logo, testimonial, award, partner badge, office, staff credential, and “#1/market leader” claim, record the owner, primary evidence, date range, denominator/method, permission, and expiry/review date. Remove testimonial, client-logo, partner-badge, and performance-proof sections for now, as requested. Remove unsupported factual claims while retaining basic service/process descriptions that are accurate. Do not assume a claim is false solely because evidence is absent from the page.
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
12. Use a mix of genuine, permissioned team/work photography and custom explanatory diagrams or annotated tool outputs. Keep layout and colors. Remove proof-section imagery along with the proof content for now; do not use stock portraits to imply actual team members or client results.
13. Measure live mobile and desktop Core Web Vitals and image transfer sizes before making image-performance claims or selecting optimizations.
14. Build ongoing reporting around non-brand qualified leads by target country, landing page and query group; compare matching date ranges and annotate releases. Avoid ranking guarantees.

## Primary evidence and references

- InoConnect live site: [Homepage](https://inoconnect.com/), [Blog](https://inoconnect.com/blog/), [Sitemap](https://inoconnect.com/sitemap.xml), [robots.txt](https://inoconnect.com/robots.txt).
- Google Search Central: [Helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [spam policies](https://developers.google.com/search/docs/essentials/spam-policies), [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features), [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals), [structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).
- Google Ads Help: [Quality Score for Search campaigns](https://support.google.com/google-ads/answer/6167118).
- Google Search Central update: FAQ rich result feature removal (May 2026), in [Search documentation updates](https://developers.google.com/search/updates).

## Confidence boundary

I am confident in the file counts, article H1 mismatch, sitemap URL count/prefix count, sampled live HTTP statuses, Search Console export totals/categories, brand-click calculation, and the public presence of claims described above. I have not confirmed every sitemap route status, every page’s live metadata/schema, actual form network submission, production security headers, exact image transfer totals, or the truth/authorization behind company claims. The plan explicitly calls those out for verification; it does not convert them into facts.


---


# Detailed execution plan and page coverage

## 1. Release gate: confirm facts and scope

Before implementing changes, prepare a signed-off claim register. Fields: exact claim, URL and component, evidence owner, primary evidence/document, definition and calculation, date window, client/brand permission, approved wording, review date. Include company legal name, public business address and phone, service countries, actual team/certifications, partner status, client relationships, quotes, case results, and the SAP Leader relationship/contact overlap. Remove unsupported number displays (including `$120M+` and similar figures) as requested. If a public street address is not a real staffed/eligible location, do not publish it as an office or LocalBusiness address.

User preferences confirmed: primary market is US and UK; remove proof sections for now; imagery should mix authentic photography and custom diagrams. Choose one codebase/build to own production. Current production is the older static export; alternate Astro source is not what users currently see. Make a route matrix with columns: old live URL, new source URL, status in each, intended action (keep, update, merge, redirect, retire), canonical, redirect destination, and owner. Do not simply replace production with the larger page set: the source has seven more articles and twelve tools versus four in the old export, so each new/changed URL needs purpose and route treatment.

## 2. P0 technical fixes and verification

### Article H1 defect

All 24 article detail pages in the supplied deployment snapshot render the same Accessibility H1; the site root was byte-identical to the snapshot and the live blog was confirmed to expose the same older site version. Use one article content record as the source for H1, document title, description, OG/Twitter title, breadcrumb, schema headline, hero image/alt, category, publication date and index card. Add a build check that fails if the H1 is missing, duplicated, or mismatched against the article title. Check all live routes after publishing using a crawl, not just the source template.

### Sitemap and duplicate URL cleanup

The local/live sitemap has 255 URLs, 204 under old deployment-directory prefixes. Generate a clean sitemap from the selected release’s canonical route inventory. Include only 200, indexable, canonical URLs; no query parameters, staging/archive paths, redirects or 404s. Inspect every sitemap URL status and canonical target. Normalize slash policy so sitemap, canonical, internal links and redirects agree. Obtain Search Console examples for 94 404s, 22 redirects, and one duplicate canonical issue. For each: identify inbound links/traffic, restore if valuable, 301 only to a close replacement, otherwise 410/404 intentionally, and remove internal references. Then submit the correct served sitemap and request validation on the relevant GSC issue groups.

### Indexing issue groups

For 119 discovered-not-indexed URLs: check if they are meant to be indexed, discoverable via useful internal links, unique and valuable, correct canonical, and present in the clean sitemap. For 21 crawled-not-indexed URLs: inspect rendered main content, near-duplicates, soft-404 cues, canonical selection and user value. No mass index requests before those checks. Track indexation by URL class and business priority rather than trying to force every URL into the index.

### Release QA checklist

Run automated checks on generated output and then live smoke checks:
- every intended URL returns final 200 (or expected 3xx/410) with one hop maximum for normal redirects;
- one relevant H1, unique title/description, canonical and OG image per indexable page;
- correct robots directives and sitemap; no archive/staging routes exposed;
- JSON-LD parses and matches visible content, real identity and supported Google feature documentation;
- all internal images load; external links return expected destinations;
- forms have labels, required/error announcements, privacy notice, safe POST/backend processing and tested success/failure behavior;
- mobile/desktop visual, keyboard navigation, reduced motion, zoom and contrast spot checks;
- live response headers, third-party script inventory and consent behavior.

## 3. P1 content program: article-by-article fixes

The live article set below is the 24 detail routes. These are edits to the existing content footprint; the overall UI can remain.

| Article route | Editorial repair |
|---|---|
| `/blog/accessibility-growth-lever/` | Verify/remove legal litigation, settlement, disability spending, and percentage claims; correct oversimplified “Googlebot = screen reader”; update from WCAG 2.1 to WCAG 2.2; source primary accessibility guidance and avoid legal guarantees. |
| `/blog/authority-assets-strategy/` | Remove blanket “500-word posts are dead”; focus on intent, originality, evidence and reusable assets. Provide a real example and measurement framework. |
| `/blog/b2b-enterprise-abm/` | Include account selection, buying group, sales alignment, attribution and pipeline time lag; substantiate claims with approved case evidence. |
| `/blog/core-web-vitals-revenue/` | Use current LCP/INP/CLS thresholds; explain field vs lab and no guaranteed ranking/revenue impact; cite Google documentation and measured examples. |
| `/blog/d2c-ecommerce-funnels/` | Source or remove “70% checkout loss”; distinguish checkout abandonment from cart abandonment and show measurement, shipping/payment, device and returning-customer context. |
| `/blog/design-systems-scale/` | Add practical adoption, token ownership, governance, migration cost, and measurable maintenance outcomes; avoid unmeasured “faster” claims. |
| `/blog/google-ads-quality-score/` | Correct urgently: displayed Quality Score is diagnostic, not an auction input/KPI. Explain relevant auction factors and realistic landing-page/ad improvements without 40% CPC or 10/10 promises. |
| `/blog/headless-cms-roi/` | Replace categorical enterprise trend claims with decision matrix (editorial workflow, preview, performance, security, hosting, structured content, migration costs); clarify headless is not automatically better for SEO. |
| `/blog/healthcare-patient-acquisition/` | Require healthcare/privacy practitioner and legal review; cite official HHS/FTC/platform guidance; avoid blanket HIPAA claims and sensitive-data tracking recommendations. |
| `/blog/link-velocity-strategy/` | Remove “too fast causes penalty / too slow harms ranking” rule unless substantiated; teach policy-compliant editorial link earning and disavow only within current guidance. |
| `/blog/linkedin-abm-targeting/` | Verify current platform targeting and matched-audience constraints; include list data quality, privacy, audience size, fatigue and incrementality. |
| `/blog/linkedin-thought-leadership/` | Add real practitioner authorship, original examples and a distribution/measurement workflow; no guaranteed lead claims. |
| `/blog/local-seo-domination/` | Remove stale 2025 label; verify current GBP eligibility and guidance, relevance/distance/prominence; align with actual locations and avoid location claims without eligible premises. |
| `/blog/meta-ads-scaling/` | Remove 2025 framing; verify current official product names/features, attribution, signal limitations, creative testing and account applicability. |
| `/blog/pinterest-ads-strategy/` | Source or remove the 40% cart-value claim; define cohort, geography, period, comparison and product categories; add who should not use Pinterest. |
| `/blog/podcast-networking-strategy/` | Replace “best sales tool even if nobody listens”; compare cost and goals, distribution, audience, attribution and repurposing. |
| `/blog/pricing-page-psychology/` | Treat anchoring/decoy as testable hypotheses, not universal effects; include ethical presentation, segments, sample sizes and guardrails. |
| `/blog/professional-services-authority/` | Add expertise-specific examples, regulated-profession limits and trust signals; no universal premium-fee promise. |
| `/blog/programmatic-seo-saas/` | Remove page-count as goal; set per-page utility, accurate data, index quality gates, maintenance and examples of when programmatic SEO is a poor fit. Cite scaled-content policy. |
| `/blog/retargeting-omnipresence/` | Replace “everywhere” framing with consent, frequency caps, suppression/exclusions, window controls, platform restrictions and incremental lift measurement. |
| `/blog/saas-churn-reduction/` | Source/remove 20% reduction; define logo vs revenue churn, gross/net retention, cohort and timeframe; show leading indicators and experiment caveats. |
| `/blog/schema-markup-guide/` | Remove “not optional,” CTR guarantee and FAQ rich-results claims. Explain supported use cases, eligibility, visible-content consistency and no guaranteed display/ranking. |
| `/blog/technical-seo-audit/` | Publish a practical, prioritized checklist with method and tooling; substantiate “200-point” or remove; separate Google requirements from optional best practices. |
| `/blog/video-marketing-hybrid/` | Remove generalized attention-span statements; include platform specs only after checking current docs, accessibility/captions, distribution cost and retention measures. |
| `/blog/zero-click-content/` | Replace obsolete SGE term with current Search features where relevant; explain Search Console measurement and tradeoffs; avoid assuming every AI feature only steals clicks. |

For each article, use a consistent editorial workflow: brief with target audience and query; author with relevant experience; primary-source research; first-hand example/data; review for factual/legal risk; copyedit; link to closely relevant guides/services; update date only when content materially changes; note what changed; measure qualified outcomes. Google does not prescribe a preferred word count, and publishing cadence is not the goal.

## 4. Core-page and template fixes

| Page group | Fix |
|---|---|
| Home | Keep overall design; remove or substantiate #1, “100% math,” predictable/market-dominance claims, customer logos, testimonials and partner badges. Use one H1. Explain target customer, services, process, genuine differentiators and evidence. Replace repeated stock imagery with authentic/educational visuals. |
| About | Rewrite with verified story, actual team/roles, geographic footprint, methods and real proof. Remove unsupported numbers such as `$120M+`, `500+`, “top 1%,” 95%/30–40% claims unless evidenced. Add named responsible authors only with consent. |
| Contact | Confirm public contact details and address. Ensure accessible labels and focus states; submit by secure POST, validate server-side, protect from spam, show true success/failure, disclose collection and follow-up use. |
| Services hub / six service pages | Explain scope, deliverables, who does the work, inputs, timelines as ranges with caveats, dependencies and outcome measurement. Remove guarantees and identical boilerplate. Keep separate service intent and internal pathways. |
| Industries hub / seven industry pages | Keep only sectors where there is demonstrable capability. Add specific constraints and proof for each vertical, especially healthcare. Do not imply a local office or compliance expertise without verification. |
| Tools hub and four live calculators | Label outputs as estimates with assumptions and definitions; test formulas and client-side validation; disclose if results/email are sent; do not use the tool as a pretext for unverifiable $10M outcome claims. Alternate source has eight extra tools beyond live—publish only after QA. |
| Privacy and Terms | Align to real entity, contact, analytics/consent, form processing, processors, retention, cross-border transfers and governing law. Current source/live versions differ; qualified legal review recommended. |
| Blog hub | Match each card title/category/description with article page; remove old years, obsolete Google terminology, unsourced numbers and unsupported social proof; no repeated filler claim like “widely referenced” without proof. |

## 5. Design and image plan (without redesign)

Keep current visual system, page structure, colors and component patterns. Improve the assets and content hierarchy inside that design:

1. Create an asset inventory per route: current image, purpose, source/license, factual implication, alt text, dimensions, file weight and replacement status.
2. Use the requested mix of genuine, permissioned team/work photography and custom explanatory diagrams. Do not imply stock models are staff or clients.
3. Use custom topic-specific diagrams alongside authentic photography for educational posts: e.g. measurement/attribution diagrams, CMS decision matrix, campaign flow, CWV waterfall, schema examples, calculator screenshots. Include source/caption for data graphics.
4. Establish consistent crop, contrast, color treatment, image ratio, and category illustration rules, while retaining existing layout.
5. Produce responsive WebP/AVIF variants and correct sizes; set intrinsic dimensions/aspect ratio; lazy-load below-fold images; prioritize only the actual LCP hero. Verify transfer bytes and CLS from live mobile tests before stating savings.
6. Write human alt text for informative images; use `alt=""` for decorative ones. Avoid using alt text to insert keywords.

## 6. SEO measurement and 90-day plan

**Before changes:** export Search Console page/query/country/device data with comparison dates; export all excluded URL examples; save current sitemap and URL crawl; record contact form completion and qualified lead baseline; identify target geography.

**Days 1–7:** sign off claim register and release source; fix article H1/template; remove or validate risky claims; fix sitemap and archive routes; validate contact identity/form privacy; correct Quality Score/schema/healthcare/accessibility errors.

**Days 8–21:** deploy in a controlled release; crawl all URLs; check canonicals, redirect chains, metadata, images, forms and responsive/accessibility behavior; submit correct sitemap; inspect high-value URLs. Record release annotation.

**Days 22–45:** update the highest-value articles and landing pages based on actual non-brand query intent and target-market evidence; improve images and internal linking; validate structured data only where applicable. Do not bulk-request indexing.

**Days 46–90:** compare matched date windows; monitor indexed/excluded URL classes, non-brand clicks, qualified organic leads, conversion rate, country/device segments, and CWV field data. Change one major page element at a time where practical. Keep a revision/evidence log.

KPIs: qualified non-brand organic leads, conversion rate from organic landing pages, Search Console non-brand impressions/clicks by target country, intended canonical URLs indexed, valid route/error rate, and mobile CWV. Average position and raw index count are diagnostics, not goals by themselves. No plan can guarantee a top Google position.

## 7. Items requiring owner or platform access

- Evidence/permission for customer relationships, testimonial quotes, badges, certifications and performance statistics.
- Correct legal company name, real operating locations, approved phone/email and intended target markets; clarify SAP Leader relationship.
- Search Console exports with URL examples for each excluded category, URL Inspection on representative pages, and actual change history.
- Hosting response headers/security configuration; form endpoint/network behavior; current analytics/GTM configuration; privacy consent requirements.
- Real team and client image rights, author biographies, and any approved case-study material.

## 8. Verified references

- Google Search Central, [Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [spam policies](https://developers.google.com/search/docs/essentials/spam-policies), [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features), [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals), and [structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).
- Google Ads Help, [About Quality Score](https://support.google.com/google-ads/answer/6167118): displayed Quality Score is diagnostic, not an auction input/KPI.
- W3C, [WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/), current W3C Recommendation.
- Google Search Central [documentation updates](https://developers.google.com/search/updates): FAQ rich result feature removal in May 2026.





