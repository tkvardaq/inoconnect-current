(() => {
  const form = document.getElementById('tool-capture-form');
  if (!form) return;
  const ENDPOINT = 'https://script.google.com/macros/s/AKfycbx-inoconnect-lead-capture/exec';
  const status = document.getElementById('capture-status'), btn = form.querySelector('[type=submit]'), t0 = Date.now();
  const say = (m, ok) => {
    if (!status) return;
    status.textContent = m;
    status.className = ok ? 'text-[#44D7A8] text-xs mt-3' : 'text-red-300 text-xs mt-3';
  };
  const MSG = {
    duplicate: 'We already received a request from this email.',
    bot: 'Please complete the verification check and try again.',
    invalid: 'Please check your inputs and try again.'
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    if (Date.now() - t0 < 3000) return say('Please try again in a moment.', false);

    const fd = new FormData(form);
    const d = Object.fromEntries(fd);
    d.turnstile = d['cf-turnstile-response'];
    delete d['cf-turnstile-response'];
    d.page = location.href;
    d.form = 'tool';
    d.tool = form.dataset.tool; // 'roas', 'ltv', 'email', 'cro'

    // Gather tool-specific inputs and result
    const inputs = {};
    document.querySelectorAll('input[type=range], input[type=number]').forEach(inp => {
      if (inp.id) inputs[inp.id] = Number(inp.value);
    });
    d.inputs = JSON.stringify(inputs);

    const resEl = document.querySelector('[data-result]');
    d.result = resEl ? resEl.textContent.trim() : '';

    d.consent = form.querySelector('[name=consent]')?.checked ? true : false;
    d.followup = form.querySelector('[name=followup]')?.checked ? true : false;

    btn.disabled = true;
    say('Sending...', true);

    try {
      const r = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(d)
      });
      const out = await r.json();
      if (!out.ok || !out.saved) throw new Error(out.error || 'server');

      form.reset();
      if (window.turnstile) window.turnstile.reset();

      if (out.emailed) {
        say('Saved. A copy is on its way to your inbox (check spam).', true);
      } else {
        say('Saved. We could not send the email copy right now; we will follow up.', true);
      }

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'tool_result_saved', tool: d.tool });
    } catch (err) {
      say(MSG[err.message] || 'We could not save your result. Please email info@inoconnect.com.', false);
      if (window.turnstile) window.turnstile.reset();
    } finally {
      btn.disabled = false;
    }
  });
})();
