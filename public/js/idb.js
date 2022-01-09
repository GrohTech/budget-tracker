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
  
    // check if app is online, if yes run uploadTransaction() function to send all local db data to api
    if (navigator.onLine) {
      // we haven't created this yet, but we will soon, so let's comment it out for now
      // uploadTransaction();
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
    const newTransactionObjectStore = transaction.objectStore('new_transaction');
  
    // add record to your store with add method
    newTransactionObjectStore.add(record);
  }