/**
 * Returns the first argument it receives.
 *
 * @template T - The type of the value.
 * @param value - Any value.
 * @returns The value.
 * @deprecated Use an inline arrow function `(x) => x` instead.
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * [1, 2, 3].filter(identity);
 *
 * // ✅ Recommended approach
 * [1, 2, 3].filter(x => x);
 * // Or simply
 * [1, 2, 3].filter(Boolean);
 * ```
 */
export function identity<T>(value: T): T {
  return value;
}
