/**
 * Lightweight Either implementation based on fp-ts.
 * Covers 90% of essential use cases.
 * @since 1.0.0
 */

import { Nullish } from "@arkhe/types/common/nullish";
import { isSomeOption } from "@arkhe/types/utilities/is-some-option";

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * Represents the Left variant of Either containing an error value.
 * @template E - The error type.
 * @since 2.0.0
 */
export interface Left<E> {
  readonly _tag: "Left";
  readonly left: E;
}

/**
 * Represents the Right variant of Either containing a success value.
 * @template A - The success type.
 * @since 2.0.0
 */
export interface Right<A> {
  readonly _tag: "Right";
  readonly right: A;
}

/**
 * Either type representing a value that can be either Left (error) or Right (success).
 * @template E - The error type.
 * @template A - The success type.
 * @since 2.0.0
 */
export type Either<E, A> = Left<E> | Right<A>;

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * Creates a Left Either containing an error value.
 * @template E - The error type.
 * @template A - The success type.
 * @param e - The error value.
 * @returns A Left Either.
 * @since 2.0.0
 */
export const left = <E = never, A = never>(e: E): Either<E, A> => ({
  _tag: "Left",
  left: e,
});

/**
 * Creates a Right Either containing a success value.
 * @template E - The error type.
 * @template A - The success type.
 * @param a - The success value.
 * @returns A Right Either.
 * @since 2.0.0
 */
export const right = <E = never, A = never>(a: A): Either<E, A> => ({
  _tag: "Right",
  right: a,
});

// -------------------------------------------------------------------------------------
// refinements
// -------------------------------------------------------------------------------------

/**
 * Type guard that checks if an Either is a Left.
 * @template E - The error type.
 * @param ma - The Either to check.
 * @returns True if the Either is a Left.
 * @since 2.0.0
 */
export const isLeft = <E>(ma: Either<E, unknown>): ma is Left<E> =>
  ma._tag === "Left";

/**
 * Type guard that checks if an Either is a Right.
 * @template A - The success type.
 * @param ma - The Either to check.
 * @returns True if the Either is a Right.
 * @since 2.0.0
 */
export const isRight = <A>(ma: Either<unknown, A>): ma is Right<A> =>
  ma._tag === "Right";

// -------------------------------------------------------------------------------------
// pattern matching
// -------------------------------------------------------------------------------------

/**
 * Pattern matches on an Either with widened return types.
 * @template E - The error type.
 * @template B - The return type for Left.
 * @template A - The success type.
 * @template C - The return type for Right.
 * @param onLeft - Handler for Left case.
 * @param onRight - Handler for Right case.
 * @returns A function that takes an Either and returns B or C.
 * @since 2.0.0
 */
export const matchW =
  <E, B, A, C>(onLeft: (e: E) => B, onRight: (a: A) => C) =>
  (ma: Either<E, A>): B | C =>
    isLeft(ma) ? onLeft(ma.left) : onRight(ma.right);

/**
 * Pattern matches on an Either.
 * @template E - The error type.
 * @template A - The success type.
 * @template B - The return type.
 * @param onLeft - Handler for Left case.
 * @param onRight - Handler for Right case.
 * @returns A function that takes an Either and returns B.
 * @since 2.0.0
 */
export const match = <E, A, B>(
  onLeft: (e: E) => B,
  onRight: (a: A) => B
): ((ma: Either<E, A>) => B) => matchW(onLeft, onRight);

/**
 * Alias for match.
 * @since 2.0.0
 */
export const fold = match;

// -------------------------------------------------------------------------------------
// error handling
// -------------------------------------------------------------------------------------

/**
 * Extracts the value from a Right or applies a function to the Left with widened return type.
 * @template E - The error type.
 * @template B - The fallback return type.
 * @param onLeft - Handler for Left case.
 * @returns A function that takes an Either and returns A or B.
 * @since 2.0.0
 */
