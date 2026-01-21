
export interface Entity {
  type: string;
  name: string;
  count: number;
}

export interface Emotion {
  label: string;
  score: number;
  emoji: string;
}

export interface Topic {
  id: number;
  label: string;
  relevance: number;
}

export interface SentimentSegment {
  segment: string;
  score: number;
}

export interface EntityTypeCount {
  type: string;
  count: number;
}

export interface AnalysisResult {
  language: string;
  sentiment: {
    label: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    score: number;
  };
  sentimentProgression: SentimentSegment[];
  entityDistribution: EntityTypeCount[];
  emotions: Emotion[];
  topics: Topic[];
  keywords: string[];
  entities: Entity[];
  summary: {
    ultraConcise: string;
    detailed: string[];
  };
  intent: string;
  insights: string[];
  preprocessing: {
    tokens: string[];
    stopsRemoved: number;
    lemmas: string[];
  };
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  text: string;
  result: AnalysisResult;
}

// Updated by Ravi-Chand
