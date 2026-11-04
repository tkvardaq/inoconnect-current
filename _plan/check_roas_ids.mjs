import fs from 'fs';
const t = fs.readFileSync('tools/roas-calculator/index.html', 'utf8');
// Find all id attributes in the calculator section
const ids = [...t.matchAll(/id=["']([^"']+)["']/g)].map(m => m[1]);
console.log('All IDs in roas-calculator:');
ids.forEach(id => console.log(' ->', id));
