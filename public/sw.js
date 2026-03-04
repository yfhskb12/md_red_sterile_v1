/* Sterile MD PWA Service Worker
   Policy:
   - same-origin GET: cache-first with network fallback
   - cross-origin: blocked
*/

const CACHE_NAME = "sterile-md-pwa-v2";

// Precache list uses stable filenames from vite.config.ts
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./sw.js",
  "./assets/index.js",
  "./assets/index.css",
];

async function precacheBestEffort(cache) {
  for (const url of CORE_ASSETS) {
    try {
      const req = new Request(url, { cache: "no-cache" });
      const res = await fetch(req);
      if (res && res.ok) {
        await cache.put(req, res.clone());
      }
    } catch (e) {
      // ignore missing assets, keep install resilient
    }
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await precacheBestEffort(cache);
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // only handle GET
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // block cross-origin
  if (url.origin !== self.location.origin) {
    event.respondWith(
      new Response("Blocked", {
        status: 403,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      })
    );
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // cache-first
      const cached = await cache.match(req);
      if (cached) return cached;

      // network fallback
      try {
        const res = await fetch(req);
        if (res && res.ok) {
          cache.put(req, res.clone());
        }
        return res;
      } catch (e) {
        // offline fallback: try index for navigations
        if (req.mode === "navigate") {
          const fallback = await cache.match("./index.html");
          if (fallback) return fallback;
        }
        return new Response("Offline", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }
    })()
  );
});
