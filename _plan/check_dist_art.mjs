import fs from 'fs';

const html = fs.readFileSync('D:\\AI\\inoconnect-site\\dist\\blog\\ai-marketing-tools\\index.html', 'utf8');
console.log(html.substring(0, 800));
