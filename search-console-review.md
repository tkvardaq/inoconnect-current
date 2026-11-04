# InoConnect Search Console export review

Reviewed on 3 November 2026 from the two supplied Google Search Console exports. This is an export analysis, not a live Search Console inspection. Performance report is Web search, last 3 months; daily chart covers 1 Aug–31 Oct 2026. Coverage chart covers 5 Aug–23 Oct 2026.

## Executive summary

The site is receiving some meaningful branded traffic, but the report shows a substantial indexing backlog relative to the indexed URL count: 41 indexed versus 257 not indexed in the coverage chart at the end of the period. The issue table classifies 94 URLs as 404, 22 as redirect, 1 as duplicate without user-selected canonical, 119 as discovered but not indexed, and 21 as crawled but not indexed. The 116 URLs in the 404/redirect categories merit immediate URL-level review; the other 140 are Google-selected discovery/indexing outcomes, not necessarily technical errors.

Search performance in the daily chart totals 179 clicks and 1,816 impressions (9.86% aggregate CTR). The Pages table sums to 185 clicks and 4,093 impressions; this does not reconcile with the chart, likely because the tables are limited to top rows and/or the export dimensions differ. Treat the chart as the aggregate total and do not add table rows to it. The very high branded-query share and Malaysia concentration mean raw average position should not be interpreted as broad commercial visibility.

## Coverage and indexing

### What the export says

| GSC classification | URLs | Interpretation / action |
|---|---:|---|
| Not found (404) | 94 | Inspect examples and source URLs. Restore pages with continuing value, or redirect to the closest equivalent where appropriate. Return 410 for intentionally retired URLs. Remove dead URLs from internal links and sitemap. |
| Page with redirect | 22 | Usually expected; ensure sitemap contains only final canonical destinations and internal links point directly to destinations. |
| Duplicate without user-selected canonical | 1 | Inspect the affected URL and canonical target. Confirm one preferred URL variant and consistent internal links/sitemap. |
| Discovered – currently not indexed | 119 | Google knows the URLs but has not crawled/indexed them. Check crawl demand, URL value, internal links, duplicate/thin pages, and sitemap accuracy. Do not request indexing in bulk before fixing quality and URL signals. |
| Crawled – currently not indexed | 21 | Google crawled but did not select these pages for indexing. Review content distinctiveness, usefulness, duplication, soft-404 signals, canonical handling, and rendering. This is not fixed by resubmitting a sitemap alone. |

The end-of-chart totals are 257 not indexed and 41 indexed. On 5 Aug there were 3 indexed and 257 not indexed; by 23 Oct the indexed count reached 41 while not-indexed remained 257. This suggests index growth without shrinking the known exclusion set. These counts are URL totals in GSC, not proof that each URL should be indexed.

### High-confidence cross-check with supplied site files

The local export at `D:\ino website` contains 51 HTML pages. Its `sitemap.xml` has 255 `<loc>` entries, but a direct normalized URL comparison did not find the exported page routes represented in those entries. The export sitemap should be inspected before deployment: it may belong to a different version or contain URLs not corresponding to its actual page set. This aligns with, but does not by itself explain, the GSC 404/redirect backlog. The current source project builds 68 pages and generates a sitemap index, so do not mix the older export and current build when diagnosing live URLs.

The Performance Pages table contains both slash and no-slash forms for several URLs (for example `/about/` and `/about`, and `/industries/education/` and `/industries/education`). That is evidence Google has observed both variants; it is not conclusive proof they are both indexed simultaneously. Ensure redirect and canonical behavior is consistent and use one form in internal links and sitemap.

## Search performance

### Aggregate and trend

- Date range: 1 Aug–31 Oct 2026 (92 daily rows), Web search.
- Daily chart: 179 clicks, 1,816 impressions, 9.86% aggregate CTR.
- August begins with almost no impressions, then grows sharply late August. Clicks and impressions are stronger through September and early October; late October is lower, but the export alone cannot establish why. Check Search Console with a matched prior-period comparison and inspect query/page/date segments before attributing this to seasonality, an update, or technical changes.
- One-day average positions swing sharply at low impression counts. Use a rolling period and segment by query/page/country/device.

### Brand dependence and query intent

Top three queries are `inoconnect` (72 clicks / 256 impressions), `ino-connect` (41 / 298), and `ino connect` (36 / 362): 149 clicks combined, about 83% of the 179 chart clicks. This is healthy evidence of existing brand demand, but it does not show that non-brand SEO is yet driving meaningful clicks. Most listed non-brand topic queries have impressions and zero clicks, including LinkedIn thought leadership, patient acquisition, ABM, and headless CMS topics.

Search Console anonymizes some rare queries and the Queries export is truncated to top queries; absence from the file does not establish zero demand. Use GSC query groups to assess branded versus non-branded click/impression/CTR changes over time.

### Pages and click opportunity

