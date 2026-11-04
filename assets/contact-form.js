(() => {
  const form = document.getElementById('audit-form'); if (!form) return;
  const ENDPOINT = 'https://script.google.com/macros/s/AKfycbx-inoconnect-lead-capture/exec';
  const status = document.getElementById('form-status'), btn = form.querySelector('[type=submit]'), t0 = Date.now();
  const say = (m, ok) => { if (!status) return; status.textContent = m; status.className = ok ? 'text-[#44D7A8] text-sm mt-3' : 'text-red-300 text-sm mt-3'; };
  const MSG = {
    duplicate: 'We already received a request from this email.',
    bot: 'Please complete the check and try again.',
    invalid: 'Please check the highlighted fields and try again.'
  };
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const d = Object.fromEntries(new FormData(form));
    if (Date.now() - t0 < 3000) return say('Please try again in a moment.', false);
    d.turnstile = d['cf-turnstile-response']; delete d['cf-turnstile-response'];
    d.page = location.href; btn.disabled = true; say('Sending...', true);
    try {
      const r = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(d) });
      const out = await r.json();                                  // if the browser blocks reading this reply, the form must NOT ship (plan 3.2)
      if (!out.ok || !out.saved) throw new Error(out.error || 'server');
      form.reset(); if (window.turnstile) window.turnstile.reset();
      say('Thanks. We have your request and will reply by email.', true);
      (window.dataLayer = window.dataLayer || []).push({ event: 'generate_lead', form_id: 'growth_audit' }); // no personal data
    } catch (err) {
      say(MSG[err.message] || 'We could not send your request. Please email info@inoconnect.com.', false);
      if (window.turnstile) window.turnstile.reset();
    } finally { btn.disabled = false; }
  });
})();
