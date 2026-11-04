import fs from 'fs';
import path from 'path';

const dirs = [
  'D:\\AI\\inoconnect-new',
  'D:\\AI\\inoconnect-site',
  'D:\\AI\\inoconnect-base',
  'D:\\AI\\inoconnect-staging',
  'D:\\AI\\inoconnect-images'
];

for (const d of dirs) {
  console.log(`\n=================== ${d} ===================`);
  if (!fs.existsSync(d)) {
    console.log('DOES NOT EXIST');
    continue;
  }
  const items = fs.readdirSync(d);
  console.log('Top level:', items.slice(0, 15).join(', '));
  
  // Check for blog or articles
  const blogPath = path.join(d, 'blog');
  if (fs.existsSync(blogPath)) {
    const articles = fs.readdirSync(blogPath);
    console.log(`Blog directory (${articles.length} items):`, articles.slice(0, 10).join(', '));
  }
  
  // Check for articles directory
  const articlesPath = path.join(d, 'articles');
  if (fs.existsSync(articlesPath)) {
    const articles = fs.readdirSync(articlesPath);
    console.log(`Articles directory (${articles.length} items):`, articles.slice(0, 10).join(', '));
  }

  // Check for images
  const imagesPath = path.join(d, 'images');
  if (fs.existsSync(imagesPath)) {
    const images = fs.readdirSync(imagesPath);
    console.log(`Images directory (${images.length} items):`, images.slice(0, 10).join(', '));
  }
}
