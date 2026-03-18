/**
 * LLM Proxy demo: memoize from Pithos for caching,
 * manual rate-limit, and fallback provider.
 */

import { memoize } from "@pithos/core/eidos/proxy/proxy";
import type { ProxyLogEntry, ProxyStats } from "./types";
import { RESPONSES, DEFAULT_RESPONSE, PRIMARY_COST, FALLBACK_COST, RATE_LIMIT_WINDOW } from "./data";

// Re-export for consumers
export type { ProxyLogEntry, ProxyStats } from "./types";
export { PRESET_QUESTIONS } from "./data";

async function simulateCall(question: string, delayMs: number): Promise<string> {
  await new Promise((r) => setTimeout(r, delayMs));
  return RESPONSES[question] ?? DEFAULT_RESPONSE;
}

export function createLLMProxy() {
  let simulateFailure = false;
  let lastCallTime = 0;
  let logId = 0;

  const cachedPrimaryCall = memoize(
    (question: string) => simulateCall(question, 800 + Math.random() * 600),
  );

  const cachedBackupCall = memoize(
    (question: string) => simulateCall(question, 1200 + Math.random() * 800),
  );

  const stats: ProxyStats = {
    logs: [],
    totalCost: 0,
    totalSaved: 0,
    cacheHits: 0,
    rateLimitHits: 0,
    fallbackHits: 0,
  };

  function addEntry(entry: ProxyLogEntry) {
    stats.logs = [entry, ...stats.logs];
  }

  async function ask(question: string): Promise<{ entry: ProxyLogEntry; stats: ProxyStats }> {
    const now = Date.now();
    const elapsed = now - lastCallTime;

    // Rate limit
    if (lastCallTime > 0 && elapsed < RATE_LIMIT_WINDOW) {
      const entry: ProxyLogEntry = {
        id: ++logId, question, type: "rate-limited", provider: null,
        duration: 0, cost: 0,
        response: `Rate limited. Try again in ${Math.ceil((RATE_LIMIT_WINDOW - elapsed) / 1000)}s.`,
        timestamp: now,
      };
      stats.rateLimitHits++;
      addEntry(entry);
      return { entry, stats: { ...stats } };
    }

    lastCallTime = now;
    const start = performance.now();

    // Primary or fallback
    const useFallback = simulateFailure;
    const call = useFallback ? cachedBackupCall : cachedPrimaryCall;
    const cost = useFallback ? FALLBACK_COST : PRIMARY_COST;

    const response = await call(question);
    const duration = Math.round(performance.now() - start);
    const isCacheHit = duration < 50;

    const entry: ProxyLogEntry = {
      id: ++logId, question,
      type: isCacheHit ? "cache-hit" : useFallback ? "fallback" : "cache-miss",
      provider: isCacheHit ? null : useFallback ? "backup" : "primary",
      duration, cost: isCacheHit ? 0 : cost, response, timestamp: now,
    };

    if (isCacheHit) {
      stats.cacheHits++;
      stats.totalSaved += cost;
    } else {
      stats.totalCost += cost;
      if (useFallback) stats.fallbackHits++;
    }

    addEntry(entry);
    return { entry, stats: { ...stats } };
  }

  return {
    ask,
    setSimulateFailure: (v: boolean) => { simulateFailure = v; },
    getSimulateFailure: () => simulateFailure,
    reset: () => {
      Object.assign(stats, { logs: [], totalCost: 0, totalSaved: 0, cacheHits: 0, rateLimitHits: 0, fallbackHits: 0 });
      lastCallTime = 0;
      logId = 0;
    },
    stats,
  };
}
