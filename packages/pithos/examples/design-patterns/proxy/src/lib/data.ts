export const RESPONSES: Record<string, string> = {
  "What is the capital of France?": "The capital of France is Paris.",
  "Explain quantum physics": "Quantum physics describes nature at the atomic scale, where particles behave as both waves and particles.",
  "What is TypeScript?": "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.",
  "How does memoization work?": "Memoization caches function results so repeated calls with the same arguments return instantly.",
  "What is the Proxy pattern?": "The Proxy pattern provides a surrogate that controls access to another object, adding caching, logging, or access control.",
};

export const DEFAULT_RESPONSE = "I can answer questions about programming, science, and general knowledge.";

export const PRIMARY_COST = 0.003;
export const FALLBACK_COST = 0.004;
export const RATE_LIMIT_WINDOW = 1000;

export const PRESET_QUESTIONS = [
  "What is the capital of France?",
  "Explain quantum physics",
  "What is TypeScript?",
  "How does memoization work?",
  "What is the Proxy pattern?",
];
