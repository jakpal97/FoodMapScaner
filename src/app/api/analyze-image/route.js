import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    // 1. Sprawdź czy dane przychodzą
    const body = await req.json();
    const { image } = body;

    if (!image) {
      console.error("❌ API: Brak zdjęcia w żądaniu");
      return NextResponse.json({ error: "Brak zdjęcia" }, { status: 400 });
    }

    // console.log("✅ API: Otrzymano zdjęcie, wysyłam do OpenAI...");

    // 2. Zapytanie do OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Jesteś ekspertem FODMAP. Analizujesz zdjęcia etykiet.
          Musisz zwrócić TYLKO poprawny JSON. Żadnego markdowna, żadnego tekstu 'Oto wynik'.
          
          Szukaj składników High-FODMAP:
          - Cebula, Czosnek, Szalotka, Por
          - Syrop glukozowo-fruktozowy, Fruktoza, Miód
          - Pszenica, Żyto (jeśli główny składnik)
          - Laktoza, Mleko
          - Sorbitol, Ksylitol, Mannitol, Erytrytol
          - Inulina, Cykoria

          Wzór odpowiedzi:
          {
            "status": "RED" (jeśli szkodliwe) lub "GREEN" (jeśli bezpieczne) lub "UNKNOWN" (jeśli nieczytelne),
            "found": ["nazwa1", "nazwa2"],
            "message": "Krótkie wyjaśnienie po polsku (max 1 zdanie)"
          }`
        },
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: "Przeanalizuj to zdjęcie składu." 
            },
            {
              type: "image_url",
              image_url: {
                url: image,
                detail: "high" // Lepsza jakość analizy
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const content = response.choices[0].message.content;
    // console.log("📩 Odpowiedź AI (Raw):", content);

    // 3. INTELIGENTNE CZYSZCZENIE JSONA (To naprawi błąd!)
    let cleanJson = content;
    
    // a) Znajdź pierwszą klamrę { i ostatnią }
    const firstBrace = content.indexOf('{');
    const lastBrace = content.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleanJson = content.substring(firstBrace, lastBrace + 1);
    }

    try {
      const result = JSON.parse(cleanJson);
      return NextResponse.json(result);
    } catch (parseError) {
      console.error("❌ Błąd parsowania JSON:", parseError);
      console.error("Treść której nie udało się sparsować:", cleanJson);
      
      // Fallback - jeśli AI zgłupiało, ale coś napisało
      return NextResponse.json({
        status: "UNKNOWN",
        found: [],
        message: "AI nie mogło przetworzyć odpowiedzi. Spróbuj wyraźniejszego zdjęcia."
      });
    }

  } catch (error) {
    console.error("❌ OpenAI Critical Error:", error);
    return NextResponse.json({ error: "Błąd serwera AI: " + error.message }, { status: 500 });
  }
}