# Fuzzy Entity Matching Frontend

A modern React TypeScript application for fuzzy entity matching with real-time search and batch processing capabilities.

## 🚀 Features

- **Single Entity Matching**: Real-time search with 300ms debounce
- **Batch Upload**: Drag & drop CSV/JSON file processing
- **Health Monitoring**: API connectivity status with retry functionality
- **Results Export**: CSV export for batch processing results
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Error Handling**: User-friendly error messages and loading states

## 🛠️ Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Dropzone** - File upload handling
- **Papa Parse** - CSV parsing

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:8000`

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── HealthStatus.tsx
│   ├── SingleMatch.tsx
│   ├── MatchCard.tsx
│   └── BatchUpload.tsx
├── services/           # API services
│   └── api.ts
├── types/              # TypeScript interfaces
│   └── api.ts
├── utils/              # Utility functions
│   └── helpers.ts
├── App.tsx             # Main application
└── index.css           # Global styles
```

## 🔌 API Integration

The frontend connects to a backend API with the following endpoints:

- `GET /health` - Health check
- `POST /match` - Single entity matching
- `POST /match/batch` - Batch matching via file upload

### API Models

```typescript
interface MatchRequest { query: string; }
interface MatchResult { 
  entity: string; 
  confidence: number; 
  scores: { tfidf: number; levenshtein: number; token_set: number; }; 
}
interface MatchResponse { 
  query: string; 
  top_match: MatchResult; 
  alternatives: MatchResult[]; 
}
interface BatchMatchResult { 
  input: string; 
  match: string | null; 
  confidence: number; 
  error: string | null; 
}
```

## 📊 Features Overview

### Single Entity Matching
- Real-time search with debouncing
- Confidence visualization with color coding
- Detailed score breakdown (TF-IDF, Levenshtein, Token Set)
- Expandable match details

### Batch Processing
- Drag & drop file upload
- Support for CSV and JSON formats
- File validation (10MB limit, required "names" column)
- Progress tracking during upload
- Results table with status indicators
- Export functionality

### Health Monitoring
- Real-time API connectivity status
- Automatic health checks
- Manual retry functionality

## 🎨 UI Components

- **HealthStatus**: API connectivity indicator
- **SingleMatch**: Real-time search interface
- **MatchCard**: Individual match result display
- **BatchUpload**: File upload and processing interface

## 🔧 Configuration

### Environment Variables

The application uses environment variables for configuration. Copy `env.example` to `.env` and customize the settings:

```bash
cp env.example .env
```

#### Available Environment Variables

**API Configuration:**
- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:8000)
- `VITE_API_TIMEOUT` - API request timeout in milliseconds (default: 30000)

**Development Server:**
- `VITE_DEV_SERVER_PORT` - Development server port (default: 5173)
- `VITE_DEV_SERVER_HOST` - Development server host (default: localhost)

**Feature Flags:**
- `VITE_ENABLE_HEALTH_CHECK` - Enable health monitoring (default: true)
- `VITE_ENABLE_BATCH_UPLOAD` - Enable batch upload feature (default: true)
- `VITE_ENABLE_EXPORT_FEATURE` - Enable export functionality (default: true)

**File Upload:**
- `VITE_MAX_FILE_SIZE` - Maximum file size in bytes (default: 10485760 = 10MB)
- `VITE_ALLOWED_FILE_TYPES` - Comma-separated list of allowed file types

**Search Configuration:**
- `VITE_SEARCH_DEBOUNCE_MS` - Search debounce delay (default: 300)
- `VITE_MAX_ALTERNATIVES` - Maximum alternative matches (default: 10)

**UI Configuration:**
- `VITE_APP_TITLE` - Application title
- `VITE_APP_DESCRIPTION` - Application description

### Environment Files

- `env.example` - Example configuration (safe to commit)
- `.env` - Local development settings (gitignored)
- `.env.development` - Development environment settings
- `.env.production` - Production environment settings

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
