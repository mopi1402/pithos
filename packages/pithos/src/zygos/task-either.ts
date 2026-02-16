/**
 * Lightweight TaskEither implementation based on fp-ts.
 * Covers 95% of essential use cases.
 * @since 1.0.0
 */

import * as E from "@zygos/either";
import type { Task } from "@zygos/task";
import { ErrorType } from "@arkhe/types/utilities/error-type";
import { isSomeOption } from "@arkhe/types/utilities/is-some-option";
import { isNonNullable } from "@arkhe/is/guard/is-non-nullable";

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * TaskEither represents an asynchronous computation that may fail.
 * @template E - The error type.
 * @template A - The success type.
 * @since 2.0.0
 */
export type TaskEither<E, A> = () => Promise<E.Either<E, A>>;

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * Creates a TaskEither that resolves to a Left.
 * @template E - The error type.
 * @template A - The success type.
 * @param e - The error value.
 * @returns A TaskEither containing the Left.
 * @since 2.0.0
 */
export const left =
  <E = never, A = never>(e: E): TaskEither<E, A> =>
  async () =>
    E.left(e);

/**
 * Creates a TaskEither that resolves to a Right.
 * @template E - The error type.
 * @template A - The success type.
 * @param a - The success value.
 * @returns A TaskEither containing the Right.
 * @since 2.0.0
 */
export const right =
  <E = never, A = never>(a: A): TaskEither<E, A> =>
  async () =>
    E.right(a);

/**
 * Creates a TaskEither from a Promise that may reject.
 * @template E - The error type.
 * @template A - The success type.
 * @param f - The async function to execute.
 * @param onRejected - Function to transform rejection reason.
 * @returns A TaskEither containing the result or error.
 * @since 2.0.0
 */
export const tryCatch =
  <E, A>(
    f: () => Promise<A>,
    onRejected: (reason: unknown) => E
  ): TaskEither<E, A> =>
  async () => {
    try {
      const result = await f();
      return E.right(result);
    } catch (reason) {
      return E.left(onRejected(reason));
    }
  };

// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------

/**
 * Creates a TaskEither from an Either.
 * @template E - The error type.
 * @template A - The success type.
 * @param fa - The Either to convert.
 * @returns A TaskEither containing the Either.
 * @since 2.0.0
 */
export const fromEither =
  <E, A>(fa: E.Either<E, A>): TaskEither<E, A> =>
  async () =>
    fa;

/**
 * Creates a TaskEither from a Task.
 * @template A - The success type.
 * @template E - The error type.
 * @param fa - The Task to convert.
 * @returns A TaskEither containing the result.
 * @since 2.0.0
 */
export const fromTask =
  <A, E extends ErrorType = Error>(fa: () => Promise<A>): TaskEither<E, A> =>
  async () =>
    E.right(await fa());

/**
 * Creates a TaskEither from an Option.
 * @template E - The error type.
 * @param onNone - Function to create error for None.
 * @returns A function that converts an Option to a TaskEither.
 * @since 2.0.0
 */
export const fromOption =
  <E>(onNone: () => E) =>
  <A>(fa: { _tag: "Some" | "None"; value?: A }): TaskEither<E, A> =>
  async () => {
    if (isSomeOption(fa)) {
      return E.right(fa.value);
    }
    return E.left(onNone());
  };

/**
 * Creates a TaskEither from a predicate.
 * @template A - The value type.
 * @template E - The error type.
 * @param predicate - The predicate function.
 * @param onFalse - Function to create error when predicate fails.
 * @returns A function that creates a TaskEither.
 * @since 2.0.0
 */
export const fromPredicate =
  <A, E>(
    predicate: (a: A) => boolean,
    onFalse: (a: A) => E
  ): ((a: A) => TaskEither<E, A>) =>
  (a) =>
  async () =>
    predicate(a) ? E.right(a) : E.left(onFalse(a));

/**
 * Creates a TaskEither from a nullable value.
 * @template E - The error type.
 * @param e - The error value for null/undefined.
 * @returns A function that creates a TaskEither.
 * @since 2.0.0
 */
export const fromNullable =
  <E>(e: E) =>
  <A>(a: A): TaskEither<E, NonNullable<A>> =>
  async () => {
    if (isNonNullable(a)) {
      return E.right(a);
    }
    return E.left(e);
  };

// -------------------------------------------------------------------------------------
// transformations
// -------------------------------------------------------------------------------------

/**
 * Maps a function over the Right value.
 * @template A - The input type.
 * @template B - The output type.
 * @param f - The mapping function.
 * @returns A function that transforms the TaskEither.
 * @since 2.0.0
 */
export const map =
  <A, B>(f: (a: A) => B) =>
  <E extends ErrorType>(fa: TaskEither<E, A>): TaskEither<E, B> =>
  async () => {
    const result = await fa();
    if (E.isLeft(result)) {
      return result;
    }
    // Compatible avec fp-ts : propage les erreurs comme des exceptions
    return E.right(f(result.right));
  };

/**
 * Maps a function over the Left value.
 * @template E - The original error type.
 * @template G - The new error type.
 * @param f - The mapping function.
 * @returns A function that transforms the TaskEither.
 * @since 2.0.0
 */
