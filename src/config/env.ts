// Environment Configuration
export const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  },

  // Development Server Configuration
  dev: {
    port: parseInt(import.meta.env.VITE_DEV_SERVER_PORT || '5173'),
    host: import.meta.env.VITE_DEV_SERVER_HOST || 'localhost',
  },

  // Feature Flags
  features: {
    healthCheck: import.meta.env.VITE_ENABLE_HEALTH_CHECK === 'true',
    batchUpload: import.meta.env.VITE_ENABLE_BATCH_UPLOAD === 'true',
    exportFeature: import.meta.env.VITE_ENABLE_EXPORT_FEATURE === 'true',
  },

  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '10485760'), // 10MB
    allowedTypes: (import.meta.env.VITE_ALLOWED_FILE_TYPES || 'text/csv,application/json').split(','),
  },

  // Search Configuration
  search: {
    debounceMs: parseInt(import.meta.env.VITE_SEARCH_DEBOUNCE_MS || '300'),
    maxAlternatives: parseInt(import.meta.env.VITE_MAX_ALTERNATIVES || '10'),
  },

  // UI Configuration
  ui: {
    title: import.meta.env.VITE_APP_TITLE || 'Fuzzy Entity Matcher',
    description: import.meta.env.VITE_APP_DESCRIPTION || 'Modern fuzzy entity matching application',
  },

  // Error Reporting (Optional)
  errorReporting: {
    enabled: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
    url: import.meta.env.VITE_ERROR_REPORTING_URL || '',
  },

  // Analytics (Optional)
  analytics: {
    enabled: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    id: import.meta.env.VITE_ANALYTICS_ID || '',
  },
};

// Helper function to get environment variable with fallback
export function getEnvVar(key: string, fallback: string = ''): string {
  return import.meta.env[key] || fallback;
}

// Helper function to check if we're in development mode
export const isDevelopment = import.meta.env.DEV;

// Helper function to check if we're in production mode
export const isProduction = import.meta.env.PROD;

export default config;

// Debug log to verify environment variables (development only)
if (import.meta.env.DEV) {
  console.log('🔧 Environment Configuration:', {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
    apiTimeout: import.meta.env.VITE_API_TIMEOUT,
    resolvedBaseUrl: config.api.baseUrl,
  });
} 