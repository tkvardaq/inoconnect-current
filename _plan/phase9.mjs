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
const rel = f => path.relative(root, f).replace(/\\/g, '/');

const SCHEDULE = {
  'technical-seo-audit': '2026-01-05',
  'programmatic-seo-saas': '2026-01-12',
  'local-seo-domination': '2026-01-19',
  'link-velocity-strategy': '2026-01-26',
  'schema-markup-guide': '2026-02-02',
  'google-ads-quality-score': '2026-02-09',
  'linkedin-abm-targeting': '2026-02-16',
  'meta-ads-scaling': '2026-02-23',
  'retargeting-omnipresence': '2026-03-02',
  'pinterest-ads-strategy': '2026-03-09',
  'authority-assets-strategy': '2026-03-16',
  'zero-click-content': '2026-03-23',
  'video-marketing-hybrid': '2026-03-30',
  'podcast-networking-strategy': '2026-04-06',
  'linkedin-thought-leadership': '2026-04-13',
  'headless-cms-roi': '2026-04-20',
  'core-web-vitals-revenue': '2026-04-27',
  'design-systems-scale': '2026-05-04',
  'pricing-page-psychology': '2026-05-11',
  'accessibility-growth-lever': '2026-05-18',
  'saas-churn-reduction': '2026-05-25',
  'b2b-enterprise-abm': '2026-06-01',
  'd2c-ecommerce-funnels': '2026-06-08',
  'healthcare-patient-acquisition': '2026-06-15',
  'professional-services-authority': '2026-06-22'
};

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function formatVisibleDate(d) {
  const [y, m, dd] = d.split('-');
  return `${MONTHS[+m - 1]} ${+dd}, ${y}`;
}

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://inoconnect.com/#organization",
  "name": "InoConnect",
  "url": "https://inoconnect.com",
  "logo": "https://inoconnect.com/logo.png",
  "description": "Digital growth marketing agency specializing in SEO, PPC, content marketing, and performance systems for ambitious brands.",
  "email": "info@inoconnect.com",
  "foundingDate": "2021",
  "sameAs": ["https://www.linkedin.com/company/inoconnect/"],
  "areaServed": ["US", "UK"]
};

// 1. Process all 53 pages for Organization schema
for (const p of pages) {
  let content = fs.readFileSync(p, 'utf8');
  let orig = content;
  const r = rel(p);

  if (!content.includes('"Organization"') && !content.includes('"ProfessionalService"')) {
    const script = `<script type="application/ld+json">\n${JSON.stringify(orgSchema, null, 2)}\n</script>`;
    content = content.replace('</head>', `    ${script}\n</head>`);
  }

  // 2. Blog post updates
  if (r.startsWith('blog/') && r !== 'blog/index.html') {
    const slug = r.split('/')[1];
    const dateStr = SCHEDULE[slug];
    if (dateStr) {
      const visibleDate = formatVisibleDate(dateStr);

      // Replace <time datetime="...">...</time>
      content = content.replace(/<time\s+datetime="[^"]*">[\s\S]*?<\/time>/g, `<time datetime="${dateStr}">${visibleDate}</time>`);

      // Replace any other occurrences of "2024-04-10" or "April 10, 2024"
      content = content.replaceAll('2024-04-10', dateStr);
      content = content.replaceAll('April 10, 2024', visibleDate);

      // Generate BlogPosting schema
      const title = (content.match(/<title[^>]*>([\s\S]*?)<\/title>/) || [])[1]?.replace(/&amp;/g, '&').trim() || '';
      const desc = (content.match(/<meta\b[^>]*name=["']description["'][^>]*>/) || [''])[0].match(/content=(?:"([^"]*)"|'([^']*)')/)?.[1] || '';

      const blogSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "description": desc,
        "image": "https://inoconnect.com/images/inoconnect_seo_matrix.png",
        "datePublished": `${dateStr}T09:00:00+00:00`,
        "dateModified": "2026-11-03T12:00:00+00:00",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://inoconnect.com/blog/${slug}/`
        },
        "author": {
          "@type": "Organization",
          "name": "InoConnect Team",
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
        }
      };

      if (!content.includes('"BlogPosting"')) {
        const blogScript = `<script type="application/ld+json">\n${JSON.stringify(blogSchema, null, 2)}\n</script>`;
        content = content.replace('</head>', `    ${blogScript}\n</head>`);
      }
    }
  }

  if (content !== orig) {
    fs.writeFileSync(p, content, 'utf8');
    console.log(`Updated SEO / Schemas / Dates in: ${r}`);
  }
}

console.log('Phase 9 script finished.');
