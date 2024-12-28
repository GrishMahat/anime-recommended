import axios from 'axios';
import { AnimeResult } from '../types/anime';

const JIKAN_API_BASE = 'https://api.jikan.moe/v4';

export async function searchAnime(title: string): Promise<AnimeResult> {
  try {
    const response = await axios.get(`${JIKAN_API_BASE}/anime`, {
      params: {
        q: title,
        limit: 1
      }
    });

    if (!response.data.data?.[0]) {
      throw new Error(`Anime not found: ${title}`);
    }

    const anime = response.data.data[0];
    return {
      id: anime.mal_id,
      title: anime.title,
      synopsis: anime.synopsis || 'No synopsis available.',
      image_url: anime.images.jpg.large_image_url,
      score: anime.score || 0,
      genres: anime.genres?.map((g: any) => g.name) || [],
      episodes: anime.episodes || 0
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`API request failed: ${error.message}`);
    }
    throw error;
  }
}