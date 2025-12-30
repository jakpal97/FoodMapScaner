'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ScanBarcode, AlertTriangle, CheckCircle, XCircle, Loader2,
  Camera, X, ArrowLeft, Zap, Upload, Leaf, Sparkles
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { analyzeIngredients } from '@/app/fodmap_rules';
import { LucideIcon } from 'lucide-react'

// --- FUNKCJA KOMPRESJI ---
const compressImage = (base64Str: string, maxWidth = 1024, quality = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') { resolve(base64Str); return; }
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(base64Str);
  });
};

// --- TYPY ---
type AnalysisStatus = 'RED' | 'YELLOW' | 'GREEN' | 'UNKNOWN';

interface AnalysisResult {
  status: AnalysisStatus;
  found: string[];
  message: string;
}

interface ResultData {
  analysis: AnalysisResult;
  productName: string;
  productBrand: string;
  source: string;
}

// --- KOMPONENT WYNIKU ---
const ResultCard = ({ analysis, productName, productBrand, source }: { analysis: AnalysisResult, productName: string, productBrand: string, source: string }) => {
  const { status, found, message } = analysis;

  // Kolory statusów muszą zostać (Czerwony/Żółty/Zielony) dla czytelności, 
  // ale style zostały wyczyszczone (Solid colors).
  const statusConfig: Record<AnalysisStatus, { bg: string; border: string; text: string; icon: LucideIcon; title: string; indicator: string }> = {
    RED: {
      bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: XCircle,
      title: 'UNIKAJ', indicator: 'bg-red-600'
    },
    YELLOW: {
      bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: AlertTriangle,
      title: 'OSTROŻNIE', indicator: 'bg-amber-500'
    },
    GREEN: {
      bg: 'bg-lime-50', border: 'border-lime-200', text: 'text-lime-800', icon: CheckCircle,
      title: 'BEZPIECZNE', indicator: 'bg-lime-600'
    },
    UNKNOWN: {
      bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600', icon: AlertTriangle,
      title: 'Brak danych', indicator: 'bg-gray-400'
    },
  };

  const config = statusConfig[status] || statusConfig.UNKNOWN;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl border ${config.border} ${config.bg} p-6 relative overflow-hidden`}
    >
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6 border-b border-black/5 pb-4">
          <div>
            <h3 className="text-gray-900 text-xl font-bold leading-tight">{productName}</h3>
            <p className="text-gray-500 text-sm mt-1">{productBrand}</p>
          </div>
          {source === 'AI' && (
            <span className="bg-lime-900 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Sparkles size={10} fill="currentColor" /> AI VISION
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className={`w-14 h-14 rounded-2xl ${config.indicator} flex items-center justify-center text-white shrink-0`}>
            <Icon size={28} />
          </div>
          <div>
            <h4 className={`text-2xl font-bold ${config.text}`}>{config.title}</h4>
            <p className="text-gray-600 text-sm font-medium mt-1">{message}</p>
          </div>
        </div>

        {found.length > 0 && (
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-3">Wykryte składniki:</p>
            <div className="flex flex-wrap gap-2">
              {found.map((item, index) => (
                <span key={index} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-700 capitalize">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- GŁÓWNY SKANER ---
export default function ScannerPage() {
  const [activeTab, setActiveTab] = useState<'scan' | 'ai-photo'>('scan');
  const [barcode, setBarcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // 1. SKANER KODÓW
  const startBarcodeScanner = () => {
    setIsCameraOpen(true); setResult(null); setError(null);
    setTimeout(() => {
      const html5QrCode = new Html5Qrcode('reader');
      scannerRef.current = html5QrCode;
      html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
        (decodedText) => { stopBarcodeScanner(); setBarcode(decodedText); handleScan(decodedText); },
        () => {}
      ).catch(() => { setIsCameraOpen(false); setError('Brak dostępu do kamery.'); });
    }, 100);
  };

  const stopBarcodeScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().then(() => { scannerRef.current?.clear(); setIsCameraOpen(false); }).catch(console.error);
    } else { setIsCameraOpen(false); }
  };

  // 2. OPEN FOOD FACTS
  const handleScan = async (codeToScan?: string) => {
    const code = codeToScan || barcode;
    if (!code) return;
    setLoading(true); setError(null); setResult(null);

    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
      const data = await response.json();

      if (data.status === 0) { setError('missing_product'); setLoading(false); return; }

      const product = data.product;
      const txt = product.ingredients_text_pl || product.ingredients_text_en || product.ingredients_text || '';
      const analysisResult = analyzeIngredients(txt) as AnalysisResult;

      setResult({
        analysis: analysisResult,
        productName: product.product_name_pl || product.product_name || 'Produkt bez nazwy',
        productBrand: product.brands || 'Nieznana marka',
        source: 'DB',
      });
    } catch { setError('Błąd połączenia.'); } finally { setLoading(false); }
  };

  // 3. AI VISION
  const startAiCamera = async () => {
    setIsCameraOpen(true); setResult(null); setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      setTimeout(() => { if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); } }, 100);
    } catch { setIsCameraOpen(false); setError('Brak dostępu do kamery.'); }
  };

  const stopAiCamera = () => {
    if (streamRef.current) { streamRef.current.getTracks().forEach(track => track.stop()); streamRef.current = null; }
    setIsCameraOpen(false);
  };

  const captureAiPhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const base64Image = canvas.toDataURL('image/jpeg');
    stopAiCamera();
    sendToAi(base64Image);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => { if (typeof reader.result === 'string') sendToAi(reader.result); };
  };

  const sendToAi = async (base64Image: string) => {
    setLoading(true); setError(null); setResult(null);
    try {
      const compressedImage = await compressImage(base64Image);
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: compressedImage }),
      });
      const aiData = await response.json();
      if (aiData.error) throw new Error(aiData.error);
      const status: AnalysisStatus = ['RED','YELLOW','GREEN'].includes(aiData.status) ? aiData.status : 'UNKNOWN';

      setResult({
        analysis: {
          status: status,
          found: aiData.found || [],
          message: status === 'UNKNOWN' ? (aiData.message || "Błąd odczytu.") : (status === 'RED' ? 'AI wykryło składniki niedozwolone.' : 'AI oceniło skład jako bezpieczny.'),
        },
        productName: 'Analiza ze zdjęcia',
        productBrand: 'Skan AI Vision',
        source: 'AI',
      });
    } catch { setError('Nie udało się odczytać zdjęcia. Spróbuj ponownie.'); } finally { setLoading(false); }
  };

  const switchTab = (tab: 'scan' | 'ai-photo') => {
    setActiveTab(tab); setResult(null); setError(null); stopBarcodeScanner(); stopAiCamera();
  };

  return (
    <div className="min-h-screen bg-white text-lime-950 font-sans selection:bg-lime-200">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-white border-b border-lime-100">
          <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 text-lime-900 hover:text-lime-600 transition-colors">
                  <ArrowLeft size={20} />
                  <span className="text-sm font-bold">Wróć</span>
              </Link>
              <div className="flex items-center gap-2 font-bold text-lime-950">
                  <Leaf size={18} className="text-lime-600" />
                  <span>FoodPal</span>
              </div>
              <div className="w-8"></div>
          </div>
      </nav>

      <main className="pt-24 pb-20 px-4 max-w-md mx-auto flex flex-col items-center">
        
        {/* TABS - Czyste kolory avocado */}
        <div className="w-full bg-lime-50 p-1.5 rounded-2xl flex mb-6 border border-lime-200">
          <button
            onClick={() => switchTab('scan')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'scan' ? 'bg-lime-600 text-white shadow-none' : 'text-lime-700 hover:bg-lime-100'
            }`}
          >
            <ScanBarcode size={18} /> Kod EAN
          </button>
          <button
            onClick={() => switchTab('ai-photo')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              // Dark Avocado dla AI Vision
              activeTab === 'ai-photo' ? 'bg-lime-900 text-white shadow-none' : 'text-lime-700 hover:bg-lime-100'
            }`}
          >
            <Sparkles size={18} /> AI Vision
          </button>
        </div>

        {/* --- WIDOK 1: SKANER KODÓW --- */}
        {activeTab === 'scan' && (
          <div className="w-full flex flex-col gap-4">
            <AnimatePresence>
              {isCameraOpen ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative rounded-3xl overflow-hidden border-4 border-lime-600 bg-black aspect-square">
                  <button onClick={stopBarcodeScanner} className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full z-20 hover:bg-black/70"><X size={20} /></button>
                  <div id="reader" className="w-full h-full"></div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-3xl border border-lime-200">
                  <button onClick={startBarcodeScanner} className="w-full aspect-[4/3] bg-lime-50 border-2 border-dashed border-lime-300 rounded-2xl flex flex-col items-center justify-center gap-3 text-lime-800 hover:bg-lime-100 transition-colors group mb-6">
                    <div className="p-4 bg-white rounded-full shadow-none border border-lime-100 group-hover:scale-110 transition-transform text-lime-600">
                        <Camera size={32} />
                    </div>
                    <span className="font-bold">Uruchom Kamerę</span>
                  </button>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      placeholder="Lub wpisz kod EAN..."
                      className="flex-1 bg-white border border-lime-200 rounded-xl px-4 text-lime-950 text-sm focus:outline-none focus:border-lime-600 transition-all placeholder:text-lime-900/40"
                    />
                    <button onClick={() => handleScan(undefined)} className="bg-lime-950 hover:bg-lime-800 text-white rounded-xl px-5 flex items-center justify-center transition-colors">
                      {loading ? <Loader2 className="animate-spin" /> : <ScanBarcode size={20} />}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* --- WIDOK 2: AI VISION (CIEMNY MOTYW DLA AI) --- */}
        {activeTab === 'ai-photo' && (
          <div className="w-full flex flex-col gap-4">
            <AnimatePresence>
              {isCameraOpen ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative rounded-3xl overflow-hidden border-4 border-lime-800 bg-black aspect-[3/4]">
                  <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted></video>
                  <button onClick={stopAiCamera} className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full z-20 hover:bg-black/70"><X size={20} /></button>
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
                    <button onClick={captureAiPhoto} className="w-20 h-20 rounded-full border-4 border-white bg-white/20 flex items-center justify-center active:scale-90 transition-transform">
                      <div className="w-16 h-16 bg-white rounded-full shadow-lg"></div>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-3xl border border-lime-200">
                    {/* INFO BOX: DARK AVOCADO */}
                    <div className="bg-lime-900 p-5 rounded-2xl mb-6 text-center">
                        <div className="flex justify-center mb-2 text-lime-300">
                            <Sparkles size={24} />
                        </div>
                        <h4 className="font-bold text-white mb-1">Inteligentna Analiza</h4>
                        <p className="text-lime-200 text-sm">Zrób zdjęcie składu, a AI wykryje pułapki.</p>
                    </div>
                  
                    {/* PRZYCISK */}
                    <button onClick={startAiCamera} className="w-full py-4 bg-lime-600 hover:bg-lime-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 mb-4 transition-all active:scale-[0.98]">
                      <Camera size={20} /> Otwórz Aparat
                    </button>

                    <div className="relative flex items-center gap-3 mb-4">
                      <div className="h-px bg-lime-100 flex-1" />
                      <span className="text-[10px] font-bold text-lime-400 uppercase tracking-widest">lub wgraj plik</span>
                      <div className="h-px bg-lime-100 flex-1" />
                    </div>

                    <label className="w-full bg-white border border-lime-200 hover:bg-lime-50 text-lime-800 rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors">
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
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-10">
                        <Loader2 className="animate-spin mx-auto text-lime-600 mb-3" size={32} />
                        <p className="text-sm font-bold text-lime-900 animate-pulse">Analizuję produkt...</p>
                    </motion.div>
                )}

                {/* BŁĄD -> PRZEKIEROWANIE DO AI */}
                {error === 'missing_product' && !loading && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-lime-200 p-8 rounded-3xl text-center">
                        <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3 text-amber-500">
                            <AlertTriangle size={24} />
                        </div>
                        <h3 className="text-lime-950 font-bold mb-1">Brak w bazie</h3>
                        <p className="text-lime-800 text-sm mb-6">Nie znaleźliśmy tego kodu.</p>
                        <button onClick={() => switchTab('ai-photo')} className="w-full bg-lime-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-lime-800 transition-all flex items-center justify-center gap-2">
                            <Sparkles size={18} /> Użyj AI Vision
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
  );
}