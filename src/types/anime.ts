export interface AnimeResult {
  id: number;
  title: string;
  synopsis: string;
  image_url: string;
  score: number;
  genres: string[];
  episodes: number;
  year?: number;
  status?: string;
  rating?: string;
}