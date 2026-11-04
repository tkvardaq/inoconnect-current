// Phase 6: 404.html gets the standard header, mobile menu, footer and scripts (copied from about/index.html).
import fs from 'fs';
const R = 'D:/ino website/';
const about = fs.readFileSync(R + 'about/index.html', 'utf8');
const grab = (a, b) => { const i = about.indexOf(a), j = about.indexOf(b); if (i < 0 || j < 0) throw new Error('marker ' + a); return about.slice(i, j + b.length); };
const header = grab('<!-- INOCONNECT_HEADER_START -->', '<!-- INOCONNECT_MOBILE_END -->');
const footer = grab('<!-- INOCONNECT_FOOTER_START -->', '<!-- INOCONNECT_FOOTER_END -->');
const js = grab('<!-- INOCONNECT_JS_START -->', '<!-- INOCONNECT_REVEAL_END -->');
let h = fs.readFileSync(R + '404.html', 'utf8');
if (h.includes('INOCONNECT_HEADER_START')) { console.log('404 already standard'); process.exit(0); }
h = h.replace(/<header\b[\s\S]*?<\/header>/, () => header);
h = h.replace(/<footer\b[\s\S]*?<\/footer>/, () => footer);
h = h.replace('</body>', () => js + '\n</body>');
// header is fixed: give the centred content room under it
h = h.replace('<main id="main" class="flex-grow flex items-center justify-center py-20 px-6">', '<main id="main" class="flex-grow flex items-center justify-center pt-40 pb-20 px-6">');
fs.writeFileSync(R + '404.html', h);
console.log('404 converted; header/footer/js copied from about/index.html');
