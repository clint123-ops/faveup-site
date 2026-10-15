// Polish lives in the HTML (it is the default and what crawlers see); English comes from a
// dictionary. Elements opt in with data-i18n="key" (innerHTML) or
// data-i18n-attr="attribute:key; attribute:key".

const STORAGE_KEY = 'faveup-lang';

export function initialLang() {
  const fromUrl = new URLSearchParams(location.search).get('lang');
  if (fromUrl === 'pl' || fromUrl === 'en') return fromUrl;
  try {
    return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'pl';
  } catch {
    return 'pl';
  }
}

export function createI18n(en) {
  const texts = [...document.querySelectorAll('[data-i18n]')].map((el) => ({
    el,
    key: el.dataset.i18n,
    pl: el.innerHTML,
  }));
  const attrs = [...document.querySelectorAll('[data-i18n-attr]')].flatMap((el) =>
    el.dataset.i18nAttr.split(';').map((pair) => {
      const [attr, key] = pair.split(':').map((s) => s.trim());
      return { el, attr, key, pl: el.getAttribute(attr) };
    }),
  );

  for (const { key } of [...texts, ...attrs]) {
    if (!(key in en)) throw new Error(`Missing English translation for "${key}"`);
  }

  let current = 'pl';
  const listeners = [];

  return {
    get lang() {
      return current;
    },
    onChange: (fn) => listeners.push(fn),
    set(lang) {
      current = lang;
      document.documentElement.lang = lang;
      for (const { el, key, pl } of texts) el.innerHTML = lang === 'en' ? en[key] : pl;
      for (const { el, attr, key, pl } of attrs) el.setAttribute(attr, lang === 'en' ? en[key] : pl);
      for (const button of document.querySelectorAll('[data-set-lang]')) {
        button.setAttribute('aria-pressed', String(button.dataset.setLang === lang));
      }
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        // Private mode: the choice just isn't remembered.
      }
      for (const fn of listeners) fn(lang);
    },
  };
}
