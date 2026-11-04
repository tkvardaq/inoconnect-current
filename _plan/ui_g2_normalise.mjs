// Group 2 UI pass: services/**/index.html. Usage: node _plan/ui_g2_normalise.mjs
import fs from 'fs';

const FILES = ['index', 'ai-automation', 'ai-development', 'content-marketing', 'digital-strategy', 'ppc', 'seo', 'social-media', 'web-development']
  .map((n) => (n === 'index' ? 'services/index.html' : `services/${n}/index.html`));

const TAG = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;
const VOID = new Set('area base br col embed hr img input link meta source track wbr'.split(' '));
const split = (t) => { const i = t.lastIndexOf(':'); return [t.slice(0, i + 1), t.slice(i + 1)]; };
const isDarkEl = (el) => {
  if (el.id === 'mobile-menu-overlay' || el.name === 'footer') return true;
  const b = el.tokens.filter((t) => !split(t)[0]).map((t) => split(t)[1]);
  if (b.some((x) => /^bg-(slate-(800|900|950)(\/\d+)?|black(\/\d+)?|primary|heading)$/.test(x))) return true;
  return b.some((x) => x.startsWith('bg-gradient')) && b.some((x) => /^from-slate-9\d\d/.test(x));
};

const FAM = { blue: 'primary', indigo: 'primary', sky: 'primary', purple: 'primary', violet: 'primary',
  teal: 'secondary', emerald: 'secondary', green: 'secondary', cyan: 'secondary', orange: 'accent', amber: 'accent', yellow: 'accent' };
const OFF = /^(text|bg|from|via|to|ring|shadow|fill|stroke|accent|divide|outline|decoration|border(?:-[trblxy])?)-(blue|indigo|sky|purple|violet|teal|emerald|green|cyan|orange|amber|yellow)-(\d{2,3})(?:\/(\d+))?$/;
function mapOff(base, dark) {
  const m = OFF.exec(base); if (!m) return base;
  const [, p, fam, shadeS, op] = m; const shade = +shadeS; const to = FAM[fam];
  if (p === 'shadow') return `shadow-primary/20`;
  if (p === 'text') {
    if (shade >= 700) return to === 'primary' ? 'text-primary-dark' : `text-${to}-ink`;
    if (dark) return shade <= 400 && to === 'primary' ? 'text-primary-soft' : `text-${to}`;
    return to === 'primary' ? 'text-primary' : `text-${to}-ink`;
  }
  if (op && shade > 200 && shade < 800) return `${p}-${to}/${op}`;
  if (shade <= 200) return `${p}-${to}/${shade <= 50 ? 10 : shade <= 100 ? 10 : 20}`;
  if (shade >= 800) return `${p}-${to}/${p.startsWith('border') ? 30 : 20}`;
  if (shade === 700) return `${p}-${to}-dark`;
  return `${p}-${to}`;
}

