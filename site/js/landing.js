import { createI18n, initialLang } from './i18n.js';
import { setupPlayer } from './phone-player.js';

// The waitlist inbox the Figma site already used.
const FORMSPREE_URL = 'https://formspree.io/f/xwlezeap';

const en = {
  'brand.tagline': 'Built with ❤️ for local businesses and their communities',
  'nav.join': 'Join the waitlist',
  'nav.joinShort': 'Join',
  'nav.viewLabel': 'View',
  'nav.langLabel': 'Language',
  'nav.business': 'For Business',
  'nav.users': 'For Users',

  'hero.eyebrow': 'For local businesses',
  'hero.title': 'Sell more with simple notifications',
  'hero.subtitle': 'Your regulars always hear in time – none of them will miss an important moment at your place again',
  'hero.cta': 'Join the waitlist',
  'hero.scroll': 'Scroll down to see how it works',

  'phone.date': 'Tuesday, December 17',
  'phone.now': 'now',
  'phone.notifTitle': '☕ Fresh beans just arrived!',
  'phone.notifBody': 'Try our Ethiopian blend. The first 20 people get 20% off!',
  'phone.unlock': 'Slide to unlock',

  'player.play': 'See how FaveUp works',
  'player.pause': 'Pause the film',
  'player.resume': 'Resume the film',
  'player.meta': 'Short film · 0:36 · with sound',
  'player.playAria': 'Play the film: how FaveUp works',
  'player.closeAria': 'Close the film',
  'player.muteAria': 'Mute / unmute',

  'what.title': 'What is FaveUp?',
  'what.desc':
    'FaveUp is a simple notification channel that bypasses social media noise and ineffective newsletters: customers scan a QR code and get news about promotions, novelties and new products, while you build loyalty and grow sales.',
  'what.stat1': "and you're connected with your customer",
  'what.stat2': 'delivery success rate',
  'what.stat3Value': '$0',
  'what.stat3': 'no custom app costs',

  'how.title': 'How does it work in practice?',
  'how.subtitle': '4 simple steps to reach your customers',
  'how.s1Title': 'Scan the QR code',
  'how.s1Desc': 'Customers scan your QR code at the counter, bar or table, or find you in the FaveUp app, and start following you.',
  'how.s2Title': 'You send a push',
  'how.s2Desc': 'In a few clicks you tell customers about news and promotions.',
  'how.s3Title': 'Push on their phone',
  'how.s3Desc': "The message lands on your customers' phones right away – no algorithm, no noise.",
  'how.s4Title': 'Statistics',
  'how.s4Desc': 'See how many customers follow you and how they react to each push, while sales grow.',

  'why.title': 'Why FaveUp?',
  'why.subtitle': 'The simplest way to stay in touch with your customers',
  'why.b1': 'Reaches people who already know and like the place more effectively and grows sales among regulars – they get notified about new products, promotions and events',
  'why.b2': 'Can add time-limited offers and boost customer engagement with limited-time promotions',
  'why.b3': 'Gets a simple communication channel without fighting for reach and ads',
  'why.b4': 'Has a permanent channel to customers without building and maintaining an own app, the way big chains do',

  'for.title': 'Who is it for?',
  'for.subtitle': 'We can help many industries — here are a few',
  'for.i1': 'Restaurants & Cafes',
  'for.i2': 'Retail Stores',
  'for.i3': 'Local Artisans',
  'for.i4': 'Gyms & Studios',
  'for.i5': 'Salons & Spas',
  'for.i6': 'Recurring Event Venues',

  'contact.badge': 'Get in touch',
  'contact.title': 'Sign up for the beta and get 20% off at launch.',
  'contact.subtitle': 'Grow your sales with FaveUp',
  'contact.question': 'Have a question?',
  'form.label': 'Email address',
  'form.placeholder': 'Your email address',
  'form.submit': 'Join the beta and get 20% off at launch',
  'form.sending': 'Sending…',
  'form.error': "We couldn't send it. Please try again or write to hello@faveup.app.",
  'form.thanks': 'Thank you!',
  'form.thanksDesc': "We'll get back to you at that address.",

  'footer.presentation': 'Detailed Presentation',
  'footer.dev': 'The app is currently in development.',
  'footer.copy': '© 2026 FaveUp. Connecting local businesses with their communities.',

  'users.title': 'Instant updates from the spots you love',
  'users.subtitle': 'Connect with your favorite businesses and places instantly and stay updated',
  'users.cta': 'Join the waitlist',
  'users.demoTitle': 'See it in action 📱',
  'users.demoSub': 'Example notification from a local coffee shop',
  'users.soon': 'Coming soon',
  'users.stayTitle': 'Stay connected with your favorite local spots',
  'users.stayDesc':
    'Imagine getting instant notifications about special events, exclusive deals, and important updates from the places you actually care about.',
  'users.f1Title': 'From places you love',
  'users.f1Desc': 'Only hear from local spots you choose to follow',
  'users.f2Title': 'Essential updates only',
  'users.f2Desc': 'No spam, just the good stuff that matters',
  'users.f3Title': 'Never miss a deal',
  'users.f3Desc': "Get exclusive offers before they're gone",
  'users.f4Title': 'Zero FOMO, zero noise',
  'users.f4Desc': 'Unfollow anytime with a single tap',
  'users.copy': '© 2026 FaveUp. Building better connections between local businesses and their communities.',
};

