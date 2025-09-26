self.addEventListener("install", (event) => {
  console.log("✅ Service Worker نصب شد");
  event.waitUntil(
    caches.open("deepomand-cache").then((cache) => {
      return cache.addAll([
        "./",
        "./index.html",
        "./script.js",
        "./style.css",
        "./manifest.json",
        "./icons/icon-192.png",
        "./icons/icon-512.png"
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
