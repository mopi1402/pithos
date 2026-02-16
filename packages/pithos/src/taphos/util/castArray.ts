/**
 * Casts value as an array if it's not one.
 *
 * @template T - The type of elements.
 * @param value - The value to inspect.
 * @returns The cast array.
 * @deprecated Use `Array.isArray(value) ? value : [value]` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray | Array.isArray() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_array_isarray | Browser support - Can I Use}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * castArray(1);        // => [1]
 * castArray([1, 2, 3]); // => [1, 2, 3]
 *
 * // ✅ Recommended approach
 * Array.isArray(1) ? 1 : [1];           // => [1]
 * Array.isArray([1, 2, 3]) ? [1, 2, 3] : [[1, 2, 3]]; // => [1, 2, 3]
 * ```
 */
export function castArray<T>(value: T | T[]): T[] {
    return Array.isArray(value) ? value : [value];
}