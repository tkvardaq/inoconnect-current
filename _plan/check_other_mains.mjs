import fs from 'fs';

for (const s of ['social-media', 'ai-automation', 'ai-development']) {
  const html = fs.readFileSync(`services/${s}/index.html`, 'utf8');
  const mainMatch = html.match(/<main[\s\S]*?<\/main>/i);
  if (!mainMatch) {
    console.log(`NO MAIN in ${s}`);
    continue;
  }
  const mainContent = mainMatch[0];
  console.log(`\n================== ${s} in <main> ==================`);
  const primMatches = (mainContent.match(/primary/g) || []).length;
  const secMatches = (mainContent.match(/secondary/g) || []).length;
  const accMatches = (mainContent.match(/accent/g) || []).length;
  const blueHex = (mainContent.match(/#4169E1/gi) || []).length;
  const orangeHex = (mainContent.match(/#FF7518/gi) || []).length;
  const greenHex = (mainContent.match(/#44D7A8/gi) || []).length;
  console.log(`primary: ${primMatches}, secondary: ${secMatches}, accent: ${accMatches}`);
  console.log(`blueHex: ${blueHex}, orangeHex: ${orangeHex}, greenHex: ${greenHex}`);
}
