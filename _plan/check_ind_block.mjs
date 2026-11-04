import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const start = html.indexOf('<!-- Industries Mega Menu -->');
const aboutStart = html.indexOf('<a class="nav-link text-sm uppercase tracking-widest" href="/about">');
console.log(html.slice(start, aboutStart));
