import React from 'react';
import { Tag } from 'lucide-react';

interface GenreFilterProps {
  genres: string[];
  selectedGenres: string[];
  onGenreToggle: (genre: string) => void;
}

export function GenreFilter({ genres, selectedGenres, onGenreToggle }: GenreFilterProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by genre</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => onGenreToggle(genre)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedGenres.includes(genre)
                ? 'bg-purple-600 text-white'
                : 'bg-purple-50 text-purple-700 dark:bg-gray-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-gray-600'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
}