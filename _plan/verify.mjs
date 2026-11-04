// Run: node _plan/verify.mjs   (from D:\ino website). Exit code 1 if any check fails.
// Not for deployment. Postal-code tokens are built from parts so this file never contains them.
import fs from 'fs';
import path from 'path';
const root = process.cwd();
const SKIP = new Set(['node_modules', '.git', '_plan', '__pycache__', '_deploy']);
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!SKIP.has(e.name)) walk(path.join(d, e.name)); }
    else files.push(path.join(d, e.name));
  }
})(root);
const rel = f => path.relative(root, f).replace(/\\/g, '/');
const isText = f => /\.(html|md|xml|json|js|mjs|css|txt|py|svg|webmanifest)$/i.test(f) || path.basename(f) === '.htaccess';
const pages = files.filter(f => f.endsWith('index.html') && !rel(f).startsWith('outputs/'));
const read = f => fs.readFileSync(f, 'utf8');
const results = [];
const check = (name, bad, note = '') => { results.push([bad.length === 0, name, bad.length, bad.slice(0, 5), note]); };

// 1 postal codes: nowhere, any text file (docs and outputs included)
const ZIP = ['7740' + '1', 'B' + 'R6 ' + '6LE', 'BR' + '6'];
check('No US ZIP / UK postcode in any text file', files.filter(isText).filter(f => { const t = read(f); return ZIP.some(z => t.includes(z)); }).map(rel));
check('No postalCode key in any JSON-LD or HTML', pages.filter(f => /postalCode/i.test(read(f))).map(rel));

