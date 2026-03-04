# Sterile MD PWA

Minimal PWA Markdown reader deployed via GitHub Pages.

## Build and deploy (GitHub Pages)
Build output is `docs/`.

Commands:
- npm install
- npm run build
- commit `docs/`
- push to `main`

Tip:
- when copy-pasting commands, do not include the PowerShell prompt like `PS C:\...>`

## Offline and caching
Service Worker policy:
- same-origin GET requests use cache-first strategy with network fallback
- cross-origin requests are blocked

Precache strategy:
- core files are cached: ./ , ./index.html , ./sw.js
- build assets are discovered automatically from `index.html` (hashed Vite assets like `assets/index-*.js`, and `assets/index-*.css` if present)

## Update behavior
If the app was installed as PWA and you pushed a new version:
- close the PWA
- reopen

If a stale version persists:
- remove the PWA and install again
