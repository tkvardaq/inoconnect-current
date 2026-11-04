import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const header = html.slice(html.indexOf('<header'), html.indexOf('</header>'));

console.log('=== HEADER INDUSTRY LINKS ===');
const indRegex = /<a[^>]*href="\/industries\/([a-z-]+)"[^>]*>([\s\S]*?)<\/a>/g;
let match;
while ((match = indRegex.exec(header)) !== null) {
  const [full, slug, inner] = match;
  console.log(`\nIndustry: /industries/${slug}`);
  console.log(`Snippet: ${full.replace(/\s+/g, ' ').substring(0, 250)}`);
}

console.log('\n=== INDUSTRY SUBPAGE CATEGORY LINKS ===');
const industries = ['saas', 'ecommerce', 'b2b', 'healthcare', 'education', 'startups', 'professional-services'];
for (const ind of industries) {
  const indHtml = fs.readFileSync(`industries/${ind}/index.html`, 'utf8');
  const catMatch = indHtml.match(/class="category-link active font-black"[\s\S]{0,120}/);
  console.log(`${ind.padEnd(25)}: ${catMatch ? catMatch[0].replace(/\s+/g, ' ') : 'None'}`);
}
