import { difference } from "../../arkhe/array/difference";
import { pull } from "./pull";

/**
 * Creates an array excluding all specified values.
 *
 * @note **Mutates** the array in place.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to modify.
 * @param values - The values to exclude.
 * @returns The mutated array.
 * @deprecated Use {@link difference} from Arkhe instead.
 * Reason: Pithos design philosophy always favors immutability.
 * @see {@link difference}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 2];
 * pullAll(numbers, [2, 3]);
 * console.log(numbers); // [1, 4]
 * ```
 */
export function pullAll<T>(array: T[], values: T[]): T[] {
    return pull(array, ...values);
}