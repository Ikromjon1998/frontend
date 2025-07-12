import React, { useState, useCallback, useRef } from 'react';
import { apiService } from '../services/api';
import type { MatchResponse } from '../types/api';
import MatchCard from './MatchCard';

const SingleMatch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MatchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null);
      setError(null);
      setHasSearched(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);
      const response = await apiService.matchEntity({ query: searchQuery });
      setResults(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
    // Keep focus on the input field
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [query, performSearch]);

  // Handle Enter key
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch(query);
      // Keep focus on the input field
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [query, performSearch]);

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Enter entity name to match
            </label>
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  id="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter entity name and press Enter or click Search..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                />
                {loading && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Searching...</span>
                  </div>
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </div>
          {error && (
            <div className="text-sm text-red-600">
              {error}
            </div>
          )}
        </form>
      </div>

      {/* Results */}
      {hasSearched && results && (
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
      {hasSearched && !loading && !results && query.trim() && !error && (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          No matches found for "{query}"
        </div>
      )}

      {/* Initial State */}
      {!hasSearched && !loading && (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-900 mb-2">Ready to Search</p>
          <p className="text-sm text-gray-600">
            Enter an entity name above and press Enter or click Search to find matches.
          </p>
        </div>
      )}
    </div>
  );
};

export default SingleMatch; 