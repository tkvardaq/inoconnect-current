// UI group 1: collapse bare uppercase tracked labels into .eyebrow (skips pills, stat captions, form labels).
import fs from 'fs';
const FILES = ['index.html','404.html','about/index.html','contact/index.html','privacy/index.html','terms/index.html'];
for (const f of FILES) {
  let n = 0;
  const s = fs.readFileSync(f, 'utf8').replace(/<(span|p|div)\b([^>]*?\sclass=")([^"]*)(")/g, (all, tag, pre, cls, q) => {
    const t = cls.split(/\s+/).filter(Boolean);
    const has = (re) => t.some((x) => re.test(x));
    if (!t.includes('uppercase') || !has(/^tracking-(wider|widest|\[0\.2em\])$/) || !has(/^text-(xs|sm)$/)) return all;
    if (has(/^(px-|rounded|border|group-hover|flex$|inline-flex|justify-|items-)/) || has(/^mt-1$|^mb-1$|^mb-0\.5$/)) return all;
    if (!has(/^text-(primary|secondary|accent|slate-500|secondary-ink|accent-ink|primary-soft)$/)) return all;
    const keep = t.filter((x) => !/^(text-(xs|sm)|font-(bold|black|medium)|uppercase|tracking-.+)$/.test(x));
    n++;
    return `<${tag}${pre}eyebrow ${keep.join(' ')}${q}`;
  });
  fs.writeFileSync(f, s);
  console.log(f, 'eyebrows:', n);
}
