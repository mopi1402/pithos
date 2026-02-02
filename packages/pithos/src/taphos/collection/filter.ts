/**
 * Iterates over elements of collection, returning an array of all elements predicate returns truthy for.
 *
 * @template T - The type of elements in the array, or the object type.
 * @param collection - The collection to iterate over.
 * @param predicate - The function invoked per iteration.
 * @returns The new filtered array or object.
 * @deprecated Use `array.filter()` or `Object.entries().filter()` directly instead.
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
 * const evenNumbers = filter(numbers, n => n % 2 === 0);
 * console.log(evenNumbers); // [2, 4]
 *
 * // ✅ Recommended approach (for arrays)
 * const evenNumbersNative = numbers.filter(n => n % 2 === 0);
 * console.log(evenNumbersNative); // [2, 4]
 *
 * // ✅ Recommended approach (for objects)
 * const obj = { a: 1, b: 2, c: 3 };
 * const evenEntries = Object.fromEntries(
 *   Object.entries(obj).filter(([, value]) => value % 2 === 0)
 * );
 * console.log(evenEntries); // { b: 2 }
 * ```
 */

export function filter<T>(
  collection: T[],
  predicate: (value: T, index: number, array: T[]) => boolean
): T[];
export function filter<T extends Record<string, unknown>>(
  collection: T,
  predicate: (value: T[keyof T], key: keyof T, object: T) => boolean
): Partial<T>;
// INTENTIONAL: Implementation signature uses `unknown` to satisfy both overloads - public API is type-safe via overloads
export function filter(
  collection: unknown,
  predicate: unknown
): unknown {
  if (Array.isArray(collection)) {
    return collection.filter(predicate as (value: unknown, index: number, array: unknown[]) => boolean);
  }

  const obj = collection as Record<string, unknown>;
  const pred = predicate as (value: unknown, key: string, object: Record<string, unknown>) => boolean;
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => pred(value, key, obj))
  );
}