# SEO Audit Report

## Audit Summary

- Scope: `codebase-local full-site audit`
- Overall rating: `Good foundation, several high-impact content and freshness gaps remain`
- Score band: `Needs Improvement`
- Top 3 issues:
  - Property URLs in `sitemap.xml` still use a generic `now` timestamp instead of source update dates
  - Key indexable listing/contact/news hub pages are too thin for category/landing-page quality gates
  - News/article templates still lack strong author and update signals for E-E-A-T
- Top 3 opportunities:
  - Add real `updatedAt` support for projects, rentals, land, and apartments in sitemap/schema
  - Expand unique intro/editorial copy on `/du-an`, `/dat-nen`, `/cho-thue`, `/lien-he`, `/tin-tuc`
  - Add author/editor identity and article update transparency on news detail pages

## Findings Table

| Area | Severity | Confidence | Finding | Evidence | Fix |
|---|---|---|---|---|---|
| Sitemap freshness | Warning | Confirmed | Property detail URLs use `lastModified: now`, which weakens freshness accuracy for crawlers | In [app/sitemap.ts](/Users/hoankieudinh/Documents/codeAI/WhiteSpace/app/sitemap.ts), `/du-an/[slug]`, `/dat-nen/[slug]`, `/cho-thue/[slug]`, and `/can-ho/[slug]` all map `lastModified` to `now` | Expose backend `updatedAt` for each entity in [lib/public-api.ts](/Users/hoankieudinh/Documents/codeAI/WhiteSpace/lib/public-api.ts) and use those real timestamps in sitemap entries |
| Content quality | Warning | Confirmed | Several important hub pages are below the skill’s minimum word-count gates for category/landing pages | Local word counts: `/du-an` 280 words, `/dat-nen` 320, `/cho-thue` 325, `/lien-he` 201, `/tin-tuc` 234 via `wc -w`; quality gates require ~400+ for category/product/contact-like hubs and 600+ for landing pages | Add 200–500 words of unique editorial copy per hub page: market context, buying/renting criteria, local insights, trust signals, and internal links to priority detail pages |
| Article E-E-A-T | Warning | Confirmed | News detail pages do not show a visible author/editor identity and schema uses organization-only authorship | [app/(marketing)/tin-tuc/[slug]/page.tsx](/Users/hoankieudinh/Documents/codeAI/WhiteSpace/app/(marketing)/tin-tuc/[slug]/page.tsx) only renders category/date; [lib/seo.ts](/Users/hoankieudinh/Documents/codeAI/WhiteSpace/lib/seo.ts) builds `Article` schema with `author: Organization` and `modifiedAt: publishedAtIso` | Add visible byline/editor block, expose `updatedAt` or editorial review date, and upgrade schema to use a real `Person` or explicit editorial entity when available |
| AI / GEO readiness | Warning | Confirmed | The site has structured data, but no `llms.txt`-style discoverability file for AI retrieval workflows | `rg` over `app`, `lib`, and `components` shows no `llms.txt` route or asset; robots and sitemap exist, but no AI-specific crawl guidance | Add `/llms.txt` with site summary, key sections, canonical domain, and priority URLs for projects, land, rentals, and news |
| Canonical domain consistency | Warning | Likely | SEO base URL defaults are hardcoded and can drift from deployment if env vars are missing or mis-set | [lib/seo.ts](/Users/hoankieudinh/Documents/codeAI/WhiteSpace/lib/seo.ts) falls back to `https://batdongsanphiadong.vn`; `metadataBase`, `robots`, and `sitemap` all depend on `getSiteUrl()` | Ensure `SITE_URL` and `NEXT_PUBLIC_SITE_URL` are set in production and keep them aligned with the primary domain chosen in Vercel |
| Structured data baseline | Pass | Confirmed | Core JSON-LD coverage exists for homepage, contact, breadcrumb, article, and property pages | [app/layout.tsx](/Users/hoankieudinh/Documents/codeAI/WhiteSpace/app/layout.tsx), [app/(marketing)/lien-he/page.tsx](/Users/hoankieudinh/Documents/codeAI/WhiteSpace/app/(marketing)/lien-he/page.tsx), and detail pages use [components/shared/json-ld.tsx](/Users/hoankieudinh/Documents/codeAI/WhiteSpace/components/shared/json-ld.tsx) plus builders in [lib/seo.ts](/Users/hoankieudinh/Documents/codeAI/WhiteSpace/lib/seo.ts) | Keep schema coverage and validate live rendered output after each production deploy |
| Robots / crawl control | Pass | Confirmed | Admin and API routes are blocked from crawl in `robots.txt` | [app/robots.ts](/Users/hoankieudinh/Documents/codeAI/WhiteSpace/app/robots.ts) disallows `/dashboard/`, `/admin/`, and `/api/` | Keep this rule and validate live `robots.txt` against production hostname |

## Prioritized Action Plan

### Immediate blockers

1. Add real `updatedAt` values for property-like entities and use them in [app/sitemap.ts](/Users/hoankieudinh/Documents/codeAI/WhiteSpace/app/sitemap.ts).
2. Expand thin hub pages `/du-an`, `/dat-nen`, `/cho-thue`, `/lien-he`, and `/tin-tuc` with unique editorial content above the listing grids.
3. Add visible author/editor and true modified-date handling for news pages.

### Quick wins

1. Add `/llms.txt` to improve AI retrieval and answer-engine discoverability.
2. Set and verify `SITE_URL` and `NEXT_PUBLIC_SITE_URL` in production so canonicals, sitemap, and robots always point to the live primary domain.
3. Add stronger internal links from hub pages to featured detail pages with descriptive anchor text.

### Strategic improvements

1. Add reviewer/author entities and editorial trust signals across the news section.
2. Expose richer schema for real-estate content where appropriate, such as more specific offer/property entities beyond generic `WebPage`.
3. Run live production checks for Rich Results, PageSpeed, and broken links after the next deploy.

## Unknowns and Follow-ups

- No live fetch/PageSpeed data was collected in this local-only audit, so Core Web Vitals remain unverified.
- Rich Results eligibility was not validated against rendered production HTML.
- Broken-link, redirect-chain, and security-header checks were not run against the public domain in this environment.
