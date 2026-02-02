//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Checks if value is empty (object, array, string, Map, or Set).
 *
 * @param value - The value to check.
 * @returns `true` if value is empty, `false` otherwise.
 * @since 1.1.0
 *
 * @note Primitives (numbers, booleans) and null/undefined return `true`.
 *
 * @performance O(1) for primitives/null/undefined/arrays/strings/Map/Set via early returns and native properties. O(n) for objects due to Object.keys().
 *
 * @example
 * ```typescript
 * isEmpty([]);           // => true
 * isEmpty([1, 2]);       // => false
 * isEmpty({});           // => true
 * isEmpty({ a: 1 });     // => false
 * isEmpty('');           // => true
 * isEmpty('abc');        // => false
 * isEmpty(new Map());    // => true
 * isEmpty(new Set([1])); // => false
 * isEmpty(null);         // => true
 * isEmpty(42);           // => true (primitives are "empty")
 * ```
 */
export function isEmpty(value: unknown): boolean {
  if (value == null) {
    return true;
  }

  if (Array.isArray(value) || typeof value === "string") {
    return value.length === 0;
  }

  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }

  // Stryker disable next-line ConditionalExpression: equivalent mutant, primitives passed to Object.keys return empty array, same result as return true
  if (typeof value === "object") {
    return Object.keys(value).length === 0;
  }

  return true;
}
