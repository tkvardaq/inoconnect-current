import fs from 'fs';

const html = fs.readFileSync('D:/AI/inoconnect-site/dist/blog/ai-marketing-tools/index.html', 'utf8');

const artMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/);
if (artMatch) {
  console.log('Article length:', artMatch[0].length);
  console.log('First 500 chars:\n', artMatch[0].slice(0, 500));
}

// Check headings
const headings = html.match(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi) || [];
console.log('\nHeadings count:', headings.length);
headings.forEach(h => console.log(' ', h));
