import { createI18n, initialLang } from './i18n.js';
import { setupPlayer } from './phone-player.js';

const en = {
  'chrome.home': 'FaveUp — home page',
  'chrome.motto': 'Built with ❤️ for local businesses and their communities',
  'chrome.pdf': 'Download PDF (PL)',
  'chrome.langLabel': 'Language',
  'chrome.navLabel': 'Slide navigation',
  'chrome.prev': 'Previous slide',
  'chrome.next': 'Next slide',
  'chrome.rotate': 'Turn your phone sideways for bigger slides',
  'deck.foot': 'FaveUp · Built with ❤️ for local businesses and their communities',

  'phone.date': 'Tuesday, December 17',
  'phone.now': 'now',
  'phone.notifTitle': 'Cinnamon rolls just came out of the oven! 🥐☕',
  'phone.notifBody': 'Show this push at the bar → coffee + cinnamon roll -50%. ⏱️ Only for 1h!',
  'phone.unlock': 'Slide to unlock',
  'player.playAria': 'Play the film: how FaveUp works',
  'player.closeAria': 'Close the film',
  'player.muteAria': 'Mute / unmute',

  'd1.title': 'Sell more with simple notifications',
  'd1.lead': 'Your regulars always hear in time – none of them will miss an important moment at your place again',

  'd2.title': 'From a missed post<br />to a notification on time',
  'd2.lead': 'The same moment, two scenarios: a post that gets lost in the feed, and a push that reaches the customer right away.',
  'd2.play': 'Play the film',
  'd2.pause': 'Pause the film',
  'd2.resume': 'Resume the film',

  'd3.title': 'The problem we discovered',
  'd3.quote':
    '"I spent a whole week looking for a hairdresser appointment before my sister\'s wedding. Everything was booked. On Saturday a friend told me my favourite salon had three free slots on Thursday. Nobody knew about them. They stayed empty."',
  'd3.common': 'This happens every day in thousands of local places in Poland.',
  'd3.desc':
    "Local businesses have loyal customers, but no effective, direct channel to reach them. The customer would have come – they just didn't know.",
  'd3.p1t': 'No effective channel',
  'd3.p1d': 'Social media posts get lost in the algorithm – no guarantee of reach',
  'd3.p2t': 'Own app out of reach',
  'd3.p2d': 'Too expensive and time-consuming for a small business',
  'd3.p3t': 'Loyalty app chaos',
  'd3.p3d': 'Users get lost in dozens of separate apps',
  'd3.p4t': 'Info arrives too late',
  'd3.p4d': 'Offers and events are gone before the customer finds out',

  'd4.title': 'How we want to fix it',
  'd4.clientLabel': 'For the customer:',
  'd4.client':
    "FaveUp is an app where customers follow their favourite local places and see only what's happening right now: offers, appointments and time-limited promotions. Zero algorithm, zero noise – only the places they chose themselves.",
  'd4.businessLabel': 'For the business:',
  'd4.business':
    "On the business side: a simple web panel. You write a message, AI helps you make it short and engaging, and you send a push with one button – straight to people who consciously follow you. With a guarantee of instant delivery that Instagram doesn't give.",
  'd4.how': 'How does it work?',
  'd4.s1': 'The customer adds a place to favourites with a QR code on site or the map in the app',
  'd4.s2': 'You send short updates to your loyal customers',
  'd4.s3': 'The customer gets up-to-date information (news, events, promotions) without ads or algorithms',

  'd5.title': 'Benefits for the owner',
  'd5.b1':
    'Reaches people who already know and like the place more effectively – they get notified about new products, promotions, events and news',
  'd5.b2': 'Increases sales among loyal customers',
  'd5.b3': 'Can add time-limited offers and boost customer engagement with limited-time promotions',
  'd5.b4': 'Gets a simple communication channel without fighting for reach and ads',

  'd6.title': 'Benefits for the customer',
  'd6.b1': 'Collects favourite venues and places (cafés, clubs, fitness, museums, etc.) and their latest news in one place',
  'd6.b2': 'Eliminates algorithms, ads, irrelevant posts and endless scrolling',
  'd6.b3': 'Can be the first to know about time-limited offers and promotions',
  'd6.b4':
    "Gives the confidence of not missing important news, thanks to a dedicated app just for favourite places, where nothing else shows up",

  'd7.title': 'FaveUp vs the closest competition',
  'd7.examples': '(e.g. Embargo, Stampify)',
  'd7.common': 'Common ground',
  'd7.c1': 'Loyalty programme for customers',
  'd7.c2': 'Higher customer engagement',
  'd7.adv': "FaveUp's advantage",
  'd7.a1t': 'Focus on loyal customers',
  'd7.a1d': 'engages people who actually come back and are more willing to buy extra products.',
  'd7.a2t': 'Growing sales among regulars',
  'd7.a2d': 'showcases new products, not just rewards after collecting stamps.',
  'd7.a3t': 'Faster testing of promotions and news',
  'd7.a3d': 'launch offers instantly and watch how customers react.',
  'd7.a4t': 'A different customer profile than “stamp collectors”',
  'd7.a4d': 'FaveUp attracts loyal customers, not people focused only on a free reward.',

  'd8.title': 'Test with us – from a single scan to a real customer relationship',
  'd8.banner': 'We want to check whether a bonus really motivates customers to stay in touch with us.',
  'd8.s1': 'Put a QR code at the till: a 10x10 cm sticker or a stand.',
  'd8.s2': 'The cashier invites: “Scan the QR, a bonus for your next visit is waiting for you.”',
  'd8.s3':
    'Customer asks for details? Answer: “It\'s a new app to stay up to date with what\'s happening here – just sign up for the waitlist.”',
  'd8.s4': 'The customer scans the QR and signs up: name and e-mail.',
  'd8.s5': 'The system instantly sends the bonus by e-mail.',
  'd8.s6': 'We count how many customers come back with the code. <strong>&gt;10% = test success.</strong>',
  'd8.concl': 'Conclusions',
  'd8.c1': 'A positive result is the green light for the full version of the app, which you co-create as a Design Partner.',
  'd8.c2': 'You start right away with a base of customers who want to stay up to date with your place.',

  'd9.title': 'Already working with us',
  'd9.sub': "We're already running the QR code test in three places in Brochów.",
  'd9.t1': 'Café',
  'd9.t2': 'Local culture centre',
  'd9.t3': 'Patisserie',
  'd9.almost': 'almost',
  'd9.people': 'people signed up<br />to the waitlists',

  'd10.title': 'Customer app design',
  'd10.l1': 'Push notification',
  'd10.l2': 'News',
  'd10.l3': 'Places',
  'd10.l4': 'Settings',

  'd11.title': 'Owner panel design',
  'd11.l1': 'Dashboard',
  'd11.l2': 'Create a push',
  'd11.l3': 'QR code',
  'd11.l4': 'Settings',

  'd12.title': "Let's agree on the details of a test at your place",
  'd12.meet': "Let's meet for 15 minutes",
  'd12.desc': "We'll decide where to put the QR code, what bonus to offer customers and how to measure the test results.",
  'd12.cta': "Write or call, and we'll set a date →",
  'd12.contact': 'Contact',
};

