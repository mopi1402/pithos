import {
  array,
  intersection,
  nullable,
  nullish,
  optional,
  readonly as readonlyWrapper,
  unionOf,
  parse,
} from "../index";
import type { Schema, AnySchema } from "../index";
import { isCoerced } from "@kanon/types/base";

/**
 * Validation issue with a message and path.
 *
 * @since 2.0.0
 */
type Issue = { message: string; path: (string | number)[] };

/**
 * Zod-compatible validation issue with optional error code.
 *
 * @since 2.0.0
 */
type ZodLikeIssue = Issue & { code?: string };

/**
 * Discriminated union result type for safe parsing.
 *
 * @template T - The expected output type on success.
 * @since 2.0.0
 */
type ZodResult<T> =
  | { success: true; data: T }
  | { success: false; error: { issues: ZodLikeIssue[] } };

/**
 * Refinement function returning `true` on success or an error message.
 *
 * @template T - The type of value being refined.
 * @since 2.0.0
 */
type RefinementFn<T> = (value: T) => true | string;

/**
 * Super-refinement function with context for adding multiple issues.
 *
 * @template T - The type of value being refined.
 * @since 2.0.0
 */
type SuperRefineFn<T> = (
  value: T,
  ctx: { addIssue: (issue: ZodLikeIssue) => void }
) => void;

/**
 * Transform function mapping an unknown value to another.
 *
 * @since 2.0.0
 */
type TransformFn = (value: unknown) => unknown;

/**
 * Creates a Zod-compatible error object from a message string.
 *
 * @param message - The error message.
 * @returns An object containing a single issue with an empty path.
 * @since 2.0.0
 */
const createError = (message: string): { issues: ZodLikeIssue[] } => ({
  issues: [{ message, path: [] }],
});

/**
 * Type guard checking whether a value is an `Issue` object.
 *
 * @param v - The value to check.
 * @returns `true` if the value has `message` and `path` properties.
 * @since 2.0.0
 */
const isIssue = (v: unknown): v is Issue =>
  typeof v === "object" &&
  v !== null &&
  "message" in v &&
  "path" in v &&
  Array.isArray((v as Issue).path);

/**
 * Opt-in Zod v4-style facade around a Kanon schema.
 *
 * Does not mutate the original schema; tree-shakable and minimal.
 *
 * @template T - The output type of the wrapped schema.
 * @param schema - The Kanon schema to wrap.
 * @returns A Zod-compatible adapter with safeParse, parse, and other Zod methods.
 * @since 2.0.0
 */
export function asZod<T>(schema: Schema<T>): Adapter<T> {
  return createAdapter<T>({
    schema: schema as Schema<unknown>,
    refinements: null,
    superRefines: null,
    transforms: null,
    catchValue: undefined,
    hasCatch: false,
  });
}

/**
 * Internal state carried by each adapter instance.
 *
 * @template Out - The output type of the adapter.
 * @since 2.0.0
 */
type AdapterState<Out> = {
  schema: Schema<unknown>;
  refinements: RefinementFn<Out>[] | null;
  superRefines: SuperRefineFn<Out>[] | null;
  transforms: TransformFn[] | null;
  catchValue: (() => Out) | Out | undefined;
  hasCatch: boolean;
};

/**
 * Zod v4-compatible adapter wrapping a Kanon schema.
 *
 * Exposes parsing, wrapper, refinement, and operator methods
 * that mirror the Zod API surface.
 *
 * @template T - The output type produced by this adapter.
 * @public
 * @since 2.0.0
 */
