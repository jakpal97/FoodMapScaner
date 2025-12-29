// --- fodmap_analyzer.ts ---
// Zaawansowany algorytm analizy FODMAP

import {
	ingredientDatabase,
	highFodmapIngredients,
	moderateRiskIngredients,
	type IngredientDetails,
} from './fodmap_database'

export interface AnalysisResult {
	status: 'RED' | 'YELLOW' | 'GREEN' | 'UNKNOWN'
	found: string[]
	message: string
	score: number // 0-100
	detectedIngredients: DetectedIngredient[]
	alternatives?: string[]
	warnings?: string[]
}

export interface DetectedIngredient {
	name: string
	originalText: string
	severity: number
	details?: IngredientDetails
}

/**
 * Sprawdza czy składnik występuje jako całe słowo (word boundary)
 * Zapobiega fałszywym alarmom np. "słonecznikowy" zawierający "cznik"
 */
function isWordBoundaryMatch(text: string, ingredient: string): boolean {
	// Escape special regex characters
	const escaped = ingredient.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	const regex = new RegExp(`\\b${escaped}\\b`, 'i')
	return regex.test(text)
}

/**
 * Znajduje najlepsze dopasowanie składnika (obsługuje warianty)
 */
function findIngredientMatch(text: string, ingredient: string): string | null {
	// Najpierw sprawdź dokładne dopasowanie
	if (isWordBoundaryMatch(text, ingredient)) {
		return ingredient
	}

	// Sprawdź czy jest w bazie szczegółowej
	const details = ingredientDatabase[ingredient.toLowerCase()]
	if (details) {
		// Sprawdź wszystkie aliasy
		for (const alias of details.aliases) {
			if (isWordBoundaryMatch(text, alias)) {
				return alias
			}
		}
	}

	return null
}

/**
 * GŁÓWNA FUNKCJA ANALIZUJĄCA (Ulepszona)
 */
export function analyzeIngredients(ingredientsText: string): AnalysisResult {
	if (!ingredientsText || ingredientsText.trim() === '') {
		return {
			status: 'UNKNOWN',
			found: [],
			message: 'Brak danych o składnikach.',
			score: 0,
			detectedIngredients: [],
		}
	}

	// Normalizacja tekstu
	const normalizedText = ingredientsText.toLowerCase()
	let totalScore = 0
	const detectedIngredients: DetectedIngredient[] = []
	const foundNames = new Set<string>()

	// === 1. SPRAWDŹ CZERWONĄ LISTĘ (HIGH FODMAP) ===
	for (const ingredient of highFodmapIngredients) {
		const match = findIngredientMatch(normalizedText, ingredient)
		if (match) {
			const details = ingredientDatabase[ingredient] || ingredientDatabase[match]

			// Dodaj tylko raz (unikaj duplikatów)
			const baseName = details?.name || ingredient
			if (!foundNames.has(baseName)) {
				foundNames.add(baseName)

				const severity = details?.severity || 8
				totalScore += severity

				detectedIngredients.push({
					name: baseName,
					originalText: match,
					severity: severity,
					details: details,
				})
			}
		}
	}

	// Jeśli znaleziono HIGH FODMAP → RED
	if (detectedIngredients.length > 0) {
		// Zbierz alternatywy
		const alternatives = detectedIngredients
			.flatMap(ing => ing.details?.alternatives || [])
			.filter((alt, idx, arr) => arr.indexOf(alt) === idx) // unique
			.slice(0, 5) // max 5 alternatyw

		return {
			status: 'RED',
			found: Array.from(foundNames),
			message: `Wykryto ${detectedIngredients.length} silny${detectedIngredients.length === 1 ? '' : 'ch'} wyzwalacz${detectedIngredients.length === 1 ? 'a' : 'y'} FODMAP.`,
			score: Math.min(totalScore, 100),
			detectedIngredients: detectedIngredients,
			alternatives: alternatives.length > 0 ? alternatives : undefined,
			warnings: [
				'Ten produkt może wywołać objawy u osób z IBS/SIBO',
				'Sprawdź szczegóły składników klikając na nie',
			],
		}
	}

	// === 2. SPRAWDŹ ŻÓŁTĄ LISTĘ (MODERATE RISK) ===
	const moderateDetected: DetectedIngredient[] = []
	const moderateNames = new Set<string>()

	for (const ingredient of moderateRiskIngredients) {
		const match = findIngredientMatch(normalizedText, ingredient)
		if (match) {
			const details = ingredientDatabase[ingredient] || ingredientDatabase[match]
			const baseName = details?.name || ingredient

			if (!moderateNames.has(baseName)) {
				moderateNames.add(baseName)

				const severity = details?.severity || 5
				totalScore += severity

				moderateDetected.push({
					name: baseName,
					originalText: match,
					severity: severity,
					details: details,
				})
			}
		}
	}

	if (moderateDetected.length > 0) {
		return {
			status: 'YELLOW',
			found: Array.from(moderateNames),
			message: `Wykryto składniki ryzykowne lub zależne od ilości. Testuj ostrożnie.`,
			score: Math.min(totalScore, 100),
			detectedIngredients: moderateDetected,
			warnings: [
				'Składniki mogą być tolerowane w małych ilościach',
				'Jeśli jesteś bardzo wrażliwy, rozważ uniknięcie',
			],
		}
	}

	// === 3. BRAK WYKRYTYCH WYZWALACZY → GREEN ===
	return {
		status: 'GREEN',
		found: [],
		message: 'Nie wykryto typowych wyzwalaczy FODMAP. Produkt wygląda bezpiecznie.',
		score: 0,
		detectedIngredients: [],
	}
}

/**
 * Pobiera szczegóły składnika z bazy
 */
export function getIngredientDetails(ingredientName: string): IngredientDetails | null {
	const normalized = ingredientName.toLowerCase()

	// Szukaj bezpośrednio
	if (ingredientDatabase[normalized]) {
		return ingredientDatabase[normalized]
	}

	// Szukaj po aliasach
	for (const [key, details] of Object.entries(ingredientDatabase)) {
		if (details.aliases.some(alias => alias.toLowerCase() === normalized)) {
			return details
		}
	}

	return null
}

/**
 * Sprawdza czy tekst zawiera oznaki składu produktu
 * (pomocne do walidacji OCR/AI)
 */
export function looksLikeIngredientsList(text: string): boolean {
	const indicators = [
		'składniki:',
		'ingredients:',
		'skład:',
		'zawiera:',
		'mąka',
		'cukier',
		'sól',
		'woda',
		'olej',
		'%',
	]

	const normalized = text.toLowerCase()
	return indicators.some(indicator => normalized.includes(indicator))
}

