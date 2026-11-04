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
  const raw = fs.readFileSync(p, 'utf8');
  const body = raw.replace(/^---[\s\S]*?---/, '').trim();
  const headings = body.match(/^#{1,6}\s+.+$/gm) || [];
  const htmlHeadings = body.match(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi) || [];
  console.log(`=== ${slug} ===`);
  console.log('Markdown headings:', headings.length);
  headings.forEach(h => console.log('  ', h));
  console.log('HTML headings:', htmlHeadings.length);
  htmlHeadings.forEach(h => console.log('  ', h));
}
