const CACHE_NAME = 'janghak-punchlist-202606050214';
const ASSETS = [
  '/quality-inspection/',
  '/quality-inspection/index.html',
  '/quality-inspection/manifest.json',
  '/quality-inspection/icons/icon-192x192.png',
  '/quality-inspection/icons/icon-512x512.png'
];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => {
    return self.clients.matchAll({ type: 'window' }).then(clients => { clients.forEach(c => c.postMessage({ type: 'SW_UPDATED' })); });
  }));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(cached => {
    if (cached) return cached;
    return fetch(e.request).then(res => {
      if (!res || res.status !== 200 || res.type !== 'basic') return res;
      const clone = res.clone();
      caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
      return res;
    }).catch(() => caches.match('/quality-inspection/index.html'));
  }));
});
