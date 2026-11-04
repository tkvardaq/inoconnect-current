import fs from 'fs';
const t = fs.readFileSync('index.html', 'utf8');
const idx = t.indexOf('id="main-logo"');
console.log(t.slice(Math.max(0, idx - 200), idx + 200));
