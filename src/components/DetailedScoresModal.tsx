import React from 'react';

interface DetailedScores {
  tfidf: number;
  levenshtein: number;
  token_set: number;
}

interface DetailedScoresModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityName: string;
  confidence: number;
  scores: DetailedScores;
}

const DetailedScoresModal: React.FC<DetailedScoresModalProps> = ({
  isOpen,
  onClose,
  entityName,
  confidence,
  scores
}) => {
  console.log('🎯 Modal props:', { isOpen, entityName, confidence, scores });
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Scores</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Entity Info */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Entity</h4>
            <p className="text-lg font-semibold text-gray-900">{entityName}</p>
          </div>

          {/* Overall Confidence */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Overall Confidence</h4>
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    confidence >= 0.8 ? 'bg-green-500' :
                    confidence >= 0.6 ? 'bg-yellow-500' :
                    confidence >= 0.4 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${confidence * 100}%` }}
                ></div>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {(confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Match Information */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Match Information</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Confidence Level:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {confidence >= 0.8 ? 'High' : confidence >= 0.6 ? 'Medium' : confidence >= 0.4 ? 'Low' : 'Very Low'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Match Quality:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {confidence >= 0.9 ? 'Excellent' : confidence >= 0.7 ? 'Good' : confidence >= 0.5 ? 'Fair' : 'Poor'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Scores */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-4">Individual Scores</h4>
            {scores && scores.tfidf !== undefined ? (
              <div className="space-y-4">
                {/* TF-IDF Score */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">TF-IDF</span>
                    <span className="text-sm font-semibold text-gray-900">{scores.tfidf.toFixed(3)}</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${scores.tfidf * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Levenshtein Score */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Levenshtein</span>
                    <span className="text-sm font-semibold text-gray-900">{scores.levenshtein.toFixed(3)}</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${scores.levenshtein * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Token Set Score */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Token Set</span>
                    <span className="text-sm font-semibold text-gray-900">{scores.token_set.toFixed(3)}</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${scores.token_set * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="font-medium text-gray-900 mb-2">No Detailed Scores Available</p>
                <p className="text-sm text-gray-600">
                  The backend API doesn't include detailed scores in batch responses.
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  You can still see the overall confidence and match quality above.
                </p>
              </div>
            )}
          </div>

          {/* Score Explanation */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Score Explanation</h5>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>TF-IDF:</strong> Term frequency-inverse document frequency similarity</p>
              <p><strong>Levenshtein:</strong> Edit distance similarity</p>
              <p><strong>Token Set:</strong> Token-based set similarity</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailedScoresModal; 