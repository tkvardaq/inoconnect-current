import fs from 'fs';
import path from 'path';

const root = process.cwd();

// 1. index.html ribbon
let indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const ribbonFind = `<div class="mt-14 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 py-6 px-8 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/90 shadow-sm">
            <div class="text-center md:border-r border-slate-100">
                <div class="text-3xl lg:text-4xl font-black text-slate-900">4.8x</div>
                <div class="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Average ROAS</div>
            </div>
            <div class="text-center md:border-r border-slate-100">
                <div class="text-3xl lg:text-4xl font-black text-[#44D7A8]">98%</div>
                <div class="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Client Retention</div>
            </div>
            <div class="text-center md:border-r border-slate-100">
                <div class="text-3xl lg:text-4xl font-black text-[#4169E1]">$38M+</div>
                <div class="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Attributed Revenue</div>
            </div>
            <div class="text-center">
                <div class="text-3xl lg:text-4xl font-black text-[#FF7518]">&lt; 0.8s</div>
                <div class="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">AI Lead Routing</div>
            </div>
        </div>`;

const ribbonReplace = `<div class="mt-14 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 py-6 px-8 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/90 shadow-sm">
            <div class="text-center md:border-r border-slate-100">
                <div class="text-3xl lg:text-4xl font-black text-slate-900">8</div>
                <div class="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Growth Services</div>
            </div>
            <div class="text-center md:border-r border-slate-100">
                <div class="text-3xl lg:text-4xl font-black text-[#44D7A8]">7</div>
                <div class="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Target Industries</div>
            </div>
            <div class="text-center md:border-r border-slate-100">
                <div class="text-3xl lg:text-4xl font-black text-[#4169E1]">4</div>
                <div class="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Free Growth Tools</div>
            </div>
            <div class="text-center">
                <div class="text-3xl lg:text-4xl font-black text-[#FF7518]">25</div>
                <div class="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Strategy Guides</div>
            </div>
        </div>`;

