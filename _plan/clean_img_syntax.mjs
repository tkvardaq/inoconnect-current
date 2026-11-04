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

let fixed = 0;
for (const p of pages) {
  let t = fs.readFileSync(p, 'utf8');
  if (t.includes('"/ width=')) {
    t = t.replaceAll('"/ width=', '" width=');
    fs.writeFileSync(p, t, 'utf8');
    fixed++;
  }
}
console.log(`Fixed img slash artifact in ${fixed} pages`);
