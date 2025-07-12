// API Models for Fuzzy Entity Matching

export interface MatchRequest {
  query: string;
}

export interface MatchResult {
  entity: string;
  confidence: number;
  scores: {
    tfidf: number;
    levenshtein: number;
    token_set: number;
  };
}

export interface MatchResponse {
  query: string;
  top_match: MatchResult;
  alternatives: MatchResult[];
}

export interface BatchMatchResult {
  input: string;
  match: string | null;
  confidence: number;
  error: string | null;
  scores?: {
    tfidf: number;
    levenshtein: number;
    token_set: number;
  };
}

export interface HealthResponse {
  status: string;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
} 