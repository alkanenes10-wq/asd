/*
 * seansapp service worker
 * ───────────────────────────────────────────────────────────────────────────
 * Elle yazıldı; build adımı veya ek paket gerektirmez.
 *
 * Strateji:
 *   • Sayfa gezintileri (navigate) → network-first, ağ yoksa önbellek, o da
 *     yoksa /offline sayfası. Böylece kullanıcı her zaman güncel sayfayı görür
 *     ama internet kesilince uygulama beyaz ekrana düşmez.
 *   • /_next/static ve ikon/font gibi sürümlü varlıklar → cache-first. Bu
 *     dosyaların adı içerik değişince değiştiği için bayat kalma riski yok.
 *   • API/POST istekleri → hiç dokunulmaz, doğrudan ağa gider.
 *
 * Sürümü değiştirmek eski önbellekleri temizler.
 */

const VERSION = "seansapp-v1";
const STATIC_CACHE = `${VERSION}-static`;
const PAGE_CACHE = `${VERSION}-pages`;
const OFFLINE_URL = "/offline";

// Kurulumda yalnızca çevrimdışı sayfası ön-belleğe alınır; gerisi kullanıldıkça
// birikir. Böylece kurulum hiçbir zaman tek bir 404 yüzünden patlamaz.
const PRECACHE = [OFFLINE_URL, "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      await Promise.allSettled(PRECACHE.map((url) => cache.add(url)));
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
          .filter((key) => !key.startsWith(VERSION))
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

// Sayfa "yeni sürüm hazır" dediğinde beklemeden devral.
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    /\.(?:css|js|woff2?|ttf|otf|png|jpe?g|svg|webp|avif|ico)$/i.test(url.pathname)
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Yalnızca aynı origin'deki GET isteklerini yönetiriz.
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Next.js'in veri/aksiyon uçlarına karışma.
  if (url.pathname.startsWith("/api/")) return;
  if (url.pathname.startsWith("/_next/image")) return;

  // ── Sayfa gezintileri: network-first ────────────────────────────────────
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          const cache = await caches.open(PAGE_CACHE);
          cache.put(request, fresh.clone());
          return fresh;
        } catch {
          const cached = await caches.match(request);
          if (cached) return cached;
          const offline = await caches.match(OFFLINE_URL);
          if (offline) return offline;
          return new Response("Çevrimdışısınız.", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        }
      })()
    );
    return;
  }

  // ── Sürümlü varlıklar: cache-first ──────────────────────────────────────
  if (isStaticAsset(url)) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        try {
          const fresh = await fetch(request);
          if (fresh.ok && fresh.type === "basic") {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, fresh.clone());
          }
          return fresh;
        } catch {
          return (
            cached ||
            new Response("", { status: 504, statusText: "Gateway Timeout" })
          );
        }
      })()
    );
  }
});
