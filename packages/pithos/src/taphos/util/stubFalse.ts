/**
 * Returns false.
 *
 * @returns `false`.
 * @deprecated Use an inline arrow function `() => false` instead.
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * stubFalse();  // => false
 *
 * // ✅ Recommended approach
 * (() => false)();  // => false
 * ```
 */
export function stubFalse(): false {
  return false;
}
