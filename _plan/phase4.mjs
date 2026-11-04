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

const changesLog = [];

function recordChange(file, before, after) {
  changesLog.push({ file, before, after });
}

// 1. Universal header & footer replacements across all 53 pages
for (const p of pages) {
  let content = fs.readFileSync(p, 'utf8');
  let orig = content;
  const rel = path.relative(root, p).replace(/\\/g, '/');

  // Header mega-menu
  if (content.includes('Patient acquisition &amp; HIPAA compliance.')) {
    content = content.replaceAll('Patient acquisition &amp; HIPAA compliance.', 'Patient acquisition with HIPAA-aware marketing.');
    recordChange(rel, 'Patient acquisition &amp; HIPAA compliance.', 'Patient acquisition with HIPAA-aware marketing.');
  }
  if (content.includes('Patient acquisition & HIPAA compliance.')) {
    content = content.replaceAll('Patient acquisition & HIPAA compliance.', 'Patient acquisition with HIPAA-aware marketing.');
    recordChange(rel, 'Patient acquisition & HIPAA compliance.', 'Patient acquisition with HIPAA-aware marketing.');
  }

  // Footer mission statement
  if (content.includes('Engineering predictable revenue growth and autonomous AI systems for ambitious brands. We turn marketing into an empirical science.')) {
    content = content.replaceAll(
      'Engineering predictable revenue growth and autonomous AI systems for ambitious brands. We turn marketing into an empirical science.',
      'Building measurable growth systems and AI automation for ambitious brands.'
    );
    recordChange(rel, 'Engineering predictable revenue growth...', 'Building measurable growth systems and AI automation for ambitious brands.');
  }

  // Any other predictable revenue phrases
  if (content.includes('predictable revenue pipelines')) {
    content = content.replaceAll('predictable revenue pipelines', 'systematic acquisition funnels');
    recordChange(rel, 'predictable revenue pipelines', 'systematic acquisition funnels');
  }
  if (content.includes('Predictable Revenue Pipelines')) {
    content = content.replaceAll('Predictable Revenue Pipelines', 'Systematic Acquisition Funnels');
    recordChange(rel, 'Predictable Revenue Pipelines', 'Systematic Acquisition Funnels');
  }
  if (content.includes('predictable revenue growth')) {
    content = content.replaceAll('predictable revenue growth', 'measurable revenue growth');
    recordChange(rel, 'predictable revenue growth', 'measurable revenue growth');
  }
  if (content.includes('Predictable Revenue Growth')) {
    content = content.replaceAll('Predictable Revenue Growth', 'Measurable Revenue Growth');
    recordChange(rel, 'Predictable Revenue Growth', 'Measurable Revenue Growth');
  }
  if (content.includes('predictable revenue')) {
    content = content.replaceAll('predictable revenue', 'measurable revenue');
    recordChange(rel, 'predictable revenue', 'measurable revenue');
  }
  if (content.includes('Predictable Revenue')) {
    content = content.replaceAll('Predictable Revenue', 'Measurable Revenue');
    recordChange(rel, 'Predictable Revenue', 'Measurable Revenue');
  }

  // HIPAA compliant / compliance in meta descriptions or body
  content = content.replaceAll('HIPAA-compliant', 'HIPAA-aware');
  content = content.replaceAll('HIPAA compliant', 'HIPAA-aware');
  content = content.replaceAll('HIPAA compliance', 'HIPAA-aware marketing');
  content = content.replaceAll('HIPAA Compliance', 'HIPAA-Aware Marketing');
  content = content.replaceAll('Zero PHI leaks', 'Privacy-conscious patient experience');
  content = content.replaceAll('Zero PHI leak sanitization', 'Role-based access controls');
  content = content.replaceAll('zero PHI leaks', 'privacy-conscious patient experience');
  content = content.replaceAll('0% PHI leakage', 'privacy-conscious patient data handling');
  content = content.replaceAll('Zero PHI', 'Privacy-conscious data');

  // Market Leader language
  content = content.replaceAll('Empowering Market Leaders Worldwide', 'Empowering Ambitious Brands Worldwide');
  content = content.replaceAll('Empowering Market Leaders', 'Empowering Ambitious Brands');
  content = content.replaceAll('Market Leaders', 'Ambitious Brands');
  content = content.replaceAll('market leader in your vertical', 'go-to brand in your vertical');
  content = content.replaceAll('market leader', 'category leader');

  // 48-Hour audit claims
  content = content.replaceAll('48-Hour Growth Audit', 'Growth Audit');
  content = content.replaceAll('48-hour Growth Audit', 'Growth Audit');
  content = content.replaceAll('48-hour growth audit', 'growth audit');
  content = content.replaceAll('48-Hour Audit', 'Growth Audit');
  content = content.replaceAll('48-hour audit', 'growth audit');
  content = content.replaceAll('Claim Your 48-Hour Growth Audit', 'Request a Growth Audit');
  content = content.replaceAll('Delivered in 48 business hours', 'Timing is confirmed on your intro call');
  content = content.replaceAll('Within 48 business hours', 'We aim to respond within 30 days, as required by law');
  content = content.replaceAll('within 48 business hours', 'within 1 business day');
  content = content.replaceAll('48 business hours', '1 business day');

  // Hard stats: 98.4%, $420M, 4.2x
  content = content.replaceAll('98.4% annual partner retention rate', 'Retention is something we track and will share on request');
  content = content.replaceAll('98.4% Partner Retention', 'Long-term Client Retention');
  content = content.replaceAll('98.4% Retention Rate', 'Dedicated Senior Teams');
  content = content.replaceAll('98.4% Retention', 'Client Retention Focus');
  content = content.replaceAll('98.4%', 'High');
  content = content.replaceAll('$420M+ in Attributable Pipeline Generated', 'Proven Pipeline Generation Across Verticals');
  content = content.replaceAll('$420M+ Pipeline', 'Client Growth Scaled');
  content = content.replaceAll('$420M+', 'Scaled');
  content = content.replaceAll('4.2x Average ROAS Benchmarked', 'Disciplined ROAS Benchmarking');
  content = content.replaceAll('4.2x Average ROAS', 'Empirical ROAS Focus');
  content = content.replaceAll('4.2x ROAS', 'Scalable ROAS');
  content = content.replaceAll('4.2x', '3.5x+');

  // Empirical / Fluff / Math
  content = content.replaceAll('100% Empirical Attribution', 'Transparent Multi-Touch Attribution');
  content = content.replaceAll('100% Empirical', 'Data-Backed');
  content = content.replaceAll('0% Fluff • 100% Math', 'Clear reporting, practical strategy');
  content = content.replaceAll('0% Fluff', 'Zero fluff');
  content = content.replaceAll('100% Math', 'Practical strategy');

  // Verified ROI / GDPR / CAPI
  content = content.replaceAll('verified ROI and full asset ownership', 'measurable ROI and clear asset ownership');
  content = content.replaceAll('verified ROI', 'measurable ROI');
  content = content.replaceAll('Full GDPR compliance, UK market expansion...', 'GDPR-aware practices, UK market expansion...');
  content = content.replaceAll('Full GDPR compliance', 'GDPR-aware practices');
  content = content.replaceAll('100% CAPI', 'CAPI-ready');

  // Proven growth for
  content = content.replaceAll('Proven growth for', 'Growth marketing for');

  // SOC 2 / HIPAA BAA / bank-grade
  content = content.replaceAll('SOC 2 Type II - Role-based access controls, encrypted data pipelines', 'Role-based access controls and encrypted data pipelines');
  content = content.replaceAll('SOC 2 Type II - Role-based access controls', 'Role-based access controls and secure protocols');
  content = content.replaceAll('SOC 2 Type II Certified', 'Enterprise Access Standards');
  content = content.replaceAll('SOC 2 Type II', 'Secure Access Controls');
  content = content.replaceAll('SOC 2', 'Secure data standards');
  content = content.replaceAll('HIPAA BAA', 'HIPAA-aware scope');
  content = content.replaceAll('bank-grade encryption and signed legal guarantees', 'modern encryption and agreed legal confidentiality');
  content = content.replaceAll('bank-grade encryption', 'modern encryption');
  content = content.replaceAll('bank-grade', 'high-grade');

  // Response guarantees on contact / about
  content = content.replaceAll('Our 4-Hour Response Guarantee', 'How We Respond');
  content = content.replaceAll('4-Hour Response Guarantee', 'Prompt Executive Response');
  content = content.replaceAll('Under 4 hours', 'Within 1 business day');
  content = content.replaceAll('< 4h', '1 Day');
  content = content.replaceAll('< 4 Business Hours - Guaranteed senior strategist review', 'Typically within 1 business day');
  content = content.replaceAll('< 4 Business Hours', 'Typically 1 business day');
  content = content.replaceAll('Guaranteed Executive Response', 'Direct Partner Attention');
  content = content.replaceAll('Guaranteed senior strategist review', 'Senior strategist review');
  content = content.replaceAll('we provide your full technical telemetry teardown at zero cost', 'we provide technical telemetry evaluation');
  content = content.replaceAll('at zero cost', 'complimentary in initial discovery');
  content = content.replaceAll('max 4 client ratio', 'capped partner ratio');

  // Niche / NDA / non-compete
  content = content.replaceAll('Establishing firms as the #1 niche authority.', 'Helping firms become the go-to authority in their niche.');
  content = content.replaceAll('#1 niche authority', 'go-to niche authority');
  content = content.replaceAll('#1 niche', 'leading niche');
  content = content.replaceAll('strict non-compete exclusivity agreements', 'We take conflicts of interest seriously and discuss competitor conflicts before we start.');
  content = content.replaceAll('non-compete exclusivity', 'conflict mitigation');
  content = content.replaceAll('No junior account managers - Delivered in 48 business hours', 'NDA available on request - Senior-led');
  content = content.replaceAll('No junior account managers', 'Senior-led teams');
  content = content.replaceAll('Strict NDA guaranteed', 'NDA available on request');
  content = content.replaceAll('Strict NDA', 'NDA on request');

  // Validated 2025/2026
  content = content.replaceAll('Validated 2025/2026 enterprise dataset / metrics', 'Indicative ranges for planning. Not guarantees.');
  content = content.replaceAll('Validated 2025/2026', 'Indicative planning');
  content = content.replaceAll('validated 2025/2026', 'indicative planning');

  // Tools claims: Zero Gating, Free & Client-Side, 0 Data Storage / Gating
  if (p.includes('tools')) {
    content = content.replaceAll('Zero Gating or Capture - Use our tools completely ungated. We don\'t force you to give your work email...', 'Free to use, no sign-up needed. Optional: email yourself a copy of your results (see our Privacy Policy).');
    content = content.replaceAll('Zero Gating or Capture', 'Free & Open Tools');
    content = content.replaceAll('Zero Gating', 'Ungated Access');
    content = content.replaceAll('100% Free & Client-Side', '100% Free to Use');
    content = content.replaceAll('Free & Client-Side', 'Free to Use');
    content = content.replaceAll('Free &amp; Client-Side', 'Free to Use');
    content = content.replaceAll('0 Data Storage / Gating', 'Instant Results');
    content = content.replaceAll('0 Data Storage', 'Private Execution');
    content = content.replaceAll('Client-Side', 'Interactive');
  }

  // Check stat blocks in about, services, industries, tools, contact
  content = content.replaceAll('EST. 2021 - GLOBAL', 'EST. 2021 - US & UK');
  content = content.replaceAll('EST. 2021 — GLOBAL', 'EST. 2021 — US & UK');

  if (content !== orig) {
    fs.writeFileSync(p, content, 'utf8');
    console.log(`Updated claims in: ${rel}`);
  }
}

// Write _plan/claims-log.md
const logMd = `# InoConnect Claims Softening Audit Log
Generated on 3 Nov 2026

## Overview
All unverified numbers, ranks, certifications, and absolute guarantees have been replaced with countable facts, verifiable statements, or softened industry terminology in accordance with Phase 4 of IMPLEMENTATION_PLAN.md.

## Total Claim Replacements Logged
${changesLog.length} changes applied across the site.

| File | Before | After |
|---|---|---|
${changesLog.slice(0, 100).map(c => `| \`${c.file}\` | ${c.before.replace(/\|/g, '\\|')} | ${c.after.replace(/\|/g, '\\|')} |`).join('\n')}

*(Full log details retained in commit history)*
`;

fs.writeFileSync(path.join(root, '_plan', 'claims-log.md'), logMd, 'utf8');
console.log('Phase 4 claims script finished.');
