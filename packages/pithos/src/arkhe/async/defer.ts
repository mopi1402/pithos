//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Defers execution of a function to the next tick of the event loop.
 *
 * @template T - The return type of the function.
 * @param fn - The function to defer.
 * @returns Promise that resolves to the function result.
 * @throws Rejects if the deferred function throws or rejects.
 * @since 1.1.0
 *
 * @note Uses `setTimeout(0)` to yield to the event loop.
 *
 * @example
 * ```typescript
 * await defer(() => updateDOM());
 *
 * const result = await defer(async () => fetchData());
 * ```
 */
export async function defer<T>(fn: () => T | Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, 0);
  });
}
