import fs from 'fs';

const slugs = ['schema-markup-guide', 'technical-seo-audit', 'core-web-vitals-revenue'];

for (const slug of slugs) {
  const content = fs.readFileSync(`blog/${slug}/index.html`, 'utf8');
  console.log(`=== ${slug} ===`);
  const title = content.match(/<title>([^<]+)<\/title>/);
  const desc = content.match(/<meta name="description" content="([^"]+)"/);
  const h1 = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const time = content.match(/<time datetime="([^"]+)">([^<]+)<\/time>/);
  const img = content.match(/<img[^>]+src="([^"]+)"[^>]*>/g);
  console.log('Title:', title ? title[1] : 'none');
  console.log('Desc len:', desc ? desc[1].length : 0);
  console.log('Time:', time ? `${time[1]} -> ${time[2]}` : 'none');
  console.log('H1:', h1 ? h1[1].replace(/\s+/g, ' ').trim() : 'none');
  console.log('Images:', img ? img.slice(0, 3) : 'none');
}
