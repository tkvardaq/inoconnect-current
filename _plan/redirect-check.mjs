// Run: node _plan/redirect-check.mjs   (from D:\ino website; needs internet)
// Fails (exit 1) if any URL in the LIVE sitemap has no equivalent page in this folder.
// Old deploy-folder URLs (/InoConnect_Hostinger_Deploy_<date>/...) are mapped to the same path without the folder.
import fs from 'fs';
import path from 'path';
const root = process.cwd();
const skip = new Set(['node_modules', '_astro', '.manus', 'outputs', '__pycache__', '_plan', '_deploy', 'images', 'assets', 'videos']);
const local = new Set();
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!skip.has(e.name)) walk(path.join(d, e.name)); }
    else if (e.name === 'index.html') local.add('/' + path.relative(root, path.join(d, e.name)).replace(/\\/g, '/').replace(/index\.html$/, ''));
  }
})(root);
const xml = await (await fetch('https://inoconnect.com/sitemap.xml')).text();
const urls = [...xml.matchAll(/<loc>([^<]+)/g)].map(m => m[1]);
const missing = [];
let old = 0;
for (const u of urls) {
  let p = new URL(u).pathname;
  if (/^\/InoConnect_Hostinger_Deploy_\d+_\d+/.test(p)) { old++; p = p.replace(/^\/InoConnect_Hostinger_Deploy_\d+_\d+/, '') || '/'; }
  if (!p.endsWith('/')) p += '/';
  if (!local.has(p)) missing.push(u);
}
console.log(`live sitemap URLs: ${urls.length} (${old} under old deploy folders); local pages: ${local.size}; without a destination: ${missing.length}`);
missing.slice(0, 20).forEach(u => console.log('  MISSING ' + u));
process.exitCode = missing.length ? 1 : 0;
