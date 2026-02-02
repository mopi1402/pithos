import { asZod } from "./as-zod";
import {
  any as anySchema,
  array,
  bigint,
  boolean,
  coerceBigInt,
  coerceBoolean,
  coerceDate,
  coerceNumber,
  coerceString,
  date,
  discriminatedUnion as kanonDiscriminatedUnion,
  enum_ as enumSchema,
  int,
  lazy,
  intersection,
  literal,
  looseObject,
  map,
  nativeEnum,
  never,
  null_ as nullSchema,
  number,
  object,
  record,
  set,
  strictObject,
  string,
  symbol as symbolSchema,
  tuple,
  tupleWithRest,
  undefined_ as undefinedSchema,
  unknown,
  void_ as voidSchema,
  partial as kanonPartial,
  required as kanonRequired,
  pick as kanonPick,
  omit as kanonOmit,
  keyof as kanonKeyof,
} from "@kanon";
import type { Schema, GenericSchema, AnySchema } from "@kanon";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/core/consts/messages";

type AdapterOf<T> = ReturnType<typeof asZod<T>>;
// INTENTIONAL: Use 'any' to allow heterogeneous unions without TS conflicts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AdapterUnknown = AdapterOf<any>;
type InferAdapter<A> = A extends AdapterOf<infer U> ? U : never;
type ShapeAdapters<T extends Record<string, unknown>> = {
  [K in keyof T]: AdapterOf<T[K]>;
};
/**
 * Extracts the inferred TypeScript type from a Kanon adapter.
 *
 * @template A - The adapter type to extract from
 * @since 3.0.0
 */
export type Infer<A> = A extends AdapterOf<infer U> ? U : never;

// Helper types for tuple inference
type InferTupleItems<T extends readonly AdapterUnknown[]> = {
  readonly [K in keyof T]: T[K] extends AdapterOf<infer U> ? U : never;
};

type InferTupleWithRest<
  T extends readonly AdapterUnknown[],
  R extends AdapterUnknown
> = R extends AdapterOf<infer RestType>
  ? [
      ...{
        readonly [K in keyof T]: T[K] extends AdapterOf<infer U> ? U : never;
      } & { readonly length: T["length"] },
      ...RestType[]
    ]
  : {
      readonly [K in keyof T]: T[K] extends AdapterOf<infer U> ? U : never;
    } & { readonly length: T["length"] };

// Object methods type for z.object() return
// INTENTIONAL: Use simplified types for object methods to avoid complex generic constraints
type Mask<T> = { [K in keyof T]?: true };

type ObjectMethods<T> = {
  strict: () => ObjectAdapter<T>;
  passthrough: () => ObjectAdapter<T>;
  partial: () => ObjectAdapter<Partial<T>>;
  required: () => ObjectAdapter<Required<T>>;
  pick: <M extends Mask<T>>(mask: M) => ObjectAdapter<Pick<T, Extract<keyof T, keyof M>>>;
  omit: <M extends Mask<T>>(mask: M) => ObjectAdapter<Omit<T, Extract<keyof T, keyof M>>>;
  keyof: () => AdapterOf<keyof T & string>;
};

type ObjectAdapter<T> = AdapterOf<T> & ObjectMethods<T>;

