// KILL-SWITCH SERVICE WORKER
// Este arquivo substitui qualquer Service Worker antigo que possa ter ficado
// instalado no navegador do usuário, causando cache de versões antigas do site.
// Ele se auto-desinstala e limpa todos os caches, garantindo que o navegador
// sempre busque a versão mais recente dos arquivos direto do servidor.

self.addEventListener('install', function () {
  // Ativa imediatamente, sem esperar as abas antigas fecharem
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    (async function () {
      // Apaga todos os caches que esse (ou um SW anterior) possa ter criado
      var cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(function (name) {
        return caches.delete(name);
      }));

      // Assume controle imediato de todas as abas abertas
      await self.clients.claim();

      // Desregistra este próprio Service Worker
      await self.registration.unregister();

      // Força o recarregamento de todas as abas abertas do site,
      // para que peguem a versão nova direto do servidor
      var allClients = await self.clients.matchAll({ type: 'window' });
      allClients.forEach(function (client) {
        client.navigate(client.url);
      });
    })()
  );
});

// Nunca serve nada do cache — sempre busca da rede
self.addEventListener('fetch', function (event) {
  event.respondWith(fetch(event.request));
});
