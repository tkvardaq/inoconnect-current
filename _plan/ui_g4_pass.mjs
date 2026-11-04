// UI group 4 codemod: blog/index.html + blog/*/index.html. Rerunnable (idempotent).
// Scope: only the region between INOCONNECT_MOBILE_END and INOCONNECT_FOOTER_START, plus skip-link radius
// and mega-menu h3 colour/weight in the header.
// ponytail: regex + tag stack, not a real HTML parser.
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const NEW_POSTS = new Set(['autonomous-ai-agents-performance-marketing', 'cro-landing-page-psychology', 'first-party-attribution-capi-growth', 'generative-engine-optimization-geo']);
const TAG = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;
const VOID = new Set('area base br col embed hr img input link meta source track wbr'.split(' '));

const split = (t) => { const i = t.lastIndexOf(':'); return { v: t.slice(0, i + 1), b: t.slice(i + 1) }; };
const DARK_BG = /^bg-(slate-(800|900|950)|black|primary|heading)$/;
const isDarkTokens = (toks) => {
  const bs = toks.filter((t) => !split(t).v).map((t) => split(t).b);
  return bs.some((b) => DARK_BG.test(b)) || (bs.some((b) => b.startsWith('bg-gradient')) && bs.some((b) => /^from-(slate-[89]\d\d|primary)$/.test(b)));
};

const FAM = /^(text|bg|from|via|to|ring|shadow|border|fill|stroke|decoration|divide|outline)-(purple|violet|indigo|blue|sky|teal|emerald|green|cyan|orange|amber|yellow|gray)-(\d{2,3})(\/\d+)?$/;
function mapFamily(prop, fam, num, op, dark) {
  num = +num; op = op || '';
  if (fam === 'gray') return `${prop}-slate-${num}${op}`;
  if (/^(blue|indigo|sky|purple|violet)$/.test(fam)) {
    if (prop === 'shadow') return 'shadow-primary/20';
    if (prop === 'text' && num <= 300) return 'text-white/80';
    if (num >= 900) return `${prop}-slate-${num}${op}`;
    if (num >= 700) return `${prop}-primary-dark${op}`;
    if (!op && num === 50) return `${prop}-primary/5`;
    if (!op && (prop === 'border' || prop === 'ring') && num <= 200) return `${prop}-primary/20`;
    if (!op && prop === 'bg' && num === 100) return `${prop}-primary/10`;
    return `${prop}-primary${op}`;
  }
  if (/^(teal|emerald|green|cyan)$/.test(fam)) {
    if (prop === 'shadow') return 'shadow-primary/20';
    return `${prop}-${num >= 700 ? 'secondary-dark' : 'secondary'}${op}`;
  }
  if (prop === 'shadow') return 'shadow-primary/20';
  return `${prop}-${num >= 600 ? 'accent-dark' : 'accent'}${op}`;
}

const isSize = (b) => /^text-(xs|sm|base|lg|xl|[2-9]xl|\[\d+px\])$/.test(b);
const isColour = (b) => /^text-(slate-\d+|heading|white(\/\d+)?|primary|secondary|accent|secondary-ink|accent-ink|blue-\d+|gray-\d+)$/.test(b);
const isBigNum = (b) => /^(text-[3-9]xl)$/.test(b) || /^(sm|md|lg):text-[3-9]xl$/.test(b);

// per-token global mapping (radius, shadow, micro size, leading, tracking, family, contrast)
function mapToken(tok, ctx) {
  let { v, b } = split(tok);
  let bang = '';
  if (b.startsWith('!')) { bang = '!'; b = b.slice(1); }
  const fam = FAM.exec(b);
  if (fam) b = mapFamily(fam[1], fam[2], fam[3], fam[4], ctx.dark);
  let m;
  if ((m = /^rounded(-(?:t|r|b|l|tl|tr|br|bl))?(?:-(sm|md|lg|3xl|\[2\.5rem\]|\[3rem\]|\[3\.5rem\]|\[4rem\]))?$/.exec(b)) && (m[2] || b === `rounded${m[1] || ''}`)) {
    const side = m[1] || '';
    b = `rounded${side}-${/3xl|rem/.test(m[2] || '') ? '[2rem]' : 'xl'}`;
  }
  b = b.replace(/^rounded-bl-\[100px\]$/, 'rounded-bl-[2rem]');
  if (b === 'text-[11px]') b = 'text-xs';
  if ((m = /^leading-\[([\d.]+)\]$/.exec(b)) && !ctx.keepLeading) { const n = +m[1]; b = n <= 1 ? 'leading-none' : n <= 1.2 ? 'leading-tight' : n <= 1.4 ? 'leading-snug' : 'leading-relaxed'; }
  if (b === 'tracking-[0.3em]') b = 'tracking-[0.2em]';
  if (b === 'shadow-md') b = 'shadow-sm';
  if (b === 'shadow-lg') b = 'shadow-xl';
  if (b === 'shadow-2xl' && !v) b = 'shadow-xl';
  if (!ctx.dark) {
    if (b === 'text-slate-400') b = 'text-slate-500';
    else if (b === 'text-secondary') b = 'text-secondary-ink';
    else if (b === 'text-accent') b = 'text-accent-ink';
    else if (b === 'text-primary-soft') b = 'text-primary';
  }
  return v + bang + b;
}

