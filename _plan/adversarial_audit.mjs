import fs from 'fs';
import path from 'path';
import vm from 'vm';

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

console.log(`====================================================`);
console.log(`ADVERSARIAL DEEP-DIVE AUDIT: ${pages.length} PAGES`);
console.log(`====================================================\n`);

let totalErrors = 0;
function logPass(msg) { console.log(`  [PASS] ${msg}`); }
function logFail(msg, details) {
  totalErrors++;
  console.error(`  [FAIL] ${msg}`);
  if (details) console.error(`         Details: ${JSON.stringify(details, null, 2)}`);
}

// ---------------------------------------------------------
// TEST 1: Internal Link Graph Integrity
// ---------------------------------------------------------
console.log(`--- TEST 1: Internal Link Graph Integrity ---`);
const internalLinks = [];
const missingTargets = [];

for (const p of pages) {
  const relPage = path.relative(root, p).replace(/\\/g, '/');
  const t = fs.readFileSync(p, 'utf8');
  const links = [...t.matchAll(/<a\b[^>]*href=["']([^"']+)["']/g)].map(m => m[1]);

  for (const href of links) {
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) continue;
    if (href.startsWith('http://') || href.startsWith('https://')) {
      if (!href.startsWith('https://inoconnect.com')) continue; // external
    }

    // Clean internal route
    let route = href.replace(/^https:\/\/inoconnect\.com/, '');
    const cleanRoute = route.split('#')[0].split('?')[0];
    if (!cleanRoute) continue;

    // Check if target file exists
    let targetFile = null;
    if (cleanRoute.endsWith('/')) {
      targetFile = path.join(root, cleanRoute.slice(1), 'index.html');
    } else if (cleanRoute.endsWith('.html') || cleanRoute.endsWith('.svg') || cleanRoute.endsWith('.xml') || cleanRoute.endsWith('.png') || cleanRoute.endsWith('.webp')) {
      targetFile = path.join(root, cleanRoute.slice(1));
    } else {
      targetFile = path.join(root, cleanRoute.slice(1), 'index.html');
    }

    if (!fs.existsSync(targetFile)) {
      missingTargets.push({ page: relPage, href, targetFile: path.relative(root, targetFile).replace(/\\/g, '/') });
    }
  }
}

if (missingTargets.length === 0) {
  logPass(`All internal links across ${pages.length} pages point to real on-disk destinations.`);
} else {
  logFail(`Found ${missingTargets.length} broken internal links`, missingTargets.slice(0, 10));
}

// ---------------------------------------------------------
// TEST 2: Static Asset File Existence
// ---------------------------------------------------------
console.log(`\n--- TEST 2: Static Asset File Existence ---`);
const brokenAssets = [];
let totalAssetsChecked = 0;

for (const p of pages) {
  const relPage = path.relative(root, p).replace(/\\/g, '/');
  const t = fs.readFileSync(p, 'utf8');

  // 1. Images
  for (const m of t.matchAll(/<img\b[^>]*src=["']([^"']+)["']/g)) {
    totalAssetsChecked++;
    const src = m[1].split('?')[0];
    if (src.startsWith('http')) {
      brokenAssets.push({ page: relPage, type: 'img-external', src });
      continue;
    }
    const resolved = path.join(root, src.startsWith('/') ? src.slice(1) : src);
    if (!fs.existsSync(resolved)) {
      brokenAssets.push({ page: relPage, type: 'img-missing', src, resolved: path.relative(root, resolved) });
    }
  }

  // 2. Stylesheets
  for (const m of t.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/g)) {
    totalAssetsChecked++;
    const href = m[1].split('?')[0];
    if (href.startsWith('http')) continue;
    const resolved = path.join(root, href.startsWith('/') ? href.slice(1) : href);
    if (!fs.existsSync(resolved)) {
      brokenAssets.push({ page: relPage, type: 'css-missing', href });
    }
  }

  // 3. Scripts
  for (const m of t.matchAll(/<script\b[^>]*src=["']([^"']+)["']/g)) {
    totalAssetsChecked++;
    const src = m[1].split('?')[0];
    if (src.startsWith('http')) continue;
    const resolved = path.join(root, src.startsWith('/') ? src.slice(1) : src);
    if (!fs.existsSync(resolved)) {
      brokenAssets.push({ page: relPage, type: 'js-missing', src });
    }
  }
}

