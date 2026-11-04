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
const issues = [];
for (const p of pages) {
  const t = fs.readFileSync(p, 'utf8');
  const r = rel(p);
  const title = (t.match(/<title[^>]*>([\s\S]*?)<\/title>/) || [])[1]?.replace(/&amp;/g, '&').trim() || '';
  const desc = (t.match(/<meta\b[^>]*name=["']description["'][^>]*>/) || [''])[0].match(/content=(?:"([^"]*)"|'([^']*)')/)?.[1] || '';
  const h1s = (t.match(/<h1[\s>]/g) || []).length;

  if (title.length < 15 || title.length > 70) issues.push(`${r}: title len ${title.length} (${title})`);
  if (desc.length < 70 || desc.length > 160) issues.push(`${r}: desc len ${desc.length} (${desc})`);
  if (h1s !== 1) issues.push(`${r}: h1 count ${h1s}`);
}

console.log('Title/Desc/H1 issues:', issues.length);
issues.forEach(i => console.log(i));
