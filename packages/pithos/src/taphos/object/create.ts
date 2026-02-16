/**
 * Creates an object that inherits from the prototype object.
 *
 * @template T - The type of the prototype object.
 * @param prototype - The object to inherit from.
 * @param properties - The properties to assign to the object.
 * @returns The new object.
 * @deprecated Use `Object.create()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create | Object.create() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_object_create | Browser support - Can I Use}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * const person = { greet() { return 'Hello'; } };
 * const fred = create(person, { name: 'Fred' });
 *
 * // ✅ Recommended approach
 * const person = { greet() { return 'Hello'; } };
 * const fred = Object.assign(Object.create(person), { name: 'Fred' });
 * ```
 */
export function create<T extends object>(
  prototype: T,
  properties?: object
): T {
  const result = Object.create(prototype) as T;
  // Stryker disable next-line ConditionalExpression: Object.assign handles undefined gracefully, so the check is an optimization
  if (properties) {
    Object.assign(result, properties);
  }
  return result;
}
