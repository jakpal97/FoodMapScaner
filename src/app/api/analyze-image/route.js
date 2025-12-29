// --- app/api/analyze/route.js ---
import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "Brak zdjęcia" }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Szybki i tani model Vision
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: "Jesteś ekspertem diety Low-FODMAP. Przeanalizuj listę składników na tym zdjęciu. Twoim zadaniem jest znaleźć składniki wysokiego ryzyka dla osób z IBS (cebula, czosnek, syrop glukozowo-fruktozowy, pszenica, ksylitol, sorbitol, laktoza, inulina). Zwróć wynik TYLKO w formacie JSON: { \"status\": \"RED\" (jeśli szkodliwe) lub \"GREEN\" (jeśli bezpieczne), \"found\": [\"lista\", \"wykrytych\", \"składników\"] }. Nie dodawaj żadnego innego tekstu." 
            },
            {
              type: "image_url",
              image_url: {
                url: image, // Base64 image
                detail: "low" // 'low' jest tańsze i szybsze, wystarczy do tekstu
              },
            },
          ],
        },
      ],
      max_tokens: 300,
    });

    // Parsujemy odpowiedź AI
    const content = response.choices[0].message.content;
    // Usuwamy ewentualne znaczniki markdown ```json
    const cleanJson = content.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleanJson);

    return NextResponse.json(result);
    
  } catch (error) {
    console.error("OpenAI Error:", error);
    return NextResponse.json({ error: "Błąd analizy AI" }, { status: 500 });
  }
}