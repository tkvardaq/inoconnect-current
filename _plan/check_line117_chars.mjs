import fs from 'fs';
const v = fs.readFileSync('_plan/verify.mjs', 'utf8');
const lines = v.split('\n');
const line = lines[116];
console.log('Line 117 length:', line.length);
const idx = line.indexOf('datePublished');
console.log(line.slice(idx, idx + 40));
console.log(line.slice(idx, idx + 30).split('').map(c => c.charCodeAt(0) + ' (' + c + ')').join(', '));
