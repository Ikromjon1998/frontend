import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { apiService } from '../services/api';
import { validateFile, parseCSV, parseJSON, exportToCSV, getConfidenceColor, formatConfidence } from '../utils/helpers';
import type { BatchMatchResult } from '../types/api';
import DetailedScoresModal from './DetailedScoresModal';

const BatchUpload: React.FC = () => {
  const [results, setResults] = useState<BatchMatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<BatchMatchResult | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const validation = validateFile(file);

    if (!validation.isValid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setUploadProgress(0);

      // Simulate progress (since we can't track actual upload progress easily)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await apiService.batchMatch(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      console.log('📊 Batch API Response:', response);
      console.log('📊 Sample result:', response[0]);
      setResults(response);

      // Reset progress after a delay
      setTimeout(() => setUploadProgress(0), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during batch processing');
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json']
    },
    multiple: false
  });

  const handleExport = () => {
    if (results.length === 0) return;

    const exportData = results.map(result => ({
      input: result.input,
      match: result.match || 'No match',
      confidence: result.confidence,
      error: result.error || ''
    }));

    exportToCSV(exportData, 'fuzzy_match_results.csv');
  };

  const handleShowDetails = (result: BatchMatchResult) => {
    console.log('🔍 Clicked on result:', result);
    if (result.match) {
      console.log('✅ Opening modal with result:', result);
      setSelectedResult(result);
      setModalOpen(true);
    } else {
      console.log('❌ No match available');
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedResult(null);
  };

  const successfulMatches = results.filter(r => r.match && !r.error).length;
  const failedMatches = results.filter(r => !r.match || r.error).length;

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Batch Entity Matching</h3>
        
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="space-y-2">
            <div className="text-4xl">📁</div>
            <p className="text-lg font-medium text-gray-700">
              {isDragActive ? 'Drop the file here' : 'Drag & drop a file here, or click to select'}
            </p>
            <p className="text-sm text-gray-500">
              Supports CSV and JSON files with a "names" or "name" column/field
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Progress Bar */}
        {loading && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Processing...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Results</h3>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Export to CSV
            </button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{results.length}</div>
              <div className="text-sm text-gray-600">Total Entries</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{successfulMatches}</div>
              <div className="text-sm text-gray-600">Successful Matches</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{failedMatches}</div>
              <div className="text-sm text-gray-600">Failed Matches</div>
            </div>
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Input
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Match
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confidence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.input}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.match || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {result.match ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleShowDetails(result)}
                            className={`text-sm font-medium ${getConfidenceColor(result.confidence).replace('bg-', 'text-')} hover:underline cursor-pointer`}
                            title="Click to view match details"
                          >
                            {formatConfidence(result.confidence)}
                          </button>
                          <div className="w-16 bg-gray-200 rounded-full h-1">
                            <div
                              className={`h-1 rounded-full ${getConfidenceColor(result.confidence)}`}
                              style={{ width: `${result.confidence * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {result.error ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Error
                        </span>
                      ) : result.match ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          No Match
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detailed Scores Modal */}
      {selectedResult && (
        <DetailedScoresModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          entityName={selectedResult.match || ''}
          confidence={selectedResult.confidence}
          scores={selectedResult.scores || { tfidf: 0, levenshtein: 0, token_set: 0 }}
        />
      )}
    </div>
  );
};

export default BatchUpload; 