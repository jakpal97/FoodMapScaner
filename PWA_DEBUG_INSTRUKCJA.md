# 🔍 **PWA - Instrukcja Debugowania**

## ✅ **CO ZOSTAŁO NAPRAWIONE:**

1. ✅ **Dodano `scope` do manifest.json** - wymagane przez specyfikację
2. ✅ **Dodano debug panel** - widzisz co się dzieje w czasie rzeczywistym
3. ✅ **Poprawiono typy TypeScript** - BeforeInstallPromptEvent
4. ✅ **Dodano sprawdzenie manifest i service worker** - automatyczna diagnostyka

---

## 🔍 **JAK SPRAWDZIĆ DLACZEGO NIE DZIAŁA:**

### **KROK 1: Otwórz DevTools na telefonie**

**Android (Chrome):**
1. Otwórz stronę
2. Menu (⋮) → **"Zdalne debugowanie"** (Remote debugging)
3. Połącz telefon z komputerem przez USB
4. Na komputerze: `chrome://inspect` → znajdź telefon → Inspect

**iOS (Safari):**
1. iPhone: Settings → Safari → Advanced → Web Inspector (ON)
2. Połącz z Mac przez USB
3. Mac: Safari → Develop → [Twoje iPhone] → [Strona]

---

### **KROK 2: Sprawdź Console (F12)**

**Szukaj tych logów:**
```
🔍 PWA Debug: Komponent PWAInstaller załadowany
🔍 PWA Debug: Service Worker jest dostępny
🔍 PWA Debug: ✅ Service Worker zarejestrowany: /
🔍 PWA Debug: ✅ manifest.json dostępny
🔍 PWA Debug: ✅ sw.js dostępny
🔍 PWA Debug: 🎉 Event beforeinstallprompt wywołany!
```

**Jeśli widzisz błędy:**
- ❌ `sw.js błąd: 404` → Service worker nie jest dostępny
- ❌ `manifest.json błąd: 404` → Manifest nie jest dostępny
- ❌ `Service Worker NIE jest dostępny` → Przeglądarka nie obsługuje SW

---

### **KROK 3: Sprawdź Application Tab (F12)**

**Service Workers:**
1. F12 → **Application** → **Service Workers**
2. Powinno być:
   - ✅ `sw.js` z statusem **"activated and is running"**
   - ❌ Jeśli błąd → sprawdź console

**Manifest:**
1. F12 → **Application** → **Manifest**
2. Powinno pokazać:
   - ✅ Name: "Skaner Jelita"
   - ✅ Icons: 2 ikony (192x192, 512x512)
   - ✅ Display: standalone
   - ❌ Jeśli błąd → sprawdź czy ikony istnieją

**Cache Storage:**
1. F12 → **Application** → **Cache Storage**
2. Powinno być: `skaner-jelita-v1` z zasobami

---

## 🚨 **NAJCZĘSTSZE PROBLEMY:**

### **1. Service Worker nie działa (404)**

**Przyczyna:** Next.js może nie serwować `/sw.js` poprawnie

**Rozwiązanie:** Sprawdź czy plik istnieje:
```bash
ls public/sw.js
```

Jeśli nie ma, stwórz ponownie lub użyj Next.js API route.

---

### **2. Manifest.json nie ładuje się**

**Przyczyna:** Błąd w JSON lub brak ikon

**Sprawdź:**
```bash
curl https://twoja-domena.vercel.app/manifest.json
```

Powinien zwrócić poprawny JSON.

---

### **3. beforeinstallprompt nie jest wywoływany**

**Przyczyny:**
- ❌ **Nie jest HTTPS** - PWA wymaga HTTPS (Vercel = automatycznie)
- ❌ **Już zainstalowane** - Jeśli już masz PWA, event nie wystąpi
- ❌ **Brak service workera** - SW jest wymagany
- ❌ **Brak manifest.json** - Manifest jest wymagany
- ❌ **Brak ikon** - Przynajmniej jedna ikona 192x192 jest wymagana
- ❌ **Nie spełnia kryteriów** - Przeglądarka ma własne wymagania

**Wymagania Chrome/Edge:**
- ✅ HTTPS
- ✅ Service Worker zarejestrowany
- ✅ Manifest.json poprawny
- ✅ Ikony (min 192x192)
- ✅ Użytkownik odwiedził stronę (engagement)
- ✅ Nie jest już zainstalowane

---

### **4. iOS Safari nie pokazuje promptu**

**To jest NORMALNE!** iOS Safari **NIE** używa `beforeinstallprompt`.

**Rozwiązanie:**
- Użyj Share (⬆️) → "Dodaj do ekranu początkowego"
- Komponent automatycznie pokazuje instrukcję dla iOS

---

