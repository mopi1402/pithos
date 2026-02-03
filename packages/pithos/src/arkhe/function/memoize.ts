/**
 * A cache interface for memoization, compatible with Map and custom implementations (LRU, TTL, etc.).
 *
 * @template K - The key type.
 * @template V - The value type.
 * @since 1.2.0
 */
export interface MemoizeCache<K, V> {
  set(key: K, value: V): void;
  get(key: K): V | undefined;
  has(key: K): boolean;
  delete(key: K): boolean | void;
  clear(): void;
  size: number;
}

/**
 * Options for the memoize function.
 *
 * @template Args - The argument types of the function.
 * @template Result - The return type of the function.
 * @since 1.2.0
 */
export interface MemoizeOptions<Args extends unknown[], Result> {
  /** Custom cache implementation. */
  cache?: MemoizeCache<string, Result>;
  /** Function to generate cache keys. */
  keyResolver?: (...args: Args) => string;
}

type MemoizedFunction<Args extends unknown[], Result> = ((
  ...args: Args
) => Result) & {
  clear: () => void;
  delete: (...args: Args) => boolean;
  cache: MemoizeCache<string, Result>;
};

/**
 * Creates a memoized version of a function that caches results based on arguments.
 *
 * @template Args - The argument types of the function.
 * @template Result - The return type of the function.
 * @param fn - The function to memoize.
 * @param keyResolver - Optional function to generate cache keys (for first overload).
 * @param options - Memoization options (for second overload).
 * @returns The memoized function with `clear()`, `delete()` methods and `cache` property.
 * @since 1.1.0
 *
 * @performance Uses Map for O(1) cache lookups. Custom cache allows LRU/TTL strategies.
 *
 * @example
 * ```typescript
 * const square = memoize((n: number) => n * n);
 * square(5); // 25 (computed)
 * square(5); // 25 (cached)
 * square.delete(5); // Invalidate specific entry
 * square.clear(); // Clear all
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
  keyResolver?: (...args: Args) => string
): MemoizedFunction<Args, Result>;
export function memoize<Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
  options?: MemoizeOptions<Args, Result>
): MemoizedFunction<Args, Result>;
export function memoize<Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
  optionsOrKeyResolver?:
    | MemoizeOptions<Args, Result>
    | ((...args: Args) => string)
): MemoizedFunction<Args, Result> {
  const options: MemoizeOptions<Args, Result> =
    typeof optionsOrKeyResolver === "function"
      ? { keyResolver: optionsOrKeyResolver }
      : optionsOrKeyResolver ?? {};

  const {
    cache = new Map<string, Result>(),
    keyResolver = (...args: Args) =>
      JSON.stringify(args, (_key, value) => {
        if (typeof value === "function")
          return `[Function: ${value.name || "anonymous"}]`;
        if (typeof value === "symbol") return value.toString();
        return value;
      }),
  } = options;

  const memoized = function (this: unknown, ...args: Args): Result {
    const key = keyResolver(...args);
    if (cache.has(key)) {
      return cache.get(key) as Result;
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };

  memoized.clear = (): void => {
    cache.clear();
  };

  memoized.delete = (...args: Args): boolean => {
    const key = keyResolver(...args);
    return cache.delete(key) ?? false;
  };

  memoized.cache = cache;

  return memoized;
}
