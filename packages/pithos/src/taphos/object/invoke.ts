import { get } from "../../arkhe/object/get";

/**
 * Invokes the method at path of object with the given arguments.
 *
 * @param object - The object to query.
 * @param path - The path of the method to invoke.
 * @param args - The arguments to invoke the method with.
 * @returns The result of the invoked method.
 * @deprecated Use `get(obj, path)?.(...args)` or optional chaining directly instead.
 * @see get
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const object = {
 *   a: {
 *     b: {
 *       greet: (name: string) => `Hello, ${name}!`
 *     }
 *   }
 * };
 *
 * // ❌ Deprecated approach
 * invoke(object, 'a.b.greet', ['World']);
 * // => 'Hello, World!'
 *
 * // ✅ Recommended approach
 * get(object, 'a.b.greet')?.('World');
 * // => 'Hello, World!'
 *
 * // Or with optional chaining
 * object.a?.b?.greet?.('World');
 * // => 'Hello, World!'
 * ```
 */
export function invoke<T>(
  object: T,
  path: string | (string | number | symbol)[],
  args: unknown[] = []
): unknown {
  const method = get(object, path);
  return typeof method === "function" ? method(...args) : undefined;
}