if (brokenAssets.length === 0) {
  logPass(`All ${totalAssetsChecked} referenced assets (<img src>, <link href>, <script src>) exist on disk.`);
} else {
  logFail(`Found ${brokenAssets.length} broken asset references`, brokenAssets.slice(0, 10));
}

// ---------------------------------------------------------
// TEST 3: Script Syntax Check (Every inline & external script)
// ---------------------------------------------------------
console.log(`\n--- TEST 3: JavaScript Syntax Check ---`);
const jsSyntaxErrors = [];

// Check external assets
const externalScripts = ['assets/contact-form.js', 'assets/tool-capture.js'];
for (const es of externalScripts) {
  const p = path.join(root, es);
  if (!fs.existsSync(p)) {
    jsSyntaxErrors.push({ file: es, error: 'File does not exist' });
  } else {
    try {
      const code = fs.readFileSync(p, 'utf8');
      new vm.Script(code, { filename: es });
    } catch (err) {
      jsSyntaxErrors.push({ file: es, error: err.message });
    }
  }
}

// Check inline scripts across pages
let inlineScriptsChecked = 0;
for (const p of pages) {
  const relPage = path.relative(root, p).replace(/\\/g, '/');
  const t = fs.readFileSync(p, 'utf8');
  for (const sm of t.matchAll(/<script\b(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi)) {
    const code = sm[1].trim();
    if (!code) continue;
    if (/type=["']application\/ld\+json["']/i.test(sm[0])) continue;

    inlineScriptsChecked++;
    try {
      new vm.Script(code, { filename: `${relPage}:inline` });
    } catch (err) {
      jsSyntaxErrors.push({ page: relPage, error: err.message, snippet: code.slice(0, 80) });
    }
  }
}

if (jsSyntaxErrors.length === 0) {
  logPass(`All external JS files and ${inlineScriptsChecked} inline script blocks pass strict vm.Script syntax compilation.`);
} else {
  logFail(`Found ${jsSyntaxErrors.length} JS syntax errors`, jsSyntaxErrors);
}

// ---------------------------------------------------------
// TEST 4: JSON-LD Structured Data Parsing
// ---------------------------------------------------------
console.log(`\n--- TEST 4: JSON-LD Syntax & Structure ---`);
const jsonErrors = [];
let totalJsonLd = 0;

for (const p of pages) {
  const relPage = path.relative(root, p).replace(/\\/g, '/');
  const t = fs.readFileSync(p, 'utf8');
  for (const m of t.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    totalJsonLd++;
    try {
      const parsed = JSON.parse(m[1]);
      if (typeof parsed !== 'object' || parsed === null) {
        jsonErrors.push({ page: relPage, error: 'Parsed JSON-LD is not an object' });
      }
    } catch (err) {
      jsonErrors.push({ page: relPage, error: err.message, snippet: m[1].slice(0, 100) });
    }
  }
}

if (jsonErrors.length === 0) {
  logPass(`All ${totalJsonLd} JSON-LD blocks parsed cleanly without syntax errors.`);
} else {
  logFail(`Found ${jsonErrors.length} invalid JSON-LD scripts`, jsonErrors);
}

// ---------------------------------------------------------
// TEST 5: CSS File Verification
// ---------------------------------------------------------
console.log(`\n--- TEST 5: Compiled assets/site.css ---`);
const cssPath = path.join(root, 'assets', 'site.css');
if (!fs.existsSync(cssPath)) {
  logFail('assets/site.css does not exist!');
} else {
  const css = fs.readFileSync(cssPath, 'utf8');
  if (css.length < 1000) {
    logFail(`assets/site.css is suspiciously small (${css.length} bytes)`);
  } else {
    const criticalClasses = [
      '.text-primary',
      '.bg-primary',
      '.text-secondary',
      '.text-accent',
      '.grid-cols-1',
      '.sm\\:grid-cols-3',
      '.sr-only',
      '.focus\\:not-sr-only'
    ];
    const missingClasses = criticalClasses.filter(c => !css.includes(c));
    if (missingClasses.length === 0) {
      logPass(`assets/site.css is valid (${(css.length/1024).toFixed(1)} KB) and contains all critical brand & grid classes.`);
    } else {
      logFail('Missing critical classes in assets/site.css', missingClasses);
    }
  }
}

// ---------------------------------------------------------
// TEST 6: Calculator Sync & Formulas
// ---------------------------------------------------------
console.log(`\n--- TEST 6: Calculator Sync & Formulas ---`);
const calculatorChecks = [
  {
    file: 'tools/roas-calculator/index.html',
    expected: {
      'roas-out': '3.75x',
      'breakeven-out': '1.54x',
      'profit-out': '+$28,750',
      'max-cac-out': '$98'
    }
  },
  {
    file: 'tools/ltv-calculator/index.html',
    expected: {
      'ltv-result': '$800',
      'lifespan-result': '20.0 Months',
      'max-cac-result': '$267',
      'elite-cac-result': '$160'
    }
  },
  {
    file: 'tools/email-revenue-simulator/index.html',
    expected: {
      'monthly-total-rev': '$13,194 / mo',
      'rpr-out': '$0.09 / email',
      'monthly-clicks-out': '2,800 clicks'
    }
  },
  {
    file: 'tools/cro-simulator/index.html',
    expected: {
      'annual-rev-out': '+$720,000',
      'monthly-rev-out': '+$60,000 / mo',
      'ad-savings-out': '+$34,722 / mo'
    }
  }
];

for (const calc of calculatorChecks) {
  const content = fs.readFileSync(path.join(root, calc.file), 'utf8');
  let toolOk = true;
  for (const [id, expectedVal] of Object.entries(calc.expected)) {
    const m = content.match(new RegExp(`id="${id}"[^>]*>([^<]+)<`));
    const val = m ? m[1].trim() : null;
    if (val !== expectedVal) {
      logFail(`Mismatch in ${calc.file} for id="${id}": expected "${expectedVal}", found "${val}"`);
      toolOk = false;
    }
  }
  if (toolOk) {
    logPass(`All static defaults in ${calc.file} verified match JS math.`);
  }
}

// ---------------------------------------------------------
// TEST 7: Deploy Directory Parity & Standalone Integrity
// ---------------------------------------------------------
console.log(`\n--- TEST 7: _deploy/ Integrity ---`);
const deployDir = path.join(root, '_deploy');
if (!fs.existsSync(deployDir)) {
  logFail('_deploy directory does not exist!');
} else {
  const deployPages = [];
  (function walkDeploy(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walkDeploy(p);
      else if (e.name === 'index.html') deployPages.push(p);
    }
  })(deployDir);

  if (deployPages.length !== pages.length) {
    logFail(`_deploy has ${deployPages.length} index.html files (expected ${pages.length})`);
  } else {
    logPass(`_deploy contains all ${pages.length} pages.`);
  }

  const reqDeployFiles = ['404.html', '.htaccess', 'site.webmanifest', 'assets/site.css', 'assets/contact-form.js', 'assets/tool-capture.js'];
  const missingDeploy = reqDeployFiles.filter(f => !fs.existsSync(path.join(deployDir, f)));
  if (missingDeploy.length === 0) {
    logPass(`_deploy contains all critical production support files (404, .htaccess, manifest, site.css, JS assets).`);
  } else {
    logFail('_deploy missing files', missingDeploy);
  }
}

// ---------------------------------------------------------
// SUMMARY
// ---------------------------------------------------------
console.log(`\n====================================================`);
if (totalErrors === 0) {
  console.log(`ALL ADVERSARIAL CHECKS PASSED (0 ERRORS DETECTED)`);
} else {
  console.error(`ADVERSARIAL AUDIT FAILED WITH ${totalErrors} ERROR(S)`);
}
console.log(`====================================================\n`);
