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
})




//need to cache fetch requests if offline

//push all cached fetch requests if window online again





// const dbName = "the_name";

// var request = indexedDB.open(dbName, 2);

// request.onerror = event => {
//   // Handle errors.
// };
// request.onupgradeneeded = event => {
//   var db = event.target.result;

//   // Create an objectStore to hold information about our customers. We're
//   // going to use "ssn" as our key path because it's guaranteed to be
//   // unique - or at least that's what I was told during the kickoff meeting.
//   var objectStore = db.createObjectStore("customers", { keyPath: "ssn" });

//   // Create an index to search customers by name. We may have duplicates
//   // so we can't use a unique index.
//   objectStore.createIndex("name", "name", { unique: false });

//   // Create an index to search customers by email. We want to ensure that
//   // no two customers have the same email, so use a unique index.
//   objectStore.createIndex("email", "email", { unique: true });

//   // Use transaction oncomplete to make sure the objectStore creation is
//   // finished before adding data into it.
//   objectStore.transaction.oncomplete = event => {
//     // Store values in the newly created objectStore.
//     var customerObjectStore = db.transaction("customers", "readwrite").objectStore("customers");
//     customerData.forEach(function(customer) {
//       customerObjectStore.add(customer);
//     });
//   };
// };


//removing from the database
// var request = db.transaction(["customers"], "readwrite")
//                 .objectStore("customers")
//                 .delete("444-44-4444");
// request.onsuccess = event => {
//   // It's gone!
// };


//Getting Data from the db

// var transaction = db.transaction(["customers"]);
// var objectStore = transaction.objectStore("customers");
// var request = objectStore.get("444-44-4444");
// request.onerror = event => {
//   // Handle errors!
// };
// request.onsuccess = event => {
//   // Do something with the request.result!
//   console.log("Name for SSN 444-44-4444 is " + request.result.name);
// };


//get all data from the db
// objectStore.getAll().onsuccess = event => {
//     console.log("Got all customers: " + event.target.result);
//   };