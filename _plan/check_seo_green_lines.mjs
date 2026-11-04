import fs from 'fs';
const seoHtml = fs.readFileSync('services/seo/index.html', 'utf8');

const lines = seoHtml.split('\n');
lines.forEach((l, i) => {
  if (l.includes('secondary') || l.includes('44D7A8') || l.includes('44d7a8')) {
    console.log(`L${i+1}: ${l.trim()}`);
  }
});
