import fs from 'fs';
import path from 'path';

const INSTAGRAM_SVG = `<a class="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center hover:bg-primary hover:text-white transition-all text-slate-400 hover:text-white" href="https://www.instagram.com/inoconnect" target="_blank" rel="noopener noreferrer" aria-label="InoConnect on Instagram"><svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg></a>`;

function walk(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    if (item === 'node_modules' || item === '.git' || item === '_deploy' || item === '_plan') continue;
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      files = files.concat(walk(full));
    } else if (item.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

const allHtmls = walk('.');
console.log(`Processing global navigation across ${allHtmls.length} files...`);

for (const file of allHtmls) {
  if (file === '404.html') continue; // handle 404 separately
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // 1. Desktop Nav Gap & Links
  content = content.replace(
    /<nav class="hidden lg:flex items-center gap-[0-9]+">/,
    '<nav class="hidden lg:flex items-center gap-7">'
  );

  // Add Home before Services
  if (!content.includes('href="/" class="nav-link') && !content.includes('class="nav-link" href="/"') && !content.includes('href="/">Home</a>')) {
    const isHome = file === 'index.html';
    const homeClass = isHome ? 'nav-link text-sm uppercase tracking-widest text-primary font-black active' : 'nav-link text-sm uppercase tracking-widest hover:text-primary transition-colors';
    content = content.replace(
      '<!-- Services Mega Menu -->',
      `<a class="${homeClass}" href="/">Home</a>\n<!-- Services Mega Menu -->`
    );
    changed = true;
  }

  // Add Tools before About
  if (!content.includes('href="/tools">Tools</a>')) {
    const isTools = file.startsWith('tools' + path.sep) || file === 'tools/index.html';
    const toolsClass = isTools ? 'nav-link text-sm uppercase tracking-widest text-primary font-black active' : 'nav-link text-sm uppercase tracking-widest hover:text-primary transition-colors';
    content = content.replace(
      '<a class="nav-link text-sm uppercase tracking-widest" href="/about">About</a>',
      `<a class="${toolsClass}" href="/tools">Tools</a>\n<a class="nav-link text-sm uppercase tracking-widest" href="/about">About</a>`
    );
    changed = true;
  }

  // 2. Mobile Nav
  // Add Home before Services accordion
  if (!content.includes('<a class="block text-3xl font-black text-white hover:text-primary transition-colors" href="/">Home</a>') &&
      !content.includes('<a class="block text-3xl font-black text-primary" href="/">Home</a>') &&
      !content.includes('href="/">Home</a>\n<div class="space-y-4">\n<button class="w-full flex items-center justify-between text-3xl font-black text-white" data-accordion="services">')) {
    const isHome = file === 'index.html';
    const homeClass = isHome ? 'block text-3xl font-black text-primary' : 'block text-3xl font-black text-white hover:text-primary transition-colors';
    content = content.replace(
      '<div class="space-y-4">\n<button class="w-full flex items-center justify-between text-3xl font-black text-white" data-accordion="services">',
      `<a class="${homeClass}" href="/">Home</a>\n<div class="space-y-4">\n<button class="w-full flex items-center justify-between text-3xl font-black text-white" data-accordion="services">`
    );
    changed = true;
  }

  // Add Tools before About in mobile nav
  if (!content.includes('href="/tools">Tools</a>\n<a class="block text-3xl font-black text-white" href="/about">About</a>')) {
    const isTools = file.startsWith('tools' + path.sep) || file === 'tools/index.html';
    const toolsClass = isTools ? 'block text-3xl font-black text-primary' : 'block text-3xl font-black text-white hover:text-primary transition-colors';
    content = content.replace(
      '<a class="block text-3xl font-black text-white" href="/about">About</a>',
      `<a class="${toolsClass}" href="/tools">Tools</a>\n<a class="block text-3xl font-black text-white" href="/about">About</a>`
    );
    changed = true;
  }

  // 3. Instagram in footer next to LinkedIn
  if (!content.includes('instagram.com/inoconnect')) {
    const linkedinRegex = /(<a[^>]*href="https:\/\/(?:www\.)?linkedin\.com\/company\/inoconnect\/?"[^>]*>[\s\S]*?<\/a>)/;
    if (linkedinRegex.test(content)) {
      content = content.replace(linkedinRegex, `$1\n${INSTAGRAM_SVG}`);
      changed = true;
    }
  }

  // 4. Growth Tools in footer Company column
  if (!content.includes('href="/tools">Growth Tools</a>')) {
    if (content.includes('<li><a class="text-slate-400 hover:text-primary transition-colors" href="/about">About Us</a></li>')) {
      content = content.replace(
        '<li><a class="text-slate-400 hover:text-primary transition-colors" href="/about">About Us</a></li>',
        '<li><a class="text-slate-400 hover:text-primary transition-colors" href="/about">About Us</a></li>\n<li><a class="text-slate-400 hover:text-primary transition-colors" href="/tools">Growth Tools</a></li>'
      );
      changed = true;
    }
  }

  // 5. Organization Schema sameAs
  if (content.includes('"@type":"Organization"') && !content.includes('instagram.com/inoconnect')) {
    content = content.replace(
      /"areaServed":\["US","UK"\]\}/,
      `"areaServed":["US","UK"],"sameAs":["https://www.linkedin.com/company/inoconnect/","https://www.instagram.com/inoconnect"]}`
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
  }
}

// 6. Contact Page Direct Channels block
const contactFile = 'contact/index.html';
let contactContent = fs.readFileSync(contactFile, 'utf8');
if (!contactContent.includes('@inoconnect')) {
  const targetChannel = '<!-- UK Office -->';
  const instaChannelBlock = `<!-- Official Instagram -->
                        <div class="flex items-start gap-4">
                            <div class="w-12 h-12 rounded-2xl bg-[#FF7518]/10 text-[#FF7518] flex items-center justify-center shrink-0 border border-[#FF7518]/20">
                                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                            </div>
                            <div>
                                <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Official Instagram</div>
                                <a href="https://www.instagram.com/inoconnect" target="_blank" rel="noopener noreferrer" class="text-white hover:text-[#FF7518] font-bold text-base transition-colors">@inoconnect</a>
                                <div class="text-xs text-slate-400 mt-1">Growth reels &amp; agency updates</div>
                            </div>
                        </div>\n\n                        ${targetChannel}`;
  contactContent = contactContent.replace(targetChannel, instaChannelBlock);
  fs.writeFileSync(contactFile, contactContent, 'utf8');
  console.log('Added Instagram direct channel to contact/index.html');
}

console.log('Global navigation & social updates completed across all pages!');
