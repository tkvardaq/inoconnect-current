import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const srcDir = 'D:\\AI\\inoconnect-site\\src\\assets\\images';
const destDir = path.resolve('images/stock');

const images = [
  'ai-marketing-tools.jpg',
  'digital-marketing-strategy.jpg',
  'how-to-improve-conversion-rate.jpg',
  'ppc-vs-seo.jpg',
  'roas-formula.jpg',
  'what-is-cost-per-click.jpg'
];

async function convert() {
  for (const img of images) {
    const srcPath = path.join(srcDir, img);
    const baseName = img.replace('.jpg', '');
    const destPath = path.join(destDir, `${baseName}.webp`);
    
    if (fs.existsSync(srcPath)) {
      const meta = await sharp(srcPath).metadata();
      // Resize to max width 1200 maintaining aspect ratio
      await sharp(srcPath)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(destPath);
      
      const outMeta = await sharp(destPath).metadata();
      console.log(`Converted ${img} -> ${baseName}.webp: ${outMeta.width}x${outMeta.height}`);
    } else {
      console.error(`Not found: ${srcPath}`);
    }
  }
}

convert().catch(console.error);
