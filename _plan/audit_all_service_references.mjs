import fs from 'fs';
import path from 'path';

function walk(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    if (item === 'node_modules' || item === '.git' || item === '_deploy') continue;
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      files = files.concat(walk(full));
    } else if (item.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

const allHtmls = walk('.');
console.log(`Auditing ${allHtmls.length} HTML files for service color references...`);

const serviceMap = {
  'seo': { color: 'Blue', hex: '#4169E1', token: 'primary' },
  'ppc': { color: 'Orange', hex: '#FF7518', token: 'accent' },
  'social-media': { color: 'Green', hex: '#44D7A8', token: 'secondary' },
  'content-marketing': { color: 'Blue', hex: '#4169E1', token: 'primary' },
  'web-development': { color: 'Orange', hex: '#FF7518', token: 'accent' },
  'digital-strategy': { color: 'Green', hex: '#44D7A8', token: 'secondary' },
  'ai-automation': { color: 'Blue', hex: '#4169E1', token: 'primary' },
  'ai-development': { color: 'Green', hex: '#44D7A8', token: 'secondary' },
};

for (const file of allHtmls) {
  const content = fs.readFileSync(file, 'utf8');
  for (const [slug, exp] of Object.entries(serviceMap)) {
    // look for occurrences like href="/services/{slug}" with surrounding color classes
    const regex = new RegExp(`(<[^>]+href="\\/services\\/${slug}"[^>]*>[\\s\\S]{0,150}<\\/[^>]+>)`, 'g');
    let m;
    while ((m = regex.exec(content)) !== null) {
      const snippet = m[1];
      // check if it has a wrong color indicator
      const hasBlue = snippet.includes('#4169E1') || snippet.includes('text-primary') || snippet.includes('bg-primary');
      const hasOrange = snippet.includes('#FF7518') || snippet.includes('text-accent') || snippet.includes('bg-accent');
      const hasGreen = snippet.includes('#44D7A8') || snippet.includes('text-secondary') || snippet.includes('bg-secondary');
      
      let foundColor = [];
      if (hasBlue) foundColor.push('Blue');
      if (hasOrange) foundColor.push('Orange');
      if (hasGreen) foundColor.push('Green');
      
      // If it has a color that doesn't match expected
      if (foundColor.length > 0 && !foundColor.includes(exp.color)) {
        console.log(`[MISMATCH in ${file}] /services/${slug} (Expected ${exp.color}) found ${foundColor.join(',')}: ${snippet.replace(/\s+/g, ' ').substring(0, 100)}`);
      }
    }
  }
}
console.log('Service reference scan complete.');