export type Adapter<T> = {
  /**
   * Parses a value and returns the result or throws on failure.
   *
   * @param value - The value to validate.
   * @returns The validated and possibly coerced value.
   * @throws Zod-compatible error object when validation fails.
   * @since 2.0.0
   */
  parse(value: unknown): T;

  /**
   * Parses a value and returns a discriminated result without throwing.
   *
   * @param value - The value to validate.
   * @returns A `ZodResult` with `success` flag and data or error.
   * @since 2.0.0
   */
  safeParse(value: unknown): ZodResult<T>;

  /**
   * Async variant of `parse`.
   *
   * @param value - The value to validate.
   * @returns Promise resolving to the validated value.
   * @throws Zod-compatible error object when validation fails.
   * @since 2.0.0
   */
  parseAsync(value: unknown): Promise<T>;

  /**
   * Async variant of `safeParse`.
   *
   * @param value - The value to validate.
   * @returns Promise resolving to a `ZodResult`.
   * @since 2.0.0
   */
  safeParseAsync(value: unknown): Promise<ZodResult<T>>;

  /**
   * Wraps the schema to also accept `undefined`.
   *
   * @returns A new adapter accepting `T | undefined`.
   * @since 2.0.0
   */
  optional(): Adapter<T | undefined>;

  /**
   * Wraps the schema to also accept `null`.
   *
   * @param message - Optional custom error message.
   * @returns A new adapter accepting `T | null`.
   * @since 2.0.0
   */
  nullable(message?: string): Adapter<T | null>;

  /**
   * Wraps the schema to also accept `null` and `undefined`.
   *
   * @returns A new adapter accepting `T | null | undefined`.
   * @since 2.0.0
   */
  nullish(): Adapter<T | null | undefined>;

  /**
   * Provides a default value when parsing fails.
   *
   * @param value - Static value or factory function.
   * @returns A new adapter that falls back to the default.
   * @since 2.0.0
   */
  default(value: T | (() => T)): Adapter<T>;

  /**
   * Catches validation errors and returns a fallback value.
   *
   * @param value - Static value or factory function.
   * @returns A new adapter that catches errors.
   * @since 2.0.0
   */
  catch(value: T | (() => T)): Adapter<T>;

  /**
   * Wraps the schema into an array schema.
   *
   * @returns A new adapter validating `T[]`.
   * @since 2.0.0
   */
  array(): Adapter<T[]>;

  /**
   * Marks the schema output as readonly.
   *
   * @returns A new adapter with readonly semantics.
   * @since 2.0.0
   */
  readonly(): Adapter<T>;

  /**
   * Adds a refinement check to the adapter.
   *
   * @param check - Predicate returning `true` if the value is valid.
   * @param message - Optional error message on failure.
   * @returns A new adapter with the refinement applied.
   * @since 2.0.0
   */
  refine(check: (value: T) => boolean, message?: string): Adapter<T>;

  /**
   * Adds a super-refinement with context for complex validations.
   *
   * @param fn - Refinement function receiving the value and a context.
   * @returns A new adapter with the super-refinement applied.
   * @since 2.0.0
   */
  superRefine(fn: SuperRefineFn<T>): Adapter<T>;

  /**
   * Applies a transform to the validated value.
   *
   * @template NewOut - The output type after transformation.
   * @param fn - Transform function.
   * @returns A new adapter producing the transformed type.
   * @since 2.0.0
   */
  transform<NewOut>(fn: (value: T) => NewOut): Adapter<NewOut>;

  /**
   * Creates a union of this adapter with another.
   *
   * @template U - The output type of the other adapter.
   * @param other - The adapter to union with.
   * @returns A new adapter accepting `T | U`.
   * @since 2.0.0
   */
  or<U>(other: Adapter<U>): Adapter<T | U>;

  /**
   * Creates an intersection of this adapter with another.
   *
   * @template U - The output type of the other adapter.
   * @param other - The adapter to intersect with.
   * @returns A new adapter producing `T & U`.
   * @since 2.0.0
   */
  and<U>(other: Adapter<U>): Adapter<T & U>;

  /**
   * Returns the underlying Kanon schema.
   *
   * @returns The wrapped Kanon schema.
   * @internal Used by shim for schema composition.
   * @since 2.0.0
   */
  _schema(): Schema<T>;
};

/**
 * Creates an `Adapter` instance from the given internal state.
 *
 * @template Out - The output type of the adapter.
 * @param state - Internal adapter state with schema, refinements, and transforms.
 * @returns A fully wired `Adapter` instance.
 * @since 2.0.0
 */
