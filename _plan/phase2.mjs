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

let count = 0;
for (const f of pages) {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;

  // Replace class="... grid-cols-3 ..." where grid-cols-3 is not preceded by sm:, md:, lg:, xl:
  // e.g. "grid grid-cols-3 gap-4 mb-12 reveal-on-scroll"
  content = content.replace(/class="([^"]*)"/g, (match, classNames) => {
    const tokens = classNames.split(/\s+/);
    let modified = false;
    const newTokens = tokens.map(tok => {
      if (tok === 'grid-cols-3') {
        modified = true;
        return 'grid-cols-1 sm:grid-cols-3';
      }
      return tok;
    });
    if (modified) {
      return `class="${newTokens.join(' ')}"`;
    }
    return match;
  });

  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
    count++;
    console.log(`Updated grid in: ${path.relative(root, f)}`);
  }
}

console.log(`Phase 2 grid updates complete. Updated ${count} files.`);
