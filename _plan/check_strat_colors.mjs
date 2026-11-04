import fs from 'fs';
const stratHtml = fs.readFileSync('services/digital-strategy/index.html', 'utf8');

const heroMatch = stratHtml.match(/<section\b[^>]*class=["'][^"']*pt-[\s\S]*?<\/section>/i) || [''];
console.log('digital-strategy hero snippet:');
console.log(heroMatch[0].slice(0, 1000));
