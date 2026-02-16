/**
 * Executes a function and returns its result, or a fallback value if an error occurs.
 * @template T - The return type.
 * @param fn - The function to execute.
 * @param fallback - The value to return if the function throws an error.
 * @returns The result of the function or the fallback value.
 * @since 2.0.0
 * @example
 * ```typescript
 * const result = orElse(() => JSON.parse('invalid json'), {});
 * console.log(result); // {}
 *
 * const value = orElse(() => localStorage.getItem('key'), 'default');
 * console.log(value); // 'default' if localStorage throws or key doesn't exist
 *
 * const number = orElse(() => parseInt('abc'), 0);
 * console.log(number); // 0
 * ```
 */
export const orElse = <T>(fn: () => T, fallback: T): T => {
  try {
    return fn();
  } catch {
    return fallback;
  }
};

/**
 * Executes an async function and returns its result, or a fallback value if an error occurs.
 * @template T - The return type.
 * @param fn - The async function to execute.
 * @param fallback - The value to return if the function throws an error.
 * @returns A Promise that resolves to the result of the function or the fallback value.
 * @since 2.0.0
 * @example
 * ```typescript
 * const result = await orElseAsync(async () => {
 *   const response = await fetch('/api/data');
 *   return await response.json();
 * }, {});
 * console.log(result); // {} if fetch fails
 *
 * const data = await orElseAsync(async () => {
 *   const user = await getUserFromDB(id);
 *   return user.profile;
 * }, null);
 * console.log(data); // null if user not found or DB error
 * ```
 */
export const orElseAsync = async <T>(
  fn: () => Promise<T>,
  fallback: T
): Promise<T> => {
  try {
    return await fn();
  } catch {
    return fallback;
  }
};

/**
 * Executes a function and returns its result, or executes a fallback function if an error occurs.
 * The fallback function is only executed when needed (lazy evaluation).
 * @template T - The return type.
 * @param fn - The function to execute.
 * @param fallbackFn - The function to execute if the first function throws an error.
 * @returns The result of the function or the result of the fallback function.
 * @since 2.0.0
 * @example
 * ```typescript
 * const result = orElseLazy(
 *   () => JSON.parse('invalid json'),
 *   () => ({ error: 'Invalid JSON', timestamp: Date.now() })
 * );
 * console.log(result); // { error: 'Invalid JSON', timestamp: 1234567890 }
 *
 * const config = orElseLazy(
 *   () => localStorage.getItem('config'),
 *   () => getDefaultConfig() // Only called if localStorage fails
 * );
 * ```
 */
export const orElseLazy = <T>(fn: () => T, fallbackFn: () => T): T => {
  try {
    return fn();
  } catch {
    return fallbackFn(); // Lazy evaluation
  }
};
