// STRICT CACHE-ONLY SERVICE WORKER
// No network fallback. No background sync. No auto updates.

const CACHE_NAME = 'sterile-v1';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

self.addEventListener('install', (event) => {
    // Pre-cache core assets
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('activate', (event) => {
    // Delete old caches manually when CACHE_NAME is updated
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
    // CACHE ONLY STRATEGY
    // If it's not in the cache, it fails.
    // We intentionally do NOT use fetch(event.request) as fallback.
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                return response;
            }
            // Return 404 for anything not in cache to strictly enforce offline sandbox
            return new Response('Offline: Resource not found in sterile cache.', {
                status: 404,
                statusText: 'Not Found'
            });
        })
    );
});