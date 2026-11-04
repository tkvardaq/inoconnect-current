const SHEET_ID = 'PASTE_SHEET_ID';
const MAIL_RESERVE = 20;                       // always keep this many recipients of Google's daily mail quota for the owner's own notifications
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const clean = s => String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, 2000);
const safeCell = s => /^[=+\-@]/.test(s) ? "'" + s : s;            // block spreadsheet formula injection
const reply = o => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);

// Allow-list per calculator: the result must match this format and only these numeric inputs are accepted.
const TOOLS = {
  roas:  { name: 'ROAS Calculator',         result: /^\d{1,3}(\.\d{1,2})?x$/,      inputs: ['spend-range', 'rev-range', 'margin-range', 'aov-range'] },
  ltv:   { name: 'LTV Calculator',          result: /^\$\d{1,3}(,\d{3})*$/,        inputs: ['arpu-input', 'churn-input', 'margin-input'] },
  email: { name: 'Email Revenue Simulator', result: /^\$\d{1,3}(,\d{3})*$/,        inputs: ['subs-range', 'sends-range', 'open-range', 'ctor-range', 'email-aov-range'] },
  cro:   { name: 'CRO Simulator',           result: /^\+\$\d{1,3}(,\d{3})*$/,      inputs: ['traffic-range', 'base-cr-range', 'new-cr-range', 'cro-aov-range'] }
};

function authorize() {   // run ONCE from the editor to grant permissions
  SpreadsheetApp.openById(SHEET_ID).getName();
  UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { muteHttpExceptions: true });
  MailApp.sendEmail(Session.getEffectiveUser().getEmail(), 'InoConnect forms: authorised', 'Permissions granted.');
}

function verifyBot(token) {   // server-side Cloudflare Turnstile check; rejects when the secret or token is missing
  const secret = PropertiesService.getScriptProperties().getProperty('TURNSTILE_SECRET');
  if (!secret || !token) return false;
  const r = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',
    { method: 'post', payload: { secret: secret, response: String(token) }, muteHttpExceptions: true });
  try { return JSON.parse(r.getContentText()).success === true; } catch (x) { return false; }
}

function mailQuotaOk() { return MailApp.getRemainingDailyQuota() > MAIL_RESERVE; }   // Google's quota window is 24 h from first use, not a calendar day

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.company_fax) return reply({ ok: true, saved: false, emailed: false });   // honeypot: look successful, store nothing
    if (!verifyBot(d.turnstile)) return reply({ ok: false, error: 'bot' });
    return d.form === 'tool' ? saveTool(d) : saveContact(d);
  } catch (err) {
    console.error(err);
    return reply({ ok: false, error: 'server' });
  }
}

// Inquiry form: Sheet row + notification email to the owner. Reply says exactly what succeeded.
function saveContact(d) {
  const v = { name: clean(d.name), email: clean(d.email).toLowerCase(), website: clean(d.website), industry: clean(d.industry),
              budget: clean(d.budget), bottleneck: clean(d.bottleneck), goals: clean(d.goals), page: clean(d.page), consent: d.consent ? 'yes' : 'no' };
  if (!v.name || !EMAIL_RE.test(v.email) || !/^https?:\/\/\S+\.\S+/.test(v.website) || v.consent !== 'yes') return reply({ ok: false, error: 'invalid' });
  const cache = CacheService.getScriptCache(), key = 'rl_' + v.email;
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    if (cache.get(key)) return reply({ ok: false, error: 'duplicate' });          // checked INSIDE the lock, so two simultaneous posts cannot both pass
    SpreadsheetApp.openById(SHEET_ID).getSheetByName('Leads').appendRow(
      [new Date(), v.name, v.email, v.website, v.industry, v.budget, v.bottleneck, v.goals, v.page, v.consent].map(x => typeof x === 'string' ? safeCell(x) : x));
    cache.put(key, '1', 120);
  } finally { lock.releaseLock(); }
  let emailed = false;
  try {
    MailApp.sendEmail({ to: Session.getEffectiveUser().getEmail(), replyTo: v.email, name: 'InoConnect website',
      subject: 'New growth audit request: ' + v.name,
      body: ['Name: ' + v.name, 'Email: ' + v.email, 'Website: ' + v.website, 'Industry: ' + v.industry,
             'Budget: ' + v.budget, 'Bottleneck: ' + v.bottleneck, 'Goals: ' + v.goals, 'Page: ' + v.page].join('\n') });
    emailed = true;
  } catch (err) { console.error(err); }                                              // the Sheet row is the source of truth
  return reply({ ok: true, saved: true, emailed: emailed });
}

// "Email me this result": Sheet row, then an email copy to the visitor. No visitor-written text can reach the email.
function saveTool(d) {
  const tool = TOOLS[d.tool];
  const email = clean(d.email).toLowerCase();
  const result = String(d.result || '').trim();
  if (!tool || !EMAIL_RE.test(email) || !d.consent || !tool.result.test(result)) return reply({ ok: false, error: 'invalid' });
  const inputs = {};
  try {
    const raw = JSON.parse(String(d.inputs || '{}'));
    tool.inputs.forEach(k => { const n = Number(raw[k]); if (isFinite(n)) inputs[k] = n; });
  } catch (x) { /* malformed inputs are dropped */ }
  const name = clean(d.name).slice(0, 100), company = clean(d.company).slice(0, 100), page = clean(d.page);
  const first = name.replace(/[^\p{L} '\-]/gu, '').trim().split(/\s+/)[0].slice(0, 30);
  const followup = d.followup ? 'yes' : 'no';
  const cache = CacheService.getScriptCache(), key = 'tl_' + email + d.tool;
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    if (cache.get(key)) return reply({ ok: false, error: 'duplicate' });          // inside the lock: atomic
    SpreadsheetApp.openById(SHEET_ID).getSheetByName('ToolLeads').appendRow(
      [new Date(), tool.name, name, email, company, JSON.stringify(inputs), result, page, followup].map(x => typeof x === 'string' ? safeCell(x) : x));
    cache.put(key, '1', 120);
  } finally { lock.releaseLock(); }
  let emailed = false;
  if (mailQuotaOk()) {
    try {
      MailApp.sendEmail({ to: email, replyTo: 'info@inoconnect.com', name: 'InoConnect',
        subject: 'Your InoConnect ' + tool.name + ' result',
        body: ['Hi' + (first ? ' ' + first : '') + ',', '', 'Here is a copy of your result from the InoConnect ' + tool.name + '.', '',
               'Result: ' + result, 'Inputs:'].concat(Object.keys(inputs).map(k => '  ' + k + ': ' + inputs[k])).concat([
               '', 'This is an estimate based on the inputs you entered. It is not a guarantee.',
               'Questions? Reply to this email or visit https://inoconnect.com/contact/', '',
               'You asked us to email you this result, so we sent it. We keep your details and inputs as described in https://inoconnect.com/privacy/ . To have your data deleted, email privacy@inoconnect.com.']).join('\n') });
      emailed = true;
    } catch (err) { console.error(err); }
  }
  return reply({ ok: true, saved: true, emailed: emailed });
}
