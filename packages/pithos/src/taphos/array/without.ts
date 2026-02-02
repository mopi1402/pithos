import { difference } from "../../arkhe/array/difference";
import { pull } from "./pull";

/**
 * Creates an array excluding all given values.
 *
 * Alias for {@link difference}.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to filter.
 * @param values - The values to exclude.
 * @returns A new array without the specified values.
 * @deprecated Use `difference` from Arkhe instead.
 * Reason: Alias of {@link difference}
 * @see {@link difference}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 *
 * // ❌ Deprecated approach
 * const filtered = without(numbers, 2, 4);
 * console.log(filtered); // [1, 3, 5]
 *
 * // ✅ Recommended approach (Arkhe)
 * import { difference } from "pithos/arkhe/array/difference";
 * const filteredArkhe = difference(numbers, [2, 4]);
 * console.log(filteredArkhe); // [1, 3, 5]
 * ```
 */
export function without<T>(array: T[], ...values: T[]): T[] {
    return difference(array, values);
}