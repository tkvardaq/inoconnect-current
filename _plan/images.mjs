import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const root = process.cwd();
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

// 1. Optimize logo.png
async function optimizeLogo() {
  const logoPath = path.join(root, 'logo.png');
  const backupLogo = path.join(root, '_plan', 'logo_original.png');
  if (!fs.existsSync(backupLogo)) {
    fs.copyFileSync(logoPath, backupLogo);
  }
  const buf = await sharp(backupLogo)
    .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 90, compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(logoPath, buf);
  console.log(`Optimized logo.png: ${(buf.length / 1024).toFixed(1)} KB`);
}

// 2. Identify all local images referenced across pages
const referencedLocalImages = new Set();
for (const p of pages) {
  const t = fs.readFileSync(p, 'utf8');
  for (const m of t.matchAll(/<img\b[^>]*>/g)) {
    const src = (m[0].match(/src=["']([^"']+)["']/) || [])[1];
    if (src && src.startsWith('/images/') && !src.startsWith('/images/stock/')) {
      referencedLocalImages.add(src);
    }
  }
}

console.log(`Found ${referencedLocalImages.size} referenced local images in /images/`);

// 3. Convert each to WebP
const convertedMap = new Map(); // original /images/foo.jpg -> /images/foo.webp
async function convertLocalImages() {
  for (const relSrc of referencedLocalImages) {
    const origPath = path.join(root, relSrc.slice(1));
    const ext = path.extname(origPath);
    const basename = path.basename(origPath, ext);
    const destPath = path.join(root, 'images', `${basename}.webp`);
    const newSrc = `/images/${basename}.webp`;

    if (!fs.existsSync(destPath)) {
      const meta = await sharp(origPath).metadata();
      let pipeline = sharp(origPath);
      // Resize if wider than 1200
      if (meta.width > 1200) {
        pipeline = pipeline.resize({ width: 1200, withoutEnlargement: true });
      }
      await pipeline.webp({ quality: 80 }).toFile(destPath);
      const stat = fs.statSync(destPath);
      console.log(`Converted ${path.basename(origPath)} -> ${basename}.webp (${(stat.size/1024).toFixed(1)} KB)`);
    } else {
      console.log(`Already exists: ${basename}.webp`);
    }
    convertedMap.set(relSrc, newSrc);
  }
}

// 4. Update HTML references to WebP
function updateHtmlSources() {
  let updatedCount = 0;
  for (const p of pages) {
    let t = fs.readFileSync(p, 'utf8');
    let changed = false;
    for (const [oldSrc, newSrc] of convertedMap.entries()) {
      if (t.includes(`src="${oldSrc}"`)) {
        t = t.replaceAll(`src="${oldSrc}"`, `src="${newSrc}"`);
        changed = true;
      }
      if (t.includes(`src='${oldSrc}'`)) {
        t = t.replaceAll(`src='${oldSrc}'`, `src='${newSrc}'`);
        changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(p, t, 'utf8');
      updatedCount++;
    }
  }
  console.log(`Updated image sources in ${updatedCount} pages.`);
}

// 5. Build dimension cache for all images referenced
const dimCache = new Map(); // src -> { width, height }
async function populateDimensionCache() {
  // Add logo variants
  dimCache.set('/logo.png', { width: 48, height: 48 });

  // Scan images/ and images/stock/
  const imgDirs = [path.join(root, 'images'), path.join(root, 'images', 'stock')];
  for (const dir of imgDirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const full = path.join(dir, file);
      if (fs.statSync(full).isDirectory()) continue;
      const webPath = '/' + path.relative(root, full).replace(/\\/g, '/');
      try {
        const meta = await sharp(full).metadata();
        dimCache.set(webPath, { width: meta.width, height: meta.height });
      } catch (e) {
        // not an image
      }
    }
  }
  console.log(`Dimension cache populated with ${dimCache.size} images.`);
}

// 6. Inject width and height into EVERY <img> tag across all 53 pages
function injectDimensions() {
  let modifiedPages = 0;
  let totalImgs = 0;
  let updatedImgs = 0;

  for (const p of pages) {
    let t = fs.readFileSync(p, 'utf8');
    const orig = t;

    t = t.replace(/<img\b([^>]*)>/g, (fullMatch, attrs) => {
      totalImgs++;
      let newAttrs = attrs;

      // Check src
      const srcMatch = newAttrs.match(/src=["']([^"']+)["']/);
      const src = srcMatch ? srcMatch[1] : '';

      // Check current width and height
      const hasWidth = /\bwidth=/.test(newAttrs);
      const hasHeight = /\bheight=/.test(newAttrs);

      if (hasWidth && hasHeight) return fullMatch; // already has both

      let w = 0, h = 0;

      // Special cases for logo
      if (src === '/logo.png') {
        if (newAttrs.includes('id="main-logo"')) {
          w = 48; h = 48;
        } else if (newAttrs.includes('h-10')) {
          w = 40; h = 40;
        } else if (newAttrs.includes('w-16')) {
          w = 64; h = 64;
        } else if (newAttrs.includes('h-12')) {
          w = 48; h = 48;
        } else {
          w = 48; h = 48;
        }
      } else if (dimCache.has(src)) {
        const d = dimCache.get(src);
        w = d.width;
        h = d.height;
      } else {
        // Fallback default
        w = 1200;
        h = 800;
      }

      if (!hasWidth) newAttrs += ` width="${w}"`;
      if (!hasHeight) newAttrs += ` height="${h}"`;

      // Also ensure loading and decoding if missing
      if (!/\bdecoding=/.test(newAttrs)) {
        newAttrs += ' decoding="async"';
      }
      if (!/\bloading=/.test(newAttrs) && !newAttrs.includes('id="main-logo"')) {
        newAttrs += ' loading="lazy"';
      }

      updatedImgs++;
      return `<img${newAttrs}>`;
    });

    if (t !== orig) {
      fs.writeFileSync(p, t, 'utf8');
      modifiedPages++;
    }
  }

  console.log(`Injected dimensions into ${updatedImgs} images across ${modifiedPages} pages.`);
}

async function run() {
  await optimizeLogo();
  await convertLocalImages();
  updateHtmlSources();
  await populateDimensionCache();
  injectDimensions();
}

run().catch(console.error);
