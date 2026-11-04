import fs from 'fs';
const v = fs.readFileSync('_plan/verify.mjs', 'utf8');
const lines = v.split('\n');
console.log('Line 117:', JSON.stringify(lines[116]));
