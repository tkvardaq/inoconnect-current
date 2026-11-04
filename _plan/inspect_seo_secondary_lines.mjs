import fs from 'fs';

const html = fs.readFileSync('services/seo/index.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('bg-secondary') || l.includes('text-secondary') || l.includes('border-secondary') || l.includes('secondary')) {
    console.log(`L${idx+1}: ${l.trim().substring(0, 140)}`);
  }
});
