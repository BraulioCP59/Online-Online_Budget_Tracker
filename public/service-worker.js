const dbName = 'transactionStore';
const cacheName = 'v1';



//install handler
self.addEventListener('install', (event) => {
    console.log('service worker has been installed');
})

//activation handler
self.addEventListener('activate', (event) => {
    console.log('service worker has been activated');

    //remove unwanted caches
    event.waitUntil(
        caches.keys()
        .then(cacheNames =>{
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache !== cacheName)
                    {
                        console.log('Service Worker: Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            )
        })
    )
})

//fetch handler
self.addEventListener('fetch', (event) => {
    if(! event.request.url.includes('/api/'))
    {
        console.log('Service Worker: Fetching');

        event.respondWith(
            fetch(event.request)
            .then((response) => {
                //make a copy of the response
                const responseCopy = response.clone();

                //open the cache and store the copy
                caches
                .open(cacheName)
                .then(cache => {
                    cache.put(event.request, responseCopy);
                });
                return response;
            })
            .catch((err) => {
                console.log('Service Worker: Recovering Assets from cache');
                caches.match(event.request)
                .then(response => response);               
            })
        )
    }
})
