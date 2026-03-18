/**
 * Functional Builder Pattern.
 *
 * In OOP, the Builder pattern requires a Builder interface, ConcreteBuilder
 * classes with mutable state, a Product class, and optionally a Director class
 * to orchestrate construction steps.
 * In functional TypeScript, a builder is a function that returns an object
 * with chainable step methods and a final `build()`. Each step returns a new
 * builder (immutable).
 *
 * The Director concept maps to a simple function that takes a builder and
 * calls steps in a specific sequence — no class needed.
 *
 * @module eidos/builder
 * @since 2.4.0
 *
 * @example
 * ```ts
 * import { createBuilder } from "@pithos/core/eidos/builder/builder";
 *
 * const carBuilder = createBuilder({ engine: "", wheels: 0, color: "white" })
 *   .step("engine", (s, engine: string) => ({ ...s, engine }))
 *   .step("wheels", (s, wheels: number) => ({ ...s, wheels }))
 *   .step("color", (s, color: string) => ({ ...s, color }))
 *   .done();
 *
 * const car = carBuilder()
 *   .engine("V8")
 *   .wheels(4)
 *   .color("red")
 *   .build();
 * // { engine: "V8", wheels: 4, color: "red" }
 * ```
 */

import { ok, err } from "@zygos/result/result";
import type { Result } from "@zygos/result/result";

/**
 * Intermediate builder definition that accumulates steps.
 *
 * @template State - The product state being built
 * @template Methods - Accumulated method signatures
 * @since 2.4.0
 */
export interface BuilderDefinition<State, Methods extends object> {
  /**
   * Adds a step to the builder.
   *
   * @template K - The method name
   * @template Arg - The argument type for this step
   * @param name - The method name
   * @param fn - The step function
   */
  step<K extends string, Arg>(
    name: K,
    fn: (state: State, arg: Arg) => State,
  ): BuilderDefinition<State, Methods & { [P in K]: (arg: Arg) => unknown }>;

  /**
   * Finalizes the definition and returns a builder factory.
   */
  done(): () => FinalBuilder<State, Methods>;
}

/**
 * The final builder object with chainable step methods.
 *
 * @template State - The product state being built
 * @template Methods - The step method signatures
 * @since 2.4.0
 */
export type FinalBuilder<State, Methods extends object> = {
  [K in keyof Methods]: Methods[K] extends (arg: infer Arg) => unknown
    ? (arg: Arg) => FinalBuilder<State, Methods>
    : never;
} & {
  /** Returns the built product. */
  build: () => State;
  /** Returns the current state without finalizing. */
  current: () => State;
};

/**
 * Creates an immutable builder definition.
 *
 * Use `.step(name, fn)` to add steps, then `.done()` to get the factory.
 * Each step method on the final builder returns a new builder (immutable).
 *
 * @template State - The product type being built
 * @param initial - The initial state
 * @returns A builder definition to chain `.step()` calls
 * @since 2.4.0
 *
 * @example
 * ```ts
 * const queryBuilder = createBuilder({ table: "", where: [] as string[], limit: 100 })
 *   .step("from", (s, table: string) => ({ ...s, table }))
 *   .step("where", (s, clause: string) => ({ ...s, where: [...s.where, clause] }))
 *   .step("limit", (s, n: number) => ({ ...s, limit: n }))
 *   .done();
 *
 * const q = queryBuilder()
 *   .from("users")
 *   .where("active = true")
 *   .limit(10)
 *   .build();
 * ```
 */
export function createBuilder<State>(
  initial: State,
): BuilderDefinition<State, object> {
  type StepFn = (state: State, arg: unknown) => State;
  const steps = new Map<string, StepFn>();

  const definition: BuilderDefinition<State, object> = {
    step<K extends string, Arg>(
      name: K,
      fn: (state: State, arg: Arg) => State,
    ) {
      // INTENTIONAL: runtime metaprogramming, type safety via generics
      steps.set(name, fn as StepFn); 
      // INTENTIONAL: accumulate method types via intersection, TS can't track dynamically
      return definition as BuilderDefinition<
        State,
        object & { [P in K]: (arg: Arg) => unknown }
      >;
    },

    done() {
      const makeBuilder = (state: State): FinalBuilder<State, object> => {
        const builder: Record<string, unknown> = {
          build: () => state,
          current: () => state,
        };

        for (const [name, fn] of steps) {
          builder[name] = (arg: unknown) => makeBuilder(fn(state, arg));
        }

        // INTENTIONAL: dynamic object, type enforced by steps Map
        return builder as FinalBuilder<State, object>; 
      };

      return () => makeBuilder(initial);
    },
  };

  return definition;
}


