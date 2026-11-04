import fs from 'fs';

const sm = fs.readFileSync('sitemap.xml', 'utf8');
const sample = sm.match(/<url>[\s\S]*?<loc>https:\/\/inoconnect\.com\/blog\/[\s\S]*?<\/url>/);
console.log(sample ? sample[0] : 'no match');
