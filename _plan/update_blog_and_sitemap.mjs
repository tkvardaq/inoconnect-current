import fs from 'fs';

// 1. Update sitemap.xml
let sitemap = fs.readFileSync('sitemap.xml', 'utf8');
const newSlugs = [
  'how-to-improve-conversion-rate',
  'ai-marketing-tools',
  'ppc-vs-seo',
  'what-is-cost-per-click',
  'digital-marketing-strategy',
  'roas-formula'
];

let newUrls = '';
for (const slug of newSlugs) {
  if (!sitemap.includes(`/blog/${slug}/`)) {
    newUrls += `  <url>\n    <loc>https://inoconnect.com/blog/${slug}/</loc>\n    <lastmod>2026-11-03</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  }
}

if (newUrls) {
  sitemap = sitemap.replace('</urlset>', `${newUrls}</urlset>`);
  fs.writeFileSync('sitemap.xml', sitemap, 'utf8');
  console.log('Added new URLs to sitemap.xml');
} else {
  console.log('URLs already in sitemap.xml');
}

// 2. Update blog/index.html
let blogIndex = fs.readFileSync('blog/index.html', 'utf8');
const gridTarget = '<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">';

const newCardsData = [
  {
    slug: 'how-to-improve-conversion-rate',
    category: 'Web & CRO',
    title: 'How to Improve Conversion Rate: 12 CRO Tips That Work',
    excerpt: 'Learn how to improve conversion rate with a simple formula, a research-first process and 12 conversion rate optimization tips.'
  },
  {
    slug: 'ai-marketing-tools',
    category: 'Content & Social',
    title: 'AI Marketing Tools: What to Use and How to Choose',
    excerpt: 'A practical guide to AI marketing tools: ChatGPT, Claude, Gemini, Perplexity, Jasper, Surfer, Clay, Zapier and more with honest pros and cons.'
  },
  {
    slug: 'ppc-vs-seo',
    category: 'SEO',
    title: 'PPC vs SEO: Which to Choose and When to Combine',
    excerpt: 'PPC vs SEO compared on cost, speed, ROI and risk. See when each wins, how PPC and SEO work together, and how to split your marketing budget.'
  },
  {
    slug: 'what-is-cost-per-click',
    category: 'Paid Media',
    title: 'What Is Cost Per Click? CPC Formula and Tips',
    excerpt: 'What is cost per click? Learn the CPC formula, what drives average CPC, why it varies by industry and 8 proven ways to lower CPC without losing leads.'
  },
  {
    slug: 'digital-marketing-strategy',
    category: 'Industry Strategy',
    title: 'Digital Marketing Strategy: How to Create One That Drives Revenue',
    excerpt: 'Learn how to create a digital marketing strategy in 8 steps: goals, audience, channels, budget and KPIs with worked examples.'
  },
  {
    slug: 'roas-formula',
    category: 'Paid Media',
    title: 'ROAS Formula: How to Calculate ROAS (Worked Examples)',
    excerpt: 'Learn the ROAS formula, how to calculate ROAS, find your break-even ROAS and avoid common mistakes with full worked examples.'
  }
];

let cardsHtml = '';
for (const c of newCardsData) {
  if (!blogIndex.includes(`href="/blog/${c.slug}"`)) {
    cardsHtml += ` <a class="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 flex flex-col h-full" href="/blog/${c.slug}">
<div class="relative h-60 w-full overflow-hidden"> <img alt="${c.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" decoding="async" loading="lazy" src="/images/stock/${c.slug}.webp" width="1200" height="678">
<div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity">
</div>
<div class="absolute top-4 left-4 bg-white/90 backdrop-blur text-[#1e293b] text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                            ${c.category} </div>
</div>
<div class="p-8 flex flex-col flex-grow">
<h2 class="text-2xl font-black text-[#1e293b] leading-tight mb-4 group-hover:text-primary transition-colors">
                            ${c.title} </h2>
<p class="text-slate-600 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed"> ${c.excerpt} </p>
<div class="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
<span class="font-black text-[#6e6e73] uppercase text-xs tracking-widest">Read
                                Analysis</span>
<span class="w-10 h-10 rounded-full bg-[#6e6e73]/10 flex items-center justify-center text-[#6e6e73] group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-45 group-hover:scale-110">→</span>
</div>
</div>
</a>`;
  }
}

if (cardsHtml) {
  blogIndex = blogIndex.replace(gridTarget, gridTarget + cardsHtml);
  fs.writeFileSync('blog/index.html', blogIndex, 'utf8');
  console.log('Prepended new cards to blog/index.html');
} else {
  console.log('Cards already present in blog/index.html');
}
