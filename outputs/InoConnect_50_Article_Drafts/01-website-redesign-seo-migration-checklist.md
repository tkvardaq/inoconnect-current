# Metadata

- **Title:** Website Redesign SEO Migration Checklist: Protect Rankings Before Launch
- **Slug:** website-redesign-seo-migration-checklist
- **Meta description:** A phased website redesign SEO migration checklist for teams changing design, CMS, URLs, or domainsâ€”covering URL mapping, staging QA, launch controls, and post-launch monitoring.
- **Primary query:** website redesign SEO migration checklist
- **Search intent:** Informational; implementation checklist for teams planning a redesign or migration
- **Market scope:** US + UK
- **Demand basis:** Candidate/hypothesis based on current US/UK result patterns [9]. Checklist-style results cover URL inventories, redirects, staging QA, and post-launch monitoring; no query-level search-volume data was available or used.
- **Status:** DRAFT â€” human fact-check required.

# Website Redesign SEO Migration Checklist: Protect Rankings Before Launch

A redesign can change the visual layer, content, URLs, CMS, hosting, or domain. These are not the same SEO event. A visual refresh that keeps URLs stable mainly requires content, template, and production QA; a URL or domain migration also needs an old-to-new map, redirects, and a coordinated move plan. Google separates hosting changes that leave URLs unchanged from URL-changing site moves, for which it recommends preparing the new site, mapping URLs, redirecting old addresses where needed, and monitoring both versions.[1][3]

**Direct answer:** Before design and development are locked, record a performance baseline, inventory important URLs, define exactly what is changing, and name owners across SEO, content, design, development, analytics, and marketing. Keep useful URLs where there is no reason to move them. If URLs change, map each meaningful old address to its closest relevant destination and test the permanent redirect. Before launch, check production access, canonicals, internal links, sitemap, forms, tracking, and mobile presentation. After launch, monitor page-level search and business signals, diagnose problems, and fix the cause you can verify. This process reduces avoidable errors but cannot guarantee stable rankings; Google says significant site moves may cause temporary fluctuations while pages are recrawled and reindexed.[1]

## 1. Classify the project before building a checklist

Write down whether the project changes design, templates, copy, internal architecture, public URLs, CMS, hosting, protocol, or domain. Also record whether one site serves both US and UK audiences and whether regional pages or subdomains are involved.

### Visual refresh, stable URLs

If only the design changes and public addresses stay the same, do not create redirects for unchanged pages. Still check that the new templates retain useful content, headings, navigation, internal links, metadata, and working user journeys. A â€œvisual-onlyâ€ project can affect all of these if page components or copy change.

### CMS or hosting change, stable URLs

A platform or server can change while public URLs remain intact. Googleâ€™s hosting guidance recommends copying and testing the new infrastructure, removing temporary crawl blocks when the move begins, and monitoring traffic and crawling on old and new systems.[3] If a CMS change also alters paths, treat those paths as a URL migration too.

### URL, protocol, or domain change

Path changes, HTTP-to-HTTPS moves, hostname changes, and domain changes affect the addresses people and search engines request. They call for URL mapping, appropriate redirects, updated links, and monitoring.[1] A domain move is not identical to changing a page path on the same domain; confirm the right Search Console steps for the specific move. Where practical, separate major changesâ€”such as a new CMS, domain, content strategy, and designâ€”so the effects are easier to diagnose. Google advises changing one thing at a time when possible.[1]

## 2. Establish a baseline and inventory URLs

Start before the new design is approved. Record a dated baseline for relevant organic clicks and impressions, analytics sessions, leads or sales, key landing pages, and known technical issues. Keep data definitions consistent: Search Console clicks and analytics sessions are different measurements. Note major campaigns or seasonal factors that could affect comparisons.

Build a URL inventory from multiple sources: a crawl of the live site, CMS export, XML sitemap, Search Console, analytics landing pages, andâ€”where availableâ€”server logs and backlink data. Include old pages that are not linked from the current navigation, as well as PDFs, downloads, campaign pages, and alternate host or protocol versions. A sitemap can aid discovery, especially for larger or complex sites, but does not guarantee crawling or indexing; Google notes that important pages can often be discovered through internal links.[6]

