// STRICT CACHE-ONLY SERVICE WORKER
// No network fallback. No binary assets.

const CACHE_NAME = 'sterile-core-v1';

// Only cache the shell. Icons are inline in manifest.
const ASSETS = [
    './',
    './index.html',
    './manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    // CACHE ONLY.
    // If not in cache, return 404.
    // Absolutely no fetch(event.request) fallback.
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || new Response('Offline sterile sandbox.', { status: 404 });
        })
    );
});