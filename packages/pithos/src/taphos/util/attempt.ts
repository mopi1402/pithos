/**
 * Attempts to invoke func, returning either the result or the caught error.
 *
 * @template T - The return type of the function.
 * @param func - The function to attempt.
 * @param args - The arguments to invoke the function with.
 * @returns The result of the function or the caught error.
 * @deprecated Use try/catch directly or Zygos Result pattern instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch | try...catch - MDN}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * const result = attempt(JSON.parse, '{"a":1}');
 * if (result instanceof Error) {
 *   console.error('Parse failed:', result);
 * } else {
 *   console.log('Parsed:', result);
 * }
 *
 * // ✅ Recommended approach (try/catch)
 * try {
 *   const result = JSON.parse('{"a":1}');
 *   console.log('Parsed:', result);
 * } catch (error) {
 *   console.error('Parse failed:', error);
 * }
 *
 * // ✅ Recommended approach (Zygos Result)
 * import { tryCatch } from '@pithos/zygos';
 *
 * const result = tryCatch(() => JSON.parse('{"a":1}'));
 * if (result.isOk()) {
 *   console.log('Parsed:', result.value);
 * } else {
 *   console.error('Parse failed:', result.error);
 * }
 * ```
 */
export function attempt<T>(
  func: (...args: unknown[]) => T,
  ...args: unknown[]
): T | Error {
  try {
    return func(...args);
  } catch (error) {
    return error instanceof Error ? error : new Error(String(error));
  }
}
