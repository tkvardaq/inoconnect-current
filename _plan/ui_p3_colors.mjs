// Phase 3 (mechanical): hex -> tokens, hover shade fixes, gradient text -> .text-gradient-brand, home inline !important overrides.
import fs from 'fs'; import { pages, rel } from './ui_pages.mjs';
const MAP = {
  '4169e1': 'primary', '3152b3': 'primary-dark', '8da7f5': 'primary-soft',
  '44d7a8': 'secondary', '33b88e': 'secondary-dark',
  'ff7518': 'accent', 'e06612': 'accent-dark', 'ea580c': 'accent-dark',
  '1e293b': 'heading', '334155': 'slate-700', '64748b': 'slate-500', '475569': 'slate-600',
  '6e6e73': 'slate-500', '05070d': 'slate-950', '060810': 'slate-950',
};
const stats = { hex: 0, accentHover: 0, blueHover: 0, gradient: 0, gradientSkipped: [], inline: 0, inlineWarn: [] };
const BRAND = /^(primary|primary-dark|primary-soft|secondary|secondary-dark|accent|accent-dark|(teal|blue|cyan|sky|indigo)-\d{2,3})(\/\d+)?$/;

function fixClass(c, file) {
  let toks = c.split(/\s+/).filter(Boolean);
  const hasAccentBg = toks.includes('bg-accent');
  const hasPrimaryBg = toks.includes('bg-primary');
  toks = toks.map(t => {
    if (hasAccentBg && /^hover:bg-orange-(500|600)$/.test(t)) { stats.accentHover++; return 'hover:bg-accent-dark'; }
    if (hasPrimaryBg && t === 'hover:bg-blue-600') { stats.blueHover++; return 'hover:bg-primary-dark'; }
    return t;
  });
  // gradient text
  if (toks.includes('bg-clip-text') && toks.includes('text-transparent')) {
    const grad = toks.filter(t => /^bg-gradient-to-/.test(t));
    const stops = toks.filter(t => /^(from|via|to)-/.test(t));
    const ok = grad.length && stops.length && stops.every(t => BRAND.test(t.replace(/^(from|via|to)-/, '')));
    if (ok) {
      toks = toks.filter(t => !/^bg-gradient-to-/.test(t) && !/^(from|via|to)-/.test(t) && t !== 'bg-clip-text' && t !== 'text-transparent');
      toks.push('text-gradient-brand'); stats.gradient++;
    } else if (!toks.includes('text-gradient-brand')) stats.gradientSkipped.push(rel(file) + ' :: ' + c.slice(0, 140));
  }
  return toks.join(' ');
}

for (const f of pages()) {
  let h = fs.readFileSync(f, 'utf8'); const orig = h;
  // 1. hex -> token (anywhere a utility prefix is followed by [#hex])
  h = h.replace(/(?<=-)\[#([0-9a-fA-F]{6})\]/g, (m, hx) => {
    const t = MAP[hx.toLowerCase()]; if (!t) return m; stats.hex++; return t;
  });
  // 2. class-attr level logic (token fixes needing context)
  h = h.replace(/class="([^"]*)"/g, (m, c) => 'class="' + fixClass(c, f) + '"');
  // 3. home page inline !important overrides -> classes
  if (rel(f) === 'index.html') {
    h = h.replace(/<(\w+)\b([^>]*?)>/g, (m, tag, rest) => {
      const sm = rest.match(/\sstyle="([^"]*)"/); if (!sm) return m;
      const decl = sm[1].replace(/\s+/g, ' ').trim().replace(/;$/, '');
      const add = {
        'color: #ffffff !important': 'text-white',
        'color: #94a3b8 !important': 'text-slate-400',
        'color: #cbd5e1 !important': 'text-slate-300',
        'color: #FF7518 !important': 'text-accent',
        'background-color: #060810 !important; color: #ffffff !important': 'bg-slate-950 text-white',
      }[decl];
      if (!add) return m;
      let r = rest.replace(sm[0], '');
      const cm = r.match(/\sclass="([^"]*)"/);
      if (cm) {
        if (/\b(text-(white|slate-\d+|accent|primary|secondary)|bg-(slate-\d+|white|primary))\b/.test(cm[1])) stats.inlineWarn.push(tag + ' ' + cm[1]);
        r = r.replace(cm[0], ' class="' + (cm[1] + ' ' + add).trim() + '"');
      } else r += ' class="' + add + '"';
      stats.inline++;
      return '<' + tag + r + '>';
    });
  }
  if (h !== orig) fs.writeFileSync(f, h);
}
console.log(JSON.stringify(stats, null, 1));
