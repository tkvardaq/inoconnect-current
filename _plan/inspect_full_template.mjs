import fs from 'fs';

const content = fs.readFileSync('blog/schema-markup-guide/index.html', 'utf8');

// Print head
const head = content.match(/<head>([\s\S]*?)<\/head>/);
console.log('--- HEAD ---');
console.log(head ? head[0].slice(0, 1500) : 'none');

// Print main start
const main = content.match(/<main id="main"[^>]*>([\s\S]*?)<\/main>/);
console.log('--- MAIN START (first 1000) ---');
console.log(main ? main[0].slice(0, 1000) : 'none');

// Find article body wrapper
const art = content.match(/<article[^>]*>([\s\S]*?)<\/article>/);
console.log('--- ARTICLE WRAPPER ---');
if (art) {
  console.log(art[0].slice(0, 400));
}
