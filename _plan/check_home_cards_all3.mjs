import fs from 'fs';
const indexHtml = fs.readFileSync('index.html', 'utf8');

const idx = 54896;
const section = indexHtml.slice(idx - 200, idx + 10000);
// Find all service cards
const cards = [...section.matchAll(/<!--\s*([0-9]+\.[^>]+)\s*-->/g)];
cards.forEach(c => {
  const cIdx = c.index;
  const chunk = section.slice(cIdx, cIdx + 400);
  console.log(`\n=== ${c[1]} ===`);
  const color = chunk.match(/#([0-9a-fA-F]{6})/);
  console.log(`Color: ${color ? '#' + color[1] : 'none'}`);
  console.log(chunk.slice(0, 250));
});
