/**
 * A cache interface for memoization, compatible with Map and custom implementations (LRU, TTL, etc.).
 *
 * @template K - The key type.
 * @template V - The value type.
 * @since 2.0.0
 */
export interface MemoizeCache<K, V> {
  /** Stores a value in the cache. */
  set(key: K, value: V): void;
  /** Retrieves a value from the cache, or undefined if not found. */
  get(key: K): V | undefined;
  /** Checks if a key exists in the cache. */
  has(key: K): boolean;
  /** Removes a key from the cache. */
  delete(key: K): boolean | void;
  /** Clears all entries from the cache. */
  clear(): void;
  /** The number of entries in the cache. */
  size: number;
}

/**
 * Options for the memoize function.
 *
 * @template Args - The argument types of the function.
 * @template Result - The return type of the function.
 * @since 2.0.0
 */
export interface MemoizeOptions<Args extends unknown[], Result> {
  /** Custom cache implementation. */
  cache?: MemoizeCache<unknown, Result>;
  /** Function to generate cache keys. */
  keyResolver?: (...args: Args) => unknown;
}

/**
 * A memoized function with cache management methods.
 *
 * @template Args - The argument types of the function.
 * @template Result - The return type of the function.
 * @since 2.0.0
 */
export type MemoizedFunction<Args extends unknown[], Result> = ((
  ...args: Args
) => Result) & {
  /** Clears all cached results. */
  clear: () => void;
  /** Removes a specific cached result. */
  delete: (...args: Args) => boolean;
  /** The underlying cache instance. */
  cache: MemoizeCache<unknown, Result>;
};

/**
 * Creates a memoized version of a function that caches results based on arguments.
 *
 * By default, uses the first argument as the cache key (like lodash/es-toolkit).
 * For multi-argument caching or complex keys, provide a custom `keyResolver`.
 *
 * @template Args - The argument types of the function.
 * @template Result - The return type of the function.
 * @param fn - The function to memoize.
 * @param keyResolver - Optional function to generate cache keys (for first overload).
 * @param options - Memoization options (for second overload).
 * @returns The memoized function with `clear()`, `delete()` methods and `cache` property.
 * @since 2.0.0
 *
 * @performance Uses first argument as cache key by default (no serialization). Single `Map.get()` lookup on cache hit. Custom cache allows LRU/TTL strategies.
 *
 * @example
 * ```typescript
 * const square = memoize((n: number) => n * n);
 * square(5); // 25 (computed)
 * square(5); // 25 (cached)
 * square.delete(5); // Invalidate specific entry
 * square.clear(); // Clear all
 *
 * // With custom key resolver for multi-arg functions
 * const add = memoize(
 *   (a: number, b: number) => a + b,
 *   (a, b) => `${a},${b}`
 * );
 *
 * // With custom cache (e.g., LRU)
 * const fetchUser = memoize(
 *   (id: string) => fetch(`/api/users/${id}`),
 *   { cache: new LRUCache(100) }
 * );
 * ```
 */

export function memoize<Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
  keyResolver?: (...args: Args) => unknown
): MemoizedFunction<Args, Result>;
export function memoize<Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
  options?: MemoizeOptions<Args, Result>
): MemoizedFunction<Args, Result>;
export function memoize<Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
  optionsOrKeyResolver?:
    | MemoizeOptions<Args, Result>
    | ((...args: Args) => unknown)
): MemoizedFunction<Args, Result> {
  const options: MemoizeOptions<Args, Result> =
    typeof optionsOrKeyResolver === "function"
      ? { keyResolver: optionsOrKeyResolver }
      : optionsOrKeyResolver ?? {};

  const { cache = new Map<unknown, Result>(), keyResolver } = options;

  const memoized = function (this: unknown, ...args: Args): Result {
    const key = keyResolver ? keyResolver(...args) : args[0];
    // Single lookup optimization: get() first, has() only for the undefined edge case
    const cached = cache.get(key);
    // Stryker disable next-line ConditionalExpression: Fast-path optimization — has() fallback on next line returns identical cached value
    if (cached !== undefined) return cached;
    if (cache.has(key)) return cached as Result;
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };

  memoized.clear = (): void => {
    cache.clear();
  };

  memoized.delete = (...args: Args): boolean => {
    const key = keyResolver ? keyResolver(...args) : args[0];
    return cache.delete(key) ?? false;
  };

  memoized.cache = cache;

  return memoized;
}
