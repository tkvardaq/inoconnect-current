import fs from 'fs';

for (const t of ['cro-simulator', 'email-revenue-simulator', 'ltv-calculator', 'roas-calculator']) {
  const html = fs.readFileSync(`tools/${t}/index.html`, 'utf8');
  const heroMatch = html.match(/<section[^>]*class="[^"]*(?:pt-|hero|relative)[^"]*"[\s\S]*?<\/section>/i);
  console.log(`\n=== TOOL: ${t} ===`);
  if (heroMatch) {
    console.log(heroMatch[0].slice(0, 500));
  }
}