export const mapLeft =
  <E, G extends ErrorType>(f: (e: E) => G) =>
  <A>(fa: TaskEither<E, A>): TaskEither<G, A> =>
  async () => {
    const result = await fa();
    if (E.isLeft(result)) {
      // Compatible avec fp-ts : propage les erreurs comme des exceptions
      return E.left(f(result.left));
    }
    return result;
  };

/**
 * Maps functions over both Left and Right values.
 * @template E - The original error type.
 * @template G - The new error type.
 * @template A - The original success type.
 * @template B - The new success type.
 * @param f - The error mapping function.
 * @param g - The success mapping function.
 * @returns A function that transforms the TaskEither.
 * @since 2.0.0
 */
export const bimap =
  <E, G extends ErrorType, A, B>(f: (e: E) => G, g: (a: A) => B) =>
  (fa: TaskEither<E, A>): TaskEither<G, B> =>
  async () => {
    const result = await fa();
    if (E.isLeft(result)) {
      // Compatible avec fp-ts : propage les erreurs comme des exceptions
      return E.left(f(result.left));
    }
    // Compatible avec fp-ts : propage les erreurs comme des exceptions
    return E.right(g(result.right));
  };

// -------------------------------------------------------------------------------------
// sequencing
// -------------------------------------------------------------------------------------

/**
 * Chains a function that returns a TaskEither over the Right value.
 * @template A - The input type.
 * @template E2 - The new error type.
 * @template B - The output type.
 * @param f - The chaining function.
 * @returns A function that transforms the TaskEither.
 * @since 2.0.0
 */
export const flatMap =
  <A, E2, B>(f: (a: A) => TaskEither<E2, B>) =>
  <E1>(ma: TaskEither<E1, A>): TaskEither<E1 | E2, B> =>
  async () => {
    const result = await ma();
    if (E.isLeft(result)) {
      return result;
    }
    return await f(result.right)();
  };

/**
 * Alias for flatMap.
 * @since 2.0.0
 */
export const chain = flatMap;

/**
 * Flattens a nested TaskEither.
 * @template E - The error type.
 * @template A - The success type.
 * @param mma - The nested TaskEither.
 * @returns The flattened TaskEither.
 * @since 2.0.0
 */
export const flatten =
  <E, A>(mma: TaskEither<E, TaskEither<E, A>>): TaskEither<E, A> =>
  async () => {
    const result = await mma();
    if (E.isLeft(result)) {
      return result;
    }
    return await result.right();
  };

// -------------------------------------------------------------------------------------
// error handling
// -------------------------------------------------------------------------------------

/**
 * Extracts the value from a Right or applies a function to the Left.
 * @template E - The error type.
 * @template A - The success type.
 * @param onLeft - Handler for Left case.
 * @returns A function that extracts the value.
 * @since 2.0.0
 */
export const getOrElse =
  <E, A>(onLeft: (e: E) => Task<A>) =>
  (ma: TaskEither<E, A>): Task<A> =>
  async () => {
    const result = await ma();
    if (E.isLeft(result)) {
      return await onLeft(result.left)();
    }
    return result.right;
  };

/**
 * Recovers from a Left by applying a function.
 * @template E1 - The original error type.
 * @template A - The success type.
 * @template E2 - The new error type.
 * @param onLeft - Handler for Left case.
 * @returns A function that transforms the TaskEither.
 * @since 2.0.0
 */
export const orElse =
  <E1, A, E2>(onLeft: (e: E1) => TaskEither<E2, A>) =>
  (ma: TaskEither<E1, A>): TaskEither<E2, A> =>
  async () => {
    const result = await ma();
    if (E.isLeft(result)) {
      return await onLeft(result.left)();
    }
    return result;
  };

// -------------------------------------------------------------------------------------
// pattern matching
// -------------------------------------------------------------------------------------

/**
 * Pattern matches on a TaskEither.
 * @template E - The error type.
 * @template B - The return type.
 * @template A - The success type.
 * @param onLeft - Handler for Left case.
 * @param onRight - Handler for Right case.
 * @returns A function that matches the TaskEither.
 * @since 2.0.0
 */
export const match =
  <E, B, A>(
    onLeft: (e: E) => B,
    onRight: (a: A) => B
  ): ((ma: TaskEither<E, A>) => () => Promise<B>) =>
  (ma) =>
  async () => {
    const result = await ma();
    return E.isLeft(result) ? onLeft(result.left) : onRight(result.right);
  };

/**
 * Alias for match.
 * @since 2.0.0
 */
export const fold = match;

// -------------------------------------------------------------------------------------
// utilities
// -------------------------------------------------------------------------------------

/**
 * Swaps the Left and Right values.
 * @template E - The error type.
 * @template A - The success type.
 * @param ma - The TaskEither to swap.
 * @returns The swapped TaskEither.
 * @since 2.0.0
 */
export const swap =
  <E, A>(ma: TaskEither<E, A>): TaskEither<A, E> =>
  async () => {
    const result = await ma();
    return E.isLeft(result) ? E.right(result.left) : E.left(result.right);
  };

/**
 * Alias for right.
 * @since 2.0.0
 */
export const of = right;

// -------------------------------------------------------------------------------------
// aliases for compatibility
// -------------------------------------------------------------------------------------

/**
 * Alias for mapLeft.
 * @since 2.0.0
 */
export const mapError = mapLeft;

/**
 * Alias for bimap.
 * @since 2.0.0
 */
export const mapBoth = bimap;
