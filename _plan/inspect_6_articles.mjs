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

const distBlog = 'D:\\AI\\inoconnect-site\\dist\\blog';

for (const slug of slugs) {
  const filePath = path.join(distBlog, slug, 'index.html');
  if (fs.existsSync(filePath)) {
    const html = fs.readFileSync(filePath, 'utf8');
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i);
    const imgMatches = html.match(/<img[^>]+src="([^"]+)"/g) || [];
    console.log(`\n=== ${slug} ===`);
    console.log(`Title: ${titleMatch ? titleMatch[1] : 'None'} (len: ${titleMatch ? titleMatch[1].length : 0})`);
    console.log(`Desc: ${descMatch ? descMatch[1] : 'None'} (len: ${descMatch ? descMatch[1].length : 0})`);
    console.log(`Images:`, imgMatches);
  } else {
    console.log(`MISSING: ${filePath}`);
  }
}
