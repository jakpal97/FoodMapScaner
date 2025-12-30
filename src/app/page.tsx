'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ScanBarcode, Leaf, Smartphone, ArrowRight, Check, X, Download, Copy, 
  Camera, BrainCircuit, Sparkles, Zap, Globe, Share, PlusSquare, Menu
} from 'lucide-react';

// --- ELEMENTY UI ---

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-lime-100 text-lime-800 mb-6 border border-lime-300">
    {children}
  </span>
);

// --- SEKCJA TABÓW (HOW IT WORKS) ---

const HowItWorksTabs = () => {
  const [activeTab, setActiveTab] = useState<'scanner' | 'ai'>('ai');

  const steps = {
    scanner: [
      {
        icon: ScanBarcode,
        title: "Znajdź Kod",
        desc: "Obróć opakowanie i namierz standardowy kod kreskowy (EAN)."
      },
      {
        icon: Zap,
        title: "Błyskawiczny Skan",
        desc: "Najeżdżasz kamerą i gotowe. Jeśli produkt jest w bazie, wynik masz w 0.2s."
      },
      {
        icon: Check,
        title: "Werdykt",
        desc: "Zielony = Bezpieczny. Czerwony = Uważaj. Proste."
      }
    ],
    ai: [
      {
        icon: Camera,
        title: "Zrób Zdjęcie",
        desc: "Produkt nie ma kodu lub jest z zagranicy? Zrób wyraźne zdjęcie listy składników."
      },
      {
        icon: Sparkles,
        title: "Analiza AI Vision",
        desc: "Nasza sztuczna inteligencja przetwarza obraz na tekst i rozumie kontekst składników."
      },
      {
        icon: BrainCircuit,
        title: "Ekspercka Opinia",
        desc: "AI wykrywa ukryte pułapki FODMAP, których zwykła baza mogłaby nie mieć."
      }
    ]
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Przełącznik */}
      <div className="flex justify-center mb-16">
        <div className="bg-lime-100 p-1.5 rounded-full inline-flex border border-lime-300">
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'ai' 
                ? 'bg-lime-700 text-white' 
                : 'text-lime-700 hover:bg-lime-200'
            }`}
          >
            <Sparkles size={16} />
            AI Vision (Zdjęcie)
          </button>
          <button
            onClick={() => setActiveTab('scanner')}
            className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'scanner' 
                ? 'bg-lime-700 text-white' 
                : 'text-lime-700 hover:bg-lime-200'
            }`}
          >
            <ScanBarcode size={16} />
            Skaner Kodów
          </button>
        </div>
      </div>

      {/* Grid Kroków */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {steps[activeTab].map((step, index) => (
            <div key={index} className="bg-white border border-lime-200 p-8 rounded-3xl transition duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-lime-100 flex items-center justify-center text-lime-700 mb-6 group-hover:bg-lime-700 group-hover:text-white transition-colors duration-300">
                <step.icon size={28} />
              </div>
              <div className="flex items-center gap-3 mb-3">
                 <span className="text-xs font-bold text-lime-700 bg-lime-100 px-2 py-0.5 rounded-full">Krok {index + 1}</span>
                 <h3 className="text-xl font-bold text-lime-950">{step.title}</h3>
              </div>
              <p className="text-lime-900/70 text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// --- GŁÓWNA STRONA ---

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-lime-950 overflow-x-hidden selection:bg-lime-300">
      
      {/* Nawigacja */}
      <nav className="fixed w-full z-50 bg-white border-b border-lime-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-lime-700 rounded-xl flex items-center justify-center text-white">
                <Leaf size={22} fill="currentColor" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-lime-950">FoodPal</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
               <a href="#features" className="text-sm font-medium text-lime-900 hover:text-lime-700 transition">Funkcje</a>
               <a href="#how-it-works" className="text-sm font-medium text-lime-900 hover:text-lime-700 transition">Instrukcja</a>
              <Link href="/scanner">
                <button className="group bg-lime-950 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-lime-900 transition flex items-center gap-2">
                  Otwórz Appkę
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-white">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
          
          {/* Lewa strona: Tekst */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2 text-center lg:text-left"
          >
            <Badge>🚀 Nowość: Analiza składu ze zdjęcia</Badge>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 text-lime-950">
              Jedz bezpiecznie z <span className="text-lime-700">FoodPal</span>
            </h1>
            <p className="text-lg text-lime-900 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Masz IBS? Nie wiesz co kupić? Skanuj kody kreskowe lub <strong>rób zdjęcia składów</strong>, aby natychmiast wykryć szkodliwe FODMAPy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/scanner">
                <button className="w-full sm:w-auto bg-lime-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-lime-800 transition flex items-center justify-center gap-2">
                  <ScanBarcode size={20} />
                  Uruchom Skaner
                </button>
              </Link>
              <a href="#install" className="w-full sm:w-auto bg-white text-lime-950 border border-lime-300 px-8 py-4 rounded-xl font-bold text-lg hover:bg-lime-100 transition flex items-center justify-center gap-2">
                <Download size={20} />
                Instalacja
              </a>
            </div>
          </motion.div>

          {/* Prawa strona: Mockup Telefonu */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-1/2 flex justify-center perspective-1000"
          >
            {/* CSS Phone Mockup */}
            <div className="relative w-[300px] h-[600px] bg-lime-950 rounded-[3rem] border-8 border-lime-950 overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-7 bg-lime-950 rounded-b-2xl z-20"></div>
              
              {/* Ekran wewnątrz telefonu */}
              <div className="w-full h-full bg-white flex flex-col relative">
                {/* Header Appki */}
                <div className="bg-lime-700 pt-14 pb-8 px-6 rounded-b-[2.5rem] mb-4">
                  <div className="flex justify-between items-center text-white mb-4">
                    <Leaf className="w-6 h-6" />
                    <div className="w-8 h-8 rounded-full bg-white/20"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Dzień dobry!</h3>
                  <p className="text-lime-100 text-sm">Sprawdźmy, co jesz.</p>
                </div>

                {/* Przykładowe wyniki */}
                <div className="px-6 space-y-3">
                  <div className="bg-white rounded-2xl p-4 border border-lime-200 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 shrink-0">
                      <X size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-lime-950 text-sm">Czosnek granulowany</p>
                      <p className="text-xs text-red-500 font-medium">Wysoki FODMAP</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-lime-200 flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-lime-100 flex items-center justify-center text-lime-700 shrink-0">
                      <Check size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-lime-950 text-sm">Mąka ryżowa</p>
                      <p className="text-xs text-lime-700 font-medium">Bezpieczny</p>
                    </div>
                  </div>
                </div>
                
                {/* Floating Action Button simulation */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                    <div className="w-16 h-16 bg-lime-700 rounded-full flex items-center justify-center text-white">
                        <ScanBarcode size={28} />
                    </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section - BENTO GRID STYLE (Clean) */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-lime-950">Możliwości FoodPal</h2>
            <p className="text-lime-900 mt-2">Wszystko, czego potrzebujesz w jednej aplikacji.</p>
           </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 grid-rows-[auto_auto]">
            
            {/* Karta 1: AI Vision (DUŻA - Dark Avocado, Clean) */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-4 bg-lime-950 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden group min-h-[400px] flex flex-col justify-between"
            >
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-lime-300 font-bold text-sm tracking-wider uppercase mb-4">
                    <Sparkles size={16} /> Killer Feature
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">Analiza Składu ze Zdjęcia</h3>
                <p className="text-lime-100 text-lg max-w-md">
                   Brak kodu kreskowego? Produkt z importu? Zrób zdjęcie etykiety. Nasze AI odczyta tekst (OCR) i znajdzie ukryte szkodniki.
                </p>
              </div>

              {/* Wizualizacja skanowania */}
              <div className="mt-8 bg-white/5 rounded-2xl p-4 border border-white/10 self-start transition-colors">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-lime-700 rounded-lg flex items-center justify-center text-white animate-pulse">
                        <Camera size={20} />
                    </div>
                    <div>
                        <div className="h-2 w-24 bg-white/20 rounded mb-1.5"></div>
                        <div className="h-2 w-16 bg-white/10 rounded"></div>
                    </div>
                 </div>
              </div>
            </motion.div>

            {/* Karta 2: Skaner Kodów (MAŁA - White, Clean) */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-2 bg-white rounded-[2.5rem] p-8 md:p-10 border border-lime-200 flex flex-col justify-center text-center items-center transition-all"
            >
              <div className="w-16 h-16 bg-lime-100 text-lime-700 rounded-2xl flex items-center justify-center mb-6">
                <ScanBarcode size={32} />
              </div>
              <h3 className="text-xl font-bold text-lime-950 mb-2">Szybki Skaner</h3>
              <p className="text-lime-900 text-sm">
                Masz kod EAN? Zeskanuj go, by dostać wynik w ułamku sekundy.
              </p>
            </motion.div>

            {/* Karta 3: PWA / Dostępność (ŚREDNIA - White, Clean) */}
            <motion.div 
               whileHover={{ y: -5 }}
               className="md:col-span-3 bg-white rounded-[2.5rem] p-8 md:p-10 border border-lime-200 flex flex-row items-center gap-6"
            >
                <div className="shrink-0 w-16 h-16 bg-lime-950 text-white rounded-2xl flex items-center justify-center">
                    <Smartphone size={28} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-lime-950 mb-2">Bez Instalowania</h3>
                    <p className="text-lime-900 text-sm">
                        FoodPal to PWA. Nie zajmuje miejsca, nie wymaga aktualizacji ze sklepu. Dodajesz do pulpitu i działa.
                    </p>
                </div>
            </motion.div>

             {/* Karta 4: Polska Baza (ŚREDNIA - Lime Solid, Clean) */}
             <motion.div 
               whileHover={{ y: -5 }}
               className="md:col-span-3 bg-lime-800 rounded-[2.5rem] p-8 md:p-10 text-white flex flex-row items-center gap-6 relative overflow-hidden"
            >
                <div className="shrink-0 w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center border border-white/20">
                    <Globe size={28} />
                </div>
                <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">Polska Baza</h3>
                    <p className="text-lime-100 text-sm">
                        Rozumiemy "Serki Wiejskie" i polskie składy. Aplikacja dostosowana do naszego rynku.
                    </p>
                </div>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* INTERAKTYWNA SEKCJA "JAK TO DZIAŁA" (White background with Tabs, Clean) */}
      <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-lime-950 mb-4">Proste jak zdjęcie</h2>
            <p className="text-lime-900 text-lg">Wybierz tryb, który pasuje do Twojej sytuacji.</p>
          </div>
          <HowItWorksTabs />
        </div>
      </section>

      {/* INSTALLATION SECTION (Deep Avocado Background, Clean) */}
      <section id="install" className="py-24 bg-lime-950 text-white relative overflow-hidden">
         
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Lewa: Tekst */}
            <div>
                <div className="inline-block bg-lime-900 border border-lime-800 text-lime-200 font-bold px-4 py-2 rounded-lg text-xs tracking-widest uppercase mb-6">
                    Web App (PWA)
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    Zainstaluj w 3 sekundy. <br />
                    <span className="text-lime-400">Bez App Store.</span>
                </h2>
                <p className="text-lime-100 text-lg mb-8 leading-relaxed">
                    Pominęliśmy pośredników. Zainstaluj FoodPal bezpośrednio z przeglądarki. Szybko, lekko i bezpiecznie.
                </p>
                <div className="flex gap-4">
                     <div className="flex items-center gap-2 text-lime-200 text-sm font-medium">
                        <Check className="text-lime-400" size={18} /> Darmowe aktualizacje
                     </div>
                     <div className="flex items-center gap-2 text-lime-200 text-sm font-medium">
                        <Check className="text-lime-400" size={18} /> Pełny ekran
                     </div>
                </div>
            </div>

            {/* Prawa: Karty Instrukcji (Clean) */}
            <div className="space-y-4">
                {/* iOS Card */}
                <div className="bg-lime-900 border border-lime-800 rounded-2xl p-6 flex items-start gap-5 hover:bg-lime-850 transition-colors cursor-default">
                    <div className="bg-white text-black w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-xl font-bold">
                        
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-1">iPhone (Safari)</h3>
                        <p className="text-lime-100 text-sm mb-3">Kliknij przycisk "Udostępnij" na dolnym pasku przeglądarki.</p>
                        <div className="flex items-center gap-2 text-xs font-bold text-lime-200 uppercase tracking-wide bg-lime-800 px-3 py-1.5 rounded-lg w-fit">
                            <Share size={14} /> Wybierz "Do ekranu początkowego"
                        </div>
                    </div>
                </div>

                {/* Android Card */}
                <div className="bg-lime-900 border border-lime-800 rounded-2xl p-6 flex items-start gap-5 hover:bg-lime-850 transition-colors cursor-default">
                    <div className="bg-lime-700 text-white w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                        <Smartphone size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-1">Android (Chrome)</h3>
                        <p className="text-lime-100 text-sm mb-3">Kliknij trzy kropki w prawym górnym rogu przeglądarki.</p>
                         <div className="flex items-center gap-2 text-xs font-bold text-lime-200 uppercase tracking-wide bg-lime-800 px-3 py-1.5 rounded-lg w-fit">
                            <PlusSquare size={14} /> Wybierz "Zainstaluj aplikację"
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (Clean) */}
      <footer className="bg-white border-t border-lime-200 py-12 text-center">
        <div className="flex justify-center items-center gap-2 mb-6 text-lime-950 opacity-80">
            <Leaf size={24} className="text-lime-700" />
            <span className="font-bold text-xl">FoodPal</span>
        </div>
        <p className="text-lime-900/60 text-sm">&copy; {new Date().getFullYear()} FoodPal. Stworzone z troską o Twoje jelita.</p>
      </footer>
    </div>
  );
}