// Next.js API Route dla Service Worker
// Alternatywa jeśli public/sw.js nie działa

import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
	try {
		// Spróbuj załadować z public/
		const swPath = path.join(process.cwd(), 'public', 'sw.js')
		
		if (fs.existsSync(swPath)) {
			const swContent = fs.readFileSync(swPath, 'utf-8')
			return new NextResponse(swContent, {
				headers: {
					'Content-Type': 'application/javascript',
					'Service-Worker-Allowed': '/',
				},
			})
		}

		// Fallback - inline service worker
		const inlineSW = `
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

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => {
			return cache.addAll(urlsToCache)
		})
	)
	self.skipWaiting()
})

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
	self.clients.claim()
})

self.addEventListener('fetch', event => {
	event.respondWith(
		fetch(event.request)
			.then(response => {
				const responseToCache = response.clone()
				caches.open(CACHE_NAME).then(cache => {
					cache.put(event.request, responseToCache)
				})
				return response
			})
			.catch(() => {
				return caches.match(event.request)
			})
	)
})
`

		return new NextResponse(inlineSW, {
			headers: {
				'Content-Type': 'application/javascript',
				'Service-Worker-Allowed': '/',
			},
		})
	} catch (error) {
		console.error('Error loading service worker:', error)
		return new NextResponse('Service Worker Error', { status: 500 })
	}
}

