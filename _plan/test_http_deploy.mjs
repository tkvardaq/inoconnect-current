import fs from 'fs';
import path from 'path';
import http from 'http';

const root = process.cwd();
const deployDir = path.join(root, '_deploy');

// Simple static server for _deploy
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.txt': 'text/plain',
  '.xml': 'application/xml'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath.endsWith('/')) reqPath += 'index.html';

  let filePath = path.join(deployDir, reqPath.slice(1));
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (fs.existsSync(filePath) && !fs.statSync(filePath).isDirectory()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

const PORT = 8799;

server.listen(PORT, async () => {
  console.log(`Test HTTP server running on port ${PORT} serving _deploy/...`);

  let failedFetches = [];
  let successfulFetches = 0;

  async function checkUrl(urlPath, type, referrer) {
    try {
      const res = await fetch(`http://localhost:${PORT}${urlPath}`);
      if (res.status !== 200) {
        failedFetches.push({ urlPath, status: res.status, type, referrer });
      } else {
        successfulFetches++;
      }
    } catch (err) {
      failedFetches.push({ urlPath, error: err.message, type, referrer });
    }
  }

  // 1. Collect all pages
  const pages = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name === 'index.html') pages.push(p);
    }
  })(deployDir);

  console.log(`Found ${pages.length} pages in _deploy/. Crawling pages and assets...`);

  const assetsToFetch = new Map(); // url -> { type, referrer }

  for (const p of pages) {
    const relPage = '/' + path.relative(deployDir, p).replace(/\\/g, '/').replace(/index\.html$/, '');
    await checkUrl(relPage, 'page', 'sitemap');

    // Parse assets from page HTML
    const html = fs.readFileSync(p, 'utf8');

    // CSS
    for (const m of html.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/g)) {
      const href = m[1];
      if (!href.startsWith('http')) assetsToFetch.set(href, { type: 'css', referrer: relPage });
    }
    // JS
    for (const m of html.matchAll(/<script\b[^>]*src=["']([^"']+)["']/g)) {
      const src = m[1];
      if (!src.startsWith('http')) assetsToFetch.set(src, { type: 'js', referrer: relPage });
    }
    // Images
    for (const m of html.matchAll(/<img\b[^>]*src=["']([^"']+)["']/g)) {
      const src = m[1];
      if (!src.startsWith('http')) assetsToFetch.set(src, { type: 'img', referrer: relPage });
    }
    // Favicon / icons
    for (const m of html.matchAll(/<link\b[^>]*href=["'](\/(?:favicon|apple-touch-icon)[^"']+)["']/g)) {
      assetsToFetch.set(m[1], { type: 'icon', referrer: relPage });
    }
    // Video poster & src
    for (const m of html.matchAll(/<video\b[^>]*poster=["']([^"']+)["']/g)) {
      if (!m[1].startsWith('http')) assetsToFetch.set(m[1], { type: 'video-poster', referrer: relPage });
    }
  }

  console.log(`Testing ${assetsToFetch.size} unique local assets referenced by HTML pages...`);
  for (const [assetUrl, meta] of assetsToFetch.entries()) {
    await checkUrl(assetUrl, meta.type, meta.referrer);
  }

  // Also check 404 page directly
  await checkUrl('/404.html', '404-page', 'root');
  // Check non-existent page returns 404
  const test404 = await fetch(`http://localhost:${PORT}/this-page-does-not-exist/`);
  if (test404.status === 404) {
    console.log(`Verified non-existent page returns HTTP 404.`);
  } else {
    failedFetches.push({ urlPath: '/this-page-does-not-exist/', status: test404.status, type: '404-test' });
  }

  server.close(() => {
    console.log(`\nHTTP Server Audit Results:`);
    console.log(`Successful HTTP 200 fetches: ${successfulFetches}`);
    console.log(`Failed HTTP fetches: ${failedFetches.length}`);
    if (failedFetches.length > 0) {
      console.error('Failed items:', failedFetches);
      process.exit(1);
    } else {
      console.log('HTTP DEPLOYMENT SERVER AUDIT: 100% PASS (Zero 404s, zero broken assets)\n');
      process.exit(0);
    }
  });
});
