import fs from 'fs';

const pages = [
  'services/seo/index.html',
  'services/ppc/index.html',
  'services/content-marketing/index.html',
  'services/web-development/index.html',
  'services/digital-strategy/index.html',
  'industries/b2b/index.html',
  'industries/healthcare/index.html',
  'industries/startups/index.html',
  'industries/professional-services/index.html'
];

for (const p of pages) {
  const html = fs.readFileSync(p, 'utf8');
  const styleMatch = html.match(/<style[^>]*>[\s\S]*?<\/style>/i);
  console.log(`\n=== ${p} ===`);
  if (styleMatch) {
    const lines = styleMatch[0].split('\n').filter(l => l.includes('--primary') || l.includes('category-link') || l.includes('active'));
    lines.forEach(l => console.log('  ', l.trim()));
  } else {
    console.log('  No <style> block');
  }
}
