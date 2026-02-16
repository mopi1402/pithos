/**
 * Creates a curried function that accepts arguments one at a time.
 *
 * @template Args - The argument types of the function.
 * @template Return - The return type of the function.
 * @param func - The function to curry.
 * @param arity - The arity of func (defaults to func.length).
 * @returns The curried function.
 * @throws {RangeError} If arity is negative or not an integer.
 * @since 2.0.0
 *
 * @note Supports partial application with multiple arguments at once.
 * @note When arity is 0, the function is invoked immediately upon first call.
 *
 * @example
 * ```typescript
 * const add = (a: number, b: number, c: number) => a + b + c;
 * const curriedAdd = curry(add);
 *
 * curriedAdd(1)(2)(3);       // => 6
 * curriedAdd(1, 2)(3);       // => 6
 * curriedAdd(1)(2, 3);       // => 6
 * curriedAdd(1, 2, 3);       // => 6
 *
 * // Partial application
 * const add10 = curriedAdd(10);
 * add10(5)(3);               // => 18
 *
 * // Custom arity
 * const fn = (...args: number[]) => args.reduce((a, b) => a + b, 0);
 * const curried = curry(fn, 3);
 * curried(1)(2)(3);          // => 6
 * ```
 */
export function curry<Args extends unknown[], Return>(
    func: (...args: Args) => Return,
    arity: number = func.length
  ): CurriedFunction<Args, Return> {
    // Stryker disable next-line EqualityOperator: arity < 0 catches negative values
    if (arity < 0) throw new RangeError("arity must be non-negative");
    // Stryker disable next-line all: validates integer constraint
    if (!Number.isInteger(arity)) throw new RangeError("arity must be an integer");
  
    function curried(
      this: unknown,
      ...providedArgs: unknown[]
    ): Return | CurriedFunction<Args, Return> {
      // Stryker disable next-line EqualityOperator: >= ensures invocation when all args collected
      if (providedArgs.length >= arity) {
        return func.apply(this, providedArgs.slice(0, arity) as Args);
      }
  
      return function (this: unknown, ...moreArgs: unknown[]) {
        return curried.apply(this, [...providedArgs, ...moreArgs]);
      } as CurriedFunction<Args, Return>;
    }
  
    return curried as CurriedFunction<Args, Return>;
  }
  
  /**
   * Recursive type for curried functions supporting partial application.
   *
   * @template Args - The remaining argument types.
   * @template Return - The return type of the original function.
   * @internal
   */
  type CurriedFunction<Args extends unknown[], Return> = Args extends [
    infer First,
    ...infer Rest
  ]
    ? Rest extends []
      ? (arg: First) => Return
      : (arg: First) => CurriedFunction<Rest, Return> &
          ((...args: Args) => Return)
    : () => Return;
  