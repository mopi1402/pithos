import { sleep } from "@arkhe/util/sleep";

/**
 * Configuration options for retry behavior.
 *
 * @since 1.1.0
 */
export interface RetryOptions {
  /** Number of retry attempts. Defaults to `3`. */
  attempts?: number;
  /** Initial delay between retries in milliseconds. Defaults to `1000`. */
  delay?: number;
  /** Backoff multiplier for delay. Defaults to `1` (no backoff). */
  backoff?: number;
  /** Maximum delay between retries in milliseconds. Defaults to `10000`. */
  maxDelay?: number;
  /** Random jitter factor (0-1) to add variation to delay. Defaults to `0`. */
  jitter?: number;
  /** Function to determine if error should trigger retry. Return `false` to abort. */
  until?: (error: unknown) => boolean;
}

/**
 * Retries an async function with configurable backoff and error filtering.
 *
 * @info Why wrapping native?: We prefer to wrap this to improve resilience against transient failures, adhering to **Fail Fast** principles by managing retries declaratively. See [Design Philosophy](/guide/contribution/design-principles/design-philosophy/)
 *
 * 
 * @template T - The return type of the function.
 * @param fn - The async function to retry.
 * @param options - Retry configuration options.
 * @returns Promise that resolves to the function's return value.
 * @throws The last error thrown by `fn` if all retries fail.
 * @since 1.1.0
 *
 * @performance Exponential backoff with `maxDelay` cap prevents excessive wait times.
 *              Jitter prevents thundering herd problem in distributed systems.
 *
 * @example
 * ```typescript
 * const result = await retry(() => fetchData(), { attempts: 3 });
 *
 * const result = await retry(() => apiCall(), {
 *   attempts: 5,
 *   delay: 1000,
 *   backoff: 2,
 *   jitter: 0.5,
 *   until: (error) => error.code !== 'PERMANENT_ERROR'
 * });
 * ```
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    attempts = 3,
    delay = 1000,
    backoff = 1,
    maxDelay = 10000,
    jitter = 0,
    until = () => true,
  } = options;

  let lastError: unknown;
  let currentDelay = delay;

  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (!until(error)) {
        throw error;
      }

      if (attempt < attempts - 1) {
        const jitterAmount = currentDelay * jitter * Math.random();
        await sleep(currentDelay + jitterAmount);
        currentDelay = Math.min(currentDelay * backoff, maxDelay);
      }
    }
  }

  throw lastError;
}
