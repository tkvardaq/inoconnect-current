import fs from 'fs';

for (const p of [
  'services/seo/index.html',
  'services/ppc/index.html',
  'services/social-media/index.html',
  'services/content-marketing/index.html',
  'services/web-development/index.html',
  'services/digital-strategy/index.html'
]) {
  const html = fs.readFileSync(p, 'utf8');
  const m = html.match(/<section[^>]*min-h-\[80vh\][^>]*>/i);
  console.log(`\n${p}:\n${m ? m[0] : 'None'}`);
}
