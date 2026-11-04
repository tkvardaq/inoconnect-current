// Checks page HTML against the site's Tailwind token rules.
// Usage: node _plan/check_ui_tokens.mjs [--summary] [--rule=<name>]
// ponytail: regex scan plus a simple tag stack, not a real HTML parser. Fine for these generated pages.
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const args = process.argv.slice(2);
const summaryOnly = args.includes('--summary');
const ruleArg = args.find((a) => a.startsWith('--rule='));
const ruleFilter = ruleArg ? ruleArg.slice('--rule='.length) : null;

const PAGE_DIRS = ['about', 'blog', 'contact', 'industries', 'services', 'tools', 'privacy', 'terms'];
const BRAND = /\[#(4169E1|3152B3|8DA7F5|44D7A8|33B88E|FF7518|E06612|1e293b)\]/i;
const OFF_PALETTE = /^(?:text|bg|from|via|to|ring|ring-offset|shadow|fill|stroke|accent|divide|outline|decoration|border(?:-[trblxy])?)-(purple|violet|fuchsia|pink|rose|teal|cyan|sky|indigo|amber|yellow|lime|green|emerald|orange|blue|red|zinc|gray|neutral|stone)-\d{2,3}(?:\/\d{1,3})?$/;
const RADIUS = /^rounded(?:-(?:t|r|b|l|s|e|tl|tr|br|bl|ss|se|es|ee))?(?:-(.+))?$/;
const RADIUS_OK = ['full', 'xl', '2xl', '[2rem]', 'none'];
const PROSE = /^prose(?:-|$)/;
const LEADING = /^leading-\[(?!1\.05\])/; // leading-[1.05] is the standard H1
const SIZE = /^text-(xs|sm|base|lg|xl|[2-9]xl)$/;
const LOW = new Set(['text-slate-400', 'text-secondary', 'text-accent', 'text-primary-soft']);
const DARK_BG = /^bg-(?:slate-(?:800|900|950)|black|primary|gray-9\d\d|heading)$/;
const DARK_FROM = /^from-slate-9\d\d$/;
const VOID = new Set('area base br col embed hr img input link meta source track wbr'.split(' '));
const TAG = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;

const splitToken = (tok) => {
  const i = tok.lastIndexOf(':');
  return { variant: tok.slice(0, i + 1), base: tok.slice(i + 1).replace(/^!/, '') };
};
const classTokens = (value) => value.split(/\s+/).filter(Boolean);
const lineAt = (text, idx) => text.slice(0, idx).split('\n').length;
const stripScripts = (html) => html.replace(/<script\b[\s\S]*?<\/script>/gi, (m) => m.replace(/[^\n]/g, ''));

function collectPages() {
  const files = ['index.html', '404.html'];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.name === 'index.html') files.push(path.relative(root, full).replace(/\\/g, '/'));
    }
  };
  for (const d of PAGE_DIRS) if (fs.existsSync(path.join(root, d))) walk(path.join(root, d));
  return files.filter((f) => fs.existsSync(path.join(root, f)));
}

function checkClassAttr(value, idx, at) {
  const tokens = classTokens(value);
  if (/\[[^\]]*\s/.test(value)) at(idx, 'broken-class', 'ERROR');
  const sizes = {};
  for (const tok of tokens) {
    const { variant, base } = splitToken(tok);
    if (BRAND.test(tok)) at(idx, 'brand-hex', 'ERROR');
    const off = OFF_PALETTE.exec(base);
    if (off) at(idx, 'off-palette', off[1] === 'red' ? 'WARN' : 'ERROR');
    const r = RADIUS.exec(base);
    if (r && !RADIUS_OK.includes(r[1])) at(idx, 'radius', 'ERROR');
    if (PROSE.test(base)) at(idx, 'prose', 'ERROR');
    if (LEADING.test(base)) at(idx, 'arbitrary-leading', 'WARN');
    const size = SIZE.exec(base);
    if (size) (sizes[variant] ??= new Set()).add(size[1]);
  }
  if (Object.values(sizes).some((s) => s.size > 1)) at(idx, 'broken-class', 'ERROR');
}

