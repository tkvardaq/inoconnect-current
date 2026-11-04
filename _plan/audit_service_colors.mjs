import fs from 'fs';
import path from 'path';

// Let's inspect header mega-menu, homepage services section, services/index.html, and individual service pages.
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

console.log('=== SERVICE COLOR AUDIT ===\n');

// 1. Header mega menu in index.html
const indexHtml = fs.readFileSync('index.html', 'utf8');
const headerMatch = indexHtml.match(/<header[\s\S]*?<\/header>/i)?.[0] || '';

console.log('--- HEADER MEGA-MENU ICONS & COLORS ---');
for (const s of services) {
  const regex = new RegExp(`href="\\/services\\/${s}"[\\s\\S]*?<\\/a>`, 'i');
  // Also check preceding div/span if icon is inside or around
  const broaderRegex = new RegExp(`(?:<a[^>]*href="\\/services\\/${s}"[^>]*>[\\s\\S]*?<\\/a>|<div[^>]*>[\\s\\S]*?href="\\/services\\/${s}"[\\s\\S]*?<\\/div>)`, 'i');
  const match = headerMatch.match(broaderRegex) || headerMatch.match(regex);
  if (match) {
    const text = match[0];
    const colors = text.match(/(?:#4169E1|#FF7518|#44D7A8|text-primary|text-accent|text-secondary|bg-primary|bg-accent|bg-secondary|from-primary|from-accent|from-secondary)/gi) || [];
    console.log(`${s.padEnd(20)}: ${colors.join(', ')}`);
  } else {
    console.log(`${s.padEnd(20)}: NOT FOUND in header`);
  }
}

// 2. Homepage Services Grid
console.log('\n--- HOMEPAGE SERVICES GRID ---');
const homeGridMatch = indexHtml.match(/<!-- Services Grid -->[\s\S]*?<!-- End Services Grid -->|id="services"[\s\S]*?<\/section>/i)?.[0] || '';
for (const s of services) {
  const cardRegex = new RegExp(`href="\\/services\\/${s}"[\\s\\S]{0,500}`, 'i');
  // or look for card container containing this link
  const match = indexHtml.match(new RegExp(`(?:<div[^>]*class="[^"]*(?:group|rounded)[^"]*"[^>]*>[\\s\\S]*?href="\\/services\\/${s}"[\\s\\S]*?<\\/div>)`, 'i'));
  const cardSnippet = match ? match[0] : '';
  const colors = cardSnippet.match(/(?:#4169E1|#FF7518|#44D7A8|text-primary|text-accent|text-secondary|bg-primary|bg-accent|bg-secondary|from-primary|from-accent|from-secondary)/gi) || [];
  console.log(`${s.padEnd(20)}: ${colors.slice(0, 8).join(', ')}`);
}

// 3. services/index.html Grid
console.log('\n--- SERVICES/INDEX.HTML CARDS ---');
const servIndexHtml = fs.readFileSync('services/index.html', 'utf8');
for (const s of services) {
  const match = servIndexHtml.match(new RegExp(`href="\\/services\\/${s}"[\\s\\S]{0,300}`, 'i'));
  const snippet = match ? match[0] : '';
  const colors = snippet.match(/(?:#4169E1|#FF7518|#44D7A8|text-primary|text-accent|text-secondary|bg-primary|bg-accent|bg-secondary|from-primary|from-accent|from-secondary|border-primary|border-accent|border-secondary)/gi) || [];
  console.log(`${s.padEnd(20)}: ${colors.slice(0, 8).join(', ')}`);
}

// 4. Subpage Inspection
console.log('\n--- SUBPAGE HERO & KEY ACCENT COLORS ---');
for (const s of services) {
  const pagePath = path.join('services', s, 'index.html');
  if (fs.existsSync(pagePath)) {
    const pageHtml = fs.readFileSync(pagePath, 'utf8');
    // Find Hero Section
    const heroMatch = pageHtml.match(/<section[^>]*class="[^"]*(?:pt-|hero)[^"]*"[\s\S]*?<\/section>/i) || pageHtml.match(/<main[\s\S]*?<\/h1>[\s\S]*?<\/div>/i);
    const heroSnippet = heroMatch ? heroMatch[0] : pageHtml.substring(0, 3000);
    const heroColors = heroSnippet.match(/(?:#4169E1|#FF7518|#44D7A8|text-primary|text-accent|text-secondary|bg-primary|bg-accent|bg-secondary|from-primary|from-accent|from-secondary|border-primary|border-accent|border-secondary)/gi) || [];
    
    // Overall page dominant color classes count
    const primaryCount = (pageHtml.match(/primary/g) || []).length;
    const accentCount = (pageHtml.match(/accent/g) || []).length;
    const secondaryCount = (pageHtml.match(/secondary/g) || []).length;
    
    console.log(`${s.padEnd(20)}: Hero: [${[...new Set(heroColors)].join(', ')}] | Counts: primary=${primaryCount}, accent=${accentCount}, secondary=${secondaryCount}`);
  }
}
