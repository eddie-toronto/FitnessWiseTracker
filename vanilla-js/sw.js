/**
 * Service Worker for FitnessWise
 * Provides offline support and background sync for workout data
 */

const CACHE_NAME = 'fitnesswise-v1';
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/styles/app.css',
  '/app.js',
  '/src/components/AppBanner.js',
  '/src/components/DayBanner.js',
  '/src/components/WorkoutBanner.js',
  '/src/services/WorkoutStateManager.js',
  '/src/services/TimerService.js',
  '/src/data/workouts.js',
  '/manifest.json'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Caching static resources');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('✅ Service Worker: Installation complete');
        self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activating');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('🗑️ Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle API requests differently
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
  } else {
    event.respondWith(handleStaticRequest(request));
  }
});

async function handleStaticRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fall back to network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    console.error('Service Worker: Fetch failed', error);
    
    // For navigation requests, return cached index.html
    if (request.mode === 'navigate') {
      return caches.match('/index.html');
    }
    
    throw error;
  }
}

async function handleApiRequest(request) {
  try {
    // Always try network first for API requests
    const networkResponse = await fetch(request);
    
    // If successful, store workout data for background sync
    if (networkResponse.ok && request.method === 'POST') {
      const url = new URL(request.url);
      if (url.pathname === '/api/sessions') {
        // Store successful session saves
        console.log('📱 Service Worker: Session saved successfully');
      }
    }
    
    return networkResponse;
    
  } catch (error) {
    console.error('Service Worker: API request failed', error);
    
    // Queue for background sync if it's a POST request
    if (request.method === 'POST') {
      await queueBackgroundSync(request);
    }
    
    // Return a meaningful error response
    return new Response(
      JSON.stringify({ error: 'Network unavailable', queued: true }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

async function queueBackgroundSync(request) {
  try {
    const requestData = {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body: await request.text(),
      timestamp: Date.now()
    };
    
    // Store in IndexedDB for background sync
    const db = await openDB();
    const transaction = db.transaction(['sync_queue'], 'readwrite');
    const store = transaction.objectStore('sync_queue');
    await store.add(requestData);
    
    console.log('📤 Service Worker: Request queued for background sync');
    
    // Register for background sync
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      self.registration.sync.register('workout-sync');
    }
    
  } catch (error) {
    console.error('Service Worker: Failed to queue request', error);
  }
}

// Background sync event
self.addEventListener('sync', (event) => {
  console.log('🔄 Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'workout-sync') {
    event.waitUntil(syncWorkoutData());
  }
});

async function syncWorkoutData() {
  try {
    console.log('🔄 Service Worker: Syncing workout data');
    
    const db = await openDB();
    const transaction = db.transaction(['sync_queue'], 'readwrite');
    const store = transaction.objectStore('sync_queue');
    const requests = await store.getAll();
    
    for (const requestData of requests) {
      try {
        const response = await fetch(requestData.url, {
          method: requestData.method,
          headers: requestData.headers,
          body: requestData.body
        });
        
        if (response.ok) {
          // Remove successfully synced request
          await store.delete(requestData.id);
          console.log('✅ Service Worker: Synced request', requestData.url);
        }
        
      } catch (error) {
        console.error('Service Worker: Sync failed for request', requestData.url, error);
      }
    }
    
    console.log('✅ Service Worker: Background sync complete');
    
  } catch (error) {
    console.error('❌ Service Worker: Background sync failed', error);
  }
}

// IndexedDB helper functions
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('FitnessWiseDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('sync_queue')) {
        const store = db.createObjectStore('sync_queue', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        store.createIndex('timestamp', 'timestamp');
      }
    };
  });
}

// Push notification handler (for future use)
self.addEventListener('push', (event) => {
  console.log('📱 Service Worker: Push notification received');
  
  const options = {
    body: 'Time for your workout! 💪',
    icon: '/manifest-icon-192.png',
    badge: '/manifest-icon-192.png',
    vibrate: [200, 100, 200],
    data: { url: '/' },
    actions: [
      {
        action: 'start-workout',
        title: 'Start Workout'
      },
      {
        action: 'dismiss',
        title: 'Later'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('FitnessWise', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('📱 Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'start-workout') {
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

console.log('🏋️ Service Worker: FitnessWise SW loaded');