// eyebrow: uppercase + text-xs + bold/black + wide tracking -> eyebrow
function eyebrowify(toks) {
  const bs = toks.map((t) => split(t).b);
  const plain = (b) => toks.some((t) => t === b);
  if (plain('uppercase') && plain('text-xs') && (plain('font-black') || plain('font-bold')) && toks.some((t) => /^tracking-(widest|wider|\[0\.[23]em\])$/.test(t))) {
    const out = toks.filter((t) => !['uppercase', 'text-xs', 'font-black', 'font-bold'].includes(t) && !/^tracking-(widest|wider|\[0\.[23]em\])$/.test(t));
    out.unshift('eyebrow');
    return out;
  }
  return toks;
}

function canonH1(toks) {
  const keep = toks.filter((t) => { const b = split(t).b.replace(/^!/, ''); return !isSize(b) && !/^font-/.test(b) && !/^tracking-/.test(b) && !/^leading-/.test(b) && !isColour(b); });
  return ['text-4xl', 'md:text-6xl', 'font-black', 'tracking-tight', 'leading-[1.05]', 'text-heading', ...keep];
}

function transformTag(name, toks, ctx) {
  const orig = toks.join(' ');
  // button conversion for CTA links
  const has = (re) => toks.some((t) => re.test(t));
  if (name === 'a' && has(/^rounded-full$/) && has(/^px-(6|8|10)$/) && has(/^py-[34]$/) && has(/^bg-(primary|accent|secondary|white)$/)) {
    const bg = toks.find((t) => /^bg-(primary|accent|secondary|white)$/.test(t)).slice(3);
    const sm = has(/^py-3$/);
    const drop = /^(bg-|hover:bg-|px-|py-|rounded|font-|uppercase|tracking-|shadow|hover:scale|transition|text-(xs|sm|white|primary)$|inline-(block|flex)$|items-center|gap-\d|hover:shadow)/;
    const rest = toks.filter((t) => !drop.test(t));
    const art = ctx.inArticle;
    const out = ['btn', `btn-${bg}`, ...(sm ? ['btn-sm'] : []), ...rest];
    if (art) out.push(bg === 'white' ? '!text-primary' : '!text-white', '!no-underline');
    return out.join(' ');
  }
  if (name === 'h1') return canonH1(toks).map((t) => mapToken(t, { ...ctx, keepLeading: true })).join(' ');

  toks = eyebrowify(toks.map((t) => t));
  let out = toks.map((t) => mapToken(t, ctx));

  const isHead = name === 'h2' || name === 'h3';
  if (isHead && !out.includes('eyebrow')) {
    const sizeOf = out.find((t) => !split(t).v && isSize(t));
    const big = out.some((t) => /^(sm:|md:|lg:)?text-([2-9]xl)$/.test(t));
    out = out.filter((t) => !/^(sm:|md:|lg:)text-/.test(t) || !isSize(split(t).b));
    // colour
    out = out.map((t) => (!ctx.dark && /^text-slate-(800|900|950)$/.test(t) ? 'text-heading' : t));
    if (ctx.dark && !out.some((t) => isColour(t))) out.push('text-white');
    if (!ctx.dark && !out.some((t) => isColour(t))) out.push('text-heading');
    // size/weight
    if (big) out = out.map((t) => (/^text-[2-9]xl$/.test(t) ? (ctx.cardTitle ? 'text-xl' : 'text-2xl') : t));
    out = out.map((t) => (t === 'font-black' ? 'font-bold' : t));
    if (out.includes('text-xl') || out.includes('text-2xl')) { if (!out.some((t) => /^font-/.test(t))) out.push('font-bold'); }
    out = out.filter((t) => !/^tracking-(wider|widest)$/.test(t) || !out.includes('uppercase'));
    if (name === 'h3' && out.includes('uppercase') && !out.includes('eyebrow')) out = out.filter((t) => t !== 'uppercase' && !/^tracking-/.test(t)).map((t) => (t === 'text-lg' ? 'text-xl' : t));
  } else if (name !== 'h1') {
    // font-black reserved for big stat numbers
    if (out.includes('font-black') && !out.some((t) => isBigNum(t))) out = out.map((t) => (t === 'font-black' ? 'font-bold' : t));
  }
  // inside article-body: beat .article-body specificity on dark boxes
  if (ctx.inArticle && ctx.dark) {
    if (name === 'p') {
      const i = out.findIndex((t) => !split(t).v && isColour(t.replace(/^!/, '')));
      if (i >= 0) out[i] = '!' + out[i].replace(/^!/, ''); else out.push('!text-slate-300');
    }
    if (name === 'a') out = out.map((t) => (!split(t).v && isColour(t) ? '!' + t : t));
  }
  if (ctx.inArticle && ctx.boxed && isHead) {
    out = out.map((t) => (t === 'm-0' ? '!m-0' : t));
    if (!out.includes('!m-0')) out.push('!mt-0');
    if (name === 'h2') out.push('!pt-0');
  }
  return [...new Set(out)].join(' ');
}

