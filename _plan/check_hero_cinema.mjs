import fs from 'fs';
const t = fs.readFileSync('index.html', 'utf8');
const start = t.indexOf('Cinema Story Film Showcase');
console.log(t.slice(start - 50, start + 1200));
