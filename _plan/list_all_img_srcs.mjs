import fs from 'fs';
import path from 'path';

const root = process.cwd();
const SKIP = new Set(['node_modules', '.git', '_plan', '__pycache__', '_deploy']);
const pages = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (!SKIP.has(e.name)) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (p.endsWith('index.html') && !p.includes('outputs')) pages.push(p);
    }
  }
})(root);

const allSrcs = new Map();
for (const p of pages) {
  const t = fs.readFileSync(p, 'utf8');
  for (const m of t.matchAll(/<img\b[^>]*>/g)) {
    const src = (m[0].match(/src=["']([^"']+)["']/) || [])[1] || 'NO_SRC';
    if (!allSrcs.has(src)) allSrcs.set(src, 0);
    allSrcs.set(src, allSrcs.get(src) + 1);
  }
}

console.log('Total unique src attributes in <img> tags:', allSrcs.size);
for (const [src, count] of allSrcs.entries()) {
  console.log(`${count.toString().padStart(3)}x : ${src}`);
}
