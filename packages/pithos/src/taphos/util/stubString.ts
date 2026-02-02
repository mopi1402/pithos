/**
 * Returns an empty string.
 *
 * @returns An empty string.
 * @deprecated Use an inline arrow function `() => ''` instead.
 * @since 1.1.0
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
