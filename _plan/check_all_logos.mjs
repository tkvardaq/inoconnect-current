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

const headerLogos = new Set();
const footerLogos = new Set();
for (const p of pages) {
  const t = fs.readFileSync(p, 'utf8');
  for (const m of t.matchAll(/<img[^>]*logo[^>]*>/g)) {
    if (m[0].includes('main-logo')) headerLogos.add(m[0]);
    else footerLogos.add(m[0]);
  }
}

console.log('Header logos:');
for (const h of headerLogos) console.log(h);
console.log('Footer logos:');
for (const f of footerLogos) console.log(f);
