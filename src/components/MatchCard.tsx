import React, { useState } from 'react';
import type { MatchResult } from '../types/api';
import { getConfidenceColor, formatConfidence } from '../utils/helpers';

interface MatchCardProps {
  match: MatchResult;
  isTopMatch: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, isTopMatch }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className={`border rounded-lg p-4 ${isTopMatch ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <h5 className="font-medium text-gray-900">{match.entity}</h5>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-sm text-gray-500">Confidence:</span>
            <span className={`text-sm font-medium ${getConfidenceColor(match.confidence).replace('bg-', 'text-')}`}>
              {formatConfidence(match.confidence)}
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {/* Confidence Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getConfidenceColor(match.confidence)}`}
          style={{ width: `${match.confidence * 100}%` }}
        ></div>
      </div>

      {/* Detailed Scores */}
      {showDetails && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <h6 className="text-sm font-medium text-gray-700 mb-2">Detailed Scores:</h6>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-gray-500">TF-IDF:</span>
              <span className="ml-1 font-medium">{match.scores.tfidf.toFixed(3)}</span>
            </div>
            <div>
              <span className="text-gray-500">Levenshtein:</span>
              <span className="ml-1 font-medium">{match.scores.levenshtein.toFixed(3)}</span>
            </div>
            <div>
              <span className="text-gray-500">Token Set:</span>
              <span className="ml-1 font-medium">{match.scores.token_set.toFixed(3)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchCard; 