/**
 * Generic cache interface for type-safe cache operations.
 * @template K - The key type.
 * @template V - The value type.
 * @since 1.0.0
 */
export interface Cache<K, V> {
  /** Retrieves a value from the cache, or undefined if not found. */
  get(key: K): V | undefined;
  /** Stores a value in the cache. */
  set(key: K, value: V): void;
  /** Checks if a key exists in the cache. */
  has(key: K): boolean;
  /** Removes a key from the cache. */
  delete(key: K): boolean;
  /** Clears all entries from the cache. */
  clear(): void;
  /** The number of entries in the cache. */
  size: number;
}

/**
 * Cache statistics for monitoring and debugging.
 * @since 1.0.0
 */
export interface CacheStats {
  /** Number of cache hits. */
  hits: number;
  /** Number of cache misses. */
  misses: number;
  /** Current cache size. */
  size: number;
  /** Hit rate as a percentage (0-1). */
  hitRate: number;
}
