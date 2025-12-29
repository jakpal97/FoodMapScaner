# 🚀 **Skaner Jelita - Quick Start Guide**

## ✅ **CO ZOSTAŁO DODANE - Szybkie Info**

### 1️⃣ **Kliknij na składnik = Zobacz szczegóły**
- Wykryto cebulę? Kliknij na nią!
- Zobaczysz: dlaczego szkodzi, czym zastąpić, objawy

### 2️⃣ **Alternatywy automatyczne**
- Produkt RED? Przewiń w dół
- Aplikacja podpowie zamienniki

### 3️⃣ **Baza bezpiecznych produktów**
- Kliknij "Bezpieczne" w prawym górnym rogu
- Zobacz co mogą jeść inni z IBS

### 4️⃣ **AI jest teraz mądrzejsze**
- Wykrywa ukryte składniki
- Pokazuje "Pewność" wyniku
- Rozpoznaje numery E (E420, E967...)

### 5️⃣ **PWA - Zainstaluj na telefonie**
- Otwórz na telefonie
- Chrome/Safari zaproponuje "Dodaj do ekranu"
- Działa jak normalna aplikacja!

---

## 🎯 **Szybki Test**

### **Test 1: Modal ze szczegółami**
1. Wpisz kod: `5900259120007` (przykładowy produkt z cebulą)
2. Kliknij na wykryty składnik
3. Zobaczysz modal z pełnymi informacjami

### **Test 2: Alternatywy**
1. Zeskanuj produkt RED
2. Przewiń w dół
3. Zobacz sekcję "Czym zastąpić?"

### **Test 3: Bezpieczne produkty**
1. Kliknij "Bezpieczne" (prawy górny róg skanera)
2. Wyszukaj "mleko"
3. Zobacz mleko ryżowe Alpro

### **Test 4: AI Vision z confidence**
1. Zakładka "AI Vision"
2. Zrób zdjęcie etykiety
3. Sprawdź "Pewność: XX%" w wyniku

---

## 📝 **Nowe Pliki**

```
src/app/
├── fodmap_database.ts          ← Baza 120+ składników
├── fodmap_analyzer.ts          ← Inteligentny algorytm
├── components/
│   └── IngredientModal.tsx     ← Modal ze szczegółami
├── safe-products/
│   └── page.tsx                ← Strona z bazą produktów
└── api/analyze-image/
    └── route.js                ← Lepszy AI + rate limiting

public/
└── manifest.json               ← Konfiguracja PWA
```

---

## 🔧 **Jak dodać więcej składników?**

Edytuj: `src/app/fodmap_database.ts`

```typescript
export const ingredientDatabase = {
  // ... istniejące ...
  
  'nowy_skladnik': {
    name: 'Nazwa Składnika',
    severity: 8, // 1-10
    category: 'fructans', // lub polyols, lactose...
    fodmapType: 'Fruktany',
    why: 'Dlaczego jest szkodliwy',
    symptoms: ['Wzdęcia', 'Bóle'],
    whereFound: ['Produkty X', 'Produkty Y'],
    monashStatus: 'HIGH',
    alternatives: ['Zamiennik 1', 'Zamiennik 2'],
    aliases: ['inne nazwy na etykiecie']
  }
}
```

---

## 🏪 **Jak dodać produkt do bazy bezpiecznych?**

Edytuj: `src/app/fodmap_database.ts` → `safeProductsDatabase`

```typescript
{
  name: 'Nazwa produktu',
  brand: 'Marka',
  category: 'Pieczywo', // lub Napoje, Makarony...
  barcode: '1234567890123', // opcjonalnie
  status: 'GREEN', // lub YELLOW
  whereToFind: ['Biedronka', 'Lidl'],
  notes: 'Dodatkowe info',
  communityRating: 4.5, // 1-5
  scansCount: 100
}
```

---

## ⚙️ **Zmiana limitu API**

Edytuj: `src/app/api/analyze-image/route.js`

```javascript
const MAX_REQUESTS_PER_HOUR = 20; // Zmień na np. 50
```

---

## 🎨 **Zmiana ikon PWA**

1. Stwórz 2 pliki:
   - `public/icon-192.png` (192x192px)
   - `public/icon-512.png` (512x512px)

2. Użyj logo aplikacji lub `leaf` emoji 🌱

Online generator: https://favicon.io/

---

## 💡 **FAQ**

**Q: Czy mogę używać offline?**
A: PWA cache'uje stronę, ale AI wymaga internetu.

**Q: Jak zwiększyć limit skanów?**
A: Edytuj `MAX_REQUESTS_PER_HOUR` w `route.js`.

**Q: Czy można dodać konta użytkowników?**
A: Tak, ale wymaga backendu (Firebase/Supabase).

**Q: Dlaczego AI zwraca "Nieczytelne"?**
A: Zrób wyraźniejsze zdjęcie w dobrym świetle.

---

## 🚀 **Gotowe!**

Wszystkie funkcje działają od razu po:
```bash
npm run dev
```

Otwórz: `http://localhost:3000`

---

**Made with ❤️ for IBS Warriors**

