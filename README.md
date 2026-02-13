# Sterile Markdown Reader

**This application performs zero network requests under any condition.**

A strictly offline-only, zero-network PWA for reading Markdown files. Binary assets have been eliminated in favor of inline data URIs.

## Features

- **Zero Network Surface**: fetch, XHR, and external tags are absent.
- **Sterile Rendering**: Remote images in Markdown are converted to inert text links.
- **Self-Contained**: Icons are embedded as SVG Data URIs.
- **Cache-Only**: Service Worker rejects all non-cached requests.

## Offline Verification Steps

1.  Open Chrome DevTools (**F12**).
2.  Go to the **Network** tab.
3.  Check **"Disable cache"**.
4.  Set throttling to **"Offline"**.
5.  **Reload** the app. It must load successfully.
6.  **Clear** the Network log.
7.  **Open** a Markdown file containing a remote image (e.g., `![track](https://site.com/pixel.png)`).
8.  **Verify** that **ZERO** requests appear in the Network tab. The image should appear as a text link.

## Manual Update Policy

This application does not auto-update.

1.  Developer increments `CACHE_NAME` in `sw.js`.
2.  User must **Uninstall** and **Reinstall** the PWA to apply changes.
