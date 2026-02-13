// STRICT CACHE-ONLY SERVICE WORKER
// No network fallback. No binary assets.
// Hardened v1.2

const CACHE_NAME = 'sterile-core-v1.2';

// Only cache the shell. Icons are inline in manifest.
// Paths normalized to avoid origin/scope issues.
const ASSETS = [
    './',
    'index.html',
    'manifest.json'
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
    // HARDENING: Ignore non-GET requests to prevent any upstream signaling
    if (event.request.method !== 'GET') {
        return;
    }

    // CACHE ONLY STRATEGY
    // If it's not in the cache, it fails (404).
    // We intentionally do NOT use fetch(event.request) as fallback.
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || new Response('Offline sterile sandbox. Resource not found.', { 
                status: 404, 
                statusText: 'Not Found' 
            });
        })
    );
});