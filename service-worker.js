// KILL-SWITCH SERVICE WORKER
// Este arquivo substitui qualquer Service Worker antigo que possa ter ficado
// instalado no navegador do usuário, causando cache de versões antigas do site.
// Ele se auto-desinstala e limpa todos os caches, garantindo que o navegador
// sempre busque a versão mais recente dos arquivos direto do servidor.
//
// IMPORTANTE: este SW NÃO intercepta requisições (sem "fetch" handler) e
// NÃO força recarregamento de página, para evitar loops de reload/flicker.

self.addEventListener('install', function () {
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

      // Desregistra este próprio Service Worker
      await self.registration.unregister();
    })()
  );
});
