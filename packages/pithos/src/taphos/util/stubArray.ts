/**
 * Returns an empty array.
 *
 * @returns An empty array.
 * @deprecated Use an inline arrow function `() => []` instead.
 * @since 2.0.0
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
