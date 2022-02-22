
const cacheName = 'v1';
const cacheAssets = [
    'index.html',
    'index.js',
    'styles.css',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];


//install handler
self.addEventListener('install', (event) => {
    console.log('service worker has been installed');

    //open cache and store assets
    event.waitUntil(
        caches
        .open(cacheName)
        .then(cache => {
            console.log('Service Worker: Caching Files\n\n', cache);
            cache.addAll(cacheAssets);
        })
        .then(() => self.skipWaiting())
    )
})

//activation handler
self.addEventListener('activate', async(event) => {
    console.log('service worker has been activated');
})

//fetch handler
self.addEventListener('fetch', async(event) => {
    console.log('service worker has received a fetch request!');
})




//need to cache fetch requests if offline

//push all cached fetch requests if window online again




















// self.addEventListener('install', (event) => {
//     event.waitUntil(
//       caches
//         .open(PRECACHE)
//         .then((cache) => cache.addAll(FILES_TO_CACHE))
//         .then(self.skipWaiting())
//     );
//   });
  
//   // The activate handler takes care of cleaning up old caches.
//   self.addEventListener('activate', (event) => {
//     const currentCaches = [PRECACHE, RUNTIME];
//     event.waitUntil(
//       caches
//         .keys()
//         .then((cacheNames) => {
//           return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
//         })
//         .then((cachesToDelete) => {
//           return Promise.all(
//             cachesToDelete.map((cacheToDelete) => {
//               return caches.delete(cacheToDelete);
//             })
//           );
//         })
//         .then(() => self.clients.claim())
//     );
//   });
  
//   self.addEventListener('fetch', (event) => {
//     if (event.request.url.startsWith(self.location.origin)) {
//       event.respondWith(
//         caches.match(event.request).then((cachedResponse) => {
//           if (cachedResponse) {
//             return cachedResponse;
//           }
  
//           return caches.open(RUNTIME).then((cache) => {
//             return fetch(event.request).then((response) => {
//               return cache.put(event.request, response.clone()).then(() => {
//                 return response;
//               });
//             });
//           });
//         })
//       );
//     }
//   });