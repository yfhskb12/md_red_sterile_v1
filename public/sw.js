// public/sw.js
// STRICT CACHE-ONLY SERVICE WORKER
// No network fallback. No telemetry. No runtime caching.
// Hardened v1.3 (adds real PNG icons + GH Pages subpath safety)

const CACHE_NAME = 'sterile-core-v1.3';

// Normalize base path (important for GitHub Pages: /repo-name/)
const BASE_PATH = new URL(self.registration.scope).pathname; // e.g. "/md_red_sterile_v1/"

// Cache ONLY app shell + local icons
const ASSETS = [
  '',
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-192-maskable.png',
  'icon-512.png',
  'icon-512-maskable.png'
].map((p) => new URL(p, self.registration.scope).toString());

function isCacheableRequest(req) {
  if (req.method !== 'GET') return false;

  const url = new URL(req.url);

  // Only our origin
  if (url.origin !== self.location.origin) return false;

  // Only within our scope
  if (!url.pathname.startsWith(BASE_PATH)) return false;

  return true;
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  if (!isCacheableRequest(req)) return;

  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((res) => {
      if (res) return res;

      return new Response('Offline sterile sandbox. Resource not found.', {
        status: 404,
        statusText: 'Not Found',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    })
  );
});