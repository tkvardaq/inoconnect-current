import fs from 'fs';

const verify = fs.readFileSync('_plan/verify.mjs', 'utf8');
const lines = verify.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('blog') || l.includes('Blog') || l.includes('sitemap') || l.includes('Sitemap')) {
    console.log(`L${idx+1}: ${l.trim()}`);
  }
});
