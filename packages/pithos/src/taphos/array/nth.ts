import { at } from "./at";

/**
 * Gets the element at index n of array.
 *
 * If n is negative, the nth element from the end is returned. Alias for {@link at}.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to query.
 * @param index - The index of the element to return.
 * @returns The element at the given index, or `undefined` if out of bounds.
 * @deprecated Use `array.at(index)` directly instead.
 * Reason: Alias of {@link at}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at | Array.at() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_array_at | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 *
 * // ❌ Deprecated approach
 * const last = nth(numbers, -1);
 * console.log(last); // 5
 *
 * // ✅ Recommended approach
 * const lastNative = numbers[numbers.length - 1];
 * console.log(lastNative); // 5
 *
 * // ✅ Modern approach with ES2022
 * const lastModern = numbers.at(-1);
 * console.log(lastModern); // 5
 * ```
 */
export function nth<T>(array: T[], index: number): T | undefined {
    return at(array, index);
}