import fs from 'fs';

const blogIndex = fs.readFileSync('blog/index.html', 'utf8');

// Find all article links in blog/index.html
const matches = [...blogIndex.matchAll(/href="\/blog\/([a-z0-9-]+)"/g)].map(m => m[1]);
console.log('Article links in blog/index.html:', matches.length);
console.log(matches);

// Let's inspect one card snippet
const cardMatch = blogIndex.match(/<article[\s\S]*?<\/article>/);
if (cardMatch) {
  console.log('\nSample card:\n', cardMatch[0].slice(0, 1000));
}
