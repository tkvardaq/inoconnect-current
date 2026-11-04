import fs from 'fs';

let content = fs.readFileSync('index.html', 'utf8');

// Match the video showcase block
const videoRegex = /([ \t]*<!-- Cinema Story Film Showcase[\s\S]*?<\/div>\s*<\/div>\s*<\/div>)/;
const videoMatch = content.match(videoRegex);
if (!videoMatch) {
  console.error('Video showcase not found!');
  process.exit(1);
}

// Remove video showcase from its current position
const videoBlock = videoMatch[0].trim();
content = content.replace(videoRegex, '');

// Adjust classes on videoBlock: change mt-14 to mb-12
const updatedVideoBlock = videoBlock.replace('class="mt-14 max-w-5xl', 'class="mb-12 max-w-5xl');

// Insert video showcase right above the Master Stance Headline
const headlineTarget = '<!-- Master Stance Headline (Impactable & Ogilvy) -->';
if (!content.includes(headlineTarget)) {
  console.error('Headline target not found!');
  process.exit(1);
}

// Also update the second CTA button: href="#hero-cinema-showcase" -> href="/services" and text to "Explore Growth Services"
content = content.replace(
  /<a[^>]*href="#hero-cinema-showcase"[\s\S]*?<\/a>/,
  `<a class="w-full sm:w-auto px-8 py-5 bg-white text-slate-900 border border-slate-200 hover:border-slate-300 font-bold rounded-full transition-all hover:bg-slate-50 text-lg flex items-center justify-center gap-3 group shadow-sm" href="/services">
                <span class="w-8 h-8 rounded-full bg-blue-50 text-[#4169E1] flex items-center justify-center group-hover:scale-110 transition-transform">⚡</span>
                <span>Explore Growth Services</span>
            </a>`
);

content = content.replace(
  headlineTarget,
  `${updatedVideoBlock}\n\n        ${headlineTarget}`
);

fs.writeFileSync('index.html', content, 'utf8');
console.log('Successfully moved video showcase to top of hero in index.html!');
