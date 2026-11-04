import fs from 'fs'; import path from 'path';
const root = 'D:/ino website';
const BS = String.fromCharCode(92);
const norm = (p) => p.split(BS).join('/');
export function pages() {
  const out = [root + '/index.html', root + '/404.html'];
  const walk = (p) => {
    if (!fs.existsSync(p)) return;
    for (const e of fs.readdirSync(p, { withFileTypes: true })) {
      const f = path.join(p, e.name);
      if (e.isDirectory()) walk(f);
      else if (e.name === 'index.html') out.push(norm(f));
    }
  };
  for (const d of ['about', 'blog', 'contact', 'industries', 'services', 'tools', 'privacy', 'terms']) walk(path.join(root, d));
  return out;
}
export const rel = (f) => f.replace(root + '/', '');
