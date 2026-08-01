// ══════════════════════════════════════════════════════════════
//  KINEXA · Service Worker
//  Estrategia: SOLO RED (network-only). No cachea la app, así que
//  siempre se ve la última versión publicada. Sirve para que la app
//  sea instalable como PWA y para poder actualizarla sin Ctrl+F5.
//
//  IMPORTANTE: cada vez que subas una versión nueva de index.html,
//  cambiá el número de VERSION de abajo. Eso hace que el navegador
//  detecte el cambio y actualice la app sola.
// ══════════════════════════════════════════════════════════════
const VERSION = 'kinexa-v3_160';

// Instalación: activar la versión nueva sin esperar
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activación: limpiar cachés viejas y tomar el control de las pestañas abiertas
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    } catch (e) {}
    await self.clients.claim();
  })());
});

// La app avisa que hay una versión nueva lista: activarla ya
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// v3_122: la página principal SIEMPRE se verifica contra el servidor.
// Sin esto, el navegador puede servir una copia guardada (hasta ~10 min)
// y la app queda mostrando la versión vieja aunque se cierre y se reabra.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.mode === 'navigate' || req.destination === 'document') {
    event.respondWith(
      fetch(req, { cache: 'no-cache' }).catch(() => fetch(req))
    );
  }
  // El resto de las peticiones siguen el comportamiento normal del navegador.
});
