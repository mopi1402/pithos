/**
 * Returns an empty string.
 *
 * @returns An empty string.
 * @deprecated Use an inline arrow function `() => ''` instead.
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * stubString();  // => ''
 *
 * // ✅ Recommended approach
 * (() => '')();  // => ''
 * ```
 */
export function stubString(): string {
  return "";
}
