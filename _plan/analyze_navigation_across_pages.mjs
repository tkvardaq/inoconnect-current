import fs from 'fs';
import path from 'path';

function walk(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    if (item === 'node_modules' || item === '.git' || item === '_deploy' || item === '_plan') continue;
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
console.log(`Inspecting navigation across ${allHtmls.length} pages...`);

const navGroups = {};

for (const f of allHtmls) {
  const content = fs.readFileSync(f, 'utf8');
  const headerMatch = content.match(/<header[\s\S]*?<\/header>/i);
  if (!headerMatch) {
    console.log(`NO HEADER: ${f}`);
    continue;
  }
  const header = headerMatch[0];
  
  // Extract top-level nav links in header (desktop nav)
  const navMatch = header.match(/<nav[^>]*class="[^"]*hidden\s+md:flex[^"]*"[^>]*>([\s\S]*?)<\/nav>/i) ||
                   header.match(/<nav[^>]*>([\s\S]*?)<\/nav>/i);
  
  const navSnippet = navMatch ? navMatch[1] : '';
  // Find top level links or mega-menu triggers
  const links = [];
  // Look for text inside top-level <a> or button or dropdown
  const topRegex = /<(?:a|button)[^>]*>([\s\S]*?)<\/(?:a|button)>/g;
  let m;
  // Let's get clean hrefs and visible text of top-level items
  const cleanTop = navSnippet.replace(/<div class="mega-menu[\s\S]*?<\/div>\s*<\/div>/g, '[MEGA-DROPDOWN]');
  const hrefs = (cleanTop.match(/href="[^"]*"/g) || []).map(h => h.replace('href="', '').replace('"', ''));
  
  const key = hrefs.join(' | ');
  if (!navGroups[key]) navGroups[key] = [];
  navGroups[key].push(f);
}

for (const [key, files] of Object.entries(navGroups)) {
  console.log(`\n--- NAV PATTERN: ${key || '(empty)'} (${files.length} pages) ---`);
  console.log(`Examples: ${files.slice(0, 5).join(', ')}`);
}
