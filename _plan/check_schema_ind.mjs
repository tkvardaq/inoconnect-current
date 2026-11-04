import fs from 'fs';

const guide = fs.readFileSync('blog/schema-markup-guide/index.html', 'utf8');

const indLinks = [...guide.matchAll(/href="\/industries\/[^"]*"/g)].map(m => m[0]);
console.log('Industries links in schema-markup-guide:\n', indLinks);
