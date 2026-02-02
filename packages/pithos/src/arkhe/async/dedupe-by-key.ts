//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
const dedupeMap = new Map<string, Promise<unknown>>();

/**
 * Queues functions by key to prevent duplicate concurrent executions.
 *
 * @template T - The return type of the function.
 * @param key - Unique key for the operation.
 * @param fn - The async function to execute.
 * @returns Promise that resolves to the function result.
 * @throws Rejects if the queued function rejects.
 * @since 1.1.0
 *
 * @note Concurrent calls with the same key share a single execution. Key is released on completion.
 *
 * @performance Uses Map for O(1) key lookup to prevent duplicate concurrent executions.
 *
 * @example
 * ```typescript
 * // Both return same result, but fetchUser is called once
 * const user1 = dedupeByKey('user-123', () => fetchUser('123'));
 * const user2 = dedupeByKey('user-123', () => fetchUser('123'));
 *
 * // Different keys execute independently
 * const userA = dedupeByKey('user-A', () => fetchUser('A'));
 * const userB = dedupeByKey('user-B', () => fetchUser('B'));
 * ```
 */
export async function dedupeByKey<T>(
  key: string,
  fn: () => Promise<T>
): Promise<T> {
  if (dedupeMap.has(key)) {
    return dedupeMap.get(key) as Promise<T>;
  }

  const promise = fn().finally(() => {
    dedupeMap.delete(key);
  });

  dedupeMap.set(key, promise);
  return promise;
}
