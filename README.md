# Sterile Markdown Reader

A strictly offline-only, zero-network PWA for reading Markdown files.

## Philosophy

This application is engineered to prevent any data exfiltration or external tracking. It contains no analytics, no external references, and blocks standard web vectors that trigger network requests (like auto-loading remote images).

## Features

- **Local File Processing**: Uses `FileReader` API. Data never leaves the DOM.
- **Sterile Rendering**: Markdown is parsed into sanitized HTML.
- **Image Blocking**: Image syntax `![alt](url)` is converted to inert text links `<a href="...">[Image: alt]</a>`.
- **Cache-Only**: Service Worker denies all network requests not explicitly pre-cached during install.

## Offline Verification Steps

1. Open Chrome DevTools (F12).
2. Go to the **Network** tab.
3. Check **Disable cache**.
4. Set throttling to **Offline**.
5. Reload the app. It should load successfully (Status 200 from ServiceWorker).
6. Clear the Network log.
7. Open a Markdown file containing a remote image URL (e.g., `![tracking](https://analytics.com/pixel.png)`).
8. Verify that **zero** requests are logged in the Network tab.

**Statement:** This application is intentionally designed to perform zero network requests under any condition.

## Installation

1. Host these files on a static server (or open `index.html` locally).
2. Click "Install" in the browser address bar or "Add to Home Screen".
3. Once installed, turn on Airplane Mode and launch the app.

## Update Policy

There is no auto-update mechanism. To update:
1. Developer: Change `CACHE_NAME` in `sw.js`.
2. User: Uninstall the app and Re-install.