if (indexHtml.includes(ribbonFind)) {
  indexHtml = indexHtml.replace(ribbonFind, ribbonReplace);
  fs.writeFileSync(path.join(root, 'index.html'), indexHtml, 'utf8');
  console.log('Updated index.html ribbon');
} else {
  // Try regex replace
  const re = /<div class="text-3xl lg:text-4xl font-black text-slate-900">4\.8x<\/div>\s*<div class="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Average ROAS<\/div>/;
  if (re.test(indexHtml)) {
    indexHtml = indexHtml.replace(re, `<div class="text-3xl lg:text-4xl font-black text-slate-900">8</div>\n                <div class="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Growth Services</div>`);
    indexHtml = indexHtml.replace(/<div class="text-3xl lg:text-4xl font-black text-\[#44D7A8\]">98%<\/div>\s*<div class="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Client Retention<\/div>/, `<div class="text-3xl lg:text-4xl font-black text-[#44D7A8]">7</div>\n                <div class="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Target Industries</div>`);
    indexHtml = indexHtml.replace(/<div class="text-3xl lg:text-4xl font-black text-\[#4169E1\]">\$38M\+<\/div>\s*<div class="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Attributed Revenue<\/div>/, `<div class="text-3xl lg:text-4xl font-black text-[#4169E1]">4</div>\n                <div class="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Free Growth Tools</div>`);
    indexHtml = indexHtml.replace(/<div class="text-3xl lg:text-4xl font-black text-\[#FF7518\]">&lt; 0\.8s<\/div>\s*<div class="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">AI Lead Routing<\/div>/, `<div class="text-3xl lg:text-4xl font-black text-[#FF7518]">25</div>\n                <div class="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Strategy Guides</div>`);
    fs.writeFileSync(path.join(root, 'index.html'), indexHtml, 'utf8');
    console.log('Regex updated index.html ribbon');
  } else {
    console.warn('Could not match index.html ribbon');
  }
}

// 2. contact/index.html line 554
let contactHtml = fs.readFileSync(path.join(root, 'contact/index.html'), 'utf8');
contactHtml = contactHtml.replace(/To deliver 3\.5x\+ average ROAS and maintain High retention, we only accept partners where we know we can drive transformational scale\./g,
  'We work with a limited number of partners at a time so every engagement gets senior attention.');
fs.writeFileSync(path.join(root, 'contact/index.html'), contactHtml, 'utf8');
console.log('Updated contact/index.html line 554');

// 3. industries/index.html line 863
let indHtml = fs.readFileSync(path.join(root, 'industries/index.html'), 'utf8');
indHtml = indHtml.replace(/Signed BAAs across all endpoints\.\s*Server-side sanitization to guarantee privacy-conscious patient data handling to third-party ad networks\./g,
  'We follow HIPAA-aware practices for healthcare marketing and scope compliance needs with each client.');
indHtml = indHtml.replace(/LTV:CAC &gt; 4\.5x/g, 'LTV:CAC Target Focus');
indHtml = indHtml.replace(/Blended MER &gt; 3\.8x/g, 'Blended MER Target Focus');
fs.writeFileSync(path.join(root, 'industries/index.html'), indHtml, 'utf8');
console.log('Updated industries/index.html line 863');

// 4. services/ppc/index.html
let ppcHtml = fs.readFileSync(path.join(root, 'services/ppc/index.html'), 'utf8');
ppcHtml = ppcHtml.replace(/<div class="text-6xl md:text-8xl font-black text-white mb-4 tracking-tighter">5\.4x<\/div>\s*<p class="text-slate-400 text-lg font-bold uppercase tracking-widest">Average ROAS<\/p>/g,
  '<div class="text-6xl md:text-8xl font-black text-white mb-4 tracking-tighter">100%</div>\n<p class="text-slate-400 text-lg font-bold uppercase tracking-widest">Asset & Data Ownership</p>');
ppcHtml = ppcHtml.replace(/<div class="text-4xl font-black text-slate-900 mb-2">\$150M<\/div>\s*<p class="text-slate-600 font-medium">Profitable ad spend managed<\/p>/g,
  '<div class="text-4xl font-black text-slate-900 mb-2">US &amp; UK</div>\n<p class="text-slate-600 font-medium">Bilingual &amp; Cross-Border Strategy</p>');
fs.writeFileSync(path.join(root, 'services/ppc/index.html'), ppcHtml, 'utf8');
console.log('Updated services/ppc/index.html');

// 5. about/index.html
let aboutHtml = fs.readFileSync(path.join(root, 'about/index.html'), 'utf8');
aboutHtml = aboutHtml.replace(/<div class="text-3xl md:text-4xl font-black text-\[#FF7518\] mb-1">3\.5x\+<\/div>\s*<div class="text-xs uppercase tracking-wider font-bold text-slate-400">Average ROAS Benchmarked<\/div>/g,
  '<div class="text-3xl md:text-4xl font-black text-[#FF7518] mb-1">8</div>\n<div class="text-xs uppercase tracking-wider font-bold text-slate-400">Core Growth Services</div>');
aboutHtml = aboutHtml.replace(/managed over \$50M in profitable ad spend/g, 'managed substantial profitable ad spend');
fs.writeFileSync(path.join(root, 'about/index.html'), aboutHtml, 'utf8');
console.log('Updated about/index.html');

// 6. services/index.html
let servHtml = fs.readFileSync(path.join(root, 'services/index.html'), 'utf8');
servHtml = servHtml.replace(/<div class="text-3xl md:text-4xl font-black text-\[#FF7518\] mb-1">3\.5x\+<\/div>\s*<div class="text-xs uppercase tracking-wider font-bold text-slate-400">Average ROAS Benchmarked<\/div>/g,
  '<div class="text-3xl md:text-4xl font-black text-[#FF7518] mb-1">8</div>\n<div class="text-xs uppercase tracking-wider font-bold text-slate-400">Core Growth Services</div>');
fs.writeFileSync(path.join(root, 'services/index.html'), servHtml, 'utf8');
console.log('Updated services/index.html');

// 7. tools/index.html
let toolsHtml = fs.readFileSync(path.join(root, 'tools/index.html'), 'utf8');
toolsHtml = toolsHtml.replace(/<div class="text-3xl md:text-4xl font-black text-\[#4169E1\] mb-1">3\.5x\+<\/div>\s*<div class="text-xs uppercase tracking-wider font-bold text-slate-400">Average ROAS Benchmarked<\/div>/g,
  '<div class="text-3xl md:text-4xl font-black text-[#4169E1] mb-1">4</div>\n<div class="text-xs uppercase tracking-wider font-bold text-slate-400">Free Growth Calculators</div>');
toolsHtml = toolsHtml.replace(/from aggregated performance data across \$50M\+ in client ad spend and published datasets/g,
  'from aggregated performance data across published datasets and industry benchmarks');
fs.writeFileSync(path.join(root, 'tools/index.html'), toolsHtml, 'utf8');
console.log('Updated tools/index.html');

// 8. industries/ecommerce/index.html
let ecomHtml = fs.readFileSync(path.join(root, 'industries/ecommerce/index.html'), 'utf8');
ecomHtml = ecomHtml.replace(/<div class="text-4xl font-black text-white mb-2">&gt; 3\.8x<\/div>\s*<p class="text-slate-400 font-bold uppercase tracking-widest text-xs">Blended MER<\/p>/g,
  '<div class="text-4xl font-black text-white mb-2">Target</div>\n<p class="text-slate-400 font-bold uppercase tracking-widest text-xs">Blended MER Optimization</p>');
fs.writeFileSync(path.join(root, 'industries/ecommerce/index.html'), ecomHtml, 'utf8');
console.log('Updated industries/ecommerce/index.html');

// 9. industries/saas/index.html
let saasHtml = fs.readFileSync(path.join(root, 'industries/saas/index.html'), 'utf8');
saasHtml = saasHtml.replace(/<div class="text-4xl font-black text-white mb-2">&gt; 4\.5x<\/div>\s*<p class="text-slate-400 font-bold uppercase tracking-widest text-xs">LTV:CAC Ratio<\/p>/g,
  '<div class="text-4xl font-black text-white mb-2">Target</div>\n<p class="text-slate-400 font-bold uppercase tracking-widest text-xs">LTV:CAC Optimization</p>');
saasHtml = saasHtml.replace(/by at least 4\.5x across enterprise and self-serve tiers\./g,
  'across enterprise and self-serve tiers.');
fs.writeFileSync(path.join(root, 'industries/saas/index.html'), saasHtml, 'utf8');
console.log('Updated industries/saas/index.html');

// 10. services/content-marketing/index.html
let contentHtml = fs.readFileSync(path.join(root, 'services/content-marketing/index.html'), 'utf8');
contentHtml = contentHtml.replace(/<div class="text-6xl md:text-8xl font-black text-white mb-4 tracking-tighter">4\.5x<\/div>\s*<p class="text-slate-400 text-lg font-bold uppercase tracking-widest">Organic Traffic Multiplier<\/p>/g,
  '<div class="text-6xl md:text-8xl font-black text-white mb-4 tracking-tighter">Organic</div>\n<p class="text-slate-400 text-lg font-bold uppercase tracking-widest">Compounding Authority</p>');
fs.writeFileSync(path.join(root, 'services/content-marketing/index.html'), contentHtml, 'utf8');
console.log('Updated services/content-marketing/index.html');

// 11. services/social-media/index.html
let socialHtml = fs.readFileSync(path.join(root, 'services/social-media/index.html'), 'utf8');
socialHtml = socialHtml.replace(/<div class="text-4xl font-black text-white mb-2">3\.2x<\/div>\s*<p class="text-slate-400 font-bold uppercase tracking-widest text-xs">Paid Social ROAS<\/p>/g,
  '<div class="text-4xl font-black text-white mb-2">Target</div>\n<p class="text-slate-400 font-bold uppercase tracking-widest text-xs">Paid Social Efficiency</p>');
fs.writeFileSync(path.join(root, 'services/social-media/index.html'), socialHtml, 'utf8');
console.log('Updated services/social-media/index.html');