const i18n = createI18n(en);
for (const button of document.querySelectorAll('[data-set-lang]')) {
  button.addEventListener('click', () => i18n.set(button.dataset.setLang));
}
i18n.set(initialLang());

const film = setupPlayer(document.getElementById('deck-film'));
const deck = document.querySelector('[data-deck]');
const stage = document.querySelector('[data-stage]');
const slides = [...document.querySelectorAll('[data-slide]')];
const counter = document.querySelector('[data-current]');
const prevButton = document.querySelector('[data-prev]');
const nextButton = document.querySelector('[data-next]');

// Keep in sync with the media query in deck.css.
const pagedQuery = matchMedia('(min-width: 900px) and (min-height: 560px)');
let current = 0;

function updateChrome() {
  counter.textContent = String(current + 1);
  prevButton.disabled = current === 0;
  nextButton.disabled = current === slides.length - 1;
  history.replaceState(null, '', `#${current + 1}`);
}

function goTo(index, { scroll } = { scroll: true }) {
  const target = Math.max(0, Math.min(slides.length - 1, index));
  if (slides[current].id === 'slide-2' && target !== current) film.pause();
  current = target;
  if (pagedQuery.matches) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === current);
      slide.inert = i !== current;
    });
  } else if (scroll) {
    scrollToSlide(current, 'smooth');
  }
  updateChrome();
}

