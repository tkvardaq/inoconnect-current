// UI group 1 codemod: index, 404, about, contact, privacy, terms.
// Usage: node _plan/ui_g1_codemod.mjs [--dry]
// ponytail: regex tag walker with a dark-ancestor stack, not a real HTML parser. Hand edits cover judgment calls.
import fs from 'fs';

const FILES = ['index.html', '404.html', 'about/index.html', 'contact/index.html', 'privacy/index.html', 'terms/index.html'];
const dry = process.argv.includes('--dry');

const TAG = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;
const VOID = new Set('area base br col embed hr img input link meta source track wbr'.split(' '));
const split = (t) => { const i = t.lastIndexOf(':'); return { v: t.slice(0, i + 1), b: t.slice(i + 1) }; };

// extended dark-background detection (superset of the checker's)
const DARK_BG = /^bg-(?:slate-(?:700|800|900|950)|black|primary|primary-dark|heading|gray-9\d\d)(?:\/(\d+))?$/;
const isDarkEl = (classes) => {
  if (classes.includes('mobile-menu-overlay')) return true;
  const bases = classes.filter((t) => !split(t).v).map((t) => split(t).b);
  for (const b of bases) {
    const m = DARK_BG.exec(b);
    if (m && (!m[1] || +m[1] >= 50)) return true;
  }
  return bases.some((b) => b.startsWith('bg-gradient')) && bases.some((b) => /^(from|via|to)-(slate-[89]\d\d|primary|primary-dark|black)(\/\d+)?$/.test(b) && !/\/(10|20|30)$/.test(b));
};

const FAMILY = {
  blue: 'primary', indigo: 'primary', sky: 'primary', purple: 'primary', violet: 'primary', fuchsia: 'primary', pink: 'accent', rose: 'accent',
  teal: 'secondary', emerald: 'secondary', green: 'secondary', cyan: 'secondary', lime: 'secondary',
  orange: 'accent', amber: 'accent', yellow: 'accent',
  gray: 'slate', zinc: 'slate', neutral: 'slate', stone: 'slate',
};
const OFF = /^(text|bg|from|via|to|ring|shadow|border(?:-[trblxy])?|divide|fill|stroke)-(purple|violet|fuchsia|pink|rose|teal|cyan|sky|indigo|amber|yellow|lime|green|emerald|orange|blue|zinc|gray|neutral|stone)-(\d{2,3})(?:\/(\d{1,3}))?$/;

function mapOff(b, dark) {
  const m = OFF.exec(b);
  if (!m) return b;
  const [, prop, fam, shadeS, op] = m;
  const shade = +shadeS;
  const tgt = FAMILY[fam];
  if (tgt === 'slate') return `${prop}-slate-${shade}${op ? '/' + op : ''}`;
  if (prop === 'shadow') return 'shadow-primary/20';
  if (prop === 'text') {
    if (dark) return shade <= 400 && tgt === 'primary' ? 'text-primary-soft' : `text-${tgt}`;
    return tgt === 'primary' ? 'text-primary' : `text-${tgt}-ink`;
  }
  if (!op && shade <= 200 && (prop === 'bg' || prop === 'ring' || prop.startsWith('border'))) {
    return `${prop}-${tgt}/${shade >= 200 ? 20 : 10}`;
  }
  if (op && shade <= 100) return `${prop}-${tgt}/10`;
  return `${prop}-${tgt}${op ? '/' + op : ''}`;
}

const RADIUS = /^rounded(-(?:t|r|b|l|s|e|tl|tr|br|bl|ss|se|es|ee))?(?:-(.+))?$/;
function mapRadius(b, panel) {
  const m = RADIUS.exec(b);
  if (!m) return b;
  const side = m[1] || '';
  const sz = m[2];
  const ok = ['full', 'xl', '2xl', '[2rem]', 'none'];
  if (sz !== undefined && ok.includes(sz)) return b;
  let to;
  if (sz === undefined || ['sm', 'md', 'lg'].includes(sz)) to = 'xl';
  else if (sz === '3xl') to = panel ? '[2rem]' : '2xl';
  else if (/^\[(2\.5|3|3\.5|4)rem\]$/.test(sz) || /^\[\d+px\]$/.test(sz)) to = '[2rem]';
  else return b;
  return `rounded${side}-${to}`;
}

