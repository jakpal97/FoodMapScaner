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
      model: "gpt-4o-mini", 
      messages: [
        {
          role: "system",
          content: `Jesteś ekspertem IBS. Analizujesz zdjęcia etykiet spożywczych.
          Zwracaj TYLKO czysty JSON bez markdowna (\`\`\`json).
          
          Twoim zadaniem jest znaleźć te składniki:
          - Cebula, Czosnek, Por, Szalotka
          - Syrop glukozowo-fruktozowy, Fruktoza, Miód
          - Pszenica, Żyto, Jęczmień (w dużych ilościach)
          - Laktoza, Mleko (jeśli nie bez laktozy)
          - Sorbitol, Ksylitol, Mannitol, Erytrytol
          - Inulina, Błonnik z cykorii
          
          Format odpowiedzi:
          {
            "status": "RED" | "GREEN" | "UNKNOWN",
            "found": ["lista", "wykrytych"],
            "message": "Krótki komentarz po polsku"
          }

          Zasady:
          1. Jeśli znajdziesz szkodliwe -> status "RED".
          2. Jeśli skład jest czysty -> status "GREEN".
          3. Jeśli zdjęcie jest niewyraźne, nie widać składu lub to nie jest jedzenie -> status "UNKNOWN" i message "Nie widzę listy składników".
          `
        },
        {
          role: "user",
          content: [
            { 
              type: "image_url",
              image_url: {
                url: image,
                detail: "high" // Zmieniamy na HIGH dla lepszej precyzji (przy skompresowanym obrazku to bezpieczne)
              },
            },
          ],
        },
      ],
      max_tokens: 300,
    });

    // Czyścimy odpowiedź (czasem AI dodaje ```json na początku)
    let content = response.choices[0].message.content;
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
        const result = JSON.parse(content);
        return NextResponse.json(result);
    } catch (parseError) {
        console.error("AI zwróciło błędny JSON:", content);
        return NextResponse.json({ 
            status: "UNKNOWN", 
            found: [], 
            message: "Błąd analizy danych od AI." 
        });
    }
    
  } catch (error) {
    console.error("OpenAI Error:", error);
    return NextResponse.json({ error: "Błąd połączenia z AI" }, { status: 500 });
  }
}