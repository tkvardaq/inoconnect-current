import fs from 'fs';
const t = fs.readFileSync('index.html', 'utf8');
const idx = t.indexOf('Hard-Proof Metrics Ribbon');
console.log(t.slice(idx, idx + 1800));
