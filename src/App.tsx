import React, { useState, useEffect } from 'react';
import HealthStatus from './components/HealthStatus';
import SingleMatch from './components/SingleMatch';
import BatchUpload from './components/BatchUpload';
import { apiService } from './services/api';
import { config } from './config/env';
import type { HealthResponse } from './types/api';

function App() {
  const [healthStatus, setHealthStatus] = useState<'healthy' | 'unhealthy' | 'checking'>('checking');
  const [activeTab, setActiveTab] = useState<'single' | 'batch'>('single');

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      setHealthStatus('checking');
      await apiService.checkHealth();
      setHealthStatus('healthy');
    } catch (error) {
      setHealthStatus('unhealthy');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {config.ui.title}
              </h1>
              <HealthStatus status={healthStatus} onRetry={checkHealth} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('single')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'single'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Single Entity Matching
            </button>
            <button
              onClick={() => setActiveTab('batch')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'batch'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Batch Upload
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'single' && <SingleMatch />}
          {activeTab === 'batch' && <BatchUpload />}
        </div>
      </main>
    </div>
  );
}

export default App;
