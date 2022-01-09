// create variable to hold db connection
let db;
// establish connection to IndexedDB database; set to version 1
const request = indexedDB.open('budget_db', 1);

// fire event on all db interactions
request.onupgradeneeded = function(event) {
    // save reference to db 
    const db = event.target.result;
    // create object store (table) 
    db.createObjectStore('new_transaction', { autoIncrement: true });
  };

request.onsuccess = function(event) {
    // Once db is created with object store, save db in global variable
    db = event.target.result;
  
    // If app is online, run uploadTransaction()
    if (navigator.onLine) {
      uploadTransaction();
    }
  };
  
  request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
  };

  // Execute on db interactions with no internet connection
function saveRecord(record) {
    // open a new transaction with the database with read and write permissions 
    const transaction = db.transaction(['new_transaction'], 'readwrite');
  
    // access the object store for `new_pizza`
    const transactionObjectStore = transaction.objectStore('new_transaction');
  
    // add record to your store with add method
    transactionObjectStore.add(record);
  }

  function uploadTransaction() {
    // open transaction on db
    const transaction = db.transaction(['new_transaction'], 'readwrite');
  
    // access object store
    const transactionObjectStore = transaction.objectStore('new_transaction');
  
    // ger object store records; add to variable
    const getAll = transactionObjectStore.getAll();

    // If sucessful, execute function
    getAll.onsuccess = function() {
        // if stored data, send to api server
        if (getAll.result.length > 0) {
        fetch('/api/transaction', {
            method: 'POST',
            body: JSON.stringify(getAll.result),
            headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(serverResponse => {
            if (serverResponse.message) {
                throw new Error(serverResponse);
            }
            // open one more transaction
            const transaction = db.transaction(['new_transaction'], 'readwrite');
            // access transaction object store
            const transactionObjectStore = transaction.objectStore('new_transaction');
            // clear all items in your store
            transactionObjectStore.clear();

            alert('All saved transactions have been submitted!');
            })
            .catch(err => {
            console.log(err);
            });
        }
    };
  }

  // listen for app coming back online
window.addEventListener('online', uploadTransaction);
  