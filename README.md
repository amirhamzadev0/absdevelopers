# ABS Developers — Website Revamp (Phase 1, frontend)

Rebuild of https://abs-developers.com on Next.js 16 (App Router), React 19 and TypeScript.
Phase 1 renders every page from typed mock JSON through
**Model → Repository → Service → ViewModel → View**, so the MySQL/admin backend can be
plugged in later without touching pages or components. See [projectmetadata.md](projectmetadata.md)
for the full structure and rules.

## Run

```bash
npm install
cp .env.example .env.local     # APP_ORIGIN / SITE_URL
npm run dev                    # http://127.0.0.1:3120
```

| Script | What it does |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js on 127.0.0.1:3120 |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Service/repository/validation tests (`tests/`) |
| `npm run verify:routes` | Every route, legacy redirect and API contract against a running server |
| `npm run verify:nav` | Playwright: desktop nav, mobile menu, footer links, interest form, insight search (`SCREENSHOTS=dir` saves captures) |
| `npm run format` | Prettier |

`verify:nav` needs Chromium once: `npx playwright install chromium`.

## Architecture in one picture

```text
app/**/page.tsx (server) ─► viewmodels/*.viewmodel.ts ─► server/container.ts services ─► repositories (mock → mysql)
components (client)      ─► viewmodels/use*ViewModel.ts ─► utils/http-client.ts ─► /api/[operation] ─► service ─► repository
```

- Content lives in `src/data/mock/*.json`; only `src/repositories/mock/*` read it.
- Swap to MySQL in `src/server/container.ts` only.
- All styling is in `src/styles/globals.css` (design tokens in the first `:root` block).
- Old Shopify URLs (`/pages/*`, `/blogs/news/*`) permanently redirect to the new routes (`next.config.ts`).
