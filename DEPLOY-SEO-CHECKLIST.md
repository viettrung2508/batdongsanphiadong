# Deploy SEO Checklist

## Canonical host

- Primary domain should be `https://batdongsanphiadong.vn`
- `https://www.batdongsanphiadong.vn/*` must `301` to `https://batdongsanphiadong.vn/*`
- In Vercel, set apex domain as primary and remove any conflicting redirect to `www`

## Environment variables

- `NEXT_PUBLIC_SITE_URL=https://batdongsanphiadong.vn`
- `SITE_URL=https://batdongsanphiadong.vn`
- `NEXT_PUBLIC_BACKEND_URL=<production backend url>`
- `BACKEND_URL=<production backend url>`

## Post-deploy checks

1. Open `/`, `/dat-nen`, `/cho-thue`, `/lien-he`, and one `/tin-tuc/[slug]` page and verify page-specific title and canonical.
2. Confirm homepage contains `application/ld+json` for `WebSite`, `Organization`, and `LocalBusiness`.
3. Confirm article pages contain `Article` and `BreadcrumbList`.
4. Confirm `robots.txt` and `sitemap.xml` use non-`www`.
5. Confirm `curl -I https://batdongsanphiadong.vn/` no longer redirects to `www`.
