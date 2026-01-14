
import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export const askPortfolioAssistant = async (question: string) => {
  if (!apiKey) {
    console.warn("Gemini API Key is missing!");
    return "Action Bastion! 🤖 My brain chip is missing! (Please add VITE_GEMINI_API_KEY to .env)";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-2.0-flash-exp';
    const systemInstruction = `
    You are the AI assistant for Manish Yadav, a brilliant GenAI Engineer.
    Your tone is extremely playful, energetic, and helpful. Use lots of emojis and cartoon references like Shinchan and Doraemon.
    Manish specializes in LLMs, Agentic Workflows, and Visual AI.
    Their email is monty.my1234@gmail.com.
    If people ask about Manish's work, tell them about their amazing GenAI projects with a cartoonish twist!
  `;

    const response = await ai.models.generateContent({
      model,
      contents: [{
        role: 'user',
        parts: [{ text: question }]
      }],
      config: { systemInstruction }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Action Bastion! My circuits are scrambled! 🤖💥 Try again later!";
  }
};
