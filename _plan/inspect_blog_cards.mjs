import fs from 'fs';

const blogIndex = fs.readFileSync('blog/index.html', 'utf8');

// Inspect first 2 cards in blog/index.html
const cards = blogIndex.match(/<article[\s\S]*?<\/article>/g) || [];
console.log('Total cards found:', cards.length);
if (cards.length > 0) {
  console.log('=== Card 1 ===\n', cards[0]);
  console.log('\n=== Card 2 ===\n', cards[1]);
}

// Find category tabs / buttons
const filterMatch = blogIndex.match(/<div class="[^"]*flex[^"]*filter[^"]*"[\s\S]*?<\/div>/) || blogIndex.match(/data-category[\s\S]*?<\/div>/);
console.log('Filters:\n', filterMatch ? filterMatch[0] : 'no filter container matched');
