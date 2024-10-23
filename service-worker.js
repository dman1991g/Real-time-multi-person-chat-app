const CACHE_NAME = 'chat-app-cache-v1';
const urlsToCache = [
  'index.html',
  'chat.html',
  'styles.css',
  'signup.css',
  'firebaseConfig.js',
  'signin.js',
  'chat.js',
  'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js',
  'https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js',
  'https://cdn.jsdelivr.net/npm/emoji-mart@latest/dist/emoji-mart.css',
  'https://cdn.jsdelivr.net/npm/emoji-mart@latest/dist/browser.js'
];

// Install the service worker and cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// Serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Update the service worker and clear old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});