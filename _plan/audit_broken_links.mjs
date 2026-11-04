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

const missing = [];

for (const p of pages) {
  const relPage = path.relative(root, p).replace(/\\/g, '/');
  const t = fs.readFileSync(p, 'utf8');
  const links = [...t.matchAll(/<a\b[^>]*href=["']([^"']+)["']/g)].map(m => m[1]);

  for (const href of links) {
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) continue;
    if (href.startsWith('http://') || href.startsWith('https://')) {
      if (!href.startsWith('https://inoconnect.com')) continue;
    }

    let route = href.replace(/^https:\/\/inoconnect\.com/, '');
    const cleanRoute = route.split('#')[0].split('?')[0];
    if (!cleanRoute) continue;

    let targetFile = null;
    if (cleanRoute.endsWith('/')) {
      targetFile = path.join(root, cleanRoute.slice(1), 'index.html');
    } else if (/\.(html|svg|xml|png|webp|jpg)$/.test(cleanRoute)) {
      targetFile = path.join(root, cleanRoute.slice(1));
    } else {
      targetFile = path.join(root, cleanRoute.slice(1), 'index.html');
    }

    if (!fs.existsSync(targetFile)) {
      missing.push({ page: relPage, href, targetFile: path.relative(root, targetFile).replace(/\\/g, '/') });
    }
  }
}

console.log('Total missing links:', missing.length);
missing.forEach(m => console.log(`${m.page} -> ${m.href} (expected ${m.targetFile})`));
