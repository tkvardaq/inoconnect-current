import fs from 'fs';

for (const dir of ['tools', 'blog', 'about', 'contact']) {
  const html = fs.readFileSync(`${dir}/index.html`, 'utf8');
  const catNav = html.match(/class="[^"]*category-nav[^"]*"[\s\S]{0,300}/);
  console.log(`${dir}: ${catNav ? 'HAS category-nav' : 'NO category-nav'}`);
}
