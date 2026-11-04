import fs from 'fs';

const blogIndex = fs.readFileSync('blog/index.html', 'utf8');
const pIndex = blogIndex.indexOf('href="/blog/professional-services-authority"');
console.log(blogIndex.slice(pIndex + 1100, pIndex + 1700));
