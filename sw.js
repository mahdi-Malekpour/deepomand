const cacheName = "deepomand-cache-v1";
const assets = [
  "/index.html",
  "/style.css",
  "/app.js",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// هنگام نصب، فایل‌ها رو کش می‌کنه
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(assets))
  );
});

// وقتی کاربر فایل میخواد، اول از کش نگاه می‌کنه
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});