const cacheName = 'restarant-v6';
const cachePathes = [
    
    "./css/styles.css",
    "./js/dbhelper.js",
    './js/restaurant_info.js',
    './data/restaurants.json',
    "./js/main.js",
];
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(cachePathes);
        })
    )
});
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(allCaches => {
            return Promise.all(allCaches.filter(cache => cache.startsWith('restarant') && cache != cacheName)
                .map(cache => caches.delete(cache))
            )
        })
    )
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request, {ignoreSearch: true}).then(response => {
            return response || fetch(event.request).then(response => {
                return caches.open(cacheName).then(cache => {
                    cache.put(event.request, response.clone());
                    return response;
                })
            })
        })
    )
})