function createAdapter<Out>(state: AdapterState<Out>): Adapter<Out> {
  const {
    schema,
    refinements,
    superRefines,
    transforms,
    catchValue,
    hasCatch,
  } = state;

  // Stryker disable next-line ConditionalExpression,EqualityOperator: Fast-path - refinements array is never empty when not null
  const hasRefinements = refinements !== null && refinements.length > 0;
  // Stryker disable next-line ConditionalExpression,EqualityOperator: Fast-path - superRefines array is never empty when not null
  const hasSuperRefines = superRefines !== null && superRefines.length > 0;
  // Stryker disable next-line ConditionalExpression,EqualityOperator: Fast-path - transforms array is never empty when not null
  const hasTransforms = transforms !== null && transforms.length > 0;

  const getCatchData = (): Out =>
    typeof catchValue === "function"
      ? (catchValue as () => Out)()
      : (catchValue as Out);

  const runRefinements = (value: Out): ZodLikeIssue[] | null => {
    // Stryker disable next-line ConditionalExpression: Fast-path optimization - returns early when no refinements
    if (!hasRefinements && !hasSuperRefines) return null;

    const issues: ZodLikeIssue[] = [];

    // Stryker disable next-line LogicalOperator: Guard is redundant - hasRefinements implies refinements !== null
    if (hasRefinements && refinements) {
      for (let i = 0; i < refinements.length; i++) {
        const result = refinements[i](value);
        if (result !== true) {
          issues.push({ message: result, path: [] });
          return issues;
        }
      }
    }

    // Stryker disable next-line LogicalOperator: Guard is redundant - hasSuperRefines implies superRefines !== null
    if (hasSuperRefines && superRefines) {
      for (let i = 0; i < superRefines.length; i++) {
        superRefines[i](value, {
          addIssue(issue: ZodLikeIssue) {
            issues.push({
              code: "custom",
              path: Array.isArray(issue.path) ? issue.path : [],
              message: issue.message,
            });
          },
        });
        if (issues.length > 0) return issues;
      }
    }

    return null;
  };

  const runTransforms = (value: Out): Out | Issue => {
    // Stryker disable next-line LogicalOperator: Guard is redundant - hasTransforms implies transforms !== null
    if (!hasTransforms || !transforms) return value;

    let current: unknown = value;

    for (let i = 0; i < transforms.length; i++) {
      try {
        current = transforms[i](current);
      } catch (err) {
        return {
          message: err instanceof Error ? err.message : "Transform failed",
          path: [],
        };
      }
    }
    return current as Out;
  };

  const safeParseSync = (value: unknown): ZodResult<Out> => {
    const result = parse(schema as Schema<Out>, value);

    if (!result.success) {
      if (hasCatch) return { success: true, data: getCatchData() };
      return { success: false, error: createError(result.error) };
    }

    const data = result.data as Out;

    const refinedIssues = runRefinements(data);
    if (refinedIssues !== null) {
      if (hasCatch) return { success: true, data: getCatchData() };
      return { success: false, error: { issues: refinedIssues } };
    }

    const transformed = runTransforms(data);
    if (isIssue(transformed)) {
      if (hasCatch) return { success: true, data: getCatchData() };
      return { success: false, error: { issues: [transformed] } };
    }

    return { success: true, data: transformed as Out };
  };

  const adapter: Adapter<Out> = {
    parse(value: unknown): Out {
      const res = safeParseSync(value);
      if (res.success) return res.data;
      throw res.error;
    },

    safeParse(value: unknown): ZodResult<Out> {
      return safeParseSync(value);
    },

    async parseAsync(value: unknown): Promise<Out> {
      const res = safeParseSync(value);
      if (res.success) return res.data;
      throw res.error;
    },

    async safeParseAsync(value: unknown): Promise<ZodResult<Out>> {
      return safeParseSync(value);
    },

    optional(): Adapter<Out | undefined> {
      return createAdapter<Out | undefined>({
        ...state,
        schema: optional(schema as Schema<Out>) as Schema<unknown>,
        refinements: refinements as unknown as
          | RefinementFn<Out | undefined>[]
          | null,
        superRefines: superRefines as unknown as
          | SuperRefineFn<Out | undefined>[]
          | null,
        transforms: transforms as TransformFn[] | null,
      });
    },

    nullable(message?: string): Adapter<Out | null> {
      return createAdapter<Out | null>({
        ...state,
        schema: nullable(schema as Schema<Out>, message) as Schema<unknown>,
        refinements: refinements as unknown as
          | RefinementFn<Out | null>[]
          | null,
        superRefines: superRefines as unknown as
          | SuperRefineFn<Out | null>[]
          | null,
        transforms: transforms as TransformFn[] | null,
      });
    },

    nullish(): Adapter<Out | null | undefined> {
      return createAdapter<Out | null | undefined>({
        ...state,
        schema: nullish(schema as Schema<Out>) as Schema<unknown>,
        refinements: refinements as unknown as
          | RefinementFn<Out | null | undefined>[]
          | null,
        superRefines: superRefines as unknown as
          | SuperRefineFn<Out | null | undefined>[]
          | null,
        transforms: transforms as TransformFn[] | null,
      });
    },

    default(value: Out | (() => Out)): Adapter<Out> {
      return createAdapter<Out>({
        ...state,
        catchValue: value,
        hasCatch: true,
      });
    },

    catch(value: Out | (() => Out)): Adapter<Out> {
      return createAdapter({
        ...state,
        catchValue: value,
        hasCatch: true,
      });
    },

    refine(check: (value: Out) => boolean, message?: string): Adapter<Out> {
      const refinement: RefinementFn<Out> = (v) =>
        check(v) ? true : message || "Invalid value";
      return createAdapter({
        ...state,
        refinements: refinements ? [...refinements, refinement] : [refinement],
      });
    },

    superRefine(fn: SuperRefineFn<Out>): Adapter<Out> {
      return createAdapter({
        ...state,
        superRefines: superRefines ? [...superRefines, fn] : [fn],
      });
    },

    transform<NewOut>(fn: (value: Out) => NewOut): Adapter<NewOut> {
      return createAdapter({
        ...state,
        transforms: transforms
          ? [...transforms, fn as TransformFn]
          : [fn as TransformFn],
      }) as unknown as Adapter<NewOut>;
    },

    array(): Adapter<Out[]> {
      return createAdapter<Out[]>({
        schema: array(schema as Schema<Out>) as Schema<unknown>,
        refinements: null,
        superRefines: null,
        transforms: null,
        catchValue: undefined,
        hasCatch: false,
      });
    },

    or<U>(other: Adapter<U>): Adapter<Out | U> {
      return createAdapter<Out | U>({
        schema: unionOf(
          schema as Schema<Out>,
          other._schema()
        ) as Schema<unknown>,
        refinements: null,
        superRefines: null,
        transforms: null,
        catchValue: undefined,
        hasCatch: false,
      });
    },

    and<U>(other: Adapter<U>): Adapter<Out & U> {
      const currentSchema = schema;
      const otherSchema = other._schema() as AnySchema;

      // Stryker disable next-line ConditionalExpression,LogicalOperator,EqualityOperator,StringLiteral,BlockStatement: Flattening optimization - fallback intersection() produces identical behavior
      if (
        // Stryker disable next-line ConditionalExpression,LogicalOperator,EqualityOperator,StringLiteral: Type guard for intersection flattening - fallback handles all cases identically
        typeof currentSchema === "object" &&
        // Stryker disable next-line ConditionalExpression,LogicalOperator,EqualityOperator: Type guard for intersection flattening - fallback handles all cases identically
        currentSchema !== null &&
        // Stryker disable next-line ConditionalExpression,LogicalOperator,StringLiteral: Type guard for intersection flattening - fallback handles all cases identically
        "type" in currentSchema &&
        // Stryker disable next-line StringLiteral: Type guard for intersection flattening - fallback handles all cases identically
        currentSchema.type === "intersection"
      // Stryker disable next-line BlockStatement: Flattening optimization - fallback intersection() produces identical behavior
      ) /* Stryker disable next-line BlockStatement */ {
        // Flatten nested intersections for better performance
        const currentIntersection = currentSchema as Schema<unknown> & {
          schemas: readonly AnySchema[];
          message?: string;
        };
        const allSchemas = [
          ...currentIntersection.schemas,
          otherSchema,
        ] as readonly AnySchema[];

        const flatIntersection: Schema<Out & U> & {
          type: "intersection";
          schemas: readonly AnySchema[];
        } = {
          type: "intersection" as const,
          message: currentIntersection.message,
          schemas: allSchemas,
          validator: (value: unknown) => {
            for (let i = 0; i < allSchemas.length; i++) {
              const result = allSchemas[i].validator(value);
              if (result !== true && !isCoerced(result)) {
                return currentIntersection.message || (result as string);
              }
            }
            return true;
          },
        };

        return createAdapter<Out & U>({
          schema: flatIntersection as Schema<unknown>,
          refinements: null,
          superRefines: null,
          transforms: null,
          catchValue: undefined,
          hasCatch: false,
        });
      }

      // Normal case: create intersection with 2 schemas
      return createAdapter<Out & U>({
        schema: intersection(
          schema as Schema<Out>,
          other._schema()
        ) as Schema<unknown>,
        refinements: null,
        superRefines: null,
        transforms: null,
        catchValue: undefined,
        hasCatch: false,
      });
    },

    readonly(): Adapter<Out> {
      return createAdapter<Out>({
        ...state,
        schema: readonlyWrapper(schema as Schema<Out>) as Schema<unknown>,
        refinements: refinements as RefinementFn<Out>[] | null,
        superRefines: superRefines as SuperRefineFn<Out>[] | null,
      });
    },

    /** @internal - Used by shim for schema composition */
    _schema(): Schema<Out> {
      return schema as Schema<Out>;
    },
  };

  return adapter;
}
