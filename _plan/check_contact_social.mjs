import fs from 'fs';

const contactHtml = fs.readFileSync('contact/index.html', 'utf8');
const lines = contactHtml.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('linkedin') || l.includes('social') || l.includes('Social') || l.includes('Connect') || l.includes('Follow')) {
    console.log(`L${idx+1}: ${l.trim().substring(0, 120)}`);
  }
});
