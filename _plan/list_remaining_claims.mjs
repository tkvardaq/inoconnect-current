import fs from 'fs';
import path from 'path';

const root = process.cwd();
const SKIP = new Set(['node_modules', '.git', '_plan', '__pycache__', '_deploy']);
const pages = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (!SKIP.has(e.name)) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (p.endsWith('index.html') && !p.includes('outputs')) pages.push(p);
    }
  }
})(root);

const CLAIMS = [/98\.4%/, /\$420M/, /\b4\.2x\b/, /100% Empirical/i, /Zero Gating/i, /Data Storage [/] Gating/i, /HIPAA[- ]compliant/i, /HIPAA compliance/i, /verified ROI/i, /Full GDPR compliance/i, /100% CAPI/, /Proven growth for/, /SOC 2/i, /HIPAA BAA/i, /bank-grade/i, /max 4 client/i, /4-Hour Response Guarantee/i, /Guaranteed (Executive|senior)/i, /zero cost/i, /0% Fluff/i, /100% Math/i, /Market Leader/i, /predictable revenue/i, /48-Hour/i, /48 business hours/i, /Zero PHI/i, /non-compete exclusivity/i, /#1 niche/i, /Validated 2025\/2026/i, /validated 2025\/2026/i, /No junior account managers/i, /Strict NDA guaranteed/i];

const hits = [];
for (const f of pages) {
  const t = fs.readFileSync(f, 'utf8');
  for (const re of CLAIMS) {
    if (re.test(t)) {
      const lines = t.split('\n');
      lines.forEach((l, idx) => {
        if (re.test(l)) {
          hits.push({ file: path.relative(root, f), line: idx + 1, text: l.trim(), re: re.toString() });
        }
      });
    }
  }
}

console.log('Remaining hits count:', hits.length);
hits.forEach(h => console.log(`${h.file}:${h.line} [${h.re}] -> ${h.text}`));
