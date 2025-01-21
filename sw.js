const CACHE_NAME = `freemove`;

// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll([
      '/freemove/ticketdetail.html'
    ]);
  })());
});

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || Response.error();
  }
}

self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    const url = new URL(event.request.url);
    //if (url.pathname.match(/^.*ticketdetail.*/)) {
      event.respondWith(networkFirst(event.request));
    //}
  })());
});