For each URL, capture its status, purpose, evidence of value, planned action, new destination if applicable, and owner. Consider traffic and conversions alongside links, current customer need, and the pageâ€™s role in navigation. Choose one action:

- **Keep:** retain the URL and page purpose.
- **Move:** continue the page at a new URL.
- **Merge:** intentionally combine material into a relevant replacement.
- **Retire:** remove content with no suitable successor.

| Old URL | Decision | Example reasoning |
|---|---|---|
| `/services/seo/` | Keep | Useful service page; refresh its template only. |
| `/old-platform-guide/` | Merge | Outdated guide is replaced by a more complete migration resource. |
| `/legacy-service/` | Move | A current page serves substantially the same need at a new address. |
| `/event-2019/` | Retire | Expired event has no relevant replacement. |

These examples are illustrative. Do not send every retired page to the home page merely to avoid a 404; the destination should genuinely replace the old resource.

## 3. Connect content and design decisions to the URL plan

A redirect spreadsheet is not enough. For each retained or moved page, record its user need, key information, planned copy changes, and internal links. Ask the content owner to identify what is outdated and what remains useful before design reduces or rearranges the material. The goal is not to preserve every sentence; it is to avoid accidentally removing information that explains the pageâ€™s purpose or helps users choose a next step.

Have design review important content and navigation across device sizes. If a page is being shortened, split, or merged, get SEO, content, design, and business owners to agree on the new destination and user journey. Record material changes so later performance comparisons have context.

For a US-and-UK website, decide whether one page accurately serves both audiences or whether regional variants are justified. Differences might include spelling, currency, contact information, service availability, or terminology. If regional URLs exist, coordinate canonical and language/region annotations. Google says that for regional variants in the same language, canonicalization and `hreflang` can help it understand which regional URL to show.[5] This is technical guidance, not a legal-compliance assessment.

## 4. Map and test redirects when addresses change

For every page marked â€œmoveâ€ or â€œmerge,â€ select the closest relevant destination. Use a one-to-one map when a page has a clear successor; document why a consolidated page replaces multiple old pages. Leave unchanged URLs out of the move map unless a separate canonical-host or protocol rule applies.

Use a permanent server-side redirectâ€”commonly HTTP 301 or 308â€”when a page has moved permanently. Google recommends server-side permanent redirects where possible when changing a URL shown in search results.[2] Temporary redirects such as 302 or 307 signal a temporary change, so do not choose a status by habit; ask development to confirm it matches the planned behavior.

Test both the response and the final destination. Check for missing mappings, redirect chains, loops, and irrelevant targets. A browser landing on a page does not prove the source returned the intended status. Keep a test log with old URL, expected destination, observed status, final URL, and pass/fail owner. For a large migration, automate checks over the map and manually inspect representative templates and high-value pages.

For content with no relevant replacement, Googleâ€™s site-move guidance says to return a 404 or 410 response rather than invent an unrelated destination.[1] Keep permanent redirects as long as possible; Google generally recommends at least one year, and notes that keeping them longer may help users who still follow old links.[1]

Update links you controlâ€”navigation, contextual links, breadcrumbs, canonicals, and sitemap entriesâ€”to point to the final URLs. Google considers redirects, sitemap inclusion, and `rel="canonical"` among the signals involved in choosing a canonical URL; a canonical is a hint, not a guarantee that Google will select that exact page.[5]

## 5. QA staging and production readiness

Staging protects work in progress, but production must not inherit its access restrictions by mistake. Make a list of every staging control and assign someone to confirm its production behavior. Check page-level `noindex` meta tags, HTTP `X-Robots-Tag` headers, and `robots.txt`; one control being removed does not prove all are cleared. Google explains that a crawler must be able to access a page to see its `noindex` instruction, and that `noindex` is not supported as a `robots.txt` rule.[4]

Test key templates on the public production hostname before calling the migration complete. Verify status codes, crawl access, intended canonical URLs, live internal links, and the sitemap. Ensure the sitemap lists intended live URLs rather than staging addresses or old paths. Check mobile layout, images, downloads, menus, and forms. Googleâ€™s page-experience guidance includes mobile presentation and Core Web Vitals among considerations, while clarifying that there is no single page-experience signal and good scores do not guarantee top rankings.[8]

