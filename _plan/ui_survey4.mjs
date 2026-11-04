import fs from 'fs'; import {pages,rel} from './ui_pages.mjs';
const c={};
for(const f of pages()){ const h=fs.readFileSync(f,'utf8');
 for(const m of h.matchAll(/class="([^"]*)"/g)) for(const t of m[1].split(/\s+/)) { const x=t.match(/#[0-9a-fA-F]{3,8}/); if(x){ const k=t.replace(/^(?:[a-z0-9-]+:)*/,'').replace(/\/.*$/,''); c[k]=(c[k]||0)+1; } }
}
console.log(Object.entries(c).sort((a,b)=>b[1]-a[1]).map(([k,v])=>v+' '+k).join('\n'));