export const getOrElseW =
  <E, B>(onLeft: (e: E) => B) =>
  <A>(ma: Either<E, A>): A | B =>
    isLeft(ma) ? onLeft(ma.left) : ma.right;

/**
 * Extracts the value from a Right or applies a function to the Left.
 * @template E - The error type.
 * @template A - The success type.
 * @param onLeft - Handler for Left case.
 * @returns A function that takes an Either and returns A.
 * @since 2.0.0
 */
export const getOrElse = <E, A>(
  onLeft: (e: E) => A
): ((ma: Either<E, A>) => A) => getOrElseW(onLeft);

/**
 * Recovers from a Left by applying a function with widened error type.
 * @template E1 - The original error type.
 * @template E2 - The new error type.
 * @template B - The new success type.
 * @param onLeft - Handler for Left case.
 * @returns A function that transforms the Either.
 * @since 2.0.0
 */
export const orElseW =
  <E1, E2, B>(onLeft: (e: E1) => Either<E2, B>) =>
  <A>(ma: Either<E1, A>): Either<E2, A | B> =>
    isLeft(ma) ? onLeft(ma.left) : ma;

/**
 * Recovers from a Left by applying a function.
 * @template E1 - The original error type.
 * @template A - The success type.
 * @template E2 - The new error type.
 * @param onLeft - Handler for Left case.
 * @returns A function that transforms the Either.
 * @since 2.0.0
 */
export const orElse = <E1, A, E2>(
  onLeft: (e: E1) => Either<E2, A>
): ((ma: Either<E1, A>) => Either<E2, A>) => orElseW(onLeft);

// -------------------------------------------------------------------------------------
// transformations
// -------------------------------------------------------------------------------------

/**
 * Maps a function over the Right value of an Either.
 * @template A - The original success type.
 * @template B - The new success type.
 * @param f - The mapping function.
 * @returns A function that transforms the Either.
 * @since 2.0.0
 */
export const map =
  <A, B>(f: (a: A) => B) =>
  <E>(fa: Either<E, A>): Either<E, B> =>
    isLeft(fa) ? fa : right(f(fa.right));

/**
 * Maps a function over the Left value of an Either.
 * @template E - The original error type.
 * @template G - The new error type.
 * @param f - The mapping function.
 * @returns A function that transforms the Either.
 * @since 2.0.0
 */
export const mapLeft =
  <E, G>(f: (e: E) => G) =>
  <A>(fa: Either<E, A>): Either<G, A> =>
    isLeft(fa) ? left(f(fa.left)) : fa;

/**
 * Maps functions over both Left and Right values of an Either.
 * @template E - The original error type.
 * @template G - The new error type.
 * @template A - The original success type.
 * @template B - The new success type.
 * @param f - The error mapping function.
 * @param g - The success mapping function.
 * @returns A function that transforms the Either.
 * @since 2.0.0
 */
export const bimap =
  <E, G, A, B>(f: (e: E) => G, g: (a: A) => B) =>
  (fa: Either<E, A>): Either<G, B> =>
    isLeft(fa) ? left(f(fa.left)) : right(g(fa.right));

// -------------------------------------------------------------------------------------
// sequencing
// -------------------------------------------------------------------------------------

/**
 * Chains a function that returns an Either over the Right value.
 * @template A - The original success type.
 * @template E2 - The new error type.
 * @template B - The new success type.
 * @param f - The chaining function.
 * @returns A function that transforms the Either.
 * @since 2.0.0
 */
export const flatMap =
  <A, E2, B>(f: (a: A) => Either<E2, B>) =>
  <E1>(ma: Either<E1, A>): Either<E1 | E2, B> =>
    isLeft(ma) ? ma : f(ma.right);

/**
 * Executes a side effect on the Right value and returns the original Either.
 * @template E1 - The original error type.
 * @template A - The success type.
 * @template E2 - The side effect error type.
 * @param self - The Either to tap.
 * @param f - The side effect function.
 * @returns The original Either.
 * @since 2.0.0
 */
