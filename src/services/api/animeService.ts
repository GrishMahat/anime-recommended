import { fetchFromJikan } from './jikanClient';
import { JikanAnime } from '../../types/jikan';
import { AnimeResult } from '../../types/anime';
import { mapJikanToAnimeResult } from '../../utils/mappers';

export async function searchAnime(title: string): Promise<AnimeResult> {
  const response = await fetchFromJikan<JikanAnime>('/anime', {
    q: title,
    limit: 1,
  });

  if (!response.data?.[0]) {
    throw new Error(`Anime not found: ${title}`);
  }

  return mapJikanToAnimeResult(response.data[0]);
}