import fs from 'fs';

const verify = fs.readFileSync('_plan/verify.mjs', 'utf8');
const lines = verify.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('Twitter') || l.includes('LinkedIn') || l.includes('social') || l.includes('Instagram')) {
    console.log(`L${idx+1}: ${l.trim()}`);
  }
});
