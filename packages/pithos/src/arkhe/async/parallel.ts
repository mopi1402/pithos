import { clamp } from "../number/clamp";

/**
 * Executes multiple async functions in parallel with concurrency control.
 *
 * @template T - The return type of the functions.
 * @param functions - Array of async functions to execute.
 * @param concurrency - Maximum number of concurrent executions. Defaults to `Infinity`.
 * @defaultValue Infinity
 * @returns Promise that resolves to array of results in original order.
 * @throws Rejects if any function rejects (remaining operations are aborted).
 * @since 1.1.0
 *
 * @note Results preserve input order. Fails fast like `Promise.all()`.
 *
 * @performance Early abort on first error prevents unnecessary work.
 *
 * @example
 * ```typescript
 * const results = await parallel([
 *   () => fetchUser(1),
 *   () => fetchUser(2),
 *   () => fetchUser(3)
 * ], 2);
 * ```
 */
export async function parallel<T>(
  functions: (() => Promise<T>)[],
  concurrency: number = Infinity
): Promise<T[]> {
  // Stryker disable next-line ConditionalExpression,BlockStatement: Performance optimization - worker loop produces identical results for Infinity
  if (concurrency === Infinity) {
    return Promise.all(functions.map((fn) => fn()));
  }

  // Stryker disable next-line ConditionalExpression,BlockStatement: Early return optimization - while loop produces identical empty result
  if (functions.length === 0) {
    // Stryker disable next-line ArrayDeclaration: Early return optimization - while loop handles empty array identically
    return [];
  }

  // Stryker disable next-line ArrayDeclaration: pre-allocation optimization
  const results: T[] = new Array(functions.length);
  let index = 0;
  let hasError = false;

  const executeNext = async (): Promise<void> => {
    while (index < functions.length && !hasError) {
      const currentIndex = index++;
      try {
        const result = await functions[currentIndex]();
        results[currentIndex] = result;
      } catch (error) {
        hasError = true;
        throw error;
      }
    }
  };

  const workers = Array.from(
    { length: clamp(concurrency, 1, functions.length) },
    () => executeNext()
  );

  await Promise.all(workers);
  return results;
}
