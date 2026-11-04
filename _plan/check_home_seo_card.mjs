import fs from 'fs';
const indexHtml = fs.readFileSync('index.html', 'utf8');
// Search for seo card or link
const matches = [...indexHtml.matchAll(/<a\b[^>]*href=["']\/services\/seo[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi)];
console.log('Homepage SEO links:', matches.length);
matches.forEach((m, i) => {
  console.log(`\n--- SEO Match ${i} ---`);
  console.log(m[0].slice(0, 400));
});

// Also search for SEO section or cards
const idx = indexHtml.indexOf('/services/seo');
console.log('\nContext around /services/seo on homepage:');
console.log(indexHtml.slice(idx - 300, idx + 400));
