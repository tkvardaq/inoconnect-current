import fs from 'fs';
import path from 'path';

console.log('=== COMPARING BLOG ARTICLES ===');

const currentBlog = fs.readdirSync('blog').filter(f => fs.statSync(path.join('blog', f)).isDirectory());
console.log(`Current workspace blog articles (${currentBlog.length}):`, currentBlog);

const newBlogPath = 'D:\\AI\\inoconnect-new\\blog';
if (fs.existsSync(newBlogPath)) {
  const newBlog = fs.readdirSync(newBlogPath).filter(f => fs.statSync(path.join(newBlogPath, f)).isDirectory());
  console.log(`\ninoconnect-new blog articles (${newBlog.length}):`, newBlog);
  const diffNew = newBlog.filter(b => !currentBlog.includes(b));
  console.log('Articles in inoconnect-new not in current:', diffNew);
}

const siteBlogPath = 'D:\\AI\\inoconnect-site\\src';
function findDirs(dir) {
  let res = [];
  if (!fs.existsSync(dir)) return res;
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      if (item === 'blog' || item === 'posts' || item === 'articles') {
        res.push(full);
      }
      res = res.concat(findDirs(full));
    }
  }
  return res;
}
console.log('\nBlog directories in inoconnect-site:', findDirs(siteBlogPath));

// Also check if any markdown or html files exist in inoconnect-site
for (const p of findDirs(siteBlogPath)) {
  console.log(`Items in ${p}:`, fs.readdirSync(p));
}
