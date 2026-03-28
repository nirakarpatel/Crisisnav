const CACHE_NAME = 'crisisnav-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/signin.html',
  '/signup.html',
  '/profile.html',
  '/my-crises.html',
  '/reports.html',
  '/settings.html',
  '/style.css',
  '/app.js',
  '/supabase.js',
  '/assets/logo.png'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching Assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
