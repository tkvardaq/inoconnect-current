import fs from 'fs';
import path from 'path';

const newArticles = [
  'ai-marketing-tools.md',
  'digital-marketing-strategy.md',
  'how-to-improve-conversion-rate.md',
  'ppc-vs-seo.md',
  'roas-formula.md',
  'what-is-cost-per-click.md'
];

const blogDir = 'D:\\AI\\inoconnect-site\\src\\content\\blog';

for (const a of newArticles) {
  const full = path.join(blogDir, a);
  const content = fs.readFileSync(full, 'utf8');
  console.log(`\n=================== ${a} ===================`);
  console.log(content.substring(0, 400));
}
