import fs from 'fs';

const html = fs.readFileSync('blog/core-web-vitals-revenue/index.html', 'utf8');
console.log('Total length:', html.length);
console.log('Head slice:', html.substring(0, 500));
const mainMatch = html.match(/<main[\s\S]*?<\/main>/i);
if (mainMatch) {
  console.log('Main start:', mainMatch[0].substring(0, 500));
}
