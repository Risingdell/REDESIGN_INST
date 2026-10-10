# Audit of the current kanachurims.com

Audit of the home page as served on 10 Oct 2026, done before the redesign. A copy of the old site is in `../legacy-site/`.

## 1. What could not be audited from outside (needs the Trust)

| Step | Status | What is needed |
| --- | --- | --- |
| Traffic analysis | **Not done.** No analytics access. | Read-only Google Analytics / Search Console access, or 12 months of server logs. Report needed: top 20 pages, entry pages, bounce and exit rates for Admissions and Contact, top search terms. |
| Stakeholder feedback | **Not done.** | A 5-minute survey for prospective students, parents, current students, alumni and admissions staff (suggested questions below). |

The new site measures this automatically once `VITE_GA_MEASUREMENT_ID` is set. It tracks page views, site searches (including searches with no results), each application step, form completions and errors, fee-estimator use, tour views and video plays.

**Suggested survey questions**
1. What were you trying to do on our website the last time you visited?
2. Did you find it? If not, where did you get stuck?
3. What information did you have to phone or email us for?
4. Which device do you mostly use to visit the site?
5. One thing you would add or remove.

## 2. Problems found on the current home page

| # | Problem | Impact | Fixed in redesign |
| --- | --- | --- | --- |
| 1 | The page is a copy of a third-party template ("Mirrored from keenitsolutions.com… by HTTrack"). | Slow, hard to maintain, brittle. | Rebuilt from scratch. |
| 2 | Leftover pages from an unrelated school template are linked: Deepavali, Cabinet Voting, Hindi Diwas, Kindergarten, Middle School, Investiture, Green Week and others. Footer logo alt text reads "Loyola Kendriya Vidyalaya". | Confuses visitors; harms credibility and SEO. | Removed from navigation. |
| 3 | The WhatsApp button has no phone number and pre-filled Spanish text ("Hola! Quisiera más información sobre Varela 2"). | The main chat channel is broken. | Fixed (number to be confirmed). |
| 4 | Every department "VIEW MORE" link is `javascript:void(0)`. | Dead ends. | Departments link to online booking. |
| 5 | All institution cards use the same image (`1 - Copy.jpg`). The PU College and Public School links go nowhere. | Looks unfinished. | Each institution has its own page. |
| 6 | Invalid `lang="eng"`, two `<body>` tags, around 40 stylesheets and scripts, jQuery plus three carousel libraries. | Slow first load and accessibility failures. | Initial JS is about 85 KB gzipped, with each page loaded on demand. |
| 7 | An auto-opening pop-up (poster image) covers the page on every visit. | Hides content, especially on mobile. | Moved into News & events. |
| 8 | No site search, no online application or payment, no booking, and admission enquiry is a single input. | Visitors must phone for everything. | Search, apply + pay, booking, enquiry, chat. |
| 9 | Eight top-level menus with deep dropdowns, and no audience routes. | Key pages are three or more clicks away. | Five audience buckets plus audience shortcuts; all key pages in two clicks or fewer. |
| 10 | Images up to 2560 px wide served as JPEG/PNG. | Heavy on mobile data. | Re-encoded to WebP: about 720 KB total for every photo used. |

## 3. Content inventory: keep / update / delete

| Content | Decision | Notes |
| --- | --- | --- |
| Mission, vision, thought for the day | **Keep** | Copied verbatim into `content/about.js` and `config/site.js`. |
| Institution list and sub-site links (KIMS, KCOP, KCON, KIAHS, KNAMC, Pharmacy, Public School) | **Keep** | Linked from each institution page. |
| Departments (Orthopaedics, Dermatology, General Medicine, Paediatrics) | **Keep and extend** | Cardiology/Cath Lab and Emergency added (both are evidenced by the site's own videos and phone lines). |
| Hospital figures (200+ doctors, 300+ staff, 500+ rooms, 5000+ patients) | **Update** | Confirm these are current. |
| Testimonials (Saba, Fathima, Anusha) | **Keep** | Collect consent and photos; add more via the new story form. |
| YouTube videos (5) | **Keep** | Now load on click only. |
| Graduation Day 2024 poster and RGUHS rank holders | **Keep as news** | No longer a pop-up. |
| Newsletter 2025 PDF | **Keep** | Linked from News and the Students hub. |
| "Kanachur Institute of Paramedical Sciences" card | **Clarify** | Appears only on the home page with a dead link. Merge into Allied Health or give it a page. |
| School-template pages (§2, item 2) | **Delete** | Redirect to the home page or 410. |
| `CBSE_FORM_OASIS_22_23.pdf`, `Mandatory_Disclosure_2023.pdf` | **Review** | Probably template leftovers; delete unless they belong to Kanachur Public School. |
| Fees | **Create** | Not published on the current site. The new estimator ships with sample figures that must be replaced. |
