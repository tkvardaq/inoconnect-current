import fs from 'fs';
const TAG=/<!--[\s\S]*?-->|<(\/?)([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;
const V=new Set('area base br col embed hr img input link meta source track wbr'.split(' '));
const dk=(c)=>c.some(x=>/^bg-(slate-(800|900|950)(\/\d+)?|black|primary)$/.test(x))||(c.some(x=>x.startsWith('bg-gradient'))&&c.some(x=>/^from-slate-9/.test(x)));
for(const f of process.argv.slice(2)){const s=fs.readFileSync(f,'utf8').replace(/<(script|style)\b[\s\S]*?<\/\1>/gi,'');const st=[];let m;const re=new RegExp(TAG);
while((m=re.exec(s))){if(m[0].startsWith('<!--'))continue;const n=m[2].toLowerCase();if(m[1]){const i=st.map(e=>e.n).lastIndexOf(n);if(i>=0)st.length=i;continue}
const cm=/\sclass="([^"]*)"/.exec(m[3]);const c=cm?cm[1].split(/\s+/):[];const el={n,c};const d=[...st,el].some(e=>dk(e.c)||e.id);
if(/^h[1-3]$/.test(n)&&((d&&c.includes('text-heading'))||(!d&&c.includes('text-white'))))console.log(f,s.slice(0,m.index).split('\n').length,n,d?'dark':'light',cm?.[1]);
if(!V.has(n)&&!/\/\s*$/.test(m[3]))st.push(el)}}
