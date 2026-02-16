/**
 * Gets the size of collection by returning its length for array-like values or the number of own enumerable string keyed properties for objects.
 *
 * @template T - The type of elements in the array, or the object type.
 * @param collection - The collection to inspect.
 * @returns The collection size.
 * @deprecated Use `array.length` or `Object.keys().length` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/length | Array.length - MDN}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys | Object.keys() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_object_keys | Browser support - Can I Use}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 *
 * // ❌ Deprecated approach
 * const arraySize = size(numbers);
 * console.log(arraySize); // 5
 *
 * // ✅ Recommended approach (for arrays)
 * const arraySizeNative = numbers.length;
 * console.log(arraySizeNative); // 5
 *
 * // ✅ Recommended approach (for objects)
 * const obj = { a: 1, b: 2, c: 3 };
 * const objSizeNative = Object.keys(obj).length;
 * console.log(objSizeNative); // 3
 * ```
 */

export function size<T>(collection: T[]): number;
export function size<T extends Record<string, unknown>>(collection: T): number;
// INTENTIONAL: Implementation uses `unknown` with type guard - public API is type-safe via overloads
export function size(collection: unknown): number {
  if (Array.isArray(collection)) {
    return collection.length;
  }

  return Object.keys(collection as Record<string, unknown>).length;
}