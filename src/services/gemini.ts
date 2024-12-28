import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function getAnimeRecommendations(userPreferences: string): Promise<any[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `As an anime recommendation expert, suggest 3 anime based on these preferences: ${userPreferences}. 
    Respond with a valid JSON array where each object has these exact properties:
    - title (string): the exact anime title as it appears on MyAnimeList
    - reason (string): detailed explanation why this anime matches the preferences
    
    Example format:
    [
      {
        "title": "Death Note",
        "reason": "This psychological thriller..."
      }
    ]`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Ensure we have valid JSON by parsing and validating the structure
    const recommendations = JSON.parse(text);
    if (!Array.isArray(recommendations)) {
      throw new Error('Invalid response format: expected an array');
    }
    
    recommendations.forEach((rec, index) => {
      if (!rec.title || !rec.reason) {
        throw new Error(`Invalid recommendation at index ${index}: missing title or reason`);
      }
    });
    
    return recommendations;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get AI recommendations: ${error.message}`);
    }
    throw new Error('Failed to get AI recommendations');
  }
}