import fs from 'fs';

const sm = fs.readFileSync('sitemap.xml', 'utf8');
console.log('Sitemap length:', sm.length);
const urls = [...sm.matchAll(/<loc>https:\/\/inoconnect\.com([^<]*)<\/loc>/g)].map(m => m[1]);
console.log('Current URL count:', urls.length);
console.log('Last 10 URLs in sitemap:\n', urls.slice(-10));
