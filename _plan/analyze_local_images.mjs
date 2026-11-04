import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

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

const usedImages = new Map();
for (const p of pages) {
  const t = fs.readFileSync(p, 'utf8');
  for (const m of t.matchAll(/<img\b[^>]*>/g)) {
    const src = (m[0].match(/src=["']([^"']+)["']/) || [])[1];
    if (src && !src.startsWith('http')) {
      if (!usedImages.has(src)) usedImages.set(src, []);
      usedImages.get(src).push(path.relative(root, p).replace(/\\/g, '/'));
    }
  }
}

async function analyze() {
  console.log('Unique local images used:', usedImages.size);
  for (const [src, pageList] of usedImages.entries()) {
    const filePath = path.join(root, src.startsWith('/') ? src.slice(1) : src);
    if (fs.existsSync(filePath)) {
      const meta = await sharp(filePath).metadata();
      const stat = fs.statSync(filePath);
      console.log(`${src} (${pageList.length} pages): ${meta.width}x${meta.height}, ${(stat.size/1024).toFixed(1)} KB`);
    } else {
      console.log(`MISSING: ${src}`);
    }
  }
}

analyze();
