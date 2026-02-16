/**
 * Checks if value is in collection.
 *
 * @template T - The type of elements in the array, or the object type.
 * @param collection - The collection to inspect.
 * @param value - The value to search for.
 * @param fromIndex - The index to search from.
 * @returns `true` if value is found, else `false`.
 * @deprecated Use `array.includes()` or `Object.values().includes()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes | Array.includes() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_array_includes | Browser support - Can I Use}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values | Object.values() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_object_values | Browser support - Can I Use}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 *
 * // ❌ Deprecated approach
 * const hasThree = includes(numbers, 3);
 * console.log(hasThree); // true
 *
 * // ✅ Recommended approach (for arrays)
 * const hasThreeNative = numbers.includes(3);
 * console.log(hasThreeNative); // true
 *
 * // ✅ Recommended approach (for objects)
 * const obj = { a: 1, b: 2, c: 3 };
 * const hasThreeObj = Object.values(obj).includes(3);
 * console.log(hasThreeObj); // true
 * ```
 */

export function includes<T>(collection: T[], value: T, fromIndex?: number): boolean;
export function includes<T extends Record<string, unknown>>(
  collection: T,
  value: T[keyof T]
): boolean;
// INTENTIONAL: Implementation signature uses `unknown` to satisfy both overloads - public API is type-safe via overloads
export function includes(
  collection: unknown,
  value: unknown,
  fromIndex?: number
): boolean {
  if (Array.isArray(collection)) {
    return collection.includes(value, fromIndex);
  }

  return Object.values(collection as Record<string, unknown>).includes(value);
}