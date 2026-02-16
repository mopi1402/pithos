/**
 * Iterates over own enumerable string keyed properties of an object.
 *
 * @template T - The type of the object.
 * @param object - The object to iterate over.
 * @param iteratee - The function invoked per iteration.
 * @deprecated Use `Object.keys().forEach()` or `Object.entries().forEach()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys | Object.keys() - MDN}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * forOwn({ a: 1, b: 2 }, (value, key) => console.log(key, value));
 *
 * // ✅ Recommended approach
 * Object.entries({ a: 1, b: 2 }).forEach(([key, value]) => {
 *   console.log(key, value);
 * });
 * ```
 */
export function forOwn<T extends object>(
  object: T,
  iteratee: (value: T[keyof T], key: string, object: T) => void
): void {
  for (const key of Object.keys(object)) {
    iteratee(object[key as keyof T], key, object);
  }
}
