/** @format */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIRecommendation } from "../../types/recommendations";
import { createRecommendationPrompt } from "../../utils/prompts";
import { validateRecommendations } from "../../utils/validation";
import { ChatMessage } from "../../types/chat";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");
const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";

const getModel = () => genAI.getGenerativeModel({ model: MODEL_NAME });

function cleanJsonText(text: string) {
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7);
  if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3);
  return cleaned.trim();
}

export async function getAnimeRecommendations(
  userPreferences: string
): Promise<AIRecommendation[]> {
  const model = getModel();

  const prompt = createRecommendationPrompt(userPreferences);

  try {
    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    });

    const text = await (await result.response).text();
    const cleaned = cleanJsonText(text);

    let recommendations: AIRecommendation[];
    try {
      recommendations = JSON.parse(cleaned);
    } catch {
      throw new Error("AI returned invalid JSON.");
    }

    validateRecommendations(recommendations);
    return recommendations;
  } catch (error: any) {
    console.error("Error in getAnimeRecommendations:", error);
    throw new Error(`Failed to get AI recommendations: ${error.message || error}`);
  }
}

export const generateChatResponse = async (messages: ChatMessage[]): Promise<string> => {
  const model = getModel();

  try {
    const chat = model.startChat({
      history: messages.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
    });

    const result = await chat.sendMessage(messages[messages.length - 1].content);
    return (await result.response).text();
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
};
