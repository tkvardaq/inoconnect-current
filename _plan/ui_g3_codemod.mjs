// Group 3 UI pass: industries/** and tools/** index.html. Usage: node _plan/ui_g3_codemod.mjs [--dry]
// ponytail: regex tag walker (same approach as check_ui_tokens.mjs); class-only edits, scripts/styles untouched.
import fs from 'fs';

const FILES = fs.readFileSync(new URL('../_plan/ui_g3_files.txt', import.meta.url), 'utf8').split(/\s+/).filter(Boolean);
const DRY = process.argv.includes('--dry');

const TAG = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;
const VOID = new Set('area base br col embed hr img input link meta source track wbr'.split(' '));
const DARK_BG = /^bg-(?:slate-(?:800|900|950)|black|primary|accent|secondary-dark|gray-9\d\d|heading)$/;
const DARK_FROM = /^from-slate-9\d\d$/;
const DARK_CLS = new Set(['mobile-menu-overlay', 'site-footer']);

const split = (t) => { const i = t.lastIndexOf(':'); return [t.slice(0, i + 1), t.slice(i + 1)]; };
const isDark = (classes) => {
  const b = classes.filter((t) => !split(t)[0]).map((t) => split(t)[1]);
  return b.some((x) => DARK_BG.test(x) || DARK_CLS.has(x)) || (b.some((x) => x.startsWith('bg-gradient')) && b.some((x) => DARK_FROM.test(x)));
};

