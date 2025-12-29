'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
	ScanBarcode,
	AlertTriangle,
	CheckCircle,
	XCircle,
	Loader2,
	Camera,
	X,
	ArrowLeft,
	Zap,
	Upload,
	Leaf,
	Lightbulb,
} from 'lucide-react'
import { Html5Qrcode } from 'html5-qrcode'
import { analyzeIngredients, getIngredientDetails } from '@/app/fodmap_analyzer'
import { type IngredientDetails } from '@/app/fodmap_database'
import { IngredientModal } from '@/app/components/IngredientModal'
import { LucideIcon } from 'lucide-react'

// --- FUNKCJA KOMPRESJI (Wymagana dla AI) ---
const compressImage = (base64Str: string, maxWidth = 1024, quality = 0.7): Promise<string> => {
	return new Promise(resolve => {
		if (typeof window === 'undefined') {
			resolve(base64Str)
			return
		}
		const img = new Image()
		img.src = base64Str
		img.onload = () => {
			const canvas = document.createElement('canvas')
			let width = img.width
			let height = img.height
			if (width > maxWidth) {
				height = Math.round((height * maxWidth) / width)
				width = maxWidth
			}
			canvas.width = width
			canvas.height = height
			const ctx = canvas.getContext('2d')
			ctx?.drawImage(img, 0, 0, width, height)
			resolve(canvas.toDataURL('image/jpeg', quality))
		}
		img.onerror = () => resolve(base64Str)
	})
}

// --- TYPY ---
type AnalysisStatus = 'RED' | 'YELLOW' | 'GREEN' | 'UNKNOWN'

interface AnalysisResult {
	status: AnalysisStatus
	found: string[]
	message: string
	alternatives?: string[]
	score?: number
	confidence?: number
}

interface ResultData {
	analysis: AnalysisResult
	productName: string
	productBrand: string
	source: string
}

