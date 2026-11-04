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

console.log(`Found ${pages.length} pages to process.`);

let replacedCount = 0;
const replacement = '<link rel="stylesheet" href="/assets/site.css?v=20261103"/>';

// Regex that matches <script ... cdn.tailwindcss.com></script> and optional immediately following <script>...tailwind.config...</script>
const tailwindRegex = /<script\b[^>]*cdn\.tailwindcss\.com[^>]*><\/script>(?:\s*<script\b[^>]*>[\s\S]*?tailwind\.config[\s\S]*?<\/script>)?/gi;

for (const p of pages) {
  let t = fs.readFileSync(p, 'utf8');
  if (tailwindRegex.test(t)) {
    tailwindRegex.lastIndex = 0;
    t = t.replace(tailwindRegex, replacement);
    fs.writeFileSync(p, t, 'utf8');
    replacedCount++;
  } else {
    console.log(`Page did not match tailwindRegex: ${path.relative(root, p)}`);
  }
}

console.log(`Successfully replaced Tailwind CDN in ${replacedCount} pages.`);

// Double check if any cdn.tailwindcss.com remains
const remaining = pages.filter(p => fs.readFileSync(p, 'utf8').includes('cdn.tailwindcss.com'));
console.log(`Pages with remaining cdn.tailwindcss.com: ${remaining.length}`);
if (remaining.length > 0) {
  remaining.forEach(r => console.log(' ->', path.relative(root, r)));
}
