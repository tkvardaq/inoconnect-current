import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const outDir = path.join(process.cwd(), 'images', 'stock');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function testDownload() {
  const photoId = '1573164713714-d95e436ab8d6';
  const url = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=80&w=1200`;
  console.log('Fetching', url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const dest = path.join(outDir, `${photoId}.webp`);
  const meta = await sharp(buf).webp({ quality: 80 }).toFile(dest);
  console.log('Saved to', dest, 'width:', meta.width, 'height:', meta.height, 'size:', meta.size);
}

testDownload().catch(console.error);