Test lead and sales paths end to end: submit forms, check confirmation and routing, test phone or booking links, and confirm analytics events in the relevant measurement tools. For paid campaigns, check landing pages and conversion measurement as well; an SEO checklist does not replace PPC QA. Document a test lead or transaction so a measurement failure is not mistaken for a demand change.

| QA area | Check before approval | Shared owner |
|---|---|---|
| Indexability | Public pages work; no unintended `noindex` or crawl block | Developer + SEO |
| URL behavior | Map passes; no loops, chains, or unrelated destinations | Developer |
| Canonicals / regional pages | Preferred URLs and US/UK variants are consistent | SEO + developer |
| Content and links | Required page purpose, copy, and links remain | Content + SEO |
| Sitemap | Lists intended live URLs at the agreed path | Developer + SEO |
| User journeys | Forms, calls, checkout, or booking work | Marketing / product |
| Measurement | Analytics, ad tags, and conversions are tested | Analytics / PPC |
| Presentation | Key templates work on mobile; issues are logged | Design + development |

Set a launch gate. A production-wide crawl restriction, broken lead forms, missing redirect rules, or inaccessible priority pages should have a named decision-maker and resolution path before release. Lesser defects can be logged with owners and deadlines.

## 6. Launch and monitor as one coordinated handoff

Choose a launch window based on business timing and the teamâ€™s ability to support the release. Google suggests considering lower-traffic periods when possible and says large sites may be moved in sections if technically feasible.[1] Neither choice removes risk. Decide who can delay the release, whether a staged rollout is practical, and how the team will roll back or respond to a serious issue.

Before release, confirm the approved build, redirect map, backup and rollback plan, analytics access, Search Console access, and named incident owners. At launch, verify the live hostnameâ€”not only a preview. Test priority new pages and old URLs, crawl the production site, check robots and canonicals, and confirm the sitemap and key user journeys. Record release time, exceptions, and test results in a shared log.

If the domain or subdomain changes, follow the applicable Search Console Change of Address guidance; Google says it applies to eligible moves between domains or subdomains, not ordinary path changes on the same domain.[1] Submit the new sitemap where appropriate to help Google learn the new URLs, but do not treat submission as a guarantee of crawling or indexing.[1][6]

Create a monitoring schedule for the first days and weeks, then continue until major issues are understood. Avoid treating any one period as an indexing deadline: Google says medium-sized sites may take a few weeks or more for new URLs to replace old ones in Search, with larger sites potentially taking longer.[1] Compare page groups and destinations, not just sitewide totals.

In Search Console, check crawling and indexing information, sitemap status, and priority old and new URLs. URL Inspection provides information about Googleâ€™s indexed version of a page and can run a live test for potential indexability issues. Google cautions that a successful live test does not guarantee inclusion in the index.[7] Pair these checks with analytics and business outcomes: did visits move to the new pages, and do leads or sales still complete?

Diagnose before making more changes. A broad disappearance may point to production access, server responses, crawl blocks, or sitemap problems. A few failed old URLs suggest checking the map and redirects. If clicks remain steady but analytics sessions fall, check tags and measurement changes. If visits persist but leads fall, test forms, calls, and conversion tracking. Keep an issue log that records symptom, evidence, test, owner, and fix. Avoid changing redirects, templates, content, and tracking simultaneously before the cause is clearer.

Close out the handoff by retaining the final URL map, crawl results, redirect test log, launch notes, measurement definitions, exceptions, and remaining tasks. Confirm that future platform maintenance will not remove redirect rules prematurely and that the team responsible for the live site understands why each important URL was kept, moved, merged, or retired.

## A practical cross-functional checklist

- **SEO and analytics:** record baselines, compile URL sources, flag important pages, and approve measurement and mapping logic.
- **Content and business owners:** decide what stays, moves, merges, or retires; validate replacement pages.
- **Design:** show where essential content and navigation appear across devices; flag changes to page purpose.
- **Development:** implement URLs, redirects, canonicals, crawl controls, sitemap, analytics hooks, and release plan.
- **QA and marketing:** test production accessibility, forms, tracking, paid landing pages, and mobile behavior; record evidence.
- **Launch owner:** resolve blockers, coordinate monitoring, and preserve the handoff record.

