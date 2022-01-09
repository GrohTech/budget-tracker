const APP_PREFIX = 'BudgetTracker-';     
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
    "./index.html",
    "./events.html",
    "./tickets.html",
    "./schedule.html",
    "./css/styles.css",
    // "icon-72x72.png",
    // "icon-96x96.png",
    // "icon-128x128.png",
    // "icon-144x144.png",
    // "icon-152x152.png",
    // "icon-192x192.png",
    // "icon-384x384.png",
    // "icon-512x512.png",
    "./js/idb.js",
    "./js/index.js"
  ];

// Runs before window is created
self.addEventListener('install', function (e) {
    e.waitUntil(
      caches.open(CACHE_NAME).then(function (cache) {
        console.log('installing cache : ' + CACHE_NAME)
        return cache.addAll(FILES_TO_CACHE)
      })
    )
  })