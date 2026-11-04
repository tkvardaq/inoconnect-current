import fs from 'fs';
const servHtml = fs.readFileSync('services/index.html', 'utf8');

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
  const match = servHtml.match(new RegExp(`<a\\b[^>]*href=["']/services/${s}["'][^>]*>([\\s\\S]*?)</a>`));
  if (match) {
    const chunk = match[0].slice(0, 300);
    const color = chunk.match(/#(?:4169E1|44D7A8|FF7518|[0-9a-fA-F]{6})/i);
    const tw = chunk.match(/(?:text|bg|border)-(primary|secondary|accent)/);
    console.log(`services/index.html -> /services/${s}: Color=${color ? color[0] : 'none'}, TW=${tw ? tw[0] : 'none'}`);
  }
}
