# Kanachur Islamic Education Trust — website (React)

The redesigned public website for kanachurims.com, built with React 18, React Router 6 and Vite 5. No UI framework: a small design system and plain CSS keep it fast.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests for search, fees, validation, chat, booking
npm run build      # production build in dist/
npm run preview    # serve the production build locally
```

Node 18 or newer is required.

## What is where

```
src/
  app/          App shell, providers and the route table (every page is lazy-loaded)
  config/       site.js — phone numbers, emails, address, social links, announcements
  content/      ALL editable content: institutions, programmes, fees, news, FAQs, tour…
  components/
    ui/         Design-system primitives: Button, Icon, Modal, Field, Accordion…
    layout/     Header (ticker, utility bar, mega menu), Footer, mobile nav, floating actions
  features/     Self-contained interactive features (search, chat, fees, tour, booking,
                apply wizard, checkout, programme compare, testimonials, home sections)
  hooks/        Reusable hooks (useForm, useFocusTrap, useInView, useHotkey…)
  lib/          Pure logic with unit tests (fuzzy search, fee maths, validators, slots, .ics)
  services/     The only code that talks to the outside world: API, payments, analytics
  pages/        One file per route; pages compose features and content
  styles/       Design tokens (light/dark), base styles, utilities, shared components
docs/           AUDIT.md (current-site audit) and ARCHITECTURE.md (design decisions)
```

## Editing content (no developer needed for most changes)

Everything visitors read lives in `src/content/*.js` and `src/config/site.js`. For example, to add a news item, add an object to `src/content/news.js`. Search, the chat assistant and the news pages pick it up automatically.

**Before launch, someone at the Trust must check these placeholders:**

| File | What to confirm |
| --- | --- |
| `src/content/fees.js` | **All fee figures are illustrative samples.** Enter the official schedule and set `isIllustrative: false`. |
| `src/content/programs.js` | Programme list, intake and eligibility for each institution (`needsReview: true`). |
| `src/content/institutions.js` | Summaries and highlights for each institution. |
| `src/config/site.js` | WhatsApp number (the live site's WhatsApp link has no number), office hours. |
| `src/content/about.js` | Leadership profiles and photos. |
| `src/pages/StudentsPage.jsx` | Student portal / ERP link and academic calendar. |

## Environment

Copy `.env.example` to `.env`. Every value is optional.

| Variable | Effect |
| --- | --- |
| `VITE_API_BASE_URL` | Where forms, bookings and payments are sent. **Empty = preview mode**: submissions stay in the visitor's browser, no money is taken, and forms show a "Preview mode" note. |
| `VITE_GA_MEASUREMENT_ID` | Turns on Google Analytics 4 (page views, searches, form steps, video plays). |
| `VITE_BASE` | Set when hosting in a subfolder, e.g. `/new/`. |

## Backend endpoints expected

All are `POST` with JSON bodies, and each should return `{ "reference": "…" }`.

`enquiries`, `applications`, `appointments`, `visits`, `newsletter`, `alumni`, `stories`, `payments/orders`, `payments/verify`

Payments must be created and verified server-side with the gateway's secret key (see `src/services/paymentService.js`). The site never collects card or bank details itself.

## Deploying

`npm run build` and upload `dist/`. Client-side routes need every unknown path to return `index.html`:

- Apache (the current host): `public/.htaccess` is included and copied into `dist/`.
- Netlify: `public/_redirects` is included.

The previous site is preserved untouched in `../legacy-site/` for reference and redirects.
