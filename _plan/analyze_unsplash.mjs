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

const photoMap = new Map();
const allImgTags = [];

for (const p of pages) {
  const t = fs.readFileSync(p, 'utf8');
  const imgs = [...t.matchAll(/<img\b[^>]*>/g)];
  for (const im of imgs) {
    allImgTags.push({ page: path.relative(root, p), tag: im[0] });
    const srcMatch = im[0].match(/src=["'](https:\/\/images\.unsplash\.com\/[^"']+)["']/);
    if (srcMatch) {
      const fullUrl = srcMatch[1];
      const photoMatch = fullUrl.match(/photo-([0-9a-zA-Z-]+)/);
      const photoId = photoMatch ? photoMatch[1] : fullUrl;
      if (!photoMap.has(photoId)) {
        photoMap.set(photoId, { fullUrls: new Set(), pages: new Set() });
      }
      photoMap.get(photoId).fullUrls.add(fullUrl);
      photoMap.get(photoId).pages.add(path.relative(root, p));
    }
  }
}

console.log('Total img tags across all pages:', allImgTags.length);
console.log('Distinct photo IDs in img tags:', photoMap.size);
for (const [id, data] of photoMap.entries()) {
  console.log(`ID: ${id} | Pages: ${data.pages.size} | Variants: ${data.fullUrls.size}`);
}
