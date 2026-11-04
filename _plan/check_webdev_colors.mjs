import fs from 'fs';
const webHtml = fs.readFileSync('services/web-development/index.html', 'utf8');

const heroMatch = webHtml.match(/<section\b[^>]*class=["'][^"']*pt-[\s\S]*?<\/section>/i) || [''];
console.log('web-development hero snippet:');
console.log(heroMatch[0].slice(0, 1000));
