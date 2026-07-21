// Kinexa · Service worker (solo red, sin caché)
// Hace que la app se pueda "instalar" como aplicación, pero siempre trae la
// versión más nueva desde internet (no guarda copias viejas que confundan).
self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', (e) => { e.respondWith(fetch(e.request)); });
