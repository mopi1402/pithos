/**
 * Checks if a value is a primitive (string, number, boolean, null, undefined, symbol, bigint).
 *
 * @param value - The value to check.
 * @returns `true` if the value is a primitive, `false` otherwise.
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * isPrimitive(1);              // => true
 * isPrimitive('a');            // => true
 * isPrimitive(true);           // => true
 * isPrimitive(null);           // => true
 * isPrimitive(undefined);      // => true
 * isPrimitive({});             // => false
 * isPrimitive([]);             // => false
 * isPrimitive(new Date());     // => false
 * ```
 */
export const isPrimitive = (
    value: unknown
): value is string | number | boolean | null | undefined | symbol | bigint => {
    return (
        value === null || (typeof value !== "object" && typeof value !== "function")
    );
};
