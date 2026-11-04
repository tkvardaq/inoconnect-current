import fs from 'fs';
const t = fs.readFileSync('index.html', 'utf8');
const start = t.indexOf('<main');
const end = t.indexOf('<!-- Hard-Proof Metrics Ribbon');
console.log(t.slice(start, end));
