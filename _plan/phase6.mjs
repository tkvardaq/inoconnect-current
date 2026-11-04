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

const LINKEDIN_FOOTER = `<a class="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center hover:bg-primary hover:text-white transition-all text-slate-400 hover:text-white" href="https://www.linkedin.com/company/inoconnect/" target="_blank" rel="noopener noreferrer" aria-label="InoConnect on LinkedIn"><svg class="w-3.5 h-3.5" fill="currentColor" viewbox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg></a>`;

for (const p of pages) {
  let content = fs.readFileSync(p, 'utf8');
  let orig = content;
  const rel = path.relative(root, p).replace(/\\/g, '/');

  // 1. Remove footer Twitter anchor
  content = content.replace(/<a\b[^>]*aria-label="Twitter"[^>]*>[\s\S]*?<\/a>\s*/g, '');

  // 2. Replace footer LinkedIn anchor
  content = content.replace(/<a\b[^>]*aria-label="LinkedIn"[^>]*>[\s\S]*?<\/a>/g, LINKEDIN_FOOTER);

  // 3. Blog post share buttons
  if (rel.startsWith('blog/') && rel !== 'blog/index.html') {
    const slug = rel.split('/')[1];
    const postUrl = `https://inoconnect.com/blog/${slug}/`;
    const encodedUrl = encodeURIComponent(postUrl);
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

    // Remove top bar Twitter button: <a ... title="Share on Twitter">...</a>
    content = content.replace(/<a\b[^>]*title="Share on Twitter"[^>]*>[\s\S]*?<\/a>\s*/g, '');

    // Update top bar LinkedIn button: <a ... title="Share on LinkedIn">
    content = content.replace(/<a\b([^>]*title="Share on LinkedIn"[^>]*)>/g, (m, attrs) => {
      let a = attrs.replace(/href=["']#[^"']*["']/, `href="${shareUrl}" target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn"`);
      if (!a.includes('href=')) {
        a += ` href="${shareUrl}" target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn"`;
      }
      return `<a${a}>`;
    });

    // Remove bottom bar Twitter button: class="share-btn ...">...Twitter...</a>
    content = content.replace(/<a\b[^>]*class="share-btn[^"]*"[^>]*href=["']#["'][^>]*>[\s\S]*?Twitter[\s\S]*?<\/a>\s*/gi, '');

    // Update bottom bar LinkedIn button: class="share-btn ...">...LinkedIn...</a>
    content = content.replace(/<a\b([^>]*class="share-btn[^"]*"[^>]*)href=["']#["']([^>]*>[\s\S]*?LinkedIn[\s\S]*?<\/a>)/gi, (m, before, after) => {
      return `<a${before}href="${shareUrl}" target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn"${after}`;
    });
  }

  if (content !== orig) {
    fs.writeFileSync(p, content, 'utf8');
    console.log(`Updated social links in: ${rel}`);
  }
}

console.log('Phase 6 completed.');
