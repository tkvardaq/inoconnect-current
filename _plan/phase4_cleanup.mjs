import fs from 'fs';
import path from 'path';

const root = process.cwd();

const edits = [
  {
    file: 'about/index.html',
    from: 'Schedule a 48-hour commercial audit',
    to: 'Schedule a commercial growth audit'
  },
  {
    file: 'industries/healthcare/index.html',
    from: 'HIPAA-Compliant Growth',
    to: 'HIPAA-Aware Growth'
  },
  {
    file: 'industries/healthcare/index.html',
    from: 'HIPAA Compliant',
    to: 'HIPAA-Aware'
  },
  {
    file: 'industries/index.html',
    from: '>HIPAA Compliant<',
    to: '>HIPAA-Aware<'
  },
  {
    file: 'industries/index.html',
    from: 'Request a 48-hour vertical growth audit',
    to: 'Request a vertical growth audit'
  },
  {
    file: 'industries/index.html',
    from: '48-Hour Response SLA',
    to: 'Senior-led advisory'
  },
  {
    file: 'services/index.html',
    from: 'Schedule a 48-hour commercial audit',
    to: 'Schedule a commercial growth audit'
  },
  {
    file: 'tools/index.html',
    from: 'Data Storage / Gating',
    to: 'Data Privacy & Storage'
  },
  {
    file: 'tools/index.html',
    from: 'Request a comprehensive 48-hour commercial growth audit',
    to: 'Request a comprehensive commercial growth audit'
  },
  {
    file: 'tools/ltv-calculator/index.html',
    from: 'Schedule a 48-hour commercial audit',
    to: 'Schedule a commercial growth audit'
  }
];

for (const ed of edits) {
  const fp = path.join(root, ed.file);
  let content = fs.readFileSync(fp, 'utf8');
  if (content.includes(ed.from)) {
    content = content.replaceAll(ed.from, ed.to);
    fs.writeFileSync(fp, content, 'utf8');
    console.log(`Cleaned hit in ${ed.file}: "${ed.from}" -> "${ed.to}"`);
  } else {
    console.log(`Warning: did not find "${ed.from}" in ${ed.file}`);
  }
}
