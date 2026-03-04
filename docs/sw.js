/* Sterile MD PWA Service Worker
   Policy:
   - same-origin GET: cache-first with network fallback
   - cross-origin: blocked
*/

const CACHE_NAME = "sterile-md-pwa-v3";

async function discoverBuildAssets() {
  try {
    const res = await fetch("./index.html", { cache: "no-cache" });
    if (!res.ok) return [];
    const html = await res.text();

    const js = html.match(/assets\/index-[^"']+\.js/g) ?? [];
    const css = html.match(/assets\/index-[^"']+\.css/g) ?? [];

    return [...new Set([...js, ...css])].map((p) => "./" + p);
  } catch {
    return [];
  }
}

async function precache(cache) {
  const core = ["./", "./index.html", "./sw.js"];
  const discovered = await discoverBuildAssets();
  const targets = [...core, ...discovered];

  for (const url of targets) {
    try {
      const req = new Request(url, { cache: "no-cache" });
      const res = await fetch(req);
      if (res && res.ok) await cache.put(req, res.clone());
    } catch {
      // ignore
    }
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await precache(cache);
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
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

      const cached = await cache.match(req);
      if (cached) return cached;

      try {
        const res = await fetch(req);
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      } catch {
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
