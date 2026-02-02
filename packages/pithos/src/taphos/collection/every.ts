/**
 * Checks if predicate returns truthy for all elements of collection.
 *
 * @template T - The type of elements in the array, or the object type.
 * @param collection - The collection to iterate over.
 * @param predicate - The function invoked per iteration.
 * @returns `true` if all elements pass the predicate check, else `false`.
 * @deprecated Use `array.every()` or `Object.values().every()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every | Array.every() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_array_every | Browser support - Can I Use}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values | Object.values() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_object_values | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 *
 * // ❌ Deprecated approach
 * const allPositive = every(numbers, n => n > 0);
 * console.log(allPositive); // true
 *
 * // ✅ Recommended approach (for arrays)
 * const allPositiveNative = numbers.every(n => n > 0);
 * console.log(allPositiveNative); // true
 *
 * // ✅ Recommended approach (for objects)
 * const obj = { a: 1, b: 2, c: 3 };
 * const allPositiveObj = Object.values(obj).every(n => n > 0);
 * console.log(allPositiveObj); // true
 * ```
 */

export function every<T>(
  collection: T[],
  predicate: (value: T, index: number, array: T[]) => boolean
): boolean;
export function every<T extends Record<string, unknown>>(
  collection: T,
  predicate: (value: T[keyof T], key: keyof T, object: T) => boolean
): boolean;
// INTENTIONAL: Implementation signature uses `unknown` to satisfy both overloads - public API is type-safe via overloads
export function every(
  collection: unknown,
  predicate: unknown
): boolean {
  if (Array.isArray(collection)) {
    return collection.every(predicate as (value: unknown, index: number, array: unknown[]) => boolean);
  }

  const obj = collection as Record<string, unknown>;
  return Object.entries(obj).every(([key, value]) =>
    (predicate as (value: unknown, key: string, object: Record<string, unknown>) => boolean)(value, key, obj)
  );
}