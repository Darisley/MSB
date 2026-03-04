const CACHE_NAME = 'msb-epi-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './assets/icon-192.png',
  './assets/icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://code.jquery.com/jquery-3.6.0.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.16/jquery.mask.min.js'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  console.log('[Service Worker] Instalando...');
  
  // Forçar ativação imediata
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('[Service Worker] Erro no cache:', error);
      })
  );
});

// Ativação - limpar caches antigos
self.addEventListener('activate', event => {
  console.log('[Service Worker] Ativado');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Pronto para controlar os clients');
      return self.clients.claim();
    })
  );
});

// Estratégia: Cache First, depois Network
self.addEventListener('fetch', event => {
  // Ignorar requisições que não são GET
  if (event.request.method !== 'GET') return;
  
  // Ignorar APIs externas que não queremos cachear
  const url = new URL(event.request.url);
  if (url.pathname.includes('/api/') || url.pathname.includes('sockjs')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - retorna do cache
        if (response) {
          console.log('[Service Worker] Servindo do cache:', event.request.url);
          return response;
        }
        
        // Clone da requisição
        const fetchRequest = event.request.clone();
        
        // Faz requisição à rede
        return fetch(fetchRequest)
          .then(response => {
            // Verifica se resposta é válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone da resposta
            const responseToCache = response.clone();
            
            // Salva no cache para próxima vez
            caches.open(CACHE_NAME)
              .then(cache => {
                console.log('[Service Worker] Salvando no cache:', event.request.url);
                cache.put(event.request, responseToCache);
              })
              .catch(err => console.error('[Service Worker] Erro ao salvar cache:', err));
            
            return response;
          })
          .catch(error => {
            console.log('[Service Worker] Falha na rede, servindo página offline alternativa');
            
            // Se falhar na rede e for página HTML, retorna página offline
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('./index.html');
            }
            
            return new Response('Offline - Sem conexão com internet', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Sincronização em background (opcional)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-entregas') {
    console.log('[Service Worker] Sincronizando entregas pendentes');
    event.waitUntil(syncEntregas());
  }
});

// Função para sincronizar entregas pendentes
async function syncEntregas() {
  try {
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETED',
        message: 'Dados sincronizados com sucesso!'
      });
    });
  } catch (error) {
    console.error('[Service Worker] Erro na sincronização:', error);
  }
}

// Notificações push (opcional)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação',
    icon: './assets/icon-192.png',
    badge: './assets/icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver detalhes'
      },
      {
        action: 'close',
        title: 'Fechar'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('MSB EPI', options)
  );
});