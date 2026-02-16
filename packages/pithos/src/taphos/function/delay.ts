/**
 * Invokes func after wait milliseconds.
 *
 * @param func - The function to delay.
 * @param wait - The number of milliseconds to delay invocation.
 * @param args - The arguments to invoke the function with.
 * @returns The timer id.
 * @deprecated Use `setTimeout(fn, wait)` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/setTimeout | setTimeout() - MDN}
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * delay(console.log, 1000, 'later');
 *
 * // ✅ Recommended approach
 * setTimeout(() => console.log('later'), 1000);
 * ```
 */
export function delay<Args extends unknown[]>(
  func: (...args: Args) => void,
  wait: number,
  ...args: Args
): ReturnType<typeof setTimeout> {
  return setTimeout(() => func(...args), wait);
}
