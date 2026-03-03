# Sterile Markdown Reader

**This application performs zero network requests under any condition.**

A strictly offline-only, zero-network PWA for reading Markdown files. Binary assets have been eliminated in favor of inline data URIs.

## Known Good State Baseline

This version (v1.1) represents the deterministic security baseline for the application. It relies exclusively on browser-local APIs (`FileReader`, `ServiceWorker` Cache API) and contains no code capable of initiating network traffic beyond user-initiated navigation links.

## Motorola Installation Steps

1.  Serve `index.html` via a local static server or `localhost`.
2.  Open in Chrome on Android.
3.  Tap the menu and select "Add to Home Screen".
4.  Once installed, enable **Airplane Mode**.
5.  Launch the "Sterile Reader" app.
6.  Confirm functionality by opening a local `.md` file.

## Offline Verification Procedure

1.  Open Chrome DevTools (**F12**).
2.  Go to the **Network** tab.
3.  Check **"Disable cache"**.
4.  Set throttling to **"Offline"**.
5.  **Reload** the app. It must load successfully (Status 200 from ServiceWorker).
6.  **Clear** the Network log.
7.  **Open** a Markdown file containing a remote image (e.g., `![track](https://site.com/pixel.png)`).
8.  **Verify** that **ZERO** requests appear in the Network tab. The image should appear as a text link `[Image: track]`.

## Manual Update Policy

This application is engineered to **NEVER** auto-update.

To update:
1.  Developer modifies code and increments `CACHE_NAME` in `sw.js`.
2.  User must **Uninstall** the current PWA.
3.  User must **Reinstall** the PWA from the trusted source.

No background sync or polling is allowed.

## Forbidden Surfaces

The following APIs and vectors are explicitly forbidden and verified absent:

*   `fetch`
*   `XMLHttpRequest`
*   `WebSocket`
*   `EventSource`
*   `sendBeacon`
*   `background sync`
*   `push`
*   External `src` tags (scripts, images, media)
*   External `href` stylesheets
*   CDNs
*   Google APIs (Analytics, Fonts, Maps, Firebase)
*   GitHub APIs
*   Gemini APIs

## Git Verification

Run the following commands to audit the source code for forbidden tokens. All should return empty results (excluding this README):

```bash
grep -R "fetch" .
grep -R "http://" . --exclude=README.md --exclude=ANALYSIS.md
grep -R "https://" . --exclude=README.md --exclude=ANALYSIS.md
grep -R "google" .
grep -R "github" .
grep -R "socket" .
```
