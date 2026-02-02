/**
 * Returns an empty array.
 *
 * @returns An empty array.
 * @deprecated Use an inline arrow function `() => []` instead.
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * stubArray();  // => []
 *
 * // ✅ Recommended approach
 * (() => [])();  // => []
 * ```
 */
export function stubArray(): unknown[] {
  return [];
}
