import fs from 'fs';
import path from 'path';

const root = process.cwd();

const tools = [
  {
    slug: 'roas',
    file: 'tools/roas-calculator/index.html',
    edits: [
      { from: 'id="max-cac-out" class="text-sm font-bold text-[#4169E1]">$97.50</span>', to: 'id="max-cac-out" class="text-sm font-bold text-[#4169E1]">$98</span>' }
    ]
  },
  {
    slug: 'ltv',
    file: 'tools/ltv-calculator/index.html',
    edits: []
  },
  {
    slug: 'email',
    file: 'tools/email-revenue-simulator/index.html',
    edits: [
      { from: 'id="annual-email-rev" class="text-4xl md:text-5xl font-black text-[#4169E1]">$343,900</span>', to: 'id="annual-email-rev" class="text-4xl md:text-5xl font-black text-[#4169E1]">$158,323</span>' },
      { from: 'id="monthly-campaign-rev" class="text-sm font-bold text-white">$18,620</span>', to: 'id="monthly-campaign-rev" class="text-sm font-bold text-white">$8,512</span>' },
      { from: 'id="monthly-flow-rev" class="text-sm font-bold text-[#44D7A8]">+$10,040 / mo</span>', to: 'id="monthly-flow-rev" class="text-sm font-bold text-[#44D7A8]">+$4,682 / mo</span>' },
      { from: 'id="monthly-total-rev" class="text-sm font-bold text-white">$28,660 / mo</span>', to: 'id="monthly-total-rev" class="text-sm font-bold text-white">$13,194 / mo</span>' },
      { from: 'id="rpr-out" class="text-sm font-bold text-[#FF7518]">$0.29 / email</span>', to: 'id="rpr-out" class="text-sm font-bold text-[#FF7518]">$0.09 / email</span>' }
    ]
  },
  {
    slug: 'cro',
    file: 'tools/cro-simulator/index.html',
    edits: [
      { from: 'id="ad-savings-out" class="text-sm font-bold text-[#4169E1]">$33,300 / mo</span>', to: 'id="ad-savings-out" class="text-sm font-bold text-[#4169E1]">+$34,722 / mo</span>' }
    ]
  }
];

function getCaptureForm(toolSlug) {
  return `
                    <!-- Tool Lead Capture Form (Phase 8.2) -->
                    <div class="mt-8 pt-6 border-t border-slate-800">
                        <div class="text-xs font-bold text-white uppercase tracking-wider mb-2">Email Me This Result</div>
                        <p class="text-xs text-slate-400 mb-4">Send an official copy of your calculation and inputs directly to your inbox.</p>
                        <form id="tool-capture-form" data-tool="${toolSlug}" class="space-y-3" novalidate>
                            <div>
                                <label for="capture-email" class="block text-xs font-semibold text-slate-300 mb-1">Work Email *</label>
                                <input type="email" id="capture-email" name="email" required autocomplete="email" placeholder="alex@company.com" class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#4169E1] transition-colors" />
                            </div>
                            <div class="grid grid-cols-2 gap-2">
                                <div>
                                    <label for="capture-name" class="block text-xs font-semibold text-slate-300 mb-1">Name</label>
                                    <input type="text" id="capture-name" name="name" autocomplete="name" placeholder="Alex Morgan" class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#4169E1] transition-colors" />
                                </div>
                                <div>
                                    <label for="capture-company" class="block text-xs font-semibold text-slate-300 mb-1">Company</label>
                                    <input type="text" id="capture-company" name="company" placeholder="Acme Corp" class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#4169E1] transition-colors" />
                                </div>
                            </div>
                            <!-- Honeypot -->
                            <div style="position: absolute; left: -9999px; opacity: 0; pointer-events: none;" aria-hidden="true">
                                <label for="capture-fax">Do not fill</label>
                                <input type="text" id="capture-fax" name="company_fax" tabindex="-1" autocomplete="off" />
                            </div>
                            <!-- Turnstile -->
                            <div class="cf-turnstile" data-sitekey="0x4AAAAAAAMQ-placeholder"></div>
                            <!-- Consents -->
                            <div class="space-y-2 pt-1">
                                <label for="capture-consent" class="flex items-start gap-2 text-xs text-slate-400 cursor-pointer">
                                    <input type="checkbox" id="capture-consent" name="consent" required class="mt-0.5 rounded border-slate-700 bg-slate-900 text-[#4169E1] focus:ring-[#4169E1]" />
                                    <span>Email me a copy of this result and keep my details and inputs so you can answer questions about it. See our <a href="/privacy/" class="text-[#44D7A8] underline hover:text-[#44D7A8]/80">Privacy Policy</a>.</span>
                                </label>
                                <label for="capture-followup" class="flex items-start gap-2 text-xs text-slate-400 cursor-pointer">
                                    <input type="checkbox" id="capture-followup" name="followup" class="mt-0.5 rounded border-slate-700 bg-slate-900 text-[#4169E1] focus:ring-[#4169E1]" />
                                    <span>Also contact me about InoConnect growth services (optional).</span>
                                </label>
                            </div>
                            <button type="submit" class="w-full py-3 px-4 rounded-xl bg-[#4169E1] hover:bg-[#3152B3] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md">
                                Email me this result &rarr;
                            </button>
                            <p id="capture-status" role="status" aria-live="polite" class="text-xs"></p>
                        </form>
                    </div>
                    <p class="text-xs text-slate-500 mt-4 text-center">Results are estimates based on the inputs and assumptions shown. Not financial advice or a guarantee.</p>`;
}

for (const t of tools) {
  const fp = path.join(root, t.file);
  let content = fs.readFileSync(fp, 'utf8');

  // Apply default number corrections
  for (const ed of t.edits) {
    if (content.includes(ed.from)) {
      content = content.replace(ed.from, ed.to);
      console.log(`Updated default in ${t.file}: ${ed.from} -> ${ed.to}`);
    }
  }

  // Insert Tool Lead Capture Form before the closing of the outputs panel
  if (!content.includes('id="tool-capture-form"')) {
    // Find a good insertion point inside the outputs card:
    // look for `<div class="mt-8 pt-6 border-t border-slate-800">` which contains the audit button
    const auditBtnBlock = /<div class="mt-8 pt-6 border-t border-slate-800">\s*<a href="\/contact\/"[\s\S]*?<\/a>\s*<\/div>/;
    if (auditBtnBlock.test(content)) {
      content = content.replace(auditBtnBlock, (m) => `${m}\n${getCaptureForm(t.slug)}`);
      console.log(`Injected capture form in ${t.file}`);
    } else {
      console.log(`Could not find audit button block in ${t.file}`);
    }
  }

  // Add tool-capture.js and turnstile script
  if (!content.includes('/assets/tool-capture.js')) {
    content = content.replace('</body>', `    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>\n    <script src="/assets/tool-capture.js" defer></script>\n</body>`);
    console.log(`Added tool-capture.js in ${t.file}`);
  }

  fs.writeFileSync(fp, content, 'utf8');
}

console.log('Phase 8 complete.');
