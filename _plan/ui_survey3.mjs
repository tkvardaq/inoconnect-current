import fs from 'fs'; import {pages,rel} from './ui_pages.mjs';
const cnt={};
const add=(k,f)=>{(cnt[k]??=new Set()).add(rel(f))};
for(const f of pages()){ const h=fs.readFileSync(f,'utf8');
 for(const m of h.matchAll(/font-family[^;"}]*/g)) add('FF: '+m[0].replace(/\s+/g,' '),f);
 for(const m of h.matchAll(/<link[^>]*fonts\.g[^>]*>/g)) add('LINK: '+m[0].replace(/\s+/g,' ').slice(0,160),f);
 for(const m of h.matchAll(/<body[^>]*>/g)) add('BODY: '+m[0],f);
 if(/prose/.test(h)) add('prose',f);
 if(/<noscript>/.test(h)) add('noscript',f);
}
for(const [k,v] of Object.entries(cnt).sort()) console.log(v.size,k);
