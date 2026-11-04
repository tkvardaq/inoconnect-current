import fs from 'fs';

const blogIndex = fs.readFileSync('blog/index.html', 'utf8');

const pIndex = blogIndex.indexOf('href="/blog/professional-services-authority"');
if (pIndex !== -1) {
  console.log('Snippet around first link:');
  console.log(blogIndex.slice(Math.max(0, pIndex - 300), pIndex + 1200));
}
