import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const root = process.cwd();
const outDir = path.join(root, 'images', 'stock');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const SKIP = new Set(['node_modules', '.git', '_plan', '__pycache__', '_deploy']);
const pages = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (!SKIP.has(e.name)) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (p.endsWith('index.html') && !p.includes('outputs')) pages.push(p);
    }
  }
})(root);

// Collect all unique photo IDs
const photoIds = new Set();
for (const p of pages) {
  const t = fs.readFileSync(p, 'utf8');
  const matches = [...t.matchAll(/https:\/\/images\.unsplash\.com\/photo-([0-9a-zA-Z-]+)/g)];
  for (const m of matches) {
    photoIds.add(m[1]);
  }
}

console.log(`Found ${photoIds.size} unique Unsplash photo IDs.`);

const dimensionsMap = {};

async function downloadAll() {
  for (const id of photoIds) {
    const dest = path.join(outDir, `${id}.webp`);
    if (fs.existsSync(dest)) {
      const meta = await sharp(dest).metadata();
      dimensionsMap[id] = { width: meta.width, height: meta.height, file: `/images/stock/${id}.webp` };
      console.log(`Already exists: ${id}.webp (${meta.width}x${meta.height})`);
      continue;
    }

    const url = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=1200`;
    console.log(`Downloading ${id} from ${url}...`);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`Failed to download ${id}: HTTP ${res.status}`);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      const meta = await sharp(buf).webp({ quality: 80 }).toFile(dest);
      dimensionsMap[id] = { width: meta.width, height: meta.height, file: `/images/stock/${id}.webp` };
      console.log(`Saved ${id}.webp (${meta.width}x${meta.height}, ${meta.size} bytes)`);
    } catch (err) {
      console.error(`Error downloading ${id}:`, err.message);
    }
  }

  fs.writeFileSync(path.join(root, '_plan', 'stock_dimensions.json'), JSON.stringify(dimensionsMap, null, 2));
  console.log(`Recorded dimensions for ${Object.keys(dimensionsMap).length} images.`);

  // Now replace across all HTML files
  let replacedPages = 0;
  for (const p of pages) {
    let t = fs.readFileSync(p, 'utf8');
    const orig = t;

    // 1. Remove dns-prefetch or preconnect links to images.unsplash.com
    t = t.replace(/\s*<link\s+[^>]*href=["']https:\/\/images\.unsplash\.com["'][^>]*\/?>/gi, '');
    t = t.replace(/\s*<link\s+[^>]*images\.unsplash\.com[^>]*rel=["']dns-prefetch["'][^>]*\/?>/gi, '');

    // 2. Replace all Unsplash photo URLs with local stock URLs
    for (const id of photoIds) {
      const re = new RegExp(`https:\\/\\/images\\.unsplash\\.com\\/photo-${id}[^"\\s<>']*`, 'g');
      t = t.replace(re, `/images/stock/${id}.webp`);
    }

    if (t !== orig) {
      fs.writeFileSync(p, t, 'utf8');
      replacedPages++;
    }
  }

  console.log(`Updated ${replacedPages} pages with local image paths.`);
}

downloadAll().catch(console.error);