const SHADOW = { 'shadow-md': 'shadow-sm', 'shadow-lg': 'shadow-xl' };
const HOVER_SHADOW = /^hover:shadow-(md|lg|xl)$/;

// big-panel heuristic for rounded-3xl
const isPanel = (cls) => cls.some((t) => /^(?:[a-z]+:)?p[xy]?-(10|12|14|16)$/.test(t) || /^(?:[a-z]+:)?(?:p|px|py)-(10|12)$/.test(t));

const RANK = { 'text-xs': 0, 'text-sm': 1, 'text-base': 2, 'text-lg': 3, 'text-xl': 4 };
const SIZE_ANY = /^text-(xs|sm|base|lg|xl|[2-9]xl)$/;

function processClass(classStr, tag, ancDark, ctx) {
  let tokens = classStr.split(/\s+/).filter(Boolean);
  const dark = ancDark || isDarkEl(tokens);
  const panel = isPanel(tokens);
  const hasUpper = tokens.includes('uppercase');

  tokens = tokens.map((t) => {
    const { v, b } = split(t);
    let nb = mapOff(b, dark);
    nb = mapRadius(nb, panel);
    if (nb === 'max-w-[1400px]') nb = 'max-w-7xl';
    if (nb === 'tracking-[0.3em]') nb = 'tracking-[0.2em]';
    if (nb === 'text-[11px]') nb = 'text-xs';
    if (nb === 'text-[#00FFFF]') nb = 'text-primary-soft';
    if (/^leading-\[(1\.1|1\.12|1\.08|1\.05)\]$/.test(nb) && !['h1'].includes(tag)) nb = 'leading-tight';
    if (/^leading-\[0\.\d+\]$/.test(nb)) nb = 'leading-none';
    if (nb === 'tracking-[-0.05em]') nb = 'tracking-tighter';
    if (v === '' && SHADOW[nb]) nb = SHADOW[nb];
    if (HOVER_SHADOW.test(v + nb)) nb = 'shadow-2xl';
    if (v === 'focus:' && nb === 'shadow-lg') nb = 'shadow-xl';
    if (v === 'hover:' && /^shadow-(primary|secondary|accent)\/\d+$/.test(nb)) nb = 'shadow-primary/20';
    if (/^shadow-(primary|secondary|accent)\/\d+$/.test(nb) && v === '') nb = 'shadow-primary/20';
    return v + nb;
  });

  // contrast on light backgrounds
  if (!dark) {
    tokens = tokens.map((t) => {
      const { v, b } = split(t);
      if (b === 'text-slate-400') return v + 'text-slate-500';
      if (b === 'text-secondary') return v + 'text-secondary-ink';
      if (b === 'text-accent') return v + 'text-accent-ink';
      if (b === 'text-primary-soft') return v + 'text-primary';
      return t;
    });
  }

  // headings
  if (tag === 'h1' || tag === 'h2' || tag === 'h3') {
    const keep = [];
    const hasWhite = tokens.includes('text-white');
    let sizeKeep = null;
    for (const t of tokens) {
      const { v, b } = split(t);
      const isSize = SIZE_ANY.test(b);
      const isLead = /^leading-/.test(b);
      const isTrack = /^tracking-/.test(b);
      const isWeight = /^font-(black|bold|extrabold|semibold|medium|normal|light)$/.test(b);
      const isHeadColour = b === 'text-heading' || /^text-slate-(800|900|950)$/.test(b) || b === 'text-[#1e293b]';
      if (tag === 'h3' && tokens.includes('uppercase')) {
        if (isWeight || isHeadColour) continue;
        keep.push(t);
        continue;
      }
      if (tag === 'h3') {
        if (isSize && v === '' && RANK[b] !== undefined && b !== 'text-xl') { sizeKeep = t; continue; }
        if (isSize || isWeight || isTrack || isHeadColour) continue;
        if (isLead && /^leading-\[/.test(b)) continue;
        keep.push(t);
        continue;
      }
      if (isSize || isLead || isTrack || isWeight || isHeadColour) continue;
      keep.push(t);
    }
    const colourKept = keep.some((t) => /^text-(white|primary|secondary|accent|slate-)/.test(split(t).b));
    const col = colourKept ? [] : [dark || hasWhite ? 'text-white' : 'text-heading'];
    let head;
    if (tag === 'h1') head = ['text-4xl', 'md:text-6xl', 'font-black', 'tracking-tight', 'leading-[1.05]'];
    else if (tag === 'h2') head = ['text-3xl', 'md:text-5xl', 'font-black', 'tracking-tight', 'leading-tight'];
    else head = tokens.includes('uppercase') ? ['font-bold'] : [sizeKeep || 'text-xl', 'font-bold'];
    tokens = [...head, ...keep, ...col];
    ctx.headings++;
  } else {
    // weights on non-headings
    const sizeTok = tokens.filter((t) => !split(t).v).map((t) => split(t).b).find((b) => SIZE_ANY.test(b));
    const big = sizeTok && /^text-[2-9]xl$/.test(sizeTok) && sizeTok !== 'text-2xl';
    const bigResp = tokens.some((t) => /^(?:sm:|md:|lg:)text-[3-9]xl$/.test(t));
    if (tag === 'p' || tag === 'li') {
      tokens = tokens.map((t) => {
        const { v, b } = split(t);
        if (v === '' && (b === 'font-black' || b === 'font-bold')) return hasUpper ? 'font-bold' : 'font-medium';
        return t;
      });
    } else if (!big && !bigResp && !(sizeTok === 'text-2xl')) {
      tokens = tokens.map((t) => (t === 'font-black' || t === 'font-extrabold' ? 'font-bold' : t));
    }
  }

  // dedupe preserving order
  const seen = new Set();
  tokens = tokens.filter((t) => (seen.has(t) ? false : (seen.add(t), true)));
  return tokens.join(' ');
}

function processSection(tag, tokens) {
  if (tag !== 'section') return tokens;
  const hasPy = tokens.find((t) => /^py-(12|24|28|32|40)$/.test(t));
  if (!hasPy) return tokens;
  const out = [];
  for (const t of tokens) {
    if (/^py-(24|28|32|40)$/.test(t)) out.push('py-20', 'md:py-28');
    else if (t === 'py-12') out.push('py-16');
    else out.push(t);
  }
  return out;
}

function run(file) {
  const raw = fs.readFileSync(file, 'utf8');
  // skip script/style bodies
  const stack = [];
  let out = '';
  let last = 0;
  const ctx = { headings: 0 };
  const re = new RegExp(TAG.source, 'g');
  let m;
  while ((m = re.exec(raw))) {
    if (m[0].startsWith('<!--')) continue;
    const name = m[2].toLowerCase();
    if (m[1]) {
      const i = stack.map((s) => s.name).lastIndexOf(name);
      if (i >= 0) stack.length = i;
      continue;
    }
    const attrs = m[3];
    const cm = /(\sclass\s*=\s*)(["'])([\s\S]*?)\2/.exec(attrs);
    let newTag = m[0];
    const ancDark = stack.some((s) => s.dark);
    let selfDark = false;
    if (cm) {
      const cls = cm[3];
      const toks0 = cls.split(/\s+/).filter(Boolean);
      selfDark = isDarkEl(toks0);
      let nc = processClass(cls, name, ancDark, ctx);
      nc = processSection(name, nc.split(' ')).join(' ');
      if (nc !== cls) {
        newTag = m[0].replace(cm[0], () => `${cm[1]}${cm[2]}${nc}${cm[2]}`);
      }
    }
    out += raw.slice(last, m.index) + newTag;
    last = m.index + m[0].length;
    if (VOID.has(name) || /\/\s*$/.test(attrs)) continue;
    if (name === 'script' || name === 'style') {
      const end = raw.toLowerCase().indexOf(`</${name}`, re.lastIndex);
      re.lastIndex = end < 0 ? raw.length : end;
      continue;
    }
    stack.push({ name, dark: selfDark });
  }
  out += raw.slice(last);
  return { out, raw, ctx };
}

for (const f of FILES) {
  const { out, raw, ctx } = run(f);
  console.log(f, 'changed:', out !== raw, 'headings:', ctx.headings);
  if (!dry && out !== raw) fs.writeFileSync(f, out);
}
