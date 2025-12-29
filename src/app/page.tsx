'use client'

import React from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ScanBarcode, Zap, ShieldCheck, HeartPulse, ArrowRight, Leaf, Smartphone, XCircle } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

// --- KOMPONENTY DEKORACYJNE ---
interface BlobProps {
	className?: string
}

const Blob = ({ className }: BlobProps) => (
	<div className={`absolute rounded-full blur-[100px] opacity-60 mix-blend-multiply ${className}`} />
)

interface FeatureCardProps {
	icon: LucideIcon
	title: string
	desc: string
	delay: number
}

const FeatureCard = ({ icon: Icon, title, desc, delay }: FeatureCardProps) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		whileInView={{ opacity: 1, y: 0 }}
		viewport={{ once: true }}
		transition={{ delay, duration: 0.5 }}
		whileHover={{ y: -5 }}
		className="p-8 bg-white/60 backdrop-blur-md border border-white/50 rounded-[2rem] shadow-xl shadow-emerald-900/5 group hover:border-emerald-200 transition-all">
		<div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 mb-6 group-hover:scale-110 transition-transform">
			<Icon size={24} />
		</div>
		<h3 className="text-xl font-bold text-emerald-950 mb-3">{title}</h3>
		<p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
	</motion.div>
)

export default function LandingPage() {
	const { scrollY } = useScroll()
	const yHero = useTransform(scrollY, [0, 500], [0, 150])
	const opacityHero = useTransform(scrollY, [0, 400], [1, 0])

	return (
		<div className="min-h-screen bg-[#F8FAF9] text-slate-800 font-sans selection:bg-emerald-200 overflow-x-hidden">
			{/* TŁO: ORGANIC SHAPES (Pastel Green Aesthetic) */}
			<div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
				<Blob className="top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-200/40" />
				<Blob className="top-[40%] left-[-20%] w-[500px] h-[500px] bg-teal-100/50" />
				<Blob className="bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-lime-100/40" />
			</div>

			{/* NAVBAR (Floating Pill) */}
			<nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
				<motion.div
					initial={{ y: -100, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					className="bg-white/80 backdrop-blur-xl border border-white/60 px-6 py-3 rounded-full shadow-lg shadow-emerald-900/5 flex items-center gap-8">
					<div className="flex items-center gap-2 font-bold text-emerald-950 text-lg tracking-tight">
						<Leaf size={20} className="text-emerald-500" />
						<span>Food Pal</span>
					</div>

					<div className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
						<a href="#funkcje" className="hover:text-emerald-700 transition-colors">
							Funkcje
						</a>
						<a href="#baza" className="hover:text-emerald-700 transition-colors">
							Baza Wiedzy
						</a>
					</div>

					<Link href="/scanner">
						<button className="bg-emerald-900 text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2">
							Uruchom Skaner <ArrowRight size={14} />
						</button>
					</Link>
				</motion.div>
			</nav>

			{/* HERO SECTION */}
			<section className="relative pt-48 pb-32 px-6 z-10 overflow-hidden">
				<div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
					{/* Lewa Strona: Copywriting */}
					<motion.div style={{ y: yHero, opacity: opacityHero }} className="relative z-20">
						

						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.1 }}
							className="text-5xl lg:text-7xl font-bold text-emerald-950 mb-6 tracking-tight leading-[1.05]">
							Jedz bez strachu.
							<br />
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
								Żyj bez bólu.
							</span>
						</motion.h1>

						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="text-lg text-slate-500 max-w-lg mb-10 leading-relaxed">
							Twoja tarcza przeciwko IBS i SIBO. Zeskanuj dowolny produkt, a sztuczna inteligencja wykryje ukryte
							wyzwalacze w 3 sekundy.
						</motion.p>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
							className="flex flex-col sm:flex-row gap-4">
							<Link href="/scanner" className="w-full sm:w-auto">
								<button className="w-full px-8 py-4 bg-emerald-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-900/20 hover:scale-[1.02] hover:shadow-2xl transition-all flex items-center justify-center gap-3">
									<ScanBarcode size={24} /> Zacznij Skanować
								</button>
							</Link>
							<button className="px-8 py-4 bg-white text-emerald-900 border border-emerald-100 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition-colors">
								Zobacz Demo
							</button>
						</motion.div>

						<div className="mt-12 flex items-center gap-4 text-sm text-slate-500 font-medium">
							<div className="flex -space-x-2">
								{[1, 2, 3, 4].map(i => (
									<div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-emerald-100" />
								))}
							</div>
							<p>Zaufane przez 2,000+ brzuchów</p>
						</div>
					</motion.div>

					{/* Prawa Strona: Abstrakcyjna wizualizacja skanera (Animacja CSS) */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.8 }}
						className="relative hidden lg:block">
						{/* Obudowa Telefonu */}
						<div className="relative w-[320px] h-[640px] bg-white border-8 border-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(6,78,59,0.15)] mx-auto overflow-hidden z-20">
							{/* Ekran */}
							<div className="absolute inset-0 bg-slate-50 flex flex-col">
								{/* Header Telefonu */}
								<div className="pt-8 px-6 pb-4 bg-white">
									<div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
										<ScanBarcode className="text-emerald-600" />
									</div>
									<div className="h-2 w-24 bg-slate-200 rounded-full mb-2" />
									<div className="h-2 w-16 bg-slate-100 rounded-full" />
								</div>

								{/* Symulacja Skanowania */}
								<div className="flex-1 relative m-4 rounded-3xl overflow-hidden bg-slate-200">
									{/* Tło produktu */}
									<div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center opacity-80" />

									{/* Laser Skanujący */}
									<motion.div
										animate={{ top: ['0%', '100%', '0%'] }}
										transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
										className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.8)] z-10"
									/>

									{/* Nakładka "Wykryto" */}
									<motion.div
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ delay: 1, duration: 0.5, repeat: Infinity, repeatDelay: 2.5 }}
										className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-lg">
										<div className="flex items-center gap-3 mb-2">
											<div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500">
												<XCircle size={20} />
											</div>
											<span className="font-bold text-slate-800 text-sm">Wykryto Cebulę</span>
										</div>
										<div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
											<div className="h-full w-3/4 bg-red-500 rounded-full" />
										</div>
									</motion.div>
								</div>
							</div>
						</div>

						{/* Dekoracje za telefonem */}
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-300/30 to-teal-300/30 rounded-full blur-[80px] -z-10 animate-pulse" />
					</motion.div>
				</div>
			</section>

			{/* BENTO GRID - FUNKCJE */}
			<section id="funkcje" className="py-24 px-6 relative z-10">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16 max-w-2xl mx-auto">
						<h2 className="text-3xl md:text-5xl font-bold text-emerald-950 mb-6">Mądrzejszy niż etykieta</h2>
						<p className="text-slate-500 text-lg">
							Większość aplikacji ma pustą bazę danych. My używamy AI Vision, żeby przeczytać skład ze zdjęcia. Działa
							na wszystko.
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-6">
						{/* Karta 1 */}
						<FeatureCard
							icon={Zap}
							title="AI Vision Technology"
							desc="Brak kodu kreskowego? Zrób zdjęcie składu. Nasze AI przeczyta etykietę szybciej niż Ty i znajdzie ukryte pułapki."
							delay={0.1}
						/>

						{/* Karta 2 - Wyróżniona */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.2 }}
							className="p-8 bg-emerald-900 rounded-[2rem] shadow-2xl shadow-emerald-900/20 text-white relative overflow-hidden group">
							<div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2 group-hover:bg-white/10 transition-colors" />

							<div className="relative z-10">
								<div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-6">
									<ShieldCheck size={24} />
								</div>
								<h3 className="text-2xl font-bold mb-3">Baza Monash University</h3>
								<p className="text-emerald-100/80 leading-relaxed mb-8">
									Opieramy się na oficjalnych badaniach. Wiemy, że &quot;Aromaty&quot; mogą oznaczać czosnek, a inulina
									to wróg nr 1.
								</p>
								<div className="flex flex-wrap gap-2">
									{['Cebula', 'Czosnek', 'Laktoza', 'Słodziki'].map(tag => (
										<span
											key={tag}
											className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium border border-white/10">
											No {tag}
										</span>
									))}
								</div>
							</div>
						</motion.div>

						{/* Karta 3 */}
						<FeatureCard
							icon={Smartphone}
							title="Zawsze pod ręką"
							desc="Działa w przeglądarce. Bez instalowania. Bez zakładania konta. Stoisz w sklepie, skanujesz, wiesz."
							delay={0.3}
						/>
					</div>
				</div>
			</section>

			{/* CTA SECTION */}
			<section className="py-24 px-6">
				<div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-12 md:p-20 text-center shadow-2xl shadow-emerald-900/5 border border-emerald-50 relative overflow-hidden">
					{/* Tło CTA */}
					<div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(167,243,208,0.3),transparent_50%)]" />

					<div className="relative z-10">
						<h2 className="text-4xl md:text-5xl font-bold text-emerald-950 mb-8 tracking-tight">
							Przestań zgadywać.
							<br />
							Zacznij jeść bezpiecznie.
						</h2>
						<p className="text-slate-500 mb-10 text-lg max-w-xl mx-auto">
							Wersja Beta jest całkowicie darmowa. Sprawdź swój pierwszy produkt już teraz.
						</p>
						<Link href="/scanner">
							<button className="px-10 py-5 bg-emerald-900 text-white rounded-full font-bold text-lg hover:bg-emerald-800 hover:scale-105 transition-all shadow-xl shadow-emerald-900/20">
								Uruchom Skaner produktów
							</button>
						</Link>
						<p className="mt-6 text-xs text-slate-400 font-medium">
							Nie wymaga karty kredytowej • Działa na każdym telefonie
						</p>
					</div>
				</div>
			</section>

			{/* FOOTER */}
			<footer className="py-12 border-t border-slate-200 bg-white">
				<div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
					<div className="flex items-center gap-2 font-bold text-emerald-950 opacity-80">
						<Leaf size={18} />
						<span>Skaner Jelita</span>
					</div>
					<div className="text-slate-400 text-sm">© 2024 Crafted for healthy guts.</div>
					<div className="flex gap-6 text-sm font-medium text-slate-500">
						<a href="#" className="hover:text-emerald-700">
							Prywatność
						</a>
						<a href="#" className="hover:text-emerald-700">
							Kontakt
						</a>
					</div>
				</div>
			</footer>
		</div>
	)
}
