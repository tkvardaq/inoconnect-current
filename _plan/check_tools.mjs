import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const header = html.slice(html.indexOf('<header'), html.indexOf('</header>'));

console.log('=== HEADER TOOL LINKS ===');
const toolRegex = /<a[^>]*href="\/tools\/([a-z-]+)"[^>]*>([\s\S]*?)<\/a>/g;
let match;
while ((match = toolRegex.exec(header)) !== null) {
  const [full, slug, inner] = match;
  console.log(`\nTool: /tools/${slug}`);
  console.log(`Snippet: ${full.replace(/\s+/g, ' ').substring(0, 250)}`);
}

const tools = ['roas-calculator', 'breakeven-roas-calculator', 'ltv-calculator', 'ad-waste-calculator'];
console.log('\n=== TOOLS HUB CARDS ===');
const toolIndex = fs.readFileSync('tools/index.html', 'utf8');
for (const t of tools) {
  const m = toolIndex.match(new RegExp(`href="\\/tools\\/${t}"[\\s\\S]{0,300}`, 'i'));
  console.log(`${t.padEnd(30)}: ${m ? m[0].replace(/\s+/g, ' ').substring(0, 150) : 'None'}`);
}

console.log('\n=== TOOL SUBPAGES ===');
for (const t of tools) {
  const thtml = fs.readFileSync(`tools/${t}/index.html`, 'utf8');
  const mainMatch = thtml.match(/<main[\s\S]*?<\/main>/i)?.[0] || '';
  const p = (mainMatch.match(/primary/g) || []).length;
  const s = (mainMatch.match(/secondary/g) || []).length;
  const a = (mainMatch.match(/accent/g) || []).length;
  const b = (mainMatch.match(/#4169E1/gi) || []).length;
  const o = (mainMatch.match(/#FF7518/gi) || []).length;
  const g = (mainMatch.match(/#44D7A8/gi) || []).length;
  console.log(`${t.padEnd(30)}: p=${p}, s=${s}, a=${a} | hex(B=${b}, O=${o}, G=${g})`);
}
