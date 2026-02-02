/**
 * Represents valid error types that can be used in error handling.
 * This type is commonly used in functional programming patterns like Either, Result, and TaskEither.
 * @since 1.0.0
 * @example
 * ```typescript
 * function handleError(error: ErrorType): string {
 *   if (typeof error === 'string') return error;
 *   if (typeof error === 'number') return `Error ${error}`;
 *   return error.message;
 * }
 * ```
 */
export type ErrorType = Error | string | number;
