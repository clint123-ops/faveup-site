(() => {
  'use strict';

  const data = JSON.parse(document.getElementById('faveup-data').textContent);
  const sb = window.supabase.createClient(data.supabase.url, data.supabase.key);
  const $ = (id) => document.getElementById(id);
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
  };

  // The remembered place may have been removed from places/ since the last visit.
  let placeId = data.places.some((p) => p.id === store.get('faveup_admin_place')) ? store.get('faveup_admin_place') : data.places[0].id;
  let rows = [];
  const place = () => data.places.find((p) => p.id === placeId);

  const fmtDate = new Intl.DateTimeFormat('pl-PL', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Warsaw',
  });
  // Rows written directly by the old Figma page have no source.
  const sourceLabel = (s) => (s === null ? 'Figma' : { qr: 'QR', link: 'Link', import: 'Import' }[s]);
  const STATUS = {
    sent: ['Wysłano', 'badge--green'],
    queued: ['Wysyłanie…', 'badge--blue'],
    error: ['Błąd', 'badge--red'],
    pending: ['Oczekuje', 'badge--yellow'],
  };
  const statusOf = (r) =>
    r.webhook_sent ? 'sent' : r.webhook_error ? 'error' : r.webhook_request_id ? 'queued' : 'pending';

  // ---------- helpers ----------
  let toastTimer;
  function toast(msg, isError) {
    const el = $('toast');
    el.textContent = msg;
    el.classList.toggle('toast--error', !!isError);
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 5000);
  }

  const el = (tag, props = {}, ...children) => {
    const n = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k.startsWith('data-') || k.startsWith('aria-') || k === 'title') n.setAttribute(k, v);
      else n[k] = v;
    });
    children.flat().forEach((c) => c != null && n.append(c));
    return n;
  };
  const icon = (name) => document.querySelector(`[data-icon-tpl="${name}"]`).content.cloneNode(true);

  // ---------- auth ----------
  async function boot() {
    const { data: { session } } = await sb.auth.getSession();
    if (!session) return showLogin();
    const { data: isAdmin, error } = await sb.rpc('faveup_is_admin');
    if (error || !isAdmin) {
      await sb.auth.signOut();
      return showLogin(error ? `Błąd: ${error.message}` : 'To konto nie ma uprawnień administratora FaveUp.');
    }
    $('user-email').textContent = session.user.email;
    $('login').hidden = true;
    $('dash').hidden = false;
    renderPlacePicker();
    await load();
  }

  function showLogin(msg) {
    $('dash').hidden = true;
    $('login').hidden = false;
    $('login-error').hidden = !msg;
    $('login-error').textContent = msg || '';
  }

  $('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    const btn = f.querySelector('button');
    btn.disabled = true;
    // Supabase Auth signs in by e-mail; a short login such as "admin123" is the
    // Supabase user admin123@faveup.app.
    const login = f.login.value.trim().toLowerCase();
    const email = login.includes('@') ? login : `${login}@faveup.app`;
    const { error } = await sb.auth.signInWithPassword({ email, password: f.password.value });
    btn.disabled = false;
    if (error) return showLogin(error.message === 'Invalid login credentials' ? 'Nieprawidłowy login lub hasło.' : error.message);
    f.password.value = '';
    boot();
  });

  $('logout').addEventListener('click', async () => { await sb.auth.signOut(); showLogin(); });

  // ---------- place picker & tabs ----------
  function renderPlacePicker() {
    const sel = $('place-select');
    sel.replaceChildren(...data.places.map((p) => el('option', { value: p.id, text: p.name, selected: p.id === placeId })));
    $('place-logo').src = `${data.assetBase}assets/places/${place().logo}`;
    renderQr();
  }
  $('place-select').addEventListener('change', (e) => {
    placeId = e.target.value;
    store.set('faveup_admin_place', placeId);
    $('place-logo').src = `${data.assetBase}assets/places/${place().logo}`;
    renderQr();
    load();
  });

  document.querySelectorAll('.tab').forEach((tab) =>
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((t) => {
        const on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
        $(`tab-${t.dataset.tab}`).hidden = !on;
      });
    }),
  );

  // ---------- data ----------
  async function fetchAll(brandId) {
    const out = [];
    const page = 1000;
    for (let from = 0; ; from += page) {
      const { data: chunk, error } = await sb
        .from('submissions')
        .select('id,email,name,brand_id,webhook_sent,webhook_error,webhook_request_id,webhook_sent_at,source,lang,created_at')
        .eq('brand_id', brandId)
        .order('created_at', { ascending: false })
        .range(from, from + page - 1);
      if (error) throw error;
      out.push(...chunk);
      if (chunk.length < page) return out;
    }
  }

  let loading = false;
  async function load() {
    if (loading) return;
    loading = true;
    const brandId = placeId;
    $('rows').replaceChildren(el('tr', {}, el('td', { colSpan: 6, class: 'muted center', text: 'Ładowanie…' })));
    try {
      await sb.rpc('faveup_sync_webhook_status');
      const list = await fetchAll(brandId);
      if (brandId !== placeId) return;
      rows = list;
      renderStats();
      renderRows();
    } catch (err) {
      console.error(err);
      $('rows').replaceChildren(el('tr', {}, el('td', { colSpan: 6, class: 'center form-error', text: `Nie udało się pobrać danych: ${err.message}` })));
    } finally {
      loading = false;
    }
  }

  function renderStats() {
    const weekAgo = Date.now() - 7 * 864e5;
    const cards = [
      ['Zapisy', rows.length],
      ['Ostatnie 7 dni', rows.filter((r) => new Date(r.created_at).getTime() >= weekAgo).length],
    ];
    $('stats').replaceChildren(...cards.map(([label, value]) => el('div', { class: 'stat' }, el('span', { class: 'stat__value', text: String(value) }), el('span', { class: 'stat__label', text: label }))));
  }

  function filtered() {
    const q = $('search').value.trim().toLowerCase();
    const s = $('status-filter').value;
    return rows.filter((r) => (!q || r.email.toLowerCase().includes(q)) && (!s || statusOf(r) === s));
  }

  function renderRows() {
    const list = filtered();
    const p = place();
    if (!list.length) {
      $('rows').replaceChildren(el('tr', {}, el('td', { colSpan: 6, class: 'muted center', text: rows.length ? 'Brak wyników.' : 'Brak zapisów.' })));
      return;
    }
    $('rows').replaceChildren(...list.map((r) => {
      const st = statusOf(r);
      const [label, cls] = STATUS[st];
      const tip = st === 'error' ? r.webhook_error
        : st === 'pending' ? 'E-mail z kodem nie został jeszcze wysłany.'
        : st === 'queued' ? 'Przekazano do Make.com – status odświeży się za chwilę.'
        : r.webhook_sent_at ? `Wysłano ${fmtDate.format(new Date(r.webhook_sent_at))}` : 'Wysłano';
      return el('tr', {},
        el('td', { class: 'nowrap', text: fmtDate.format(new Date(r.created_at)) }),
        el('td', { class: r.name ? '' : 'muted italic', text: r.name || 'Brak' }),
        el('td', { class: 'mono', text: r.email }),
        el('td', {}, el('span', { class: 'chip', text: sourceLabel(r.source) })),
        el('td', {}, el('span', { class: 'code', text: p.discountCode })),
        el('td', { class: 'nowrap' }, el('span', { class: `badge ${cls}`, title: tip, text: label }), el('span', { class: 'tip', title: tip, 'aria-label': tip }, icon('info'))),
      );
    }));
  }
  $('search').addEventListener('input', renderRows);
  $('status-filter').addEventListener('change', renderRows);
  $('refresh').addEventListener('click', load);

  // ---------- export ----------
  $('export').addEventListener('click', () => {
    const list = filtered();
    const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines = [['data', 'email', 'imie', 'zrodlo', 'kod', 'status', 'blad'].join(',')];
    list.forEach((r) => lines.push([
      new Date(r.created_at).toISOString(), r.email, r.name, sourceLabel(r.source), place().discountCode, STATUS[statusOf(r)][0], r.webhook_error,
    ].map(cell).join(',')));
    const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = el('a', { href: URL.createObjectURL(blob), download: `faveup-${place().id}-${new Date().toISOString().slice(0, 10)}.csv` });
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  // ---------- QR ----------
  function renderQr() {
    const p = place();
    const svgUrl = `${data.assetBase}qr/${p.slug}.svg`;
    $('qr-img').src = svgUrl;
    $('qr-link').href = p.qrUrl;
    $('qr-link').textContent = p.qrUrl;
    $('qr-svg').href = svgUrl;
    $('qr-svg').download = `faveup-qr-${p.slug}.svg`;
    $('qr-open').href = p.url;
    const legacy = $('legacy');
    legacy.hidden = !p.legacyUrls.length;
    legacy.replaceChildren(
      el('strong', { text: 'Wydrukowane wcześniej kody QR' }),
      el('p', { text: 'Te adresy też zapisują do tej samej listy (ta sama tabela w Supabase), więc stare naklejki działają bez zmian:' }),
      el('ul', {}, p.legacyUrls.map((u) => el('li', {}, el('code', { text: u })))),
    );
  }

  $('qr-copy').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(place().qrUrl); toast('Skopiowano link'); } catch { toast(place().qrUrl); }
  });

  $('qr-png').addEventListener('click', async () => {
    const p = place();
    const img = new Image();
    img.src = `${data.assetBase}qr/${p.slug}.svg`;
    await img.decode();
    const size = 2048;
    const c = el('canvas', { width: size, height: size });
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, size, size);
    ctx.drawImage(img, 0, 0, size, size);
    c.toBlob((blob) => {
      const a = el('a', { href: URL.createObjectURL(blob), download: `faveup-qr-${p.slug}.png` });
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }, 'image/png');
  });

  boot();
})();
