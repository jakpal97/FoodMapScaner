// Service Worker dla PWA
const CACHE_NAME = 'skaner-jelita-v1'
const urlsToCache = [
	'/',
	'/scanner',
	'/safe-products',
	'/manifest.json',
	'/icon-192.png',
	'/icon-512.png',
]

// Instalacja - cache'owanie zasobów
self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => {
			return cache.addAll(urlsToCache)
		})
	)
	self.skipWaiting() // Aktywuj natychmiast
})

// Aktywacja - usuwanie starych cache
self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames
					.filter(cacheName => cacheName !== CACHE_NAME)
					.map(cacheName => caches.delete(cacheName))
			)
		})
	)
	self.clients.claim() // Przejmij kontrolę nad wszystkimi klientami
})

// Fetch - strategia Network First, fallback do cache
self.addEventListener('fetch', event => {
	event.respondWith(
		fetch(event.request)
			.then(response => {
				// Klonuj odpowiedź
				const responseToCache = response.clone()
				caches.open(CACHE_NAME).then(cache => {
					cache.put(event.request, responseToCache)
				})
				return response
			})
			.catch(() => {
				// Jeśli sieć nie działa, użyj cache
				return caches.match(event.request)
			})
	)
})