/**
 * Validated builder definition that accumulates steps.
 *
 * @template State - The product state being built
 * @template Methods - Accumulated method signatures
 * @since 2.4.0
 */
export interface ValidatedBuilderDefinition<State, Methods extends object> {
  /**
   * Adds a step to the builder.
   */
  step<K extends string, Arg>(
    name: K,
    fn: (state: State, arg: Arg) => State,
  ): ValidatedBuilderDefinition<State, Methods & { [P in K]: (arg: Arg) => unknown }>;

  /**
   * Finalizes with a validator. `build()` returns `Result<State, string>`.
   *
   * @param validate - Returns `true` if valid, or an error message string
   */
  done(
    validate: (state: State) => true | string,
  ): () => ValidatedFinalBuilder<State, Methods>;
}

/**
 * Builder with validated build() returning Result.
 *
 * @template State - The product state being built
 * @template Methods - The step method signatures
 * @since 2.4.0
 */
export type ValidatedFinalBuilder<State, Methods extends object> = {
  [K in keyof Methods]: Methods[K] extends (arg: infer Arg) => unknown
    ? (arg: Arg) => ValidatedFinalBuilder<State, Methods>
    : never;
} & {
  /** Returns Ok(state) if valid, Err(message) otherwise. */
  build: () => Result<State, string>;
  /** Returns the current state without validation. */
  current: () => State;
};

/**
 * Creates a builder with validation on `build()`.
 *
 * Same as `createBuilder`, but `.done(validate)` takes a validator.
 * `build()` returns `Result<State, string>`.
 *
 * @template State - The product type being built
 * @param initial - The initial state
 * @returns A validated builder definition
 * @since 2.4.0
 *
 * @example
 * ```ts
 * const configBuilder = createValidatedBuilder({ host: "", port: 0 })
 *   .step("host", (s, host: string) => ({ ...s, host }))
 *   .step("port", (s, port: number) => ({ ...s, port }))
 *   .done((s) => s.host ? true : "host is required");
 *
 * configBuilder().port(8080).build();         // Err("host is required")
 * configBuilder().host("localhost").build(); // Ok({ host: "localhost", port: 0 })
 * ```
 */
export function createValidatedBuilder<State>(
  initial: State,
): ValidatedBuilderDefinition<State, object> {
  type StepFn = (state: State, arg: unknown) => State;
  const steps = new Map<string, StepFn>();

  const definition: ValidatedBuilderDefinition<State, object> = {
    step<K extends string, Arg>(
      name: K,
      fn: (state: State, arg: Arg) => State,
    ) {
      // INTENTIONAL: runtime metaprogramming
      steps.set(name, fn as StepFn); 
      // INTENTIONAL: dynamic type accumulation
      return definition as ValidatedBuilderDefinition< 
        State,
        object & { [P in K]: (arg: Arg) => unknown }
      >;
    },

    done(validate: (state: State) => true | string) {
      const makeBuilder = (state: State): ValidatedFinalBuilder<State, object> => {
        const builder: Record<string, unknown> = {
          build: () => {
            const result = validate(state);
            return result === true ? ok(state) : err(result);
          },
          current: () => state,
        };

        for (const [name, fn] of steps) {
          builder[name] = (arg: unknown) => makeBuilder(fn(state, arg));
        }
        // INTENTIONAL: dynamic object construction
        return builder as ValidatedFinalBuilder<State, object>; 
      };

      return () => makeBuilder(initial);
    },
  };

  return definition;
}

/**
 * A Director is a function that orchestrates builder steps in a specific sequence.
 * This is the functional equivalent of the GoF Director class.
 *
 * @template B - The builder type
 * @template State - The product type
 * @since 2.4.0
 *
 * @example
 * ```ts
 * // Director as a simple function
 * const buildSportsCar: Director<ReturnType<typeof carBuilder>, Car> = (b) =>
 *   b.engine("V8").wheels(4).color("red");
 *
 * const car = buildSportsCar(carBuilder()).build();
 * ```
 */
export type Director<B, State> = (builder: B) => { build: () => State };
