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

const tags = [];
for (const p of pages) {
  const t = fs.readFileSync(p, 'utf8');
  for (const m of t.matchAll(/<img\b[^>]*>/g)) {
    const src = (m[0].match(/src=["']([^"']+)["']/) || [])[1];
    if (src && src.startsWith('/images/') && !src.startsWith('/images/stock/')) {
      tags.push({ page: path.relative(root, p).replace(/\\/g, '/'), tag: m[0] });
    }
  }
}

console.log('Total non-stock /images/ tags:', tags.length);
tags.forEach(t => console.log(t.page, '::', t.tag));
