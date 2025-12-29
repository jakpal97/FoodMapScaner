// --- fodmap_rules.js ---

// 🔴 CZERWONA LISTA - Silne wyzwalacze (High FODMAP)
// Jeśli znajdziemy COKOLWIEK stąd -> wynik jest CZERWONY.
const highFodmapIngredients = [
    // Fruktany i GOS (Cebulowe/Strączkowe)
    "cebula", "cebuli", "cebulę", "cebulowy",
    "czosnek", "czosnku", "czosnkowy",
    "por", "pora",
    "szalotka",
    "inulina", // Bardzo częsty dodatek "fit", zabójczy dla IBS
    "błonnik z cykorii",
    "korzeń cykorii",
    "fruktooligosacharydy", "fos",
    
    // Strączki (jeśli nie są w puszce/dobrze przetworzone)
    "fasola",
    "soczewica",
    "ciecierzyca",
    "groch", "groszek",
    "soja", "ziarno soi", "mąka sojowa",
  
    // Słodziki (Poliole - końcówki "-ol")
    "sorbitol", "e420",
    "mannitol", "e421",
    "ksylitol", "e967",
    "maltitol", "e965",
    "izomalt", "e953",
    "erytrytol", "erytryt", // Czasem tolerowany, ale bezpieczniej dać na czerwoną w MVP
  
    // Fruktoza (Nadmiar)
    "syrop glukozowo-fruktozowy",
    "syrop fruktozowy",
    "syrop kukurydziany wysokofruktozowy", "hfcs",
    "fruktoza",
    "miód",
    "syrop z agawy",
    "zagęszczony sok owocowy", // Często jabłkowy/gruszkowy
  
    // Konkretne owoce/warzywa (częste w składach)
    "jabłko", "jabłkowy", "sok jabłkowy",
    "gruszka", "gruszkowy",
    "mango",
    "jeżyny",
    "kalafior",
    "grzyby", "pieczarki"
  ];
  
  // 🟡 ŻÓŁTA LISTA - Ostrzegawcza (Ryzykowne / Zależne od ilości)
  // Sprawdzamy ją TYLKO, jeśli nie znaleziono nic czerwonego.
  const moderateRiskIngredients = [
    // Zboża (Fruktany - zależne od ilości)
    "mąka pszenna", "pszenica", "pszenny",
    "gluten pszenny",
    "żyto", "żytni", "mąka żytnia",
    "jęczmień", "słód jęczmienny",
    "orkisz",
  
    // Nabiał (Laktoza - nie każdy ma nietolerancję, ale warto ostrzec)
    "mleko", "mleko w proszku",
    "śmietana", "śmietanka",
    "maślanka",
    "serwatka",
    "laktoza",
  
    // Ukryte pułapki
    "aromaty", // Często ukrywają czosnek/cebulę w słonych produktach
    "aromat",
    "przyprawy", // Jak wyżej
    "mieszanka przypraw",
    "naturalne aromaty",
    "błonnik roślinny" // Jeśli nie jest sprecyzowany, może być inuliną
  ];
  
  /**
   * GŁÓWNA FUNKCJA ANALIZUJĄCA
   * Bierze tekst składników i zwraca status oraz znalezione problemy.
   */
  export function analyzeIngredients(ingredientsText) {
    if (!ingredientsText) {
      return { status: 'UNKNOWN', found: [], message: "Brak danych o składnikach." };
    }
  
    // Normalizacja tekstu (małe litery, żeby 'Cebula' == 'cebula')
    const normalizedText = ingredientsText.toLowerCase();
    
    // 1. Sprawdź CZERWONĄ listę (Priorytet)
    const redFlags = highFodmapIngredients.filter(ingredient => 
      normalizedText.includes(ingredient)
    );
  
    if (redFlags.length > 0) {
      // Usuwamy duplikaty (np. znaleziono "cebula" i "cebuli") i bierzemy unikalne bazy
      const uniqueRedFlags = [...new Set(redFlags)];
      return { 
        status: 'RED', 
        found: uniqueRedFlags, 
        message: "Wykryto silne wyzwalacze FODMAP." 
      };
    }
  
    // 2. Jeśli czysto, sprawdź ŻÓŁTĄ listę
    const yellowFlags = moderateRiskIngredients.filter(ingredient => 
      normalizedText.includes(ingredient)
    );
  
    if (yellowFlags.length > 0) {
       const uniqueYellowFlags = [...new Set(yellowFlags)];
      return { 
        status: 'YELLOW', 
        found: uniqueYellowFlags, 
        message: "Wykryto składniki ryzykowne lub zależne od ilości." 
      };
    }
  
    // 3. Jeśli nic nie znaleziono -> ZIELONY
    return { 
      status: 'GREEN', 
      found: [], 
      message: "Nie wykryto typowych wyzwalaczy. Produkt wygląda bezpiecznie." 
    };
  }