import fs from 'fs'; import {pages,rel} from './ui_pages.mjs'; import crypto from 'crypto';
const groups={};
for(const f of pages()){ const h=fs.readFileSync(f,'utf8');
 const blocks=[...h.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m=>m[1].replace(/\s+/g,' ').trim());
 const key=crypto.createHash('md5').update(blocks.join('||')).digest('hex').slice(0,6);
 (groups[key]??=({n:blocks.length,len:blocks.map(b=>b.length),pages:[]})).pages.push(rel(f));
}
for(const [k,g] of Object.entries(groups)) console.log(k,g.n,g.len.join(','),g.pages.length,g.pages.slice(0,4).join(' '));
