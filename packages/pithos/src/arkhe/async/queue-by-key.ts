const queueMap = new Map<string, Promise<unknown>>();

//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Queues async functions by key to ensure sequential execution.
 *
 * @template T - The return type of the function.
 * @param key - Unique key for the operation queue.
 * @param fn - The async function to queue.
 * @returns Promise that resolves to the function result.
 * @throws Rejects if the queued function rejects.
 * @since 1.1.0
 *
 * @note Functions with the same key execute sequentially. Different keys run in parallel.
 *
 * @performance Silently catches errors to prevent queue breakage; errors still propagate to caller.
 *
 * @see dedupeByKey — for deduplication instead of queuing.
 *
 * @example
 * ```typescript
 * // Sequential execution for same key
 * queueByKey('user-123', () => updateUser('123'));
 * queueByKey('user-123', () => updateUser('123'));
 * // Second waits for first to complete
 *
 * // Parallel execution for different keys
 * queueByKey('user-A', () => updateUser('A'));
 * queueByKey('user-B', () => updateUser('B'));
 * ```
 */
export async function queueByKey<T>(
  key: string,
  fn: () => Promise<T>
): Promise<T> {
  const previous = queueMap.get(key) ?? Promise.resolve();

  const current = previous.then(() => fn());
  const silent = current.catch(() => {});

  queueMap.set(key, silent);

  // Stryker disable next-line BlockStatement: internal cleanup, memory optimization only
  return current.finally(() => {
    // Stryker disable next-line ConditionalExpression,BlockStatement,EqualityOperator: internal cleanup, memory optimization only
    if (queueMap.get(key) === silent) {
      queueMap.delete(key);
    }
  });
}
