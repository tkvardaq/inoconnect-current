import fs from 'fs';
import path from 'path';

const root = process.cwd();
const SKIP = new Set(['node_modules', '.git', '_plan', '__pycache__']);
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (!SKIP.has(e.name)) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (p.endsWith('.html')) files.push(p);
    }
  }
})(root);

console.log(`Checking ${files.length} HTML files for void element malformations...`);
let fixedCount = 0;
let totalMatches = 0;

for (const f of files) {
  let t = fs.readFileSync(f, 'utf8');
  const orig = t;

  // Match any attr="val"/ attr2=
  const matches = t.match(/["']\/\s+[a-z0-9_-]+=/gi);
  if (matches) {
    totalMatches += matches.length;
    // Replace "/ with "
    t = t.replace(/(["'])\/\s+([a-z0-9_-]+=)/gi, '$1 $2');
  }

  // Also match any <img ... //> or similar
  t = t.replace(/\/\s*\/>/g, '/>');

  if (t !== orig) {
    fs.writeFileSync(f, t, 'utf8');
    fixedCount++;
  }
}

console.log(`Found and fixed ${totalMatches} malformed void element attributes across ${fixedCount} files.`);
