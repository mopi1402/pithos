/**
 * Invokes interceptor with the value, then returns the result.
 * Useful for transformations in a pipeline.
 *
 * @template T - The type of the input value.
 * @template R - The type of the result.
 * @param value - The value to pass to interceptor.
 * @param interceptor - The function to invoke.
 * @returns The result of the interceptor.
 * @deprecated Use direct function application or `pipe` instead.
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * thru([1, 2, 3], arr => arr.map(n => n * 2));
 * // => [2, 4, 6]
 *
 * // ✅ Recommended approach (direct)
 * [1, 2, 3].map(n => n * 2);
 * // => [2, 4, 6]
 *
 * // ✅ Recommended approach (in pipe)
 * import { pipe } from '@pithos/arkhe/function/pipe';
 *
 * pipe(
 *   [1, 2, 3],
 *   arr => arr.map(n => n * 2),
 *   arr => arr.filter(n => n > 2)
 * );
 * // => [4, 6]
 * ```
 */
export function thru<T, R>(value: T, interceptor: (value: T) => R): R {
  return interceptor(value);
}
