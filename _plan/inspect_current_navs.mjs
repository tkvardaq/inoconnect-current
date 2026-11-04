import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

// Extract desktop nav
const navMatch = html.match(/<nav class="hidden lg:flex[^"]*"[^>]*>[\s\S]*?<\/nav>/i);
if (navMatch) {
  console.log('--- CURRENT DESKTOP NAV ---');
  console.log(navMatch[0].replace(/<div class="mega-menu[\s\S]*?<\/div>\s*<\/div>/g, '[...MEGA-MENU...]'));
}

// Extract mobile nav
const mobMatch = html.match(/<nav class="space-y-4">[\s\S]*?<\/nav>/i);
if (mobMatch) {
  console.log('\n--- CURRENT MOBILE NAV ---');
  console.log(mobMatch[0]);
}
