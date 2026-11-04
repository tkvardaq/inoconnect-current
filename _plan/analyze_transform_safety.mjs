import fs from 'fs';

const pagesToTransform = [
  { file: 'services/seo/index.html', from: 'secondary', to: 'primary', hexFrom: '#44D7A8', hexTo: '#4169E1' },
  { file: 'services/ppc/index.html', from: 'primary', to: 'accent', hexFrom: '#4169E1', hexTo: '#FF7518' },
  { file: 'services/content-marketing/index.html', from: 'accent', to: 'primary', hexFrom: '#FF7518', hexTo: '#4169E1' },
  { file: 'services/web-development/index.html', from: 'primary', to: 'accent', hexFrom: '#4169E1', hexTo: '#FF7518' },
  { file: 'services/digital-strategy/index.html', from: 'accent', to: 'secondary', hexFrom: '#FF7518', hexTo: '#44D7A8' },
  { file: 'industries/b2b/index.html', from: 'secondary', to: 'accent', hexFrom: '#44D7A8', hexTo: '#FF7518' },
  { file: 'industries/healthcare/index.html', from: 'primary', to: 'secondary', hexFrom: '#4169E1', hexTo: '#44D7A8' },
  { file: 'industries/startups/index.html', from: 'accent', to: 'secondary', hexFrom: '#FF7518', hexTo: '#44D7A8' },
  { file: 'industries/professional-services/index.html', from: 'secondary', to: 'primary', hexFrom: '#44D7A8', hexTo: '#4169E1' },
];

for (const p of pagesToTransform) {
  const html = fs.readFileSync(p.file, 'utf8');
  const mainMatch = html.match(/<main[\s\S]*?<\/main>/i);
  if (!mainMatch) continue;
  const main = mainMatch[0];
  
  // Check plain text uses of the word
  const plainRegex = new RegExp(`\\b${p.from}\\b`, 'gi');
  let match;
  const nonClassUses = [];
  while ((match = plainRegex.exec(main)) !== null) {
    const start = Math.max(0, match.index - 30);
    const end = Math.min(main.length, match.index + 30);
    const snippet = main.substring(start, end).replace(/\s+/g, ' ');
    if (!snippet.includes('class=') && !snippet.includes('style=')) {
      nonClassUses.push(snippet);
    }
  }
  
  console.log(`\n=== ${p.file} (${p.from} -> ${p.to}) ===`);
  console.log(`Total occurrences in <main>: ${(main.match(new RegExp(p.from, 'g')) || []).length}`);
  if (nonClassUses.length) {
    console.log(`Potential non-class uses: ${nonClassUses.length}`);
    nonClassUses.slice(0, 5).forEach(u => console.log(`  "${u}"`));
  } else {
    console.log('No non-class uses detected.');
  }
}
