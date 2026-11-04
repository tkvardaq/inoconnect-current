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
  // Check postcodes
  const usZip = body.match(/\b(CA|NY|TX|FL|WA|IL|MA|NJ|PA)\s+\d{5}\b/);
  const ukPc = body.match(/\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b/);
  const fakeClaims = body.match(/guarantee|100%|#1|world'?s best/i);
  console.log(slug, {
    usZip: !!usZip,
    ukPc: !!ukPc,
    fakeClaims: fakeClaims ? fakeClaims[0] : null
  });
}
