/**
 * An array type that guarantees at least one element.
 *
 * Useful for functions that require non-empty input, avoiding runtime checks.
 *
 * @template T - The type of array elements
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * function first<T>(arr: NonEmptyArray<T>): T {
 *   return arr[0]; // ✅ Safe, TypeScript knows arr[0] exists
 * }
 *
 * first([1, 2, 3]); // ✅ OK
 * first([]); // ❌ Error: Source has 0 element(s) but target requires 1
 *
 * const items: NonEmptyArray<string> = ["a", "b"];
 * items[0]; // Type is `string`, not `string | undefined`
 * ```
 */
export type NonEmptyArray<T> = [T, ...T[]];
