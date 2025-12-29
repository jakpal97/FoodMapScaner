'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, AlertTriangle, Search, MapPin, Star, ShoppingBag } from 'lucide-react'
import { safeProductsDatabase, type SafeProduct } from '@/app/fodmap_database'

export default function SafeProductsPage() {
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedCategory, setSelectedCategory] = useState<string>('Wszystkie')

	// Kategorie
	const categories = ['Wszystkie', ...new Set(safeProductsDatabase.map(p => p.category))]

	// Filtrowanie
	const filteredProducts = safeProductsDatabase.filter(product => {
		const matchesSearch =
			product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			product.brand.toLowerCase().includes(searchQuery.toLowerCase())

		const matchesCategory = selectedCategory === 'Wszystkie' || product.category === selectedCategory

		return matchesSearch && matchesCategory
	})

	return (
		<div className="min-h-screen bg-[#F8FAF9] text-slate-800 font-sans">
			{/* NAVBAR */}
			<nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100/50">
				<div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
					<Link href="/scanner" className="flex items-center gap-2 text-slate-500 hover:text-emerald-700 transition-colors">
						<ArrowLeft size={20} />
						<span className="text-sm font-bold">Wróć do skanera</span>
					</Link>
					<div className="flex items-center gap-2 font-bold text-emerald-950">
						<ShoppingBag size={18} className="text-emerald-500" />
						<span>Bezpieczne Produkty</span>
					</div>
					<div className="w-20"></div>
				</div>
			</nav>

			<main className="pt-24 pb-20 px-4 max-w-4xl mx-auto">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-emerald-950 mb-3">
						Baza Bezpiecznych Produktów
					</h1>
					<p className="text-slate-500 max-w-2xl mx-auto">
						Produkty sprawdzone przez społeczność Low-FODMAP. Wszystkie są bezpieczne lub umiarkowanie ryzykowne.
					</p>
				</div>

				{/* Search Bar */}
				<div className="mb-6">
					<div className="relative">
						<Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
						<input
							type="text"
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
							placeholder="Szukaj produktu lub marki..."
							className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
						/>
					</div>
				</div>

				{/* Categories Filter */}
				<div className="mb-8 overflow-x-auto">
					<div className="flex gap-2 pb-2">
						{categories.map(cat => (
							<button
								key={cat}
								onClick={() => setSelectedCategory(cat)}
								className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
									selectedCategory === cat
										? 'bg-emerald-600 text-white shadow-lg'
										: 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'
								}`}>
								{cat}
							</button>
						))}
					</div>
				</div>

				{/* Products Grid */}
				<div className="grid md:grid-cols-2 gap-4">
					{filteredProducts.length === 0 ? (
						<div className="col-span-2 text-center py-12 bg-white rounded-2xl border border-slate-200">
							<p className="text-slate-500">Nie znaleziono produktów spełniających kryteria</p>
						</div>
					) : (
						filteredProducts.map((product, idx) => (
							<motion.div
								key={idx}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: idx * 0.05 }}
								className={`bg-white rounded-2xl p-5 border-2 shadow-sm hover:shadow-md transition-all ${
									product.status === 'GREEN'
										? 'border-emerald-200 hover:border-emerald-300'
										: 'border-yellow-200 hover:border-yellow-300'
								}`}>
								{/* Header */}
								<div className="flex justify-between items-start mb-3">
									<div className="flex-1">
										<h3 className="font-bold text-slate-900 mb-1">{product.name}</h3>
										<p className="text-sm text-slate-500">{product.brand}</p>
									</div>
									<div
										className={`w-10 h-10 rounded-full flex items-center justify-center ${
											product.status === 'GREEN' ? 'bg-emerald-100 text-emerald-600' : 'bg-yellow-100 text-yellow-600'
										}`}>
										{product.status === 'GREEN' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
									</div>
								</div>

								{/* Category Badge */}
								<span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium mb-3">
									{product.category}
								</span>

								{/* Community Rating */}
								{product.communityRating && (
									<div className="flex items-center gap-2 mb-3">
										<div className="flex items-center">
											{[...Array(5)].map((_, i) => (
												<Star
													key={i}
													size={14}
													className={i < Math.round(product.communityRating!) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}
												/>
											))}
										</div>
										<span className="text-xs text-slate-500">
											{product.communityRating} ({product.scansCount || 0} skanów)
										</span>
									</div>
								)}

								{/* Where to find */}
								<div className="border-t border-slate-100 pt-3">
									<div className="flex items-center gap-2 mb-2">
										<MapPin size={14} className="text-emerald-600" />
										<span className="text-xs font-bold text-slate-700">Gdzie kupić:</span>
									</div>
									<div className="flex flex-wrap gap-1">
										{product.whereToFind.map((store, idx) => (
											<span key={idx} className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-medium">
												{store}
											</span>
										))}
									</div>
								</div>

								{/* Notes */}
								{product.notes && (
									<p className="mt-3 text-xs text-slate-600 bg-slate-50 rounded-lg p-2">{product.notes}</p>
								)}

								{/* Barcode */}
								{product.barcode && (
									<p className="mt-2 text-[10px] text-slate-400 font-mono">
										EAN: {product.barcode}
									</p>
								)}
							</motion.div>
						))
					)}
				</div>

				{/* Community CTA */}
				<div className="mt-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-center text-white">
					<h3 className="text-2xl font-bold mb-3">Pomóż rozwijać bazę!</h3>
					<p className="mb-6 opacity-90">
						Znalazłeś bezpieczny produkt? Dodaj go do bazy, aby pomóc innym.
					</p>
					<button className="bg-white text-emerald-700 px-8 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors">
						Dodaj produkt
					</button>
				</div>
			</main>
		</div>
	)
}

