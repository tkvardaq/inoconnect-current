import fs from 'fs';

const seoHtml = fs.readFileSync('services/seo/index.html', 'utf8');
const mainMatch = seoHtml.match(/<main[\s\S]*?<\/main>/i)?.[0] || '';

// Find all classes containing secondary
const matches = mainMatch.match(/[a-z0-9:\/_-]*secondary[a-z0-9:\/_-]*/g) || [];
const unique = [...new Set(matches)];
console.log('SEO unique secondary classes in <main>:\n', unique.join(', '));
