import fs from 'fs';

const t = fs.readFileSync('index.html', 'utf8');
const head = t.slice(0, t.indexOf('</head>') + 7);
const lines = head.split('\n');
lines.forEach((l, i) => {
  if (l.includes('tailwind') || l.includes('cdn')) {
    console.log(`Line ${i}:`, l);
  }
});
