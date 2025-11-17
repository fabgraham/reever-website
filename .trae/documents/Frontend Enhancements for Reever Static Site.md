## Goals
- Keep static hosting, improve performance, UX, accessibility, and maintainability.
- Extract inline assets, add light build tooling, optimize images, strengthen headers, and add automated checks.

## Phase 1: Structure & Asset Extraction
1. Move styles from `public/index.html` to `public/main.css`; keep `public/globals.css` for tokens.
2. Move scripts from `public/index.html` to `public/main.js` and load with `defer`.
3. Ensure identical behavior for nav, carousel, modals, forms, and cookie banner.

## Phase 2: Performance
1. Convert hero/gallery images to `webp`/`avif` and keep JPEG fallbacks.
2. Add `<picture>` with `srcset`/`sizes` for gallery images (e.g., lines around `public/index.html:1610`).
3. Preload above-the-fold assets:
   - Hero background `media/reever-live-photo.jpg` (index background at `public/index.html:357`).
   - Logo `media/reever-logo-white.jpg` used in header (`public/index.html:1442`).
4. Add asset hashing and reference hashed filenames.
5. Minify CSS/JS/HTML via a tiny build step (esbuild or similar) that outputs to `public/`.

## Phase 3: Accessibility & UX
1. Keep skip links and focus management; add automated a11y tests.
2. Ensure cookie banner buttons have consistent visible focus and keyboard handling across pages; verify dialog semantics (`public/index.html:2515`).
3. Add ARIA roles/labels review for carousel controls and dots (`public/index.html:1605–1650`).
4. Provide form error summary and strong validation messaging.

## Phase 4: Security Headers
1. Add `Content-Security-Policy` tailored to static assets and Netlify Identity.
2. Add `Strict-Transport-Security`, `Cross-Origin-Resource-Policy`, and verify existing headers in `public/_headers`.

## Phase 5: SEO
1. Update images and metadata for social cards (OG/Twitter). Consider `webp` preview.
2. Expand sitemap if new standalone pages are added; verify canonical (`public/index.html:18`).

## Phase 6: Tests & CI
1. Add Playwright tests for nav, carousel, modals, cookie consent.
2. Add Lighthouse CI and `axe-core` checks to catch regressions.
3. Add linting: `stylelint` and `html-validate`.

## Deliverables
- Externalized CSS/JS with identical features.
- Optimized, responsive images and preloads.
- Hardened headers including CSP/HSTS.
- Automated tests and CI checks.
- Documented build/run commands in `package.json`.

Confirm and I’ll implement Phase 1–2 first, then iterate through the rest.