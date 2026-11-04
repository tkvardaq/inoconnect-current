import fs from 'fs'; import {pages,rel} from './ui_pages.mjs';
const sel={};
for(const f of pages()){ const h=fs.readFileSync(f,'utf8');
 const css=h.indexOf('site.css');
 for(const m of h.matchAll(/(<noscript>\s*)?<style[^>]*>([\s\S]*?)<\/style>/g)){ if(m[1])continue;
   if(m.index<css) console.log('ORDER!',rel(f));
   const k=m[2].replace(/\s+/g,' ').trim(); (sel[k]??=[]).push(rel(f)); }
 for(const m of h.matchAll(/var\(--(text-heading|heading)\)/g)) console.log('VAR',rel(f),m[0]);
}
for(const [k,v] of Object.entries(sel)) console.log(v.length,v.slice(0,3).join(','),'\n   ',k.slice(0,300));
