/**
 * Invokes interceptor with the value, then returns value.
 * Useful for side effects in a pipeline.
 *
 * @template T - The type of the value.
 * @param value - The value to pass to interceptor.
 * @param interceptor - The function to invoke.
 * @returns The original value.
 * @deprecated Use inline side effects in `pipe` or `.then()` directly instead.
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * import { pipe } from '@pithos/arkhe/function/pipe';
 *
 * pipe(
 *   [1, 2, 3],
 *   arr => tap(arr, x => console.log('before:', x)),
 *   arr => arr.map(n => n * 2),
 *   arr => tap(arr, x => console.log('after:', x))
 * );
 *
 * // ✅ Recommended approach
 * pipe(
 *   [1, 2, 3],
 *   arr => { console.log('before:', arr); return arr; },
 *   arr => arr.map(n => n * 2),
 *   arr => { console.log('after:', arr); return arr; }
 * );
 *
 * // Or extract to a helper
 * const log = <T>(label: string) => (value: T): T => {
 *   console.log(label, value);
 *   return value;
 * };
 * ```
 */
export function tap<T>(value: T, interceptor: (value: T) => void): T {
  interceptor(value);
  return value;
}
