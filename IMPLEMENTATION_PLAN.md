# InoConnect: implementation plan for Antigravity

Source of truth: `D:\ino website` (53 pages, static HTML, no git). Written 3 Nov 2026. **Revised three times on 3 Nov 2026 (owner answers, self-review, and an outside review that I checked point by point; see the Review log). All owner questions are answered, but this is NOT yet proven runnable: LinkedIn availability, legal review, the Apps Script deployment and the hosting directives are still unverified (section 0.1, "Unverified before launch").**
Every finding below was re-tested on 3 Nov 2026 (local files, a local server, a real browser, and `curl` against the live site). Items I could not test are marked **UNTESTED**. **Second review, same day:** every number and code block was re-checked; see the "Review log" at the bottom. The code blocks (Apps Script, form JS, `.htaccess`) were syntax-checked only and **never executed against Google or Hostinger**.
A runnable checker is at `_plan/verify.mjs` (`node _plan/verify.mjs`). Run it before starting (baseline is saved in `_plan/baseline.txt`) and after every phase. The goal is every check passing; the last line of the output shows the count. Do not weaken a check to make it pass; if a check is wrong, tell the owner.

## 0. Owner decisions (all answered)
| Topic | Decision |
|---|---|
| Postal codes | Remove from **everywhere** (visible text, JSON-LD, docs, drafts, reports). |
| Claims | **Soften** (Phase 4). No invented replacement numbers. **"EST. 2021" is confirmed true by the owner: keep it.** |
| Contact form | Deliver to the owner's Google account by **email AND a Google Sheet** (Phase 3). |
| Public mailbox | `info@inoconnect.com` everywhere (footer, contact, schema, mailto links, error messages). **Owner confirmed the mailbox exists.** `growth@` is retired. `privacy@` and `legal@` stay. |
| Source of truth | `D:\ino website`. `D:\AI\inoconnect-site` (Astro) is stale and must not be rebuilt over this folder. |
| Social | **No Twitter/X.** Remove every Twitter/X icon and share button. **Keep LinkedIn: `https://www.linkedin.com/company/inoconnect/`** (Phase 6). |
| Blog dates | One post per week from January 2026 (exact table in Phase 9). |
| Tools data | **Keep a copy of tool data AND email the visitor a copy of their result** (Phase 8.2). The old "Zero Gating / 0 Data Storage / Client-Side" claims are removed (Phase 4). |
| Brand spelling | **InoConnect** everywhere (see correction in section 1: the wordmark already renders as "InoConnect"). |

