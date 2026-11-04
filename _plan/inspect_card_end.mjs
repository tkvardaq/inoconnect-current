import fs from 'fs';

const blogIndex = fs.readFileSync('blog/index.html', 'utf8');
const pIndex = blogIndex.indexOf('href="/blog/professional-services-authority"');
console.log(blogIndex.slice(pIndex + 900, pIndex + 1400));