// Stacked layout: land the slide just below the sticky header.
function scrollToSlide(index, behavior) {
  const header = document.querySelector('.deck-bar').getBoundingClientRect().height;
  const top = slides[index].getBoundingClientRect().top + window.scrollY - header - 12;
  window.scrollTo({ top, behavior });
}

function fit() {
  const box = deck.getBoundingClientRect();
  const styles = getComputedStyle(deck);
  const width = box.width - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
  const height = box.height - parseFloat(styles.paddingTop) - parseFloat(styles.paddingBottom);
  if (pagedQuery.matches) stage.style.setProperty('--scale', String(Math.min(width / 1280, height / 720)));
  else stage.style.setProperty('--mscale', String(width / 1280));
}

function applyMode() {
  fit();
  if (pagedQuery.matches) {
    goTo(current, { scroll: false });
  } else {
    for (const slide of slides) {
      slide.classList.remove('is-active');
      slide.inert = false;
    }
    // Instant, so the observer's first report already sees the deep-linked slide.
    if (current > 0) scrollToSlide(current, 'instant');
  }
}

prevButton.addEventListener('click', () => goTo(current - 1));
nextButton.addEventListener('click', () => goTo(current + 1));

window.addEventListener('keydown', (event) => {
  if (event.target.closest('input, textarea') || event.metaKey || event.ctrlKey || event.altKey) return;
  if (event.key === 'ArrowRight' || event.key === 'PageDown') goTo(current + 1);
  else if (event.key === 'ArrowLeft' || event.key === 'PageUp') goTo(current - 1);
  else if (event.key === 'Home') goTo(0);
  else if (event.key === 'End') goTo(slides.length - 1);
  else return;
  event.preventDefault();
});

// Horizontal swipe pages the deck on touch screens in paged mode.
let touchStart = null;
stage.addEventListener('pointerdown', (event) => {
  if (event.pointerType !== 'mouse') touchStart = { x: event.clientX, y: event.clientY };
});
stage.addEventListener('pointerup', (event) => {
  if (!touchStart || !pagedQuery.matches) return;
  const dx = event.clientX - touchStart.x;
  const dy = event.clientY - touchStart.y;
  touchStart = null;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) goTo(current + (dx < 0 ? 1 : -1));
});

// In the scrolling layout the counter follows the slide just under the header
// (slides are short on phones, so the middle of the screen can already show the next one).
const visibility = new IntersectionObserver(
  (entries) => {
    if (pagedQuery.matches) return;
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const index = slides.indexOf(entry.target);
      if (index !== current && slides[current].id === 'slide-2') film.pause();
      current = index;
      updateChrome();
    }
  },
  { rootMargin: '-15% 0px -75% 0px' },
);
for (const slide of slides) visibility.observe(slide);

window.addEventListener('resize', fit);
pagedQuery.addEventListener('change', applyMode);

const fromHash = Number.parseInt(location.hash.slice(1), 10);
current = Number.isInteger(fromHash) ? Math.max(0, Math.min(slides.length - 1, fromHash - 1)) : 0;
applyMode();
