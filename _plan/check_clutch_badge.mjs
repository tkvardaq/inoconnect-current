import fs from 'fs';
const t = fs.readFileSync('index.html', 'utf8');
const idx = t.indexOf('Top-Rated Growth');
console.log(t.slice(idx - 600, idx));
