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

const allSrcs = new Set();
for (const p of pages) {
  const t = fs.readFileSync(p, 'utf8');
  for (const m of t.matchAll(/<img\b[^>]*>/g)) {
    const srcMatch = m[0].match(/src=["']([^"']+)["']/);
    if (srcMatch) allSrcs.add(srcMatch[1]);
  }
}

console.log('Total unique src attributes:', allSrcs.size);
for (const src of allSrcs) {
  // Check if file exists relative to root or relative to page
  let resolved = null;
  if (src.startsWith('/')) {
    resolved = path.join(root, src.slice(1));
  } else {
    // try direct
    resolved = path.join(root, src);
  }

  if (fs.existsSync(resolved)) {
    try {
      const stat = fs.statSync(resolved);
      console.log(`EXISTS: ${src} -> ${path.relative(root, resolved)} (${stat.size} bytes)`);
    } catch (e) {
      console.log(`ERROR stat: ${src}`);
    }
  } else {
    console.log(`MISSING: ${src} (tried ${path.relative(root, resolved)})`);
  }
}
