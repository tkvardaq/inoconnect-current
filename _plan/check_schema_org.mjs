import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const schemas = html.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g) || [];
schemas.forEach((s, idx) => {
  if (s.includes('Organization')) {
    console.log(`Schema ${idx}:`);
    console.log(s);
  }
});