export const tap = <E1, A, E2>(
  self: Either<E1, A>,
  f: (a: A) => Either<E2, unknown>
): Either<E1 | E2, A> => {
  if (isLeft(self)) return self;
  f(self.right);
  return self;
};

/**
 * Flattens a nested Either.
 * @template E - The error type.
 * @template A - The success type.
 * @param mma - The nested Either.
 * @returns The flattened Either.
 * @since 2.0.0
 */
export const flatten = <E, A>(mma: Either<E, Either<E, A>>): Either<E, A> =>
  isLeft(mma) ? mma : mma.right;

// -------------------------------------------------------------------------------------
// creation
// -------------------------------------------------------------------------------------

/**
 * Creates an Either from a predicate.
 * @template A - The value type.
 * @template E - The error type.
 * @param predicate - The predicate function.
 * @param onFalse - Function to create error when predicate fails.
 * @returns A function that creates an Either from a value.
 * @since 2.0.0
 */
export const fromPredicate =
  <A, E>(
    predicate: (a: A) => boolean,
    onFalse: (a: A) => E
  ): ((a: A) => Either<E, A>) =>
  (a) =>
    predicate(a) ? right(a) : left(onFalse(a));

/**
 * Creates an Either from a nullable value.
 * @template E - The error type.
 * @param e - The error value for null/undefined.
 * @returns A function that creates an Either from a nullable value.
 * @since 2.0.0
 */
export const fromNullable =
  <E>(e: E) =>
  <A>(a: A): Either<E, NonNullable<A>> =>
    a == null ? left(e) : right(a as NonNullable<A>);

/**
 * Creates an Either by executing a function that may throw.
 * @template E - The error type.
 * @template A - The success type.
 * @param f - The function to execute.
 * @param onThrow - Function to transform thrown errors.
 * @returns An Either containing the result or error.
 * @since 2.0.0
 */
export const tryCatch = <E, A>(
  f: () => A,
  onThrow: (e: unknown) => E
): Either<E, A> => {
  try {
    return right(f());
  } catch (e) {
    return left(onThrow(e));
  }
};

/**
 * Lifts a function to return an Either when called.
 * @template A - The argument types.
 * @template B - The return type.
 * @template E - The error type.
 * @param f - The function to lift.
 * @param onThrow - Function to transform thrown errors.
 * @returns A lifted function that returns an Either.
 * @since 2.0.0
 */
export const tryCatchK =
  <A extends ReadonlyArray<unknown>, B, E>(
    f: (...a: A) => B,
    onThrow: (error: unknown) => E
  ): ((...a: A) => Either<E, B>) =>
  (...a) =>
    tryCatch(() => f(...a), onThrow);

// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------

/**
 * Creates an Either from an Option.
 * @template E - The error type.
 * @param onNone - Function to create error for None.
 * @returns A function that converts an Option to an Either.
 * @since 2.0.0
 */
export const fromOption =
  <E>(onNone: () => E) =>
  <A>(fa: { _tag: "Some" | "None"; value?: A }): Either<E, A> =>
    isSomeOption(fa) ? right(fa.value) : left(onNone());

/**
 * Converts an Either to a union type.
 * @template E - The error type.
 * @template A - The success type.
 * @param fa - The Either to convert.
 * @returns The Left or Right value.
 * @since 2.0.0
 */
export const toUnion = <E, A>(fa: Either<E, A>): E | A =>
  isLeft(fa) ? fa.left : fa.right;

// -------------------------------------------------------------------------------------
// utilities
// -------------------------------------------------------------------------------------

/**
 * Swaps the Left and Right values of an Either.
 * @template E - The error type.
 * @template A - The success type.
 * @param ma - The Either to swap.
 * @returns The swapped Either.
 * @since 2.0.0
 */
export const swap = <E, A>(ma: Either<E, A>): Either<A, E> =>
  isLeft(ma) ? right(ma.left) : left(ma.right);

/**
 * Tests if a predicate holds for the Right value.
 * @template A - The success type.
 * @param predicate - The predicate to test.
 * @returns A function that tests the Either.
 * @since 2.0.0
 */