## 0.1 Owner follow-ups (no blockers)
- ~~B1~~ **Resolved:** LinkedIn is `https://www.linkedin.com/company/inoconnect/`. Whether that page exists and is public is **UNTESTED** by me; open it once before launch.
- ~~B2~~ **Resolved:** `info@inoconnect.com` is the correct mailbox and it exists (owner-confirmed; not tested by me). Form submissions still go to the owner's Google account through the Apps Script.
- **B3 (owner action at setup, not a blocker)** Choose the Google account that will own the Sheet and Apps Script (your own account). Form emails go to **that same account** automatically (`Session.getEffectiveUser()`), so no address is hard-coded.
- ~~B4~~ **Resolved:** tool results are stored in the Sheet **and** emailed to the visitor (Phase 8.2).
- Legal: governing law is Delaware in the Terms but offices are in Texas and the UK. Needs a lawyer. The plan only flags it.
- ~~D1~~ **Resolved:** the owner confirmed the weekly dates (5 Jan to 22 Jun 2026) are the real first-publication dates. `_plan/dates-real.flag` exists, so `datePublished` goes in the JSON-LD and matches the page. (Earlier I noted the live files' Last-Modified of 19 May 2026 is a deploy timestamp, which is consistent with files being re-uploaded after publication.)
- **D2 Addresses (confirm before keeping them published).** `116 Mulberry Lane, Bellaire` and `9 Highfield Avenue, Orpington` came from "source notes" (the live site currently shows no street address at all). Confirm each is real, usable for post, and one you are happy to publish (both look residential), and that it matches your LLC / UK company records. If not, remove the street lines too; the plan's edits then become "delete the whole address line".
- **D3 Bot protection account.** The form and tool-email endpoints need a server-checked CAPTCHA (Phase 3). Plan uses Cloudflare Turnstile (free): create a widget for `inoconnect.com` (and `localhost` for testing); you get a site key (public, goes in the HTML) and a secret (goes in Apps Script "Script properties", never in the site).
- **Unverified before launch:** (1) the LinkedIn page: `curl` got HTTP 200 for the URL, but LinkedIn serves a 200 sign-in page to bots, so that proves nothing; open it logged out and in. (2) legal review of the privacy text. (3) Apps Script deployment and the browser reading its reply (Phase 3 test 10). (4) every `.htaccess` directive on your Hostinger plan.

## 1. Corrections to my earlier report (so nobody builds on wrong numbers)
| Earlier claim | Re-tested result |
|---|---|
| Homepage ~48 MB of images | **28 MB** of local images (19 unique files) plus a 17.0 MB video (`preload="metadata"`, so not downloaded until played). Only the homepage is heavy; the median page is 0.4 MB. Next worst: `/services/` 3.7 MB, `/services/web-development/` 2.8 MB. |
| 50 icon buttons have no accessible name | **False.** 0 unnamed buttons/links on the pages I ran in a browser. Dropped. |
| Sitemap has no `lastmod` | **False.** All 53 URLs have `lastmod 2026-11-03` (and `changefreq`, `priority`). |
| 14 blog titles over 60 chars | **10** (61-62 chars). Descriptions are all 70-160 chars. |
| Overflow on Headless CMS (397px) and Podcast (392px) | Headless CMS reproduced at **408px** (cause confirmed). Podcast measured **390px** in my browser, twice (second time after waiting for fonts and Tailwind), but **392px** was measured independently by you and by a reviewer, so its page-level overflow depends on which font is loaded. What is reproducible every time: its third stat card content is 124px wide inside a 103px card. Treat Podcast as "overflows depending on rendering"; the fix is the same. The `<body>` has `overflow-x-hidden`, which hides the page-level symptom in some renderings. |
| Titles over 60 chars are errors | **Not an error.** Google sets no maximum title length; it truncates by display width. The 10 titles of 61-62 characters are advisory only (checker no longer fails them; it fails only >70 or <15). |
| Deleting the old deploy folders is safe | Tested: all **204** old-folder URLs have an equivalent page in this 53-page set (0 unmatched), and all 51 non-deploy URLs match too, so the blanket redirect has a destination for every URL. Still run `_plan/redirect-check.mjs` right before deleting, and take a Hostinger-side backup first (Phase 10). |
| 25 blog posts + 3 pages have the bad grid | Confirmed: exactly **28 pages** have unprefixed `grid-cols-3` (25 posts, `services/ai-automation`, `services/ai-development`, `tools/ltv-calculator`). Only Headless CMS was proved to overflow the page. The other 27 are fixed by the same rule. |
| Live site checks in the pasted report | **Confirmed by `curl`:** live sitemap has 255 URLs, 204 of them under four `/InoConnect_Hostinger_Deploy_2026012*/` folders (51 each). Live headers: only `content-security-policy: upgrade-insecure-requests`; no HSTS, `x-content-type-options`, referrer-policy, permissions-policy or frame protection (homepage only checked). Live `/blog/headless-cms-roi/` H1 is still "Accessibility (A11Y): The Untapped Market"; local is "Headless CMS ROI: Content Velocity & Architecture". Live titles differ from local. Server is Hostinger (hcdn). |
| Wordmark is "Ino Connect" (two words) | **Wrong.** The markup is `<span>Ino</span><span>Connect</span>` with no space; it only looked like two words because of my text extraction. The DOM already reads "InoConnect". No wordmark change is needed. (The two-tone colouring stays.) |
| Live contact page shows addresses | The **live** contact page contains no street address at all. Only local files have the addresses, so the codes only need removing locally. |

New verified facts used in this plan:
- Header and footer HTML are byte-identical on all 53 pages (one hash each). So shared fixes are safe find-and-replace operations.
- No local page has testimonials or client-logo names any more (checked). Only the claims in Phase 4 remain.
- `assets/tool-leads.js` is **not included by any page**. It posts name/email/company plus calculator inputs to a Google Apps Script URL of unknown ownership and also sends the visitor's **email address to Google Analytics** (`gtag('event', ..., {email})`), which breaks GA's no-PII rule. The Tools page currently claims "Zero Gating or Capture", "Free & Client-Side" and "0 Data Storage / Gating". Decision: delete the old script and build a new, consent-based capture (Phase 8.2); the three claims are rewritten (Phase 4).
- Calculators: math is right for ROAS and LTV, but static HTML numbers differ from what JS shows (Phase 8).

---

## Phase 0. Safety net (do first, ~30 min)
1. There is no git. Create `D:\ino website_BACKUP_2026-11-03.zip` (outside the folder) before any edit. Then `git init` inside `D:\ino website` with a `.gitignore` (`node_modules`, `_deploy`, `.manus`, `__pycache__`) and commit the baseline so each phase can be one commit and reverted.
2. Serve locally on a **free** port you pick yourself, for example `python -m http.server 8791` from `D:\ino website`. Do not reuse a server that is already running: another app may be on that port (a reviewer reported exactly that). Before any screenshot or test run `curl -s http://localhost:8791/ | grep -o "<title>[^<]*"` and confirm it says "InoConnect".
3. Baseline screenshots BEFORE editing, 8 pages x 3 widths (1440, 768, 390): `/`, `/about/`, `/contact/`, `/services/`, `/services/seo/`, `/industries/saas/`, `/blog/headless-cms-roi/`, `/tools/roas-calculator/`. Use Playwright (`npx playwright`). Save to `_plan/baseline/`. After Phase 5 (Tailwind build) compare; any visual diff must be explained.
4. Run `node _plan/verify.mjs` and save the output as `_plan/baseline.txt`.
5. Create the deploy exclusion list now, used in Phase 9: never upload `_plan/`, `.manus/`, `__pycache__/`, `outputs/`, `*.md`, `*.py`, `_astro/*.js` (nothing loads them; only `_astro/about.Bi_RrpmH.css` is used), `package*.json`, `node_modules/`, `tailwind.config.js`, unreferenced images/videos.

## Phase 1. Remove ZIP and postcode everywhere (P0)
Rule: keep street, town, state/country; remove the 5-digit US ZIP and the UK postcode. Final text: `116 Mulberry Lane, Bellaire, TX` and `9 Highfield Ave, Orpington`.

Exact edits (all verified present; use string replace, not line numbers, because lines shift):

| Where | Find | Replace with |
|---|---|---|
| Footer, **all 53 pages** | `116 Mulberry Lane, Bellaire, TX <ZIP>` | `116 Mulberry Lane, Bellaire, TX` |
| Footer, **all 53 pages** | `9 Highfield Ave, Orpington, <POSTCODE>` | `9 Highfield Ave, Orpington` |
| `about/index.html` (office cards, ~L483, L489) | `116 Mulberry Lane, Bellaire, Texas <ZIP>` / `9 Highfield Avenue, Orpington, <POSTCODE>` | `116 Mulberry Lane, Bellaire, Texas` / `9 Highfield Avenue, Orpington` |
| `contact/index.html` (office block, ~L376, L388) | `Bellaire, Texas, <ZIP>` / `Orpington, <POSTCODE>` | `Bellaire, Texas` / `Orpington` |
| `contact/index.html` JSON-LD `ProfessionalService` (~L116, L123) | the two `"postalCode": ...` lines | delete both lines. `addressCountry` follows, so the trailing comma stays valid. Re-parse the JSON after editing. |

`<ZIP>` and `<POSTCODE>` are placeholders so this document itself stays clean. Read the real values from `contact/index.html`.

Also scrub non-site files (they count as "everywhere"): every `.md` in the root, `outputs/*.md` (including `InoConnect_Website_Audit_2026-11-03.md`), `outputs/InoConnect_50_Article_Drafts/*.md`, `.manus/mcp-results/*.json`, `complete-website-audit.md`, `live-site-verification.md`, `search-console-review.md`, `verified-ranking-plan.md`, `INOCONNECT_REVIEW_REPORT.md` (already scrubbed by me). Search each for the ZIP, the postcode, and the words "zip", "postcode", "postal".

Not in this folder (owner action): Google Business Profile, Search Console business info, directory/citation listings, social bios, the stale Astro folder `D:\AI\inoconnect-site`, any invoices/footers elsewhere. Remove the codes there too or the data will come back.

Trade-off to accept: Google prefers `postalCode` in local-business structured data, so local rich-result eligibility is weaker. Owner chose "everywhere", so it is removed.

**Address gate (D2):** before this phase, the owner confirms both street addresses are real and approved for publication. If either is not, delete that whole address line instead of only the postal code, in every place listed above.

Done when: `verify.mjs` checks 1 and 2 pass, and `grep -rIn` for the two tokens over the whole folder returns nothing.

## Phase 2. Mobile layout (P0)
Root cause (tested): in a 3-column `grid grid-cols-3 gap-4`, stat cards are ~103px wide at 390px; long words such as "personalization" cannot wrap, push the card to 144px and stretch the grid, which widened the whole document to 408px on Headless CMS.

Fix on all 28 pages:
1. `class="grid grid-cols-3 gap-4 mb-12 reveal-on-scroll"` -> `class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 reveal-on-scroll"`. Children keep their classes; add `min-w-0 break-words` to each of the three stat cards as a safeguard.
2. `services/ai-automation`, `services/ai-development`: `grid grid-cols-3 gap-6 pt-6 border-t ...` and `tools/ltv-calculator`: `grid grid-cols-3 gap-4 pt-6 border-t ... text-center` -> same `grid-cols-1 sm:grid-cols-3` pattern; shrink stat font on mobile if they stack awkwardly.
3. `grid grid-cols-4 gap-6` on 8 pages (`industries/*` x7, `services/social-media`) uses children with `col-span-4`. **Do NOT change it to `grid-cols-1`**: `col-span-4` children would create three phantom columns. Leave as is, test at 360px, and reduce `p-12` to `p-6 md:p-12` on the big stat cards if the text is cramped.
4. Remove reliance on `overflow-x-hidden` on `<body>` as the fix. Keep it only as a safety net.
5. Test at 360, 390, 414, 768 px on all 53 pages. Pass rule for each page: `document.documentElement.scrollWidth <= window.innerWidth` **and** no element with `scrollWidth > clientWidth + 1` inside `main` cards. Snippet to run in the browser console on each page:
```js
[...document.querySelectorAll('main *, section *')].filter(e=>e.scrollWidth>e.clientWidth+1 && getComputedStyle(e).overflowX==='visible' && e.clientWidth>0).map(e=>e.tagName+'.'+String(e.className).slice(0,40))
```
6. Tap targets: a rough sweep (hidden iframes at 390px, Tailwind CDN may not have finished applying styles, so treat as approximate) counted about 17 links/buttons per page under 32px tall. Re-measure properly in a visible browser after Phase 5 before deciding how much to change. Give footer and menu links `py-2`/`min-h-[44px]` (WCAG 2.2 minimum is 24px; aim for 44px). Re-measure.
7. Minimum text size 12px (see Phase 7). The mobile menu must trap focus, close on Esc, and set `aria-expanded` on the toggle.

## Phase 3. Contact form -> email + Google Sheet (P0)

### 3.0 Privacy decisions come FIRST (gate: nothing that collects data goes live until this is signed off)
Write these down (owner, ideally with a lawyer), then update `privacy/index.html` and the form notices **before** deploying 3.x or 8.2. They are not a Phase 9 afterthought any more.
1. **Purposes, kept separate:** (a) reply to a contact inquiry; (b) email the visitor their tool result; (c) optional marketing follow-up. (c) is its own **unchecked, optional** checkbox and never a condition of (a) or (b). Nothing is used for (c) without it.
2. **Lawful basis per purpose** (UK/EU): decide and record (typically legitimate interests or steps before a contract for (a); the visitor's request/consent for (b); consent for (c), because electronic marketing is covered by PECR). **UNTESTED/needs advice.**
3. **Retention:** choose periods (suggestion: contact inquiries 24 months from last contact; tool rows 12 months unless (c) was ticked) and a method: a monthly reminder to delete old Sheet rows, or an Apps Script time trigger that does it.
4. **Vendors and terms:** Google (Sheets, Apps Script, Gmail) under whichever terms your Google account has (a free consumer account has different terms from Workspace: consider Workspace and its data-processing terms), Cloudflare Turnstile, Google Tag Manager/Analytics. Note international transfers (US). Name every vendor in the privacy policy.
5. **Disclosures:** the privacy page lists the exact fields collected by each form, the purposes, bases, retention, vendors, rights, and how to exercise them (`privacy@inoconnect.com`). A one-line notice sits next to each form.
6. **Rights requests:** a documented process: find the person in the Sheet (search by email), delete the row, delete related email threads, reply to the requester.
7. **Cookies/tags:** see the corrected statement in Phase 9 (the situation is more nuanced than "always a banner").
Acceptance: privacy page updated and reviewed; both forms show the notice; the Sheet has a `Follow-up consent` column.

### 3.1 What is wrong today (tested)
`contact/index.html` form: `onsubmit="event.preventDefault(); alert('Audit request received! ... within 4 business hours.')"`. 7 controls, 0 `name` attributes, 0 `id`/`for` links (programmatic check: 7 of 7 unlabeled), selects not `required`, no endpoint, no consent, no spam protection. Visitors are told their request arrived when nothing was sent.

### 3.2 Architecture
Browser form -> `fetch` POST (`text/plain`, no preflight) -> **new** Google Apps Script web app -> (a) append a row to a Google Sheet, (b) `MailApp.sendEmail` to the account that owns the script (the owner's Google account; Reply-To is the visitor).
**Cross-origin caveat (UNTESTED, and it is a gate):** Google documents that Content Service replies are redirected to a one-time `script.googleusercontent.com` URL; it does not document browser CORS behaviour. The common pattern (`text/plain` body, then `r.json()`) is widely reported to work, but I have not run it against your deployment. **Test 10 in 3.7 must pass on the real domain before launch.** There is **no `no-cors` fallback**: in `no-cors` mode the page cannot read the reply, so it could show "success" when the write failed. If Test 10 fails, do not ship this form. Switch to a form service whose JSON reply is documented as readable cross-origin (for example Formspree or Web3Forms) and keep the Sheet as a second destination, or put a small proxy (a Cloudflare Worker) in front of Apps Script.
**Do not reuse** the Apps Script URL hard-coded in `assets/tool-leads.js`: its owner and code are unknown (UNTESTED) and it is already public.

### 3.3 One-time setup (owner, 10 min)
1. Signed in as the owning Google account: create a Sheet "InoConnect Leads" with two tabs. Tab `Leads`, header row: `Timestamp | Name | Email | Website | Industry | Budget | Bottleneck | Goals | Page | Consent`. Tab `ToolLeads`, header row: `Timestamp | Tool | Name | Email | Company | Inputs (JSON) | Result | Page | Follow-up consent`.
2. Extensions -> Apps Script (keep the default V8 runtime; the code uses `p{L}` regex support). Paste `Code.gs` below, set `SHEET_ID` (the long id in the Sheet URL between `/d/` and `/edit`).
3. Project Settings -> Script properties: add `TURNSTILE_SECRET` (D3). Then Deploy -> New deployment -> Web app -> Execute as **Me**, Who has access **Anyone**. In the editor this is the anonymous option ('ANYONE_ANONYMOUS' in the manifest). **Not** "Anyone with Google account" ('ANYONE'), which forces a Google sign-in and breaks the form for normal visitors. Copy the `/exec` URL. Every later edit needs "Manage deployments -> New version".
4. Run the `authorize` function (not `doPost`, which needs a request object) once from the editor to grant Sheets, Gmail and external-request permissions. It sends one test email to you.
5. Paste the `/exec` URL into `assets/contact-form.js` and `assets/tool-capture.js` (`ENDPOINT`). Both files must use the same URL. The mail goes to the same Google account that owns the script.

`Code.gs`
```js
const SHEET_ID = 'PASTE_SHEET_ID';
const MAIL_RESERVE = 20;                       // always keep this many recipients of Google's daily mail quota for the owner's own notifications
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const clean = s => String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, 2000);
const safeCell = s => /^[=+\-@]/.test(s) ? "'" + s : s;            // block spreadsheet formula injection
const reply = o => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);

// Allow-list per calculator: the result must match this format and only these numeric inputs are accepted.
const TOOLS = {
  roas:  { name: 'ROAS Calculator',         result: /^\d{1,3}(\.\d{1,2})?x$/,      inputs: ['spend-range', 'rev-range', 'margin-range', 'aov-range'] },
  ltv:   { name: 'LTV Calculator',          result: /^\$\d{1,3}(,\d{3})*$/,        inputs: ['arpu-input', 'churn-input', 'margin-input'] },
  email: { name: 'Email Revenue Simulator', result: /^\$\d{1,3}(,\d{3})*$/,        inputs: ['subs-range', 'sends-range', 'open-range', 'ctor-range', 'email-aov-range'] },
  cro:   { name: 'CRO Simulator',           result: /^\+\$\d{1,3}(,\d{3})*$/,      inputs: ['traffic-range', 'base-cr-range', 'new-cr-range', 'cro-aov-range'] }
};

function authorize() {   // run ONCE from the editor to grant permissions
  SpreadsheetApp.openById(SHEET_ID).getName();
  UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { muteHttpExceptions: true });
  MailApp.sendEmail(Session.getEffectiveUser().getEmail(), 'InoConnect forms: authorised', 'Permissions granted.');
}

function verifyBot(token) {   // server-side Cloudflare Turnstile check; rejects when the secret or token is missing
  const secret = PropertiesService.getScriptProperties().getProperty('TURNSTILE_SECRET');
  if (!secret || !token) return false;
  const r = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',
    { method: 'post', payload: { secret: secret, response: String(token) }, muteHttpExceptions: true });
  try { return JSON.parse(r.getContentText()).success === true; } catch (x) { return false; }
}

function mailQuotaOk() { return MailApp.getRemainingDailyQuota() > MAIL_RESERVE; }   // Google's quota window is 24 h from first use, not a calendar day

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.company_fax) return reply({ ok: true, saved: false, emailed: false });   // honeypot: look successful, store nothing
    if (!verifyBot(d.turnstile)) return reply({ ok: false, error: 'bot' });
    return d.form === 'tool' ? saveTool(d) : saveContact(d);
  } catch (err) {
    console.error(err);
    return reply({ ok: false, error: 'server' });
  }
}

// Inquiry form: Sheet row + notification email to the owner. Reply says exactly what succeeded.
function saveContact(d) {
  const v = { name: clean(d.name), email: clean(d.email).toLowerCase(), website: clean(d.website), industry: clean(d.industry),
              budget: clean(d.budget), bottleneck: clean(d.bottleneck), goals: clean(d.goals), page: clean(d.page), consent: d.consent ? 'yes' : 'no' };
  if (!v.name || !EMAIL_RE.test(v.email) || !/^https?:\/\/\S+\.\S+/.test(v.website) || v.consent !== 'yes') return reply({ ok: false, error: 'invalid' });
  const cache = CacheService.getScriptCache(), key = 'rl_' + v.email;
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    if (cache.get(key)) return reply({ ok: false, error: 'duplicate' });          // checked INSIDE the lock, so two simultaneous posts cannot both pass
    SpreadsheetApp.openById(SHEET_ID).getSheetByName('Leads').appendRow(
      [new Date(), v.name, v.email, v.website, v.industry, v.budget, v.bottleneck, v.goals, v.page, v.consent].map(x => typeof x === 'string' ? safeCell(x) : x));
    cache.put(key, '1', 120);
  } finally { lock.releaseLock(); }
  let emailed = false;
  try {
    MailApp.sendEmail({ to: Session.getEffectiveUser().getEmail(), replyTo: v.email, name: 'InoConnect website',
      subject: 'New growth audit request: ' + v.name,
      body: ['Name: ' + v.name, 'Email: ' + v.email, 'Website: ' + v.website, 'Industry: ' + v.industry,
             'Budget: ' + v.budget, 'Bottleneck: ' + v.bottleneck, 'Goals: ' + v.goals, 'Page: ' + v.page].join('\n') });
    emailed = true;
  } catch (err) { console.error(err); }                                              // the Sheet row is the source of truth
  return reply({ ok: true, saved: true, emailed: emailed });
}

// "Email me this result": Sheet row, then an email copy to the visitor. No visitor-written text can reach the email.
function saveTool(d) {
  const tool = TOOLS[d.tool];
  const email = clean(d.email).toLowerCase();
  const result = String(d.result || '').trim();
  if (!tool || !EMAIL_RE.test(email) || !d.consent || !tool.result.test(result)) return reply({ ok: false, error: 'invalid' });
  const inputs = {};
  try {
    const raw = JSON.parse(String(d.inputs || '{}'));
    tool.inputs.forEach(k => { const n = Number(raw[k]); if (isFinite(n)) inputs[k] = n; });
  } catch (x) { /* malformed inputs are dropped */ }
  const name = clean(d.name).slice(0, 100), company = clean(d.company).slice(0, 100), page = clean(d.page);
  const first = name.replace(/[^\p{L} '\-]/gu, '').trim().split(/\s+/)[0].slice(0, 30);
  const followup = d.followup ? 'yes' : 'no';
  const cache = CacheService.getScriptCache(), key = 'tl_' + email + d.tool;
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    if (cache.get(key)) return reply({ ok: false, error: 'duplicate' });          // inside the lock: atomic
    SpreadsheetApp.openById(SHEET_ID).getSheetByName('ToolLeads').appendRow(
      [new Date(), tool.name, name, email, company, JSON.stringify(inputs), result, page, followup].map(x => typeof x === 'string' ? safeCell(x) : x));
    cache.put(key, '1', 120);
  } finally { lock.releaseLock(); }
  let emailed = false;
  if (mailQuotaOk()) {
    try {
      MailApp.sendEmail({ to: email, replyTo: 'info@inoconnect.com', name: 'InoConnect',
        subject: 'Your InoConnect ' + tool.name + ' result',
        body: ['Hi' + (first ? ' ' + first : '') + ',', '', 'Here is a copy of your result from the InoConnect ' + tool.name + '.', '',
               'Result: ' + result, 'Inputs:'].concat(Object.keys(inputs).map(k => '  ' + k + ': ' + inputs[k])).concat([
               '', 'This is an estimate based on the inputs you entered. It is not a guarantee.',
               'Questions? Reply to this email or visit https://inoconnect.com/contact/', '',
               'You asked us to email you this result, so we sent it. We keep your details and inputs as described in https://inoconnect.com/privacy/ . To have your data deleted, email privacy@inoconnect.com.']).join('\n') });
      emailed = true;
    } catch (err) { console.error(err); }
  }
  return reply({ ok: true, saved: true, emailed: emailed });
}
```
Limits to remember (Google's quota page): `MailApp` allows 100 recipients/day on a consumer account and 1,500 on Workspace; the window is 24 hours from first use, not a calendar day, which is why the code reads `MailApp.getRemainingDailyQuota()` instead of keeping its own counter. The result is not recomputed on the server: it must match a strict format per tool and only allow-listed numeric inputs are kept, so the worst a caller can do is send a plausible-looking number to an address they typed, from a fixed template. If you want to remove even that, recompute ROAS and LTV server-side (they are one-line formulas). The reply is `{ok, saved, emailed}`: `saved` means the Sheet row exists, `emailed` means the mail was handed to Gmail.

### 3.4 HTML changes in `contact/index.html`
- `<form id="audit-form" class="space-y-6" novalidate>` and remove the `onsubmit` attribute.
- Give every control `id` + `name` + matching `<label for>`: `name` (autocomplete `name`), `email` (type email, autocomplete `email`), `website` (type url), `industry`, `budget`, `bottleneck` (selects: add a disabled empty first option, mark `required`), `goals` (textarea, `maxlength=2000`).
- Hidden honeypot, off-screen (not `display:none`), with `tabindex="-1" aria-hidden="true" autocomplete="off"`: `<input type="text" name="company_fax">`.
- Consent checkbox `name="consent" required`: "I agree to InoConnect contacting me about this request. See the <a href="/privacy/">Privacy Policy</a>."
- Status region under the button: `<p id="form-status" role="status" aria-live="polite"></p>`.
- Replace every `growth@inoconnect.com` on `contact/index.html` (every occurrence: JSON-LD `email`, the detail row, the FAQ sentence, the closing button text and its `mailto:`) with `info@inoconnect.com`. There are 5 occurrences in total. The homepage Organization schema already uses `info@`.
- `<noscript>` message: "Please email info@inoconnect.com".
- Replace the visible promise text so it matches reality (Phase 4: one reply-time statement everywhere).
- Turnstile widget above the button: `<div class="cf-turnstile" data-sitekey="YOUR_SITE_KEY"></div>` and, once per page, `<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>`. Name it in the privacy notice and allow it in the CSP (Phase 9).
- `<script src="/assets/contact-form.js" defer></script>`.

### 3.5 `assets/contact-form.js` (new)
```js
(() => {
  const form = document.getElementById('audit-form'); if (!form) return;
  const ENDPOINT = 'PASTE_APPS_SCRIPT_EXEC_URL';
  const status = document.getElementById('form-status'), btn = form.querySelector('[type=submit]'), t0 = Date.now();
  const say = (m, ok) => { status.textContent = m; status.className = ok ? 'text-[#44D7A8]' : 'text-red-300'; };
  const MSG = {
    duplicate: 'We already received a request from this email.',
    bot: 'Please complete the check and try again.',
    invalid: 'Please check the highlighted fields and try again.'
  };
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const d = Object.fromEntries(new FormData(form));
    if (Date.now() - t0 < 3000) return say('Please try again in a moment.', false);
    d.turnstile = d['cf-turnstile-response']; delete d['cf-turnstile-response'];
    d.page = location.href; btn.disabled = true; say('Sending...', true);
    try {
      const r = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(d) });
      const out = await r.json();                                  // if the browser blocks reading this reply, the form must NOT ship (plan 3.2)
      if (!out.ok || !out.saved) throw new Error(out.error || 'server');
      form.reset(); if (window.turnstile) window.turnstile.reset();
      say('Thanks. We have your request and will reply by email.', true);
      (window.dataLayer = window.dataLayer || []).push({ event: 'generate_lead', form_id: 'growth_audit' }); // no personal data
    } catch (err) {
      say(MSG[err.message] || 'We could not send your request. Please email info@inoconnect.com.', false);
      if (window.turnstile) window.turnstile.reset();
    } finally { btn.disabled = false; }
  });
})();
```
The success message is only shown when the server says `saved: true`. A thrown error or an unreadable reply shows the failure message, never a false success.
Never put the email address or any form value in `dataLayer`/GA events.

### 3.6 Clean-up
- Delete `assets/tool-leads.js` (unused, sends the visitor's email to GA, points at an Apps Script URL of unknown ownership). Replace it with the new `assets/tool-capture.js` described in Phase 8.2. Keep non-site files (`.md`, `.py`, prompt book) out of the deploy set only; they may stay in the repo.
- The privacy update is gated in 3.0 and must be live before either form. It names the contact-form fields, the tool-result fields, Google Sheets/Apps Script and Cloudflare Turnstile as processors, retention, and the visitor's rights.

### 3.7 Tests (all must pass; record evidence)
1. Valid submit -> row appears in the Sheet within 5 s, email arrives in the owner's Google account, Reply-To is the submitter, success message shown, button re-enabled.
2. Empty submit -> browser validation messages; nothing sent.
3. Honeypot filled -> no row, no email.
4. Same email twice within 2 min -> second is rejected with the duplicate message.
5. Offline / wrong endpoint -> error message with the mailto fallback.
6. Cell starting with `=`: submit goals `=1+1` -> Sheet stores `'=1+1` (text), not a formula.
7. Keyboard-only and screen reader: every field announced with its label; status message announced.
8. 390px: no overflow.
9. Check the GTM/GA event `generate_lead` fires once and carries no personal data.
10. **Gate.** From the real contact page on the real domain (not `localhost`), in Chrome, Firefox and Safari: `r.json()` is readable and returns `{ok:true,saved:true}`. If any browser cannot read it, do not ship (see 3.2).
11. Bot check: submit with the Turnstile token removed in DevTools -> `error: "bot"`, no row, no email.
12. Race: fire two identical requests at once (two `curl` commands in parallel with a valid token) -> exactly one Sheet row.
13. Mail failure: temporarily revoke Gmail scope or exhaust the quota -> reply is `saved:true, emailed:false`, the page still says the request was received, the row exists.

## Phase 4. Soften unproven claims (P0)
Principles: no number, rank, certification or guarantee appears unless the owner can prove it; no new numbers are invented; one tone ("we aim to", "typically", "available on request"). After editing, `verify.mjs` check "No hard claims left" must pass. Hits are on more pages than the first report listed (`services/`, `industries/`, `tools/`, `privacy/` too).

| File (search for the text) | Current | Replace with |
|---|---|---|
| `about/`, `services/index`, `industries/index`, `tools/index`, `contact/` stat blocks | `98.4%` retention, `$420M+` pipeline, `4.2x` ROAS, `100% Empirical Attribution`, `< 8 Mo Average CAC Payback`, `EST. 2021 - GLOBAL`, `4.2x Average ROAS Benchmarked` | Replace with **countable, true** facts: `8` services, `7` industries, `4` free tools, `25` articles (verify the counts at edit time). **Keep "EST. 2021"** (owner-confirmed) but replace "GLOBAL" with "US & UK" (the two offices). If any other figure is later proven, restore it with the source and period ("across N clients, 2024-2025"). |
| `contact/` (~L545) | "To deliver 4.2x average ROAS and maintain 98.4% retention, we only accept partners where..." | "We work with a limited number of partners at a time so every engagement gets senior attention." |
| `services/index` (~L911-914) | "Industry average: 60-70% ... 98.4% annual partner retention rate" | remove the comparison row, or "Retention is something we track and will share on request." |
| Footer, **all 53 pages** and `about/` | "Engineering predictable revenue growth and autonomous AI systems for ambitious brands. We turn marketing into an empirical science." | "Building measurable growth systems and AI automation for ambitious brands." |
| `index.html` (~L424) | "0% Fluff • 100% Math" | "Clear reporting, practical strategy" |
| `index.html` (~L397) | "reliably expands your pipeline and accelerates revenue" | "to help grow your pipeline and revenue" |
| `index.html` (~L470, 473, 602, 632) | "elite digital growth partner"; "zero guesswork"; "veteran digital practitioners"; "We deliberately cap our active client engagements" | "digital growth partner"; "clear reporting"; "experienced digital practitioners"; "We keep our client list small so each account gets focused attention." (and only keep if true) |
| `index.html` (~L529) and elsewhere | "Predictable Revenue Pipelines" | "Systematic Acquisition Funnels" |
| `index.html`, `about/`, `services/index` ("Market Leaders", "Empowering Market Leaders Worldwide", "market leader" in `services/web-development`, `industries/professional-services`, `services/ai-development`) | market-leader language | "Ambitious Brands" |
| `about/` ~L476 sub-copy | "enterprise multinationals across North America, Europe, and Asia-Pac" | "growing businesses in North America and Europe" (only if true) |
| `contact/` L395-402 and L418-425 | "< 4 Business Hours - Guaranteed senior strategist review" | "Typically within 1 business day" (see unified SLA) |
| `contact/` ~L573-593 | "Our 4-Hour Response Guarantee", "Under 4 hours", "< 4h", "Guaranteed Executive Response", "we provide your full technical telemetry teardown at zero cost", "designated Growth Director", "max 4 client ratio" | Section title "How We Respond". One line: "We aim to reply within 1 business day." Delete the guarantee, the free-teardown offer, the "< 4h" tile and the "max 4 client ratio". |
| `contact/` ~L606-620 | "bank-grade encryption and signed legal guarantees"; "HIPAA BAA - Zero PHI leak sanitization"; "SOC 2 Type II - Role-based access controls" | Heading "Data handling". Items: "Mutual NDA on request", "Access limited to what the project needs", "GDPR and CCPA-aware data practices". Remove SOC 2 and HIPAA BAA unless the owner provides a report/signed BAA template. Add: "Security and compliance requirements are agreed in writing before work begins." |
| `industries/index` ~L694, L856-862 | "Signed BAAs across all endpoints. ... guarantee 0% PHI leakage"; "SOC 2 Type II - Role-based access controls, encrypted data pipelines" | "We follow HIPAA-aware practices for healthcare marketing and scope compliance needs with each client." / "We use role-based access and encrypted tools." |
| Nav mega-menu on **all 53 pages**; `industries/index` ~L694; `industries/healthcare` ~L570, ~L392 and its meta descriptions; `blog/healthcare-patient-acquisition` meta descriptions (including the `og:`/`twitter:` copies) | "Patient acquisition & HIPAA compliance."; "HIPAA-compliant patient acquisition, zero PHI leaks"; "HIPAA-compliant patient experience"; "Proven growth for"; "ethical, HIPAA-compliant ... strategies" | "Patient acquisition with HIPAA-aware marketing."; "HIPAA-aware patient acquisition and local clinic visibility"; "a privacy-conscious patient experience"; "Growth marketing for"; "ethical, privacy-conscious ... strategies". An agency cannot make a client or a site "HIPAA-compliant"; only the covered entity can. |
| `about/` meta descriptions (3 copies) and ~L490; `industries/ecommerce` ~L990, ~L1168 | "verified ROI and full asset ownership"; "Full GDPR compliance, UK market expansion..."; "100% CAPI" | "measurable ROI and clear asset ownership" (only if true); "GDPR-aware practices, UK market expansion..."; "CAPI-ready tracking" |
| Ownership statements (`index.html` and elsewhere): "remain 100% owned by the client upon invoice settlement", "You own 100% of your tracking architecture, ad accounts, creative" | contractual promises | Keep only if they match your contract. Owner to confirm; otherwise "Client ownership of ad accounts and assets is agreed in your contract." |
| `industries/index` ~L965 | "strict non-compete exclusivity agreements" | "We take conflicts of interest seriously and discuss competitor conflicts before we start." |
| `industries/index` ~L990, `services/index` ~L1037 | "Strict NDA ... 100% Data Confidentiality ... 48-Hour Response SLA"; "Strict NDA guaranteed - No junior account managers - Delivered in 48 business hours" | "NDA available on request - Senior-led" |
| `industries/b2b` ~L699 | "Establishing firms as the #1 niche authority." | "Helping firms become the go-to authority in their niche." |
| "48-hour audit" (H2s, buttons, FAQ on `contact/`, `about/`, `services/index`, `tools/index`, `tools/ltv-calculator`, `industries/index`) | "48-Hour Growth Audit", "Claim Your 48-Hour Growth Audit", "Delivered in 48 business hours" | "Growth Audit" / "Request a Growth Audit"; delivery: "Timing is confirmed on your intro call." (A fixed 48h promise cannot be proved.) |
| `privacy/` ~L490 | "Response SLA: Within 48 business hours" | "We aim to respond within 30 days, as required by law." (privacy-request timeline) |
| `tools/index` (~L640-650 and ~L745) | "Zero Gating or Capture - Use our tools completely ungated. We don't force you to give your work email..."; "100% Free & Client-Side"; "0 Data Storage / Gating" | "Free to use, no sign-up needed." "Optional: email yourself a copy of your results. If you do, we store your details and the inputs you used so we can follow up (see our Privacy Policy)." Remove "Client-Side" and "0 Data Storage" wherever they appear on tool pages and in the FAQ. |
| `tools/roas-calculator`, `tools/email-revenue-simulator`, `tools/cro-simulator` | "Validated 2025/2026 enterprise dataset / metrics" | "Indicative ranges for planning. Not guarantees." and add sources, or delete the benchmark tables that cannot be sourced |
| Blog bodies (25 posts) | many unsourced stats, e.g. Podcast "61%", "4x", "53%"; Headless "2x", "25%", "90%"; plus "guarantee" wording | Editorial pass: keep a statistic only if it has a linked source; otherwise rewrite as "often", "can", "many teams report", or delete the number. List each change in `_plan/claims-log.md` (post, before, after, source). **UNTESTED**: I did not source-check each stat. |

**One response-time statement everywhere** (contact, FAQ, privacy, form success message): "We aim to reply within 1 business day." This removes today's contradictions (4 hours vs 4 business hours vs 48 business hours vs 48-hour response).
Add a short footer-level disclaimer on tools: "Results are estimates based on the inputs and assumptions shown. Not financial advice or a guarantee."

## Phase 5. Performance (P0/P1)
Targets (measure with Lighthouse mobile against the local server, then live): Performance >= 90, LCP < 2.5 s, CLS < 0.1, TBT < 200 ms, homepage images <= 1.5 MB, no page above 2 MB. Record before/after in `_plan/perf.md`. **Baseline UNTESTED**: I did not run Lighthouse (hidden browser pane and a local server give unrealistic timings).

5.1 Images (28 MB on home)
- Convert and resize every image still used to WebP (q ~75; AVIF optional), with `sharp` in a script `_plan/images.mjs`. Size to ~2x its displayed size: thumbnails 128-256px wide, cards 800px, hero 1600px. Output next to the original as `name-800.webp`.
- Biggest offenders (homepage unless noted). Verified from the markup: the 6.1 MB `austin-distel-mpN7xjKQ_Ns` JPEG is shown inside a 56x56 icon box (`w-14 h-14`), so it only needs to be ~120px wide. I could not measure the other boxes at runtime because lazy images do not load in the hidden browser pane. `austin-distel-mpN7xjKQ_Ns` 6.1 MB (used twice on home), `austin-distel-744oGeqpxPQ` 5.8 MB, `new-data-services-0tSiofevpUs` 3.3 MB, `igor-miske-Px3iBXV-4TU` 3.0 MB, `blake-connally-B3l0g6HLxr8` 2.6 MB, `1981-digital-bf9sZBcGQl4` 2.2 MB (other pages, not home), two `inoconnect_*_hero.png` 1.7 MB each, `inoconnect_about_clean_hero.png` 1.4 MB (About page, not home), `christopher-gower-m_HRfLhgABo` 1.1 MB, `ferenc-almasi-VPmMy8YA_cU` 0.9 MB. `logo.png` is 359 KB for a 38px logo: replace with a 96px WebP (and SVG if you have one).
- Add `width` and `height` to **all 228 `<img>`** (read from the files) and `loading="lazy" decoding="async"` to everything below the fold; give the hero/LCP image `fetchpriority="high"` and no lazy. 93 images currently have no `loading` attribute.
- Self-host the 31 distinct Unsplash photos hotlinked from `images.unsplash.com` (93 references on 47 pages): download, resize, convert, store in `/images/stock/`, update `src`. Removes a third-party dependency and DNS lookup. Unsplash licence allows this; check each photo is still available before downloading.
- Delete the unreferenced media from the deploy set: 75 of 102 files in `images/`, `assets/`, `videos/` (~102 MB) are not referenced by any page. Re-run the reference scan after the conversion to build the final list; do not delete originals from the repo until the backup exists.

5.2 Video
- `videos/inoconnect-hero-showreel.mp4` is 17.0 MB (36 s). Re-encode to <= 4 MB (720p, H.264 high, CRF ~28, `-movflags +faststart`, audio 96 kbps or none). Keep the poster, set `preload="none"`, keep `controls` and `playsinline`. Add captions/transcript if it has speech (**UNTESTED** whether it has audio).

5.3 Replace the Tailwind CDN (all 53 pages)
- Today every page loads `https://cdn.tailwindcss.com` and an inline `tailwind.config` script (colours `primary #4169E1`, `secondary #44D7A8`, `accent #FF7518`, `heading #696969`). That compiles CSS in the visitor's browser (render-blocking JS, flash of unstyled content, not for production, blocks a strict CSP).
- Build instead: `npm i -D tailwindcss@3.4`; `tailwind.config.js` with the same `theme.extend.colors` and `content: ['./**/*.html','./assets/**/*.js','!./node_modules/**','!./_deploy/**','!./outputs/**']` (the `assets/**/*.js` entry is required: `contact-form.js` and `tool-capture.js` use classes such as `text-red-300` that appear nowhere in the HTML); input file with `@tailwind base; @tailwind components; @tailwind utilities;`; `npx tailwindcss -i _plan/input.css -o assets/site.css --minify`. The arbitrary values like `text-[#44D7A8]` work in the build.
- In all pages remove the CDN `<script>` and the inline `tailwind.config = {...}` block; add `<link rel="stylesheet" href="/assets/site.css?v=YYYYMMDD">`. Keep `_astro/about.Bi_RrpmH.css` where it is loaded (it is referenced by 12 pages).
- Compare with the Phase 0 screenshots. Expected: no visible change. CSS size is an estimate, not measured: expect tens of KB gzipped; if it exceeds 100 KB gzipped, find the cause before shipping.

5.4 Fonts and scripts
- One family is used (Outfit, 7 weights: 300-900). Request only the weights actually used (check the CSS), or self-host the woff2 files and preload the 2 used on the first screen. `display=swap` is already set.
- Analytics: both GTM (`GTM-WQWXHJ3M`) and a direct gtag (`G-4P94TTME1B`) load on each page. Check inside GTM whether GA4 `G-4P94TTME1B` is also configured there; if yes, remove one (double-counted page views). **UNTESTED** (needs GTM access).
- `reveal-on-scroll` starts at `opacity:0` and has **no no-JS fallback** (tested). Add `<noscript><style>.reveal-on-scroll{opacity:1!important;transform:none!important}</style></noscript>` to every page, and respect `prefers-reduced-motion` (no `prefers-reduced-motion` rules exist today; add them for the marquee, reveal and hover-zoom animations).

## Phase 6. Placeholder links and social (P0)
206 `href="#"` anchors (tested; breakdown): footer Twitter x53 and LinkedIn x53 (every page), and on each of the 25 posts four share links: top bar "Share on Twitter" + "Share on LinkedIn", and bottom `share-btn` Twitter-hover + LinkedIn-hover (53x2 + 25x4 = 206). Each post also already has two working **Copy link** buttons (`#copy-link-btn` ~L595 and `#copy-link-mobile` ~L719, wired in the page script ~L903-908). Do not add another.
- **Twitter/X (owner has none):** delete the footer Twitter icon on all 53 pages and every Twitter/X share button on the 25 posts. Also remove the `twitter:*` meta tags only if you want; they are harmless (they control how links preview), so default is **keep** them.
- **LinkedIn (kept):** footer icon on all 53 pages links to `https://www.linkedin.com/company/inoconnect/`: `target="_blank" rel="noopener noreferrer" aria-label="InoConnect on LinkedIn"`. Add the same URL to `sameAs` in the Organization schema. Open the link once to confirm the page is live and public.
- **Blog share buttons (per post):** delete the 2 Twitter links (top bar and bottom `share-btn`). Keep the 2 LinkedIn links and give both `href="https://www.linkedin.com/sharing/share-offsite/?url=<encoded post URL>"`, `target="_blank" rel="noopener noreferrer"`, `aria-label="Share on LinkedIn"`. Keep the two existing Copy link buttons; add an `aria-live` "Link copied" announcement if missing. The bottom bar will then show LinkedIn + Copy link; check it still looks balanced. (If you want an X share link back later it is `https://twitter.com/intent/tweet?url=...`; removed by default since you have no account.)
- Pass rule: zero `href="#"`, zero `twitter.com`/`x.com` links (new check in `verify.mjs`).

## Phase 7. Accessibility, colour, UI consistency (P1)
Contrast failures, measured in a browser on `/` and `/contact/` with my own script (computed colours over actual backgrounds). Brand colours cannot be used for body-size text on light backgrounds:

| Failure measured | Ratio | Fix token (ratios computed) |
|---|---|---|
| `#44D7A8` text on white / light | 1.82 / 1.74 | text on light bg: `#0F766E` (5.47 on white, 5.23 on slate-50). Keep `#44D7A8` only on dark backgrounds (9.8 on slate-900) and for non-text decoration. |
| `#FF7518` text on white / light | 2.69 / 2.57 | text on light bg: `#C2410C` (5.18 on white, 4.95 on slate-50). Orange on slate-900 is fine (6.64). |
| White text on `#44D7A8` button ("Get a Free Marketing Audit") | 1.82 | use `text-slate-900` on green (9.80). |
| White text on `#FF7518` | 2.69 | use `text-slate-900` on orange (6.64) or a `#C2410C` background with white text. |
| `#4169E1` text on dark slate (labels such as "Criterion 01", "Get In Touch") | 3.68-3.87 | `#8DA7F5` (7.63 on slate-900, 8.62 on slate-950) |
| `#4169E1` on light blue tint | 4.26 | `#3152B3` (6.17) |
| Footer © line `slate-500` on `slate-950` | 4.24 | `slate-400` (7.87) |
| Marquee words `slate-300` on white | 1.48 | mark the marquee `aria-hidden="true"` (decorative) or use `slate-600` (7.58) |
| `text-[9px]` labels `slate-500` on dark | 4.07 | `slate-400`, and min size 12px |
| Gradient text (`text-transparent bg-clip-text`) | n/a | give a solid fallback `color` and check the gradient's lightest stop against its background |
| Tinted number badges (orange/green on 10% tints) | 1.64-2.33 | use the dark text tokens above |

Define the tokens once (`tailwind.config.js` `colors`: `secondary-ink #0F766E`, `accent-ink #C2410C`, `primary-soft #8DA7F5`) instead of the 369 hard-coded `text-[#44D7A8]`/`text-[#FF7518]` classes. Review each use: allowed only on dark backgrounds. Strays to remove or map to tokens: `#6e6e73`, `#696969` (this is the `heading` token), `#33b88e`, `#ea580c`, `#d97706`, `#0284c7`, `#7c3aed`, `#db2777`, `#4285f4`, `#0668e1`, `#0a66c2`; keep `#0077b5` only for the LinkedIn hover.

Other accessibility fixes (each verified missing):
- **Skip link**: none exists on any page. Add `<a href="#main" class="sr-only focus:not-sr-only ...">Skip to content</a>` and `id="main"` on `<main>` (all pages).
- **Mobile menu button**: has `aria-label` but **no `aria-expanded`/`aria-controls`**. Add both and toggle in JS.
- **Focus styles**: no `focus-visible` rules found on the homepage. Add a visible outline (>= 3:1) for links, buttons, inputs.
- **Heading order**: every page jumps h2 -> h4 (e.g. "Authenticity", "Growth & AI Services" footer headings). Change the skipped `h4` to `h3`, or add the missing level; keep one H1.
- **Min font size**: 18 uses of `text-[10px]`, 15 of `text-[11px]`, `text-[9px]` on the homepage, plus many `text-xs`. Set a floor of 12px; keep body copy >= 14px.
- **Tools**: `ltv-calculator` has 3 labels and 0 `for` links; the others are linked. Add `for`/`id` on all and `aria-valuetext` on sliders. Put results in an `aria-live="polite"` region.
- Icon colours in the contact block use three different colours for the same kind of icon (orange, green, blue pins/phone). Pick one rule.

## Phase 8. Calculators (tested)
Formulas for ROAS and LTV are correct. Defaults verified: ROAS 3.75x, break-even 1.54x, net ad profit +$28,750, net margin 38.3%, orders 500; LTV $800, lifespan 20.0 months, max CAC $267, elite CAC $160. Email default produces 2,800 clicks, $8,512 broadcast revenue, +$4,682 flows, $13,194 per month, $158,323 per year, $0.09 per email.

Defects to fix:
1. **Static HTML disagrees with the live-computed numbers** (tested by comparing the served HTML with the rendered page):
   - Email simulator: served $343,900 / $18,620 / +$10,040 / $28,660 / $0.29 vs computed $158,323 / $8,512 / +$4,682 / $13,194 / $0.09. 5 of 6 outputs differ. Crawlers and no-JS users see numbers that are 2x too high.
   - ROAS: Max CAC served `$97.50` vs computed `$98`.
   - CRO: ad savings served `$33,300 / mo` vs computed `$34,722 / mo`.
   - LTV: matches.
   Fix: regenerate the static defaults from the JS (run the same function in Node and write the values into the HTML), or render "-" until JS runs. Add a test that compares static vs computed.
2. **Hidden assumptions not shown**: email simulator hard-codes 3.2% on-site conversion and a +55% flow uplift (the uplift is footnoted; the 3.2% is not); CRO hard-codes a $1.25 CPC for "ad savings"; LTV uses fixed 3:1 and 5:1 ratios (those are labelled). Show every assumption beside the result and make the CPC/conversion editable.
3. The email page also says "Flow RPR = Broadcast RPR x 3.2x to 5.0x" while the calculator applies +55%. Make the explanation match the maths.
4. CRO silently moves the "new CVR" slider when it is <= base CVR (forces base + 0.5 points). Instead cap the slider's `min` dynamically and show a message.
5. Add the disclaimer line from Phase 4 and remove "Validated 2025/2026" wording.
6. Test each tool at 360px and by keyboard (sliders must be operable with arrow keys).
### 8.2 Keep a copy of tool data (new, per owner)
Design: **optional, consent-based, not a gate.** The calculators keep working with no sign-up. Under the result panel add a short form: Email (required), Name and Company (optional), a required checkbox ("Email me a copy of this result and keep my details and inputs so you can answer questions about it. See the Privacy Policy.") and a **separate, unchecked, optional** checkbox ("Also contact me about InoConnect services"), the Turnstile widget, a honeypot, and the button **"Email me this result"**. The optional box is sent as `followup` and stored in the `Follow-up consent` column; nothing may be used for marketing unless it is `yes`.
- New `assets/tool-capture.js` (included only on the four tool pages) posts `{form:'tool', tool, name, email, company, inputs, result, page, consent, followup, turnstile, company_fax}` as `text/plain` JSON to the same endpoint as the contact form (`saveTool` in 3.3). `tool` is one of `roas`, `ltv`, `email`, `cro`. `inputs` is a JSON string keyed by the slider ids the server allow-lists (e.g. `{"spend-range":20000}`); `result` must match the strict format for that tool (`3.75x`, `$800`, `$158,323`, `+$34,722`). The server rejects anything else. Show the same three outcomes as the contact form: `saved && emailed` -> "Saved. A copy is on its way to your inbox (check spam)."; `saved && !emailed` -> "Saved. We could not send the email copy right now; we will follow up."; error -> failure message. Never claim an email was sent when `emailed` is false.
- Never send the email or any field to GA/GTM. The only analytics event is `dataLayer.push({event:'tool_result_saved', tool:'<name>'})`.
- **Owner decision: the visitor also gets an email copy.** `saveTool` (Phase 3.3) sends it. If the mail quota is low (`MailApp.getRemainingDailyQuota()` <= 20) the row is saved, no email is sent, and the page says so honestly (see above). Sender is the owner's Google account (display name "InoConnect"); Reply-To is `info@inoconnect.com`.
- Email-specific risks: (a) the form can be used to send mail to any address, so the guards in `saveTool` (consent, allow-listed tool and input ids, strict result format, sanitised first name, fixed template, atomic 2-minute per-email limit, quota reserve via `getRemainingDailyQuota`, honeypot, server-verified Turnstile, 3 s minimum fill time in `tool-capture.js`) are required, not optional. Without the whitelisting, an attacker could put their own text and links into an email sent from your account to any victim; (b) mail from a free Gmail address is more likely to land in spam, so test delivery to Gmail, Outlook and one UK/EU address; if deliverability is poor, send from a Workspace account or a transactional service later; (c) the email must carry the privacy/unsubscribe line shown above; do not use these addresses for newsletters without separate consent.
- Tests: valid submit -> row in `ToolLeads` with the inputs and an email arrives at the test address with the right numbers; no consent -> blocked; duplicate within 2 min -> rejected; keyboard and screen-reader pass; no personal data in the network call to Google Analytics (check DevTools Network).
- Disclosure: privacy page names the tool fields; the tool pages carry a one-line notice near the form. Retention: pick a period (suggest 24 months) and delete older rows; document it.
- If the owner later chooses forced gating or automatic logging, state it in the privacy policy and the button text, and expect fewer people to use the tools.

## Phase 9. SEO, schema, content hygiene, server (P1)
**Titles**: 10 titles are 61-62 chars: `blog/authority-assets-strategy`, `design-systems-scale`, `headless-cms-roi`, `healthcare-patient-acquisition`, `local-seo-domination`, `pricing-page-psychology`, `professional-services-authority`, `programmatic-seo-saas`, `retargeting-omnipresence`, `zero-click-content`. These are advisory: Google has no fixed title-length limit and truncates by display width. Trim only if a title reads poorly when cut at ~60 characters; the checker does not fail them. Descriptions are all fine (70-160). Titles are unique, canonicals match, one H1 per page.

**Structured data** (51 of 53 pages have none; only `/` and `/contact/` do):
- `Organization` + `WebSite` on every page via the shared header (one `@id`), email `info@inoconnect.com`, `foundingDate` `2021` (owner-confirmed), `areaServed`, `sameAs` = `["https://www.linkedin.com/company/inoconnect/"]` only. Address: `streetAddress`, `addressLocality`, `addressRegion`/`addressCountry`, **no postal code**.
- `BlogPosting` + `BreadcrumbList` on the 25 posts: `headline`, `datePublished` (the date in the weekly table, with a timezone, e.g. `2026-01-05T09:00:00+00:00`) and `dateModified` (2026-11-03), `author`, `publisher`, `image`, `mainEntityOfPage`.
- `Service` on the 8 service pages, `BreadcrumbList` on service/industry/tool pages, `FAQPage` where an FAQ exists on the page (contact, industries).
- Validate with Google's Rich Results Test after deploy (**UNTESTED**).

**Blog dates (owner choice: one post per week from January 2026).** All 25 posts currently say 2024-04-10 in the `<time datetime>` and as visible text "April 10, 2024" (the blog index shows no dates). Set `<time datetime>` and the visible date to the values below (the owner's editorial choice). **Structured data:** the owner has confirmed these are the real first-publication dates (`_plan/dates-real.flag` exists), so JSON-LD `datePublished` equals the visible date and `<time datetime>` for every post; `dateModified` is 2026-11-03. Keep the flag file; if the dates ever change, change all three places together.

| Post slug | Date |
|---|---|
| technical-seo-audit | 2026-01-05 |
| programmatic-seo-saas | 2026-01-12 |
| local-seo-domination | 2026-01-19 |
| link-velocity-strategy | 2026-01-26 |
| schema-markup-guide | 2026-02-02 |
| google-ads-quality-score | 2026-02-09 |
| linkedin-abm-targeting | 2026-02-16 |
| meta-ads-scaling | 2026-02-23 |
| retargeting-omnipresence | 2026-03-02 |
| pinterest-ads-strategy | 2026-03-09 |
| authority-assets-strategy | 2026-03-16 |
| zero-click-content | 2026-03-23 |
| video-marketing-hybrid | 2026-03-30 |
| podcast-networking-strategy | 2026-04-06 |
| linkedin-thought-leadership | 2026-04-13 |
| headless-cms-roi | 2026-04-20 |
| core-web-vitals-revenue | 2026-04-27 |
| design-systems-scale | 2026-05-04 |
| pricing-page-psychology | 2026-05-11 |
| accessibility-growth-lever | 2026-05-18 |
| saas-churn-reduction | 2026-05-25 |
| b2b-enterprise-abm | 2026-06-01 |
| d2c-ecommerce-funnels | 2026-06-08 |
| healthcare-patient-acquisition | 2026-06-15 |
| professional-services-authority | 2026-06-22 |

All dates are Mondays; 25 weekly posts end on 22 June 2026. Format on the page: "January 5, 2026". These are owner-assigned publication dates, not recovered history, so do not add claims like "first published" elsewhere. Authors: no author names exist on any post; use "InoConnect Team" unless the owner names a person.

**Add**: `404.html`, `site.webmanifest`, `apple-touch-icon.png` (180px), `<meta name="theme-color">`. The OG image is one shared file (`inoconnect_seo_matrix.png`); optional per-section OG images. `hreflang="en"`/`x-default` is optional (single English site targeting US/UK).

**Sitemap**: already matches the 53 pages; set `lastmod` for each blog post to its `dateModified` (2026-11-03) and for other pages to the real edit date.

**Server (`.htaccess` on Hostinger; UNTESTED: whether this Hostinger plan's web server accepts every directive. A wrong line causes a 500 error, so keep the previous file handy and run `curl -I` immediately after upload)** create `_deploy/.htaccess`:
```apache
RewriteEngine On
# one canonical host + https
RewriteCond %{HTTPS} off [OR]
RewriteCond %{HTTP_HOST} ^www\. [NC]
RewriteRule ^ https://inoconnect.com%{REQUEST_URI} [R=301,L]
# the 4 stale deploy folders still on the server (204 URLs in the live sitemap)
RewriteRule ^InoConnect_Hostinger_Deploy_[0-9_]+/(.*)$ /$1 [R=301,L]
ErrorDocument 404 /404.html

<IfModule mod_headers.c>
  # raise max-age to 31536000 after a week of clean HTTPS (comments must be on their own line in .htaccess)
  Header always set Strict-Transport-Security "max-age=86400"
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()"
  Header always set X-Frame-Options "SAMEORIGIN"
  # start CSP in report-only; GTM and inline scripts need allowances
  Header always set Content-Security-Policy-Report-Only "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com; img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://script.google.com https://script.googleusercontent.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com; frame-src https://www.googletagmanager.com https://challenges.cloudflare.com; frame-ancestors 'self'"
</IfModule>
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml
</IfModule>
```
If the dashboard also lets you delete the four `InoConnect_Hostinger_Deploy_*` folders in `public_html`, do both (delete, plus the redirect). Then submit the new sitemap in Search Console and request removal of the stale URLs. The live 404 count (94) cannot be mapped without the URL list in Search Console.

**Legal pages** (`privacy/`, `terms/`; "Last updated: January 15, 2026"): the privacy work is done in **3.0, before collection goes live**; this section only lists what remains.
- Terms: governing law (Delaware) vs offices in Texas/UK; entity "InoConnect Digital LLC": confirm with a lawyer. Do not edit legal text beyond factual consistency without review.
- **Cookies and analytics (corrected):** "UK/EU visitors always need a consent banner" is too simple. UK law (PECR as amended by the Data (Use and Access) Act) now has a narrow exception for storage/access used only for statistical purposes to improve the site, provided users can object; the ICO is revising its guidance. Marketing/advertising tags and any tag also used for other purposes still need consent. Decide what GTM/GA4 actually do (advertising features, Signals, remarketing) and get advice. **UNTESTED against your GTM container.**
- **Consent Mode is not a banner.** Google says you still need a banner or consent platform to collect the choice. In *advanced* mode, tags still load and send cookieless pings while consent is denied; *basic* mode blocks tags until consent. Pick basic or advanced deliberately and describe it in the privacy policy.

## Phase 10. Build and deploy
1. Build `_deploy/`: copy only needed files (HTML, `assets/site.css`, `assets/contact-form.js`, `assets/tool-capture.js`, optimised images/video, `_astro/about.*.css`, `robots.txt`, `sitemap.xml`, `favicon.svg`, `logo` files, `.htaccess`, `404.html`, manifest). Use the Phase 0 exclusion list. Deploy size is an estimate (not measured): expect a small fraction of today's 158 MB once unused media is excluded and images are converted.
2. Run `node _plan/verify.mjs` (all checks) and the mobile sweep; run Lighthouse on `/`, `/contact/`, `/blog/headless-cms-roi/`, `/tools/roas-calculator/`.
3. **Before touching the server:** take a Hostinger-side backup (hPanel -> Backups, or download `public_html` as a zip) and keep it. Run `node _plan/redirect-check.mjs` (it compares every URL in the live sitemap, including the four old deploy folders, with the new page set and fails if any has no destination; today it reports 0 missing). Upload the new files first, test, and only then delete the stale folders.
4. Upload to Hostinger, then re-test on the **live** domain with `curl -I https://inoconnect.com/` (headers), `curl https://inoconnect.com/sitemap.xml | grep -c '<loc>'` (must be 53), the Headless CMS H1, the contact form end-to-end (Phase 3.7), and the address text (no postal code).
5. Search Console: submit `sitemap.xml`; request indexing for `/`, `/contact/`, `/services/`.

## Acceptance checklist (all must be true)
- [ ] `node _plan/verify.mjs` -> all checks PASS (the script now has 30 checks; confirm with the last line of its output).
- [ ] No ZIP or postcode in any file in the folder or on the live site; JSON-LD has no `postalCode`.
- [ ] 28 pages fixed; no overflow at 360/390/414 on any of the 53 pages.
- [ ] Form sends to Sheet + email end to end (13 tests in 3.7) and tells the truth.
- [ ] All claims in Phase 4 softened; `_plan/claims-log.md` lists every change and every blog statistic kept with its source.
- [ ] Zero `href="#"`; zero Tailwind CDN; zero Unsplash hotlinks; all images have width/height.
- [ ] Contrast: re-run the in-browser contrast script on 8 pages; no failing text except documented decorative items.
- [ ] Calculators: static HTML equals computed defaults; assumptions visible; disclaimer present.
- [ ] Lighthouse mobile >= 90 on the 4 test pages; homepage images <= 1.5 MB.
- [ ] Live: headers present, sitemap = 53 URLs, stale folders gone/redirected, H1s match local.

## Review log (second pass, 3 Nov 2026): mistakes I found in my own plan and fixed
1. **Apps Script syntax error:** the visitor-email `.join('\n')` had a literal line break inside the string, which would not run. Fixed, and the function rewritten.
2. **Apps Script regex:** `split(/s+/)` had lost its backslash. Fixed.
3. **Spam-relay hole:** the first version of the visitor email echoed client-supplied text (tool name, inputs, result), so a bad actor could send their own message and links from your Google account to any address. Now: whitelisted tool slugs, numbers-only inputs, sanitised result and first name.
4. **`.htaccess` error:** an inline `# comment` after a `Header` directive is invalid in Apache config and would have caused a 500 error. Moved to its own line.
5. **Tailwind build would have dropped classes** used only in the new JS files (`text-red-300` etc.). Added `./assets/**/*.js` to `content`.
6. **Blog share buttons:** I said "add a Copy link button" and "two unlabeled buttons". Wrong: each post already has two working Copy link buttons, and the four share links are Twitter + LinkedIn at the top and again at the bottom. Phase 6 rewritten.
7. **Missed claims:** "HIPAA-compliant"/"HIPAA compliance" (nav on all 53 pages, metas, industries), "verified ROI", "Full GDPR compliance", "100% CAPI", "Proven growth", and contract-style ownership statements. Added to Phase 4 and to the checker.
8. **Outfit has 7 weights, not 9.** The "tested: a 6 MB JPEG in a 64x64 box" statement was not measured at runtime; corrected to the verified 56x56 icon box. Two offenders listed as homepage images are on other pages.
9. **Stale text:** a leftover "Ino Connect" bullet, "blockers" headings, an outdated comment saying tool emails go only to the Sheet, and a missing `tool-capture.js` in the deploy list.
10. **Unsupported estimate removed:** "CSS well under 100 KB gzipped" was a guess; now labelled as such.
11. **Checker bugs fixed in `_plan/verify.mjs`:** the "Client-Side" check was case-insensitive and falsely flagged "client-side A/B testing" on the CRO page; `.manus` was excluded from the postal-code scan although the rule is "everywhere"; the mobile-menu `aria-expanded` check depended on attribute order.
12. **Overstated precision:** the tap-target count came from a hidden-iframe sweep and is now labelled approximate; the deploy-size figure is labelled an estimate.
13. **Re-verified and unchanged:** 53 of 53 pages skip a heading level; 206 `href="#"` = 53x2 + 25x4; 28 pages with `grid-cols-3`; 5 `growth@` occurrences on the contact page; 12 pages load `_astro/about.*.css`; no `focus-visible` or `prefers-reduced-motion` anywhere; the three code blocks pass `node --check`.

### Third pass: an outside review (ChatGPT), each point checked
| Point | Verdict | What I did |
|---|---|---|
| 1. Blog dates are invented; `datePublished` means first published | **Resolved by the owner: dates confirmed real** (see D1). Original assessment: **valid in substance.** Confirmed Google's definition. Google's page does not say markup must match visible text, so it is not a Google rule violation, but the schedule is not publication history. Live `Last-Modified` is 19 May 2026 (deploy time), so real dates are unknown. | Kept your visible schedule (your call), removed it from JSON-LD `datePublished` unless you confirm (flag file); added decision D1. |
| 2. `no-cors` fallback gives false success; `doPost` cannot be run from the editor; "Anyone" is ambiguous | **Valid, all three.** Google documents the redirect and says nothing about CORS. `ANYONE` vs `ANYONE_ANONYMOUS` confirmed. | Removed the fallback (test 10 is a hard gate; hosted-form fallback instead); added `authorize()`; spelled out the anonymous setting. |
| 3. Duplicate check outside the lock; UTC-midnight cap; `result` not validated; no bot check; no honest status | **Valid, all.** Quota is "24 hours after first request" and `getRemainingDailyQuota()` exists. | Atomic check inside the lock; quota via `getRemainingDailyQuota` with a reserve; per-tool strict result regex and allow-listed inputs; server-verified Turnstile; reply `{ok,saved,emailed}` and honest messages. Not recomputing results server-side (explained in 3.3). |
| 4. Privacy decisions must precede collection; separate follow-up from inquiry; cookie statement too absolute | **Valid.** ICO exception for statistical purposes confirmed via search (conditions apply, guidance under revision). Consent Mode is not a banner and advanced mode sends cookieless pings: confirmed. | New gate 3.0 before the forms; separate optional follow-up checkbox and column; corrected cookie/consent text. |
| 5. Confirm addresses are real and publishable | **Valid.** Provenance is "source notes"; the live site shows no street address. | Added D2 and an address gate in Phase 1. |
| 6. Reusing port 8765; Hostinger backup; verify redirect destinations | **Valid advice; its port claim I cannot reproduce** (here 8765 served InoConnect because I started it), but reusing an unknown server is still unsafe. All 204 old URLs do have a destination (tested). | Free port plus a title check; Hostinger backup; `_plan/redirect-check.mjs`. |
| Podcast overflow "no page-level overflow" uncertain | **Fair.** Re-measured twice here: 390px. You and the reviewer measured 392px, so it is rendering-dependent. | Rewrote the correction (card overflow 124px in 103px is reproducible). |
| Do not hard-fail titles over 60 | **Valid.** Google sets no limit; truncation is by width. | Checker fails only >70 or <15 characters; plan says advisory. |
| "No blockers remain" overstates readiness | **Valid.** | Reworded; added "Unverified before launch". |
| Not checked: LinkedIn availability | `curl` returned HTTP 200 but LinkedIn gives bots a 200 sign-in page, so that proves nothing. | Left as an owner check. |

## Known limits of my testing
Not done: a real Lighthouse/CrUX run; a human visual review of every page; testing all 53 pages at 390px by script with a visible browser (a hidden iframe sweep was unreliable, so I measured 2 pages precisely and verified the cause statically for all 28); source-checking each blog statistic; GTM/GA configuration; Google Search Console data; legal sufficiency; whether the Hostinger plan honours every `.htaccess` directive; axe-core (blocked by the environment, so I used my own contrast and label scripts instead); executing any of the new code (Apps Script, form JS, `.htaccess`, Tailwind build, image pipeline).
