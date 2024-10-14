// Define cache name and files to cache
const CACHE_NAME = 'my-pwa-cache-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/MINE.mp3',
  '/img.png',
  '/imagy.png'
  '/s1.png'
  '/s2.png'
];

// Install event - caching files
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install event');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching all: app shell and content');
        return cache.addAll(FILES_TO_CACHE);
      })
  );
});

// Activate event - cleaning up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate event');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  return self.clients.claim();
});

// Fetch event - serve cached files if offline
self.addEventListener('fetch', (event) => {
  console.log('[Service Worker] Fetch event for:', event.request.url);
  
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        console.log('[Service Worker] Serving from cache:', event.request.url);
        return response;
      }
      console.log('[Service Worker] Fetching from network:', event.request.url);
      return fetch(event.request);
    })
  );
});

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
    .then(function(registration) {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(function(error) {
      console.error('Service Worker registration failed with error:', error);
    });
  }
