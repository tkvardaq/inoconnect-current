import fs from 'fs';
const css = fs.readFileSync('_astro/about.Bi_RrpmH.css', 'utf8');
console.log('matches for main-logo:', css.match(/#main-logo[^{]*\{[^}]*\}/g));
console.log('matches for logo:', css.match(/[^{}]*logo[^{]*\{[^}]*\}/gi));
