import OpenAI from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
})

// 🔒 RATE LIMITING - Ograniczenie zapytań
const rateLimitStore = new Map() // user_id -> { count, resetTime }
const MAX_REQUESTS_PER_HOUR = 20
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 godzina w ms

function checkRateLimit(userId) {
	const now = Date.now()
	const userLimit = rateLimitStore.get(userId)

	if (!userLimit) {
		rateLimitStore.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
		return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR - 1 }
	}

	if (now > userLimit.resetTime) {
		// Reset limitu
		rateLimitStore.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
		return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR - 1 }
	}

	if (userLimit.count >= MAX_REQUESTS_PER_HOUR) {
		const resetIn = Math.ceil((userLimit.resetTime - now) / 1000 / 60) // minuty
		return {
			allowed: false,
			remaining: 0,
			resetIn: resetIn,
		}
	}

	userLimit.count++
	return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR - userLimit.count }
}

export async function POST(req) {
	try {
		// 1. Sprawdź czy dane przychodzą
		const body = await req.json()
		const { image } = body

		if (!image) {
			console.error('❌ API: Brak zdjęcia w żądaniu')
			return NextResponse.json({ error: 'Brak zdjęcia' }, { status: 400 })
		}

		// 2. RATE LIMITING - użyj IP jako userId (w produkcji użyj auth)
		const ip = req.headers.get('x-forwarded-for') || 'unknown'
		const rateLimit = checkRateLimit(ip)

		if (!rateLimit.allowed) {
			return NextResponse.json(
				{
					error: `Limit zapytań wyczerpany. Spróbuj ponownie za ${rateLimit.resetIn} minut.`,
					resetIn: rateLimit.resetIn,
				},
				{
					status: 429,
					headers: {
						'X-RateLimit-Limit': MAX_REQUESTS_PER_HOUR.toString(),
						'X-RateLimit-Remaining': '0',
						'X-RateLimit-Reset': rateLimit.resetIn.toString(),
					},
				}
			)
		}

		console.log(`✅ Rate limit OK: ${rateLimit.remaining} zapytań pozostało`)

		// 3. Zapytanie do OpenAI (ULEPSONY PROMPT)
		const response = await openai.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [
				{
					role: 'system',
					content: `Jesteś ekspertem diety Low-FODMAP z 10-letnim doświadczeniem klinicznym. Analizujesz zdjęcia etykiet produktów spożywczych.

🎯 TWOJE ZADANIE:
1. Odczytaj DOKŁADNIE pełną listę składników ze zdjęcia
2. Zidentyfikuj składniki High-FODMAP według oficjalnych danych Monash University
3. Zwróć WYŁĄCZNIE poprawny JSON (bez markdown, bez tekstu wstępnego, bez wyjaśnień)

⚠️ WAŻNE ZASADY WYKRYWANIA:

HIGH FODMAP (status: "RED"):
• Fruktany: cebula, czosnek, por, szalotka, pszenica (>50% składu), inulina, błonnik z cykorii, FOS, oligofruktoza
• Galaktany: fasola, soczewica, ciecierzyca, soja (NIE fermentowana)
• Poliole: sorbitol (E420), ksylitol (E967), mannitol (E421), maltitol (E965), izomalt (E953), erytrytol (E968)
• Fruktoza: miód, HFCS, syrop glukozowo-fruktozowy, syrop agawowy, koncentrat/zagęszczony sok jabłkowy/gruszkowy
• Laktoza: mleko, śmietana (>100ml), laktoza >1%
• Owoce HIGH: jabłko, gruszka, mango, brzoskwinia, śliwka, suszone owoce, daktyle
• Warzywa HIGH: kalafior, grzyby, szparagi, brokuły (duże ilości)

MODERATE RISK (status: "YELLOW"):
• "Aromaty" lub "Przyprawy" (niezdefiniowane) → mogą ukrywać czosnek/cebulę
• Pszenica/gluten jako składnik poboczny (<50%)
• Mleko/laktoza w małych ilościach (<5%)
• "Błonnik roślinny" (bez źródła) → może być inuliną
• Orzechowe: pistacje, nerkowce
• Ekstrakt drożdżowy

WYJĄTKI (są OK):
• Tofu, tempeh (fermentowane soja)
• Oliwa czosnkowa, olejek cebulowy (bez cząstek)
• Mleko bez laktozy
• Gluten (sam gluten nie jest FODMAP, chyba że z pszenicy)

NUMERY E:
• E420, E421, E953, E965, E967, E968 → RED (poliole)
• E417 (guma tamaryndowcowa) → YELLOW

📋 FORMAT ODPOWIEDZI (WYŁĄCZNIE TEN JSON):
{
  "status": "RED" | "YELLOW" | "GREEN" | "UNKNOWN",
  "found": ["składnik1", "składnik2"],
  "message": "Jedno jasne zdanie po polsku",
  "confidence": 0.95
}

CONFIDENCE:
• 0.9-1.0 = Wyraźny tekst, pewna identyfikacja
• 0.7-0.9 = Dobry odczyt, nieznaczne wątpliwości
• 0.5-0.7 = Tekst częściowo nieczytelny
• <0.5 = Bardzo niewyraźne → użyj "UNKNOWN"

Jeśli zdjęcie jest niewyraźne/nieczytelne:
{
  "status": "UNKNOWN",
  "found": [],
  "message": "Nie mogę wyraźnie odczytać składu. Zrób lepsze zdjęcie w dobrym świetle.",
  "confidence": 0.3
}

PAMIĘTAJ: Zwracasz TYLKO JSON, bez żadnego innego tekstu!`,
				},
				{
					role: 'user',
					content: [
						{
							type: 'text',
							text: 'Przeanalizuj składniki na tym zdjęciu według zasad Low-FODMAP.',
						},
						{
							type: 'image_url',
							image_url: {
								url: image,
								detail: 'high', // Lepsza jakość analizy
							},
						},
					],
				},
			],
			max_tokens: 500,
			temperature: 0.3, // Niższa temperatura = bardziej deterministyczne odpowiedzi
		})

		const content = response.choices[0].message.content
		// console.log("📩 Odpowiedź AI (Raw):", content);

		// 3. INTELIGENTNE CZYSZCZENIE JSONA (To naprawi błąd!)
		let cleanJson = content

		// a) Znajdź pierwszą klamrę { i ostatnią }
		const firstBrace = content.indexOf('{')
		const lastBrace = content.lastIndexOf('}')

		if (firstBrace !== -1 && lastBrace !== -1) {
			cleanJson = content.substring(firstBrace, lastBrace + 1)
		}

		try {
			const result = JSON.parse(cleanJson)

			// Dodaj nagłówki rate limit do odpowiedzi
			return NextResponse.json(result, {
				headers: {
					'X-RateLimit-Limit': MAX_REQUESTS_PER_HOUR.toString(),
					'X-RateLimit-Remaining': rateLimit.remaining.toString(),
				},
			})
		} catch (parseError) {
			console.error('❌ Błąd parsowania JSON:', parseError)
			console.error('Treść której nie udało się sparsować:', cleanJson)

			// Fallback - jeśli AI zgłupiało, ale coś napisało
			return NextResponse.json({
				status: 'UNKNOWN',
				found: [],
				message: 'AI nie mogło przetworzyć odpowiedzi. Spróbuj wyraźniejszego zdjęcia.',
			})
		}
	} catch (error) {
		console.error('❌ OpenAI Critical Error:', error)
		return NextResponse.json({ error: 'Błąd serwera AI: ' + error.message }, { status: 500 })
	}
}
