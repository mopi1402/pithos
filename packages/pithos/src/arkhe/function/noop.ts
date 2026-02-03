/**
 * A function that does nothing and returns undefined.
 *
 * Useful as a default callback or placeholder.
 *
 * @returns Always returns `undefined`.
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // Default callback to avoid null checks
 * function fetchData(onSuccess: () => void = noop) {
 *   // No need for: if (onSuccess) onSuccess()
 *   onSuccess();
 * }
 *
 * // In tests
 * const handler: Arrayable<() => void> = [noop, noop];
 * expect(processItems(handler)).toHaveLength(2);
 * ```
 */
export const noop = (): void => {};
