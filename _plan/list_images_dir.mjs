import fs from 'fs';
import path from 'path';

const root = process.cwd();
const imgDir = path.join(root, 'images');
const files = fs.readdirSync(imgDir).filter(f => !fs.statSync(path.join(imgDir, f)).isDirectory());
console.log('Total files in images/:', files.length);
files.forEach(f => {
  const stat = fs.statSync(path.join(imgDir, f));
  console.log(`${f.padEnd(45)} ${(stat.size/1024).toFixed(1)} KB`);
});
