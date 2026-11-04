import fs from 'fs';
const t = fs.readFileSync('index.html', 'utf8');
const styles = [...t.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)];
console.log('Total styles:', styles.length);
styles.forEach((s, i) => {
  if (s[1].includes('logo') || s[1].includes('main-logo') || s[1].includes('header')) {
    console.log(`Style ${i}:`, s[1]);
  }
});