## 🧪 **TESTY DO WYKONANIA:**

### **Test 1: Sprawdź czy wszystko się ładuje**

Otwórz w przeglądarce:
```
https://twoja-domena.vercel.app/manifest.json
https://twoja-domena.vercel.app/sw.js
https://twoja-domena.vercel.app/icon-192.png
https://twoja-domena.vercel.app/icon-512.png
```

Wszystkie powinny się załadować (200 OK).

---

### **Test 2: Sprawdź Service Worker**

1. Otwórz stronę
2. F12 → Application → Service Workers
3. Powinno być: `sw.js` z statusem "activated"

**Jeśli błąd:**
- Sprawdź console - jaki błąd?
- Sprawdź Network tab - czy `/sw.js` się ładuje?

---

### **Test 3: Sprawdź Manifest**

1. F12 → Application → Manifest
2. Kliknij "manifest.json"
3. Sprawdź czy:
   - ✅ Name jest ustawione
   - ✅ Icons się ładują (kliknij na ikonę)
   - ✅ Display: standalone

---

### **Test 4: Sprawdź czy event jest wywoływany**

1. Otwórz console (F12)
2. Wklej:
```javascript
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('🎉 beforeinstallprompt!', e);
});
```
3. Odśwież stronę
4. Jeśli widzisz log → event działa!

---

## 🔧 **ROZWIĄZANIA:**

### **Jeśli Service Worker nie działa:**

**Opcja 1: Użyj Next.js API Route**

Stwórz: `src/app/sw.js/route.ts`
```typescript
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  const swPath = path.join(process.cwd(), 'public', 'sw.js')
  const swContent = fs.readFileSync(swPath, 'utf-8')
  return new NextResponse(swContent, {
    headers: { 'Content-Type': 'application/javascript' }
  })
}
```

**Opcja 2: Sprawdź czy plik jest w public/**

```bash
ls -la public/sw.js
```

---

### **Jeśli Manifest nie działa:**

1. Sprawdź JSON syntax:
```bash
cat public/manifest.json | jq .
```

2. Sprawdź czy ikony istnieją:
```bash
ls public/icon-*.png
```

---

### **Jeśli beforeinstallprompt nie jest wywoływany:**

**To może być normalne jeśli:**
- ✅ Strona jest już zainstalowana
- ✅ Użytkownik już odrzucił instalację (przeglądarka pamięta)
- ✅ Nie spełnia kryteriów engagement (za mało czasu na stronie)

**Rozwiązanie:**
- Wyczyść cache przeglądarki
- Odinstaluj PWA jeśli już jest zainstalowane
- Odwiedź stronę kilka razy (engagement)

---

## 📱 **TEST NA TELEFONIE:**

### **Android:**

1. Otwórz Chrome
2. Wejdź na stronę
3. **Poczekaj 10-30 sekund** (engagement)
4. Powinien pojawić się przycisk "Zainstaluj" (lewy dolny róg)
5. LUB: Menu → "Dodaj do ekranu głównego"

### **iOS:**

1. Otwórz Safari
2. Wejdź na stronę
3. Share (⬆️) → "Dodaj do ekranu początkowego"
4. Gotowe!

---

## 🎯 **CHECKLIST:**

Przed zgłoszeniem problemu sprawdź:

- [ ] Czy jest HTTPS? (Vercel = automatycznie)
- [ ] Czy manifest.json się ładuje? (F12 → Application → Manifest)
- [ ] Czy service worker działa? (F12 → Application → Service Workers)
- [ ] Czy ikony istnieją? (`ls public/icon-*.png`)
- [ ] Czy console pokazuje błędy? (F12 → Console)
- [ ] Czy debug panel pokazuje info? (prawy górny róg w dev mode)
- [ ] Czy strona nie jest już zainstalowana?
- [ ] Czy użytkownik spędził >10 sekund na stronie?

---

## 💡 **DEBUG PANEL (Development Mode)**

W trybie development (`npm run dev`) zobaczysz:
- Czarny panel w prawym górnym rogu
- Wszystkie logi PWA w czasie rzeczywistym
- Informacje o błędach

**Użyj tego do diagnozy!**

---

## 🚀 **DEPLOY I TEST:**

```bash
git add .
git commit -m "Fix PWA: Add scope, debug panel, better error handling"
git push
```

Po wdrożeniu:
1. Otwórz na telefonie
2. Sprawdź console (zdalne debugowanie)
3. Zobacz debug panel (jeśli dev mode)
4. Sprawdź Application tab

---

**Jeśli nadal nie działa, wyślij:**
- Screenshot z Application → Service Workers
- Screenshot z Application → Manifest
- Console logs (F12 → Console)
- Debug panel output

**Wtedy będę mógł dokładnie zdiagnozować problem!** 🔍

