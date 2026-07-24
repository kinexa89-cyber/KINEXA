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
const VERSION = 'kinexa-v3_118';

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

// Todas las peticiones van directo a la red (nunca a caché)
self.addEventListener('fetch', (event) => {
  return; // sin intervención: el navegador maneja la request normalmente
});
