// --- fodmap_database.ts ---
// Kompletna baza FODMAP z detalami, alternatywami i scoring

export interface IngredientDetails {
	name: string
	severity: number // 1-10
	category: 'fructans' | 'galactans' | 'polyols' | 'fructose' | 'lactose' | 'other'
	fodmapType: string
	why: string
	symptoms: string[]
	whereFound: string[]
	monashStatus: 'HIGH' | 'MODERATE' | 'LOW'
	safeServing?: string
	alternatives: string[]
	aliases: string[] // Różne nazwy tego samego składnika
}

// ========== SZCZEGÓŁOWA BAZA SKŁADNIKÓW ==========
export const ingredientDatabase: Record<string, IngredientDetails> = {
	// === FRUKTANY (FRUCTANS) ===
	cebula: {
		name: 'Cebula',
		severity: 10,
		category: 'fructans',
		fodmapType: 'Fruktany (Fructans)',
		why: 'Zawiera bardzo wysokie stężenie fruktozanów, które fermentują w jelitach',
		symptoms: ['Wzdęcia', 'Bóle brzucha', 'Gazy', 'Biegunka'],
		whereFound: ['Sosy gotowe', 'Przyprawy', 'Zupy instant', 'Buliony'],
		monashStatus: 'HIGH',
		safeServing: 'BRAK - unikaj całkowicie',
		alternatives: [
			'Zielona część pora (tylko zielony pióra)',
			'Oliwa infuzowana cebulą (olejek bez cząstek)',
			'Szczypiorek w małych ilościach',
		],
		aliases: ['cebula', 'cebuli', 'cebulę', 'cebulowy', 'cebulowa', 'proszek cebulowy', 'ekstrakt cebulowy'],
	},

	czosnek: {
		name: 'Czosnek',
		severity: 10,
		category: 'fructans',
		fodmapType: 'Fruktany (Fructans)',
		why: 'Najsilniejszy wyzwalacz FODMAP - ekstremalnie wysoka zawartość fruktozanów',
		symptoms: ['Silne wzdęcia', 'Bóle brzucha', 'Kolka jelitowa', 'Gazy'],
		whereFound: ['Sosy', 'Marynaty', 'Przyprawy gotowe', 'Masło czosnkowe'],
		monashStatus: 'HIGH',
		safeServing: 'BRAK - unikaj całkowicie',
		alternatives: [
			'Oliwa czosnkowa (olejek, NIE olej z kawałkami)',
			'Hing/Asafoetida (indyjska przyprawa)',
			'Infuzja oliwy (podgrzej oliwę z czosnkiem, wyrzuć ząbki)',
		],
		aliases: ['czosnek', 'czosnku', 'czosnkowy', 'czosnkowa', 'proszek czosnkowy', 'granulat czosnkowy'],
	},

	inulina: {
		name: 'Inulina',
		severity: 10,
		category: 'fructans',
		fodmapType: 'Fruktany (Fructans)',
		why: 'Rozpuszczalny błonnik z cykorii - celowo dodawany, silnie fermentujący',
		symptoms: ['Ekstremalne wzdęcia', 'Gazy', 'Dyskomfort brzucha'],
		whereFound: ['Batony fit', 'Jogurty proteinowe', 'Suplementy błonnika', 'Lody light'],
		monashStatus: 'HIGH',
		safeServing: 'BRAK',
		alternatives: ['Błonnik z psyllium (łupiny babki jajowatej)', 'Pektyny', 'Babka jajowata'],
		aliases: ['inulina', 'błonnik z cykorii', 'korzeń cykorii', 'ekstrakt z cykorii', 'fruktooligosacharydy', 'fos'],
	},

	pszenica: {
		name: 'Pszenica',
		severity: 7,
		category: 'fructans',
		fodmapType: 'Fruktany (Fructans)',
		why: 'Zawiera fruktany, ale dozwolona w małych ilościach',
		symptoms: ['Wzdęcia (jeśli główny składnik)', 'Dyskomfort'],
		whereFound: ['Chleb', 'Makaron', 'Ciastka', 'Pizza'],
		monashStatus: 'MODERATE',
		safeServing: ''Do 2 kromek chleba dziennie',
		alternatives: ['Chleb bezglutenowy', 'Mąka ryżowa', 'Mąka gryczana', 'Orkisz (niektórzy tolerują)'],
		aliases: ['pszenica', 'mąka pszenna', 'pszenny', 'pszenna', 'gluten pszenny'],
	},

	// === GALAKTANY (GALACTANS) ===
	fasola: {
		name: 'Fasola',
		severity: 8,
		category: 'galactans',
		fodmapType: 'Galaktany (Galactans)',
		why: 'Wysokie stężenie galakto-oligosacharydów (GOS)',
		symptoms: ['Wzdęcia', 'Gazy', 'Dyskomfort'],
		whereFound: ['Konserwy', 'Zupy', 'Dania meksykańskie'],
		monashStatus: 'HIGH',
		safeServing: 'Fasola z puszki po spłukaniu - max 46g',
		alternatives: ['Tofu (fermentowane soja)', 'Tempeh', 'Soczewica z puszki (wypłukana, małe ilości)'],
		aliases: ['fasola', 'fasoli'],
	},

	soja: {
		name: 'Soja',
		severity: 7,
		category: 'galactans',
		fodmapType: 'Galaktany (Galactans)',
		why: 'Zawiera GOS, ale fermentowane produkty sojowe są OK',
		symptoms: ['Wzdęcia', 'Gazy'],
		whereFound: ['Mleko sojowe', 'Białko sojowe', 'Mąka sojowa'],
		monashStatus: 'HIGH',
		safeServing: 'Tofu i tempeh są OK (fermentowane)',
		alternatives: ['Mleko migdałowe', 'Mleko ryżowe', 'Tofu (OK)', 'Tempeh (OK)'],
		aliases: ['soja', 'sojowe', 'mąka sojowa', 'białko sojowe', 'lecytyna sojowa'],
	},

	// === POLIOLE (POLYOLS) ===
	sorbitol: {
		name: 'Sorbitol',
		severity: 10,
		category: 'polyols',
		fodmapType: 'Poliole (Polyols)',
		why: 'Sztuczny słodzik - nie wchłania się, fermentuje w jelitach',
		symptoms: ['Biegunka', 'Wzdęcia', 'Bóle brzucha'],
		whereFound: ['Gumy do żucia', 'Cukierki bez cukru', 'Napoje light'],
		monashStatus: 'HIGH',
		safeServing: 'BRAK',
		alternatives: ['Cukier trzcinowy', 'Glukoza', 'Stewia (czysta)', 'Syrop klonowy'],
		aliases: ['sorbitol', 'e420', 'e-420'],
	},

	ksylitol: {
		name: 'Ksylitol',
		severity: 10,
		category: 'polyols',
		fodmapType: 'Poliole (Polyols)',
		why: 'Sztuczny słodzik z brzozowy - silny efekt przeczyszczający',
		symptoms: ['Biegunka', 'Bóle brzucha', 'Gazy'],
		whereFound: ['Gumy', 'Pasty do zębów', 'Lody light', 'Suplementy'],
		monashStatus: 'HIGH',
		safeServing: 'BRAK',
		alternatives: ['Cukier', 'Glukoza', 'Syrop klonowy', 'Stewia'],
		aliases: ['ksylitol', 'e967', 'xylitol'],
	},

	erytrytol: {
		name: 'Erytrytol',
		severity: 6,
		category: 'polyols',
		fodmapType: 'Poliole (Polyols)',
		why: 'Lepiej tolerowany niż inne poliole, ale wciąż ryzykowny',
		symptoms: ['Wzdęcia (w dużych ilościach)', 'Dyskomfort'],
		whereFound: ['Słodziki keto', 'Lody fit', 'Batony proteinowe'],
		monashStatus: 'MODERATE',
		safeServing: 'Do 10g dziennie',
		alternatives: ['Cukier', 'Stewia (czysta)', 'Syrop klonowy'],
		aliases: ['erytrytol', 'erytrol', 'e968'],
	},

	// === FRUKTOZA (FRUCTOSE) ===
	miod: {
		name: 'Miód',
		severity: 9,
		category: 'fructose',
		fodmapType: 'Fruktoza (nadmiar)',
		why: 'Wysoka zawartość wolnej fruktozy przekraczającej glukozę',
		symptoms: ['Wzdęcia', 'Biegunka', 'Dyskomfort'],
		whereFound: ['Słodycze', 'Granole', 'Dressingi', 'Sosy BBQ'],
		monashStatus: 'HIGH',
		safeServing: 'Max 1 łyżeczka (7g)',
		alternatives: ['Syrop klonowy (czysty)', 'Cukier trzcinowy', 'Glukoza'],
		aliases: ['miód', 'miod', 'miodowy'],
	},

	'syrop glukozowo-fruktozowy': {
		name: 'Syrop glukozowo-fruktozowy',
		severity: 10,
		category: 'fructose',
		fodmapType: 'Fruktoza w nadmiarze',
		why: 'Wysoka zawartość wolnej fruktozy - główny wróg IBS',
		symptoms: ['Silne wzdęcia', 'Biegunka', 'Bóle'],
		whereFound: ['Napoje gazowane', 'Słodycze', 'Ketchupy', 'Jogurty owocowe'],
		monashStatus: 'HIGH',
		safeServing: 'BRAK',
		alternatives: ['Cukier biały', 'Glukoza', 'Syrop klonowy'],
		aliases: [
			'syrop glukozowo-fruktozowy',
			'hfcs',
			'syrop kukurydziany wysokofruktozowy',
			'syrop fruktozowy',
			'izoglukoza',
		],
	},

	// === LAKTOZA (LACTOSE) ===
	mleko: {
		name: 'Mleko',
		severity: 7,
		category: 'lactose',
		fodmapType: 'Laktoza (Lactose)',
		why: 'Cukier mleczny - wymaga enzymu laktazy do trawienia',
		symptoms: ['Wzdęcia', 'Biegunka', 'Gazy', 'Kolka'],
		whereFound: ['Jogurty', 'Desery', 'Sosy śmietanowe', 'Kakao'],
		monashStatus: 'MODERATE',
		safeServing: 'Bezlaktozowe OK, normalne max 125ml',
		alternatives: ['Mleko bez laktozy', 'Mleko migdałowe', 'Mleko ryżowe', 'Mleko kokosowe'],
		aliases: ['mleko', 'mleko w proszku', 'laktoza'],
	},

	// === OWOCE HIGH FODMAP ===
	jablko: {
		name: 'Jabłko',
		severity: 8,
		category: 'fructose',
		fodmapType: 'Fruktoza i sorbitol',
		why: 'Zawiera zarówno nadmiar fruktozy jak i sorbitol',
		symptoms: ['Wzdęcia', 'Dyskomfort', 'Gazy'],
		whereFound: ['Soki', 'Kompoty', 'Musy', 'Ciastka owocowe'],
		monashStatus: 'HIGH',
		safeServing: 'Max 20g (1/4 małego jabłka)',
		alternatives: ['Jagody', 'Truskawki', 'Pomarańcze', 'Kiwi'],
		aliases: ['jabłko', 'jabłkowy', 'sok jabłkowy', 'koncentrat jabłkowy', 'jabłka'],
	},

	// === AROMATY I UKRYTE SKŁADNIKI ===
	aromaty: {
		name: 'Aromaty',
		severity: 6,
		category: 'other',
		fodmapType: 'Niezidentyfikowane (może zawierać FODMAP)',
		why: 'Ogólne określenie - może ukrywać cebulę, czosnek lub inne FODMAP',
		symptoms: ['Zmienne - zależnie od ukrytych składników'],
		whereFound: ['Chipsy', 'Zupki', 'Sosy', 'Przyprawy'],
		monashStatus: 'MODERATE',
		safeServing: 'Unikaj jeśli możliwe',
		alternatives: ['Produkty z wyszczególnionymi przyprawami', 'Naturalne zioła i przyprawy'],
		aliases: ['aromaty', 'aromat', 'naturalne aromaty', 'aromaty naturalne', 'substancje aromatyzujące'],
	},
}

