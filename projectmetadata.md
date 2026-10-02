# Project Metadata — ABS Developers Website Revamp

Source of truth for structure and rules. Adapted from the PFL/HAS blueprint.
**Phase 1 is frontend only**: every page renders from typed mock JSON through
Model → Repository → Service → ViewModel → View. Keep this file updated.

---

## 1. Project identity

| Key | Value |
| --- | --- |
| Project name | `abs-developers` |
| Brand | ABS Developers |
| Business | Shariah-compliant real-estate developer (residential, commercial, mixed-use) |
| Tagline | "Building landmarks. Shaping generations." |
| Current site | https://abs-developers.com (Shopify) |
| Design source | Claude Design project "ABS-Home" v2 (header, home, footer); other pages follow its language |
| Head office | Ground Floor, Pearl One Tower, Iqbal Block, Bahria Town, Lahore |
| Contact | 03-222-333-332 (phone + WhatsApp) · info@abs-developers.com |
| Social | Instagram, Facebook, LinkedIn |
| Primary CTAs | Contact / Register Interest, Explore Developments, WhatsApp, Call |
| Dev URL | http://127.0.0.1:3120 (`APP_ORIGIN` must match) |

## 2. Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript 5 strict · one native CSS file ·
`lucide-react` · `zod` 4 · `server-only` · tests via `tsx --test` · Playwright checks · Prettier.
Node >= 20.9 (Next 16 minimum). Phase 2 adds `mysql2`, `nodemailer`, React Query (admin only).

**Read `node_modules/next/dist/docs/` before writing code.** Differences in use here:
- `params` / `searchParams` are Promises; pages typed with the global `PageProps<"/route">`,
  route handlers with `RouteContext<"/route">` (run `next typegen` if types are missing).
- `images.qualities` is required (set to `[75, 85]`); `priority` is deprecated → use `preload`.
- `<html data-scroll-behavior="smooth">` keeps instant scroll on route changes.
- `middleware` is now `proxy` (none used yet). `next lint` removed — use `npm run lint`.

## 3. Routes

| Route | Page | Data |
| --- | --- | --- |
| `/` | Home: hero → stats → project index → Register Interest → journal | `pages.json#home`, projects, insights |
| `/projects` | Portfolio with city/type filters | `projects.json` |
| `/projects/[slug]` | Hero, fact strip, overview, highlights, unit types, amenities, location, enquiry aside, interest form, related | `projects.json` |
| `/about` | Story, stats, leadership, principles, journal | `pages.json#about`, `leaders.json` |
| `/shariah-compliant` | Five principles + commitment statement | `pages.json#shariah` |
| `/insights` | Journal: debounced search + pagination (URL-synced) | `insights.json` |
| `/insights/[slug]` | Article + related | `insights.json` |
| `/live` | Live construction feed placeholder (Pearl One Capital); linked from the footer | `pages.json#live` |
| `/contact` | Phone / WhatsApp / email cards, head office, interest form (`#register-interest`) | `site.json` |
| `/privacy-policy` | Privacy policy | `pages.json#privacy` |
| `/api/[operation]`, `/api/health` | Named-operation dispatcher, liveness | — |

Project slugs: burj-quaid, abs-executive, abs-central, pearl-one-courtyard-1/-2/-3,
pearl-one-premium, pearl-one-capital, sialkot-central, pearl-one-royal,
abs-mall-residency-1/-2, pearl-one-tower.

**Legacy redirects (308)** in `next.config.ts`: `/pages/all-projects`, `/pages/about`,
`/pages/shariah-compliant`, `/pages/live`, `/pages/contact`, `/blogs/news[/:slug]`, and every
old project URL (`/pages/abs-executive-y` → `/projects/abs-executive`, etc.).

## 4. `src/` structure