This division makes â€œinclude SEOâ€ actionable. The SEO owner need not write server configuration; the developer should not decide which business page is disposable; and design should not discover after launch that an important form or navigation path was omitted. The shared artifact is a page-level plan: what changes, why, where it goes, how it will be tested, and who accepts the result.

## Frequently asked questions

### Does every redesign need an SEO migration?

No. A visual refresh with stable URLs may not require redirects, but the new templates, content, links, indexing controls, measurement, and user journeys still need QA. If hosting or CMS changes too, use the appropriate technical checklist even if public URLs stay the same.[3]

### Should I keep every old URL?

No. Preserve useful addresses, but make deliberate choices about obsolete, duplicated, or consolidated content. Redirect a moved page to a relevant replacement; do not route unrelated pages to the home page just to avoid a not-found response.[1]

### Will 301 redirects preserve all rankings?

No redirect guarantees rankings or traffic. Google treats permanent redirects as a signal that a destination should be canonical, and its site-move guidance says 301 redirects do not cause a loss of PageRank; significant moves can still fluctuate while they are processed.[1][2]

### How long should redirects remain?

Google recommends keeping site-move redirects as long as possible, generally at least one year. Keeping them longer may help people who still use old links; update internal links and important external links where possible.[1]

### Should I request indexing for every new URL?

URL Inspection can be useful for selected pages, but it does not guarantee indexing and is not a substitute for working internal links and a sitemap. Google says sitemap submission may help discovery; neither tool guarantees inclusion in Search.[6][7]

### What if rankings fall after launch?

Identify which pages, queries, and business outcomes changed, then check access, status codes, noindex rules, redirects, canonicals, content, sitemap, analytics, and conversion paths. A decline is not automatically temporary. Fix evidence-backed causes and avoid unrelated sitewide changes until diagnosis is clearer.[1]

## Conclusion

Manage a redesign as a set of explicit changes, not a single design handoff. Separate stable-URL refreshes from CMS or hosting changes and from URL or domain moves. Inventory pages before they disappear into a new CMS, agree on page-level decisions, test production access and redirects, and monitor both search and business outcomes. These steps reduce avoidable mistakes; they cannot guarantee rankings, indexing, or traffic. Clear ownership and a durable handoff help the team improve the site while retaining the evidence needed to respond when results differ from expectations.

## References

[1]: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes "How to move a site with URL changes â€” Google Search Central"
[2]: https://developers.google.com/search/docs/crawling-indexing/301-redirects "Redirects and Google Search â€” Google Search Central"
[3]: https://developers.google.com/search/docs/crawling-indexing/site-move-no-url-changes "Changing your hosting â€” Google Search Central"
[4]: https://developers.google.com/search/docs/crawling-indexing/block-indexing "Block Search indexing with noindex â€” Google Search Central"
[5]: https://developers.google.com/search/docs/crawling-indexing/canonicalization "How Google indexes and chooses the canonical URL â€” Google Search Central"
[6]: https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview "Learn about sitemaps â€” Google Search Central"
[7]: https://support.google.com/webmasters/answer/9012289?hl=en "URL Inspection tool â€” Search Console Help"
[8]: https://developers.google.com/search/docs/appearance/page-experience "Understanding page experience in Google Search results â€” Google Search Central"
[9]: https://starfirewebdesign.com/website-redesign-seo-checklist-how-to-protect-your-rankings-in-2026/ "Website Redesign SEO Checklist: How to Protect Your Rankings in 2026 â€” Starfire Web Design"

## Image brief for later

**Concept:** An authentic editorial photograph of marketing, design, and development teammates reviewing a generic website migration checklist and URL map around a laptop, with a launch timeline on the table. Keep screens and documents unreadable; do not depict fabricated metrics, a named client, or a purported InoConnect project. Use a candid office setting rather than a stock â€œSEO dashboardâ€ graphic.

**Suggested alt text:** Marketing, design, and development teammates review a website redesign launch checklist and URL migration plan together.

