/** @format */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIRecommendation } from "../../types/recommendations";
import { createRecommendationPrompt } from "../../utils/prompts";
import { validateRecommendations } from "../../utils/validation";
import { ChatMessage } from "../../types/chat";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export async function getAnimeRecommendations(
  userPreferences: string
): Promise<AIRecommendation[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = createRecommendationPrompt(userPreferences);

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const recommendations = JSON.parse(text);
    validateRecommendations(recommendations);

    return recommendations;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get AI recommendations: ${error.message}`);
    }
    throw new Error("Failed to get AI recommendations");
  }
}

export const generateChatResponse = async (
  messages: ChatMessage[]
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
      history: messages.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: msg.content,
      })),
    });

    const result = await chat.sendMessage(
      messages[messages.length - 1].content
    );
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
};
