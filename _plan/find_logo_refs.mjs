import fs from 'fs';
import path from 'path';

const root = process.cwd();
const SKIP = new Set(['node_modules', '.git', '_plan', '__pycache__', '_deploy']);
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (!SKIP.has(e.name)) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else {
        const t = fs.readFileSync(p, 'utf8');
        if (t.includes('main-logo')) {
          console.log('main-logo in', path.relative(root, p));
        }
      }
    }
  }
})(root);
