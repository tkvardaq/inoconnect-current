import fs from 'fs';
const files = process.argv.slice(2);
const cnt = {};
for (const f of files) {
  const raw = fs.readFileSync(f,'utf8').replace(/<script\b[\s\S]*?<\/script>/gi,'');
  for (const m of raw.matchAll(/\sclass\s*=\s*"([^"]*)"/g))
    for (const t of m[1].split(/\s+/).filter(Boolean)) {
      const b = t.slice(t.lastIndexOf(':')+1);
      if (/^(text|bg|from|via|to|border|shadow|ring|accent|fill|stroke|divide|rounded|leading|tracking|py|font|hover:)/.test(b) || /(purple|violet|teal|cyan|sky|indigo|blue|orange|amber|yellow|green|emerald|gray|red)/.test(b)) cnt[t]=(cnt[t]||0)+1;
    }
}
console.log(Object.entries(cnt).filter(([k])=>/(purple|violet|teal|cyan|sky|indigo|blue|orange|amber|yellow|green|emerald|gray|red|rounded|shadow|leading|tracking|text-\[|#|\[)/.test(k)).sort().map(([k,v])=>k+' '+v).join('\n'));
