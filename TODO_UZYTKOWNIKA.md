# ✅ **TODO - Co musisz jeszcze zrobić**

## 🔴 **KRYTYCZNE (Zrób teraz)**

### 1. **Dodaj ikony PWA** ⭐⭐⭐
```
Potrzebne:
- public/icon-192.png (192x192 px)
- public/icon-512.png (512x512 px)

Jak stworzyć:
1. Użyj logo lub emoji 🌱
2. Generator: https://favicon.io/
3. Pobierz i wklej do /public
```

**Dlaczego:** Bez ikon PWA nie zainstaluje się poprawnie na telefonie.

---

### 2. **Sprawdź klucz OpenAI** ⭐⭐⭐
```
Plik: .env.local

Upewnij się że masz:
OPENAI_API_KEY=sk-proj-...
```

**Sprawdź:** Zrób testowe skanowanie AI Vision.

---

## 🟡 **WAŻNE (Zrób w tym tygodniu)**

### 3. **Przetestuj PWA na telefonie** ⭐⭐
1. Wdróż na Vercel/Netlify
2. Otwórz na telefonie
3. Kliknij "Dodaj do ekranu głównego"
4. Sprawdź czy działa

---

### 4. **Rozbuduj bazę bezpiecznych produktów** ⭐⭐
```
Plik: src/app/fodmap_database.ts
Sekcja: safeProductsDatabase

Dodaj:
- Produkty z twojego sklepu
- Ulubione marki
- Produkty z polskich sieci
```

**Target:** Minimum 20-30 produktów

---

### 5. **Dodaj więcej składników** ⭐
```
Plik: src/app/fodmap_database.ts

Brakujące składniki:
- Więcej owoców (kiwi, pomarańcze...)
- Przyprawy (kurkuma, imbir...)
- Dodatki (gumy, emulgatory...)
- E-numery (sprawdź listę polioli)
```

---

## 🟢 **OPCJONALNE (Nice to have)**

### 6. **Dodaj analytics**
```bash
npm install @vercel/analytics
```

Sprawdź:
- Ile skanów dziennie
- Jakie produkty najczęściej
- Błędy AI

---

### 7. **Stwórz stronę "O aplikacji"**
```
/about - Historia, misja, kontakt
```

---

### 8. **Dodaj FAQ**
```
/faq - Najczęściej zadawane pytania
```

---

### 9. **Newsletter / Community**
```
- Discord server dla użytkowników
- Newsletter z nowymi produktami
- Instagram z tipami
```

---

## 📊 **MONITORING**

### **Co sprawdzać co tydzień:**
- [ ] Koszty OpenAI (dashboard.openai.com)
- [ ] Liczba skanów (rate limit logs)
- [ ] Błędy w console (Vercel logs)
- [ ] Feedback użytkowników

---

## 🐛 **ZNANE BUGI DO NAPRAWIENIA**

### **Niska prioritet:**
1. Modal - animacja może lagować na starych telefonach
2. Rate limiting - wspólny dla całej rodziny (IP)
3. Brak offline mode dla skanowania (wymaga service worker)

**Fix w przyszłości:** Dodaj konta użytkowników

---

## 🎯 **CEL NA NAJBLIŻSZY MIESIĄC**

- [ ] **100+ produktów** w bazie bezpiecznych
- [ ] **Ikony PWA** działają
- [ ] **20+ nowych składników** w bazie
- [ ] **100 użytkowników** (marketing!)

---

## 💰 **MONETYZACJA (Pomysły)**

Jeśli chcesz zarabiać:

### **Plan Free:**
- 20 skanów AI/dzień
- Podstawowa baza
- Reklamy (opcjonalnie)

### **Plan Premium ($4.99/m):**
- ✅ Unlimited skany AI
- ✅ Historia skanów (cloud)
- ✅ Dziennik objawów
- ✅ Plan posiłków
- ✅ Brak reklam

**Implementacja:** Stripe + NextAuth.js

---

## 📞 **POMOC**

Masz problem?
1. Sprawdź `CHANGELOG.md` - tam jest wszystko opisane
2. Sprawdź `README_NOWE_FUNKCJE.md` - quick start
3. Przeczytaj kod - jest dobrze okomentowany!

---

## ✅ **CHECKLIST PRZED WDROŻENIEM**

Przed Vercel deploy:

- [ ] Ikony PWA dodane (icon-192.png, icon-512.png)
- [ ] .env.local ma OPENAI_API_KEY
- [ ] Przetestowane:
  - [ ] Skanowanie kodów EAN
  - [ ] AI Vision
  - [ ] Klikanie składników (modal)
  - [ ] Strona /safe-products
  - [ ] Rate limiting (21 skan = błąd)
- [ ] Build działa: `npm run build`
- [ ] Brak błędów TypeScript

**Po deploy:**
- [ ] PWA działa na telefonie
- [ ] Wszystkie linki działają
- [ ] AI zwraca wyniki (nie 500)

---

**Good luck! 🚀**

Masz teraz najlepszą aplikację Low-FODMAP w Polsce! 🇵🇱

