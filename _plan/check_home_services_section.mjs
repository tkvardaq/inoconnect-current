import fs from 'fs';
const indexHtml = fs.readFileSync('index.html', 'utf8');

const start = indexHtml.indexOf('<!-- Services (3 cols) -->');
console.log(indexHtml.slice(start, start + 3000));
