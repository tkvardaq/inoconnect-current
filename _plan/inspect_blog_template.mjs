import fs from 'fs';

const html = fs.readFileSync('blog/accessibility-growth-lever/index.html', 'utf8');

// Hero section
const heroMatch = html.match(/<!-- ── Hero ── -->[\s\S]*?<!-- ── Featured Image ── -->/);
if (heroMatch) {
  console.log('--- HERO SECTION ---');
  console.log(heroMatch[0]);
}

// Sidebar & article layout
const layoutMatch = html.match(/<div class="lg:col-span-8[\s\S]*?<div class="article-content/);
if (layoutMatch) {
  console.log('--- LAYOUT START ---');
  console.log(layoutMatch[0]);
}

// Schema
const schemaMatch = html.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g);
if (schemaMatch) {
  console.log('--- SCHEMAS ---');
  schemaMatch.forEach(s => console.log(s));
}
