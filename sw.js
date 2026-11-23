// Purrfect Fit service worker: lets the app install and open offline.
// Network-first, so users get updates whenever they are online; falls back to the cached copy offline.
const CACHE = 'purrfect-fit-v1';
const FILES = ['./', './PurrfectFit.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-180.png', './PurrfectFit.ico'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request)
      .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res; })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./PurrfectFit.html')))
  );
});
