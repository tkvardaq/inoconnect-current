import fs from 'fs';

const html = fs.readFileSync('blog/core-web-vitals-revenue/index.html', 'utf8');
const heroImg = html.match(/<img[^>]+class="[^"]*(?:w-full|rounded)[^"]*"[^>]*>/i);
console.log(heroImg ? heroImg[0] : 'Not found');
