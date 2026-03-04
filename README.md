# Sterile MD PWA

Minimal PWA Markdown reader.

## Build and deploy (GitHub Pages)
Build output is `docs/`.

Commands:
- npm ci
- npm run build
- commit `docs/`
- push to `main`

## Offline and caching
Service Worker policy:
- same-origin GET requests use cache-first strategy with network fallback
- cross-origin requests are blocked

Precache targets:
- ./index.html
- ./sw.js
- ./assets/index.js
- ./assets/index.css (if present)

## Update behavior
If the app was installed as PWA and you pushed new version:
- close the PWA
- reopen
If a stale version persists:
- remove the PWA and install again
