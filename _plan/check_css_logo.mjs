import fs from 'fs';
const css = fs.readFileSync('_astro/about.Bi_RrpmH.css', 'utf8');
const lines = css.split('\n');
console.log('CSS lines:', lines.length);
// Let's search for img or logo
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('logo') || (lines[i].includes('img') && lines[i].includes('height'))) {
    console.log(`Line ${i}:`, lines[i].slice(0, 100));
  }
}
