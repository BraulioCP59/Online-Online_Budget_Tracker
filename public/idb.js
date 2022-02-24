const dbName = 'transactions';
let db;
const request = indexedDB.open(dbName, 1);


//handle idb error event
request.onerror = event => {
    console.log(`indexed db: An Error has Occurred:\n\n ${event.target.errorCode}`);
}

//handle idb on upgrade needed event for upgrades or object store init
request.onupgradeneeded = event => {
    db = event.target.result;

    //create new db
    const objectStore = db.createObjectStore(dbName, {autoIncrement: true});
    
    objectStore.transaction.oncomplete = event => {
        let transactionData = db.transaction([dbName], 'readwrite').objectStore(dbName);
        transactionData.foreach((transaction) => {
            console.log(`IDB Logging ALl Transactions Store: ${transaction}`);
        }) 
    }
}


//handle idb on success event
request.onsuccess = event => {
    db = event.target.result;
    console.log(`IDB Logging Success: ${db}`);
  
    navigator.onLine? flushDatabase() : console.log(`Navigator Remains Offline!`);
  };


//function for storing transaction requests when offline
const saveRecord = (record) => {
    const transactionData = db.transaction([dbName], "readwrite").objectStore(dbName);
    transactionData.add(record);
    console.log("IDB Logging: New Transaction Record Has Been Stored!");
};


//function for flushing offline transaction store when back online (recovery)
const flushDatabase = () => {
  
    let transactionData = db.transaction([dbName], "readwrite").objectStore(dbName).getAll();
    console.log("Here i am on line 49!!");
    //const getAll = store.getAll();
  
    transactionData.onsuccess = (event) => {

      if (transactionData.result.length > 0) {

        fetch("/api/transaction/bulk", {
          method: "POST",
          body: JSON.stringify(transactionData.result),
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        })
          .then((data) => data.json())
          .then((response) => {
            if (response.length !== 0) {  

              offlineTransactions = db.transaction([dbName], "readwrite").objectStore(dbName);
              offlineTransactions.clear();
              console.log("IDB Logging: Purging Transaction Data!");
            }
          });
      }
    };
  }
