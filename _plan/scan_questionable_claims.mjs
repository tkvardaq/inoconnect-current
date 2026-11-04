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

const patterns = [
  /4\.[0-9]x/i,
  /5\.[0-9]x/i,
  /3\.[0-9]x/i,
  /\b98%\b/,
  /\$38M/i,
  /\$[0-9]+M/i,
  /Signed BAA/i,
  /High retention/i,
  /Average ROAS/i,
  /Attributed Revenue/i
];

console.log('Scanning for questionable claims...');
for (const p of pages) {
  const rel = path.relative(root, p).replace(/\\/g, '/');
  const t = fs.readFileSync(p, 'utf8');
  for (const pat of patterns) {
    for (const m of t.matchAll(new RegExp(`.{0,40}${pat.source}.{0,40}`, 'gi'))) {
      // Exclude tool slider labels (e.g. 3.5x in benchmark tables or calculators) if legitimate, but check where it appears
      console.log(`[${rel}] (${pat}): ${m[0].trim()}`);
    }
  }
}
