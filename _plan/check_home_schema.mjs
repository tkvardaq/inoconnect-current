import fs from 'fs';

const t = fs.readFileSync('index.html', 'utf8');
const schemas = [...t.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
console.log('Schemas in index.html:', schemas.length);
schemas.forEach((s, i) => console.log(`Schema ${i+1}:\n`, s[1]));
