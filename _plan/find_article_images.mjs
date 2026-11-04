import fs from 'fs';
import path from 'path';

const possibleImageDirs = [
  'D:\\AI\\inoconnect-site\\src\\assets\\images',
  'D:\\AI\\inoconnect-site\\public\\images',
  'D:\\AI\\inoconnect-images',
  'D:\\AI\\inoconnect-new\\images'
];

for (const d of possibleImageDirs) {
  if (fs.existsSync(d)) {
    console.log(`\nFiles in ${d}:`);
    const files = fs.readdirSync(d);
    console.log(files.filter(f => f.includes('roas') || f.includes('click') || f.includes('conversion') || f.includes('marketing') || f.includes('ppc')));
  }
}
