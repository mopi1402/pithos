//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Creates a function that can only be called once.
 *
 * @template Args - The argument types of the function.
 * @template Result - The return type of the function.
 * @param fn - The function to restrict to one execution.
 * @returns The restricted function that caches the first call's result.
 * @since 1.1.0
 *
 * @note Subsequent calls return the cached result and ignore new arguments.
 *
 * @performance O(1) lookup after first call. Single boolean flag check for optimal performance.
 *
 * @example
 * ```typescript
 * // Basic usage
 * const initialize = once(() => {
 *   console.log('Initializing...');
 *   return 'initialized';
 * });
 *
 * initialize(); // "Initializing..." -> "initialized"
 * initialize(); // "initialized" (cached)
 *
 * // With parameters (ignores new args after first call)
 * const createUser = once((name: string) => ({ id: 1, name }));
 *
 * createUser('John'); // { id: 1, name: 'John' }
 * createUser('Jane'); // { id: 1, name: 'John' } (cached)
 *
 * // Async functions
 * const fetchData = once(async () => fetch('/api/data'));
 * await fetchData(); // Fetches
 * await fetchData(); // Cached promise
 * ```
 */
export function once<Args extends unknown[], Result>(
  fn: (...args: Args) => Result
): (...args: Args) => Result {
  let called = false;
  let result: Result;

  return (...args: Args): Result => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}
