import fs from 'fs';

for (const s of ['seo', 'ppc', 'content-marketing', 'web-development', 'digital-strategy', 'social-media']) {
  const html = fs.readFileSync(`services/${s}/index.html`, 'utf8');
  const catMatch = html.match(/class="category-link[^"]*"[\s\S]{0,300}/);
  if (catMatch) {
    console.log(`\n=== ${s} category-link ===`);
    console.log(catMatch[0]);
  }
}
