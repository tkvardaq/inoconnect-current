import fs from 'fs';
const f=process.argv[2]; const h=fs.readFileSync('D:/ino website/'+f,'utf8');
[...h.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].forEach((m,i)=>console.log('--- block',i,'\n'+m[1].trim()));