```text
app/            Thin routes, layout, not-found, robots.ts, sitemap.ts, api/
components/     Presentation only — layout/, branding/, home/, projects/, insights/, about/,
                shariah/, contact/, live/, forms/, content/RichText, seo/JsonLd, ui/
config/         navigation.ts, site.ts (logos, OG image), seo.ts (per-route titles)
data/mock/      site, pages, projects, insights, leaders (.json)
hooks/          useDebounce, useNavigation, useScrollReveal, useCountUp
lib/seo.ts      buildMetadata + JSON-LD (RealEstateAgent, BreadcrumbList, Article, ApartmentComplex/Place)
models/         Types only: content, project, insight, leader, site, page, submission, query
repositories/   contracts.ts + mock/* (structuredClone on every read; submissions in-memory, max 1,000)
server/         container.ts (composition root), http/operations.ts, http/origin.ts
services/       project, insight, leader, page, submission (+ Zod schemas)
styles/         globals.css — ALL styling
utils/          http-client.ts (apiRequest), format.ts
viewmodels/     Server: home, project, insight, page, layout (React cache)
                Client: useInterestViewModel, useInsightListViewModel, useProjectFilterViewModel
```

## 5. Architecture rules

1. Route files are thin: read params → viewmodel → `notFound()` → render.
2. Server pages never fetch their own API; HTTP is for client interactions only.
3. Components are presentation; client state lives in `use*ViewModel` hooks.
4. Services depend on `repositories/contracts.ts`, never on adapters.
5. Only `server/container.ts` constructs adapters.
6. Only repositories import `src/data/**`.
7. Zod validates all untrusted input (services + API query params).
8. One dispatcher: `{ data }` on success, `{ error: { message, fields? } }` with 400/403/404/413/500.
9. POSTs require `Origin === APP_ORIGIN` (403 otherwise).
10. `import "server-only"` in `server/**`, `lib/seo.ts` and server viewmodels. Services stay
    free of it so tests can import them.
11. Models are types only.
12. Styling only in `globals.css`, tokens in the first `:root`; respect `prefers-reduced-motion`.
    Scroll-reveal styles are scoped to `.js` so content is visible without JavaScript.
13. Local assets only (`public/fonts`, `public/branding`, `public/assets`), WebP sources,
    `next/image` with `sizes` and meaningful `alt`.
14. Named exports except where Next.js requires defaults. No `.jsx`.
15. No secrets client-side.

## 6. API operations

```text
GET  /api/getProjectList?category=&city=     GET /api/getProjectBySlug?slug=
GET  /api/getInsightList?search=&page=&pageSize=   GET /api/getInsightBySlug?slug=
POST /api/submitInterest   (firstName, lastName, email, phone, whatsapp,
                            unitType: residential|commercial|not-sure,
                            project: <slug>|other, message?, consent: true)
GET  /api/health
```

## 7. Design system

Source: Claude Design project "ABS-Home" (v2 — light, rounded). Tokens: ink `#15131C`, gold `#C9A66B`
(light `#E7C98A`, soft `#D9BD86`, deep `#8A6A2E`, tint `#F1E8D4`), ivory background `#F7F5F1`,
white cards, footer `#0B0D0C`, form fields `#0F1F1A`. Headings in Sora (600–800), body in Inter
(400–700), both self-hosted variable fonts in `public/fonts`. Pill buttons and nav (100px radius),
20px cards, 32px dark panels (`.section--dark` renders as an inset rounded panel), 12px fields,
diagonal-corner clipped hero images with a tilted stat badge, footer wordmark. 1280px container,
28px gutter. Breakpoints: 991px (nav → menu, heroes stack), 767px, 479px.

## 8. Verification

`npm run typecheck` · `npm test` (18 tests) · `npm run build` · `npm run verify:routes`
(pages, 404s, redirects, API 400/403/404) · `npm run verify:nav` (Playwright).

## 9. Phase 2 plug-in points (not built)

MySQL pool `server/database/mysql.ts`, `repositories/mysql/*` implementing `contracts.ts`,
swap in `server/container.ts`; migrations in `database/`; admin CMS under `app/admin/**`;
email notifications for interest submissions; live camera embed in `components/live/LiveFeed`;
deploy configs in `deploy/`. None of these require changes to `app/**/page.tsx` or `components/**`.

## 10. Content notes

Project facts, unit sizes, amenities and copy come from the live site (October 2026). Where the
live site publishes no figure (for example unit sizes for most towers), the field is left empty
and the UI hides that section. Insight bodies are short summaries of the live articles' openings;
replace them with full articles when the CMS lands.
