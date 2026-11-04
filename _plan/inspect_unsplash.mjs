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

const unsplashMap = new Map();
for (const p of pages) {
  const t = fs.readFileSync(p, 'utf8');
  const matches = [...t.matchAll(/https:\/\/images\.unsplash\.com\/[^\s"'<>]+/g)];
  for (const m of matches) {
    const url = m[0];
    if (!unsplashMap.has(url)) {
      unsplashMap.set(url, []);
    }
    unsplashMap.get(url).push(path.relative(root, p).replace(/\\/g, '/'));
  }
}

console.log('Distinct Unsplash URLs:', unsplashMap.size);
for (const [url, fileList] of unsplashMap.entries()) {
  console.log(`${url} -> used in ${fileList.length} pages`);
}