// ========== LISTY SKŁADNIKÓW (rozszerzone) ==========
export const highFodmapIngredients = [
	// Fruktany - Warzywa
	'cebula',
	'cebuli',
	'cebulę',
	'cebulowy',
	'cebulowa',
	'proszek cebulowy',
	'czosnek',
	'czosnku',
	'czosnkowy',
	'czosnkowa',
	'proszek czosnkowy',
	'granulat czosnkowy',
	'por',
	'pora',
	'szalotka',
	'szalotki',

	// Fruktany - Dodatki
	'inulina',
	'błonnik z cykorii',
	'korzeń cykorii',
	'ekstrakt z cykorii',
	'fruktooligosacharydy',
	'fos',
	'oligofruktoza',
	'korzen topinamburu',
	'topinambur',

	// Fruktany - Zboża (główne składniki)
	'pszenica',
	'mąka pszenna',
	'gluten pszenny',

	// Galaktany - Strączki
	'fasola',
	'fasoli',
	'fasolka',
	'soczewica',
	'ciecierzyca',
	'groch',
	'groszek',
	'soja',
	'ziarno soi',
	'mąka sojowa',
	'białko sojowe',

	// Poliole - Słodziki
	'sorbitol',
	'e420',
	'mannitol',
	'e421',
	'ksylitol',
	'xylitol',
	'e967',
	'maltitol',
	'e965',
	'izomalt',
	'e953',
	'erytrytol',
	'erytrol',
	'e968',

	// Fruktoza - nadmiar
	'syrop glukozowo-fruktozowy',
	'syrop fruktozowy',
	'syrop kukurydziany wysokofruktozowy',
	'hfcs',
	'izoglukoza',
	'fruktoza',
	'miód',
	'miod',
	'syrop z agawy',
	'nektar z agawy',
	'zagęszczony sok owocowy',

	// Owoce HIGH
	'jabłko',
	'jabłkowy',
	'sok jabłkowy',
	'koncentrat jabłkowy',
	'gruszka',
	'gruszkowy',
	'mango',
	'brzoskwinia',
	'morela',
	'śliwka',
	'wiśnia',
	'czereśnia',
	'arbuz',
	'jeżyny',
	'suszone owoce',
	'daktyle',
	'rodzynki',
	'figi',

	// Warzywa HIGH
	'kalafior',
	'grzyby',
	'pieczarki',
	'szparagi',
	'brokuł',
	'brukselka',
	'buraki',

	// Orzechy HIGH
	'pistacje',
	'nerkowce',
	'nerkowiec',
]

