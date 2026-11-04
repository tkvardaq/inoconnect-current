import fs from 'fs';
const ppcHtml = fs.readFileSync('services/ppc/index.html', 'utf8');

const lines = ppcHtml.split('\n');
lines.forEach((l, i) => {
  if (l.includes('primary') && (l.includes('bg-primary') || l.includes('text-primary') || l.includes('border-primary') || l.includes('from-primary'))) {
    console.log(`L${i+1}: ${l.trim()}`);
  }
});
