import fs from 'fs';

const content = fs.readFileSync('blog/schema-markup-guide/index.html', 'utf8');

const tocMatch = content.match(/<nav[^>]*class="[^"]*toc[^"]*"[^>]*>([\s\S]*?)<\/nav>/) || content.match(/Table of Contents[\s\S]*?<\/nav>/i);
console.log('TOC match:\n', tocMatch ? tocMatch[0].slice(0, 1000) : 'none');

// Let's find the aside or sidebar
const aside = content.match(/<aside[\s\S]*?<\/aside>/);
console.log('\nAside:\n', aside ? aside[0].slice(0, 1000) : 'none');
