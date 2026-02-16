/**
 * Lightweight Option implementation optimized for performance.
 *
 * Option<A> is a container for an optional value of type A.
 * If the value is present, it's an instance of Some<A>.
 * If the value is absent, it's an instance of None.
 * @since 1.0.0
 */

import { Nullish } from "@arkhe/types/common/nullish";

// -------------------------------------------------------------------------------------
// Types
// -------------------------------------------------------------------------------------

/**
 * Represents the absence of a value.
 * @since 2.0.0
 */
export interface None {
  readonly _tag: "None";
}

/**
 * Represents the presence of a value.
 * @template A - The value type.
 * @since 2.0.0
 */
export interface Some<A> {
  readonly _tag: "Some";
  readonly value: A;
}

/**
 * Option type representing an optional value.
 * @template A - The value type.
 * @since 2.0.0
 */
export type Option<A> = None | Some<A>;

// -------------------------------------------------------------------------------------
// Constructeurs - Optimisés
// -------------------------------------------------------------------------------------

/**
 * The None instance representing absence of value.
 * @since 2.0.0
 */
export const none: Option<never> = { _tag: "None" };

/**
 * Creates a Some containing the given value.
 * @template A - The value type.
 * @param a - The value to wrap.
 * @returns A Some containing the value.
 * @since 2.0.0
 */
export const some = <A>(a: A): Option<A> => ({ _tag: "Some", value: a });

/**
 * Alias for some.
 * @since 2.0.0
 */
export const of = some; // Alias direct

// -------------------------------------------------------------------------------------
// Refinements
// -------------------------------------------------------------------------------------

/**
 * Type guard that checks if an Option is a Some.
 * @template A - The value type.
 * @param fa - The Option to check.
 * @returns True if the Option is a Some.
 * @since 2.0.0
 */
export const isSome = <A>(fa: Option<A>): fa is Some<A> => fa._tag === "Some";

/**
 * Type guard that checks if an Option is a None.
 * @param fa - The Option to check.
 * @returns True if the Option is a None.
 * @since 2.0.0
 */
export const isNone = (fa: Option<unknown>): fa is None => fa._tag === "None";

// -------------------------------------------------------------------------------------
// Constructeurs utilitaires
// -------------------------------------------------------------------------------------

/**
 * Creates an Option from a nullable value.
 * @template A - The value type.
 * @param a - The nullable value.
 * @returns Some if value is not null/undefined, None otherwise.
 * @since 2.0.0
 */
export const fromNullable = <A>(a: A): Option<NonNullable<A>> =>
  a == null ? none : some(a as NonNullable<A>);

/**
 * Creates an Option from a predicate.
 * @template A - The value type.
 * @param refinement - The refinement or predicate function.
 * @returns A function that creates an Option based on the predicate.
 * @since 2.0.0
 */
export function fromPredicate<A, B extends A>(
  refinement: (a: A) => a is B
): (a: A) => Option<B>;
export function fromPredicate<A>(
  predicate: (a: A) => boolean
): (a: A) => Option<A>;
export function fromPredicate<A>(
  predicate: (a: A) => boolean
): (a: A) => Option<A> {
  return (a) => (predicate(a) ? some(a) : none);
}

// -------------------------------------------------------------------------------------
// Opérations fondamentales
// -------------------------------------------------------------------------------------

/**
 * Maps a function over the value of an Option.
 * @template A - The input type.
 * @template B - The output type.
 * @param f - The mapping function.
 * @returns A function that transforms the Option.
 * @since 2.0.0
 */
export const map =
  <A, B>(f: (a: A) => B) =>
  (fa: Option<A>): Option<B> =>
    isNone(fa) ? none : some(f(fa.value));

/**
 * Chains a function that returns an Option over the value.
 * @template A - The input type.
 * @template B - The output type.
 * @param f - The chaining function.
 * @returns A function that transforms the Option.
 * @since 2.0.0
 */
export const flatMap =
  <A, B>(f: (a: A) => Option<B>) =>
  (ma: Option<A>): Option<B> =>
    isNone(ma) ? none : f(ma.value);

/**
 * Alias for flatMap.
 * @since 2.0.0
 */
export const chain = flatMap;

// -------------------------------------------------------------------------------------
// Pattern matching
// -------------------------------------------------------------------------------------

/**
 * Pattern matches on an Option.
 * @template A - The value type.
 * @template B - The return type.
 * @param onNone - Handler for None case.
 * @param onSome - Handler for Some case.
 * @returns A function that matches the Option.
 * @since 2.0.0
 */
export const match =
  <A, B>(onNone: () => B, onSome: (a: A) => B) =>
  (ma: Option<A>): B =>
    isNone(ma) ? onNone() : onSome(ma.value);

