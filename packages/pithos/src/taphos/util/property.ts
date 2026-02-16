/**
 * Creates a function that returns the value at path of a given object.
 *
 * @template Key - The type of the key.
 * @param key - The key of the property to get.
 * @returns A function that returns the property value.
 * @deprecated Use an inline arrow function `(obj) => obj[key]` instead.
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * const users = [{ name: 'fred' }, { name: 'barney' }];
 * users.map(property('name'));
 * // => ['fred', 'barney']
 *
 * // ✅ Recommended approach
 * const users = [{ name: 'fred' }, { name: 'barney' }];
 * users.map(user => user.name);
 * // => ['fred', 'barney']
 * ```
 */
export function property<Key extends PropertyKey>(
  key: Key
): <T extends Record<Key, unknown>>(object: T) => T[Key] {
  return <T extends Record<Key, unknown>>(object: T) => object[key];
}