const i18n = createI18n(en);
for (const button of document.querySelectorAll('[data-set-lang]')) {
  button.addEventListener('click', () => i18n.set(button.dataset.setLang));
}
i18n.set(initialLang());

// ---------- Business / users views (kept on the old hash routes so existing links work) ----------

const topbar = document.querySelector('[data-topbar]');
const views = { business: document.getElementById('view-business'), users: document.getElementById('view-users') };
const player = setupPlayer(document.getElementById('hero-phone'));

function showView(name, { animate } = { animate: true }) {
  for (const [key, view] of Object.entries(views)) {
    const active = key === name;
    view.hidden = !active;
    view.classList.toggle('is-entering', active && animate);
  }
  for (const button of document.querySelectorAll('[data-view-button]')) {
    button.setAttribute('aria-pressed', String(button.dataset.viewButton === name));
  }
  topbar.dataset.viewCurrent = name;
  const hash = name === 'users' ? '#/users-view' : '#/business-view';
  if (location.hash !== hash) history.replaceState(null, '', hash);
  if (name !== 'business') player.pause();
}

for (const button of document.querySelectorAll('[data-view-button]')) {
  button.addEventListener('click', () => {
    showView(button.dataset.viewButton);
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
}
showView(location.hash.includes('users-view') ? 'users' : 'business', { animate: false });

// "Join" buttons scroll to the form of whichever view is visible.
for (const link of document.querySelectorAll('[data-join]')) {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const current = topbar.dataset.viewCurrent;
    const target = document.getElementById(current === 'users' ? 'waitlist' : 'contact');
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.querySelector('input').focus({ preventScroll: true });
  });
}

// In-page anchors would otherwise overwrite the view hash.
for (const link of document.querySelectorAll('.scroll-hint')) {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector(link.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
}

const onScroll = () => {
  topbar.classList.toggle('is-scrolled', window.scrollY > 100);
  const heroCta = views[topbar.dataset.viewCurrent].querySelector('.hero__actions [data-join]');
  topbar.classList.toggle('has-cta', heroCta.getBoundingClientRect().bottom < topbar.offsetHeight);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- Reveal on scroll ----------

const revealer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      revealer.unobserve(entry.target);
    }
  },
  { rootMargin: '0px 0px -8% 0px' },
);
for (const el of document.querySelectorAll('.reveal')) revealer.observe(el);

// ---------- Waitlist forms ----------

for (const form of document.querySelectorAll('[data-signup]')) {
  const error = form.querySelector('.signup__error');
  const done = form.nextElementSibling;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    error.hidden = true;
    done.hidden = true;
    form.classList.add('is-sending');
    try {
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email: form.elements.email.value,
          source: form.dataset.source,
          language: i18n.lang,
          _subject: 'Nowy lead — FaveUp beta',
        }),
      });
      if (!response.ok) throw new Error(`Formspree responded ${response.status}`);
      // The form stays usable for another address, so it starts empty again.
      form.reset();
      done.hidden = false;
    } catch (failure) {
      console.error(failure);
      error.hidden = false;
    } finally {
      form.classList.remove('is-sending');
    }
  });
}
