import fs from 'fs';

const smHtml = fs.readFileSync('services/social-media/index.html', 'utf8');
const ctaMatches = smHtml.match(/<a[^>]*bg-secondary[^>]*>[\s\S]*?<\/a>/g) || [];
ctaMatches.forEach(m => console.log(m.replace(/\s+/g, ' ').substring(0, 150)));
