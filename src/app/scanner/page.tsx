'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
	ScanBarcode,
	AlertTriangle,
	CheckCircle,
	XCircle,
	Loader2,
	Camera,
	X,
	ImagePlus,
	ArrowRight,
	Zap,
	Upload,
} from 'lucide-react'
import { Html5Qrcode } from 'html5-qrcode'
import { analyzeIngredients } from '@/app/fodmap_rules'

// --- TYPY ---
type AnalysisStatus = 'RED' | 'YELLOW' | 'GREEN' | 'UNKNOWN'

interface AnalysisResult {
	status: AnalysisStatus
	found: string[]
	message: string
}

interface ResultCardProps {
	analysis: AnalysisResult
	productName: string
	productBrand: string
	source: string
}

interface ResultData {
	analysis: AnalysisResult
	productName: string
	productBrand: string
	source: string
}

// --- KOMPONENT WYNIKU (Bez zmian) ---
const ResultCard = ({ analysis, productName, productBrand, source }: ResultCardProps) => {
	const { status, found, message } = analysis

	const statusConfig: Record<
		AnalysisStatus,
		{
			bg: string
			border: string
			text: string
			icon: typeof XCircle | typeof AlertTriangle | typeof CheckCircle
			title: string
			glow: string
		}
	> = {
		RED: {
			bg: 'bg-red-950/40',
			border: 'border-red-500/50',
			text: 'text-red-400',
			icon: XCircle,
			title: 'UNIKAJ (High FODMAP)',
			glow: 'shadow-[0_0_40px_-10px_rgba(239,68,68,0.5)]',
		},
		YELLOW: {
			bg: 'bg-yellow-950/40',
			border: 'border-yellow-500/50',
			text: 'text-yellow-400',
			icon: AlertTriangle,
			title: 'OSTROŻNIE',
			glow: 'shadow-[0_0_40px_-10px_rgba(234,179,8,0.5)]',
		},
		GREEN: {
			bg: 'bg-green-950/40',
			border: 'border-green-500/50',
			text: 'text-green-400',
			icon: CheckCircle,
			title: 'BEZPIECZNE',
			glow: 'shadow-[0_0_40px_-10px_rgba(34,197,94,0.5)]',
		},
		UNKNOWN: {
			bg: 'bg-slate-900/40',
			border: 'border-slate-700',
			text: 'text-slate-400',
			icon: AlertTriangle,
			title: 'Błąd danych',
			glow: '',
		},
	}

	const config = statusConfig[status] || statusConfig.UNKNOWN
	const Icon = config.icon

	return (
		<motion.div
			initial={{ opacity: 0, y: 20, scale: 0.95 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			className={`rounded-3xl border ${config.border} ${config.bg} p-6 backdrop-blur-md ${config.glow} overflow-hidden relative shadow-2xl`}>
			<div
				className={`absolute inset-0 bg-gradient-to-br from-${
					config.text.split('-')[1]
				}-500/10 to-transparent opacity-50`}
			/>

			<div className="relative z-10">
				<div className="mb-6 border-b border-white/5 pb-4 flex justify-between items-start">
					<div>
						<h3 className="text-white text-2xl font-bold leading-tight">{productName}</h3>
						<p className="text-slate-400 text-sm mt-1">{productBrand}</p>
					</div>
					{source === 'AI' && (
						<span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2 py-1 rounded border border-indigo-500/30 flex items-center gap-1">
							<Zap size={10} fill="currentColor" /> AI VISION
						</span>
					)}
				</div>

				<div className={`flex items-start gap-4 mb-6 ${config.text}`}>
					<Icon size={48} className="shrink-0 mt-1" />
					<div>
						<h4 className="text-2xl font-bold leading-none mb-2">{config.title}</h4>
						<p className="text-slate-200 text-sm leading-relaxed opacity-90">{message}</p>
					</div>
				</div>

				{found.length > 0 && (
					<div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/60">
						<p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3">Wykryte składniki:</p>
						<div className="flex flex-wrap gap-2">
							{found.map((item, index) => (
								<span
									key={index}
									className={`px-3 py-1.5 rounded-full text-xs font-bold border ${config.border} bg-slate-900 text-white capitalize shadow-sm`}>
									{item}
								</span>
							))}
						</div>
					</div>
				)}
			</div>
		</motion.div>
	)
}

export default function Home() {
	const [activeTab, setActiveTab] = useState<'scan' | 'ai-photo'>('scan')
	const [barcode, setBarcode] = useState('')

	const [loading, setLoading] = useState(false)
	const [result, setResult] = useState<ResultData | null>(null)
	const [error, setError] = useState<string | null>(null)

	// Stan dla kamery (wspólny, ale obsłużymy różnie w zależności od taba)
	const [isCameraOpen, setIsCameraOpen] = useState(false)

	// Refy
	const scannerRef = useRef<Html5Qrcode | null>(null) // Dla kodów kreskowych (Html5Qrcode)
	const videoRef = useRef<HTMLVideoElement | null>(null) // Dla AI Vision (Video element)
	const streamRef = useRef<MediaStream | null>(null) // Przechowywanie strumienia wideo

	// --- 1. SKANER KODÓW (HTML5-QRCODE) ---
	const startBarcodeScanner = () => {
		setIsCameraOpen(true)
		setResult(null)
		setError(null)
		setTimeout(() => {
			const html5QrCode = new Html5Qrcode('reader')
			scannerRef.current = html5QrCode
			html5QrCode
				.start(
					{ facingMode: 'environment' },
					{ fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
					(decodedText: string) => {
						stopBarcodeScanner()
						setBarcode(decodedText)
						handleScan(decodedText)
					},
					() => {}
				)
				.catch(() => {
					setIsCameraOpen(false)
					setError('Błąd kamery. Sprawdź uprawnienia.')
				})
		}, 100)
	}

	const stopBarcodeScanner = () => {
		if (scannerRef.current) {
			scannerRef.current
				.stop()
				.then(() => {
					if (scannerRef.current) {
						scannerRef.current.clear()
					}
					setIsCameraOpen(false)
				})
				.catch(console.error)
		} else {
			setIsCameraOpen(false)
		}
	}

	// --- 2. API: OPEN FOOD FACTS ---
	const handleScan = async (codeToScan?: string) => {
		const code = codeToScan || barcode
		if (!code) return
		setLoading(true)
		setError(null)
		setResult(null)

		try {
			const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`)
			const data = await response.json()

			if (data.status === 0) {
				setError('missing_product')
				setLoading(false)
				return
			}

			const product = data.product
			const ingredientsText =
				product.ingredients_text_pl || product.ingredients_text_en || product.ingredients_text || ''
			const analysisResult = analyzeIngredients(ingredientsText) as AnalysisResult

			setResult({
				analysis: analysisResult,
				productName: product.product_name_pl || product.product_name || 'Produkt bez nazwy',
				productBrand: product.brands || 'Nieznana marka',
				source: 'DB',
			})
		} catch {
			setError('network_error')
		} finally {
			setLoading(false)
		}
	}

	// --- 3. AI VISION CAMERA (WIDEO NA ŻYWO) ---
	const startAiCamera = async () => {
		setIsCameraOpen(true)
		setResult(null)
		setError(null)

		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: 'environment' },
			})
			streamRef.current = stream

			// Czekamy na render elementu video
			setTimeout(() => {
				if (videoRef.current) {
					videoRef.current.srcObject = stream
					videoRef.current.play()
				}
			}, 100)
		} catch (err: unknown) {
			console.error(err)
			setIsCameraOpen(false)
			setError('Nie udało się uruchomić aparatu. Sprawdź uprawnienia.')
		}
	}

	const stopAiCamera = () => {
		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop())
			streamRef.current = null
		}
		setIsCameraOpen(false)
	}

	const captureAiPhoto = () => {
		if (!videoRef.current) return

		// 1. Zrzut klatki z wideo do Canvas
		const canvas = document.createElement('canvas')
		canvas.width = videoRef.current.videoWidth
		canvas.height = videoRef.current.videoHeight
		const ctx = canvas.getContext('2d')
		if (ctx && videoRef.current) {
			ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
		}

		// 2. Konwersja do Base64
		const base64Image = canvas.toDataURL('image/jpeg')

		// 3. Zatrzymaj kamerę i wyślij do AI
		stopAiCamera()
		sendToAi(base64Image)
	}

	// --- 4. WGRYWANIE PLIKU (FALLBACK) ---
	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = () => {
			if (typeof reader.result === 'string') {
				sendToAi(reader.result)
			}
		}
	}

	// --- 5. WYSYŁKA DO AI (Wspólna funkcja) ---
	const sendToAi = async (base64Image: string) => {
		setLoading(true)
		setError(null)
		setResult(null)

		try {
			const response = await fetch('/api/analyze', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ image: base64Image }),
			})

			const aiData = await response.json()
			if (aiData.error) throw new Error(aiData.error)

			const status: AnalysisStatus =
				aiData.status === 'RED' ||
				aiData.status === 'YELLOW' ||
				aiData.status === 'GREEN' ||
				aiData.status === 'UNKNOWN'
					? aiData.status
					: 'UNKNOWN'

			setResult({
				analysis: {
					status: status,
					found: aiData.found || [],
					message: status === 'RED' ? 'AI wykryło składniki niedozwolone.' : 'AI oceniło skład jako bezpieczny.',
				},
				productName: 'Analiza ze zdjęcia',
				productBrand: 'Skan AI Vision',
				source: 'AI',
			})
		} catch (err: unknown) {
			console.error(err)
			setError('Błąd analizy AI. Spróbuj wyraźniejszego zdjęcia.')
		} finally {
			setLoading(false)
		}
	}

	// Funkcja czyszcząca przy zmianie taba
	const switchTab = (tab: 'scan' | 'ai-photo') => {
		setActiveTab(tab)
		setResult(null)
		setError(null)
		stopBarcodeScanner()
		stopAiCamera()
	}

	return (
		<main className="min-h-screen bg-[#020617] text-slate-200 p-4 pb-20 flex flex-col items-center relative overflow-x-hidden selection:bg-indigo-500/30">
			{/* TŁO */}
			<div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
				<div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
				<div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] mix-blend-screen" />
			</div>

			<div className="w-full max-w-md z-10 flex flex-col gap-6">
				<header className="text-center mt-8 mb-2">
					<h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
						Skaner{' '}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Jelita</span>
					</h1>
					<p className="text-slate-400 text-sm">Baza Danych + AI Vision</p>
				</header>

				{/* --- ZAKŁADKI --- */}
				<div className="bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2xl flex border border-white/5 shadow-lg">
					<button
						onClick={() => switchTab('scan')}
						className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
							activeTab === 'scan' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
						}`}>
						<ScanBarcode size={18} /> Kod EAN
					</button>
					<button
						onClick={() => switchTab('ai-photo')}
						className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
							activeTab === 'ai-photo' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
						}`}>
						<ImagePlus size={18} /> AI Vision
					</button>
				</div>

				{/* --- WIDOK 1: SKANER KODÓW EAN --- */}
				{activeTab === 'scan' && (
					<div className="flex flex-col gap-4">
						<AnimatePresence>
							{isCameraOpen && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: 'auto' }}
									exit={{ opacity: 0, height: 0 }}
									className="relative rounded-3xl overflow-hidden border-2 border-indigo-500 bg-black aspect-square">
									<button
										onClick={stopBarcodeScanner}
										className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full z-20">
										<X size={20} />
									</button>
									<div id="reader" className="w-full h-full"></div>
								</motion.div>
							)}
						</AnimatePresence>

						{!isCameraOpen && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-xl">
								<button
									onClick={startBarcodeScanner}
									className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl py-5 flex items-center justify-center gap-3 shadow-lg mb-6 active:scale-[0.98]">
									<Camera size={24} /> <span className="font-bold text-lg">Skanuj Kod</span>
								</button>
								<div className="flex gap-3">
									<input
										type="text"
										value={barcode}
										onChange={e => setBarcode(e.target.value)}
										placeholder="Lub wpisz kod EAN..."
										className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 text-white text-sm focus:border-indigo-500 outline-none font-mono"
									/>
									<button
										onClick={() => handleScan(undefined)}
										className="bg-slate-800 text-white rounded-xl px-5 flex items-center justify-center">
										<ArrowRight size={20} />
									</button>
								</div>
							</motion.div>
						)}
					</div>
				)}

				{/* --- WIDOK 2: AI VISION CAMERA (POPRAWIONE DLA KOMPUTERÓW) --- */}
				{activeTab === 'ai-photo' && (
					<div className="flex flex-col gap-4">
						{/* 1. OKNO KAMERY AI */}
						<AnimatePresence>
							{isCameraOpen && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: 'auto' }}
									exit={{ opacity: 0, height: 0 }}
									className="relative rounded-3xl overflow-hidden border-2 border-purple-500 bg-black aspect-[3/4] shadow-[0_0_50px_rgba(147,51,234,0.3)]">
									<video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted></video>

									{/* Przyciski sterowania */}
									<button
										onClick={stopAiCamera}
										className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full z-20 hover:bg-black/70">
										<X size={20} />
									</button>

									<div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
										<button
											onClick={captureAiPhoto}
											className="w-20 h-20 rounded-full border-4 border-white bg-white/20 flex items-center justify-center active:scale-90 transition-transform">
											<div className="w-16 h-16 bg-white rounded-full"></div>
										</button>
									</div>
									<p className="absolute bottom-24 w-full text-center text-white/80 text-sm font-medium drop-shadow-md">
										Zrób zdjęcie składu
									</p>
								</motion.div>
							)}
						</AnimatePresence>

						{/* 2. PANEL STARTOWY AI */}
						{!isCameraOpen && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-3xl border border-purple-500/30 shadow-xl">
								<div className="text-center mb-6">
									<h3 className="text-white font-bold text-lg">AI Vision</h3>
									<p className="text-slate-400 text-sm">Zrób zdjęcie składu – AI przeanalizuje etykietę w 3 sekundy.</p>
								</div>

								{/* Przycisk otwierający kamerę (VIDEO STREAM) */}
								<button
									onClick={startAiCamera}
									className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-[1.02] text-white rounded-xl py-5 font-bold flex items-center justify-center gap-3 cursor-pointer transition-all shadow-lg active:scale-[0.98] mb-4">
									<Camera size={24} />
									<span>Otwórz Aparat</span>
								</button>

								{/* Fallback: Wgrywanie pliku z dysku */}
								<div className="relative flex items-center gap-3 mb-4">
									<div className="h-px bg-slate-800 flex-1" />
									<span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">lub wgraj plik</span>
									<div className="h-px bg-slate-800 flex-1" />
								</div>

								<label className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors">
									<Upload size={18} />
									<span>Wybierz zdjęcie z galerii</span>
									<input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
								</label>
							</motion.div>
						)}
					</div>
				)}

				{/* --- WYNIKI --- */}
				<div className="min-h-[200px]">
					<AnimatePresence mode="wait">
						{loading && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="flex flex-col items-center justify-center py-12 text-slate-400">
								<Loader2 className="animate-spin mb-4 text-indigo-500" size={40} />
								<p className="text-sm font-medium animate-pulse">
									{activeTab === 'ai-photo' ? 'Wysyłam do AI...' : 'Szukam w bazie...'}
								</p>
							</motion.div>
						)}

						{/* BŁĄD: BRAK PRODUKTU -> SUGESTIA AI */}
						{error === 'missing_product' && !loading && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="bg-slate-800/80 border border-slate-700 p-8 rounded-3xl text-center">
								<AlertTriangle size={32} className="text-yellow-500 mx-auto mb-3" />
								<h3 className="text-white font-bold mb-2">Nieznany kod</h3>
								<p className="text-slate-400 text-sm mb-6">Tego produktu nie ma w bazie.</p>
								<button
									onClick={() => switchTab('ai-photo')}
									className="w-full bg-purple-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg hover:bg-purple-500 transition-all flex items-center justify-center gap-2">
									<Zap size={18} /> Przełącz na AI Vision
								</button>
							</motion.div>
						)}

						{/* INNE BŁĘDY */}
						{error && error !== 'missing_product' && !loading && (
							<div className="text-red-400 text-center p-4 bg-red-950/30 rounded-xl border border-red-500/20">
								{error}
							</div>
						)}

						{/* KARTA WYNIKU */}
						{result && !loading && !error && (
							<ResultCard
								analysis={result.analysis}
								productName={result.productName}
								productBrand={result.productBrand}
								source={result.source}
							/>
						)}
					</AnimatePresence>
				</div>
			</div>
		</main>
	)
}
