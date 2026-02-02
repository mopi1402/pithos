/**
 * Creates an object composed from arrays of keys and values.
 *
 * @template K - The type of keys (must be valid property key).
 * @template V - The type of values.
 * @param keys - The property keys.
 * @param values - The property values.
 * @returns The new object.
 * @deprecated Use `Object.fromEntries()` with `map()` or `zip()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries | Object.fromEntries() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_object_fromentries | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * zipObject(['a', 'b'], [1, 2]);
 * // => { a: 1, b: 2 }
 *
 * // ✅ Recommended approach
 * Object.fromEntries(['a', 'b'].map((k, i) => [k, [1, 2][i]]));
 * // => { a: 1, b: 2 }
 *
 * // Or using zip from Arkhe
 * import { zip } from '@pithos/arkhe/array/zip';
 * Object.fromEntries(zip(['a', 'b'], [1, 2]));
 * // => { a: 1, b: 2 }
 * ```
 */
export function zipObject<K extends PropertyKey, V>(
  keys: readonly K[],
  values: readonly V[]
): Record<K, V> {
  const result = {} as Record<K, V>;

  for (let i = 0; i < keys.length; i++) {
    result[keys[i]] = values[i];
  }

  return result;
}
