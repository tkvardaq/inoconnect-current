import fs from 'fs';

for (const ind of ['b2b', 'healthcare', 'startups', 'professional-services']) {
  const html = fs.readFileSync(`industries/${ind}/index.html`, 'utf8');
  const mainMatch = html.match(/<main[\s\S]*?<\/main>/i)?.[0] || '';
  const primMatches = (mainMatch.match(/[a-z0-9:\/_-]*primary[a-z0-9:\/_-]*/g) || []);
  const secMatches = (mainMatch.match(/[a-z0-9:\/_-]*secondary[a-z0-9:\/_-]*/g) || []);
  const accMatches = (mainMatch.match(/[a-z0-9:\/_-]*accent[a-z0-9:\/_-]*/g) || []);
  console.log(`\n=== ${ind} ===`);
  console.log('primary:', [...new Set(primMatches)].join(', '));
  console.log('secondary:', [...new Set(secMatches)].join(', '));
  console.log('accent:', [...new Set(accMatches)].join(', '));
}
