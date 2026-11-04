import fs from 'fs';

for (const s of ['seo', 'ppc', 'content-marketing', 'web-development', 'digital-strategy']) {
  const html = fs.readFileSync(`services/${s}/index.html`, 'utf8');
  console.log(`\n================== ${s} ==================`);
  // Find all matches of secondary, primary, accent, or hex colors in class attributes
  const classes = html.match(/class="[^"]*"/g) || [];
  const colorMatches = new Set();
  classes.forEach(c => {
    const m = c.match(/(?:bg|text|border|from|to|via|shadow|ring)-(?:primary|secondary|accent|teal|blue|orange|emerald|cyan|amber)(?:-[a-z0-9]+|\/[0-9]+)*/g);
    if (m) m.forEach(x => colorMatches.add(x));
  });
  console.log(Array.from(colorMatches).sort().join(', '));
}
