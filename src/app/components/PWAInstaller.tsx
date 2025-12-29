'use client'

import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstaller() {
	const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
	const [showInstallButton, setShowInstallButton] = useState(false)
	const [debugInfo, setDebugInfo] = useState<string[]>([])

	const addDebug = (msg: string) => {
		console.log('🔍 PWA Debug:', msg)
		setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`])
	}

	useEffect(() => {
		addDebug('Komponent PWAInstaller załadowany')

		// Rejestruj Service Worker
		if ('serviceWorker' in navigator) {
			addDebug('Service Worker jest dostępny')
			navigator.serviceWorker
				.register('/sw.js', { scope: '/' })
				.then(registration => {
					addDebug(`✅ Service Worker zarejestrowany: ${registration.scope}`)
					console.log('✅ Service Worker zarejestrowany:', registration)
				})
				.catch(error => {
					addDebug(`❌ Błąd rejestracji SW: ${error.message}`)
					console.error('❌ Błąd rejestracji Service Worker:', error)
				})
		} else {
			addDebug('❌ Service Worker NIE jest dostępny w tej przeglądarce')
		}

		// Nasłuchuj eventu "beforeinstallprompt" (Android/Desktop)
		const handler = (e: Event) => {
			addDebug('🎉 Event beforeinstallprompt wywołany!')
			e.preventDefault()
			setDeferredPrompt(e as BeforeInstallPromptEvent)
			setShowInstallButton(true)
		}

		window.addEventListener('beforeinstallprompt', handler as EventListener)
		addDebug('Nasłuchiwanie na beforeinstallprompt włączone')

		// Sprawdź czy już zainstalowane
		if (window.matchMedia('(display-mode: standalone)').matches) {
			addDebug('✅ PWA już zainstalowane (standalone mode)')
			console.log('✅ PWA już zainstalowane')
		} else {
			addDebug('PWA nie jest zainstalowane')
		}

		// Sprawdź manifest
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.getRegistration().then(reg => {
				if (reg) {
					addDebug(`Service Worker aktywny: ${reg.active?.scriptURL}`)
				} else {
					addDebug('Service Worker nie jest zarejestrowany')
				}
			})
		}

		// Sprawdź czy manifest się ładuje
		fetch('/manifest.json')
			.then(res => {
				if (res.ok) {
					addDebug('✅ manifest.json dostępny')
					return res.json()
				} else {
					addDebug(`❌ manifest.json błąd: ${res.status}`)
				}
			})
			.then(manifest => {
				if (manifest) {
					addDebug(`Manifest: ${manifest.name}, icons: ${manifest.icons?.length || 0}`)
				}
			})
			.catch(err => {
				addDebug(`❌ Błąd ładowania manifest: ${err.message}`)
			})

		// Sprawdź czy service worker plik istnieje
		fetch('/sw.js')
			.then(res => {
				if (res.ok) {
					addDebug('✅ sw.js dostępny')
				} else {
					addDebug(`❌ sw.js błąd: ${res.status}`)
				}
			})
			.catch(err => {
				addDebug(`❌ Błąd ładowania sw.js: ${err.message}`)
			})

		return () => {
			window.removeEventListener('beforeinstallprompt', handler as EventListener)
		}
	}, [])

	const handleInstallClick = async () => {
		if (!deferredPrompt) {
			addDebug('❌ deferredPrompt jest null')
			return
		}

		addDebug('Kliknięto przycisk instalacji')
		try {
			// Pokaż prompt instalacji
			await deferredPrompt.prompt()
			addDebug('Prompt instalacji wyświetlony')

			// Czekaj na odpowiedź użytkownika
			const { outcome } = await deferredPrompt.userChoice
			addDebug(`Wynik: ${outcome}`)

			if (outcome === 'accepted') {
				console.log('✅ Użytkownik zaakceptował instalację')
				addDebug('✅ Instalacja zaakceptowana')
			} else {
				console.log('❌ Użytkownik odrzucił instalację')
				addDebug('❌ Instalacja odrzucona')
			}
		} catch (error) {
			addDebug(`Błąd podczas instalacji: ${error}`)
			console.error('Błąd instalacji:', error)
		}

		setDeferredPrompt(null)
		setShowInstallButton(false)
	}

	// Nie pokazuj przycisku na iOS (używają własnego promptu)
	if (typeof window !== 'undefined') {
		const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
		if (isIOS) {
			return (
				<div className="fixed bottom-4 left-4 right-4 z-50 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
					<p className="font-bold text-blue-900 mb-1">📱 Instalacja na iOS</p>
					<p className="text-blue-700 text-xs">
						Kliknij Share (⬆️) → "Dodaj do ekranu początkowego"
					</p>
				</div>
			)
		}
	}

	// Pokaż debug info w development
	const isDev = process.env.NODE_ENV === 'development'

	return (
		<>
			{showInstallButton && (
				<div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
					<div className="bg-white rounded-2xl shadow-2xl border border-emerald-200 p-4 flex items-center gap-3">
						<div className="flex-1">
							<p className="text-sm font-bold text-slate-900">Zainstaluj aplikację</p>
							<p className="text-xs text-slate-500">Dostęp offline i szybsze ładowanie</p>
						</div>
						<button
							onClick={handleInstallClick}
							className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap">
							Zainstaluj
						</button>
					</div>
				</div>
			)}

			{/* Debug panel - tylko w development */}
			{isDev && debugInfo.length > 0 && (
				<div className="fixed top-20 right-4 z-50 bg-black/80 text-white text-xs p-3 rounded-lg max-w-sm max-h-64 overflow-y-auto">
					<p className="font-bold mb-2">🔍 PWA Debug:</p>
					{debugInfo.slice(-10).map((info, idx) => (
						<p key={idx} className="mb-1 font-mono">{info}</p>
					))}
					{!showInstallButton && deferredPrompt === null && (
						<p className="text-yellow-400 mt-2">
							⚠️ beforeinstallprompt nie został wywołany. Sprawdź:
							<br />- Czy jest HTTPS?
							<br />- Czy manifest.json się ładuje?
							<br />- Czy service worker działa?
						</p>
					)}
				</div>
			)}
		</>
	)
}

