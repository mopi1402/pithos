export interface ProxyLogEntry {
  id: number;
  question: string;
  type: "cache-miss" | "cache-hit" | "rate-limited" | "fallback";
  provider: "primary" | "backup" | null;
  duration: number;
  cost: number;
  response: string;
  timestamp: number;
}

export interface ProxyStats {
  logs: ProxyLogEntry[];
  totalCost: number;
  totalSaved: number;
  cacheHits: number;
  rateLimitHits: number;
  fallbackHits: number;
}
