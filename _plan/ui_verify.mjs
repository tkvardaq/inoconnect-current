import fs from 'fs'; import {pages,rel} from './ui_pages.mjs';
const bad=[]; let n=0;
for(const f of pages()){ const h=fs.readFileSync(f,'utf8'); n++;
 const c=(re)=>(h.match(re)||[]).length;
 const fonts=c(/fonts\.googleapis\.com\/css2/g); if(fonts!==1) bad.push(rel(f)+' fonts='+fonts);
 if(/font-family/.test(h)) bad.push(rel(f)+' font-family');
 for(const m of h.matchAll(/class="([^"]*)"/g)){ if(/\[#(4169E1|44D7A8|FF7518|3152B3|33b88e|1e293b)\]/i.test(m[1])) bad.push(rel(f)+' hex-class '+m[1].slice(0,60)); if(/(^|\s)(not-)?prose(-\S+)?(\s|$)/.test(m[1])) bad.push(rel(f)+' prose class'); }
 if(/tracking-\[ /.test(h)) bad.push(rel(f)+' tracking');
 if(c(/<\/html>/g)!==1) bad.push(rel(f)+' </html>');
 if(c(/<header\b/g)!==1) bad.push(rel(f)+' header='+c(/<header\b/g));
 if(c(/<footer\b/g)!==1) bad.push(rel(f)+' footer='+c(/<footer\b/g));
 if(/bg-clip-text/.test(h)) bad.push(rel(f)+' bg-clip-text left');
}
console.log(n,'pages; problems:',bad.length); console.log(bad.join('\n'));