/**
 * Alias for match.
 * @since 2.0.0
 */
export const fold = match;

/**
 * Pattern matches on an Option with widened return types.
 * @template B - The return type for None.
 * @template A - The value type.
 * @template C - The return type for Some.
 * @param onNone - Handler for None case.
 * @param onSome - Handler for Some case.
 * @returns A function that matches the Option.
 * @since 2.0.0
 */
export const matchW =
  <B, A, C>(onNone: () => B, onSome: (a: A) => C) =>
  (ma: Option<A>): B | C =>
    isNone(ma) ? onNone() : onSome(ma.value);

/**
 * Alias for matchW.
 * @since 2.0.0
 */
export const foldW = matchW;

// -------------------------------------------------------------------------------------
// Gestion d'erreurs
// -------------------------------------------------------------------------------------

/**
 * Extracts the value from a Some or returns a default.
 * @template A - The value type.
 * @param onNone - Function to provide default value.
 * @returns A function that extracts the value.
 * @since 2.0.0
 */
export const getOrElse =
  <A>(onNone: () => A) =>
  (ma: Option<A>): A =>
    isNone(ma) ? onNone() : ma.value;

/**
 * Extracts the value from a Some or returns a default with widened type.
 * @template B - The default type.
 * @param onNone - Function to provide default value.
 * @returns A function that extracts the value.
 * @since 2.0.0
 */
export const getOrElseW =
  <B>(onNone: () => B) =>
  <A>(ma: Option<A>): A | B =>
    isNone(ma) ? onNone() : ma.value;

/**
 * Returns an alternative Option if the first is None.
 * @template A - The value type.
 * @param that - Function to provide alternative Option.
 * @returns A function that returns the alternative.
 * @since 2.0.0
 */
export const alt =
  <A>(that: () => Option<A>) =>
  (fa: Option<A>): Option<A> =>
    isNone(fa) ? that() : fa;

/**
 * Alias for alt.
 * @since 2.0.0
 */
export const orElse = alt;

// -------------------------------------------------------------------------------------
// Filtrage
// -------------------------------------------------------------------------------------

/**
 * Filters the value with a predicate.
 * @template A - The value type.
 * @param predicate - The predicate function.
 * @returns A function that filters the Option.
 * @since 2.0.0
 */
export const filter =
  <A>(predicate: (a: A) => boolean) =>
  (fa: Option<A>): Option<A> =>
    isNone(fa) ? none : predicate(fa.value) ? fa : none;

/**
 * Maps and filters in one operation.
 * @template A - The input type.
 * @template B - The output type.
 * @param f - The mapping function that returns an Option.
 * @returns A function that filterMaps the Option.
 * @since 2.0.0
 */
export const filterMap =
  <A, B>(f: (a: A) => Option<B>) =>
  (fa: Option<A>): Option<B> =>
    isNone(fa) ? none : f(fa.value);

// -------------------------------------------------------------------------------------
// Conversions
// -------------------------------------------------------------------------------------

/**
 * Converts an Option to a nullable value.
 * @template A - The value type.
 * @param ma - The Option to convert.
 * @returns The value or null.
 * @since 2.0.0
 */
export const toNullable = <A>(ma: Option<A>): A | null =>
  isNone(ma) ? null : ma.value;

/**
 * Converts an Option to an undefined value.
 * @template A - The value type.
 * @param ma - The Option to convert.
 * @returns The value or undefined.
 * @since 2.0.0
 */
export const toUndefined = <A>(ma: Option<A>): A | undefined =>
  isNone(ma) ? undefined : ma.value;

/**
 * Creates an Option from an Either.
 * @template A - The value type.
 * @param fa - The Either to convert.
 * @returns Some if Right, None if Left.
 * @since 2.0.0
 */
export const fromEither = <A>(fa: {
  _tag: "Left" | "Right";
  left?: unknown;
  right?: A;
}): Option<A> =>
  fa._tag === "Right" && fa.right !== undefined ? some(fa.right) : none;

/**
 * Converts an Option to an Either.
 * @template E - The error type.
 * @param onNone - Function to create error for None.
 * @returns A function that converts the Option.
 * @since 2.0.0
 */
export const toEither =
  <E>(onNone: () => E) =>
  <A>(fa: Option<A>): { _tag: "Left" | "Right"; left?: E; right?: A } =>
    isNone(fa)
      ? { _tag: "Left" as const, left: onNone() }
      : { _tag: "Right" as const, right: fa.value };

// -------------------------------------------------------------------------------------
// Utilitaires
// -------------------------------------------------------------------------------------

/**
 * Tests if a predicate holds for the value.
 * @template A - The value type.
 * @param predicate - The predicate to test.
 * @returns A function that tests the Option.
 * @since 2.0.0
 */
