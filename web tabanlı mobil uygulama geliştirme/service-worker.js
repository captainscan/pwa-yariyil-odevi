const CACHE_VERSION = "pettime-v2";
const APP_SHELL = [
    "index.html",
    "products.html",
    "detail.html",
    "about.html",
    "contact.html",
    "favorites.html",
    "offline.html",
    "manifest.json",
    "assets/css/styles.css",
    "js/app.js",
    "js/api.js",
    "js/home.js",
    "js/products.js",
    "js/detail.js",
    "js/contact.js",
    "js/favorites.js",
    "data/sample.json"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL))
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

function isHTML(req) {
    return req.headers.get("accept")?.includes("text/html");
}

self.addEventListener("fetch", (event) => {
    const req = event.request;
    const url = new URL(req.url);

    // API: network-first, fallback to cache
    if (url.origin.includes("dog.ceo")) {
        event.respondWith(
            fetch(req)
                .then((res) => {
                    const copy = res.clone();
                    caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
                    return res;
                })
                .catch(() => caches.match(req))
        );
        return;
    }

    // Navigations: cache-first, offline fallback
    if (req.mode === "navigate" || isHTML(req)) {
        event.respondWith(
            caches.match(req).then((cached) => cached || fetch(req).catch(() => caches.match("offline.html")))
        );
        return;
    }

    // Static assets: cache-first
    event.respondWith(
        caches.match(req).then((cached) => cached || fetch(req))
    );
});