// --- KOMPONENT WYNIKU (ULEPSONY Z ALTERNATYWAMI I MODALEM) ---
const ResultCard = ({
	analysis,
	productName,
	productBrand,
	source,
}: {
	analysis: AnalysisResult
	productName: string
	productBrand: string
	source: string
}) => {
	const { status, found, message, alternatives, score, confidence } = analysis
	const [selectedIngredient, setSelectedIngredient] = useState<IngredientDetails | null>(null)

	const statusConfig: Record<
		AnalysisStatus,
		{ bg: string; border: string; text: string; icon: LucideIcon; title: string; indicator: string }
	> = {
		RED: {
			bg: 'bg-red-50',
			border: 'border-red-200',
			text: 'text-red-700',
			icon: XCircle,
			title: 'UNIKAJ',
			indicator: 'bg-red-500',
		},
		YELLOW: {
			bg: 'bg-amber-50',
			border: 'border-amber-200',
			text: 'text-amber-700',
			icon: AlertTriangle,
			title: 'OSTROŻNIE',
			indicator: 'bg-amber-500',
		},
		GREEN: {
			bg: 'bg-emerald-50',
			border: 'border-emerald-200',
			text: 'text-emerald-700',
			icon: CheckCircle,
			title: 'BEZPIECZNE',
			indicator: 'bg-emerald-500',
		},
		UNKNOWN: {
			bg: 'bg-slate-50',
			border: 'border-slate-200',
			text: 'text-slate-600',
			icon: AlertTriangle,
			title: 'Brak danych',
			indicator: 'bg-slate-400',
		},
	}

	const config = statusConfig[status] || statusConfig.UNKNOWN
	const Icon = config.icon

	const handleIngredientClick = (ingredientName: string) => {
		const details = getIngredientDetails(ingredientName)
		if (details) {
			setSelectedIngredient(details)
		}
	}

	return (
		<>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className={`rounded-3xl border ${config.border} ${config.bg} p-6 shadow-xl shadow-slate-200/50 relative overflow-hidden`}>
				<div className="relative z-10">
					<div className="flex justify-between items-start mb-6 border-b border-slate-200/50 pb-4">
						<div>
							<h3 className="text-slate-900 text-xl font-bold leading-tight">{productName}</h3>
							<p className="text-slate-500 text-sm mt-1">{productBrand}</p>
						</div>
						<div className="flex flex-col items-end gap-2">
							{source === 'AI' && (
								<span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 border border-teal-200">
									<Zap size={10} fill="currentColor" /> AI VISION
								</span>
							)}
							{confidence && (
								<span className="text-[10px] text-slate-500">Pewność: {Math.round(confidence * 100)}%</span>
							)}
						</div>
					</div>

					<div className="flex items-center gap-4 mb-6">
						<div
							className={`w-14 h-14 rounded-full ${config.indicator} flex items-center justify-center text-white shadow-lg shrink-0`}>
							<Icon size={28} />
						</div>
						<div className="flex-1">
							<h4 className={`text-2xl font-bold ${config.text}`}>{config.title}</h4>
							<p className="text-slate-600 text-sm font-medium mt-1">{message}</p>
						</div>
					</div>

					{/* Wykryte składniki - KLIKALNE */}
					{found.length > 0 && (
						<div className="bg-white/60 rounded-xl p-4 border border-slate-200/60 mb-4">
							<div className="flex items-center justify-between mb-3">
								<p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Wykryte składniki:</p>
								<p className="text-[9px] text-slate-400">Kliknij aby zobaczyć szczegóły</p>
							</div>
							<div className="flex flex-wrap gap-2">
								{found.map((item, index) => (
									<button
										key={index}
										onClick={() => handleIngredientClick(item)}
										className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-sm capitalize hover:bg-slate-50 hover:border-slate-300 transition-colors active:scale-95">
										{item}
									</button>
								))}
							</div>
						</div>
					)}

					{/* Alternatywy (jeśli są) */}
					{alternatives && alternatives.length > 0 && (
						<div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
							<div className="flex items-center gap-2 mb-3">
								<Lightbulb size={16} className="text-emerald-600" />
								<h4 className="font-bold text-emerald-900 text-sm">Czym zastąpić?</h4>
							</div>
							<ul className="space-y-1.5">
								{alternatives.slice(0, 3).map((alt, idx) => (
									<li key={idx} className="text-emerald-800 text-sm flex items-start">
										<span className="text-emerald-600 font-bold mr-2 mt-0.5">•</span>
										<span>{alt}</span>
									</li>
								))}
							</ul>
						</div>
					)}

					{/* Score (jeśli jest) */}
					{score !== undefined && score > 0 && (
						<div className="mt-4 pt-4 border-t border-slate-200">
							<div className="flex items-center justify-between text-xs">
								<span className="text-slate-500 font-medium">Poziom ryzyka FODMAP</span>
								<span className={`font-bold ${config.text}`}>{score}/100</span>
							</div>
							<div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
								<div
									className={`h-full ${config.indicator} transition-all`}
									style={{ width: `${Math.min(score, 100)}%` }}
								/>
							</div>
						</div>
					)}
				</div>
			</motion.div>

			{/* Modal ze szczegółami składnika */}
			<IngredientModal
				isOpen={selectedIngredient !== null}
				onClose={() => setSelectedIngredient(null)}
				ingredient={selectedIngredient}
			/>
		</>
	)
}

