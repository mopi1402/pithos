/**
 * Guards an async function with error handling and optional fallback.
 *
 * @info Why wrapping native?: We prefer to wrap this to provide a safe wrapper around **Throws**, allowing controlled failure handling without verbose try/catch blocks. See [Design Philosophy](/guide/design-principles/design-philosophy/)
 *
 *
 * @template T - The return type of the function.
 * @param fn - The async function to guard.
 * @param fallback - Optional fallback value or function that receives the error.
 * @returns Promise that resolves to the function result or fallback value.
 * @since 1.1.0
 *
 * @note Returns `undefined` if no fallback is provided and the function throws.
 *
 * @example
 * ```typescript
 * const result = await guard(() => riskyOperation(), 'default');
 *
 * const user = await guard(() => fetchUser(), (error) => {
 *   console.error(error);
 *   return { id: 0, name: 'Anonymous' };
 * });
 * ```
 */
export async function guard<T>(
  fn: () => Promise<T>,
  fallback?: T | ((error: unknown) => T)
): Promise<T | undefined> {
  try {
    return await fn();
  } catch (error) {
    // Stryker disable next-line ConditionalExpression,BlockStatement: equivalent mutant, fallback undefined falls through to return undefined
    if (fallback === undefined) {
      return undefined;
    }

    if (typeof fallback === "function") {
      return (fallback as (error: unknown) => T)(error);
    }

    return fallback;
  }
}
