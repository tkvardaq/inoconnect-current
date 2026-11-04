import fs from 'fs';
const t = fs.readFileSync('blog/technical-seo-audit/index.html', 'utf8');
const lines = t.split('\n');
lines.forEach((l, i) => {
  if (l.includes('2024') || l.includes('time') || l.includes('April') || l.includes('Published')) {
    console.log(`Line ${i+1}: ${l}`);
  }
});
