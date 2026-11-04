import fs from 'fs';

const html = fs.readFileSync('services/content-marketing/index.html', 'utf8');
const mainMatch = html.match(/<main[\s\S]*?<\/main>/i)?.[0] || '';

const matches = mainMatch.match(/[a-z0-9:\/_-]*accent[a-z0-9:\/_-]*/g) || [];
const unique = [...new Set(matches)];
console.log('Content Marketing unique accent classes in <main>:\n', unique.join(', '));
