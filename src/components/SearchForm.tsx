import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

interface SearchFormProps {
  onSearch: (preferences: string) => void;
  loading: boolean;
}

export function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [preferences, setPreferences] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (preferences.trim()) {
      onSearch(preferences);
    }
  };

  const examplePrompts = [
    "I love psychological thrillers with deep storylines",
    "Looking for wholesome slice of life anime with great animation",
    "Action-packed series with strong character development"
  ];

  return (
    <div className="max-w-2xl mx-auto mb-12">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="Describe what kind of anime you like or want to watch..."
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
          />
          <button
            type="submit"
            disabled={loading || !preferences.trim()}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 flex items-center gap-2 shadow-sm transition-colors"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                Finding anime...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Get Recommendations
              </>
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Try these examples:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {examplePrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => setPreferences(prompt)}
              className="text-sm px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}