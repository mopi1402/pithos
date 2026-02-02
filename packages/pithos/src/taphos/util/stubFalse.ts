/**
 * Returns false.
 *
 * @returns `false`.
 * @deprecated Use an inline arrow function `() => false` instead.
 * @since 1.1.0
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
