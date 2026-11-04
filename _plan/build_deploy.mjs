import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const root = process.cwd();

// Rebuild site.css from current HTML so new utility classes are never missing (custom CSS lives in _plan/input.css)
execSync('npx tailwindcss -i _plan/input.css -o assets/site.css --minify', { stdio: 'inherit' });
execSync('node _plan/check_ui_tokens.mjs --summary', { stdio: 'inherit' });
const deployDir = path.join(root, '_deploy');

// Clean / create _deploy
if (fs.existsSync(deployDir)) {
  fs.rmSync(deployDir, { recursive: true, force: true });
}
fs.mkdirSync(deployDir, { recursive: true });

function copyFile(srcRel, destRel) {
  const src = path.join(root, srcRel);
  const dest = path.join(deployDir, destRel || srcRel);
  if (!fs.existsSync(src)) {
    console.warn(`Warning: source file not found: ${srcRel}`);
    return;
  }
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(src, dest);
}

// 1. Copy top-level production files
const topLevelFiles = [
  'index.html',
  '404.html',
  'site.webmanifest',
  'apple-touch-icon.png',
  'favicon.svg',
  'robots.txt',
  'sitemap.xml',
  '.htaccess',
  'logo.png'
];
for (const f of topLevelFiles) copyFile(f);

// 2. Copy all page directories (index.html in about, blog, contact, industries, services, tools, privacy, terms)
const pageDirs = ['about', 'blog', 'contact', 'industries', 'services', 'tools', 'privacy', 'terms'];
for (const sub of pageDirs) {
  const dir = path.join(root, sub);
  if (fs.existsSync(dir)) {
    (function walkSub(d) {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const full = path.join(d, e.name);
        const rel = path.relative(root, full).replace(/\\/g, '/');
        if (e.isDirectory()) {
          walkSub(full);
        } else if (e.name === 'index.html') {
          copyFile(rel);
        }
      }
    })(dir);
  }
}

// 3. Copy production assets
const assetFiles = [
  'assets/site.css',
  'assets/contact-form.js',
  'assets/tool-capture.js',
  'assets/framer-components.css',
  'assets/framer-components.js',
  '_astro/about.Bi_RrpmH.css'
];
for (const a of assetFiles) copyFile(a);

// 4. Copy referenced images
// Collect all referenced images from HTML files in _deploy
const deployPages = [];
(function findDeployPages(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const full = path.join(d, e.name);
    if (e.isDirectory()) findDeployPages(full);
    else if (e.name.endsWith('.html')) deployPages.push(full);
  }
})(deployDir);

const neededImages = new Set();
for (const dp of deployPages) {
  const t = fs.readFileSync(dp, 'utf8');
  for (const m of t.matchAll(/src=["'](\/(?:images|logo)[^"']+)["']/g)) {
    neededImages.add(m[1].slice(1));
  }
  for (const m of t.matchAll(/url\(["']?(\/images\/[^"')]+)["']?\)/g)) {
    neededImages.add(m[1].slice(1));
  }
  for (const m of t.matchAll(/content=["']https:\/\/inoconnect\.com(\/(?:images|logo)[^"']+)["']/g)) {
    neededImages.add(m[1].slice(1));
  }
}

console.log(`Found ${neededImages.size} referenced images to copy into _deploy`);
for (const img of neededImages) {
  copyFile(img);
}

// 5. (Hero video removed from the site in Nov 2026; nothing under videos/ is deployed.)

// 6. Calculate total deploy size
let totalBytes = 0;
let fileCount = 0;
(function calcSize(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const full = path.join(d, e.name);
    if (e.isDirectory()) calcSize(full);
    else {
      fileCount++;
      totalBytes += fs.statSync(full).size;
    }
  }
})(deployDir);

console.log(`_deploy successfully assembled!`);
console.log(`Total files: ${fileCount}`);
console.log(`Total size: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB (down from 158 MB!)`);
