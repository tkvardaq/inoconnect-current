// Phase 2: single Google Fonts block per page + normalise <body> classes.
import fs from 'fs'; import { pages } from './ui_pages.mjs';
const BLOCK = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700;800;900&display=swap" rel="stylesheet">';
const stats = { pagesFontsChanged: 0, linksRemoved: 0, bodyChanged: 0, bodyTokensRemoved: 0 };
const LINK_RE = /<link\b[^>]*?(?:fonts\.googleapis\.com|fonts\.gstatic\.com)[^>]*?>/gi;
const DROP = new Set(['font-sans', 'text-heading', 'text-slate-800', 'text-[#334155]', 'text-slate-900']);
for (const f of pages()) {
  let h = fs.readFileSync(f, 'utf8'); const orig = h;
  const head = h.slice(0, h.indexOf('</head>'));
  // fonts: skip if already exactly the standard block once
  const links = head.match(LINK_RE) || [];
  const std = h.split(BLOCK).length - 1;
  if (!(std === 1 && links.length === 3)) {
    let first = -1;
    h = h.replace(LINK_RE, (m, off) => { if (first < 0) first = off; stats.linksRemoved++; return '@@FONT@@'; });
    // keep the first marker position, drop the rest
    let n = 0; h = h.replace(/@@FONT@@/g, () => (n++ === 0 ? BLOCK : ''));
    if (n === 0) h = h.replace(/(<link[^>]*site\.css[^>]*>)/, BLOCK + '$1');
    if (!h.includes(BLOCK)) throw new Error('no font insert point ' + f);
    stats.pagesFontsChanged++;
  }
  // body classes
  h = h.replace(/<body\b([^>]*)>/, (m, attrs) => {
    const cm = attrs.match(/class="([^"]*)"/);
    if (!cm) return m;
    let toks = cm[1].split(/\s+/).filter(Boolean);
    const before = toks.length;
    toks = toks.filter(t => !DROP.has(t) && !/^selection:/.test(t));
    stats.bodyTokensRemoved += before - toks.length;
    toks.push('selection:bg-primary', 'selection:text-white');
    return '<body' + attrs.replace(cm[0], 'class="' + toks.join(' ') + '"') + '>';
  });
  if (h !== orig) { fs.writeFileSync(f, h); stats.bodyChanged++; }
}
console.log(stats);
