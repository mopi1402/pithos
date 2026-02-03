/**
 * Checks if a value is not null or undefined.
 *
 * @template T - The type of the value.
 * @param value - The value to check.
 * @returns `true` if the value is not null or undefined, `false` otherwise.
 * @since 1.1.0
 *
 * @note Narrows `T` to `NonNullable<T>`. Uses loose equality (`!= null`) to check both.
 *
 * @see isNil
 * @see isNonNull
 *
 * @example
 * ```typescript
 * isNonNullable('hello');   // => true
 * isNonNullable(0);         // => true
 * isNonNullable(false);     // => true
 * isNonNullable(null);      // => false
 * isNonNullable(undefined); // => false
 * ```
 */
export const isNonNullable = <T>(value: T): value is NonNullable<T> =>
  value != null;
