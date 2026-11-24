# Stegmeier, Gelbart, Schwartz & Benavente — Website Redesign

A complete React redesign of [stegmeierandgelbart.com](https://www.stegmeierandgelbart.com/). The visual direction is adapted from the Veritas Legal Firm case study on Behance. All firm content comes from the live site.

**Stack:** React 19 · Vite · Tailwind CSS v4 · Framer Motion · Lucide React · React Router · Playwright

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build in dist/
node tests/qa.mjs http://localhost:5173 qa-shots/after         # layout/health checks + screenshots
node tests/interactions.mjs http://localhost:5173              # interaction tests
```

---

## 1. Audit of the existing site (verified with Playwright)

Measured at 1440 / 768 / 390px on Home, About, Practice Areas, Attorneys and Contact.

| Finding | Evidence |
|---|---|
| Almost no image alt text | 23 of 23 images on Home lack `alt`; 22 on Attorneys; 11 on About |
| Inconsistent content widths | Containers measure 1140, 1300 and 1400px on the same desktop page; 350 vs 370px on mobile |
| Very long mobile pages | Home is 15,136px tall at 390px; About is 13,136px |
| Practice areas have no pages of their own | All 12 areas sit on one 8,422px page reached through `#anchors`, so no area can be linked, shared or indexed separately |
| Cookie banner covers the hero service strip | Visible in the 1440px homepage screenshot |
| Attorney photos rely on scroll animation | In full-page captures the 14 portraits render as blank grey tiles until animated in |
| Copy errors | "The process **is** dissolving…", "Is someone **is** trying…" on Practice Areas |
| Third-party boilerplate | The Accessibility Statement ends with a copyright line for a different firm ("The Karlin Law Firm LLP") |
| Small tap targets | 5 links/buttons under 24px on each page |
| Generic visual identity | Poppins throughout, flat navy-and-white blocks, text-only practice list |

No console errors and no horizontal overflow were found on the original site, so neither is claimed as a problem.

**Not present on the original site:** client testimonials, published case results and a firm email address. These are **deliberately left out** of the redesign rather than invented.

---

## 2. Design direction

From the Veritas reference, adapted to SGSB:

- **Split "notched" header**: navigation on white tabs, left and right, with the SGSB logo centred over the hero. It becomes a solid sticky bar on scroll, with a dark utility bar above.
- **Highlight-block headline**: each line of the hero headline sits on its own ink or cream block.
- **Two-tone serif headings**: ink lead-in, then a stone or sand continuation.
- **Buttons with an attached arrow box.**
- **Dark editorial section** with sand headings and hairline-ruled feature cells.
- **Step boxes** for the client process ("Becoming a Client").
- **Brand kept recognisable**: SGSB's own logo, partner photography on the Laguna coast, the firm tagline *Strength. Guidance. Compassion. Discretion.*, and the logo's navy blue.

**Tokens** (`src/index.css`): ink `#131826`, navy `#1d3b5e`, crimson `#8c2131`, sand `#cbb48a`, cream `#f6f3ee`, stone `#75695c`. Headings use Noto Serif and body text uses Inter, both self-hosted through Fontsource.

**Layout system:** one `shell` container (`max-width: 1280px; width: calc(100% - 80px)`, dropping to 64px and 40px gutters on smaller screens) and one `section` rhythm (64/88/112px). Pages never set their own margins.

---

## 3. Pages

| Route | Content source |
|---|---|
| `/` | Home: hero, three ways we work, about, 12 practice areas, why choose SGSB, client process, partners, affiliations, insights, contact |
| `/about` | Managing partner's welcome letter, stats, 11 special distinctions, process, 1995–2026 timeline |
| `/practice-areas` | Searchable, filterable directory of all 12 areas |
| `/practice-areas/:slug` | 12 detail pages: hero, overview, legal services, approach, case team, related areas, CTA |
| `/attorneys` | Directory of all 14 attorneys, grouped by Partners / Associates / Of Counsel, with filter and name search |
| `/attorneys/:slug` | 14 full biographies (education, memberships, honours, publications, bar admissions). `/team/:slug` also works, matching the old URLs |
| `/news` | Both articles plus the 2014–2026 recognition timeline, browsable by year |
| `/news/:slug` | Article pages |
| `/contact` | Both offices, hours, maps, consultation form |
| `/privacy-policy`, `/terms-conditions`, `/disclaimer`, `/accessibility-statement` | Legal pages |

Site-wide search: the header search button, or <kbd>Ctrl</kbd>+<kbd>K</kbd>.

### Content provenance
`scripts/build-data.mjs` converts Playwright captures of the live site into `src/data/*.json` (bios, articles, legal pages, news). `src/data/firm.js` and `src/data/practices.js` hold the hand-checked firm facts and practice-area copy. All images in `public/images` are the firm's own files, recompressed by `scripts/optimize-images.mjs` (attorney portraits went from roughly 4.6MB to about 1MB in total).

### Contact form
The form uses the same fields as the original Gravity Form: name, email, phone, state, ZIP, contact preference, description and the disclaimer acknowledgement. It also has validation, accessible error messages and a honeypot.

**It does not send email on its own yet.** The original form posts to WordPress, which this static site cannot use. To make submissions real, set `VITE_CONTACT_ENDPOINT` to a form backend (Formspree, a serverless function, or a WordPress REST endpoint) and the form will POST JSON to it.

Without that variable:
- In development, submissions are logged to the console and a confirmation is shown.
- In a production build, visitors are asked to call instead.

---

## 4. Testing (Playwright)

- **`tests/qa.mjs`**: 14 routes × 4 widths (1440 / 1280 / 768 / 390) = 56 page checks. Each page is scrolled through to trigger reveals, then checked for horizontal overflow, elements poking past the viewport, broken images, console and network errors, a single H1, missing alt text, and container alignment (every `.shell` must share the same left edge and width). Full-page screenshots go to `qa-shots/after/`.
- **`tests/interactions.mjs`**: dropdowns (hover and click), dropdown navigation, sticky header, Ctrl+K search, practice filter and search, attorney filter, news year tabs, form validation and submission, a crawl of every internal link (38 unique URLs), mobile menu, and reduced-motion behaviour.

**Latest run:** 56/56 page checks with 0 warnings, and 19/19 interaction tests passing.

Container edges measured on every page: 80px / 1280px at 1440 · 40px / 1200px at 1280 · 32px / 704px at 768 · 20px / 350px at 390.

### Issues found by testing and fixed
1. Hero headline lines were clipped: clip-path on multi-line inline spans hid the wrapped lines. Animation now runs on block wrappers.
2. The crimson button's white arrow box disappeared on light backgrounds. It now has a ring.
3. Full-width mobile buttons stranded the arrow box mid-button. The label now flexes.
4. The mobile homepage was 18,155px. Compact practice rows and swipeable rows for pillars and insights bring it to 13,229px, shorter than the original's 15,136px.
5. The news year selector overflowed by 245–631px on tablet and mobile (grid `min-width: auto`). Fixed with `min-w-0`.
6. The attorney filter toolbar wrapped awkwardly, and the news year grid left an orphaned year. Both were restructured.
7. The tablet utility bar wrapped onto two lines. Long labels now appear only from 1024px up.
8. The firm-news card had a large empty area. It now lists the three latest firm news items.

Before screenshots are in `qa-shots/before/` and after screenshots in `qa-shots/after/`.

---

## 5. Deployment
`vercel.json` includes the SPA rewrite. No Vercel credentials were available on this machine, so the site has **not** been deployed. Run `npx vercel` once you are logged in.
