import fs from 'fs';

const guide = fs.readFileSync('blog/schema-markup-guide/index.html', 'utf8');

const noscript = guide.match(/<noscript>[\s\S]*?<\/noscript>/g) || [];
console.log('Noscripts in guide:');
noscript.forEach(n => console.log(' ', n));
