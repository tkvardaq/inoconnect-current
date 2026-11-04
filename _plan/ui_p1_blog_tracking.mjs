// Phase 1: remove prose classes, ensure article-body, fix invalid tracking class, blog H1.
import fs from 'fs'; import { pages, rel } from './ui_pages.mjs';
const stats = { prose: 0, articleBodyAdded: 0, tracking: 0, blogH1: 0 };
for (const f of pages()) {
  let h = fs.readFileSync(f, 'utf8'); const orig = h;
  const isPost = /\/blog\/[^/]+\/index\.html$/.test(f);
  if (isPost) {
    const hadAB = /article-body/.test(h);
    // strip prose / prose-* / not-prose tokens from class attributes
    h = h.replace(/class="([^"]*)"/g, (m, c) => {
      if (!/(^|\s)(not-)?prose(-\S+)?(\s|$)/.test(c)) return m;
      stats.prose++;
      let toks = c.split(/\s+/).filter(Boolean);
      const hadProse = toks.some(t => /^prose(-\S+)?$/.test(t));
      toks = toks.filter(t => !/^(not-)?prose(-\S+)?$/.test(t));
      // 4 hand-classed posts: the prose div is the article container -> article-body
      if (hadProse && !hadAB && !toks.includes('article-body')) { toks.unshift('article-body'); stats.articleBodyAdded++; }
      return 'class="' + toks.join(' ') + '"';
    });
  }
  // invalid arbitrary tracking value (space inside brackets)
  h = h.replace(/tracking-\[ -0\.05em\]/g, () => { stats.tracking++; return 'tracking-tighter'; });
  if (rel(f) === 'blog/index.html') {
    h = h.replace(/md:text-5xl md:text-7xl/g, () => { stats.blogH1++; return 'md:text-6xl'; });
  }
  if (h !== orig) fs.writeFileSync(f, h);
}
console.log(stats);
