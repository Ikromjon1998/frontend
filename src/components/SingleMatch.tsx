import React, { useState, useCallback, useEffect } from 'react';
import { apiService } from '../services/api';
import { debounce } from '../utils/helpers';
import { config } from '../config/env';
import type { MatchResponse, MatchResult } from '../types/api';
import MatchCard from './MatchCard';

const SingleMatch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MatchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults(null);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await apiService.matchEntity({ query: searchQuery });
        setResults(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setResults(null);
      } finally {
        setLoading(false);
      }
    }, config.search.debounceMs),
    []
  );

  // Trigger search when query changes
  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="bg-white rounded-lg shadow p-6">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
          Enter entity name to match
        </label>
        <div className="relative">
          <input
            type="text"
            id="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search for entity matches..."
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
          {loading && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
        {error && (
          <div className="mt-2 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Results for "{results.query}"
          </h3>
          
          {/* Top Match */}
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="text-md font-medium text-gray-700 mb-4">Top Match</h4>
            <MatchCard match={results.top_match} isTopMatch={true} />
          </div>

          {/* Alternatives */}
          {results.alternatives.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-md font-medium text-gray-700 mb-4">
                Alternative Matches ({results.alternatives.length})
              </h4>
              <div className="space-y-3">
                {results.alternatives.map((match, index) => (
                  <MatchCard key={index} match={match} isTopMatch={false} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {!loading && !results && query.trim() && !error && (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          No matches found for "{query}"
        </div>
      )}
    </div>
  );
};

export default SingleMatch; 