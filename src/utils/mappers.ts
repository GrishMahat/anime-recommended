import { JikanAnime } from '../types/jikan';
import { AnimeResult } from '../types/anime';

export function mapJikanToAnimeResult(anime: JikanAnime): AnimeResult {
  return {
    id: anime.mal_id,
    title: anime.title,
    synopsis: anime.synopsis || 'No synopsis available.',
    image_url: anime.images.jpg.large_image_url,
    score: anime.score || 0,
    genres: anime.genres?.map(g => g.name) || [],
    episodes: anime.episodes || 0,
    year: anime.year || undefined,
    status: anime.status || undefined,
    rating: anime.rating || undefined
  };
}