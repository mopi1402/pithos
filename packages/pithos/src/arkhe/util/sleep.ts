/**
 * Pauses execution for a specified duration.
 *
 * @param ms - Duration to sleep in milliseconds (must be non-negative).
 * @returns Promise that resolves after the specified duration.
 * @throws {RangeError} If ms is negative.
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * await sleep(1000);
 * console.log('1 second later');
 *
 * // Sequential delays
 * for (const item of items) {
 *   await process(item);
 *   await sleep(100);
 * }
 * ```
 */
export function sleep(ms: number): Promise<void> {
  if (ms < 0) {
    throw new RangeError("Duration must not be negative");
  }

  return new Promise((resolve) => setTimeout(resolve, ms));
}
