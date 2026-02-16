/**
 * Lightweight Task implementation based on fp-ts.
 * Covers essential use cases for interoperability with TaskEither.
 * @since 1.0.0
 */

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * A Task represents an asynchronous computation that yields a value of type A.
 * @template A - The result type.
 * @since 2.0.0
 */
export type Task<A> = () => Promise<A>;

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * Creates a Task that resolves to the given value.
 * @template A - The value type.
 * @param a - The value to wrap.
 * @returns A Task that resolves to the value.
 * @since 2.0.0
 */
export const of =
  <A>(a: A): Task<A> =>
  async () =>
    a;

// -------------------------------------------------------------------------------------
// transformations
// -------------------------------------------------------------------------------------

/**
 * Maps a function over the result of a Task.
 * @template A - The input type.
 * @template B - The output type.
 * @param f - The mapping function.
 * @returns A function that transforms the Task.
 * @since 2.0.0
 */
export const map =
  <A, B>(f: (a: A) => B) =>
  (fa: Task<A>): Task<B> =>
  async () => {
    const a = await fa();
    return f(a);
  };

/**
 * Chains a function that returns a Task over the result.
 * @template A - The input type.
 * @template B - The output type.
 * @param f - The chaining function.
 * @returns A function that transforms the Task.
 * @since 2.0.0
 */
export const flatMap =
  <A, B>(f: (a: A) => Task<B>) =>
  (fa: Task<A>): Task<B> =>
  async () => {
    const a = await fa();
    return await f(a)();
  };

// -------------------------------------------------------------------------------------
// utilities
// -------------------------------------------------------------------------------------

/**
 * Applies a function inside a Task to a value inside another Task.
 * @template A - The input type.
 * @param fa - The value Task.
 * @returns A function that applies the function Task.
 * @since 2.0.0
 */
export const ap =
  <A>(fa: Task<A>) =>
  <B>(fab: Task<(a: A) => B>): Task<B> =>
  async () => {
    const f = await fab();
    const a = await fa();
    return f(a);
  };
