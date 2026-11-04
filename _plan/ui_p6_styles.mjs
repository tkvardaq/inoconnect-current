// Phase 6: de-fork inline <style> blocks. Delete rules now owned by input.css, migrate identical
// class/id-only page rules shared by >=2 pages into input.css (one copy), drop empty blocks.
// Usage: node ui_p6_styles.mjs [--dry]
import fs from 'fs'; import { pages, rel } from './ui_pages.mjs';
const DRY = process.argv.includes('--dry');
const INPUT = 'D:/ino website/_plan/input.css';
const MARK = '/* ── Migrated page-template rules (ui_p6) ── */';

// ---------- tiny CSS splitter ----------
function split(css) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const out = []; let i = 0; const n = css.length;
  while (i < n) {
    while (i < n && /\s/.test(css[i])) i++;
    if (i >= n) break;
    let j = i, depth = 0, q = null, bodyStart = -1;
    for (; j < n; j++) {
      const ch = css[j];
      if (q) { if (ch === q) q = null; continue; }
      if (ch === '"' || ch === "'") { q = ch; continue; }
      if (ch === '{') { if (depth === 0) bodyStart = j; depth++; }
      else if (ch === '}') { depth--; if (depth === 0) { j++; break; } }
      else if (ch === ';' && depth === 0) { j++; break; }
    }
    const text = css.slice(i, j).trim(); i = j;
    if (!text) continue;
    if (bodyStart < 0) { out.push({ prelude: text.replace(/;$/, '').trim(), stmt: true }); continue; }
    const rel0 = text.indexOf('{');
    out.push({ prelude: text.slice(0, rel0).trim(), body: text.slice(rel0 + 1, text.lastIndexOf('}')) });
  }
  return out;
}
const ws = s => s.replace(/\s+/g, ' ').trim();
const cz = s => s.replace(/,\s+/g, ',');
const selList = p => p.split(',').map(ws).filter(Boolean);