type ZShim = {
  // Primitives
  any: () => AdapterOf<unknown>;
  unknown: () => AdapterOf<unknown>;
  never: () => AdapterOf<never>;
  void: () => AdapterOf<void>;
  undefined: () => AdapterOf<undefined>;
  null: () => AdapterOf<null>;
  string: () => AdapterOf<string>;
  number: () => AdapterOf<number> & { int: () => AdapterOf<number> };
  boolean: () => AdapterOf<boolean>;
  bigint: () => AdapterOf<bigint>;
  symbol: () => AdapterOf<symbol>;
  date: () => AdapterOf<Date>;

  // Literals
  literal: <T extends string | number | boolean>(v: T) => AdapterOf<T>;

  // Enums
  enum: (vals: readonly string[]) => AdapterOf<string>;
  nativeEnum: <E extends Record<string, string | number>>(
    e: E
  ) => AdapterOf<E[keyof E]>;

  // Objects
  object: <T extends Record<string, unknown>>(
    shape: ShapeAdapters<T>
  ) => ObjectAdapter<T>;
  record: <K, V>(
    key: AdapterOf<K>,
    value: AdapterOf<V>
  ) => AdapterOf<Record<string, V>>;

  // Arrays / tuples / collections
  array: <T>(schema: AdapterOf<T>) => AdapterOf<T[]>;
  tuple: <T extends readonly AdapterUnknown[]>(
    items: T
  ) => AdapterOf<InferTupleItems<T>> & {
    rest: <R extends AdapterUnknown>(
      rest: R
    ) => AdapterOf<InferTupleWithRest<T, R>>;
  };
  map: <K, V>(key: AdapterOf<K>, value: AdapterOf<V>) => AdapterOf<Map<K, V>>;
  set: <T>(value: AdapterOf<T>) => AdapterOf<Set<T>>;

  // Unions / intersections
  union: (schemas: AdapterUnknown[]) => AdapterOf<unknown>;
  discriminatedUnion: <D extends string>(
    discriminator: D,
    schemas: AdapterUnknown[]
  ) => AdapterOf<unknown>;
  intersection: <A extends AdapterUnknown, B extends AdapterUnknown>(
    a: A,
    b: B
  ) => AdapterOf<InferAdapter<A> & InferAdapter<B>>;

  // Modifiers (via lazy for Zod compatibility)
  lazy: <T>(getSchema: () => AdapterOf<T>) => AdapterOf<T>;

  // Promise
  promise: <T>(schema: AdapterOf<T>) => AdapterOf<Awaited<T>>;

  // Coercion
  coerce: {
    string: () => AdapterOf<string>;
    number: () => AdapterOf<number>;
    boolean: () => AdapterOf<boolean>;
    bigint: () => AdapterOf<bigint>;
    date: () => AdapterOf<Date>;
  };
};

/**
 * Zod-compatible API shim for Kanon V3.
 *
 * Provides a drop-in replacement for Zod's `z` object using Kanon schemas.
 *
 * @since 3.0.0
 */
