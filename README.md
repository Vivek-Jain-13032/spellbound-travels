# Spellbound Travels

A luxury travel agency website for **Spellbound Travels** — expert international flight bookings and worldwide visa assistance. Single-page marketing site with a lead-capture enquiry form, built to match the "Journeys That Leave You Spellbound" brand design.

## Overview

- Hero, trust bar, services, why-choose-us, about, and lead-form sections on a single scrolling page
- Sticky navbar with smooth-scroll navigation, active-section highlighting, and a Google Translate widget
- A conditional, validated lead enquiry form (flight details / visa details / both) that emails the enquiry via EmailJS — no backend required
- Floating WhatsApp and Call buttons
- Fully responsive (mobile-first), with scroll-triggered fade-in animations

## Tech stack

- **Angular 19** (standalone components, no NgModules, no router — single page)
- **Tailwind CSS 3** for styling
- **@lucide/angular** for icons (brand/social icons are inline SVGs, since Lucide doesn't ship logos)
- **@emailjs/browser** for form submission (no backend/server required)
- **Google Fonts**: Playfair Display (headings), Lato (body)

## Project structure

```
src/
├── app/
│   ├── components/
│   │   ├── navbar/            Sticky nav, mobile menu, Google Translate widget
│   │   ├── hero/               Full-height hero with CTAs
│   │   ├── trust-bar/          3-item trust strip
│   │   ├── services/           Flight Booking / Visa Assistance cards
│   │   ├── why-choose-us/      4-item differentiators grid
│   │   ├── about/               Founder story, stats, CTA
│   │   ├── lead-form/          Reactive enquiry form (conditional fields)
│   │   ├── footer/              Links, contact, social
│   │   ├── floating-buttons/   WhatsApp + Call buttons
│   │   └── shared/              Toast, social-icon, app-select (custom dropdown), airport-autocomplete
│   ├── data/
│   │   └── airports.json          ~5,500 airports (IATA/name/city/country), lazy-loaded
│   ├── directives/
│   │   ├── reveal-on-scroll.directive.ts   Fade-in-up on first scroll into view
│   │   ├── scroll-spy.directive.ts         Drives navbar active-link highlighting
│   │   ├── date-picker.directive.ts        flatpickr CVA wrapper
│   │   └── phone-input.directive.ts        intl-tel-input CVA wrapper
│   ├── models/
│   │   └── lead-form.model.ts
│   ├── services/
│   │   ├── email.service.ts       EmailJS integration
│   │   ├── navigation.service.ts  Smooth-scroll + "Enquire Now" pre-select hand-off
│   │   ├── toast.service.ts       Success/error toast state
│   │   ├── airport.service.ts     Airport search backing the Flying From/To autocomplete
│   │   └── country.service.ts     Country names (Intl.DisplayNames) for Nationality/Destination Country
│   ├── utils/
│   │   └── google-translate-dom-patch.ts
│   ├── app.component.ts            Assembles all sections
│   └── app.config.ts
└── environments/
    ├── environment.ts
    └── environment.prod.ts
public/
└── assets/images/    Placeholder photo drop zone (see below)
```

## Run locally

Requires Node.js 20+ (developed against Node 22).

```bash
npm install
npm start          # ng serve — http://localhost:4200
```

Production build:

```bash
npm run build       # outputs to dist/spellbound-travels
```

Run unit tests:

```bash
npm test
```

## Configure EmailJS

The lead form sends email with [EmailJS](https://www.emailjs.com) — no backend server needed. Two emails are sent per submission: one notifying Spellbound Travels of the new lead, one confirming receipt to the enquirer.

1. Create a free EmailJS account and add an **Email Service** (e.g. Gmail), connected to `vivekjain203040@gmail.com`.
2. Create **two Email Templates**:
   - **Lead notification template** — sent to the business. Set the "To email" field to `{{to_admin_email}}`. Body can use any of the template variables below.
   - **User confirmation template** — sent back to the enquirer. Set the "To email" field to `{{to_email}}`. Write a friendly confirmation message, e.g. "Thanks {{full_name}}, we received your enquiry and will respond within 24 hours."
3. Available template variables (populated from the form): `to_admin_email`, `to_email`, `submitted_at`, `full_name`, `email`, `phone`, `service`, `travelers`, `adults`, `children`, `infants`, `preferred_contact`, `trip_type`, `journey_type`, `flying_from`, `flying_to`, `departure_date`, `return_date`, `travel_class`, `nationality`, `destination_country`, `visa_type`, `expected_travel_date`, `message`. `service` is sent as a friendly label ("Flight Booking", "Visa Assistance", or "Flight Booking and Visa Assistance"), not the raw form value. `travelers` is a pre-formatted summary (e.g. "2 Adults, 1 Child") built from the individual `adults`/`children`/`infants` counts, in case a template only wants the one line. `journey_type` is "One Way", "Round Trip", or "Multi City" — for Multi City, the form doesn't collect per-leg details, it just points the enquirer at the Message field. `phone` is a full E.164 number with country code (e.g. `+919876543210`), from the country-picker phone field described below — always includes the dial code even for the default India (+91) selection, so templates don't need to prepend one.
4. Copy your **Service ID**, both **Template IDs**, and your **Public Key** from the EmailJS dashboard into `src/environments/environment.ts` (development) and `src/environments/environment.prod.ts` (production):

```ts
export const environment = {
  production: false,
  emailjsServiceId: 'YOUR_SERVICE_ID',
  emailjsTemplateId: 'YOUR_TEMPLATE_ID',
  emailjsUserTemplateId: 'YOUR_USER_TEMPLATE_ID',
  emailjsPublicKey: 'YOUR_PUBLIC_KEY',
  contact: { /* ... */ },
};
```

Until real keys are set, submissions will fail EmailJS's send call and the form correctly shows the "Something went wrong…" error toast — this is expected, not a bug.

## Replace placeholder photos

Two photo placeholders (gold-lit striped pattern + icon) are wired up as CSS backgrounds so the layout looks correct with or without a real photo. To swap in real photography, just drop files into `public/assets/images/` with these exact names — no code changes required:

| File | Used for |
|---|---|
| `hero-bg.jpg` | Hero section background (aircraft above clouds / gilded world map) |
| `about-portrait.jpg` | About section portrait of Nimit, founder |
| `og-image.jpg` | Social share preview image (1200×630px recommended) |

The favicon is already branded — a gold "S" monogram on black, matching the site (`public/favicon.svg` is the source; `favicon.ico`/`favicon-16x16.png`/`favicon-32x32.png`/`apple-touch-icon.png`/`android-chrome-*.png` are pre-rendered from it for older browsers, iOS home screen, and Android/PWA icons — see `site.webmanifest`). To change the mark itself, edit `favicon.svg` and re-render the PNG/ICO sizes from it (any SVG-to-PNG tool works; sizes needed are 16, 32, 180, 192, 512px, plus a multi-resolution `favicon.ico` bundling the 16/32/48px renders).

## Deploy to Netlify / Vercel

Both platforms deploy static Angular builds directly from Git.

**Netlify**
1. New site from Git → pick this repo.
2. Build command: `npm run build`
3. Publish directory: `dist/spellbound-travels/browser`
4. Add a `public/_redirects` file with `/* /index.html 200` only if you later add client-side routing (not needed today — this is a single page).

**Vercel**
1. Import the repo as a new project.
2. Framework preset: **Angular**.
3. Build command: `npm run build`
4. Output directory: `dist/spellbound-travels/browser`

In both cases, set the production EmailJS values in `src/environments/environment.prod.ts` **before** building (there's no server at runtime to supply them from elsewhere, since this is a static, backend-free site).

### Connect the GoDaddy domain (spellboundtravels.co.in)

1. Deploy to Netlify or Vercel first (above) — you'll get a temporary `*.netlify.app` / `*.vercel.app` URL.
2. In that platform's dashboard, add `spellboundtravels.co.in` (and `www.spellboundtravels.co.in`) as a custom domain. It'll show you the DNS records to add.
3. In GoDaddy → **My Products → DNS** for the domain, add those records (typically an `A`/`ALIAS` record on the root `@` and a `CNAME` on `www` pointing at the platform). Remove any GoDaddy "parked page" A records first.
4. DNS propagation takes anywhere from a few minutes to ~24 hours. Both Netlify and Vercel auto-provision a free HTTPS certificate once DNS resolves — no separate SSL purchase needed.
5. Pick one of `spellboundtravels.co.in` / `www.spellboundtravels.co.in` as canonical (this repo assumes the non-`www` root) and let the platform redirect the other to it, so Google doesn't see two copies of the same site.

### Get found on Google

Going live doesn't make the site appear in search results by itself — a few one-time steps matter:

1. **Google Search Console** (search.google.com/search-console) — add the domain as a property, verify ownership (DNS TXT record via GoDaddy, or paste the `google-site-verification` meta tag GSC gives you into `src/index.html`, already stubbed in as a comment), then submit `https://spellboundtravels.co.in/sitemap.xml`.
2. **Google Business Profile** (business.google.com) — matters more than organic ranking for "travel agency near me"-style searches. Requires a physical or service-area address (not currently collected anywhere in this site's content).
3. The site already ships `public/robots.txt` (allows all crawling, points at the sitemap), `public/sitemap.xml` (single-page site, one URL), and JSON-LD structured data in `index.html` (`@type: TravelAgency`) so Google can identify the business, phone number, and service area directly from the page.
4. This is a client-rendered Angular SPA (no server-side rendering) — Googlebot can execute JavaScript and index it, but on a two-step "crawl now, render later" delay. Indexing after submission typically takes a few days to a couple of weeks; ranking for competitive terms takes much longer and depends on ongoing content/reviews/backlinks, not just being online.
5. If you swap in real values, update the domain-dependent bits in `src/index.html` (canonical link, OG/Twitter URLs, JSON-LD `url`/`logo`/`image`), `public/robots.txt`, and `public/sitemap.xml` to match — they're currently hardcoded to `https://spellboundtravels.co.in`.

## Notes

- This is intentionally a single scrolling page with no Angular Router — "Home / Services / About / Contact" are anchor sections (`#home`, `#services`, `#about`, `#contact`), not separate routes.
- The Google Translate widget loads Google's script client-side only; `src/app/utils/google-translate-dom-patch.ts` guards against a well-known conflict where Google's DOM rewrites can throw `NotFoundError` from Angular's own `removeChild`/`insertBefore` calls elsewhere on the page. Google's own widget markup is unreliable to re-skin directly (it can render different layouts or fall back to a bare native `<select>`), so the navbar pill you see (globe icon, "EN", caret) is entirely our own markup, with the real widget stretched invisibly on top so it stays clickable — see the comment in `navbar.component.html`. `includedLanguages` in `navbar.component.ts` is set to a curated list of major languages so the native language popup stays short instead of listing all ~100 languages Google supports; edit that list to add/remove languages.
- Image loading: the About portrait is a real `<img loading="lazy">` (it's below the fold, so deferring it helps). The hero photo is intentionally a CSS background rather than a lazy `<img>` — it's the largest above-the-fold element (LCP candidate), so lazy-loading it would hurt, not help, load performance. Both gracefully show a placeholder pattern until a real photo is dropped in.
- Accessibility: audited with axe-core against every major UI state (default, mobile menu open, conditional form fields, validation errors shown) — zero violations. `tsconfig.json` also enables `noUnusedLocals`/`noUnusedParameters` to keep the codebase free of dead code.
- Lead form dropdowns, date fields, and the phone field use custom components/directives (`src/app/components/shared/select.component.ts`, `src/app/directives/date-picker.directive.ts`, `src/app/directives/phone-input.directive.ts`) instead of native `<select>`/`<input type="date">`/a plain `<input type="tel">`, because an open select's option list, a date input's calendar popup, and a country-code picker are all either native browser/OS chrome no site's CSS can restyle, or (for phone) simply not something a plain input can offer. The date picker wraps [flatpickr](https://flatpickr.js.org); the phone field wraps [intl-tel-input](https://intl-tel-input.com) (searchable country list, flag + dial code prefix, libphonenumber-backed validation, full E.164 value) — both themed dark/gold in `styles.css`. The select is hand-built as a `ControlValueAccessor` so all three work as drop-in replacements with `formControlName`. Note: `intl-tel-input`'s stock CSS uses native CSS nesting (`&`) for a handful of rules that Angular's CSS bundler doesn't parse (see the "selector errors" build warning) — the affected rules (country-row hover highlight, mobile fullscreen popup layout) are restated as plain selectors in `styles.css` immediately after the theme overrides, so nothing is actually missing at runtime.
- The Flying From/To fields (`src/app/components/shared/airport-autocomplete.component.ts`) are a freeform text input with a live suggestions dropdown, backed by `src/app/services/airport.service.ts` and `src/app/data/airports.json` (~5,500 airports with an IATA code and scheduled commercial service, trimmed down to just `iata`/`name`/`city`/`country`). Matches by IATA code, city, airport name, or country. The dataset is dynamically imported on first focus rather than bundled upfront (it shows up as its own `airports-json` lazy chunk, same treatment as the phone field's libphonenumber utils), so it doesn't cost anything until someone actually opens the flight fields. Picking a suggestion fills in a canonical `"City (IATA)"` value, but typing a value that isn't in the list and never selecting a suggestion is still accepted — same as the plain text field it replaces, this isn't validated against the airport list.
  - There's no live airport API involved — airport codes/names/cities essentially never change, so this is one-time reference data, not something worth the cost of a runtime API call (a key usable from a static, backend-free site would be public and get scraped/rate-limited, and any provider that needs a hidden key would need a backend proxy, which this project deliberately doesn't have). `src/app/data/airports.json` is instead refreshed occasionally from [OurAirports](https://ourairports.com)' public-domain data (mirrored as CSV at [github.com/davidmegginson/ourairports-data](https://github.com/davidmegginson/ourairports-data)) via `npm run update-airports` (`scripts/update-airports.js`), which fetches the latest CSVs, keeps airports with a valid IATA code that either have scheduled service or are a large/medium airport, and re-writes the JSON file — review the diff and commit it like any other data update.
- The Nationality/Destination Country fields use `app-select` with its `searchable` input (an in-place filter box shown at the top of the open list, autofocused, with a "No matches" state) rather than plain text, backed by `src/app/services/country.service.ts`. Unlike the airport dataset, this needed no bundled data at all: it resolves the ISO 3166-1 country codes already shipped for the phone field (`intl-tel-input/data`) to English names via the browser's built-in `Intl.DisplayNames` API, computed once and cached. `searchable` is opt-in per `app-select` usage — the small fixed lists elsewhere (Service Needed, Travel Class, etc.) don't need it and don't set it. One side effect worth knowing: Nationality now stores a country name (e.g. "India") rather than the earlier free-text demonym (e.g. "Indian"), which avoids needing a second, separate demonym dataset and matches how most real visa forms ask for "country of nationality" anyway.
- The form has a honeypot field (`website`, visually hidden via `styles.css`, not `display:none`) — real users never see or fill it; if it has a value on submit, the app shows the normal success state but skips the actual EmailJS call, so spam bots get no signal they were caught and no email ever sends.
