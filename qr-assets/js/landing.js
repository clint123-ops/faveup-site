(() => {
  'use strict';

  const data = JSON.parse(document.getElementById('faveup-data').textContent);
  const { place, strings, supabase } = data;
  const params = new URLSearchParams(location.search);
  const source = params.get('qr') === '1' || params.get('source') === 'qr' ? 'qr' : 'link';
  const EMAIL_RE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  const $ = (id) => document.getElementById(id);
  const form = $('signup');
  const input = $('email');
  const errorEl = $('email-error');
  const submit = $('submit');
  const views = { form: $('view-form'), done: $('view-done'), terms: $('view-terms') };

  // ---------- language ----------
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
  };
  const urlLang = params.get('lang');
  let lang = urlLang === 'en' || urlLang === 'pl' ? urlLang : store.get('faveup_lang') === 'en' ? 'en' : 'pl';
  let doneState = 'created';
  const t = (key) => strings[lang][key];

  function applyLang() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-t]').forEach((el) => { el.textContent = t(el.dataset.t); });
    document.querySelectorAll('[data-t-placeholder]').forEach((el) => { el.placeholder = t(el.dataset.tPlaceholder); });
    document.querySelectorAll('.lang__btn').forEach((b) => {
      const on = b.dataset.lang === lang;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    renderDone();
    renderTerms();
    if (!errorEl.hidden) validate();
  }

  document.querySelectorAll('.lang__btn').forEach((b) =>
    b.addEventListener('click', () => {
      if (b.dataset.lang === lang) return;
      lang = b.dataset.lang;
      store.set('faveup_lang', lang);
      applyLang();
    }),
  );

  // ---------- views ----------
  function show(name) {
    Object.entries(views).forEach(([k, el]) => { el.hidden = k !== name; });
    window.scrollTo(0, 0);
    updateHint();
  }

  function renderDone() {
    const created = doneState === 'created';
    $('done-title').dataset.t = created ? 'congrats' : 'alreadyTitle';
    $('done-text').dataset.t = created ? 'bonusOnWay' : 'alreadyDesc';
    $('done-title').textContent = t($('done-title').dataset.t);
    $('done-text').textContent = t($('done-text').dataset.t);
  }

  function renderTerms() {
    const body = $('terms-body');
    body.replaceChildren();
    for (const [heading, text] of t('terms')) {
      const h = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = heading;
      h.append(strong);
      const p = document.createElement('p');
      p.textContent = text.replace('{termsPromo}', t('termsPromo'));
      body.append(h, p);
    }
    const contact = document.createElement('p');
    contact.className = 'terms__contact';
    const a = document.createElement('a');
    a.href = `mailto:${data.contactEmail}`;
    a.textContent = data.contactEmail;
    contact.append(`${t('termsContact')} `, a);
    body.append(contact);
  }

  document.querySelectorAll('[data-open-terms]').forEach((b) => b.addEventListener('click', () => show('terms')));
  document.querySelectorAll('[data-close-terms]').forEach((b) => b.addEventListener('click', () => show('form')));

  // ---------- toast ----------
  let toastTimer;
  function toast(msg, isError) {
    const el = $('toast');
    el.textContent = msg;
    el.classList.toggle('toast--error', !!isError);
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 4500);
  }

  // ---------- supabase ----------
  async function rpc(fn, args) {
    const res = await fetch(`${supabase.url}/rest/v1/rpc/${fn}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabase.key,
        Authorization: `Bearer ${supabase.key}`,
      },
      body: JSON.stringify(args),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text().catch(() => '')}`);
    return res.json();
  }

  // Count the visit (QR scans separately). Never blocks the page.
  rpc('faveup_track', { p_brand_id: place.id, p_type: source === 'qr' ? 'qr_scan' : 'page_view' }).catch(() => {});

  // ---------- form ----------
  function validate() {
    const v = input.value.trim();
    const msg = !v ? t('emailRequired') : !EMAIL_RE.test(v) ? t('emailInvalid') : '';
    errorEl.textContent = msg;
    errorEl.hidden = !msg;
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  }
  input.addEventListener('input', () => { if (!errorEl.hidden) validate(); });

  let busy = false;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (busy) return;
    if (!validate()) { input.focus(); return; }
    if (form.website.value) { doneState = 'created'; renderDone(); show('done'); return; } // bot honeypot

    busy = true;
    submit.disabled = true;
    submit.classList.add('is-busy');
    try {
      const r = await rpc('faveup_subscribe', {
        p_brand_id: place.id,
        p_email: input.value.trim(),
        p_lang: lang,
        p_source: source,
      });
      if (r.status === 'created' || r.status === 'exists') {
        doneState = r.status;
        renderDone();
        show('done');
      } else if (r.status === 'invalid') {
        validate();
        errorEl.textContent = t('emailInvalid');
        errorEl.hidden = false;
      } else {
        throw new Error(`Unexpected status: ${r.status}`);
      }
    } catch (err) {
      console.error('[FaveUp] subscribe failed', err);
      toast(navigator.onLine === false ? t('offline') : t('error'), true);
    } finally {
      busy = false;
      submit.disabled = false;
      submit.classList.remove('is-busy');
    }
  });

  // ---------- mobile scroll hint ----------
  const hint = $('scroll-hint');
  function updateHint() {
    const el = document.documentElement;
    const atBottom = window.scrollY + el.clientHeight >= el.scrollHeight - 100;
    hint.classList.toggle('is-hidden', views.form.hidden || atBottom);
  }
  window.addEventListener('scroll', updateHint, { passive: true });
  window.addEventListener('resize', updateHint);

  applyLang();
  updateHint();
})();
