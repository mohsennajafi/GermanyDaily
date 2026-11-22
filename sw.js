/* German Daily service worker - local-first app shell + translation cache. */
const CACHE = "gd-shell-v13";
const TR_CACHE = "gd-translate-v1";
const TR_HOSTS = ["translate.googleapis.com", "api.mymemory.translated.net"];
const TR_MAX = 500;
const ASSETS = [
  "./", "./index.html", "./words.min.json", "./grammar.json",
  "./manifest.json", "./icon.svg", "./icons/icon-192.png",
  "./icons/icon-512.png", "./icons/apple-touch-icon.png",
  "./js/supabase-config.js", "./js/auth-sync.js", "./js/pwa-install.js"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE && key !== TR_CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

async function trimTranslateCache() {
  const cache = await caches.open(TR_CACHE);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - TR_MAX; i++) await cache.delete(keys[i]);
}

function isSameOrigin(url) { return url.origin === self.location.origin; }
function isShellAsset(url) {
  return /\/(index\.html|words\.min\.json|grammar\.json|manifest\.json|icon\.svg|auth-sync\.js|pwa-install\.js|supabase-config\.js|icon-192\.png|icon-512\.png|apple-touch-icon\.png)$/.test(url.pathname) || url.pathname.endsWith("/");
}

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  if (TR_HOSTS.some(host => url.hostname.includes(host))) {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) caches.open(TR_CACHE).then(cache => cache.put(request, response.clone())).then(trimTranslateCache).catch(() => {});
      return response;
    }).catch(() => caches.match(request).then(cached => cached || new Response("{}", { status: 503, statusText: "offline" }))));
    return;
  }

  // Never intercept third-party SDK, OAuth, Supabase, or AI requests.
  if (!isSameOrigin(url)) return;

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) caches.open(CACHE).then(cache => cache.put("./index.html", response.clone()));
      return response;
    }).catch(() => caches.match(request).then(cached => cached || caches.match("./index.html"))));
    return;
  }

  if (isShellAsset(url)) {
    event.respondWith(caches.match(request).then(cached => {
      const update = fetch(request).then(response => {
        if (response.ok) caches.open(CACHE).then(cache => cache.put(request, response.clone()));
        return response;
      }).catch(() => cached);
      return cached || update;
    }));
  }
});
