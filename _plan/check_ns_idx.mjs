import fs from 'fs';

const guide = fs.readFileSync('blog/schema-markup-guide/index.html', 'utf8');

const nsIdx = guide.indexOf('<noscript><style>.reveal-on-scroll');
const headEndIdx = guide.indexOf('</head>');
console.log('nsIdx:', nsIdx, 'headEndIdx:', headEndIdx);
