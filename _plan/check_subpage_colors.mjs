import fs from 'fs';
import path from 'path';

const root = process.cwd();
const services = [
  'seo',
  'ppc',
  'social-media',
  'content-marketing',
  'web-development',
  'digital-strategy',
  'ai-automation',
  'ai-development'
];

for (const s of services) {
  const file = path.join(root, 'services', s, 'index.html');
  if (!fs.existsSync(file)) continue;
  const t = fs.readFileSync(file, 'utf8');

  // Count occurrences of brand hex colors
  const blueCount = (t.match(/#4169E1/gi) || []).length;
  const greenCount = (t.match(/#44D7A8/gi) || []).length;
  const orangeCount = (t.match(/#FF7518/gi) || []).length;

  // Check hero section badge/heading colors
  const heroMatch = t.match(/<section\b[^>]*class=["'][^"']*pt-[\s\S]*?<\/section>/i) || [''];
  const heroBlue = (heroMatch[0].match(/#4169E1/gi) || []).length;
  const heroGreen = (heroMatch[0].match(/#44D7A8/gi) || []).length;
  const heroOrange = (heroMatch[0].match(/#FF7518/gi) || []).length;

  console.log(`Service: services/${s}/index.html`);
  console.log(`  Total: Blue(#4169E1)=${blueCount}, Green(#44D7A8)=${greenCount}, Orange(#FF7518)=${orangeCount}`);
  console.log(`  Hero:  Blue=${heroBlue}, Green=${heroGreen}, Orange=${heroOrange}`);

  // Find badge in hero
  const badgeMatch = heroMatch[0].match(/<span\b[^>]*class=["'][^"']*(?:badge|rounded-full|tracking-widest)[^"']*["'][^>]*>([\s\S]*?)<\/span>/i);
  if (badgeMatch) {
    console.log(`  Hero Badge Snippet: ${badgeMatch[0].slice(0, 100)}`);
  }
}
