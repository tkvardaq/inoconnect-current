import fs from 'fs'; import {pages} from './ui_pages.mjs';
const P=pages(); console.log(P.length);
const sel={};
for(const f of P){ const h=fs.readFileSync(f,'utf8');
 for(const m of h.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)){
  const css=m[1].replace(/\/\*[\s\S]*?\*\//g,'');
  // top-level selectors
  let depth=0,buf='';
  for(const ch of css){ if(ch==='{'){ if(depth===0){const s=buf.trim(); sel[s]=(sel[s]||0)+1;} depth++; buf=''; } else if(ch==='}'){depth--; buf='';} else if(depth===0) buf+=ch; }
 }}
for(const [k,v] of Object.entries(sel).sort((a,b)=>b[1]-a[1])) console.log(v, k.replace(/\s+/g,' ').slice(0,100));
