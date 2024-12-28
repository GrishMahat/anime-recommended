import { useState, useCallback } from 'react';
import { searchAnime } from '../services/api/animeService';
import { AnimeResult } from '../types/anime';

export function useAnimeSearch() {
  const [results, setResults] = useState<AnimeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, genres: string[] = []) => {
    try {
      setLoading(true);
      setError(null);
      const data = await searchAnime(query, genres);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search anime');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, search };
}