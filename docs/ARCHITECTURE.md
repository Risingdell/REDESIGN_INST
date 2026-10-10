# Architecture and design decisions

## Principles

1. **Content is data.** Pages never hard-code facts. Everything comes from `src/content` and `src/config`, so moving to a CMS replaces data files, not components.
2. **Logic is pure and tested.** Search, fee maths, validation, booking slots, calendar export and the chat engine live in `src/lib` with unit tests and no React.
3. **One gateway to the outside world.** Only `src/services` makes network calls (forms, payments, analytics), which makes preview mode, testing and swapping vendors trivial.
4. **Pay for what you use.** Every page and every overlay (search, chat, enquiry drawer) is a separate lazy chunk.
5. **Mobile first and accessible by default.** Keyboard support, focus traps, labelled controls, reduced-motion support, and AA colour contrast on white.

## Request flow

```
route → pages/XPage.jsx → features/* + components/ui/* → content/* (data)
                                       ↓
                                services/* → API / payment gateway / GA4
```

## How the brief's "7 Cs" map to the build

| C | Where it lives |
| --- | --- |
| **Context** (look, layout, hierarchy) | `styles/tokens.css` design tokens for a single all-white theme (client requirement); two-tier header with ticker and mega menu; photo heroes; consistent section rhythm. |
| **Content** | `content/*` (programmes, institutions, departments, news, FAQs, videos, tour) with per-page SEO meta and schema.org data. |
| **Community** | Testimonial carousel, "Share your story" form (moderated), alumni network sign-up, social rail and links. |
| **Customisation** | "I am a…" audience switcher reshapes the hero, calls to action and quick links; shortlist, compare tray and recently viewed. All stored in the visitor's browser only (`PreferencesContext`). |
| **Communication** | Chat assistant with human hand-off, call-back drawer, enquiry form, WhatsApp, newsletter, click-to-call bar on mobile. |
| **Connection** | Institution sub-sites, RGUHS, public school, newsletter PDF, Google Maps, social networks, add-to-calendar (.ics), share buttons. |
| **Commerce** | Online application with application-fee checkout (`features/checkout`, gateway adapter in `services/paymentService.js`); hospital appointment and campus-visit booking with time slots. |

## Information architecture

- Five primary buckets: **Admissions · Academics · Hospital · Campus Life · About**.
- Audience shortcuts in the utility bar: **Prospective students · Parents · Current students · Alumni**.
- Every key task is two clicks or fewer from any page; the search palette (Ctrl/⌘ K or `/`) makes it one.
- Dedicated landing pages for the main traffic drivers: `/admissions` (steps, eligibility, fees, documents, FAQs) and `/admissions/apply`.

## Search

`lib/fuzzySearch.js` is a dependency-free engine with:
- typo tolerance (optimal string alignment distance, scaled by word length): "phisiotherapy" finds BPT/MPT;
- synonyms: "doctor" → MBBS, "physio" → physiotherapy;
- stopword removal: "do I need NEET?" is about NEET;
- weighted fields (title > keywords > body).

One index (`features/search/searchIndex.js`) covers programmes, institutions, pages, FAQs, news and departments. The chat assistant answers from the same index, so its answers stay in step with the pages.

## Performance

- Initial download is about 85 KB gzipped JS (React + router + shell). Pages are 1–6 KB each.
- WebP images with explicit dimensions and lazy loading; the hero image is preloaded.
- YouTube embeds load only on click (about 1 MB saved per video).
- No jQuery, no carousel or icon libraries (inline SVG icons).
- Long-cache headers for fingerprinted assets (`public/.htaccess`).

## Moving to a CMS (recommended next step)

The brief asks for staff to edit news and events without a developer. Recommended path:

1. Choose a headless CMS (Strapi self-hosted, Sanity, or WordPress used headless via its REST API).
2. Model the collections already defined in `src/content`: institutions, programmes, news, FAQs, departments, testimonials and tour stops.
3. Replace each `content/*.js` export with a fetch in a React Router `loader`, keeping the same object shapes so no component changes.
4. Rebuild on publish (webhook to CI) or fetch at runtime.

## Integration checklist before launch

- [ ] Official fee schedule in `content/fees.js` (currently **illustrative**).
- [ ] Programme intake and eligibility confirmed (`needsReview`).
- [ ] Backend for the form endpoints listed in the README (with spam protection and consent logging).
- [ ] Payment gateway account; server-side order creation and signature verification.
- [ ] WhatsApp number confirmed.
- [ ] GA4 property ID.
- [x] Old `.php` URLs redirect inside the app (`legacyRedirects` in `src/app/routes.jsx`).
- [ ] The same redirects as server-side 301s, for SEO.
- [ ] Accessibility review with a screen reader (NVDA) and a real-device mobile test.