export const exists =
  <A>(predicate: (a: A) => boolean) =>
  (ma: Either<unknown, A>): boolean =>
    isLeft(ma) ? false : predicate(ma.right);

/**
 * Tests if a value is equal to the Right value using an Eq instance.
 * @template A - The success type.
 * @param E - The Eq instance.
 * @returns A curried function that tests equality.
 * @since 2.0.0
 */
export const elem =
  <A>(E: { equals: (a: A, b: A) => boolean }) =>
  (a: A) =>
  <Err>(ma: Either<Err, A>): boolean =>
    isLeft(ma) ? false : E.equals(a, ma.right);

// -------------------------------------------------------------------------------------
// filtering
// -------------------------------------------------------------------------------------

/**
 * Filters the Right value with a predicate, returning Left if it fails.
 * @template A - The success type.
 * @template E - The error type.
 * @param predicate - The predicate to test.
 * @param onFalse - Function to create error when predicate fails.
 * @returns A function that filters the Either.
 * @since 2.0.0
 */
export const filterOrElse =
  <A, E>(predicate: (a: A) => boolean, onFalse: (a: A) => E) =>
  (self: Either<E, A>): Either<E, A> =>
    isLeft(self)
      ? self
      : predicate(self.right)
      ? self
      : left(onFalse(self.right));

// -------------------------------------------------------------------------------------
// lifting
// -------------------------------------------------------------------------------------

/**
 * Lifts a function that may return null/undefined to return an Either.
 * @template A - The argument types.
 * @template B - The return type.
 * @template E - The error type.
 * @param f - The function to lift.
 * @param onNullable - Function to create error for null/undefined.
 * @returns A lifted function that returns an Either.
 * @since 2.0.0
 */
export const liftNullable =
  <A extends ReadonlyArray<unknown>, B, E>(
    f: (...a: A) => Nullish<B>,
    onNullable: (...a: A) => E
  ) =>
  (...a: A): Either<E, NonNullable<B>> => {
    const result = f(...a);
    return result == null
      ? left(onNullable(...a))
      : right(result as NonNullable<B>);
  };

/**
 * Lifts a function that returns an Option to return an Either.
 * @template A - The argument types.
 * @template B - The return type.
 * @template E - The error type.
 * @param f - The function to lift.
 * @param onNone - Function to create error for None.
 * @returns A lifted function that returns an Either.
 * @since 2.0.0
 */
export const liftOption =
  <A extends ReadonlyArray<unknown>, B, E>(
    f: (...a: A) => { _tag: "Some" | "None"; value?: B },
    onNone: (...a: A) => E
  ) =>
  (...a: A): Either<E, B> => {
    const result = f(...a);
    return isSomeOption(result) ? right(result.value) : left(onNone(...a));
  };

// -------------------------------------------------------------------------------------
// advanced flatMap
// -------------------------------------------------------------------------------------

/**
 * FlatMaps over a nullable result.
 * @template A - The input type.
 * @template B - The output type.
 * @template E2 - The error type for null/undefined.
 * @param f - The mapping function.
 * @param onNullable - Function to create error for null/undefined.
 * @returns A function that flatMaps the Either.
 * @since 2.0.0
 */
export const flatMapNullable =
  <A, B, E2>(f: (a: A) => Nullish<B>, onNullable: (a: A) => E2) =>
  <E1>(self: Either<E1, A>): Either<E2 | E1, NonNullable<B>> =>
    isLeft(self)
      ? self
      : flatMap((a: A) => fromNullable(onNullable(a))(f(a)))(self);

/**
 * FlatMaps over an Option result.
 * @template A - The input type.
 * @template B - The output type.
 * @template E2 - The error type for None.
 * @param f - The mapping function.
 * @param onNone - Function to create error for None.
 * @returns A function that flatMaps the Either.
 * @since 2.0.0
 */
