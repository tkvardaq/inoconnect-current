import fs from 'fs';
import path from 'path';

const guide = fs.readFileSync('blog/schema-markup-guide/index.html', 'utf8');

const headEndIdx = guide.indexOf('</head>');
const mainStartIdx = guide.indexOf('<main id="main"');
const mainEndIdx = guide.indexOf('</main>');

// 1. Everything between </head> and <main id="main">
const beforeMain = guide.slice(headEndIdx + 7, mainStartIdx);

// 2. Everything after </main>
const afterMain = guide.slice(mainEndIdx + 7);

const articlesData = [
  {
    slug: 'ai-marketing-tools',
    title: 'AI Marketing Tools: What to Use and How to Choose | InoConnect',
    h1: 'AI Marketing Tools:<br/>What to Use, What to Skip and How to Choose',
    metaDesc: 'A practical guide to AI marketing tools: ChatGPT, Claude, Gemini, Perplexity, Jasper, Surfer, Clay, Zapier and more, with honest pros, cons and use cases.',
    date: '2026-10-16',
    visibleDate: 'October 16, 2026',
    category: 'Content & Social',
    readTime: '9 min read',
    stats: [
      { val: '68%', label: 'Workflow Time Saved' },
      { val: '10+', label: 'Enterprise Tools Evaluated' },
      { val: '0%', label: 'Unchecked Hallucinations' }
    ],
    related: [
      { title: 'Authority Assets Strategy: Build Content That Converts', time: '8 min read', slug: 'authority-assets-strategy' },
      { title: 'LinkedIn Thought Leadership: Turn Expertise into Demand', time: '6 min read', slug: 'linkedin-thought-leadership' },
      { title: 'Zero-Click Content: Optimizing for Search AI Overviews', time: '7 min read', slug: 'zero-click-content' }
    ]
  },
  {
    slug: 'digital-marketing-strategy',
    title: 'Digital Marketing Strategy: How to Create One | InoConnect',
    h1: 'Digital Marketing Strategy:<br/>How to Create One That Drives Revenue',
    metaDesc: 'Learn how to create a digital marketing strategy in 8 steps: goals, audience, channels, budget and KPIs. Includes examples, a channel table and mistakes.',
    date: '2026-10-05',
    visibleDate: 'October 5, 2026',
    category: 'Industry Playbooks',
    readTime: '9 min read',
    stats: [
      { val: '8', label: 'Core Implementation Steps' },
      { val: '100%', label: 'Multi-Channel Alignment' },
      { val: '3.4x', label: 'Faster Time-to-Pipeline' }
    ],
    related: [
      { title: 'B2B Enterprise Account-Based Marketing (ABM) Playbook', time: '8 min read', slug: 'b2b-enterprise-abm' },
      { title: 'PPC vs SEO: Which Should You Invest In', time: '8 min read', slug: 'ppc-vs-seo' },
      { title: 'ROAS Formula: How to Calculate and Interpret ROAS', time: '9 min read', slug: 'roas-formula' }
    ]
  },
  {
    slug: 'how-to-improve-conversion-rate',
    title: 'How to Improve Conversion Rate: 12 CRO Tips | InoConnect',
    h1: 'How to Improve Conversion Rate:<br/>12 CRO Tips That Work',
    metaDesc: 'Learn how to improve conversion rate with a simple formula, a research-first process and 12 conversion rate optimization tips, plus examples and mistakes.',
    date: '2026-10-23',
    visibleDate: 'October 23, 2026',
    category: 'Web & CRO',
    readTime: '9 min read',
    stats: [
      { val: '12', label: 'Actionable CRO Tactics' },
      { val: '+34%', label: 'Median Conversion Lift' },
      { val: '<2.5s', label: 'Target Page Load Time' }
    ],
    related: [
      { title: 'Core Web Vitals: The Silent Revenue Killer', time: '6 min read', slug: 'core-web-vitals-revenue' },
      { title: 'Pricing Page Psychology: Structure Plans to Convert', time: '7 min read', slug: 'pricing-page-psychology' },
      { title: 'Design Systems at Scale: Consistent UI Engineering', time: '8 min read', slug: 'design-systems-scale' }
    ]
  },
  {
    slug: 'ppc-vs-seo',
    title: 'PPC vs SEO: Which to Choose and When to Combine | InoConnect',
    h1: 'PPC vs SEO:<br/>Which Should You Invest In (and When to Use Both)',
    metaDesc: 'PPC vs SEO compared on cost, speed, ROI and risk. See when each wins, how PPC and SEO work together, and how to split your marketing budget.',
    date: '2026-10-12',
    visibleDate: 'October 12, 2026',
    category: 'SEO',
    readTime: '8 min read',
    stats: [
      { val: '4-6 Mo', label: 'Organic Compounding Horizon' },
      { val: '<24 Hr', label: 'Paid Intent Capture Speed' },
      { val: '60/40', label: 'Optimal Budget Split' }
    ],
    related: [
      { title: 'Technical SEO Audit Guide for Enterprise Brands', time: '8 min read', slug: 'technical-seo-audit' },
      { title: 'Google Ads Quality Score: How to Cut CPC by 50%', time: '7 min read', slug: 'google-ads-quality-score' },
      { title: 'What Is Cost Per Click? CPC Formula and Tips', time: '8 min read', slug: 'what-is-cost-per-click' }
    ]
  },
  {
    slug: 'roas-formula',
    title: 'ROAS Formula: How to Calculate ROAS (Examples) | InoConnect',
    h1: 'ROAS Formula:<br/>How to Calculate ROAS and Know What a Good Number Is',
    metaDesc: 'Learn the ROAS formula, how to calculate ROAS, find your break-even ROAS and avoid common mistakes. Worked examples plus a free calculator to try.',
    date: '2026-10-02',
    visibleDate: 'October 2, 2026',
    category: 'Paid Ads',
    readTime: '9 min read',
    stats: [
      { val: '100%', label: 'Unit Economic Precision' },
      { val: '4:1', label: 'Healthy Baseline ROAS' },
      { val: '0', label: 'Hidden Spend Leakage' }
    ],
    related: [
      { title: 'What Is Cost Per Click? CPC Formula and Tips', time: '8 min read', slug: 'what-is-cost-per-click' },
      { title: 'Meta Ads Scaling: Vertical vs Horizontal Budgets', time: '8 min read', slug: 'meta-ads-scaling' },
      { title: 'Retargeting Omnipresence: Convert High-Intent B2B Visitors', time: '7 min read', slug: 'retargeting-omnipresence' }
    ]
  },
  {
    slug: 'what-is-cost-per-click',
    title: 'What Is Cost Per Click? CPC Formula and Tips | InoConnect',
    h1: 'What Is Cost Per Click (CPC)?<br/>Formula, Average CPC and How to Lower It',
    metaDesc: 'What is cost per click? Learn the CPC formula, what drives average CPC, why it varies by industry and 8 proven ways to lower CPC without losing leads.',
    date: '2026-10-08',
    visibleDate: 'October 8, 2026',
    category: 'Paid Ads',
    readTime: '8 min read',
    stats: [
      { val: '8', label: 'Proven CPC Reduction Tactics' },
      { val: '10/10', label: 'Target Quality Score' },
      { val: '-28%', label: 'Typical Waste Reduction' }
    ],
    related: [
      { title: 'ROAS Formula: How to Calculate and Interpret ROAS', time: '9 min read', slug: 'roas-formula' },
      { title: 'Google Ads Quality Score: How to Cut CPC by 50%', time: '7 min read', slug: 'google-ads-quality-score' },
      { title: 'PPC vs SEO: Which Should You Invest In', time: '8 min read', slug: 'ppc-vs-seo' }
    ]
  }
];

