/**
 * Creates a debounced function that delays execution until after a wait period.
 *
 * @template Args - The argument types of the function.
 * @template Context - The type of `this` context.
 * @param func - The function to debounce.
 * @param wait - The number of milliseconds to delay.
 * @param immediate - If `true`, trigger on leading edge instead of trailing edge.
 * @returns The debounced function with `cancel()` and `flush()` methods.
 * @throws {RangeError} If wait is negative or not finite.
 * @since 2.0.0
 *
 * @performance Clears previous timeout on each call to prevent multiple pending executions.
 *
 * @example
 * ```typescript
 * // Trailing edge (default)
 * const search = debounce((query: string) => {
 *   console.log(`Searching: ${query}`);
 * }, 300);
 *
 * search('abc'); // After 300ms: "Searching: abc"
 *
 * // Leading edge
 * const save = debounce(() => console.log('Saved'), 1000, true);
 * save(); // Immediately: "Saved"
 *
 * // Cancel pending
 * search.cancel();
 *
 * // Force immediate execution
 * search('urgent');
 * search.flush(); // Immediately: "Searching: urgent"
 * ```
 */
export function debounce<Args extends unknown[], Context = unknown>(
  func: (this: Context, ...args: Args) => void,
  wait: number,
  immediate = false
): ((this: Context, ...args: Args) => void) & {
  cancel: () => void;
  flush: () => void;
} {
  if (wait < 0) throw new RangeError("wait must be non-negative");
  if (!Number.isFinite(wait)) throw new RangeError("wait must be finite");

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let pendingArgs: Args | undefined;
  let pendingContext: Context | undefined;

  const invoke = (): void => {
    if (pendingArgs) {
      func.apply(pendingContext as Context, pendingArgs);
      pendingArgs = undefined;
      pendingContext = undefined;
    }
  };

  const debounced = function (this: Context, ...args: Args): void {
    const callNow = immediate && !timeoutId;
    pendingArgs = args;
    // INTENTIONAL: Must capture `this` context to preserve it for delayed invocation via setTimeout
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    pendingContext = this;

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = undefined;
      if (!immediate) {
        invoke();
      }
    }, wait);

    if (callNow) {
      invoke();
    }
  };

  debounced.cancel = (): void => {
    // Stryker disable next-line all: equivalent mutant, clearTimeout(undefined) is safe noop
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
    pendingArgs = undefined;
    pendingContext = undefined;
  };

  debounced.flush = (): void => {
    // Stryker disable next-line all: equivalent mutant, clearTimeout(undefined) is safe noop
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
    invoke();
  };

  return debounced;
}
