/**
 * Checks if value is a WeakMap.
 *
 * @param value - The value to check.
 * @returns `true` if value is a WeakMap, else `false`.
 * @deprecated Use `instanceof WeakMap` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap | WeakMap - MDN}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * isWeakMap(new WeakMap());  // => true
 * isWeakMap(new Map());      // => false
 *
 * // ✅ Recommended approach
 * new WeakMap() instanceof WeakMap;  // => true
 * new Map() instanceof WeakMap;      // => false
 * ```
 */
// INTENTIONAL: WeakMap key type is object, but we check any value
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isWeakMap(value: unknown): value is WeakMap<any, any> {
  return value instanceof WeakMap;
}
