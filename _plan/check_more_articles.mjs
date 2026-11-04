import fs from 'fs';

const slugs = ['b2b-enterprise-abm', 'headless-cms-roi', 'zero-click-content', 'podcast-networking-strategy'];

for (const slug of slugs) {
  const content = fs.readFileSync(`blog/${slug}/index.html`, 'utf8');
  console.log(slug, {
    hasStatsBar: content.includes('stat-card'),
    hasTOC: content.includes('toc-sidebar'),
    hasAside: content.includes('<aside')
  });
}
