import fs from 'fs';

const INSTAGRAM_SVG = `<a class="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center hover:bg-primary hover:text-white transition-all text-slate-400 hover:text-white" href="https://www.instagram.com/inoconnect" target="_blank" rel="noopener noreferrer" aria-label="InoConnect on Instagram"><svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg></a>`;

function applyToIndex() {
  let content = fs.readFileSync('index.html', 'utf8');

  // 1. Remove Clutch badge container
  content = content.replace(/[ \t]*<!-- Top Credibility Pill[\s\S]*?<\/div>\r?\n/, '');

  // 2. Extract hero cinema video showcase
  const videoRegex = /([ \t]*<!-- Cinema Story Film Showcase[\s\S]*?<\/div>\s*<\/div>\s*<\/div>)/;
  const videoMatch = content.match(videoRegex);
  if (videoMatch) {
    const videoBlock = videoMatch[0].trim();
    content = content.replace(videoRegex, '');
    const updatedVideo = videoBlock.replace('class="mt-14 max-w-5xl', 'class="mb-12 max-w-5xl');
    const headlineTarget = '<!-- Master Stance Headline (Impactable & Ogilvy) -->';
    content = content.replace(headlineTarget, `${updatedVideo}\n\n        ${headlineTarget}`);
  }

  // 3. Update CTA button from #hero-cinema-showcase to /services
  content = content.replace(
    /<a[^>]*href="#hero-cinema-showcase"[\s\S]*?<\/a>/,
    `<a class="w-full sm:w-auto px-8 py-5 bg-white text-slate-900 border border-slate-200 hover:border-slate-300 font-bold rounded-full transition-all hover:bg-slate-50 text-lg flex items-center justify-center gap-3 group shadow-sm" href="/services">
                <span class="w-8 h-8 rounded-full bg-blue-50 text-[#4169E1] flex items-center justify-center group-hover:scale-110 transition-transform">⚡</span>
                <span>Explore Growth Services</span>
            </a>`
  );

  // 4. Update desktop navigation
  content = content.replace(
    /<nav class="hidden lg:flex items-center gap-[0-9]+">/,
    '<nav class="hidden lg:flex items-center gap-7">'
  );

  // Add Home before Services
  if (!content.includes('href="/" class="nav-link') && !content.includes('class="nav-link" href="/"') && !content.includes('href="/">Home</a>')) {
    content = content.replace(
      '<!-- Services Mega Menu -->',
      '<a class="nav-link text-sm uppercase tracking-widest text-primary font-black" href="/">Home</a>\n<!-- Services Mega Menu -->'
    );
  }

  // Add Tools before About
  if (!content.includes('href="/tools">Tools</a>')) {
    content = content.replace(
      '<a class="nav-link text-sm uppercase tracking-widest" href="/about">About</a>',
      '<a class="nav-link text-sm uppercase tracking-widest" href="/tools">Tools</a>\n<a class="nav-link text-sm uppercase tracking-widest" href="/about">About</a>'
    );
  }

  // 5. Update mobile navigation
  // Add Home before Services button
  if (!content.includes('href="/">Home</a>')) {
    content = content.replace(
      '<div class="space-y-4">\n<button class="w-full flex items-center justify-between text-3xl font-black text-white" data-accordion="services">',
      '<a class="block text-3xl font-black text-primary" href="/">Home</a>\n<div class="space-y-4">\n<button class="w-full flex items-center justify-between text-3xl font-black text-white" data-accordion="services">'
    );
  }

  // Add Tools before About in mobile nav
  if (!content.includes('href="/tools">Tools</a>')) {
    content = content.replace(
      '<a class="block text-3xl font-black text-white" href="/about">About</a>',
      '<a class="block text-3xl font-black text-white" href="/tools">Tools</a>\n<a class="block text-3xl font-black text-white" href="/about">About</a>'
    );
  }

  // 6. Update footer with Instagram
  if (!content.includes('instagram.com/inoconnect')) {
    const linkedinRegex = /(<a[^>]*href="https:\/\/(?:www\.)?linkedin\.com\/company\/inoconnect\/?"[^>]*>[\s\S]*?<\/a>)/;
    content = content.replace(linkedinRegex, `$1\n${INSTAGRAM_SVG}`);
  }

  // 7. Update footer Company column to include Growth Tools
  if (!content.includes('href="/tools">Growth Tools</a>')) {
    content = content.replace(
      '<li><a class="text-slate-400 hover:text-primary transition-colors" href="/about">About Us</a></li>',
      '<li><a class="text-slate-400 hover:text-primary transition-colors" href="/about">About Us</a></li>\n<li><a class="text-slate-400 hover:text-primary transition-colors" href="/tools">Growth Tools</a></li>'
    );
  }

  // 8. Update Organization schema sameAs
  if (content.includes('"@type":"Organization"') && !content.includes('instagram.com/inoconnect')) {
    content = content.replace(
      /"areaServed":\["US","UK"\]\}/,
      `"areaServed":["US","UK"],"sameAs":["https://www.linkedin.com/company/inoconnect/","https://www.instagram.com/inoconnect"]}`
    );
  }

  fs.writeFileSync('index.html', content, 'utf8');
  console.log('Successfully updated index.html!');
}

applyToIndex();
