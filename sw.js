// A unique name for the cache
const CACHE_NAME = 'ilm-companion-cache-v1';
// The list of files to be cached on install
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx',
  '/manifest.json'
];

// Install event: Fires when the service worker is first installed.
self.addEventListener('install', (event) => {
  // waitUntil() ensures the service worker doesn't install until the code inside has successfully completed.
  event.waitUntil(
    // Open a cache by name.
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Add all specified URLs to the cache.
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Activate event: Fires when the service worker is activated.
self.addEventListener('activate', (event) => {
  // This event is a good place to clean up old caches.
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // If a cache's name is not the current one, delete it.
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Ensures that the newly installed service worker takes control of the page immediately.
  return self.clients.claim();
});

// Fetch event: Fires for every network request made by the page.
self.addEventListener('fetch', (event) => {
  // We only want to cache GET requests. Other requests (e.g., POST to an API) should pass through.
  if (event.request.method !== 'GET') {
    return;
  }

  // respondWith() hijacks the request and lets us provide our own response.
  event.respondWith(
    // Check the cache for a matching request.
    caches.match(event.request)
      .then((response) => {
        // If a response is found in the cache, return it.
        if (response) {
          return response;
        }

        // If not in cache, clone the request because it's a one-time use stream.
        const fetchRequest = event.request.clone();

        // Fetch the request from the network.
        return fetch(fetchRequest).then(
          (networkResponse) => {
            // Check if we received a valid response.
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }
            
            // Clone the response because it's also a one-time use stream.
            const responseToCache = networkResponse.clone();

            // Open the cache and add the new response to it for future offline use.
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            // Return the response from the network.
            return networkResponse;
          }
        );
      })
  );
});
