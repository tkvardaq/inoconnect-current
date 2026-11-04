import fs from 'fs';
const indexHtml = fs.readFileSync('index.html', 'utf8');

// Find all occurrences of /services/seo
const matches = [...indexHtml.matchAll(/href="\/services\/seo"/g)];
for (const m of matches) {
  const idx = m.index;
  console.log('--- Occurrence at index', idx, '---');
  console.log(indexHtml.slice(idx - 150, idx + 250));
}
