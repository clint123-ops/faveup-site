# FaveUp – marketing site (faveup.app)

Rebuild of the Figma Make site at `www.faveup.app` as plain static files, with the detailed presentation replaced by the 12-slide deck from `FaveUp - Prezentacja.pdf`.

- `site/index.html` – landing with the **Dla Biznesu** / **Dla Użytkowników** views. The old hash routes keep working: `#/business-view`, `#/users-view`, and `#/prezentacja` redirects to the deck.
- `site/prezentacja/` – the deck. Desktop shows one slide at a time on a scaled 16:9 canvas (arrows, keyboard, swipe, `#3` deep links). Phones and portrait tablets get the same slides as a scrolling page. "Pobierz PDF" downloads the original PDF.
- The FaveUp film plays inside the iPhone in the business hero and on slide 2. The hero phone starts on the Aroma Café notification, plays the film in place, and returns to the notification when it ends (`site/js/phone-player.js`).
- PL is the default, written in the HTML. EN lives in the dictionaries in `site/js/landing.js` and `site/js/deck.js`; a missing English key throws on load.
- Waitlist forms post to the same Formspree form the Figma site used (`xwlezeap`), now with `source` (business-view / users-view) and `language` fields.

## Run locally

```bash
npm run dev
```

Opens `http://localhost:5180/`. No install step: the site has no dependencies.

## Deploy

Live on GitHub Pages (`clint123-ops/faveup-site`), served from the `gh-pages` branch, which holds only the contents of `site/`. After committing to `main`:

```bash
npm run deploy
```

That pushes `site/` to `gh-pages`, and Pages republishes within a minute or two. Custom domain: `www.faveup.app`. Namecheap DNS has `A @` → 185.199.108–111.153 and `CNAME www` → `clint123-ops.github.io`, and GitHub redirects `faveup.app` to `www`.

Any other static host works too, as long as it answers HTTP Range requests for the `.mp4` (Safari will not play the film otherwise).

## Assets

| File | Source |
| --- | --- |
| `assets/video/faveup-animacja.mp4` | `Fave_Up_Animacja.mp4` re-encoded to 720×1280, H.264 CRF 26, AAC 96k (25 MB → 2.7 MB) |
| `assets/FaveUp-Prezentacja.pdf` | the PDF as supplied |
| `assets/deck/*.webp` | app screens, partner logos and the contact photo cut from the PDF's 4K slide images |
| `assets/img/` | notification images from the current site, `og.png` is the current share image |
| `assets/icons.svg` | Lucide icons (ISC), regenerate with `npm run icons` after adding a name in `scripts/icons.mjs` |
| `assets/fonts/` | DM Sans (OFL), self-hosted, the typeface used in the PDF |
