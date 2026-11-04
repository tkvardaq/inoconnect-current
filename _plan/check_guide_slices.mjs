import fs from 'fs';

const guide = fs.readFileSync('blog/schema-markup-guide/index.html', 'utf8');

const headEnd = guide.indexOf('</head>');
const mainStart = guide.indexOf('<main id="main"');
console.log('Between head and main:\n', guide.slice(headEnd + 7, mainStart));

const mainEnd = guide.indexOf('</main>');
console.log('\nAfter main:\n', guide.slice(mainEnd + 7));