// generic 1:1 token map (applied to base, variant kept)
function mapBase(b) {
  const T = {
    'rounded-3xl': 'rounded-2xl', rounded: 'rounded-xl', 'rounded-md': 'rounded-xl', 'rounded-lg': 'rounded-xl',
    'rounded-[2.5rem]': 'rounded-[2rem]', 'rounded-[3rem]': 'rounded-[2rem]', 'rounded-[3.5rem]': 'rounded-[2rem]', 'rounded-[4rem]': 'rounded-[2rem]',
    'rounded-bl-[100px]': 'rounded-bl-[2rem]',
    'shadow-lg': 'shadow-xl', 'shadow-md': 'shadow-sm',
    'text-[11px]': 'text-xs', 'tracking-[0.3em]': 'tracking-[0.2em]',
    'leading-[0.9]': 'leading-none', 'leading-[0.95]': 'leading-none', 'leading-[1.08]': 'leading-tight',
    'text-orange-300': 'text-accent', 'text-orange-400': 'text-accent', 'text-purple-400': 'text-primary',
    'bg-orange-400': 'bg-accent', 'bg-orange-500/10': 'bg-accent/10', 'border-orange-500/20': 'border-accent/20', 'border-orange-500/30': 'border-accent/30',
    'hover:border-orange-500/40': 'hover:border-accent/40', 'from-orange-950/70': 'from-accent/10', 'to-orange-950/70': 'to-accent/10',
    'to-blue-50/30': 'to-primary/5', 'to-orange-50/30': 'to-accent/5',
  };
  if (T[b]) return T[b];
  let m;
  if ((m = /^to-(primary|secondary|accent)\/10\/30$/.exec(b))) return `to-${m[1]}/5`;
  if (/^shadow-(?:primary|secondary|accent|secondary-dark|orange-600)\/\d+$/.test(b)) return 'shadow-primary/20';
  if (/^shadow-\[0_0_(?:[2-9]\d|\d{3})px/.test(b)) return 'shadow-xl';
  return b;
}

const LOWFIX = { 'text-slate-400': 'text-slate-500', 'text-secondary': 'text-secondary-ink', 'text-accent': 'text-accent-ink', 'text-primary-soft': 'text-primary' };
const BIG = /^text-(?:[4-9]xl)$/;
const SIZE_ANY = /^text-(?:xs|sm|base|lg|xl|[2-9]xl)$/;

function transform(name, classes, dark) {
  let toks = classes.map((t) => { const [v, b] = split(t); return v + mapBase(b); });
  const has = (re) => toks.some((t) => re.test(split(t)[1]));
  const drop = (re) => { toks = toks.filter((t) => !re.test(t)); };

  // headings
  if (name === 'h1') {
    const white = toks.includes('text-white');
    drop(/^(?:[a-z]+:)?(?:text-(?:xs|sm|base|lg|xl|[2-9]xl)|font-(?:black|bold|extrabold|semibold)|tracking-\S+|leading-\S+|text-(?:heading|slate-\d+|white))$/);
    toks.unshift('text-4xl', 'md:text-6xl', 'font-black', 'tracking-tight', 'leading-[1.05]', white ? 'text-white' : 'text-heading');
  } else if (name === 'h2' && !(toks.includes('text-xl') && toks.includes('font-bold'))) {
    const white = toks.includes('text-white');
    const col = toks.find((t) => /^text-(?:heading|slate-(?:800|900|950)|white)$/.test(t));
    drop(/^(?:[a-z]+:)?(?:text-(?:xs|sm|base|lg|xl|[2-9]xl)|font-(?:black|bold|extrabold)|tracking-\S+|leading-\S+|text-(?:heading|slate-(?:800|900|950)|white))$/);
    toks.unshift('text-3xl', 'md:text-5xl', 'font-black', 'tracking-tight', 'leading-tight');
    if (col) toks.push(white || col === 'text-white' ? 'text-white' : 'text-heading');
  } else if (name === 'h3' && has(/^(?:text-(?:sm|base|lg|xl|[2-9]xl)|font-(?:black|bold))$/) && !toks.includes('uppercase')) {
    drop(/^(?:md|lg|xl):text-\S+$/);
    toks = toks.map((t) => (/^text-[2-9]xl$/.test(t) ? 'text-xl' : t === 'font-black' ? 'font-bold' : t));
    toks = toks.filter((t) => t !== 'tracking-tight');
    toks = toks.map((t) => (/^text-slate-(?:800|900|950)$/.test(t) ? 'text-heading' : t));
  }

  // eyebrow: plain uppercase tracked micro label (no chip chrome)
  const base = toks.filter((t) => !split(t)[0]);
  if (!/^h[1-6]$/.test(name) && base.includes('uppercase') && base.includes('text-xs')
    && base.some((t) => /^tracking-(?:widest|wider|\[0\.2em\])$/.test(t))
    && !base.some((t) => /^(?:bg-|border|px-|rounded|py-)/.test(t))) {
    drop(/^(?:uppercase|text-xs|font-(?:black|bold)|tracking-(?:widest|wider|\[0\.2em\]))$/);
    toks.unshift('eyebrow');
  }

  // weight: font-black only for H1/H2 and big stat numbers
  if (!/^h[12]$/.test(name) && !has(BIG) && !(name === 'span' && toks.includes('text-xl') && toks.includes('tracking-tight') && toks.includes('font-black') && toks.length === 3)) {
    toks = toks.map((t) => (split(t)[1] === 'font-black' ? split(t)[0] + 'font-bold' : t));
  }
  if (name === 'p') toks = toks.map((t) => (/^font-(?:black|bold)$/.test(t) ? 'font-medium' : t));

  // contrast on light backgrounds
  if (!dark) toks = toks.map((t) => { const [v, b] = split(t); return LOWFIX[b] ? v + LOWFIX[b] : t; });

  // section rhythm
  if (name === 'section' && !has(/^pt-/)) {
    toks = toks.map((t) => (t === 'py-32' || t === 'py-24' || t === 'py-20' ? 'py-20 md:py-28' : t === 'py-12' ? 'py-16' : t));
  }

  // buttons
  if ((name === 'a' || name === 'button') && toks.some((t) => /^bg-(?:primary|accent|secondary|secondary-dark|orange-600)$/.test(t))
    && toks.some((t) => /^(?:px|py)-\d/.test(t)) && !toks.includes('sr-only')) {
    const bg = toks.find((t) => /^bg-(?:primary|accent|secondary|secondary-dark|orange-600)$/.test(t));
    const v = bg === 'bg-primary' ? 'btn-primary' : bg === 'bg-orange-600' || bg === 'bg-accent' ? 'btn-accent' : 'btn-secondary';
    const keep = toks.filter((t) => /^(?:[a-z]+:)?(?:w-|m[tblrxy]?-|group$|whitespace-|self-|col-span|order-|shrink|grow)/.test(t) && !/^hover:/.test(t));
    toks = ['btn', v, ...keep];
    if (classes.includes("py-3") && classes.includes("px-8") && classes.includes('rounded-full')) toks.splice(2, 0, 'btn-sm');
  }
  return [...new Set(toks)].join(' ');
}

function run(html) {
  let out = '', last = 0, m;
  const stack = [];
  const re = new RegExp(TAG.source, 'g');
  while ((m = re.exec(html))) {
    if (m[0].startsWith('<!--')) continue;
    const name = m[2].toLowerCase();
    if (m[1]) { const i = stack.map((s) => s.name).lastIndexOf(name); if (i >= 0) stack.length = i; continue; }
    let tag = m[0];
    const cm = /(\sclass\s*=\s*)"([^"]*)"/.exec(tag);
    const classes = cm ? cm[2].split(/\s+/).filter(Boolean) : [];
    const el = { name, classes };
    if (cm) {
      const dark = [...stack, el].some((s) => isDark(s.classes));
      const nc = transform(name, classes, dark);
      if (nc !== classes.join(' ')) {
        tag = tag.replace(cm[0], `${cm[1]}"${nc}"`);
        el.classes = nc.split(/\s+/);
      }
    }
    out += html.slice(last, m.index) + tag; last = m.index + m[0].length;
    const selfClose = /\/\s*$/.test(m[3]);
    if (VOID.has(name) || selfClose) continue;
    if (name === 'script' || name === 'style') {
      const end = html.toLowerCase().indexOf(`</${name}`, re.lastIndex);
      re.lastIndex = end < 0 ? html.length : end;
      continue;
    }
    stack.push(el);
  }
  return out + html.slice(last);
}

for (const f of FILES) {
  const src = fs.readFileSync(f, 'utf8');
  const res = run(src);
  const d = (s, r) => (s.match(r) || []).length;
  const ok = d(src, /<div/g) === d(res, /<div/g) && d(src, /<\/div/g) === d(res, /<\/div/g) && res.trimEnd().endsWith('</html>');
  console.log(f, src === res ? 'unchanged' : 'changed', ok ? 'balance-ok' : 'BALANCE-FAIL');
  if (!DRY && ok) fs.writeFileSync(f, res);
}
