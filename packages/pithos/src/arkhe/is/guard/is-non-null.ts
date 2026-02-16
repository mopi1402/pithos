/**
 * Checks if a nullable value is not null.
 *
 * Type guard that narrows Nullable<T> to T by excluding null.
 *
 * @template T - The type of the value.
 * @param value - The nullable value to check.
 * @returns `true` if the value is not null, `false` otherwise.
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * function process(data: Nullable<string>) {
 *   if (isNonNull(data)) {
 *     // data is now typed as string
 *     console.log(data.toUpperCase());
 *   }
 * }
 * ```
 */
export const isNonNull = <T>(value: T | null): value is T => value !== null;