export const flatMapOption =
  <A, B, E2>(
    f: (a: A) => { _tag: "Some" | "None"; value?: B },
    onNone: (a: A) => E2
  ) =>
  <E1>(self: Either<E1, A>): Either<E2 | E1, B> =>
    isLeft(self)
      ? self
      : flatMap((a: A) => fromOption(() => onNone(a))(f(a)))(self);

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * Sequences two Eithers, keeping the first value.
 * @template E1 - The error type of the second Either.
 * @template B - The success type of the second Either.
 * @param fab - The second Either.
 * @returns A function that sequences the Eithers.
 * @since 2.0.0
 */
export const apFirst =
  <E1, B>(fab: Either<E1, B>) =>
  <E2, A>(fa: Either<E2, A>): Either<E1 | E2, A> => {
    if (isLeft(fab)) return fab;
    return fa;
  };

/**
 * Sequences two Eithers, keeping the second value.
 * @template E1 - The error type of the second Either.
 * @template B - The success type of the second Either.
 * @param fab - The second Either.
 * @returns A function that sequences the Eithers.
 * @since 2.0.0
 */
export const apSecond =
  <E1, B>(fab: Either<E1, B>) =>
  <E2, A>(fa: Either<E2, A>): Either<E1 | E2, B> =>
    isLeft(fab) ? fab : isLeft(fa) ? fa : fab;

/**
 * Applies a function inside an Either to a value inside another Either.
 * @template E1 - The error type of the value Either.
 * @template A - The input type.
 * @param fa - The value Either.
 * @returns A function that applies the function Either.
 * @since 2.0.0
 */
export const ap =
  <E1, A>(fa: Either<E1, A>) =>
  <E2, B>(fab: Either<E2, (a: A) => B>): Either<E1 | E2, B> =>
    isLeft(fab) ? fab : isLeft(fa) ? fa : right(fab.right(fa.right));

// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------

/**
 * Starting point for do notation with an empty object.
 * @since 2.0.0
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const Do: Either<never, {}> = right({});

/**
 * Binds a value to a name in do notation.
 * @template N - The property name.
 * @param name - The property name.
 * @returns A function that binds the value.
 * @since 2.0.0
 */
export const bindTo =
  <N extends string>(name: N) =>
  <E, A>(fa: Either<E, A>): Either<E, { readonly [K in N]: A }> =>
    map((a) => ({ [name]: a } as { readonly [K in N]: A }))(fa);

/**
 * Binds a computed value to a name in do notation.
 * @template N - The property name.
 * @template A - The accumulated type.
 * @template E2 - The error type.
 * @template B - The new value type.
 * @param name - The property name.
 * @param f - The function to compute the value.
 * @returns A function that binds the computed value.
 * @since 2.0.0
 */
export const bind =
  <N extends string, A extends Record<string, unknown>, E2, B>(
    name: Exclude<N, keyof A>,
    f: (a: A) => Either<E2, B>
  ) =>
  <E1>(
    fa: Either<E1, A>
  ): Either<
    E1 | E2,
    { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }
  > =>
    flatMap((a: A) =>
      map(
        (b: B) =>
          ({ ...a, [name]: b } as {
            readonly [K in keyof A | N]: K extends keyof A ? A[K] : B;
          })
      )(f(a))
    )(fa);

/**
 * Adds a value to the accumulated object in do notation.
 * @template N - The property name.
 * @template A - The accumulated type.
 * @template E - The error type.
 * @template B - The new value type.
 * @param name - The property name.
 * @param fb - The Either containing the value.
 * @returns A function that adds the value.
 * @since 2.0.0
 */
export const apS =
  <N extends string, A extends Record<string, unknown>, E, B>(
    name: Exclude<N, keyof A>,
    fb: Either<E, B>
  ) =>
  (
    fa: Either<E, A>
  ): Either<E, { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }> =>
    flatMap((a: A) =>
      map(
        (b: B) =>
          ({ ...a, [name]: b } as {
            readonly [K in keyof A | N]: K extends keyof A ? A[K] : B;
          })
      )(fb)
    )(fa);
