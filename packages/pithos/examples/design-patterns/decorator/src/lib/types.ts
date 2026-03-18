export interface AnalysisResult {
  gcContent: number;
  length: number;
  quality: number;
  isValid: boolean;
}

export interface LogEntry {
  decorator: string;
  action: string;
  timestamp: number;
  duration?: number;
}

export type DecoratorOption = "qualityFilter" | "cache" | "retry" | "timing";
