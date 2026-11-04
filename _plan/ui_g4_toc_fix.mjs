// One-off: re-add pl-6 text-xs to TOC sub-links whose inline style was stripped (source of truth: git HEAD).
import fs from 'fs'; import { execSync } from 'child_process';
let n = 0;
for (const d of fs.readdirSync('blog', { withFileTypes: true })) {
  if (!d.isDirectory()) continue;
  const f = `blog/${d.name}/index.html`;
  let orig; try { orig = execSync(`git show HEAD:${f}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch { continue; }
  const subs = [...orig.matchAll(/<a class="toc-link" href="(#[^"]+)" style="padding-left:1\.5rem;\s*font-size:0\.74rem"/g)].map((m) => m[1]);
  if (!subs.length) continue;
  let s = fs.readFileSync(f, 'utf8');
  for (const h of subs) { const from = `<a class="toc-link" href="${h}">`; if (s.includes(from)) { s = s.replace(from, `<a class="toc-link pl-6 text-xs" href="${h}">`); n++; } }
  fs.writeFileSync(f, s);
}
console.log('fixed', n);
