/**
 * Checks if predicate returns truthy for any element of collection.
 *
 * @template T - The type of elements in the array, or the object type.
 * @param collection - The collection to iterate over.
 * @param predicate - The function invoked per iteration.
 * @returns `true` if any element passes the predicate check, else `false`.
 * @deprecated Use `array.some()` or `Object.values().some()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some | Array.some() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_array_some | Browser support - Can I Use}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values | Object.values() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_object_values | Browser support - Can I Use}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 *
 * // ❌ Deprecated approach
 * const hasEven = some(numbers, n => n % 2 === 0);
 * console.log(hasEven); // true
 *
 * // ✅ Recommended approach (for arrays)
 * const hasEvenNative = numbers.some(n => n % 2 === 0);
 * console.log(hasEvenNative); // true
 *
 * // ✅ Recommended approach (for objects)
 * const obj = { a: 1, b: 2, c: 3 };
 * const hasEvenObj = Object.values(obj).some(n => n % 2 === 0);
 * console.log(hasEvenObj); // true
 * ```
 */

export function some<T>(
  collection: T[],
  predicate: (value: T, index: number, array: T[]) => boolean
): boolean;
export function some<T extends Record<string, unknown>>(
  collection: T,
  predicate: (value: T[keyof T], key: keyof T, object: T) => boolean
): boolean;
// INTENTIONAL: Implementation uses `unknown` with type guard - public API is type-safe via overloads
export function some(
  collection: unknown,
  predicate: unknown
): boolean {
  if (Array.isArray(collection)) {
    return collection.some(predicate as (value: unknown, index: number, array: unknown[]) => boolean);
  }

  const obj = collection as Record<string, unknown>;
  const pred = predicate as (value: unknown, key: string, object: Record<string, unknown>) => boolean;
  return Object.entries(obj).some(([key, value]) => pred(value, key, obj));
}