import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const headerMatch = html.match(/<header[\s\S]*?<\/header>/i);
if (headerMatch) {
  console.log(headerMatch[0].replace(/<div class="mega-menu[\s\S]*?<\/div>\s*<\/div>/g, '[...MEGA-MENU...]'));
}
