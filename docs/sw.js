const CACHE_NAME = 'sterile-md-pwa-v1';

const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(CORE_ASSETS);
      self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
      self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    (async () => {
      const url = new URL(req.url);

      if (url.origin !== self.location.origin) {
        return fetch(req);
      }

      // Навигация: offline-first index.html
      if (req.mode === 'navigate') {
        const cachedIndex = await caches.match('./index.html');
        try {
          return await fetch(req);
        } catch {
          if (cachedIndex) return cachedIndex;
          return new Response('Offline', { status: 200, headers: { 'Content-Type': 'text/plain' } });
        }
      }

      // assets cache-first
      if (url.pathname.includes('/assets/')) {
        const cached = await caches.match(req, { ignoreSearch: true });
        if (cached) return cached;

        const res = await fetch(req);
        if (res && res.status === 200) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, res.clone());
        }
        return res;
      }

      // прочее cache-first
      const cached = await caches.match(req, { ignoreSearch: true });
      if (cached) return cached;

      try {
        const res = await fetch(req);
        if (res && res.status === 200) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, res.clone());
        }
        return res;
      } catch {
        return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
      }
    })()
  );
});