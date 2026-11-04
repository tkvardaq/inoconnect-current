import fs from 'fs';
const indexHtml = fs.readFileSync('index.html', 'utf8');

const matches = [...indexHtml.matchAll(/<!--\s*([^-]+)\s*-->/g)];
matches.forEach(m => {
  if (m[1].toLowerCase().includes('service')) {
    console.log(m[1].trim());
  }
});
