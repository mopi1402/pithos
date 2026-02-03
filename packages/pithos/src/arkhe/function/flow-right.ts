/**
 * Composes functions right-to-left, passing the result of each to the previous.
 * This is the opposite of `pipe` (also known as `compose`).
 *
 * @returns The composed function.
 * @since 1.1.0
 *
 * @note Alias: `compose`
 *
 * @performance Uses reduce for composition. Overhead is minimal for typical use.
 *
 * @example
 * ```typescript
 * const add10 = (x: number) => x + 10;
 * const multiply2 = (x: number) => x * 2;
 * const square = (x: number) => x * x;
 *
 * // Right to left: square(multiply2(add10(5)))
 * const composed = flowRight(square, multiply2, add10);
 * composed(5); // => 900 (5 + 10 = 15, 15 * 2 = 30, 30 * 30 = 900)
 *
 * // Compare with pipe (left to right)
 * // pipe would be: add10(multiply2(square(5)))
 *
 * // String transformation
 * const trim = (s: string) => s.trim();
 * const upper = (s: string) => s.toUpperCase();
 * const exclaim = (s: string) => s + '!';
 *
 * const shout = flowRight(exclaim, upper, trim);
 * shout('  hello  '); // => 'HELLO!'
 * ```
 */

export function flowRight(): <T>(x: T) => T;
export function flowRight<A, B>(f: (a: A) => B): (a: A) => B;
export function flowRight<A, B, C>(
  f: (b: B) => C,
  g: (a: A) => B
): (a: A) => C;
export function flowRight<A, B, C, D>(
  f: (c: C) => D,
  g: (b: B) => C,
  h: (a: A) => B
): (a: A) => D;
export function flowRight<A, B, C, D, E>(
  f: (d: D) => E,
  g: (c: C) => D,
  h: (b: B) => C,
  i: (a: A) => B
): (a: A) => E;
export function flowRight<A, B, C, D, E, F>(
  f: (e: E) => F,
  g: (d: D) => E,
  h: (c: C) => D,
  i: (b: B) => C,
  j: (a: A) => B
): (a: A) => F;
export function flowRight<A, B, C, D, E, F, G>(
  f: (e: F) => G,
  g: (d: E) => F,
  h: (c: D) => E,
  i: (b: C) => D,
  j: (a: B) => C,
  k: (a: A) => B
): (a: A) => G;
// INTENTIONAL: any required for variadic composition
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function flowRight(...fns: Array<(arg: any) => any>): (arg: any) => any {
  // Stryker disable next-line BlockStatement,ConditionalExpression: Optimization - handled by reduceRight
  if (fns.length === 0) {
    // INTENTIONAL: any required for identity function return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (x: any) => x;
  }

  // Stryker disable next-line BlockStatement,ConditionalExpression: Optimization - handled by reduceRight
  if (fns.length === 1) {
    return fns[0];
  }

  return fns.reduceRight(
    (composed, fn) => (x) => fn(composed(x)),
    // INTENTIONAL: any required for initial identity function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (x: any) => x
  );
}

/**
 * Alias for flowRight.
 * @see flowRight
 * @since 1.1.0
 */
export const compose = flowRight;
