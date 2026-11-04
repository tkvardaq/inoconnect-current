import fs from 'fs';

const INSTAGRAM_SVG = `<a class="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center hover:bg-primary hover:text-white transition-all text-slate-400 hover:text-white" href="https://www.instagram.com/inoconnect" target="_blank" rel="noopener noreferrer" aria-label="InoConnect on Instagram"><svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg></a>`;

function updatePage(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Add Instagram to footer if not already present
  if (!content.includes('instagram.com/inoconnect')) {
    // Find LinkedIn link
    const linkedinRegex = /(<a[^>]*href="https:\/\/(?:www\.)?linkedin\.com\/company\/inoconnect\/?"[^>]*>[\s\S]*?<\/a>)/;
    if (linkedinRegex.test(content)) {
      content = content.replace(linkedinRegex, `$1\n${INSTAGRAM_SVG}`);
      changed = true;
    }
  }

  // 2. Add Home and Tools to desktop nav
  // Find <nav class="hidden lg:flex items-center gap-[0-9]+">
  // Check if Home is already in desktop nav
  const desktopNavMatch = content.match(/<nav class="hidden lg:flex items-center gap-[0-9]+">([\s\S]*?)<\/nav>/);
  if (desktopNavMatch) {
    let navInner = desktopNavMatch[1];
    let navUpdated = false;

    // Adjust gap to gap-8
    let navTag = desktopNavMatch[0].match(/<nav class="hidden lg:flex items-center gap-[0-9]+">/)[0];
    const newNavTag = '<nav class="hidden lg:flex items-center gap-7">';

    if (!navInner.includes('href="/"') && !navInner.includes('href=""')) {
      // Insert Home before Services
      navInner = `\n<a class="nav-link text-sm uppercase tracking-widest hover:text-primary transition-colors" href="/">Home</a>` + navInner;
      navUpdated = true;
    }

    if (!navInner.includes('href="/tools"')) {
      // Insert Tools after Industries mega menu
      const indMenuEnd = '<!-- Industries Mega Menu -->';
      const indCloseTag = navInner.indexOf('<!-- Industries Mega Menu -->');
      if (indCloseTag !== -1) {
        // Find closing </div> of Industries
        const divClose = navInner.indexOf('</div>', navInner.indexOf('</div>', indCloseTag) + 6);
        if (divClose !== -1) {
          const insertPos = divClose + 6;
          navInner = navInner.slice(0, insertPos) + '\n<a class="nav-link text-sm uppercase tracking-widest hover:text-primary transition-colors" href="/tools">Tools</a>' + navInner.slice(insertPos);
          navUpdated = true;
        }
      }
    }

    if (navUpdated || navTag !== newNavTag) {
      content = content.replace(desktopNavMatch[0], `${newNavTag}${navInner}</nav>`);
      changed = true;
    }
  }

  // 3. Add Home and Tools to mobile nav
  const mobileNavMatch = content.match(/<nav class="space-y-4">([\s\S]*?)<\/nav>/);
  if (mobileNavMatch) {
    let mobInner = mobileNavMatch[1];
    let mobUpdated = false;

    if (!mobInner.includes('href="/"') && !mobInner.includes('href=""')) {
      mobInner = `\n<a class="block text-3xl font-black text-white" href="/">Home</a>` + mobInner;
      mobUpdated = true;
    }

    if (!mobInner.includes('href="/tools"')) {
      // Insert Tools after Industries accordion
      const indAccordion = 'data-accordion="industries"';
      const indIdx = mobInner.indexOf(indAccordion);
      if (indIdx !== -1) {
        // Find end of that accordion div
        const closeDiv = mobInner.indexOf('</div>', mobInner.indexOf('</div>', indIdx) + 6);
        if (closeDiv !== -1) {
          const insertPos = closeDiv + 6;
          mobInner = mobInner.slice(0, insertPos) + '\n<a class="block text-3xl font-black text-white" href="/tools">Tools</a>' + mobInner.slice(insertPos);
          mobUpdated = true;
        }
      }
    }

    if (mobUpdated) {
      content = content.replace(mobileNavMatch[0], `<nav class="space-y-4">${mobInner}</nav>`);
      changed = true;
    }
  }

  // 4. Update Schema sameAs if present
  if (content.includes('"@type":"Organization"') && !content.includes('instagram.com/inoconnect')) {
    content = content.replace(
      /"areaServed":\["US","UK"\]\}/,
      `"areaServed":["US","UK"],"sameAs":["https://www.linkedin.com/company/inoconnect/","https://www.instagram.com/inoconnect"]}`
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated navigation & social on: ${filePath}`);
  }
}

// Test on index.html
updatePage('index.html');
