import React from 'react';

interface HealthStatusProps {
  status: 'healthy' | 'unhealthy' | 'checking';
  onRetry: () => void;
}

const HealthStatus: React.FC<HealthStatusProps> = ({ status, onRetry }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'healthy':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: '🟢',
          text: 'API Connected'
        };
      case 'unhealthy':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          icon: '🔴',
          text: 'API Disconnected'
        };
      case 'checking':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          icon: '🟡',
          text: 'Checking...'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="flex items-center space-x-2">
      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {config.text}
      </div>
      {status === 'unhealthy' && (
        <button
          onClick={onRetry}
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default HealthStatus; 