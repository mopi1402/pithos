/**
 * Creates a function that invokes func after it's called n or more times.
 *
 * @template Args - The argument types of the function.
 * @template Return - The return type of the function.
 * @param func - The function to restrict.
 * @param n - The number of calls before func is invoked.
 * @returns The new restricted function. Returns `undefined` for the first `n-1` calls.
 * @throws {RangeError} If n is negative or not an integer.
 * @see before - Inverse operation: invokes func at most n-1 times.
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * let attempts = 0;
 * const saveData = after(() => {
 *   attempts++;
 *   console.log(`Data saved! Attempt #${attempts}`);
 * }, 3);
 *
 * saveData(); // Nothing happens
 * saveData(); // Nothing happens
 * saveData(); // "Data saved! Attempt #1"
 * saveData(); // "Data saved! Attempt #2"
 * saveData(); // "Data saved! Attempt #3"
 *
 * // Use case: Only start logging after initial setup calls
 * const logger = after((message: string) => {
 *   console.log(`[LOG] ${message}`);
 * }, 2);
 *
 * logger('Initializing...'); // Nothing (setup call)
 * logger('Loading config...'); // "[LOG] Loading config..."
 * logger('Ready!'); // "[LOG] Ready!"
 * ```
 */
export function after<Args extends unknown[], Return>(
  func: (...args: Args) => Return,
  n: number
): (...args: Args) => Return | undefined {
  if (n < 0) throw new RangeError("n must be non-negative");
  if (!Number.isInteger(n)) throw new RangeError("n must be an integer");

  let count = 0;

  return (...args) => {
    if (++count >= n) {
      return func(...args);
    }
    return undefined;
  };
}
