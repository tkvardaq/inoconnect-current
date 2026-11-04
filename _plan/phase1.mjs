import fs from 'fs';
import path from 'path';

const root = process.cwd();
const SKIP = new Set(['node_modules', '.git', '_plan', '__pycache__', '_deploy']);

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else files.push(p);
  }
})(root);

const isText = f => /\.(html|md|xml|json|js|mjs|css|txt|py|svg|webmanifest)$/i.test(f) || path.basename(f) === '.htaccess';

let changedCount = 0;

for (const f of files.filter(isText)) {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;

  // HTML footer and specific page replacements
  content = content.replaceAll('116 Mulberry Lane, Bellaire, TX 77401', '116 Mulberry Lane, Bellaire, TX');
  content = content.replaceAll('9 Highfield Ave, Orpington, BR6 6LE', '9 Highfield Ave, Orpington');
  content = content.replaceAll('116 Mulberry Lane, Bellaire, Texas 77401', '116 Mulberry Lane, Bellaire, Texas');
  content = content.replaceAll('9 Highfield Avenue, Orpington, BR6 6LE', '9 Highfield Avenue, Orpington');
  content = content.replaceAll('Bellaire, Texas, 77401', 'Bellaire, Texas');
  content = content.replaceAll('Orpington, BR6 6LE', 'Orpington');

  // JSON-LD postalCode removal
  content = content.replace(/"postalCode":\s*"[^"]*",?\r?\n?/g, '');

  // Also clean up any lingering postal code tokens in any doc/md/etc
  if (content.includes('77401')) {
    content = content.replaceAll('77401', '');
  }
  if (content.includes('BR6 6LE')) {
    content = content.replaceAll('BR6 6LE', '');
  }
  if (content.includes('BR6')) {
    content = content.replaceAll('BR6', '');
  }

  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
    changedCount++;
    console.log('Updated: ' + path.relative(root, f));
  }
}

console.log(`Phase 1 complete. Updated ${changedCount} files.`);
