/**
 * Generic cache interface for type-safe cache operations.
 * @template K - The key type.
 * @template V - The value type.
 * @since 1.0.0
 */
export interface Cache<K, V> {
  get(key: K): V | undefined;
  set(key: K, value: V): void;
  has(key: K): boolean;
  delete(key: K): boolean;
  clear(): void;
  size: number;
}

/**
 * Cache statistics for monitoring and debugging.
 * @since 1.0.0
 */
export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
}
