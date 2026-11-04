import fs from 'fs';

const indIndex = fs.readFileSync('industries/index.html', 'utf8');
const industries = ['saas', 'ecommerce', 'b2b', 'healthcare', 'education', 'startups', 'professional-services'];

console.log('=== INDUSTRIES HUB CARDS ===');
for (const ind of industries) {
  const match = indIndex.match(new RegExp(`href="\\/industries\\/${ind}"[\\s\\S]{0,300}`, 'i'));
  const snippet = match ? match[0] : '';
  const colors = snippet.match(/(?:#4169E1|#FF7518|#44D7A8|text-primary|text-accent|text-secondary|bg-primary|bg-accent|bg-secondary|from-primary|from-accent|from-secondary|border-primary|border-accent|border-secondary)/gi) || [];
  console.log(`${ind.padEnd(25)}: ${colors.slice(0, 8).join(', ')}`);
}

console.log('\n=== INDUSTRIES SUBPAGE DOMINANT COLORS ===');
for (const ind of industries) {
  const html = fs.readFileSync(`industries/${ind}/index.html`, 'utf8');
  const mainMatch = html.match(/<main[\s\S]*?<\/main>/i)?.[0] || '';
  const p = (mainMatch.match(/primary/g) || []).length;
  const s = (mainMatch.match(/secondary/g) || []).length;
  const a = (mainMatch.match(/accent/g) || []).length;
  const b = (mainMatch.match(/#4169E1/gi) || []).length;
  const o = (mainMatch.match(/#FF7518/gi) || []).length;
  const g = (mainMatch.match(/#44D7A8/gi) || []).length;
  console.log(`${ind.padEnd(25)}: p=${p}, s=${s}, a=${a} | hex(B=${b}, O=${o}, G=${g})`);
}
