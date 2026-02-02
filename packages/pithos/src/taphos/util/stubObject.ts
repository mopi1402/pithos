/**
 * Returns an empty object.
 *
 * @returns An empty object.
 * @deprecated Use an inline arrow function `() => ({})` instead.
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * stubObject();  // => {}
 *
 * // ✅ Recommended approach
 * (() => ({}))();  // => {}
 * ```
 */
export function stubObject(): object {
  return {};
}
