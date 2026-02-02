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
import { isCoerced } from "@kanon/v3/types/base";

type Issue = { message: string; path: (string | number)[] };
type ZodLikeIssue = Issue & { code?: string };

type ZodResult<T> =
  | { success: true; data: T }
  | { success: false; error: { issues: ZodLikeIssue[] } };

type RefinementFn<T> = (value: T) => true | string;
type SuperRefineFn<T> = (
  value: T,
  ctx: { addIssue: (issue: ZodLikeIssue) => void }
) => void;
type TransformFn = (value: unknown) => unknown;

const createError = (message: string): { issues: ZodLikeIssue[] } => ({
  issues: [{ message, path: [] }],
});

const isIssue = (v: unknown): v is Issue =>
  typeof v === "object" &&
  v !== null &&
  "message" in v &&
  "path" in v &&
  Array.isArray((v as Issue).path);

/**
 * Opt-in Zod v4-style facade around a Kanon schema.
 * Does not mutate the original schema; tree-shakable and minimal.
 *
 * @since 3.1.0
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

type AdapterState<Out> = {
  schema: Schema<unknown>;
  refinements: RefinementFn<Out>[] | null;
  superRefines: SuperRefineFn<Out>[] | null;
  transforms: TransformFn[] | null;
  catchValue: (() => Out) | Out | undefined;
  hasCatch: boolean;
};

type Adapter<T> = {
  // Parsing (Zod v4 compatible)
  parse(value: unknown): T;
  safeParse(value: unknown): ZodResult<T>;
  parseAsync(value: unknown): Promise<T>;
  safeParseAsync(value: unknown): Promise<ZodResult<T>>;

  // Wrappers (Zod v4 compatible)
  optional(): Adapter<T | undefined>;
  nullable(message?: string): Adapter<T | null>;
  nullish(): Adapter<T | null | undefined>;
  default(value: T | (() => T)): Adapter<T>;
  catch(value: T | (() => T)): Adapter<T>;
  array(): Adapter<T[]>;
  readonly(): Adapter<T>;

  // Refinements (Zod v4 compatible)
  refine(check: (value: T) => boolean, message?: string): Adapter<T>;
  superRefine(fn: SuperRefineFn<T>): Adapter<T>;
  transform<NewOut>(fn: (value: T) => NewOut): Adapter<NewOut>;

  // Operators (Zod v4 compatible)
  or<U>(other: Adapter<U>): Adapter<T | U>;
  and<U>(other: Adapter<U>): Adapter<T & U>;

  /** @internal - Used by shim for schema composition */
  _schema(): Schema<T>;
};

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

      // Stryker disable next-line ConditionalExpression,LogicalOperator,EqualityOperator,StringLiteral,BlockStatement: Type guards are redundant - schemas are always objects with 'type' property, only type === "intersection" matters
      if (
        typeof currentSchema === "object" &&
        currentSchema !== null &&
        "type" in currentSchema &&
        currentSchema.type === "intersection"
      ) {
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
