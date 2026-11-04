import fs from 'fs';
const [tag, ...files] = process.argv.slice(2);
const cnt = {};
for (const f of files) {
  const raw = fs.readFileSync(f, 'utf8');
  const re = new RegExp('<' + tag + '\\b[^>]*?\\sclass="([^"]*)"', 'g');
  for (const m of raw.matchAll(re)) (cnt[m[1]] ??= new Set()).add(f.replace('/index.html', ''));
}
for (const [k, v] of Object.entries(cnt).sort()) console.log(v.size + '  ' + k);