const SIZE_RX = /^(?:[a-z]+:)?text-(xs|sm|base|lg|xl|[2-9]xl|\[11px\])$/;
const rmCls = (tokens, rx) => tokens.filter((t) => !rx.test(t));
const HEAD_COLOR = /^text-(slate-(900|950|800)|\[#1e293b\])$/;

function transform(name, tokens, ctx) {
  const dark = ctx.dark;
  let t = tokens.slice();
  const has = (c) => t.includes(c);

  // --- headings
  if (name === 'h1' || name === 'h2') {
    const white = has('text-white');
    const isH1 = name === 'h1';
    t = t.filter((x) => !/^(?:[a-z]+:)?text-(?:xs|sm|base|lg|xl|[2-9]xl)$/.test(x) && !/^(?:[a-z]+:)?(leading|tracking)-/.test(x) && !/^font-(black|bold|extrabold|semibold|medium|normal)$/.test(x) && !HEAD_COLOR.test(x) && x !== 'text-heading' && x !== 'text-white');
    const otherCol = t.some((x) => /^text-(?!xs|sm|base|lg|xl|[2-9]xl|left|right|center|balance|wrap)/.test(x));
    const col = otherCol ? null : (white || dark ? 'text-white' : 'text-heading');
    const std = isH1 ? ['text-4xl', 'md:text-6xl', 'font-black', 'tracking-tight', 'leading-[1.05]', ...(col ? [col] : [])]
      : ['text-3xl', 'md:text-5xl', 'font-black', 'tracking-tight', 'leading-tight', ...(col ? [col] : [])];
    t = [...std, ...t];
  } else if (name === 'h3') {
    t = t.map((x) => (x === 'font-black' ? 'font-bold' : x));
    t = t.map((x) => (/^(?:[a-z]+:)?text-(lg|2xl|3xl|4xl)$/.test(x) ? x.replace(/text-.*/, 'text-xl') : x));
    t = t.filter((x, i) => !(/^md:text-/.test(x)));
    t = t.map((x) => (HEAD_COLOR.test(x) ? 'text-heading' : x));
  }

  // --- buttons (a/button with brand bg + font weight)
  if ((name === 'a' || name === 'button') && !has('sr-only')) {
    const v = ['primary', 'secondary', 'accent'].find((c) => has(`bg-${c}`));
    if (v && (has('font-black') || has('font-bold')) && t.some((x) => /^rounded/.test(x)) && !t.includes('flex-col')) {
      const sm = has('px-8') && has('py-3');
      const keep = t.filter((x) => !/^(?:hover:|focus:)?(bg-|text-(white|sm|base|lg|xl|center)|px-|py-|rounded|font-|uppercase|tracking-|shadow|transition|duration|hover:scale|hover:-translate|block|inline-block|inline-flex|flex$|items-|justify-|gap-)/.test(x));
      t = ['btn', `btn-${v}`, ...(sm ? ['btn-sm'] : []), ...keep];
    }
  }

  // --- eyebrow (pure labels, no chip styling)
  if (!/^h\d$/.test(name) && !t.includes('btn')) {
    const up = has('uppercase') && t.some((x) => /^tracking-(widest|wider|\[0\.[23]em\])$/.test(x));
    const small = t.some((x) => x === 'text-xs' || x === 'text-[11px]');
    const chip = t.some((x) => /^(bg-|border|px-|py-|rounded|backdrop|flex$|inline-flex|w-|h-)/.test(x));
    if (up && small && !chip && !t.some((x) => /^(?:md|lg|sm):text-/.test(x)) && (name === 'span' || name === 'p' || name === 'div')) {
      const col = t.filter((x) => /^text-(?!xs|sm|base|lg|xl|\[11px\]|center|left|right)/.test(x));
      const rest = t.filter((x) => !/^(text-(xs|\[11px\])|font-(black|bold|medium|normal|mono)|uppercase|tracking-.*)$/.test(x) && !col.includes(x));
      t = ['eyebrow', ...col, ...rest];
    }
  }

  // --- token-level maps
  const hasSection = name === 'section';
  t = t.map((tok) => {
    const [v, b0] = split(tok);
    let b = b0;
    b = mapOff(b, dark);
    // radius
    let m = /^rounded(-(?:t|r|b|l|tl|tr|br|bl))?(?:-(.+))?$/.exec(b);
    if (m) {
      const side = m[1] || ''; const sz = m[2];
      let to = null;
      if (sz === undefined || sz === 'md' || sz === 'lg' || sz === 'sm') to = 'xl';
      else if (sz === '3xl') to = (t.includes('overflow-hidden') || t.some((x) => /^(md:)?p-(10|12)$/.test(x)) || t.includes('md:p-12')) ? '[2rem]' : '2xl';
      else if (/^\[(2\.5|3|3\.5|4)rem\]$/.test(sz) || sz === '[100px]') to = '[2rem]';
      if (to) b = `rounded${side}-${to}`;
    }
    // shadows
    if (/^shadow-(primary|secondary|accent)\/(?!20$)\d+$/.test(b) || /^shadow-(secondary|accent)\/20$/.test(b)) b = 'shadow-primary/20';
    else if (v === '' && (b === 'shadow-md' )) b = 'shadow-sm';
    else if (v === '' && (b === 'shadow-lg' || b === 'shadow-2xl' || b === 'shadow')) b = 'shadow-xl';
    else if (/^shadow-\[/.test(b) && !/dot/.test(tok)) b = ctx.tiny ? b : 'shadow-xl';
    else if (v !== '' && v.endsWith('hover:') && (b === 'shadow-lg' || b === 'shadow-xl')) b = 'shadow-2xl';
    // type
    if (b === 'text-[11px]') b = 'text-xs';
    if (b === 'tracking-[0.3em]' || b === 'tracking-[0.25em]') b = 'tracking-[0.2em]';
    if (/^tracking-\[-?0?\.\d+em\]$/.test(b)) b = 'tracking-tight';
    if (b === 'tracking-normal' || b === 'tracking-wide') b = b;
    const lm = /^leading-\[(\d*\.?\d+)\]$/.exec(b);
    if (lm && !(name === 'h1')) { const n = +lm[1]; b = n <= 0.95 ? 'leading-none' : n <= 1.15 ? 'leading-tight' : n <= 1.35 ? 'leading-snug' : 'leading-relaxed'; }
    if (b === 'max-w-[1400px]') b = 'max-w-7xl';
    return v + b;
  });

  // --- weights on non-headings
  if (!/^h[1-6]$/.test(name)) {
    const big = t.some((x) => /^(?:[a-z]+:)?text-([3-9]xl)$/.test(x));
    if (name === 'p') t = t.map((x) => (x === 'font-black' || x === 'font-bold' ? 'font-medium' : x));
    else if (!big) t = t.map((x) => (x === 'font-black' ? 'font-bold' : x));
  }

  // --- contrast on light
  if (!dark) {
    t = t.map((tok) => {
      const [v, b] = split(tok);
      if (b === 'text-slate-400') return v + 'text-slate-500';
      if (b === 'text-secondary') return v + 'text-secondary-ink';
      if (b === 'text-accent') return v + 'text-accent-ink';
      if (b === 'text-primary-soft') return v + 'text-primary';
      return tok;
    });
  }

  // --- section padding
  if (hasSection && !t.some((x) => /^(pt|pb)-/.test(x))) {
    const i = t.findIndex((x) => /^py-(20|24|28|32)$/.test(x));
    if (i >= 0 && !t.some((x) => /^md:py-/.test(x))) t.splice(i, 1, 'py-20', 'md:py-28');
  }

  // dedupe
  return [...new Set(t)];
}

let total = 0;
for (const f of FILES) {
  const raw = fs.readFileSync(f, 'utf8');
  const blocks = [];
  const src = raw.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, (m) => { blocks.push(m); return '<!--@@B' + (blocks.length - 1) + '@@-->'; });
  const stack = [];
  let changed = 0;
  const out = src.replace(TAG, (full, close, nameRaw, attrs, off) => {
    if (full.startsWith('<!--')) return full;
    const name = nameRaw.toLowerCase();
    if (close) { const i = stack.map((s) => s.name).lastIndexOf(name); if (i >= 0) stack.length = i; return full; }
    const cm = /(\sclass\s*=\s*)(["'])([\s\S]*?)\2/.exec(attrs);
    const idm = /\sid\s*=\s*["']([^"']*)["']/.exec(attrs);
    const tokens = cm ? cm[3].split(/\s+/).filter(Boolean) : [];
    const el = { name, tokens, id: idm?.[1] };
    const dark = [...stack, el].some(isDarkEl);
    let res = full;
    if (cm && name !== 'script' && name !== 'style') {
      const ctx = { dark, tiny: tokens.some((x) => /^w-(1|1\.5|2|3)$/.test(x)) };
      const nt = transform(name, tokens, ctx);
      const ns = nt.join(' ');
      if (ns !== cm[3].trim().split(/\s+/).join(' ')) {
        changed++;
        res = full.replace(cm[0], cm[1] + cm[2] + ns + cm[2]);
      }
    }
    if (!VOID.has(name) && !/\/\s*$/.test(attrs)) {
      if (name === 'script' || name === 'style') {
        // skip contents: handled by regex not matching tags inside script text poorly; push nothing
      } else stack.push(el);
    }
    return res;
  });
  fs.writeFileSync(f, out.replace(/<!--@@B(\d+)@@-->/g, (_, i) => blocks[+i]));
  total += changed;
  console.log(f, 'class attrs changed:', changed);
}
console.log('total', total);
