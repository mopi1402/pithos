/**
 * Checks if a value is a RegExp object.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a RegExp, `false` otherwise.
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * isRegExp(/abc/);             // => true
 * isRegExp(new RegExp('abc')); // => true
 * isRegExp('abc');             // => false
 * ```
 */
export const isRegExp = (value: unknown): value is RegExp =>
    value instanceof RegExp;
