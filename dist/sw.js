const CACHE_NAME = 'craftruv-v1.0.0';
const STATIC_CACHE = 'craftruv-static-v1';
const DYNAMIC_CACHE = 'craftruv-dynamic-v1';

// Файлы для кэширования при установке
const STATIC_FILES = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Основные ресурсы будут добавлены автоматически
];

// Файлы, которые должны всегда браться из сети
const NETWORK_FIRST = [
  '/api/',
  '/auth/',
  '/admin/'
];

// Файлы, которые можно кэшировать
const CACHE_FIRST = [
  '/images/',
  '/icons/',
  '/textures/',
  '.js',
  '.css',
  '.woff2',
  '.woff',
  '.ttf'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('Service Worker: Caching static files');
      return cache.addAll(STATIC_FILES);
    })
  );
  
  // Принудительная активация нового SW
  self.skipWaiting();
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Удаляем старые кэши
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Захватываем управление всеми клиентами
  return self.clients.claim();
});

// Перехват запросов
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Пропускаем не HTTP(S) запросы
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Стратегия для разных типов запросов
  if (shouldUseNetworkFirst(request.url)) {
    // Network First - для API и динамических данных
    event.respondWith(networkFirst(request));
  } else if (shouldUseCacheFirst(request.url)) {
    // Cache First - для статических ресурсов
    event.respondWith(cacheFirst(request));
  } else {
    // Stale While Revalidate - для HTML страниц
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Проверка, нужна ли стратегия Network First
function shouldUseNetworkFirst(url) {
  return NETWORK_FIRST.some(pattern => url.includes(pattern));
}

// Проверка, нужна ли стратегия Cache First
function shouldUseCacheFirst(url) {
  return CACHE_FIRST.some(pattern => url.includes(pattern));
}

// Network First стратегия
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Кэшируем успешный ответ
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Если сеть недоступна, пробуем кэш
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Возвращаем офлайн страницу для навигационных запросов
    if (request.mode === 'navigate') {
      return await caches.match('/offline.html') || new Response('Офлайн режим');
    }
    
    throw error;
  }
}

// Cache First стратегия
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Возвращаем placeholder для изображений
    if (request.destination === 'image') {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="14" fill="#9ca3af">Офлайн</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    
    throw error;
  }
}

// Stale While Revalidate стратегия
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Запускаем обновление в фоне
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });
  
  // Возвращаем кэшированную версию если есть, иначе ждем сеть
  return cachedResponse || fetchPromise;
}

// Обработка push уведомлений (для будущего использования)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received');
  
  const options = {
    body: event.data?.text() || 'Новое уведомление от CraftRuv',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'craftruv-notification',
    actions: [
      {
        action: 'open',
        title: 'Открыть',
        icon: '/icons/action-open.png'
      },
      {
        action: 'close',
        title: 'Закрыть',
        icon: '/icons/action-close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('CraftRuv', options)
  );
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Обработка фоновой синхронизации (для будущего использования)
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync');
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Здесь можно синхронизировать данные с сервером
  console.log('Service Worker: Performing background sync');
}

// Очистка кэша (можно вызвать из приложения)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});