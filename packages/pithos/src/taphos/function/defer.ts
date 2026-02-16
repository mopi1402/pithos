/**
 * Defers invoking the function until the current call stack has cleared.
 *
 * @param func - The function to defer.
 * @param args - The arguments to invoke the function with.
 * @returns The timer id.
 * @deprecated Use `setTimeout(fn, 0)` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/setTimeout | setTimeout() - MDN}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * defer(console.log, 'deferred');
 *
 * // ✅ Recommended approach
 * setTimeout(() => console.log('deferred'), 0);
 * ```
 */
export function defer<Args extends unknown[]>(
  func: (...args: Args) => void,
  ...args: Args
): ReturnType<typeof setTimeout> {
  return setTimeout(() => func(...args), 0);
}
