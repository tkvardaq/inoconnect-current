import fs from 'fs';
import path from 'path';

const tools = [
  'tools/roas-calculator/index.html',
  'tools/ltv-calculator/index.html',
  'tools/email-revenue-simulator/index.html',
  'tools/cro-simulator/index.html'
];

for (const tool of tools) {
  console.log(`\n=== Checking ${tool} ===`);
  const t = fs.readFileSync(tool, 'utf8');
  // Find script containing calculate or update
  const scriptMatch = t.match(/<script\b[^>]*>([\s\S]*?(?:function\s+(?:calculate|update|compute)|const\s+(?:calculate|update|compute))[\s\S]*?)<\/script>/i);
  if (scriptMatch) {
    console.log(`Found calculator script (${scriptMatch[1].length} chars)`);
  } else {
    console.log(`No calculator script matched regex`);
  }

  // Find outputs
  const outputs = [...t.matchAll(/id="([^"]*(?:out|output|result|total|val)[^"]*)"[^>]*>([^<]+)</g)];
  outputs.slice(0, 8).forEach(o => console.log(`  ${o[1]}: ${o[2].trim()}`));
}
