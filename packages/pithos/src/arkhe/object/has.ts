/**
 * Checks if an object has a property as its own (not inherited).
 *
 * @template T - The type of the object.
 * @param object - The object to check.
 * @param key - The property key to check for.
 * @returns `true` if the object has the own property, `false` otherwise.
 * @since 1.1.0
 *
 * @note Works with objects created via `Object.create(null)`.
 * Undefined/null values still return `true` if the property exists.
 *
 * @performance O(1) - Direct property lookup via `Object.prototype.hasOwnProperty`.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn | Object.hasOwn} (ES2022 native alternative)
 *
 * @example
 * ```typescript
 * const obj = { a: 1, b: undefined };
 *
 * has(obj, 'a'); // => true
 * has(obj, 'b'); // => true (property exists)
 * has(obj, 'c'); // => false
 *
 * const bare = Object.create(null);
 * bare.x = 42;
 * has(bare, 'x'); // => true
 * ```
 */
export function has<T extends object>(object: T, key: PropertyKey): boolean {
  return Object.prototype.hasOwnProperty.call(object, key);
}
