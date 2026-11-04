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
  const imgs = body.match(/<img[^>]*>/g) || [];
  const mdImgs = body.match(/!\[[^\]]*\]\([^)]+\)/g) || [];
  console.log(slug, { htmlImgs: imgs.length, mdImgs: mdImgs.length });
  if (imgs.length > 0) console.log(' HTML imgs:', imgs);
  if (mdImgs.length > 0) console.log(' MD imgs:', mdImgs);
}
