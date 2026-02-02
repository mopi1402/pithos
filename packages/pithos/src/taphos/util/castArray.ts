import { toArray } from "../../arkhe/array/to-array";
import type { Arrayable } from "../../arkhe/types/common/arrayable";

/**
 * Casts value as an array if it's not one.
 *
 * Alias for {@link toArray}.
 *
 * @template T - The type of elements.
 * @param value - The value to inspect.
 * @returns The cast array.
 * @deprecated Use `toArray` from Arkhe directly instead.
 * @see {@link toArray}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray | Array.isArray() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_array_isarray | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * castArray(1);        // => [1]
 * castArray([1, 2, 3]); // => [1, 2, 3]
 *
 * // ✅ Recommended approach
 * import { toArray } from 'pithos/arkhe/array/toArray';
 * toArray(1);        // => [1]
 * toArray([1, 2, 3]); // => [1, 2, 3]
 * ```
 */
export function castArray<T>(value: Arrayable<T>): T[] {
    return toArray(value);
}