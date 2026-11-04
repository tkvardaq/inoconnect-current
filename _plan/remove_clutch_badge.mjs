import fs from 'fs';

let content = fs.readFileSync('index.html', 'utf8');
const beforeLen = content.length;
const target = /([ \t]*<!-- Top Credibility Pill[\s\S]*?<\/div>\r?\n)/;
if (target.test(content)) {
  content = content.replace(target, '');
  fs.writeFileSync('index.html', content, 'utf8');
  console.log(`Successfully removed Clutch badge! File length went from ${beforeLen} to ${content.length}`);
} else {
  console.log('Target regex did not match!');
}
