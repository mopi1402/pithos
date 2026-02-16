/**
 * Creates a function with its first two arguments reversed.
 *
 * @template First - The first argument type.
 * @template Second - The second argument type.
 * @template Rest - The remaining argument types.
 * @template Result - The return type.
 * @param fn - The function to flip.
 * @returns The flipped function.
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const divide = (a: number, b: number) => a / b;
 * const divideBy = flip(divide);
 *
 * divide(10, 2);   // => 5
 * divideBy(2, 10); // => 5
 * ```
 */
export function flip<First, Second, Rest extends unknown[], Result>(
  fn: (a: First, b: Second, ...rest: Rest) => Result
): (b: Second, a: First, ...rest: Rest) => Result {
  return (b: Second, a: First, ...rest: Rest): Result => {
    return fn(a, b, ...rest);
  };
}
