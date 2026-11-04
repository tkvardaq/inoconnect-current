import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const footer = html.slice(html.indexOf('<footer'), html.indexOf('</footer>'));
console.log('=== FOOTER SERVICES & INDUSTRIES ===');
const serviceMatches = footer.match(/<a[^>]*href="\/services\/[^"]*"[^>]*>[\s\S]*?<\/a>/g) || [];
serviceMatches.forEach(m => console.log(m.replace(/\s+/g, ' ').substring(0, 100)));

const indMatches = footer.match(/<a[^>]*href="\/industries\/[^"]*"[^>]*>[\s\S]*?<\/a>/g) || [];
indMatches.forEach(m => console.log(m.replace(/\s+/g, ' ').substring(0, 100)));
