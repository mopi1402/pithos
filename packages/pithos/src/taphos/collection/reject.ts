/**
 * The opposite of `filter`; this method returns the elements of collection that predicate does not return truthy for.
 *
 * @template T - The type of elements in the array, or the object type.
 * @param collection - The collection to iterate over.
 * @param predicate - The function invoked per iteration.
 * @returns The new filtered array or object.
 * @deprecated Use `array.filter()` with negated predicate or `Object.entries().filter()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter | Array.filter() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_array_filter | Browser support - Can I Use}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries | Object.entries() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_object_entries | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 *
 * // ❌ Deprecated approach
 * const oddNumbers = reject(numbers, n => n % 2 === 0);
 * console.log(oddNumbers); // [1, 3, 5]
 *
 * // ✅ Recommended approach (for arrays)
 * const oddNumbersNative = numbers.filter(n => n % 2 !== 0);
 * console.log(oddNumbersNative); // [1, 3, 5]
 *
 * // ✅ Recommended approach (for objects)
 * const obj = { a: 1, b: 2, c: 3 };
 * const oddValuesObj = Object.fromEntries(
 *   Object.entries(obj).filter(([, value]) => value % 2 !== 0)
 * );
 * console.log(oddValuesObj); // { a: 1, c: 3 }
 * ```
 */

export function reject<T>(
  collection: T[],
  predicate: (value: T, index: number, array: T[]) => boolean
): T[];
export function reject<T extends Record<string, unknown>>(
  collection: T,
  predicate: (value: T[keyof T], key: keyof T, object: T) => boolean
): Partial<T>;
// INTENTIONAL: Implementation uses `any` for filter compatibility - public API is type-safe via overloads
export function reject(
  collection: any,
  predicate: any
): any {
  if (Array.isArray(collection)) {
    return collection.filter(
      (value, index) => !predicate(value, index, collection)
    );
  }

  return Object.fromEntries(
    Object.entries(collection).filter(([key, value]) => !predicate(value, key, collection))
  );
}