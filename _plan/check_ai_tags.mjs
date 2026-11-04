import fs from 'fs';

const aiPage = fs.readFileSync('blog/ai-marketing-tools/index.html', 'utf8');

const btn = aiPage.match(/<button\b[^>]*id="mobile-menu-toggle"[^>]*>/);
console.log('Toggle in ai-marketing-tools:\n', btn ? btn[0] : 'not found');

const liFooter = aiPage.match(/<footer[\s\S]*?<\/footer>/);
if (liFooter) {
  const li = liFooter[0].match(/href="[^"]*linkedin[^"]*"/g);
  console.log('LinkedIn in ai-marketing-tools footer:\n', li);
} else {
  console.log('No footer found!');
}
