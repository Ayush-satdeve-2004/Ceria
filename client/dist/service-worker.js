/**
 * Self-Destroying Service Worker
 * Used to cleanly unregister any previously installed service workers
 * and purge browser caches to ensure clients get the latest build.
 */

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(key => caches.delete(key))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll())
      .then(clients => {
        clients.forEach(client => {
          if (client.url) {
            client.navigate(client.url);
          }
        });
      })
  );
});
