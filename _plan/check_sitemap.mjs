import fs from 'fs';

const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
const urls = sitemap.match(/<loc>[\s\S]*?<\/loc>/g) || [];
console.log(`Current sitemap URLs count: ${urls.length}`);
console.log(urls.slice(0, 10).map(u => u.replace(/<\/?loc>/g, '')));
