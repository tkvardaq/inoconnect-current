import fs from 'fs';

const t = fs.readFileSync('index.html', 'utf8');
const idx = t.indexOf('cdn.tailwindcss.com');
console.log(t.slice(idx - 100, idx + 600));
