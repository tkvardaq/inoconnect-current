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
  const idx = indexHtml.indexOf(`href="/services/${s}"`);
  if (idx !== -1) {
    // Find the enclosing card tag
    const snippet = indexHtml.slice(idx - 100, idx + 400);
    console.log(`\n=== Card for /services/${s} ===`);
    console.log(snippet);
  }
}
