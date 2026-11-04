import fs from 'fs';

const content = fs.readFileSync('blog/schema-markup-guide/index.html', 'utf8');

const mainMatch = content.match(/<main id="main"[^>]*>([\s\S]*?)<\/main>/);
if (mainMatch) {
  const parts = mainMatch[1].split('<aside');
  console.log('Parts count with <aside:', parts.length);
  parts.slice(1).forEach((p, i) => {
    console.log(`\n=== Aside ${i + 1} (start) ===\n`, p.slice(0, 400));
  });
}
