/**
 * Iterates over elements of collection and invokes iteratee for each element.
 *
 * @template T - The type of elements in the array, or the object type.
 * @param collection - The collection to iterate over.
 * @param iteratee - The function invoked per iteration.
 * @returns The original collection.
 * @deprecated Use `array.forEach()` or `for...of` loop directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach | Array.forEach() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_array_foreach | Browser support - Can I Use}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries | Object.entries() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_object_entries | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 *
 * // ❌ Deprecated approach
 * each(numbers, (value, index) => {
 *   console.log(`Index ${index}: ${value}`);
 * });
 *
 * // ✅ Recommended approach (for arrays)
 * numbers.forEach((value, index) => {
 *   console.log(`Index ${index}: ${value}`);
 * });
 *
 * // ✅ Alternative with for...of
 * for (const [index, value] of numbers.entries()) {
 *   console.log(`Index ${index}: ${value}`);
 * }
 *
 * // ✅ Recommended approach (for objects)
 * const obj = { a: 1, b: 2, c: 3 };
 * Object.entries(obj).forEach(([key, value]) => {
 *   console.log(`${key}: ${value}`);
 * });
 * ```
 */

export function each<T>(
  collection: T[],
  iteratee: (value: T, index: number, array: T[]) => void
): T[];
export function each<T extends Record<string, unknown>>(
  collection: T,
  iteratee: (value: T[keyof T], key: keyof T, object: T) => void
): T;
// INTENTIONAL: Implementation signature uses `unknown` to satisfy both overloads - public API is type-safe via overloads
export function each(
  collection: unknown,
  iteratee: unknown
): unknown {
  if (Array.isArray(collection)) {
    (collection as unknown[]).forEach(iteratee as (value: unknown, index: number, array: unknown[]) => void);
    return collection;
  }

  const obj = collection as Record<string, unknown>;
  Object.entries(obj).forEach(([key, value]) =>
    (iteratee as (value: unknown, key: string, object: Record<string, unknown>) => void)(value, key, obj)
  );
  return collection;
}