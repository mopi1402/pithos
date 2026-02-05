/**
 * Shared formatting utilities used across comparison components.
 */

/**
 * Formats an ISO date string to a human-readable format (e.g., "Jan 1, 2025").
 */
export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Formats operations per second with appropriate suffix (K, M, B).
 */
export function formatOps(ops: number): string {
  if (ops >= 1e9) return `${(ops / 1e9).toFixed(2)}B`;
  if (ops >= 1e6) return `${(ops / 1e6).toFixed(2)}M`;
  if (ops >= 1e3) return `${(ops / 1e3).toFixed(2)}K`;
  if (ops < 100) return ops.toFixed(2);
  return ops.toFixed(0);
}

/**
 * Formats byte values to human-readable format (e.g., "3.14 kB").
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  return `${kb.toFixed(2)} kB`;
}

/**
 * Formats duration in milliseconds to human-readable format.
 */
export function formatDuration(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
  return `${ms}ms`;
}

/**
 * Formats test name with zero-width space before parentheses for mobile line breaks.
 */
export function formatTestName(name: string): string {
  return name.replace(/ \(/g, " \u200B(");
}

/**
 * Formats a library name for display (handles special cases like typebox, fastest-validator).
 */
export function formatLibraryName(lib: string): string {
  if (lib === "kanon") return "Kanon";
  if (lib === "@sinclair/typebox") return "typebox";
  if (lib === "fastest-validator") return "fastest-\u200Bvalidator";
  return lib;
}

/**
 * Normalizes library names for display (e.g., "fp-ts/Option" → "fp-ts").
 */
export function normalizeLibraryName(name: string): string {
  if (name.startsWith("fp-ts/")) return "fp-ts";
  return name;
}
