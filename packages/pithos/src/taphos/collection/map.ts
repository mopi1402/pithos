/**
 * Creates an array of values by running each element in collection thru iteratee.
 *
 * @template T - The type of elements in the array, or the object type.
 * @template Result - The type of the mapped result.
 * @param collection - The collection to iterate over.
 * @param iteratee - The function invoked per iteration.
 * @returns The new mapped array.
 * @deprecated Use `array.map()` or `Object.entries().map()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map | Array.map() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_array_map | Browser support - Can I Use}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries | Object.entries() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_object_entries | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 *
 * // ❌ Deprecated approach
 * const doubled = map(numbers, n => n * 2);
 * console.log(doubled); // [2, 4, 6, 8, 10]
 *
 * // ✅ Recommended approach (for arrays)
 * const doubledNative = numbers.map(n => n * 2);
 * console.log(doubledNative); // [2, 4, 6, 8, 10]
 *
 * // ✅ Recommended approach (for objects)
 * const obj = { a: 1, b: 2, c: 3 };
 * const doubledObj = Object.entries(obj).map(([key, value]) => [key, value * 2]);
 * console.log(doubledObj); // [['a', 2], ['b', 4], ['c', 6]]
 * ```
 */

export function map<T, Result>(
  collection: T[],
  iteratee: (value: T, index: number, array: T[]) => Result
): Result[];
export function map<T extends Record<string, unknown>, Result>(
  collection: T,
  iteratee: (value: T[keyof T], key: keyof T, object: T) => Result
): Result[];
// INTENTIONAL: Implementation signature uses `unknown` to satisfy both overloads - public API is type-safe via overloads
export function map(
  collection: unknown,
  iteratee: unknown
): unknown[] {
  if (Array.isArray(collection)) {
    return collection.map(iteratee as (value: unknown, index: number, array: unknown[]) => unknown);
  }

  const obj = collection as Record<string, unknown>;
  const iter = iteratee as (value: unknown, key: string, object: Record<string, unknown>) => unknown;
  return Object.entries(obj).map(([key, value]) => iter(value, key, obj));
}