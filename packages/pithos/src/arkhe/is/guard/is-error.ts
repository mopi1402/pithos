//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Checks if a value is an Error instance.
 *
 * @param value - The value to check.
 * @returns `true` if the value is an Error, `false` otherwise.
 * @since 1.1.0
 *
 * @note Also returns `true` for Error subclasses (TypeError, RangeError, custom errors).
 *
 * @example
 * ```typescript
 * isError(new Error('oops'));     // => true
 * isError(new TypeError('bad'));  // => true
 * isError({ message: 'fake' });   // => false
 * isError('error string');        // => false
 * ```
 */
export const isError = (value: unknown): value is Error =>
  value instanceof Error;
