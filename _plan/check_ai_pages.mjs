import fs from 'fs';

for (const s of ['ai-automation', 'ai-development', 'social-media']) {
  const html = fs.readFileSync(`services/${s}/index.html`, 'utf8');
  console.log(`\n=== ${s} ===`);
  const heroMatch = html.match(/<section[^>]*class="[^"]*(?:pt-|hero|relative)[^"]*"[\s\S]*?<\/section>/i);
  if (heroMatch) {
    console.log(heroMatch[0].slice(0, 1000));
  }
}
