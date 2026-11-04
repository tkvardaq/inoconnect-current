import fs from 'fs';

const guide = fs.readFileSync('blog/schema-markup-guide/index.html', 'utf8');

const btn = guide.match(/<button\b[^>]*id="mobile-menu-toggle"[^>]*>/);
console.log('Toggle in guide:\n', btn ? btn[0] : 'not found');

const liLink = guide.match(/href="[^"]*linkedin\.com[^"]*"/g);
console.log('LinkedIn in guide:\n', liLink);

const liInFooter = guide.match(/<footer[\s\S]*?<\/footer>/);
if (liInFooter) {
  const li = liInFooter[0].match(/href="[^"]*linkedin[^"]*"/g);
  console.log('LinkedIn in footer:\n', li);
}
