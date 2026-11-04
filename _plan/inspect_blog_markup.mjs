import fs from 'fs';

const content = fs.readFileSync('blog/schema-markup-guide/index.html', 'utf8');

const mainMatch = content.match(/<main id="main"[^>]*>([\s\S]*?)<\/main>/);
if (mainMatch) {
  console.log('Main length:', mainMatch[0].length);
  console.log('Main start:\n', mainMatch[0].slice(0, 1500));
  console.log('...\nMain end:\n', mainMatch[0].slice(-1000));
}
