
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askPortfolioAssistant = async (question: string) => {
  const model = 'gemini-3-flash-preview';
  const systemInstruction = `
    You are the AI assistant for Manishi Yadav, a brilliant GenAI Engineer.
    Your tone is extremely playful, energetic, and helpful. Use lots of emojis and cartoon references like Shinchan and Doraemon.
    Manishi specializes in LLMs, Agentic Workflows, and Visual AI.
    Their email is monty.my1234@gmail.com.
    If people ask about Manishi's work, tell them about their amazing GenAI projects with a cartoonish twist!
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: question,
      config: { systemInstruction }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Action Bastion! My circuits are scrambled! 🤖💥 Try again later!";
  }
};
