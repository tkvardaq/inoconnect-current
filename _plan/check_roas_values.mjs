import fs from 'fs';
const t = fs.readFileSync('tools/roas-calculator/index.html', 'utf8');

const fields = ['roas-out', 'breakeven-out', 'profit-out', 'net-margin-out', 'max-cac-out', 'orders-out'];
for (const f of fields) {
  const m = t.match(new RegExp(`id="${f}"[^>]*>([^<]+)<`));
  console.log(`${f}:`, m ? m[1].trim() : 'NOT FOUND');
}
