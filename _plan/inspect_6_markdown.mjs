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

const blogDir = 'D:/AI/inoconnect-site/src/content/blog';

for (const slug of slugs) {
  const filePath = path.join(blogDir, `${slug}.md`);
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`=== ${slug} ===`);
  const lines = content.split('\n');
  const frontmatter = [];
  let inFm = false;
  for (const line of lines) {
    if (line.trim() === '---') {
      if (inFm) break;
      inFm = true;
      continue;
    }
    if (inFm) frontmatter.push(line);
  }
  console.log(frontmatter.join('\n'));
  console.log('--- Body word count ~:', content.split(/\s+/).length);
  console.log('First 200 chars of body:');
  const body = content.replace(/^---[\s\S]*?---/, '').trim();
  console.log(body.slice(0, 200));
  console.log('\n');
}