for (const art of articlesData) {
  // Read body from markdown file
  const mdPath = path.join('D:/AI/inoconnect-site/src/content/blog', `${art.slug}.md`);
  const rawMd = fs.readFileSync(mdPath, 'utf8');
  let bodyHtml = rawMd.replace(/^---[\s\S]*?---/, '').trim();

  // Fix internal links inside body
  bodyHtml = bodyHtml.replace(/\/services\/ai-services\//g, '/services/ai-automation/');
  bodyHtml = bodyHtml.replace(/\/tools\/ppc-budget-planner\//g, '/tools/roas-calculator/');

  // Extract all H2s from bodyHtml to build TOC
  const h2Matches = [...bodyHtml.matchAll(/<h2\s+id="([^"]+)">([^<]+)<\/h2>/g)];
  let tocLinks = '';
  for (const m of h2Matches) {
    tocLinks += `\n<a class="toc-link" href="#${m[1]}">${m[2]}</a>`;
  }

  // Build JSON-LD
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `https://inoconnect.com/blog/${art.slug}/#article`,
        "isPartOf": {
          "@type": "WebPage",
          "@id": `https://inoconnect.com/blog/${art.slug}/`
        },
        "headline": art.title.replace(' | InoConnect', ''),
        "description": art.metaDesc,
        "datePublished": art.date,
        "dateModified": art.date,
        "mainEntityOfPage": `https://inoconnect.com/blog/${art.slug}/`,
        "author": {
          "@type": "Organization",
          "name": "InoConnect Strategy Team",
          "url": "https://inoconnect.com"
        },
        "publisher": {
          "@type": "Organization",
          "name": "InoConnect",
          "url": "https://inoconnect.com",
          "logo": {
            "@type": "ImageObject",
            "url": "https://inoconnect.com/logo.png"
          }
        },
        "image": {
          "@type": "ImageObject",
          "url": `https://inoconnect.com/images/stock/${art.slug}.webp`,
          "width": 1200,
          "height": 678
        }
      },
      {
        "@type": "Organization",
        "@id": "https://inoconnect.com/#organization",
        "name": "InoConnect",
        "url": "https://inoconnect.com",
        "logo": "https://inoconnect.com/logo.png",
        "sameAs": [
          "https://www.linkedin.com/company/inoconnect/",
          "https://www.instagram.com/inoconnect"
        ]
      }
    ]
  }, null, 2);

  // Build Stats Bar
  const statsHtml = `
<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 reveal-on-scroll">
<div class="stat-card">
<div class="text-3xl font-black text-primary mb-1">${art.stats[0].val}</div>
<div class="text-xs font-bold text-slate-500 uppercase tracking-wider">${art.stats[0].label}</div>
</div>
<div class="stat-card">
<div class="text-3xl font-black text-secondary mb-1">${art.stats[1].val}</div>
<div class="text-xs font-bold text-slate-500 uppercase tracking-wider">${art.stats[1].label}</div>
</div>
<div class="stat-card">
<div class="text-3xl font-black text-accent mb-1">${art.stats[2].val}</div>
<div class="text-xs font-bold text-slate-500 uppercase tracking-wider">${art.stats[2].label}</div>
</div>
</div>`;

  // Build Related Reading HTML
  let relatedHtml = '';
  for (const rel of art.related) {
    relatedHtml += `
<a class="block group" href="/blog/${rel.slug}">
<div class="text-xs font-bold text-slate-700 group-hover:text-primary transition-colors leading-snug mb-1">${rel.title}</div>
<div class="text-xs text-slate-400">${rel.time}</div>
</a>`;
  }

  // Assemble full HTML page
  const pageHtml = `<!DOCTYPE html>
<html class="scroll-smooth" lang="en">
<head>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WQWXHJ3M');</script>
<!-- End Google Tag Manager -->
<!-- Google Analytics 4 -->
<script async="" src="https://www.googletagmanager.com/gtag/js?id=G-4P94TTME1B"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-4P94TTME1B');
</script>
<!-- End Google Analytics 4 -->
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>${art.title}</title>
<link href="https://inoconnect.com/blog/${art.slug}/" rel="canonical"/>
<meta content="${art.metaDesc}" name="description"/>
<!-- Open Graph / Facebook -->
<meta content="article" property="og:type"/>
<meta content="https://inoconnect.com/blog/${art.slug}/" property="og:url"/>
<meta content="${art.title}" property="og:title"/>
<meta content="${art.metaDesc}" property="og:description"/>
<meta content="https://inoconnect.com/images/stock/${art.slug}.webp" property="og:image"/>
<!-- Twitter -->
<meta content="summary_large_image" property="twitter:card"/>
<meta content="https://inoconnect.com/blog/${art.slug}/" property="twitter:url"/>
<meta content="${art.title}" property="twitter:title"/>
<meta content="${art.metaDesc}" property="twitter:description"/>
<meta content="https://inoconnect.com/images/stock/${art.slug}.webp" property="twitter:image"/>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&amp;display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="/assets/site.css?v=20261103"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&amp;display=swap" rel="stylesheet"/>
<script type="application/ld+json">
${jsonLd}
</script>
<noscript><style>.reveal-on-scroll{opacity:1!important;transform:none!important}</style></noscript>
</head>${beforeMain}<main id="main" class="bg-white min-h-screen pt-28 pb-24">
<!-- ── Hero ── -->
<div class="max-w-4xl mx-auto px-6 text-center mb-14 reveal-on-scroll">
<div class="flex items-center justify-center gap-3 mb-5">
<a class="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-colors" href="/blog">Blog</a>
<span class="text-slate-300">›</span>
<span class="inline-block bg-primary/10 text-primary font-black tracking-widest uppercase text-xs px-4 py-1.5 rounded-full">${art.category}</span>
</div>
<h1 class="text-4xl md:text-5xl font-black text-[#1e293b] tracking-tight leading-tight mb-6">
  ${art.h1}
</h1>
<p class="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed mb-8">
  ${art.metaDesc}
</p>
<div class="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500">
<div class="flex items-center gap-2">
<div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-xs">IS</div>
<span class="font-semibold text-slate-700">InoConnect Strategy Team</span>
</div>
<span class="text-slate-300">·</span>
<time datetime="${art.date}">${art.visibleDate}</time>
<span class="text-slate-300">·</span>
<span>${art.readTime}</span>
</div>
</div>

<!-- ── Featured Image ── -->
<div class="max-w-4xl mx-auto px-6 mb-16 reveal-on-scroll">
<div class="rounded-3xl overflow-hidden aspect-[16/9] shadow-2xl border border-slate-100 bg-slate-100">
<img alt="${art.title.replace(' | InoConnect', '')}" class="w-full h-full object-cover" decoding="async" src="/images/stock/${art.slug}.webp" width="1200" height="678" loading="lazy"/>
</div>
</div>

<!-- ── Content Layout ── -->
<div class="max-w-7xl mx-auto px-6">
<div class="flex gap-12 justify-center">

<!-- Sticky Left Share Bar -->
<aside class="hidden xl:flex flex-col items-center gap-4 pt-2 sticky top-28 self-start">
<span class="text-xs font-black uppercase tracking-widest text-slate-400 rotate-180" style="writing-mode:vertical-rl">Share</span>
<div class="w-px h-10 bg-slate-200"></div>
<a class="w-10 h-10 rounded-full bg-slate-100 hover:bg-[#0077b5] hover:text-white text-slate-500 flex items-center justify-center transition-all hover:scale-110" href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Finoconnect.com%2Fblog%2F${art.slug}%2F" target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" title="Share on LinkedIn">
<svg class="w-4 h-4" fill="currentColor" viewbox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
</a>
</aside>

<!-- Article Main Body -->
<article class="flex-1 min-w-0 article-body">
${statsHtml}

<div class="prose max-w-none text-slate-600 leading-relaxed text-base space-y-6">
${bodyHtml}
</div>

<!-- ── End of Article CTA ── -->
<div class="mt-16 p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden reveal-on-scroll">
<div class="relative z-10">
<span class="inline-block px-3 py-1 bg-accent text-white text-xs font-black uppercase tracking-widest rounded-full mb-4">Strategic Execution</span>
<h2 class="text-2xl font-black mb-3">Scale Your Acquisition with InoConnect</h2>
<p class="text-slate-400 text-sm mb-6 max-w-lg">Get full transparency into your commercial levers. Book a confidential growth architecture consultation with our senior strategy team.</p>
<a class="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-black uppercase tracking-widest rounded-full transition-all shadow-lg shadow-blue-500/20" href="/contact">
<span>Schedule Strategy Session</span>
<span>→</span>
</a>
</div>
</div>

<!-- ── Author Card ── -->
<div class="mt-10 p-6 rounded-2xl border border-slate-100 flex items-center gap-5">
<div class="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-lg flex-shrink-0">IS</div>
<div>
<div class="font-black text-[#1e293b]">InoConnect Strategy Team</div>
<div class="text-xs text-slate-500 mt-1">Written by senior performance media directors, SEO architects, and conversion systems specialists at InoConnect.</div>
</div>
</div>
</article>

<!-- Right Sidebar: TOC & Related Reading -->
<aside class="hidden lg:block w-64 flex-shrink-0 toc-sidebar">
<div class="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-6">
<h3 class="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">In this article</h3>
<nav class="space-y-1">
${tocLinks}
</nav>
</div>

<div class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
<h3 class="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Related Reading</h3>
<div class="space-y-4">
${relatedHtml}
</div>
</div>
</aside>

</div>
</div>
</main>${afterMain}`;

  const outDir = path.join('blog', art.slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), pageHtml, 'utf8');
  console.log(`Successfully built blog/${art.slug}/index.html (${pageHtml.length} bytes)`);
}
