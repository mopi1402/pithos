/**
 * DNA Analysis Pipeline using Pithos Decorator pattern.
 *
 * decorate(fn, ...decorators) stacks behaviors without modifying the core function.
 * Each decorator wraps the previous one — same signature in, same signature out.
 */
import { decorate, around, type Decorator } from "@pithos/core/eidos/decorator/decorator";
import type { AnalysisResult, DecoratorOption, LogEntry } from "./types";

/** Shared execution log for visualization */
export const executionLog: LogEntry[] = [];

export function clearLog() { executionLog.length = 0; }

function log(decorator: string, action: string, duration?: number) {
  executionLog.push({ decorator, action, timestamp: Date.now(), duration });
}

/** Core analysis function — pure, no side effects */
export async function analyzeSequence(dna: string): Promise<AnalysisResult> {
  await new Promise((r) => setTimeout(r, 100 + Math.random() * 200));
  const upper = dna.toUpperCase();
  const gcCount = (upper.match(/[GC]/g) || []).length;
  const gcContent = (gcCount / dna.length) * 100;
  const quality = Math.min(100, 50 + gcContent / 2 + Math.random() * 20);
  return { gcContent: Math.round(gcContent * 10) / 10, length: dna.length, quality: Math.round(quality), isValid: true };
}

/** Quality filter decorator */
function withQualityFilter(minQuality: number): Decorator<string, Promise<AnalysisResult>> {
  return around(async (fn, dna) => {
    log("Quality Filter", `Checking sequence (min: ${minQuality})`);
    const start = Date.now();
    const upper = dna.toUpperCase();
    const estimatedQuality = ((upper.match(/[ATCG]/g) || []).length / dna.length) * 100;
    if (estimatedQuality < minQuality) {
      log("Quality Filter", `❌ Rejected (quality: ${estimatedQuality.toFixed(0)})`, Date.now() - start);
      throw new Error(`Sequence quality ${estimatedQuality.toFixed(0)} below threshold ${minQuality}`);
    }
    log("Quality Filter", `✓ Passed (quality: ${estimatedQuality.toFixed(0)})`, Date.now() - start);
    return fn(dna);
  });
}

/** Cache decorator */
function withCache(cache: Map<string, AnalysisResult>): Decorator<string, Promise<AnalysisResult>> {
  return around(async (fn, dna) => {
    log("Cache", "Checking cache...");
    const start = Date.now();
    const cached = cache.get(dna);
    if (cached) { log("Cache", "✓ Cache hit!", Date.now() - start); return cached; }
    log("Cache", "○ Cache miss, analyzing...", Date.now() - start);
    const result = await fn(dna);
    cache.set(dna, result);
    return result;
  });
}

/** Retry decorator */
function withRetry(maxAttempts: number): Decorator<string, Promise<AnalysisResult>> {
  return around(async (fn, dna) => {
    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      log("Retry", `Attempt ${attempt}/${maxAttempts}`);
      const start = Date.now();
      try {
        const result = await fn(dna);
        log("Retry", `✓ Success on attempt ${attempt}`, Date.now() - start);
        return result;
      } catch (e) {
        lastError = e instanceof Error ? e : new Error(String(e));
        log("Retry", `✗ Failed: ${lastError.message}`, Date.now() - start);
        if (attempt < maxAttempts) await new Promise((r) => setTimeout(r, 100 * attempt));
      }
    }
    throw lastError;
  });
}

/** Timing decorator */
function withTiming(label: string): Decorator<string, Promise<AnalysisResult>> {
  return around(async (fn, dna) => {
    log("Timing", `Starting ${label}...`);
    const start = Date.now();
    const result = await fn(dna);
    log("Timing", `✓ ${label} completed in ${Date.now() - start}ms`, Date.now() - start);
    return result;
  });
}

/** Shared cache instance */
const analysisCache = new Map<string, AnalysisResult>();
export function clearCache() { analysisCache.clear(); }

const DECORATOR_FACTORIES: Record<DecoratorOption, () => Decorator<string, Promise<AnalysisResult>>> = {
  qualityFilter: () => withQualityFilter(80),
  cache: () => withCache(analysisCache),
  retry: () => withRetry(3),
  timing: () => withTiming("analysis"),
};

/** Build the analysis pipeline based on selected decorators */
export function buildPipeline(options: DecoratorOption[]): (dna: string) => Promise<AnalysisResult> {
  const decorators = options.map((opt) => DECORATOR_FACTORIES[opt]());
  return decorators.length ? decorate(analyzeSequence, ...decorators) : analyzeSequence;
}
