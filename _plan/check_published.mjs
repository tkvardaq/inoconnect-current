import fs from 'fs';
const fp = 'blog/technical-seo-audit/index.html';
const t = fs.readFileSync(fp, 'utf8');
const m = t.match(/"datePublished"[^,]*/);
console.log(m ? m[0] : 'not found');
