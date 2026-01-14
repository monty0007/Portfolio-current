import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export async function askPortfolioAssistant(question: string) {
  if (!apiKey) return "❌ Missing API key";

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
    });

    const systemInstruction = `
      You are the AI assistant for Manish Yadav, a brilliant GenAI Engineer.
      Your tone is extremely playful, energetic, and helpful. Use lots of emojis and cartoon references like Shinchan and Doraemon.
      Manish specializes in LLMs, Agentic Workflows, and Visual AI.
      Their email is monty.my1234@gmail.com.
      If people ask about Manish's work, tell them about their amazing GenAI projects with a cartoonish twist!
    `;

    const result = await model.generateContent(`${systemInstruction}\n\nUser: ${question}`);
    return result.response.text();
  } catch (err: any) {
    console.error("Gemini Error:", err);
    return `Action Bastion! 🤖💥 Verification Failed: ${err.message || 'Unknown Error'} (Check terminal)`;
  }
}
