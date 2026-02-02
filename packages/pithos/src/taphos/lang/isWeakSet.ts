/**
 * Checks if value is a WeakSet.
 *
 * @param value - The value to check.
 * @returns `true` if value is a WeakSet, else `false`.
 * @deprecated Use `instanceof WeakSet` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet | WeakSet - MDN}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * isWeakSet(new WeakSet());  // => true
 * isWeakSet(new Set());      // => false
 *
 * // ✅ Recommended approach
 * new WeakSet() instanceof WeakSet;  // => true
 * new Set() instanceof WeakSet;      // => false
 * ```
 */
// INTENTIONAL: WeakSet value type is object, but we check any value
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isWeakSet(value: unknown): value is WeakSet<any> {
  return value instanceof WeakSet;
}
