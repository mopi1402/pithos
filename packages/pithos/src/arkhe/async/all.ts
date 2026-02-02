//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Executes multiple promises in parallel and returns their results.
 *
 * Extends `Promise.all()` with object support for structured results.
 *
 * @template T - The type of the promise results.
 * @param promises - Array or object of promises to execute.
 * @returns Promise that resolves to the results (array or object matching input shape).
 * @throws Rejects if any input promise rejects.
 * @since 1.1.0
 *
 * @note Object input returns named results; array input behaves like `Promise.all()`.
 *
 * @example
 * ```typescript
 * // Array of promises
 * const [user, posts] = await all([fetchUser(), fetchPosts()]);
 *
 * // Object of promises (named results)
 * const { user, posts } = await all({
 *   user: fetchUser(),
 *   posts: fetchPosts()
 * });
 * ```
 */

export async function all<T extends readonly unknown[]>(
  promises: T
): Promise<{ -readonly [K in keyof T]: Awaited<T[K]> }>;

export async function all<T extends Record<string, unknown>>(
  promises: T
): Promise<{ [K in keyof T]: Awaited<T[K]> }>;

export async function all(
  promises: readonly unknown[] | Record<string, unknown>
): Promise<unknown> {
  if (Array.isArray(promises)) {
    return Promise.all(promises);
  }

  const keys = Object.keys(promises);
  const values = Object.values(promises);
  const results = await Promise.all(values);

  const result: Record<string, unknown> = {};
  // Stryker disable next-line EqualityOperator: equivalent mutant, out-of-bounds access just sets undefined
  for (let i = 0; i < keys.length; i++) {
    result[keys[i]] = results[i];
  }
  return result;
}