- Homepage: 167 clicks / 1,362 impressions, 12.26% CTR, average position 6.04. Nearly all chart clicks appear concentrated on this URL.
- Contact: 9 / 774, 1.16% CTR, average position 5.41. This is a potentially useful snippet/title relevance opportunity, but query-level intent should be checked before changing copy.
- Education industry page: 6 / 450, 1.33% CTR, position 4.79; consider improving title/snippet fit and ensuring the page specifically meets the search intent behind the impressions.
- Services hub: 1 / 272, 0.37% CTR, position 2.49. Position is strong in the reported data but CTR is low; inspect exact queries and SERP appearance because averages can conceal a mixed query set.
- About page: 0 clicks across 188 impressions (`/about/`) plus 109 impressions (`/about`). Review query relevance, title/snippet, and canonical/redirect consolidation. Average positions around 2–3 with no clicks are unusual enough to inspect actual queries and whether these impressions are branded/navigation or low volume.
- Several articles have impressions but no clicks, while some rank far back (e.g. healthcare patient acquisition and LinkedIn ABM/thought leadership). This supports prioritizing article accuracy, expertise, intent match, and original evidence rather than increasing publishing volume.

### Geography and device

Malaysia accounts for 164 clicks / 1,017 impressions, average position 2.56, versus the US at 2 clicks / 305 impressions and position 36.23; the UK has 54 impressions and zero clicks at position 43.2. Confirm whether Malaysia is the intended primary market. If the target is US/UK, this is a serious audience-market mismatch to investigate through query language, country targeting, backlink/referral sources, brand demand, and service-market alignment. Do not infer manipulation or bot traffic from this export alone.

Mobile: 94 clicks / 749 impressions, 12.55% CTR, position 2.94. Desktop: 73 / 994, 7.34% CTR, position 26.29. Tablet: 12 / 73, 16.44%, position 2.16. The gap between desktop and mobile positions is large; segment desktop queries/pages and verify intended geography, device-specific SERPs, and URL canonicalization. It is not proof that desktop rendering is broken.

## Content quality / SEO implications

The GSC data reinforces the source review: the current blog has many pages with low impressions, low positions, or no clicks. The source Markdown contains 31 posts, while the older export has 24 article pages. A large post inventory is not itself an SEO advantage. Before promoting, merging, or pruning any content, map each URL to queries, links, conversions, and unique value.

Specific GSC pages to prioritize for review include the articles with impressions but zero clicks: `healthcare-patient-acquisition`, `linkedin-abm-targeting`, `linkedin-thought-leadership`, `retargeting-omnipresence`, `b2b-enterprise-abm`, `headless-cms-roi`, `google-ads-quality-score`, `local-seo-domination`, `d2c-ecommerce-funnels`, and `technical-seo-audit`. These should receive expert fact-checking, source citations, accurate search-intent titles, real examples, author/reviewer attribution, contextual internal links, and current dates only after substantive revision.

Avoid interpreting average position as a ranking guarantee or using it as a standalone KPI. Brand queries, country/device mix, and small impression counts strongly affect it. No Search Console export can establish the reason a page is excluded or guarantee future rankings; use URL Inspection and sample-level validation for causes.

## Prioritized actions

1. **Resolve URL inventory and 404s:** export the 94 example URLs from GSC, classify each as intentional retirement, moved route, or accidental break, then implement targeted restore/301/410 behavior and remove stale internal links.
2. **Reconcile sitemap/version:** generate sitemap from the exact release intended to be live; include only canonical 200 URLs. Compare the 51-page export, 68-page source build, and live canonical URL list before submitting.
3. **Consolidate slash variants:** verify one-hop redirects, canonical tags, internal links, and sitemap use a single URL form.
4. **Review the 119 discovered and 21 crawled exclusions by URL:** sort by business value and inbound links; improve internal discovery and content uniqueness for valuable URLs; noindex or retire low-value duplicates where appropriate.
5. **Investigate market mismatch:** decide whether Malaysia or US/UK is the target market, then review high-impression queries, language/localization, service proof, local signals, and landing pages accordingly.
6. **Improve CTR on relevant high-impression pages:** start with Contact, Education, Services, and About after query inspection. Test one title/description change at a time and measure over a suitable interval.
7. **Prioritize content quality over volume:** update the articles listed above and the other weak-performing posts with verifiable references and practitioner input; merge only where intent overlaps and preserve redirect mappings.
8. **Recheck in Search Console:** after corrections, validate representative URLs, submit the correct sitemap, monitor indexed/excluded counts and pages/query/country/device performance. Record a baseline before changes.

## Limits of these exports

The exports do not include the 94 affected 404 URLs or the 119/21 excluded URL samples, URL Inspection details, query-to-page pairings, Search Console enhancement reports, Core Web Vitals, or live SERP captures. Therefore this report can identify priorities but cannot state which exact URLs need redirects or why Google excluded each one. The current GSC issue classifications show “Validation: Not Started”; no validation outcome is present.
