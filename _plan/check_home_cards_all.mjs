import fs from 'fs';
const indexHtml = fs.readFileSync('index.html', 'utf8');

const services = [
  'seo',
  'ppc',
  'social-media',
  'content-marketing',
  'web-development',
  'digital-strategy',
  'ai-automation',
  'ai-development'
];

for (const s of services) {
  const match = indexHtml.match(new RegExp(`<a\\b[^>]*href=["']/services/${s}["'][^>]*>([\\s\\S]*?)</a>`));
  if (match) {
    const cardHtml = match[0];
    const border = cardHtml.match(/border-2 border-\[#([0-9a-fA-F]+)\]/);
    const bgGrad = cardHtml.match(/bg-gradient-to-br from-\[#([0-9a-fA-F]+)\]/);
    const badge = cardHtml.match(/text-\[#([0-9a-fA-F]+)\]/);
    console.log(`Homepage Card /services/${s}:`);
    console.log(`  Border: ${border ? '#' + border[1] : 'none'}`);
    console.log(`  Gradient: ${bgGrad ? '#' + bgGrad[1] : 'none'}`);
  } else {
    console.log(`Homepage Card /services/${s}: NOT FOUND`);
  }
}
