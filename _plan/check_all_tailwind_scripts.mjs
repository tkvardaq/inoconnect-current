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

const cdnMatches = [];
for (const p of pages) {
  const t = fs.readFileSync(p, 'utf8');
  if (t.includes('cdn.tailwindcss.com')) {
    // Find the script tags
    const match = t.match(/<script\b[^>]*cdn\.tailwindcss\.com[^>]*><\/script>[\s\S]*?<\/script>/i);
    cdnMatches.push({ page: path.relative(root, p), match: match ? match[0].slice(0, 80) : 'NO_CONFIG_BLOCK' });
  }
}

console.log('Pages with CDN script:', cdnMatches.length);
console.log('Unique match beginnings:');
const uniqueStarts = new Set(cdnMatches.map(m => m.match));
for (const u of uniqueStarts) console.log(' ->', u);
