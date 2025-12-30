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
  const model = genAI.getGenerativeModel({
    model: import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash"
  });

  try {
    // Use generateContent with JSON response configuration
    const result = await model.generateContent({
      contents: [{
        parts: [{
          text: createRecommendationPrompt(userPreferences)
        }]
      }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const response = await result.response;
    const text = response.text();

    // Clean the response text to extract JSON if needed
    let cleanedText = text.trim();

    // Remove markdown code block markers if present
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.substring(7); // Remove ```json
    }
    if (cleanedText.endsWith('```')) {
      cleanedText = cleanedText.substring(0, cleanedText.length - 3); // Remove ```
    }
    cleanedText = cleanedText.trim();

    const recommendations = JSON.parse(cleanedText);
    validateRecommendations(recommendations);

    return recommendations;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in getAnimeRecommendations:", error);
      throw new Error(`Failed to get AI recommendations: ${error.message}`);
    }
    throw new Error("Failed to get AI recommendations");
  }
}

export const generateChatResponse = async (
  messages: ChatMessage[]
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({
      model: import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash"
    });

    const chat = model.startChat({
      history: messages.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
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
