import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const mobileMatch = html.match(/<!-- INOCONNECT_MOBILE_START -->[\s\S]*?<!-- INOCONNECT_MOBILE_END -->/i) ||
                    html.match(/id="mobile-menu"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i);
if (mobileMatch) {
  console.log(mobileMatch[0].substring(0, 1000));
} else {
  console.log('Mobile menu not found by comment');
}
