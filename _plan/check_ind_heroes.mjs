import fs from 'fs';

for (const p of [
  'industries/saas/index.html',
  'industries/ecommerce/index.html',
  'industries/b2b/index.html',
  'industries/healthcare/index.html',
  'industries/education/index.html',
  'industries/startups/index.html',
  'industries/professional-services/index.html'
]) {
  const html = fs.readFileSync(p, 'utf8');
  const m = html.match(/<section[^>]*min-h-\[80vh\][^>]*>/i);
  console.log(`\n${p}:\n${m ? m[0] : 'None'}`);
}
