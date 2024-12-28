// Types for Jikan API responses
export interface JikanResponse<T> {
  data: T[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
  };
}

export interface JikanAnime {
  mal_id: number;
  title: string;
  synopsis: string | null;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
  score: number | null;
  genres: Array<{
    name: string;
  }>;
  episodes: number | null;
}