import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateVenueInsight = async (prompt: string): Promise<string> => {
  if (!apiKey) return "API Key not configured.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful and professional Venue Management Assistant. Your goal is to help venue managers analyze data, write descriptions, or suggest maintenance schedules. Keep answers concise and actionable.",
      }
    });
    return response.text || "No insight generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to retrieve AI insight. Please try again.";
  }
};
