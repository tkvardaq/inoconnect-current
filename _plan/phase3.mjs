import fs from 'fs';
import path from 'path';

const root = process.cwd();

// 1. Update contact/index.html
const contactPath = path.join(root, 'contact', 'index.html');
let contact = fs.readFileSync(contactPath, 'utf8');

// Replace growth@inoconnect.com with info@inoconnect.com
contact = contact.replaceAll('growth@inoconnect.com', 'info@inoconnect.com');

// Replace form in contact/index.html
const oldFormRegex = /<form\s+class="space-y-6"\s+onsubmit="event\.preventDefault\(\);\s*alert\([^)]*\);">[\s\S]*?<\/form>/;

const newFormHtml = `<form id="audit-form" class="space-y-6" novalidate>
                    <div class="grid md:grid-cols-2 gap-6">
                        <div>
                            <label for="name" class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Full Name *</label>
                            <input type="text" id="name" name="name" required autocomplete="name" placeholder="Alex Morgan" class="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#4169E1] transition-colors text-sm"/>
                        </div>
                        <div>
                            <label for="email" class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Work Email *</label>
                            <input type="email" id="email" name="email" required autocomplete="email" placeholder="alex@company.com" class="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#4169E1] transition-colors text-sm"/>
                        </div>
                    </div>

                    <div class="grid md:grid-cols-2 gap-6">
                        <div>
                            <label for="website" class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Company Website *</label>
                            <input type="url" id="website" name="website" required placeholder="https://company.com" class="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#4169E1] transition-colors text-sm"/>
                        </div>
                        <div>
                            <label for="industry" class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Primary Industry *</label>
                            <select id="industry" name="industry" required class="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-[#4169E1] transition-colors text-sm">
                                <option value="" disabled selected>Select an industry...</option>
                                <option value="saas">SaaS &amp; Cloud Software</option>
                                <option value="healthcare">Healthcare &amp; MedTech</option>
                                <option value="ecommerce">E-commerce &amp; Retail</option>
                                <option value="education">Education &amp; EdTech</option>
                                <option value="b2b">B2B &amp; Enterprise</option>
                                <option value="startups">High-Growth Startup</option>
                                <option value="professional-services">Professional Services</option>
                                <option value="ai">AI Application / Engineering</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid md:grid-cols-2 gap-6">
                        <div>
                            <label for="budget" class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Monthly Media Spend / Budget</label>
                            <select id="budget" name="budget" required class="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-[#4169E1] transition-colors text-sm">
                                <option value="" disabled selected>Select budget range...</option>
                                <option value="10k-25k">$10,000 - $25,000 / mo</option>
                                <option value="25k-50k">$25,000 - $50,000 / mo</option>
                                <option value="50k-100k">$50,000 - $100,000 / mo</option>
                                <option value="100k+">$100,000+ / mo</option>
                            </select>
                        </div>
                        <div>
                            <label for="bottleneck" class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Primary Growth Bottleneck</label>
                            <select id="bottleneck" name="bottleneck" required class="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-[#4169E1] transition-colors text-sm">
                                <option value="" disabled selected>Select primary bottleneck...</option>
                                <option value="cac">CAC is too high / Payback too long</option>
                                <option value="attribution">Attribution is broken / Inaccurate data</option>
                                <option value="scaling">Stuck at revenue plateau / Need scale</option>
                                <option value="automation">Operational drag / Need AI automation</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label for="goals" class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Tell Us About Your Commercial Goals</label>
                        <textarea id="goals" name="goals" rows="3" maxlength="2000" placeholder="Provide context on your current ARR/GMV, target milestones, and existing channel mix..." class="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#4169E1] transition-colors text-sm"></textarea>
                    </div>

                    <!-- Honeypot -->
                    <div style="position: absolute; left: -9999px; opacity: 0; pointer-events: none;" aria-hidden="true">
                        <label for="company_fax">Do not fill this field</label>
                        <input type="text" id="company_fax" name="company_fax" tabindex="-1" autocomplete="off" />
                    </div>

                    <!-- Turnstile -->
                    <div class="cf-turnstile" data-sitekey="0x4AAAAAAAMQ-placeholder"></div>

                    <!-- Consent -->
                    <div class="pt-2">
                        <label for="form-consent" class="flex items-start gap-2 text-xs text-slate-400 cursor-pointer">
                            <input type="checkbox" id="form-consent" name="consent" required class="mt-0.5 rounded border-slate-700 bg-slate-950 text-[#4169E1] focus:ring-[#4169E1]"/>
                            <span>I agree to InoConnect contacting me about this request. See our <a href="/privacy/" class="text-[#44D7A8] underline hover:text-[#44D7A8]/80">Privacy Policy</a>.</span>
                        </label>
                    </div>

                    <button type="submit" class="w-full py-4 bg-[#4169E1] hover:bg-[#3152B3] text-white font-black text-sm uppercase tracking-wider rounded-xl transition-all hover:scale-[1.02] shadow-xl shadow-[#4169E1]/25">
                        Submit Audit Request &rarr;
                    </button>

                    <p id="form-status" role="status" aria-live="polite" class="text-sm mt-3"></p>
                    <noscript><p class="text-sm text-slate-400 mt-2">JavaScript is required for this form. Please email <a href="mailto:info@inoconnect.com" class="text-[#44D7A8] underline">info@inoconnect.com</a> directly.</p></noscript>
                </form>`;

if (oldFormRegex.test(contact)) {
  contact = contact.replace(oldFormRegex, newFormHtml);
  console.log('Replaced form in contact/index.html');
} else {
  console.error('Could not find old form in contact/index.html');
}

// Add turnstile script and contact-form.js if not present
if (!contact.includes('/assets/contact-form.js')) {
  contact = contact.replace('</body>', `    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>\n    <script src="/assets/contact-form.js" defer></script>\n</body>`);
}

fs.writeFileSync(contactPath, contact, 'utf8');

// 2. Slider labels in tools
const toolPages = ['tools/cro-simulator/index.html', 'tools/email-revenue-simulator/index.html', 'tools/ltv-calculator/index.html', 'tools/roas-calculator/index.html'];
for (const tp of toolPages) {
  const f = path.join(root, tp);
  if (!fs.existsSync(f)) continue;
  let t = fs.readFileSync(f, 'utf8');
  let orig = t;

  // Add aria-label or ensure labels link to range inputs
  t = t.replace(/<input\b([^>]*type="range"[^>]*)>/g, (match, attrs) => {
    const idMatch = attrs.match(/id="([^"]+)"/);
    if (!idMatch) return match;
    const id = idMatch[1];
    const hasLabelFor = new RegExp('<label[^>]*for="' + id + '"').test(t);
    const hasAria = /aria-label=/.test(attrs);
    if (!hasLabelFor && !hasAria) {
      // create a readable label from id, e.g. "spend-range" -> "Spend"
      const name = id.replace(/-range|-input/g, '').replace(/-/g, ' ');
      return `<input ${attrs} aria-label="${name.toUpperCase()}">`;
    }
    return match;
  });

  if (t !== orig) {
    fs.writeFileSync(f, t, 'utf8');
    console.log(`Added slider aria-labels in ${tp}`);
  }
}