function processMain(html, post) {
  const stack = [];
  const isNew = NEW_POSTS.has(post);
  let res = '';
  let last = 0;
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
    let attrs = m[3];
    const selfClose = /\/\s*$/.test(attrs);
    const cm = /(\sclass\s*=\s*)(["'])([\s\S]*?)\2/.exec(attrs);
    let toks = cm ? cm[3].split(/\s+/).filter(Boolean) : [];
    const anc = stack;
    const dark = isDarkTokens(toks) || anc.some((s) => s.dark);
    const abIdx = anc.findIndex((s) => s.articleBody);
    const inArticle = abIdx >= 0;
    const boxed = inArticle && anc.slice(abIdx + 1).some((s) => s.boxed);
    const cardTitle = post === '' && (name === 'h2' || name === 'h3') && anc.some((s) => s.card);
    const self = {
      name, dark: isDarkTokens(toks), articleBody: toks.includes('article-body'),
      boxed: toks.some((t) => /^(bg-|rounded-)/.test(t) && !/^(rounded-full)$/.test(t)) && !toks.includes('article-body'),
      card: toks.includes('group') && toks.some((t) => /^rounded-/.test(t)),
    };
    let newAttrs = attrs;
    if (cm) {
      let nt = toks;
      // new posts: strip hand-classed typography on bare article content
      if (isNew && inArticle && !boxed && ['h2', 'h3', 'p', 'ul', 'ol'].includes(name)) {
        nt = toks.filter((t) => !/^(sm:|md:|lg:)?(text-(xs|sm|base|lg|xl|[2-9]xl|slate-\d+|heading|white)|font-\S+|tracking-\S+|leading-\S+|m[trblxy]?-\S+|space-y-\S+)$/.test(t));
        newAttrs = attrs.replace(cm[0], nt.length ? `${cm[1]}${cm[2]}${nt.join(' ')}${cm[2]}` : '');
      } else {
        // article-body wrapper tweaks (let shared rules govern child spacing/colour)
        if (name !== 'article' && toks.includes('article-body')) nt = toks.filter((t) => !/^(space-y-\d+|text-slate-\d+|leading-relaxed)$/.test(t));
        else if (inArticle && toks.includes('max-w-none') && toks.some((t) => /^space-y-\d+$/.test(t))) nt = toks.filter((t) => !/^space-y-\d+$/.test(t));
        const s2 = { dark, inArticle, boxed, cardTitle };
        const joined = transformTag(name, nt, s2);
        newAttrs = attrs.replace(cm[0], `${cm[1]}${cm[2]}${joined}${cm[2]}`);
      }
    }
    // inline style cleanups
    const tocStyle = /\s+style\s*=\s*"padding-left:1\.5rem;\s*font-size:0\.74rem"/;
    if (tocStyle.test(newAttrs)) {
      newAttrs = newAttrs.replace(tocStyle, '');
      if (!/pl-6/.test(newAttrs)) newAttrs = newAttrs.replace(/(\sclass\s*=\s*")([^"]*)"/, '$1$2 pl-6 text-xs"');
    }
    newAttrs = newAttrs.replace(/\s+style\s*=\s*"color:\s*white\s*!important"/, '');
    if (newAttrs !== attrs) {
      res += html.slice(last, m.index) + `<${m[2]}${newAttrs}>`;
      last = m.index + m[0].length;
    }
    if (VOID.has(name) || selfClose) continue;
    if (name === 'script' || name === 'style') {
      const end = html.toLowerCase().indexOf(`</${name}`, re.lastIndex);
      re.lastIndex = end < 0 ? html.length : end;
      continue;
    }
    stack.push(self);
  }
  return res + html.slice(last);
}

const files = [];
const blogDir = path.join(root, 'blog');
files.push(['', path.join(blogDir, 'index.html')]);
for (const e of fs.readdirSync(blogDir, { withFileTypes: true })) if (e.isDirectory() && fs.existsSync(path.join(blogDir, e.name, 'index.html'))) files.push([e.name, path.join(blogDir, e.name, 'index.html')]);

let changed = 0;
for (const [post, f] of files) {
  let src = fs.readFileSync(f, 'utf8');
  const a = src.indexOf('<!-- INOCONNECT_MOBILE_END -->');
  const b = src.indexOf('<!-- INOCONNECT_FOOTER_START -->');
  if (a < 0 || b < 0) { console.log('SKIP markers', f); continue; }
  let head = src.slice(0, a);
  let main = src.slice(a, b);
  const tail = src.slice(b);
  head = head.replace('focus:rounded-md', 'focus:rounded-xl');
  head = head.replace(/<h3 class="text-sm font-black text-slate-900 mb-0\.5">/g, '<h3 class="text-sm font-bold text-heading mb-0.5">');
  main = processMain(main, post);
  const out = head + main + tail;
  if (out !== src) { fs.writeFileSync(f, out); changed++; }
}
console.log('changed', changed, 'of', files.length);
