import fs from 'fs';
import path from 'path';

const root = process.cwd();
const SKIP = new Set(['node_modules', '.git', '_plan', '__pycache__']);
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (!SKIP.has(e.name)) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else files.push(p);
    }
  }
})(root);

console.log(`Checking ${files.length} files for UTF-8 BOM...`);
let bomCount = 0;

for (const f of files) {
  const buf = fs.readFileSync(f);
  if (buf.length >= 3 && buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
    // Strip BOM
    const cleanBuf = buf.subarray(3);
    fs.writeFileSync(f, cleanBuf);
    bomCount++;
    console.log(`Stripped BOM from: ${path.relative(root, f)}`);
  }
}

console.log(`Total files with BOM stripped: ${bomCount}`);
