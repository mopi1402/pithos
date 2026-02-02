/**
 * Returns true.
 *
 * @returns `true`.
 * @deprecated Use an inline arrow function `() => true` instead.
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * stubTrue();  // => true
 *
 * // ✅ Recommended approach
 * (() => true)();  // => true
 * ```
 */
export function stubTrue(): true {
  return true;
}
