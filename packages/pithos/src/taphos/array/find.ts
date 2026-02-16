/**
 * Iterates over elements of collection, returning the first element predicate returns truthy for.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to search.
 * @param predicate - The function invoked per iteration.
 * @returns The matched element, or `undefined` if not found.
 * @deprecated Use `array.find(predicate)` directly instead.
 * Reason: Native equivalent method now available
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find | Array.find() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_array_find | Browser support - Can I Use}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const users = [
 *   { name: 'John', age: 25 },
 *   { name: 'Jane', age: 30 },
 *   { name: 'Bob', age: 35 }
 * ];
 *
 * // ❌ Deprecated approach
 * const found = find(users, user => user.age > 28);
 * console.log(found); // { name: 'Jane', age: 30 }
 *
 * // ✅ Recommended approach
 * const foundNative = users.find(user => user.age > 28);
 * console.log(foundNative); // { name: 'Jane', age: 30 }
 * ```
 */
export function find<T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => boolean
): T | undefined {
  return array.find(predicate);
}