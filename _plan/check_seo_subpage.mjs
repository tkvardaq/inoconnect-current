import fs from 'fs';
const seoHtml = fs.readFileSync('services/seo/index.html', 'utf8');
// Find badge, hero, accents
const start = seoHtml.indexOf('<main');
console.log(seoHtml.slice(start, start + 1500));
