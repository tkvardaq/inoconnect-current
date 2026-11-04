import fs from 'fs';
import path from 'path';

const root = process.cwd();
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const services = [
  { slug: 'seo', name: 'SEO & Organic' },
  { slug: 'ppc', name: 'PPC & Paid Ads' },
  { slug: 'social-media', name: 'Social Media' },
  { slug: 'content-marketing', name: 'Content Marketing' },
  { slug: 'web-development', name: 'Web Development' },
  { slug: 'digital-strategy', name: 'Digital Strategy' },
  { slug: 'ai-automation', name: 'AI Automation' },
  { slug: 'ai-development', name: 'AI Development' }
];

console.log('=== SERVICE COLOR MAPPING ACROSS THE SITE ===\n');

for (const s of services) {
  console.log(`--- ${s.name} (/services/${s.slug}) ---`);

  // 1. Mega Menu
  const megaMatch = indexHtml.match(new RegExp(`<a\\b[^>]*href=["']/services/${s.slug}["'][^>]*>[\\s\\S]*?<span class="mega-circle bg-\\[#([0-9a-fA-F]+)\\]">`));
  const megaColor = megaMatch ? '#' + megaMatch[1] : 'unknown';
  console.log(`  Header Mega Menu:  ${megaColor}`);

  // 2. Homepage Card
  const homeCardRegex = new RegExp(`<a\\b[^>]*href=["']/services/${s.slug}["'][^>]*class=["']([^"']*)["'][\\s\\S]*?<div class="absolute inset-0 bg-gradient-to-br from-\\[#([0-9a-fA-F]+)\\]`, 'i');
  const homeCardMatch = indexHtml.match(homeCardRegex);
  const homeCardColor = homeCardMatch ? '#' + homeCardMatch[2] : 'none';
  console.log(`  Homepage Card:     ${homeCardColor}`);

  // 3. Footer link
  const footerMatch = indexHtml.match(new RegExp(`<a\\b[^>]*href=["']/services/${s.slug}["'][^>]*class=["'][^"']*hover:text-(primary|secondary|accent)[^"']*["']`));
  const footerColor = footerMatch ? footerMatch[1] : 'unknown';
  console.log(`  Footer Hover:      ${footerColor}`);

  // 4. Subpage
  const subFile = path.join(root, 'services', s.slug, 'index.html');
  if (fs.existsSync(subFile)) {
    const subHtml = fs.readFileSync(subFile, 'utf8');
    // Check hero badge class
    const badgeMatch = subHtml.match(/<div class="inline-flex items-center gap-2 px-4 py-2 rounded-full ([^"]*)">/);
    const badgeClass = badgeMatch ? badgeMatch[1] : 'no-badge';
    // Check primary button in hero
    const btnMatch = subHtml.match(/<a class="px-10 py-5 ([^"]*) rounded-2xl/);
    const btnClass = btnMatch ? btnMatch[1] : 'no-btn';
    // Dominant color in hero
    const heroSection = subHtml.match(/<section\b[^>]*pt-32[\s\S]*?<\/section>/i) || [''];
    const blueH = (heroSection[0].match(/#4169E1|bg-primary|text-primary|border-primary/g) || []).length;
    const greenH = (heroSection[0].match(/#44D7A8|bg-secondary|text-secondary|border-secondary/g) || []).length;
    const orangeH = (heroSection[0].match(/#FF7518|bg-accent|text-accent|border-accent/g) || []).length;

    console.log(`  Subpage Hero Badge: ${badgeClass}`);
    console.log(`  Subpage Hero Button: ${btnClass}`);
    console.log(`  Subpage Hero Tokens: Blue=${blueH}, Green=${greenH}, Orange=${orangeH}`);
  }
  console.log('');
}
