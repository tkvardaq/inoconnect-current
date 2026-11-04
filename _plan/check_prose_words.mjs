import fs from 'fs';

const pagesToTransform = [
  { file: 'services/seo/index.html', word: 'secondary' },
  { file: 'services/ppc/index.html', word: 'primary' },
  { file: 'services/content-marketing/index.html', word: 'accent' },
  { file: 'services/web-development/index.html', word: 'primary' },
  { file: 'services/digital-strategy/index.html', word: 'accent' },
  { file: 'industries/b2b/index.html', word: 'secondary' },
  { file: 'industries/healthcare/index.html', word: 'primary' },
  { file: 'industries/startups/index.html', word: 'accent' },
  { file: 'industries/professional-services/index.html', word: 'secondary' },
];

for (const p of pagesToTransform) {
  const html = fs.readFileSync(p.file, 'utf8');
  // strip all tags <...> and check if word exists in text
  const textOnly = html.replace(/<[^>]+>/g, ' ');
  const m = textOnly.match(new RegExp(`\\b${p.word}\\b`, 'gi'));
  if (m) {
    console.log(`[PROSE MATCH in ${p.file}] found "${p.word}" in text: count=${m.length}`);
    // find lines
    const lines = html.split('\n');
    lines.forEach((l, idx) => {
      const stripped = l.replace(/<[^>]+>/g, ' ');
      if (new RegExp(`\\b${p.word}\\b`, 'i').test(stripped)) {
        console.log(`  Line ${idx+1}: ${stripped.trim()}`);
      }
    });
  } else {
    console.log(`[OK] ${p.file}: no prose occurrences of "${p.word}"`);
  }
}
