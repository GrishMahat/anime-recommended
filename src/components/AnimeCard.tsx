/** @format */

import React from "react";
import { Star, Play, Calendar, Tag } from "lucide-react";
import { AnimeResult } from "../types/anime";

interface AnimeCardProps {
  anime: AnimeResult;
  reason: string;
}

export function AnimeCard({ anime, reason }: AnimeCardProps) {
  const fallbackImage = "https://via.placeholder.com/320x180?text=No+Image";

  return (
    <div className='bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-all duration-300 border border-gray-700 hover:border-purple-500/50'>
      <div className='relative'>
        <img
          src={anime.image_url || fallbackImage}
          alt={anime.title}
          className='w-full h-48 object-cover transition-transform duration-300 hover:scale-105'
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
        />
        <div className='absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60' />
        {typeof anime.score === "number" && anime.score > 0 && (
          <div className='absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-full shadow-md flex items-center'>
            <Star className='w-4 h-4 mr-1 text-yellow-300' />
            <span className='text-sm font-bold'>{anime.score.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className='p-4 space-y-3'>
        <h3 className='text-lg font-bold text-white truncate hover:text-purple-400 transition-colors'>
          {anime.title}
        </h3>

        <div className='flex items-center gap-4 text-sm text-gray-300'>
          {anime.episodes > 0 && (
            <div className='flex items-center'>
              <Play className='w-4 h-4 mr-1 text-purple-400' />
              <span>{anime.episodes} eps</span>
            </div>
          )}
          {anime.year && (
            <div className='flex items-center'>
              <Calendar className='w-4 h-4 mr-1 text-purple-400' />
              <span>{anime.year}</span>
            </div>
          )}
        </div>

        {anime.synopsis && (
          <p className='text-gray-400 text-sm line-clamp-2 hover:line-clamp-none transition-all duration-300'>
            {anime.synopsis}
          </p>
        )}

        <div className='space-y-1'>
          <div className='flex items-center text-purple-400'>
            <Tag className='w-4 h-4 mr-1' />
            <span className='text-sm font-bold'>Why watch this:</span>
          </div>
          <p className='text-gray-300 text-sm italic line-clamp-2 hover:line-clamp-none transition-all duration-300'>
            {reason}
          </p>
        </div>

        {anime.genres && anime.genres.length > 0 && (
          <div className='flex flex-wrap gap-2 pt-2'>
            {anime.genres.map((genre) => (
              <span
                key={genre}
                className='px-2 py-1 bg-gray-700 text-purple-300 rounded-full text-xs font-medium hover:bg-purple-600 hover:text-white transition-colors duration-200'>
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