// --- GŁÓWNY SKANER ---
export default function ScannerPage() {
	const [activeTab, setActiveTab] = useState<'scan' | 'ai-photo'>('scan')
	const [barcode, setBarcode] = useState('')
	const [loading, setLoading] = useState(false)
	const [result, setResult] = useState<ResultData | null>(null)
	const [error, setError] = useState<string | null>(null)

	const [isCameraOpen, setIsCameraOpen] = useState(false)

	const scannerRef = useRef<Html5Qrcode | null>(null)
	const videoRef = useRef<HTMLVideoElement | null>(null)
	const streamRef = useRef<MediaStream | null>(null)

	// 1. SKANER KODÓW
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
					decodedText => {
						stopBarcodeScanner()
						setBarcode(decodedText)
						handleScan(decodedText)
					},
					() => {}
				)
				.catch(() => {
					setIsCameraOpen(false)
					setError('Brak dostępu do kamery.')
				})
		}, 100)
	}

	const stopBarcodeScanner = () => {
		if (scannerRef.current) {
			scannerRef.current
				.stop()
				.then(() => {
					scannerRef.current?.clear()
					setIsCameraOpen(false)
				})
				.catch(console.error)
		} else {
			setIsCameraOpen(false)
		}
	}

	// 2. OPEN FOOD FACTS
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
			const txt = product.ingredients_text_pl || product.ingredients_text_en || product.ingredients_text || ''
			const analysisResult = analyzeIngredients(txt) as AnalysisResult

			setResult({
				analysis: analysisResult,
				productName: product.product_name_pl || product.product_name || 'Produkt bez nazwy',
				productBrand: product.brands || 'Nieznana marka',
				source: 'DB',
			})
		} catch {
			setError('Błąd połączenia.')
		} finally {
			setLoading(false)
		}
	}

	// 3. AI VISION
	const startAiCamera = async () => {
		setIsCameraOpen(true)
		setResult(null)
		setError(null)
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
			streamRef.current = stream
			setTimeout(() => {
				if (videoRef.current) {
					videoRef.current.srcObject = stream
					videoRef.current.play()
				}
			}, 100)
		} catch {
			setIsCameraOpen(false)
			setError('Brak dostępu do kamery.')
		}
	}

	const stopAiCamera = () => {
		if (streamRef.current) {
			streamRef.current.getTracks().forEach(track => track.stop())
			streamRef.current = null
		}
		setIsCameraOpen(false)
	}

	const captureAiPhoto = () => {
		if (!videoRef.current) return
		const canvas = document.createElement('canvas')
		canvas.width = videoRef.current.videoWidth
		canvas.height = videoRef.current.videoHeight
		const ctx = canvas.getContext('2d')
		if (ctx) ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
		const base64Image = canvas.toDataURL('image/jpeg')
		stopAiCamera()
		sendToAi(base64Image)
	}

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = () => {
			if (typeof reader.result === 'string') sendToAi(reader.result)
		}
	}

	const sendToAi = async (base64Image: string) => {
		setLoading(true)
		setError(null)
		setResult(null)
		try {
			const compressedImage = await compressImage(base64Image)
			const response = await fetch('/api/analyze-image', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ image: compressedImage }),
			})
			const aiData = await response.json()
			if (aiData.error) throw new Error(aiData.error)
			const status: AnalysisStatus = ['RED', 'YELLOW', 'GREEN'].includes(aiData.status) ? aiData.status : 'UNKNOWN'

			setResult({
				analysis: {
					status: status,
					found: aiData.found || [],
					message:
						status === 'UNKNOWN'
							? aiData.message || 'Błąd odczytu.'
							: status === 'RED'
							? 'AI wykryło składniki niedozwolone.'
							: 'AI oceniło skład jako bezpieczny.',
				},
				productName: 'Analiza ze zdjęcia',
				productBrand: 'Skan AI Vision',
				source: 'AI',
			})
		} catch {
			setError('Nie udało się odczytać zdjęcia. Spróbuj ponownie.')
		} finally {
			setLoading(false)
		}
	}

	const switchTab = (tab: 'scan' | 'ai-photo') => {
		setActiveTab(tab)
		setResult(null)
		setError(null)
		stopBarcodeScanner()
		stopAiCamera()
	}

	return (
		<div className="min-h-screen bg-[#F8FAF9] text-slate-800 font-sans selection:bg-emerald-200">
			{/* NAVBAR */}
			<nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100/50">
				<div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
					<Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-emerald-700 transition-colors">
						<ArrowLeft size={20} />
						<span className="text-sm font-bold">Wróć</span>
					</Link>
					<div className="flex items-center gap-2 font-bold text-emerald-950">
						<Leaf size={18} className="text-emerald-500" />
						<span>Skaner Jelita</span>
					</div>
					<Link
						href="/safe-products"
						className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
						Bezpieczne
					</Link>
				</div>
			</nav>

			<main className="pt-24 pb-20 px-4 max-w-md mx-auto flex flex-col items-center">
				{/* TABS - ZMODYFIKOWANE KOLORY (TEAL ZAMIAST INDIGO) */}
				<div className="w-full bg-white p-1.5 rounded-2xl flex mb-6 shadow-sm border border-slate-200">
					<button
						onClick={() => switchTab('scan')}
						className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
							activeTab === 'scan'
								? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200 shadow-sm'
								: 'text-slate-400 hover:text-slate-600'
						}`}>
						<ScanBarcode size={18} /> Kod EAN
					</button>
					<button
						onClick={() => switchTab('ai-photo')}
						className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
							// ZMIANA: TEAL zamiast INDIGO
							activeTab === 'ai-photo'
								? 'bg-teal-50 text-teal-800 ring-1 ring-teal-200 shadow-sm'
								: 'text-slate-400 hover:text-slate-600'
						}`}>
						<Zap size={18} /> AI Vision
					</button>
				</div>

				{/* --- WIDOK 1: SKANER KODÓW --- */}
				{activeTab === 'scan' && (
					<div className="w-full flex flex-col gap-4">
						<AnimatePresence>
							{isCameraOpen ? (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="relative rounded-3xl overflow-hidden border-4 border-emerald-500 bg-black aspect-square shadow-2xl">
									<button
										onClick={stopBarcodeScanner}
										className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full z-20 hover:bg-black/70">
										<X size={20} />
									</button>
									<div id="reader" className="w-full h-full"></div>
								</motion.div>
							) : (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
									<button
										onClick={startBarcodeScanner}
										className="w-full aspect-[4/3] bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-emerald-700 hover:bg-emerald-100 transition-colors group mb-6">
										<div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform text-emerald-600">
											<Camera size={32} />
										</div>
										<span className="font-bold">Uruchom Kamerę</span>
									</button>
									<div className="flex gap-2">
										<input
											type="text"
											value={barcode}
											onChange={e => setBarcode(e.target.value)}
											placeholder="Lub wpisz kod EAN..."
											className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
										/>
										<button
											onClick={() => handleScan(undefined)}
											className="bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl px-5 flex items-center justify-center transition-colors shadow-lg shadow-emerald-900/20">
											{loading ? <Loader2 className="animate-spin" /> : <ScanBarcode size={20} />}
										</button>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				)}

				{/* --- WIDOK 2: AI VISION (TERAZ W KOLORACH TEAL) --- */}
				{activeTab === 'ai-photo' && (
					<div className="w-full flex flex-col gap-4">
						<AnimatePresence>
							{isCameraOpen ? (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="relative rounded-3xl overflow-hidden border-4 border-teal-500 bg-black aspect-[3/4] shadow-2xl">
									<video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted></video>
									<button
										onClick={stopAiCamera}
										className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full z-20 hover:bg-black/70">
										<X size={20} />
									</button>
									<div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
										<button
											onClick={captureAiPhoto}
											className="w-20 h-20 rounded-full border-4 border-white bg-white/20 flex items-center justify-center active:scale-90 transition-transform">
											<div className="w-16 h-16 bg-white rounded-full shadow-lg"></div>
										</button>
									</div>
								</motion.div>
							) : (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="bg-white p-6 rounded-3xl border border-teal-100 shadow-xl shadow-teal-900/5">
									{/* INFO BOX: ZMIANA NA TEAL */}
									<div className="bg-teal-50 p-4 rounded-2xl mb-6 text-center border border-teal-100">
										<h4 className="font-bold text-teal-900 mb-1">Inteligentna Analiza</h4>
										<p className="text-teal-800/70 text-sm">Zrób zdjęcie składu, a AI wykryje pułapki.</p>
									</div>

									{/* PRZYCISK: ZMIANA NA TEAL */}
									<button
										onClick={startAiCamera}
										className="w-full py-4 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold shadow-lg shadow-teal-900/20 flex items-center justify-center gap-2 mb-4 transition-all active:scale-[0.98]">
										<Camera size={20} /> Otwórz Aparat
									</button>

									<div className="relative flex items-center gap-3 mb-4">
										<div className="h-px bg-slate-200 flex-1" />
										<span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
											lub wgraj plik
										</span>
										<div className="h-px bg-slate-200 flex-1" />
									</div>

									<label className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors">
										<Upload size={18} /> Wybierz z galerii
										<input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
									</label>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				)}

				{/* --- WYNIKI --- */}
				<div className="w-full mt-8 min-h-[100px]">
					<AnimatePresence mode="wait">
						{loading && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="text-center py-10">
								<Loader2 className="animate-spin mx-auto text-emerald-500 mb-3" size={32} />
								<p className="text-sm font-medium text-slate-400 animate-pulse">Analizuję produkt...</p>
							</motion.div>
						)}

						{/* BŁĄD -> PRZEKIEROWANIE DO AI (KOLOR TEAL) */}
						{error === 'missing_product' && !loading && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								className="bg-white border border-slate-200 p-8 rounded-3xl text-center shadow-lg">
								<div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3 text-amber-500">
									<AlertTriangle size={24} />
								</div>
								<h3 className="text-slate-900 font-bold mb-1">Brak w bazie</h3>
								<p className="text-slate-500 text-sm mb-6">Nie znaleźliśmy tego kodu.</p>
								<button
									onClick={() => switchTab('ai-photo')}
									className="w-full bg-teal-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-teal-900/20 hover:bg-teal-700 transition-all flex items-center justify-center gap-2">
									<Zap size={18} /> Użyj AI Vision
								</button>
							</motion.div>
						)}

						{error && error !== 'missing_product' && !loading && (
							<div className="text-red-500 text-center p-4 bg-red-50 rounded-xl border border-red-100 text-sm font-medium">
								{error}
							</div>
						)}

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
			</main>
		</div>
	)
}
