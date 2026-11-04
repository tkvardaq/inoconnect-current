// UI group 1: swap hand-rolled CTA class strings for .btn variants (exact class-attribute matches).
import fs from 'fs';

const FILES = ['index.html', '404.html', 'about/index.html', 'contact/index.html', 'privacy/index.html', 'terms/index.html'];
const MAP = [
  ['bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all hover:scale-105 shadow-xl shadow-primary/20', 'btn btn-primary btn-sm'],
  ['block w-full py-4 bg-primary text-center text-white font-bold uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20', 'btn btn-primary w-full'],
  ['w-full sm:w-auto px-10 py-4 bg-accent hover:bg-accent-dark text-white font-bold rounded-full transition-all hover:scale-105 text-base sm:text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-3', 'btn btn-accent w-full sm:w-auto'],
  ['px-8 py-4 bg-secondary text-white font-bold rounded-full hover:bg-secondary-dark transition-all hover:scale-105 inline-block w-full sm:w-auto text-center shadow-xl shadow-primary/20 text-slate-950', 'btn btn-secondary w-full sm:w-auto'],
  ['inline-flex items-center gap-3 bg-primary hover:bg-primary-dark text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-sm hover:scale-110 transition-all shadow-xl hover:shadow-primary/20', 'btn btn-primary'],
  ['inline-flex items-center gap-3 bg-primary hover:bg-primary-dark text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-xl hover:shadow-primary/20', 'btn btn-primary'],
  ['px-12 py-6 bg-primary text-white font-bold rounded-[2rem] text-xl hover:scale-105 transition-all inline-block shadow-2xl shadow-primary/20 hover:shadow-primary/20', 'btn btn-primary'],
  ['inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors shadow-sm', 'btn btn-primary btn-sm'],
  ['px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all hover:scale-105 shadow-xl shadow-primary/20', 'btn btn-primary'],
  ['px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-bold text-sm uppercase tracking-wider rounded-xl transition-all', 'btn btn-ghost text-white'],
  ['px-10 py-5 bg-primary hover:bg-primary-dark text-white font-bold text-base uppercase tracking-wider rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-primary/20', 'btn btn-primary'],
  ['w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all hover:scale-[1.02] shadow-xl shadow-primary/20', 'btn btn-primary w-full'],
];

for (const f of FILES) {
  let s = fs.readFileSync(f, 'utf8');
  let n = 0;
  for (const [a, b] of MAP) {
    const needle = `class="${a}"`;
    const parts = s.split(needle);
    n += parts.length - 1;
    s = parts.join(`class="${b}"`);
  }
  fs.writeFileSync(f, s);
  console.log(f, 'buttons swapped:', n);
}