export const moderateRiskIngredients = [
	// Zboża - moderate
	'żyto',
	'żytni',
	'mąka żytnia',
	'jęczmień',
	'jęczmienny',
	'słód jęczmienny',
	'orkisz',
	'orkiszowy',

	// Laktoza
	'mleko',
	'mleko w proszku',
	'śmietana',
	'śmietanka',
	'maślanka',
	'serwatka',
	'laktoza',

	// Ukryte składniki
	'aromaty',
	'aromat',
	'przyprawy',
	'mieszanka przypraw',
	'naturalne aromaty',
	'substancje aromatyzujące',
	'błonnik roślinny',
	'ekstrakt drożdżowy',

	// Warzywa moderate
	'kukurydza',
	'kukurydziany',
	'dynia',
	'dynowy',
	'awokado',

	// Owoce moderate
	'banan',
	'wiśnie',
	'kiwi',
]

// ========== BAZA BEZPIECZNYCH PRODUKTÓW ==========
export interface SafeProduct {
	name: string
	brand: string
	category: string
	barcode?: string
	status: 'GREEN' | 'YELLOW'
	whereToFind: string[]
	notes?: string
	communityRating?: number // 1-5
	scansCount?: number
}

export const safeProductsDatabase: SafeProduct[] = [
	{
		name: 'Chleb bezglutenowy',
		brand: 'Schär',
		category: 'Pieczywo',
		barcode: '8008698003213',
		status: 'GREEN',
		whereToFind: ['Biedronka', 'Lidl', 'Carrefour', 'Kaufland'],
		notes: 'Sprawdzony przez społeczność Low-FODMAP',
		communityRating: 4.5,
		scansCount: 150,
	},
	{
		name: 'Mleko ryżowe naturalne',
		brand: 'Alpro',
		category: 'Napoje roślinne',
		barcode: '5411188125969',
		status: 'GREEN',
		whereToFind: ['Większość supermarketów'],
		communityRating: 4.7,
		scansCount: 320,
	},
	{
		name: 'Makaron ryżowy',
		brand: 'Blue Dragon',
		category: 'Makarony',
		status: 'GREEN',
		whereToFind: ['Lidl', 'Tesco', 'Carrefour'],
		communityRating: 4.6,
	},
	{
		name: 'Olej kokosowy',
		brand: 'Różne marki',
		category: 'Tłuszcze',
		status: 'GREEN',
		whereToFind: ['Wszędzie'],
		notes: 'Bezpieczny dla Low-FODMAP',
	},
	{
		name: 'Masło orzechowe (100% orzeszki)',
		brand: 'Różne',
		category: 'Pasty orzechowe',
		status: 'GREEN',
		whereToFind: ['Sklepy ze zdrową żywnością'],
		notes: 'UWAGA: Bez dodatku cukru, mleka w proszku',
	},
]

