import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const footer = html.slice(html.indexOf('<footer'), html.indexOf('</footer>'));
// Find social links or icons
const socialLinks = footer.match(/<a[^>]*href="https?:\/\/[^"]*"[^>]*>[\s\S]*?<\/a>/g) || [];
console.log('External links in footer:');
socialLinks.forEach(l => console.log(l));