function isDark(el) {
  const bases = el.classes.filter((t) => !splitToken(t).variant).map((t) => splitToken(t).base);
  // mobile-menu-overlay / site-footer are dark via input.css, not via utility classes
  return bases.some((b) => DARK_BG.test(b) || b === 'mobile-menu-overlay' || b === 'site-footer')
    || (bases.some((b) => b.startsWith('bg-gradient')) && bases.some((b) => DARK_FROM.test(b)));
}

function checkLowContrast(html, at) {
  const stack = [];
  const re = new RegExp(TAG.source, 'g');
  let m;
  while ((m = re.exec(html))) {
    if (m[0].startsWith('<!--')) continue;
    const name = m[2].toLowerCase();
    if (m[1]) {
      const i = stack.map((s) => s.name).lastIndexOf(name);
      if (i >= 0) stack.length = i;
      continue;
    }
    const attrs = m[3];
    const cls = /\sclass\s*=\s*(["'])([\s\S]*?)\1/.exec(' ' + attrs);
    const el = { name, classes: cls ? classTokens(cls[2]) : [] };
    if (el.classes.some((t) => LOW.has(splitToken(t).base)) && ![...stack, el].some(isDark)) {
      at(m.index, 'low-contrast-light', 'WARN');
    }
    if (VOID.has(name) || /\/\s*$/.test(attrs)) continue;
    if (name === 'script' || name === 'style') {
      const end = html.toLowerCase().indexOf(`</${name}`, re.lastIndex);
      re.lastIndex = end < 0 ? html.length : end;
      continue;
    }
    stack.push(el);
  }
}

function scanPage(file) {
  const raw = fs.readFileSync(path.join(root, file), 'utf8');
  const html = stripScripts(raw);
  const rawLines = raw.split('\n');
  const out = [];
  const add = (line, rule, level, text) => out.push({
    file, line, rule, level, snippet: (text ?? rawLines[line - 1] ?? '').trim().slice(0, 140),
  });
  const at = (idx, rule, level) => add(lineAt(html, idx), rule, level);

  const cssLinks = (raw.match(/fonts\.googleapis\.com\/css2/g) || []).length;
  if (cssLinks !== 1) add(1, 'font-links', 'ERROR', `${cssLinks} fonts.googleapis.com/css2 links (expected 1)`);
  for (const m of html.matchAll(/font-family/gi)) at(m.index, 'font-family-inline', 'ERROR');
  for (const m of html.matchAll(/\sstyle\s*=\s*(["'])([\s\S]*?)\1/gi)) {
    if (/!important/i.test(m[2])) at(m.index, 'important-inline', 'WARN');
  }
  for (const m of html.matchAll(/\sclass\s*=\s*(["'])([\s\S]*?)\1/g)) checkClassAttr(m[2], m.index, at);
  checkLowContrast(html, at);
  return out;
}

const files = collectPages();
let found = files.flatMap((f) => scanPage(f));
if (ruleFilter) found = found.filter((v) => v.rule === ruleFilter);
const errors = found.filter((v) => v.level === 'ERROR').length;

if (!summaryOnly) for (const v of found) console.log(`${v.file}:${v.line}  ${v.rule}  ${v.snippet}`);

const counts = {};
for (const v of found) {
  const key = `${v.rule} [${v.level}]`;
  counts[key] = (counts[key] || 0) + 1;
}
console.log(`\nScanned ${files.length} pages.`);
if (!found.length) console.log('No violations.');
for (const k of Object.keys(counts).sort()) console.log(`  ${k}: ${counts[k]}`);
console.log(`ERROR: ${errors}  WARN: ${found.length - errors}`);
process.exitCode = errors > 0 ? 1 : 0;
