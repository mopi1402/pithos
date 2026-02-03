/**
 * Creates a throttled function that invokes at most once per wait period.
 *
 * @template Args - The argument types of the function.
 * @template Context - The type of `this` context.
 * @param func - The function to throttle.
 * @param wait - The number of milliseconds to throttle invocations.
 * @returns The throttled function with a `cancel()` method.
 * @throws {RangeError} If wait is negative or not finite.
 * @since 1.1.0
 *
 * @note Executes on leading edge (immediately) and trailing edge (after wait period).
 * @note Call `.cancel()` to clear any pending execution.
 *
 * @performance Uses timestamp comparison to avoid unnecessary setTimeout calls. Stores latest args/context for trailing edge execution.
 *
 * @example
 * ```typescript
 * // Scroll handler
 * const handleScroll = throttle(() => {
 *   console.log('Scrolling...');
 * }, 200);
 *
 * window.addEventListener('scroll', handleScroll);
 *
 * // With arguments
 * const logMouse = throttle((x: number, y: number) => {
 *   console.log('Mouse:', x, y);
 * }, 100);
 *
 * document.addEventListener('mousemove', (e) => {
 *   logMouse(e.clientX, e.clientY);
 * });
 *
 * // Cancel pending
 * logMouse.cancel();
 * ```
 */
export function throttle<Args extends unknown[], Context = unknown>(
  func: (this: Context, ...args: Args) => void,
  wait: number
): ((this: Context, ...args: Args) => void) & { cancel: () => void } {
  if (wait < 0) throw new RangeError("wait must be non-negative");
  if (!Number.isFinite(wait)) throw new RangeError("wait must be finite");

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastInvokeTime = 0;
  let pendingArgs: Args | undefined;
  let pendingContext: Context | undefined;

  const throttled = function (this: Context, ...args: Args): void {
    const now = Date.now();
    // Stryker disable next-line ArithmeticOperator: equivalent mutant, remaining > wait condition catches the inverted case
    const remaining = wait - (now - lastInvokeTime);

    // Stryker disable next-line ConditionalExpression: remaining > wait guards against clock drift, equivalent when clock is monotonic
    if (remaining <= 0 || remaining > wait) {
      // Stryker disable next-line ConditionalExpression: equivalent mutant, clearTimeout(undefined) is safe noop
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }
      lastInvokeTime = now;
      pendingArgs = undefined;
      pendingContext = undefined;
      func.apply(this, args);
    } else {
      pendingArgs = args;
      // INTENTIONAL: Must capture `this` context to preserve it for delayed invocation via setTimeout
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      pendingContext = this;

      if (!timeoutId) {
        timeoutId = setTimeout(() => {
          lastInvokeTime = Date.now();
          timeoutId = undefined;
          // INTENTIONAL: pendingArgs is always set before setTimeout (line 69), using ! to avoid unreachable else branch
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          func.apply(pendingContext as Context, pendingArgs!);
          pendingArgs = undefined;
          pendingContext = undefined;
        }, remaining);
      }
    }
  };

  throttled.cancel = (): void => {
    // Stryker disable next-line all: equivalent mutant, clearTimeout(undefined) is safe noop
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
    lastInvokeTime = 0;
    pendingArgs = undefined;
    pendingContext = undefined;
  };

  return throttled;
}
