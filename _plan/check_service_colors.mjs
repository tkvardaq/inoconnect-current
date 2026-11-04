import fs from 'fs';
import path from 'path';

const root = process.cwd();

// 1. Inspect header mega menu in index.html
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const megaMenuMatch = indexHtml.match(/<!-- Services Mega Menu -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/);
console.log('--- MEGA MENU SERVICE ITEMS ---');
if (megaMenuMatch) {
  const items = [...megaMenuMatch[0].matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/g)];
  for (const item of items) {
    const href = item[1];
    const html = item[2];
    // Find colors in this item
    const colors = [...html.matchAll(/(?:bg|text|border)-\[#([0-9a-fA-F]+)\]/g)].map(m => '#' + m[1]);
    const twColors = [...html.matchAll(/(?:bg|text|border)-(primary|secondary|accent|emerald|blue|green|orange|purple|indigo|cyan)-[0-9]+/g)].map(m => m[0]);
    console.log(`Mega Menu Item: ${href}`);
    console.log(`  Colors: ${[...new Set(colors)].join(', ')} | TW: ${[...new Set(twColors)].join(', ')}`);
    // Print title
    const title = html.match(/<div class="[^"]*font-bold[^"]*">([^<]+)<\/div>/);
    if (title) console.log(`  Title: ${title[1].trim()}`);
  }
}

// 2. Inspect homepage services section
console.log('\n--- HOMEPAGE SERVICE CARDS ---');
const svcSection = indexHtml.match(/<!-- Core Services Section[\s\S]*?<\/section>/);
if (svcSection) {
  const cards = [...svcSection[0].matchAll(/<a\b[^>]*href=["'](\/services\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/g)];
  for (const card of cards) {
    const href = card[1];
    const html = card[2];
    const colors = [...html.matchAll(/#(?:4169E1|44D7A8|FF7518|[0-9a-fA-F]{6})/gi)].map(m => m[0].toUpperCase());
    console.log(`Card: ${href}`);
    console.log(`  Hex Colors: ${[...new Set(colors)].join(', ')}`);
  }
}
