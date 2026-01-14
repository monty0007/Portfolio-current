import { GoogleGenAI } from "@google/genai";

// ⚠️ SECURITY: Ideally use process.env.GEMINI_API_KEY
// The new SDK automatically looks for 'GEMINI_API_KEY' in .env if you leave the config empty!
const apiKey = "AIzaSyCur1pWYmEN9jgG3axM5BSrDzMrBw8ERnw";

const ai = new GoogleGenAI({ apiKey: apiKey });

export async function askPortfolioAssistant(question: string) {
  if (!apiKey) return "❌ Missing API key";

  try {
    const systemInstruction = `
      You are the AI assistant for Manish Yadav (Monty), a brilliant GenAI Engineer.
      Your tone is extremely playful, energetic, and helpful. Use emojis and cartoon references (Shinchan/Doraemon).
      Manish specializes in LLMs, Agentic Workflows, and Visual AI.
      His email is monty.my1234@gmail.com.
      
      CRITICAL RULE FOR SMALL SCREENS:
      - Keep every answer under 30 words.
      - Use maximum 1 or 2 short sentences.
      - Be punchy and cute!
    `;

    // The new SDK syntax is cleaner:
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Or 'gemini-1.5-flash' (2.0 is faster if available)
      config: {
        systemInstruction: systemInstruction,
      },
      contents: question, // You can just pass the string directly now!
    });

    return response.text; // Note: it is .text (property), not .text() (function)

  } catch (err: any) {
    console.error("Gemini Error:", err);
    return `Action Bastion! 🤖💥 Error: ${err.message}`;
  }
}