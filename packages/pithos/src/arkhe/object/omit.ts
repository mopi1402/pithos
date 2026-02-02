//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-18
/**
 * Creates a new object with specified keys omitted.
 *
 * @template T - The type of the input object.
 * @template K - The type of the keys to omit.
 * @param object - The object to omit keys from.
 * @param keys - Array of keys to omit.
 * @returns A new object without the specified keys.
 * @since 1.1.0
 *
 * @note Non-existent keys are ignored.
 * @note Overload with `PropertyKey[]` returns `Partial<T>` for dynamic keys.
 *
 * @performance O(n + k) time & space where n is object size, k is number of keys to omit. Uses spread operator then delete operations.
 *
 * @see pick
 *
 * @example
 * ```typescript
 * const obj = { a: 1, b: 2, c: 3 };
 *
 * omit(obj, ['b']);      // => { a: 1, c: 3 }
 * omit(obj, ['a', 'c']); // => { b: 2 }
 *
 * // Remove sensitive data
 * const user = { id: 1, name: 'John', password: 'secret' };
 * omit(user, ['password']); // => { id: 1, name: 'John' }
 *
 * // Dynamic keys (Object.keys)
 * const keysToOmit = Object.keys({ b: true, c: true });
 * omit(obj, keysToOmit); // => { a: 1 }
 * ```
 */

export function omit<
  // INTENTIONAL: any for values; type inference preserved via generics T and K
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<PropertyKey, any>,
  K extends keyof T
>(object: T, keys: readonly K[]): Omit<T, K>;
export function omit<
  // INTENTIONAL: any for values; type inference preserved via generics T
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<PropertyKey, any>
>(object: T, keys: readonly PropertyKey[]): Partial<T>;
export function omit<
  // INTENTIONAL: any for values; type inference preserved via generics T
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<PropertyKey, any>
>(object: T, keys: readonly PropertyKey[]): Partial<T> {
  const result = { ...object };

  for (const key of keys) {
    delete result[key as keyof T];
  }

  return result;
}
