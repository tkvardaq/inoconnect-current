import fs from 'fs';
import path from 'path';

const distPath = 'D:\\AI\\inoconnect-site\\dist';
if (fs.existsSync(distPath)) {
  console.log('dist exists! Top-level:');
  console.log(fs.readdirSync(distPath));
  const distBlog = path.join(distPath, 'blog');
  if (fs.existsSync(distBlog)) {
    console.log('\ndist/blog contents:');
    console.log(fs.readdirSync(distBlog));
  }
} else {
  console.log('dist does not exist');
}
