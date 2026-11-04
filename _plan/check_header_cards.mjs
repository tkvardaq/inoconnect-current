import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

// Header service links
const header = html.slice(html.indexOf('<header'), html.indexOf('</header>'));
console.log('=== HEADER SERVICE LINKS ===');
const serviceRegex = /<a[^>]*href="\/services\/([a-z-]+)"[^>]*>([\s\S]*?)<\/a>/g;
let match;
while ((match = serviceRegex.exec(header)) !== null) {
  const [full, slug, inner] = match;
  console.log(`\nService: /services/${slug}`);
  console.log(`Snippet: ${full.replace(/\s+/g, ' ').substring(0, 250)}`);
}

console.log('\n=== HOMEPAGE SERVICE CARDS ===');
const cardRegex = /<a[^>]*href="\/services\/([a-z-]+)"[^>]*>([\s\S]*?)<\/a>/g;
const main = html.slice(html.indexOf('<main'), html.indexOf('</main>'));
while ((match = cardRegex.exec(main)) !== null) {
  const [full, slug, inner] = match;
  if (['seo','ppc','social-media','content-marketing','web-development','digital-strategy','ai-automation','ai-development'].includes(slug)) {
    console.log(`\nHome Card Link: /services/${slug}`);
    console.log(`Card Link snippet: ${full.replace(/\s+/g, ' ').substring(0, 200)}`);
  }
}
