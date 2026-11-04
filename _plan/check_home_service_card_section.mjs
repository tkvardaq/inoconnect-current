import fs from 'fs';
const indexHtml = fs.readFileSync('index.html', 'utf8');

const idx = 54896;
console.log(indexHtml.slice(idx - 400, idx + 1500));
