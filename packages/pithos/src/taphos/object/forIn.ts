/**
 * Iterates over own and inherited enumerable string keyed properties of an object.
 *
 * @template T - The type of the object.
 * @param object - The object to iterate over.
 * @param iteratee - The function invoked per iteration.
 * @deprecated Use `for...in` loop directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in | for...in - MDN}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * forIn({ a: 1, b: 2 }, (value, key) => console.log(key, value));
 *
 * // ✅ Recommended approach
 * for (const key in { a: 1, b: 2 }) {
 *   console.log(key, obj[key]);
 * }
 * ```
 */
export function forIn<T extends object>(
  object: T,
  iteratee: (value: T[keyof T], key: string, object: T) => void
): void {
  for (const key in object) {
    iteratee(object[key as keyof T], key, object);
  }
}
