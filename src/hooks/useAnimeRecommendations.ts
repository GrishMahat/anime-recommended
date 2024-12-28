import { useState } from 'react';
import { AnimeRecommendation } from '../types/anime';
import { getAnimeRecommendations } from '../services/gemini';
import { searchAnime } from '../services/animeAPI';

export function useAnimeRecommendations() {
  const [recommendations, setRecommendations] = useState<AnimeRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async (preferences: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const aiRecommendations = await getAnimeRecommendations(preferences);
      
      const fullRecommendations = await Promise.all(
        aiRecommendations.map(async (rec: any) => {
          const animeDetails = await searchAnime(rec.title);
          return {
            ...rec,
            animeDetails
          };
        })
      );
      
      setRecommendations(fullRecommendations);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(message);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    recommendations,
    loading,
    error,
    fetchRecommendations
  };
}