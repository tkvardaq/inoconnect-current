import fs from 'fs';

const verify = fs.readFileSync('_plan/verify.mjs', 'utf8');
const lines = verify.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('Target Industries') || l.includes('Growth Services') || l.includes('Strategy Guides') || l.includes('ribbon')) {
    console.log(`L${idx+1}: ${l.trim()}`);
  }
});
