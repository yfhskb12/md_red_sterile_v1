# Network Surface Analysis & Elimination Report

## 1. Network Surfaces & Elimination Strategy

Below is the exhaustive list of browser network vectors and how this application eliminates them:

1.  **`fetch` / `XMLHttpRequest` / `WebSocket`**:
    *   **Elimination**: Logic is strictly synchronous/local using `FileReader`. No network APIs are present in the JS.

2.  **External Scripts & Styles**:
    *   **Elimination**: All logic and styling are inlined in `index.html`.

3.  **Binary Assets (Icons/Images)**:
    *   **Elimination**: `manifest.json` uses inline Base64 SVG Data URIs. No `.png` or `.jpg` files are requested from the server.

4.  **Auto-loading Images in Markdown**:
    *   **Elimination**: The parser explicitly transforms `![alt](url)` into `<a href="url">[Image: alt]</a>`. The browser never encounters a remote `src` attribute.

5.  **Navigation Preload / Background Sync**:
    *   **Elimination**: Not used. Service Worker is strict `Cache-Only`.

6.  **Analytics / Telemetry**:
    *   **Elimination**: No third-party scripts.

---

## 2. First Git Commit

**Message:**
```text
feat: initial sterile offline PWA core
```

**Body:**
```text
- Single-file deterministic architecture
- Inline SVG icons (Data URIs)
- Cache-only service worker
- No network surface
- Offline integrity enforced
```

---

## 3. Offline Verification Checklist

1.  **Install**: Add to Home Screen.
2.  **Setup**: Open DevTools > Network. Check "Disable cache". Set Throttling to "Offline".
3.  **Reload**: Confirm app loads (200 OK from ServiceWorker).
4.  **Test**: Open a .md file with remote images (e.g., `![test](https://example.com/img.png)`).
5.  **Verify**: Confirm the image renders as a link `[Image: test]`.
6.  **Confirm**: Ensure **ZERO** requests appear in the Network tab.

---

## 4. Manual Update Procedure

1.  Modify `index.html`.
2.  Update `CACHE_NAME` in `sw.js`.
3.  User must uninstall and reinstall the PWA.
