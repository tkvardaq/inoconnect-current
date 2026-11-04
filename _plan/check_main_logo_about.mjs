import fs from 'fs';
const t = fs.readFileSync('about/index.html', 'utf8');
const m = t.match(/<img[^>]*id="main-logo"[^>]*>/);
console.log(m ? m[0] : 'not found');