// 2 soft-claim phrases that must be gone (site pages only)
const CLAIMS = [/98\.4%/, /\$420M/, /\b4\.2x\b/, /100% Empirical/i, /Zero Gating/i, /Data Storage [/] Gating/i, /HIPAA[- ]compliant/i, /HIPAA compliance/i, /verified ROI/i, /Full GDPR compliance/i, /100% CAPI/, /Proven growth for/, /SOC 2/i, /HIPAA BAA/i, /bank-grade/i, /max 4 client/i, /4-Hour Response Guarantee/i, /Guaranteed (Executive|senior)/i, /zero cost/i, /0% Fluff/i, /100% Math/i, /Market Leader/i, /predictable revenue/i, /48-Hour/i, /48 business hours/i, /Zero PHI/i, /non-compete exclusivity/i, /#1 niche/i, /Validated 2025\/2026/i, /validated 2025\/2026/i, /No junior account managers/i, /Strict NDA guaranteed/i];
const claimHits = [];
for (const f of pages) { const t = read(f); for (const re of CLAIMS) if (re.test(t)) claimHits.push(rel(f) + ' :: ' + re); }
check('No hard claims left (see plan Phase 4)', claimHits);

// 3 links / scripts / hotlinks
check('No href="#" placeholders', pages.filter(f => /<a\b[^>]*href=["']#["']/.test(read(f))).map(rel));
check('No Tailwind CDN script', pages.filter(f => /cdn\.tailwindcss\.com/.test(read(f))).map(rel));
check('No hotlinked Unsplash images', pages.filter(f => /images\.unsplash\.com/.test(read(f))).map(rel));

// 4 mobile: unprefixed grid-cols-3 / grid-cols-4
check('No unprefixed grid-cols-3 (mobile overflow)', pages.filter(f => [...read(f).matchAll(/class="([^"]*)"/g)].some(m => m[1].split(/\s+/).some(c => /^grid-cols-3$/.test(c)))).map(rel));

// 5 images: dims, alt
let noDim = [], noAlt = [];
for (const f of pages) for (const m of read(f).matchAll(/<img\b[^>]*>/g)) { if (!/\swidth=/.test(m[0]) || !/\sheight=/.test(m[0])) noDim.push(rel(f)); if (!/\salt=/.test(m[0])) noAlt.push(rel(f)); }
check('Every <img> has width+height', [...new Set(noDim)]);
check('Every <img> has alt', [...new Set(noAlt)]);

// 6 forms
const formBad = [];
for (const f of pages) for (const fm of read(f).matchAll(/<form\b[\s\S]*?<\/form>/g)) {
  const ctrls = [...fm[0].matchAll(/<(input|select|textarea)\b[^>]*>/g)].map(m => m[0]).filter(c => !/type=["'](hidden|submit)["']/.test(c));
  for (const c of ctrls) { if (!/\sname=/.test(c)) formBad.push(rel(f) + ' no name'); const id = (c.match(/\sid=["']([^"']+)/) || [])[1]; if (!id || !new RegExp('<label[^>]*for=["\']' + id + '["\']').test(fm[0])) formBad.push(rel(f) + ' no label[for]: ' + c.slice(0, 40)); }
  if (/preventDefault\(\);\s*alert/.test(fm[0])) formBad.push(rel(f) + ' fake alert submit');
}
check('Forms: name + label[for], no fake alert', formBad);
const toolLabelBad = pages.filter(f => rel(f).startsWith('tools/')).filter(f => { const t = read(f); const ranges = [...t.matchAll(/<input[^>]*type="range"[^>]*id="([^"]+)"/g)].map(m => m[1]); return ranges.some(id => !new RegExp('<label[^>]*for="' + id + '"').test(t) && !new RegExp('id="' + id + '"[^>]*aria-label').test(t)); }).map(rel);
check('Tool sliders each have label[for] or aria-label', toolLabelBad);

// 7 SEO
const seoBad = [];
for (const f of pages) {
  const t = read(f); const r = rel(f);
  const title = (t.match(/<title[^>]*>([\s\S]*?)<\/title>/) || [])[1]?.replace(/&amp;/g, '&').trim() || '';
  const desc = (t.match(/<meta\b[^>]*name=["']description["'][^>]*>/) || [''])[0].match(/content=(?:"([^"]*)"|'([^']*)')/)?.[1] || '';
  if (title.length < 15 || title.length > 70) seoBad.push(r + ' title ' + title.length); // 61-70 is advisory only: Google sets no title-length limit
  if (desc.length < 70 || desc.length > 160) seoBad.push(r + ' desc ' + desc.length);
  if ((t.match(/<h1[\s>]/g) || []).length !== 1) seoBad.push(r + ' h1 count');
  const hs = [...t.matchAll(/<h([1-6])[\s>]/g)].map(m => +m[1]); for (let i = 1; i < hs.length; i++) if (hs[i] - hs[i - 1] > 1) { seoBad.push(r + ' heading skip h' + hs[i - 1] + '>h' + hs[i]); break; }
  for (const m of t.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) { try { JSON.parse(m[1]); } catch { seoBad.push(r + ' invalid JSON-LD'); } }
  if (r.startsWith('blog/') && r !== 'blog/index.html' && !/BlogPosting/.test(t)) seoBad.push(r + ' no BlogPosting');
  if (!/"Organization"|"ProfessionalService"/.test(t)) seoBad.push(r + ' no Organization schema');
}
check('SEO: title 15-70, desc 70-160, 1 H1, no heading skips, valid schema', seoBad);
const dates = pages.filter(f => rel(f).startsWith('blog/') && rel(f) !== 'blog/index.html').map(f => (read(f).match(/datetime="([0-9-]+)"/) || [])[1]);
check('Blog dates are not all identical', new Set(dates).size <= 1 ? ['all ' + dates[0]] : []);

// 8 sitemap parity
const sm = read(path.join(root, 'sitemap.xml'));
const locs = [...sm.matchAll(/<loc>https:\/\/inoconnect\.com([^<]*)/g)].map(m => m[1]);
const routes = pages.map(f => '/' + rel(f).replace(/index\.html$/, ''));
check('Sitemap == page set', [...routes.filter(r => !locs.includes(r)).map(r => 'missing ' + r), ...locs.filter(l => !routes.includes(l)).map(l => 'extra ' + l)]);

// 9 a11y tokens
check('No text-[9px|10px|11px]', pages.filter(f => /text-\[(9|10|11)px\]/.test(read(f))).map(rel));
check('Light-bg accent text (text-[#44D7A8]/[#FF7518]) reviewed: count only', [], 'info: ' + pages.reduce((a, f) => a + (read(f).match(/text-\[#(44D7A8|FF7518)\]/gi) || []).length, 0) + ' uses (allowed on dark bg only)');
check('Skip link present', pages.filter(f => !/href="#main"|href="#content"/.test(read(f))).map(rel));
check('reveal-on-scroll has noscript fallback', pages.filter(f => /reveal-on-scroll/.test(read(f)) && !/<noscript><style>[^<]*reveal-on-scroll/.test(read(f))).map(rel));
check('Mobile menu toggle has aria-expanded', pages.filter(f => !/<button\b[^>]*id="mobile-menu-toggle"[^>]*>/.test(read(f)) || !/aria-expanded/.test((read(f).match(/<button\b[^>]*id="mobile-menu-toggle"[^>]*>/)||[""])[0])).map(rel));

// 10 consistency
const mails = new Set(pages.flatMap(f => [...read(f).matchAll(/[a-z]+@inoconnect\.com/g)].map(m => m[0])));
check('Only approved mailboxes (info@, privacy@, legal@); growth@ retired', [...mails].filter(m => !['info@inoconnect.com', 'privacy@inoconnect.com', 'legal@inoconnect.com'].includes(m)));
check('Brand spelled "InoConnect" (not "Ino Connect") in visible text', pages.filter(f => />\s*Ino Connect\s*</.test(read(f))).map(rel));


// 12 owner decisions (2026-11-03)
check('No Twitter/X links or share buttons', pages.filter(f => /(twitter\.com|x\.com)\/(intent|share|inoconnect)|aria-label="Twitter"|title="Share on Twitter"/i.test(read(f))).map(rel));
check('LinkedIn footer link is a real URL (no LINKEDIN_URL placeholder, no #)', pages.filter(f => { const t = read(f); return /LINKEDIN_URL/.test(t) || !/href="https:\/\/(www\.)?linkedin\.com\/company\/inoconnect\/?"/.test(t); }).map(rel));
check('EST. 2021 kept on About', /EST\. 2021/.test(read(path.join(root, 'about/index.html'))) ? [] : ['about/index.html']);
const EXPECT = { 'technical-seo-audit': '2026-01-05', 'programmatic-seo-saas': '2026-01-12', 'local-seo-domination': '2026-01-19', 'link-velocity-strategy': '2026-01-26', 'schema-markup-guide': '2026-02-02', 'google-ads-quality-score': '2026-02-09', 'linkedin-abm-targeting': '2026-02-16', 'meta-ads-scaling': '2026-02-23', 'retargeting-omnipresence': '2026-03-02', 'pinterest-ads-strategy': '2026-03-09', 'authority-assets-strategy': '2026-03-16', 'zero-click-content': '2026-03-23', 'video-marketing-hybrid': '2026-03-30', 'podcast-networking-strategy': '2026-04-06', 'linkedin-thought-leadership': '2026-04-13', 'headless-cms-roi': '2026-04-20', 'core-web-vitals-revenue': '2026-04-27', 'design-systems-scale': '2026-05-04', 'pricing-page-psychology': '2026-05-11', 'accessibility-growth-lever': '2026-05-18', 'saas-churn-reduction': '2026-05-25', 'b2b-enterprise-abm': '2026-06-01', 'd2c-ecommerce-funnels': '2026-06-08', 'healthcare-patient-acquisition': '2026-06-15', 'professional-services-authority': '2026-06-22' };
const MONTHS = ['January','February','March','April','May','June'];
const dateBad = [];
for (const [slug, d] of Object.entries(EXPECT)) {
  const f = path.join(root, 'blog', slug, 'index.html'); if (!fs.existsSync(f)) { dateBad.push(slug + ' missing'); continue; }
  const t = read(f); const [y, m, dd] = d.split('-');
  if (!t.includes('datetime="' + d + '"')) dateBad.push(slug + ' datetime');
  if (!t.includes(MONTHS[+m - 1] + ' ' + (+dd) + ', ' + y)) dateBad.push(slug + ' visible date');
  if (/2024-04-10|April 10, 2024/.test(t)) dateBad.push(slug + ' old date left');
}
check('Blog dates match the weekly table (datetime + visible)', dateBad);
check('Old tool-leads.js removed; tool-capture.js on all 4 tools', [...(fs.existsSync(path.join(root, 'assets/tool-leads.js')) ? ['tool-leads.js still exists'] : []), ...pages.filter(f => /^tools\/[a-z-]+\/index\.html$/.test(rel(f)) && !/tool-capture\.js/.test(read(f))).map(rel)]);
check('Tools pages: no Client-Side / zero-capture claims', pages.filter(f => rel(f).startsWith('tools/') && /Free &amp; Client-Side|Zero Gating|Data Storage [/] Gating/.test(read(f))).map(rel));
check('Contact form posts to Apps Script (contact-form.js present, endpoint set)', (() => { const p = path.join(root, 'assets/contact-form.js'); if (!fs.existsSync(p)) return ['assets/contact-form.js missing']; const t = read(p); return /PASTE_APPS_SCRIPT/.test(t) || !/script\.google\.com\/macros\/s\//.test(t) ? ['ENDPOINT not set'] : []; })());


// 13 review-3 rules

const EXP2 = { 'technical-seo-audit':'2026-01-05','programmatic-seo-saas':'2026-01-12','local-seo-domination':'2026-01-19','link-velocity-strategy':'2026-01-26','schema-markup-guide':'2026-02-02','google-ads-quality-score':'2026-02-09','linkedin-abm-targeting':'2026-02-16','meta-ads-scaling':'2026-02-23','retargeting-omnipresence':'2026-03-02','pinterest-ads-strategy':'2026-03-09','authority-assets-strategy':'2026-03-16','zero-click-content':'2026-03-23','video-marketing-hybrid':'2026-03-30','podcast-networking-strategy':'2026-04-06','linkedin-thought-leadership':'2026-04-13','headless-cms-roi':'2026-04-20','core-web-vitals-revenue':'2026-04-27','design-systems-scale':'2026-05-04','pricing-page-psychology':'2026-05-11','accessibility-growth-lever':'2026-05-18','saas-churn-reduction':'2026-05-25','b2b-enterprise-abm':'2026-06-01','d2c-ecommerce-funnels':'2026-06-08','healthcare-patient-acquisition':'2026-06-15','professional-services-authority':'2026-06-22' };
check('BlogPosting datePublished equals the confirmed date (flag file present)', !fs.existsSync(path.join(root, '_plan/dates-real.flag')) ? [] : Object.entries(EXP2).filter(([s, d]) => { const fp = path.join(root, 'blog', s, 'index.html'); if (!fs.existsSync(fp)) return true; return !new RegExp('"datePublished"\s*:\s*"' + d).test(read(fp)); }).map(([s]) => s));
check('No no-cors fetch in assets/*.js (it hides failures)', files.filter(f => /assets[\/].*.js$/.test(f)).filter(f => /no-cors/.test(read(f))).map(rel));

// 11 repo hygiene (deploy folder only)
const dep = path.join(root, '_deploy');
if (fs.existsSync(dep)) { const bad = []; (function w(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) w(p); else if (/\.(md|py|json)$/.test(e.name) && e.name !== 'site.webmanifest') bad.push(path.relative(dep, p)); } })(dep); check('_deploy has no md/py/json junk', bad); }

let fail = 0;
for (const [ok, name, n, ex, note] of results) { if (!ok) fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name + (ok ? '' : ` [${n}] e.g. ${ex.join(' | ')}`) + (note ? ' ' + note : '')); }
console.log(`\n${results.length - fail}/${results.length} checks passed`);
process.exit(fail ? 1 : 0);