export const exists =
  <A>(predicate: (a: A) => boolean) =>
  (ma: Option<A>): boolean =>
    isNone(ma) ? false : predicate(ma.value);

/**
 * Flattens a nested Option.
 * @template A - The value type.
 * @param mma - The nested Option.
 * @returns The flattened Option.
 * @since 2.0.0
 */
export const flatten = <A>(mma: Option<Option<A>>): Option<A> =>
  isNone(mma) ? none : mma.value;

/**
 * Alias for flatten.
 * @since 2.0.0
 */
export const compact = flatten;

// -------------------------------------------------------------------------------------
// Combinateurs
// -------------------------------------------------------------------------------------

/**
 * Sequences two Options, keeping the first value.
 * @param fb - The second Option.
 * @returns A function that sequences the Options.
 * @since 2.0.0
 */
export const apFirst =
  (fb: Option<unknown>) =>
  <A>(fa: Option<A>): Option<A> =>
    isNone(fa) ? none : isNone(fb) ? none : fa;

/**
 * Sequences two Options, keeping the second value.
 * @template A - The value type.
 * @param fb - The second Option.
 * @returns A function that sequences the Options.
 * @since 2.0.0
 */
export const apSecond =
  <A>(fb: Option<A>) =>
  <B>(fa: Option<B>): Option<A> =>
    isNone(fa) ? none : isNone(fb) ? none : fb;

/**
 * Applies a value to a function inside an Option.
 * @template A - The input type.
 * @param a - The value to apply.
 * @returns A function that applies the value.
 * @since 2.0.0
 */
export const flap =
  <A>(a: A) =>
  <B>(fab: Option<(a: A) => B>): Option<B> =>
    isNone(fab) ? none : some(fab.value(a));

/**
 * Replaces the value with a constant.
 * @template A - The new value type.
 * @param a - The constant value.
 * @returns A function that replaces the value.
 * @since 2.0.0
 */
export const as =
  <A>(a: A) =>
  <_>(self: Option<_>): Option<A> =>
    isNone(self) ? none : some(a);

/**
 * Replaces the value with void.
 * @param self - The Option to transform.
 * @returns An Option containing void.
 * @since 2.0.0
 */
export const asUnit = <_>(self: Option<_>): Option<void> =>
  isNone(self) ? none : some(undefined);

// -------------------------------------------------------------------------------------
// Interopérabilité
// -------------------------------------------------------------------------------------

/**
 * Creates an Option by executing a function that may throw.
 * @template A - The value type.
 * @param f - The function to execute.
 * @returns Some if successful, None if throws.
 * @since 2.0.0
 */
export const tryCatch = <A>(f: () => A): Option<A> => {
  try {
    return some(f());
  } catch {
    return none;
  }
};

/**
 * Lifts a function to return an Option when called.
 * @template A - The argument types.
 * @template B - The return type.
 * @param f - The function to lift.
 * @returns A lifted function that returns an Option.
 * @since 2.0.0
 */
export const tryCatchK =
  <A extends readonly unknown[], B>(f: (...a: A) => B) =>
  (...a: A): Option<B> => {
    try {
      return some(f(...a));
    } catch {
      return none;
    }
  };

/**
 * Lifts a function that may return null/undefined to return an Option.
 * @template A - The argument types.
 * @template B - The return type.
 * @param f - The function to lift.
 * @returns A lifted function that returns an Option.
 * @since 2.0.0
 */
export const fromNullableK =
  <A extends readonly unknown[], B>(f: (...a: A) => Nullish<B>) =>
  (...a: A): Option<NonNullable<B>> =>
    fromNullable(f(...a));

/**
 * Chains a function that may return null/undefined.
 * @template A - The input type.
 * @template B - The output type.
 * @param f - The chaining function.
 * @returns A function that chains the Option.
 * @since 2.0.0
 */
export const chainNullableK =
  <A, B>(f: (a: A) => Nullish<B>) =>
  (ma: Option<A>): Option<NonNullable<B>> =>
    isNone(ma) ? none : fromNullable(f(ma.value));

// -------------------------------------------------------------------------------------
// Export par défaut
// -------------------------------------------------------------------------------------

export default {
  none,
  some,
  of,
  isSome,
  isNone,
  fromNullable,
  fromPredicate,
  map,
  flatMap,
  chain,
  match,
  fold,
  matchW,
  foldW,
  getOrElse,
  getOrElseW,
  alt,
  orElse,
  filter,
  filterMap,
  toNullable,
  toUndefined,
  fromEither,
  toEither,
  exists,
  flatten,
  compact,
  apFirst,
  apSecond,
  flap,
  as,
  asUnit,
  tryCatch,
  tryCatchK,
  fromNullableK,
  chainNullableK,
};
