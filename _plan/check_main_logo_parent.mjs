import fs from 'fs';
const t = fs.readFileSync('index.html', 'utf8');
const idx = t.indexOf('id="main-logo"');
console.log(t.slice(idx - 400, idx));
