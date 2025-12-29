'use client'

import { useEffect, useState } from 'react'

export function PWAInstaller() {
	const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
	const [showInstallButton, setShowInstallButton] = useState(false)

	useEffect(() => {
		// Rejestruj Service Worker
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker
				.register('/sw.js')
				.then(registration => {
					console.log('✅ Service Worker zarejestrowany:', registration)
				})
				.catch(error => {
					console.error('❌ Błąd rejestracji Service Worker:', error)
				})
		}

		// Nasłuchuj eventu "beforeinstallprompt" (Android/Desktop)
		const handler = (e: Event) => {
			e.preventDefault()
			setDeferredPrompt(e)
			setShowInstallButton(true)
		}

		window.addEventListener('beforeinstallprompt', handler)

		// Sprawdź czy już zainstalowane
		if (window.matchMedia('(display-mode: standalone)').matches) {
			console.log('✅ PWA już zainstalowane')
		}

		return () => {
			window.removeEventListener('beforeinstallprompt', handler)
		}
	}, [])

	const handleInstallClick = async () => {
		if (!deferredPrompt) return

		// Pokaż prompt instalacji
		deferredPrompt.prompt()

		// Czekaj na odpowiedź użytkownika
		const { outcome } = await deferredPrompt.userChoice

		if (outcome === 'accepted') {
			console.log('✅ Użytkownik zaakceptował instalację')
		} else {
			console.log('❌ Użytkownik odrzucił instalację')
		}

		setDeferredPrompt(null)
		setShowInstallButton(false)
	}

	// Nie pokazuj przycisku na iOS (używają własnego promptu)
	if (typeof window !== 'undefined') {
		const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
		if (isIOS) return null
	}

	if (!showInstallButton) return null

	return (
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
	)
}

