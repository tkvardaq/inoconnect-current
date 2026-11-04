import fs from 'fs';
import path from 'path';

const slugs = [
  'ai-marketing-tools',
  'digital-marketing-strategy',
  'how-to-improve-conversion-rate',
  'ppc-vs-seo',
  'roas-formula',
  'what-is-cost-per-click'
];

for (const slug of slugs) {
  const p = path.join('D:/AI/inoconnect-site/src/content/blog', `${slug}.md`);
  const body = fs.readFileSync(p, 'utf8');
  const links = [...body.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
  console.log(`=== ${slug} ===`);
  links.forEach(l => console.log(' ', l));
}
