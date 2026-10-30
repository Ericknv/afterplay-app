// AFTERPLAY — SERVICE WORKER (NETWORK-FIRST COM CACHE FALLBACK)
const CACHE_NAME = 'afterplay-cache-v3';
const STATIC_ASSETS = [
    './',
    './index.html',
    './style.css?v=6.3',
    './app.js?v=6.3',
    './supabaseClient.js?v=6.3',
    './manifest.json',
    './favicon.png-removebg-preview.png'
];

self.addEventListener('install', (event) => {
    // Força a nova versão do Service Worker a assumir o controle imediatamente
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
});

self.addEventListener('activate', (event) => {
    // Remove caches obsoletos imediatamente
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Ignora chamadas para Supabase, Deezer, iTunes JSONP
    if (url.origin.includes('supabase.co') || url.search.includes('callback=')) {
        return;
    }

    // Estratégia Network-First para assets do próprio app (sempre busca a versão mais recente do Vercel)
    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // Se estiver sem internet (offline), usa o cache local
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) return cachedResponse;
                    if (event.request.mode === 'navigate') {
                        return caches.match('./index.html');
                    }
                });
            })
    );
});