// ---------- what input.css now owns ----------
const OWNED = [
  /^:root$/, /^\*$/, /^h[1-6]$/, /^\.font-heading$/,
  /^\.reveal-on-scroll(\.revealed)?$/, /^\.revealed$/, /^#main-logo$/, /^\.mega-circle$/, /^\.mega-menu$/,
  /^\.group:hover \.mega-menu$/, /^\.mega-item(:hover)?$/, /^\.nav-link(:hover|\.active)?$/, /^\.category-link(:hover|\.active)?$/,
  /^\.article-body\b/, /^\.toc-sidebar$/, /^\.toc-link(:hover|\.active)?$/, /^\.stat-card$/, /^\.share-btn(:hover)?$/,
  /^#read-progress$/, /^\.callout(-blue|-green)?$/,
];
const ownedSel = s => OWNED.some(r => r.test(s));
const bareTag = s => /(^|[\s>+~])[a-zA-Z][\w-]*/.test(s.replace(/\[[^\]]*\]/g, '').replace(/:[\w-]+(\([^)]*\))?/g, '').replace(/[.#][\w-]+/g, ''));

const stats = { deleted: 0, migrated: 0, keptInline: 0, bodyStripped: 0, blocksRemoved: 0, fontImports: 0 };
const BODY_UTIL = new Set(); // pass-1 records

function classify(rule, cb) {
  // returns serialized text to keep, or null when deleted. cb collects decisions.
  if (rule.stmt) {
    if (/^@import\b.*fonts\.googleapis/.test(rule.prelude)) { stats.fontImports++; return null; }
    return rule.prelude + ';';
  }
  const p = rule.prelude;
  if (/^@(media|supports)\b/.test(p)) {
    const inner = split(rule.body).map(r => classify(r, cb)).filter(Boolean);
    return inner.length ? p + ' { ' + inner.join(' ') + ' }' : null;
  }
  if (/^@(-webkit-)?keyframes\b/.test(p)) return cz(ws(p + ' { ' + ws(rule.body) + ' }'));
  const sels = selList(p);
  if (sels.length && sels.every(ownedSel)) { stats.deleted++; return null; }
  if (sels.length === 1 && sels[0] === 'body') {
    const decls = rule.body.split(';').map(ws).filter(Boolean).filter(d => !/^(font-family|color)\s*:/i.test(d));
    stats.bodyStripped++;
    const out = decls.length ? 'body { ' + decls.join('; ') + '; }' : null;
    if (out === 'body { background: #fff; overflow-x: hidden; }') { BODY_UTIL.add(cb); return null; }
    return out;
  }
  return cz(ws(p + ' { ' + ws(rule.body).replace(/;?\s*$/, ';') + ' }'));
}

// ---------- pass 1: parse every page ----------
const STYLE_RE = /(<noscript>\s*)?<style(\s[^>]*)?>([\s\S]*?)<\/style>/g;
const files = pages();
const info = [];
for (const f of files) {
  const h = fs.readFileSync(f, 'utf8');
  const blocks = [];
  for (const m of h.matchAll(STYLE_RE)) {
    if (m[1]) continue; // keep <noscript><style> untouched
    const rules = split(m[3]).map(r => classify(r, f)).filter(Boolean);
    blocks.push({ full: m[0], rules });
  }
  info.push({ f, blocks });
}

// group by atomic rule text. Variant key = (at-rule wrapper | selector).
const flat = r => r;
const parts = r => { // -> [{key, props:Set}]
  const m = r.match(/^(@(?:media|supports)[^{]*){([sS]*)}$/);
  const wrap = m ? ws(m[1]) : '';
  const body = m ? m[2] : r;
  const out = [];
  for (const x of split(body)) {
    if (x.stmt || !x.body) continue;
    const props = new Set(x.body.split(';').map(d => d.split(':')[0].trim().toLowerCase()).filter(Boolean));
    out.push({ sels: selList(x.prelude), key: wrap + '|' + selList(x.prelude).join(','), props });
  }
  return out;
};
const occ = new Map(); const variants = new Map(); // text -> pages ; key -> Map(text -> props)
for (const { f, blocks } of info) for (const bl of blocks) for (const r of new Set(bl.rules.map(flat))) {
  (occ.get(r) ?? occ.set(r, new Set()).get(r)).add(f);
  if (/^@(-webkit-)?keyframes/.test(r)) continue;
  for (const p of parts(r)) { const v = variants.get(p.key) ?? variants.set(p.key, new Map()).get(p.key); v.set(r, p.props); }
}
const migratable = r => {
  if ((occ.get(r)?.size ?? 0) < 2) return false;
  if (/^@(-webkit-)?keyframes/.test(r)) return true;
  const ps = parts(r);
  if (!ps.length) return false;
  for (const p of ps) {
    if (p.sels.some(s => bareTag(s))) return false;
    // other variants of the same selector must override every property this copy sets (no leaking)
    for (const [txt, props] of variants.get(p.key)) {
      if (txt === r) continue;
      for (const pr of p.props) if (!props.has(pr)) return false;
    }
  }
  return true;
};
const migrated = new Map();
const ALREADY = fs.readFileSync(INPUT, "utf8").includes(MARK); // migrate only once; reruns just clean
if (!ALREADY) for (const { blocks } of info) for (const b of blocks) for (const r of b.rules) if (migratable(r) && !migrated.has(r)) migrated.set(r, true);

// ---------- pass 2: write ----------
const report = [];
for (const { f, blocks } of info) {
  if (!blocks.length) continue;
  let h = fs.readFileSync(f, 'utf8'); let i = 0;
  h = h.replace(STYLE_RE, (full, ns, attrs, css) => {
    if (ns) return full;
    const b = blocks[i++];
    const keep = b.rules.filter(r => !migrated.has(r));
    stats.keptInline += keep.length;
    if (!keep.length) { stats.blocksRemoved++; return ''; }
    return '<style' + (attrs || '') + '>\n' + keep.join('\n') + '\n</style>';
  });
  if (BODY_UTIL.has(f)) h = h.replace(/<body([^>]*?)class="([^"]*)"/, (m, a, c) => { const t = c.split(/s+/).filter(Boolean); for (const x of ['bg-white', 'overflow-x-hidden']) if (!t.includes(x)) t.push(x); return '<body' + a + 'class="' + t.join(' ') + '"'; });
  if (!DRY) fs.writeFileSync(f, h);
  report.push(rel(f));
}

// input.css append (idempotent: only rules not already present)
let css = fs.readFileSync(INPUT, 'utf8');
const add = [...migrated.keys()].filter(r => !css.includes(r));
stats.migrated = add.length;
if (!DRY && add.length) {
  const NL = String.fromCharCode(10);
  if (!css.includes(MARK)) css = css.trimEnd() + NL + NL + MARK + NL;
  fs.writeFileSync(INPUT, css.trimEnd() + NL + add.join(NL) + NL);
}
console.log(stats);
if (DRY) { console.log('MIGRATE:'); for (const r of add) console.log(' ', occ.get(r).size + 'x', r.slice(0, 110)); console.log('KEEP (multi-page but not migrated):'); for (const [r, p] of occ) if (!migrated.has(r) && p.size > 1) console.log(' ', p.size + 'x', r.slice(0, 110)); }
