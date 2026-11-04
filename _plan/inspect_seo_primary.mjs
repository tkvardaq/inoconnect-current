import fs from 'fs';

const seoHtml = fs.readFileSync('services/seo/index.html', 'utf8');
const mainMatch = seoHtml.match(/<main[\s\S]*?<\/main>/i)?.[0] || '';

const matches = mainMatch.match(/[a-z0-9:\/_-]*primary[a-z0-9:\/_-]*/g) || [];
const unique = [...new Set(matches)];
console.log('SEO unique primary classes in <main>:\n', unique.join(', '));

// Also let's inspect where primary is used in <main>
const lines = mainMatch.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('primary')) {
    console.log(`L${idx}: ${l.trim().substring(0, 120)}`);
  }
});
