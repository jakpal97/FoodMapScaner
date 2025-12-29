'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle, Info, ShieldAlert, Lightbulb } from 'lucide-react'
import { type IngredientDetails } from '@/app/fodmap_database'

interface IngredientModalProps {
	isOpen: boolean
	onClose: () => void
	ingredient: IngredientDetails | null
}

export const IngredientModal: React.FC<IngredientModalProps> = ({ isOpen, onClose, ingredient }) => {
	if (!ingredient) return null

	const severityColor =
		ingredient.severity >= 8
			? 'red'
			: ingredient.severity >= 6
			? 'amber'
			: ingredient.severity >= 4
			? 'yellow'
			: 'emerald'

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
					/>

					{/* Modal */}
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
						<motion.div
							initial={{ opacity: 0, scale: 0.9, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.9, y: 20 }}
							className="bg-white rounded-3xl max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl pointer-events-auto">
							{/* Header */}
							<div className={`bg-${severityColor}-50 border-b border-${severityColor}-100 p-6 sticky top-0`}>
								<div className="flex justify-between items-start">
									<div>
										<h2 className={`text-2xl font-bold text-${severityColor}-900 mb-1`}>{ingredient.name}</h2>
										<span className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-${severityColor}-100 text-${severityColor}-700 border border-${severityColor}-200`}>
											{ingredient.monashStatus} FODMAP • {ingredient.fodmapType}
										</span>
									</div>
									<button
										onClick={onClose}
										className="p-2 hover:bg-white/50 rounded-full transition-colors">
										<X size={24} className="text-slate-600" />
									</button>
								</div>

								{/* Severity Bar */}
								<div className="mt-4">
									<div className="flex justify-between text-xs font-medium text-slate-600 mb-2">
										<span>Poziom ryzyka</span>
										<span>{ingredient.severity}/10</span>
									</div>
									<div className="h-2 bg-slate-200 rounded-full overflow-hidden">
										<div
											className={`h-full bg-${severityColor}-500 rounded-full transition-all`}
											style={{ width: `${ingredient.severity * 10}%` }}
										/>
									</div>
								</div>
							</div>

							{/* Content */}
							<div className="p-6 space-y-6">
								{/* Dlaczego jest szkodliwy */}
								<div>
									<div className="flex items-center gap-2 mb-3">
										<Info size={18} className="text-indigo-500" />
										<h3 className="font-bold text-slate-900">Dlaczego jest problematyczny?</h3>
									</div>
									<p className="text-slate-600 leading-relaxed">{ingredient.why}</p>
								</div>

								{/* Objawy */}
								<div>
									<div className="flex items-center gap-2 mb-3">
										<ShieldAlert size={18} className="text-red-500" />
										<h3 className="font-bold text-slate-900">Możliwe objawy</h3>
									</div>
									<div className="flex flex-wrap gap-2">
										{ingredient.symptoms.map((symptom, idx) => (
											<span
												key={idx}
												className="px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-sm font-medium border border-red-100">
												{symptom}
											</span>
										))}
									</div>
								</div>

								{/* Gdzie się znajduje */}
								<div>
									<div className="flex items-center gap-2 mb-3">
										<AlertTriangle size={18} className="text-amber-500" />
										<h3 className="font-bold text-slate-900">Gdzie go znajdziesz?</h3>
									</div>
									<div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
										<ul className="space-y-1">
											{ingredient.whereFound.map((place, idx) => (
												<li key={idx} className="text-slate-700 text-sm flex items-start">
													<span className="text-amber-500 mr-2">•</span>
													{place}
												</li>
											))}
										</ul>
									</div>
								</div>

								{/* Bezpieczna porcja */}
								{ingredient.safeServing && (
									<div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
										<h3 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
											<Info size={16} />
											Bezpieczna porcja
										</h3>
										<p className="text-emerald-800 text-sm font-medium">{ingredient.safeServing}</p>
									</div>
								)}

								{/* Alternatywy */}
								{ingredient.alternatives.length > 0 && (
									<div>
										<div className="flex items-center gap-2 mb-3">
											<Lightbulb size={18} className="text-emerald-500" />
											<h3 className="font-bold text-slate-900">Czym zastąpić?</h3>
										</div>
										<div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 space-y-2">
											{ingredient.alternatives.map((alt, idx) => (
												<div key={idx} className="flex items-start">
													<span className="text-emerald-600 font-bold mr-2">{idx + 1}.</span>
													<span className="text-slate-700 text-sm">{alt}</span>
												</div>
											))}
										</div>
									</div>
								)}

								{/* Inne nazwy */}
								{ingredient.aliases.length > 1 && (
									<div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
										<h3 className="font-bold text-slate-900 mb-2 text-sm">Inne nazwy na etykiecie:</h3>
										<div className="flex flex-wrap gap-1">
											{ingredient.aliases.slice(0, 8).map((alias, idx) => (
												<span key={idx} className="text-xs bg-white text-slate-600 px-2 py-1 rounded border border-slate-200">
													{alias}
												</span>
											))}
										</div>
									</div>
								)}
							</div>

							{/* Footer */}
							<div className="border-t border-slate-200 p-4 bg-slate-50 sticky bottom-0">
								<button
									onClick={onClose}
									className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold transition-colors">
									Zamknij
								</button>
							</div>
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	)
}

