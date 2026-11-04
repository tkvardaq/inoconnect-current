import fs from 'fs';
import path from 'path';

function walk(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    if (item === 'node_modules' || item === '.git' || item === '_deploy' || item === '_plan') continue;
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      files = files.concat(walk(full));
    } else if (item.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

const allHtmls = walk('.');

console.log('=== AUDITING REMAINING PAGES FOR THEME/ACCENT USAGE ===');
const categories = {};
for (const file of allHtmls) {
  if (file.startsWith('services' + path.sep)) continue; // we already analyzed services
  const content = fs.readFileSync(file, 'utf8');
  const mainMatch = content.match(/<main[\s\S]*?<\/main>/i);
  if (!mainMatch) continue;
  const m = mainMatch[0];
  const p = (m.match(/primary/g) || []).length;
  const s = (m.match(/secondary/g) || []).length;
  const a = (m.match(/accent/g) || []).length;
  const b = (m.match(/#4169E1/gi) || []).length;
  const o = (m.match(/#FF7518/gi) || []).length;
  const g = (m.match(/#44D7A8/gi) || []).length;
  console.log(`${file.padEnd(45)}: prim=${p}, sec=${s}, acc=${a} | hex(B=${b}, O=${o}, G=${g})`);
}
