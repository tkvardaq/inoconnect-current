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
const rel = f => path.relative(root, f).replace(/\\/g, '/');

for (const p of pages) {
  const r = rel(p);
  if (r.startsWith('blog/') && r !== 'blog/index.html') {
    let content = fs.readFileSync(p, 'utf8');
    // Replace "datePublished": " with "datePublished":"
    content = content.replace(/"datePublished":\s*"/g, '"datePublished":"');
    fs.writeFileSync(p, content, 'utf8');
  }
}
console.log('Formatted datePublished in blog JSON-LD without spaces.');
