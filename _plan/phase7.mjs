import fs from 'fs';
import path from 'path';

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

const SKIP_LINK = '<a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[#4169E1] focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none">Skip to content</a>';
const NOSCRIPT_REVEAL = '<noscript><style>.reveal-on-scroll{opacity:1!important;transform:none!important}</style></noscript>';

let updatedCount = 0;

for (const p of pages) {
  let content = fs.readFileSync(p, 'utf8');
  let orig = content;
  const rel = path.relative(root, p).replace(/\\/g, '/');

  // 1. Skip link after <body>
  if (!content.includes('href="#main"')) {
    content = content.replace(/(<body[^>]*>)/i, `$1\n    ${SKIP_LINK}`);
  }

  // Ensure <main> has id="main"
  if (content.includes('<main') && !content.includes('<main id="main"') && !content.includes('id="main"')) {
    content = content.replace(/<main\b([^>]*)>/i, (m, attrs) => {
      if (/id=/.test(attrs)) {
        return `<main${attrs}>`;
      }
      return `<main id="main"${attrs}>`;
    });
  }

  // 2. Mobile menu toggle: add aria-expanded="false" aria-controls="mobile-menu"
  content = content.replace(/<button\b([^>]*id="mobile-menu-toggle"[^>]*)>/i, (m, attrs) => {
    if (!attrs.includes('aria-expanded')) {
      attrs += ' aria-expanded="false" aria-controls="mobile-menu"';
    }
    return `<button ${attrs.trim().replace(/\s+/g, ' ')}>`;
  });

  // 3. reveal-on-scroll noscript fallback
  if (content.includes('reveal-on-scroll') && !content.includes('<noscript><style>.reveal-on-scroll')) {
    content = content.replace('</head>', `    ${NOSCRIPT_REVEAL}\n</head>`);
  }

  // 4. Eliminate sub-12px font sizes text-[9px], text-[10px], text-[11px]
  content = content.replace(/text-\[(9|10|11)px\]/g, 'text-xs');

  // 5. Heading skips: change h4 to h3 where it skips h2 -> h4 (especially in footers and blog author boxes)
  // Footer headings:
  content = content.replace(/<h4 class="text-white font-bold mb-4 uppercase tracking-wider text-xs">([\s\S]*?)<\/h4>/g, '<h3 class="text-white font-bold mb-4 uppercase tracking-wider text-xs">$1</h3>');
  // Blog author box:
  content = content.replace(/<h4 class="text-base font-black text-slate-900 m-0">([\s\S]*?)<\/h4>/g, '<h3 class="text-base font-black text-slate-900 m-0">$1</h3>');
  // Any other isolated h4 after h2 that causes a skip
  // Let's also check for other h4 occurrences
  content = content.replace(/<h4 class="([^"]*)">([\s\S]*?)<\/h4>/g, '<h3 class="$1">$2</h3>');

  if (content !== orig) {
    fs.writeFileSync(p, content, 'utf8');
    updatedCount++;
    console.log(`Updated a11y & UI in: ${rel}`);
  }
}

console.log(`Phase 7 complete. Updated ${updatedCount} pages.`);
