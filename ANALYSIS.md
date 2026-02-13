# Network Surface Analysis & Elimination Report

## 1. Network Surfaces & Elimination Strategy

Below is the exhaustive list of browser network vectors and how this application eliminates them:

1.  **`fetch` / `XMLHttpRequest`**:
    *   **Elimination**: No code uses these APIs. The logic is strictly synchronous file reading using `FileReader` on user-selected local files.

2.  **External Scripts (`<script src="...">`)**:
    *   **Elimination**: All application logic is inlined within `index.html`. No external CDNs or libraries are referenced.

3.  **External Styles / Fonts (`<link href="...">`, `@font-face`)**:
    *   **Elimination**: Styles are inlined in `<style>`. Font-family is set to system defaults (`-apple-system`, `BlinkMacSystemFont`, etc.), ensuring no font files are requested.

4.  **Auto-loading Images (`<img src="http...">`)**:
    *   **Elimination**: The Markdown parser explicitly transforms the image syntax `![alt](url)` into inert anchor tags `<a href="url">[Image: alt]</a>`. The browser never receives an `<img>` tag with a remote `src`, preventing the automatic network request associated with image rendering.

5.  **Pre-fetching / Pre-loading (`<link rel="prefetch">`, `dns-prefetch`)**:
    *   **Elimination**: These tags are absent from the HTML.

6.  **Analytics / Telemetry**:
    *   **Elimination**: No third-party snippets (Google Analytics, etc.) are included. No "home-brewed" logging to a backend exists.

7.  **Service Worker Network Fallback**:
    *   **Elimination**: The `sw.js` uses a strict `Cache-Only` strategy. If a resource is not in the cache, it returns a 400/404. It never attempts to fetch from the network.

8.  **Manifest Icons**:
    *   **Elimination**: The manifest references local relative paths (`icon-192.png`). It does not point to remote URLs.

---

## 2. First Git Commit

**Message:**
```text
feat: initial sterile offline PWA core
```

**Body:**
```text
- Single-file architecture (index.html) containing all logic and styles.
- Zero network surface:
  - No external scripts or styles.
  - Remote images converted to text links.
  - No fetch/XHR.
- Manual service worker with strict cache-only strategy.
- No update logic (manual cache busting required).
- Offline integrity enforced.
- Deterministic behavior.
```

---

## 3. Offline Verification Checklist

Perform these steps to verify the sterile nature of the app:

1.  **Install the PWA** via Chrome (Add to Home Screen) or load `index.html` in a browser.
2.  **Open Developer Tools** (F12) > **Network** tab.
3.  Check **"Disable cache"** and set throttling to **"Offline"**.
4.  **Reload** the page.
    *   *Result*: The app should load instantly from the Service Worker cache (Status 200 from ServiceWorker).
5.  **Clear the Network Log**.
6.  **Load a Markdown file** containing remote images (e.g., `![test](https://google.com/logo.png)`).
    *   *Result*: The markdown renders. The image appears as a text link `[Image: test]`.
    *   *Verification*: **ZERO** requests appear in the Network tab. The `https://google.com/logo.png` request is never initiated.
7.  **Click the link**.
    *   *Result*: Browser attempts to navigate (this is user-initiated navigation, which fails in offline mode, but the *app* itself did not make a background request).

---

## 4. Manual Update Procedure

This app does not update itself. To push a new version:

1.  Modify the code in `index.html`.
2.  Open `sw.js`.
3.  Increment the `CACHE_NAME` constant (e.g., change `'sterile-v1'` to `'sterile-v2'`).
4.  Commit and deploy the files.
5.  **User Action Required**: The user must uninstall the PWA and reinstall it, or manually unregister the Service Worker in DevTools to see changes.

---

## 5. v2 Branching Strategy

To maintain the integrity of the `main` branch:

*   **`main`**: Strictly sterile, offline-only code. No network features allowed.
*   **`feature/network-sync`**: (Hypothetical) If users demand sync, create this isolated branch. Any network code (e.g., backup to WebDAV) lives here.
*   **Merge Policy**: Never merge `feature/network-sync` into `main`. The `main` branch remains a "clean room" implementation forever.