export const z: ZShim = {
  any: () => asZod(anySchema()),
  unknown: () => asZod(unknown()),
  never: () => asZod(never()),
  void: () => asZod(voidSchema()),
  undefined: () => asZod(undefinedSchema()),
  null: () => asZod(nullSchema()),
  string: () => asZod(string()),
  number: (): AdapterOf<number> & { int: () => AdapterOf<number> } => {
    const addInt = (
      schema: Schema<number>
    ): AdapterOf<number> & { int: () => AdapterOf<number> } => {
      const base = asZod(schema);
      return Object.assign(base, {
        int(): AdapterOf<number> & { int: () => AdapterOf<number> } {
          return addInt(int() as Schema<number>);
        },
      });
    };
    return addInt(number() as Schema<number>);
  },
  boolean: () => asZod(boolean()),
  bigint: () => asZod(bigint()),
  symbol: () => asZod(symbolSchema()),
  date: () => asZod(date()),

  literal: <T extends string | number | boolean>(v: T) =>
    asZod(literal(v)),

  enum: (vals: readonly string[]) =>
    asZod(enumSchema(vals as readonly [string, ...string[]])),
  nativeEnum: <E extends Record<string, string | number>>(e: E) =>
    asZod(nativeEnum(e)),

  object: <T extends Record<string, unknown>>(
    shape: ShapeAdapters<T>
  ): ObjectAdapter<T> => {
    const entries: Record<string, Schema<unknown>> = {};
    for (const key in shape) {
      entries[key] = shape[key]._schema() as Schema<unknown>;
    }
    
    // Helper to create object adapter with all methods
    const createObjectAdapter = <U>(
      schema: Schema<unknown>,
      currentEntries: Record<string, Schema<unknown>>
    ): ObjectAdapter<U> => {
      const base = asZod(schema) as AdapterOf<U>;
      const schemaWithEntries = { ...schema, entries: currentEntries };
      
      return Object.assign(base, {
        strict: () => createObjectAdapter<U>(strictObject(currentEntries) as Schema<unknown>, currentEntries),
        passthrough: () => createObjectAdapter<U>(looseObject(currentEntries) as Schema<unknown>, currentEntries),
        partial: () => createObjectAdapter<Partial<U>>(kanonPartial(schemaWithEntries) as Schema<unknown>, currentEntries),
        required: () => createObjectAdapter<Required<U>>(kanonRequired(schemaWithEntries) as Schema<unknown>, currentEntries),
        pick: <M extends Mask<U>>(mask: M) => {
          const keys = Object.keys(mask) as (keyof U & string)[];
          const pickedEntries: Record<string, Schema<unknown>> = {};
          for (const key of keys) {
            if (key in currentEntries) {
              pickedEntries[key] = currentEntries[key];
            }
          }
          return createObjectAdapter<Pick<U, Extract<keyof U, keyof M>>>(kanonPick(schemaWithEntries, keys) as Schema<unknown>, pickedEntries);
        },
        omit: <M extends Mask<U>>(mask: M) => {
          const keys = Object.keys(mask) as (keyof U & string)[];
          const omittedEntries: Record<string, Schema<unknown>> = {};
          for (const key in currentEntries) {
            if (!keys.includes(key as keyof U & string)) {
              omittedEntries[key] = currentEntries[key];
            }
          }
          return createObjectAdapter<Omit<U, Extract<keyof U, keyof M>>>(kanonOmit(schemaWithEntries, keys) as Schema<unknown>, omittedEntries);
        },
        keyof: () => asZod(kanonKeyof(schemaWithEntries)) as unknown as AdapterOf<keyof U & string>,
      }) as ObjectAdapter<U>;
    };
    
    return createObjectAdapter<T>(object(entries) as Schema<unknown>, entries);
  },
  record: <K, V>(key: AdapterOf<K>, value: AdapterOf<V>) =>
    asZod(record(key._schema(), value._schema())) as AdapterOf<
      Record<string, V>
    >,

  array: <T>(schema: AdapterOf<T>) =>
    asZod(array(schema._schema())) as AdapterOf<T[]>,

  tuple: <T extends readonly AdapterUnknown[]>(
    items: T
  ): AdapterOf<InferTupleItems<T>> & {
    rest: <R extends AdapterUnknown>(
      rest: R
    ) => AdapterOf<InferTupleWithRest<T, R>>;
  } => {
    const schemas = (items as readonly AdapterUnknown[]).map((i) =>
      i._schema()
    ) as readonly GenericSchema[];
    const makeTuple = <
      Fixed extends readonly AdapterUnknown[],
      Rest extends AdapterUnknown | undefined = undefined
    >(
      fixed: Fixed,
      restSchema?: GenericSchema
    ): AdapterOf<
      Rest extends AdapterUnknown
        ? InferTupleWithRest<Fixed, Rest>
        : InferTupleItems<Fixed>
    > & {
      rest: <R extends AdapterUnknown>(
        rest: R
      ) => AdapterOf<InferTupleWithRest<Fixed, R>>;
    } => {
      const base = (
        restSchema
          ? asZod(tupleWithRest(schemas, restSchema))
          : asZod(tuple(schemas))
      ) as unknown as AdapterOf<
        Rest extends AdapterUnknown
          ? InferTupleWithRest<Fixed, Rest>
          : InferTupleItems<Fixed>
      >;
      return Object.assign(base, {
        rest<R extends AdapterUnknown>(
          next: R
        ): AdapterOf<InferTupleWithRest<Fixed, R>> & {
          rest: <R2 extends AdapterUnknown>(
            rest: R2
          ) => AdapterOf<InferTupleWithRest<Fixed, R2>>;
        } {
          return makeTuple(fixed, next._schema() as GenericSchema) as unknown as AdapterOf<
            InferTupleWithRest<Fixed, R>
          > & {
            rest: <R2 extends AdapterUnknown>(
              rest: R2
            ) => AdapterOf<InferTupleWithRest<Fixed, R2>>;
          };
        },
      });
    };
    return makeTuple(items) as unknown as AdapterOf<InferTupleItems<T>> & {
      rest: <R extends AdapterUnknown>(
        rest: R
      ) => AdapterOf<InferTupleWithRest<T, R>>;
    };
  },

  map: <K, V>(key: AdapterOf<K>, value: AdapterOf<V>) =>
    asZod(map(key._schema(), value._schema())) as AdapterOf<Map<K, V>>,
  set: <T>(value: AdapterOf<T>) =>
    asZod(set(value._schema())) as AdapterOf<Set<T>>,

  union(schemas: AdapterUnknown[]) {
    // Match Zod behavior: requires array with at least 2 elements
    if (!Array.isArray(schemas) || schemas.length < 2) {
      throw new Error("z.union requires an array of at least 2 schemas");
    }

    // Create a flat union schema with all schemas
    // INTENTIONAL: Dynamic schema creation - we use Schema<unknown> with union type property
    const allSchemas = schemas.map((s) => s._schema()) as readonly AnySchema[];
    const flatUnion: Schema<unknown> & { type: "union"; schemas: readonly AnySchema[] } = {
      type: "union" as const,
      message: undefined,
      schemas: allSchemas,
      validator: (value: unknown) => {
        for (let i = 0; i < allSchemas.length; i++) {
          const result = allSchemas[i].validator(value);
          if (result === true) {
            return true;
          }
        }
        return ERROR_MESSAGES_COMPOSITION.union;
      },
    };

    return asZod(flatUnion as Schema<unknown>);
  },

  discriminatedUnion: <D extends string>(
    discriminator: D,
    schemas: AdapterUnknown[]
  ) => {
    const rawSchemas = schemas.map((s) => s._schema()) as GenericSchema[];
    return asZod(kanonDiscriminatedUnion(discriminator, rawSchemas));
  },

  intersection: <A extends AdapterUnknown, B extends AdapterUnknown>(
    a: A,
    b: B
  ) =>
    asZod(intersection(a._schema(), b._schema())) as AdapterOf<
      InferAdapter<A> & InferAdapter<B>
    >,

  lazy: <T>(getSchema: () => AdapterOf<T>) =>
    asZod(lazy(() => getSchema()._schema())),

  // z.promise() is not fully supported - Kanon doesn't have a native promise schema
  // This is a simplified implementation that validates the resolved value
  promise: <T>(schema: AdapterOf<T>): AdapterOf<Awaited<T>> => {
    const innerSchema = schema._schema();
    // Create a wrapper that validates the resolved promise value
    const promiseAdapter = asZod(innerSchema);
    // Override parseAsync to handle promise resolution
    const originalParseAsync = promiseAdapter.parseAsync.bind(promiseAdapter);
    const originalSafeParseAsync = promiseAdapter.safeParseAsync.bind(promiseAdapter);
    
    return Object.assign(promiseAdapter, {
      async parseAsync(value: unknown) {
        const resolved = value instanceof Promise ? await value : value;
        return originalParseAsync(resolved);
      },
      async safeParseAsync(value: unknown) {
        const resolved = value instanceof Promise ? await value : value;
        return originalSafeParseAsync(resolved);
      },
    }) as unknown as AdapterOf<Awaited<T>>;
  },

  coerce: {
    string: () => asZod(coerceString()),
    number: () => asZod(coerceNumber()),
    boolean: () => asZod(coerceBoolean()),
    bigint: () => asZod(coerceBigInt()),
    date: () => asZod(coerceDate()),
  },
};

// Minimal type namespace to mirror Zod's value/type merge for tests
// INTENTIONAL: merge namespace with value export for type helpers
// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-redeclare
export namespace z {
  export type ZodTypeAny = AdapterUnknown;
  export type ZodType<T = unknown> = AdapterOf<T>;
  export type ZodLiteral<T> = AdapterOf<T>;
  export type ZodUnion<
    T extends [AdapterUnknown, AdapterUnknown, ...AdapterUnknown[]]
  > = AdapterOf<unknown> & { rest?: never; _input?: T };
  export type ZodTuple<
    T extends [AdapterUnknown, ...AdapterUnknown[]],
    Rest extends AdapterUnknown = AdapterUnknown
  > =
    | AdapterOf<unknown>
    | (AdapterOf<unknown> & {
        rest: (rest: AdapterUnknown) => AdapterOf<unknown>;
        _items?: T;
        _rest?: Rest;
      });
  export type ZodNumber =
    | AdapterOf<number>
    | (AdapterOf<number> & {
        int: () => AdapterOf<number>;
      });
  export type ZodRawShape = Record<string, AdapterUnknown>;
}
