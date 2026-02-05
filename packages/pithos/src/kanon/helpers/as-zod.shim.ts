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

/**
 * Shorthand for the return type of `asZod` with a given type.
 *
 * @template T - The schema output type.
 * @public
 * @since 3.0.0
 */
export type AdapterOf<T> = ReturnType<typeof asZod<T>>;

/**
 * Adapter accepting any value, used for heterogeneous collections.
 *
 * @since 3.0.0
 */
// INTENTIONAL: Use 'any' to allow heterogeneous unions without TS conflicts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AdapterUnknown = AdapterOf<any>;

/**
 * Extracts the output type from an adapter.
 *
 * @template A - The adapter to infer from.
 * @since 3.0.0
 */
type InferAdapter<A> = A extends AdapterOf<infer U> ? U : never;

/**
 * Maps each property of a record to its corresponding adapter.
 *
 * @template T - The record shape.
 * @since 3.0.0
 */
type ShapeAdapters<T extends Record<string, unknown>> = {
  [K in keyof T]: AdapterOf<T[K]>;
};
/**
 * Extracts the inferred TypeScript type from a Kanon adapter.
 *
 * @template A - The adapter type to extract from.
 * @since 3.0.0
 */
export type Infer<A> = A extends AdapterOf<infer U> ? U : never;

/**
 * Infers a tuple of output types from a tuple of adapters.
 *
 * @template T - Readonly tuple of adapters.
 * @since 3.0.0
 */
type InferTupleItems<T extends readonly AdapterUnknown[]> = {
  readonly [K in keyof T]: T[K] extends AdapterOf<infer U> ? U : never;
};

/**
 * Infers a tuple type with a rest element from adapters.
 *
 * @template T - Readonly tuple of fixed-position adapters.
 * @template R - Adapter for the rest element.
 * @since 3.0.0
 */
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

/**
 * Boolean mask selecting keys of a record.
 *
 * @template T - The record type to mask.
 * @since 3.0.0
 */
type Mask<T> = { [K in keyof T]?: true };

/**
 * Chainable object transform methods returned by `z.object()`.
 *
 * @template T - The inferred object shape.
 * @since 3.0.0
 */
type ObjectMethods<T> = {
  /** Returns a strict variant that rejects unknown keys. */
  strict: () => ObjectAdapter<T>;
  /** Returns a loose variant that allows unknown keys. */
  passthrough: () => ObjectAdapter<T>;
  /** Makes all properties optional. */
  partial: () => ObjectAdapter<Partial<T>>;
  /** Makes all properties required. */
  required: () => ObjectAdapter<Required<T>>;
  /** Picks a subset of properties by mask. */
  pick: <M extends Mask<T>>(mask: M) => ObjectAdapter<Pick<T, Extract<keyof T, keyof M>>>;
  /** Omits a subset of properties by mask. */
  omit: <M extends Mask<T>>(mask: M) => ObjectAdapter<Omit<T, Extract<keyof T, keyof M>>>;
  /** Returns an adapter for the string keys of the object. */
  keyof: () => AdapterOf<keyof T & string>;
};

/**
 * Adapter for object schemas, combining parsing and transform methods.
 *
 * @template T - The inferred object shape.
 * @since 3.0.0
 */
type ObjectAdapter<T> = AdapterOf<T> & ObjectMethods<T>;

/**
 * Shape of the Zod-compatible `z` shim object.
 *
 * Defines all factory methods for creating adapted Kanon schemas
 * through a Zod-like API.
 *
 * @public
 * @since 3.0.0
 */
export type ZShim = {
  /** Creates an adapter accepting any value. */
  any: () => AdapterOf<unknown>;
  /** Creates an adapter accepting any value (typed as `unknown`). */
  unknown: () => AdapterOf<unknown>;
  /** Creates an adapter that never succeeds. */
  never: () => AdapterOf<never>;
  /** Creates an adapter accepting `void`. */
  void: () => AdapterOf<void>;
  /** Creates an adapter accepting `undefined`. */
  undefined: () => AdapterOf<undefined>;
  /** Creates an adapter accepting `null`. */
  null: () => AdapterOf<null>;
  /** Creates a string adapter. */
  string: () => AdapterOf<string>;
  /** Creates a number adapter with optional `.int()` refinement. */
  number: () => AdapterOf<number> & { int: () => AdapterOf<number> };
  /** Creates a boolean adapter. */
  boolean: () => AdapterOf<boolean>;
  /** Creates a bigint adapter. */
  bigint: () => AdapterOf<bigint>;
  /** Creates a symbol adapter. */
  symbol: () => AdapterOf<symbol>;
  /** Creates a Date adapter. */
  date: () => AdapterOf<Date>;

  /** Creates a literal adapter for a specific value. */
  literal: <T extends string | number | boolean>(v: T) => AdapterOf<T>;

  /** Creates a string enum adapter from a readonly tuple. */
  enum: (vals: readonly string[]) => AdapterOf<string>;
  /** Creates an adapter from a TypeScript native enum. */
  nativeEnum: <E extends Record<string, string | number>>(
    e: E
  ) => AdapterOf<E[keyof E]>;

  /** Creates an object adapter with transform methods. */
  object: <T extends Record<string, unknown>>(
    shape: ShapeAdapters<T>
  ) => ObjectAdapter<T>;
  /** Creates a record adapter with key and value schemas. */
  record: <K, V>(
    key: AdapterOf<K>,
    value: AdapterOf<V>
  ) => AdapterOf<Record<string, V>>;

  /** Creates an array adapter from an element adapter. */
  array: <T>(schema: AdapterOf<T>) => AdapterOf<T[]>;
  /** Creates a tuple adapter with optional rest element. */
  tuple: <T extends readonly AdapterUnknown[]>(
    items: T
  ) => AdapterOf<InferTupleItems<T>> & {
    rest: <R extends AdapterUnknown>(
      rest: R
    ) => AdapterOf<InferTupleWithRest<T, R>>;
  };
  /** Creates a `Map` adapter from key and value adapters. */
  map: <K, V>(key: AdapterOf<K>, value: AdapterOf<V>) => AdapterOf<Map<K, V>>;
  /** Creates a `Set` adapter from a value adapter. */
  set: <T>(value: AdapterOf<T>) => AdapterOf<Set<T>>;

  /** Creates a union adapter from an array of adapters. */
  union: (schemas: AdapterUnknown[]) => AdapterOf<unknown>;
  /** Creates a discriminated union adapter. */
  discriminatedUnion: <D extends string>(
    discriminator: D,
    schemas: AdapterUnknown[]
  ) => AdapterOf<unknown>;
  /** Creates an intersection adapter from two adapters. */
  intersection: <A extends AdapterUnknown, B extends AdapterUnknown>(
    a: A,
    b: B
  ) => AdapterOf<InferAdapter<A> & InferAdapter<B>>;

  /** Creates a lazy adapter for recursive schemas. */
  lazy: <T>(getSchema: () => AdapterOf<T>) => AdapterOf<T>;

  /** Creates a promise adapter that validates the resolved value. */
  promise: <T>(schema: AdapterOf<T>) => AdapterOf<Awaited<T>>;

  /** Namespace for coercion adapters that convert input before validating. */
  coerce: {
    /** Coerces input to string before validating. */
    string: () => AdapterOf<string>;
    /** Coerces input to number before validating. */
    number: () => AdapterOf<number>;
    /** Coerces input to boolean before validating. */
    boolean: () => AdapterOf<boolean>;
    /** Coerces input to bigint before validating. */
    bigint: () => AdapterOf<bigint>;
    /** Coerces input to Date before validating. */
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

/**
 * Type namespace mirroring Zod's value/type merge for type helpers.
 *
 * @since 3.0.0
 */
// INTENTIONAL: merge namespace with value export for type helpers
// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-redeclare
export namespace z {
  /**
   * Any adapter type, equivalent to Zod's `ZodTypeAny`.
   *
   * @since 3.0.0
   */
  export type ZodTypeAny = AdapterUnknown;

  /**
   * Typed adapter, equivalent to Zod's `ZodType`.
   *
   * @template T - The output type.
   * @since 3.0.0
   */
  export type ZodType<T = unknown> = AdapterOf<T>;

  /**
   * Literal adapter type, equivalent to Zod's `ZodLiteral`.
   *
   * @template T - The literal value type.
   * @since 3.0.0
   */
  export type ZodLiteral<T> = AdapterOf<T>;

  /**
   * Union adapter type, equivalent to Zod's `ZodUnion`.
   *
   * @template T - Tuple of at least two adapters.
   * @since 3.0.0
   */
  export type ZodUnion<
    T extends [AdapterUnknown, AdapterUnknown, ...AdapterUnknown[]]
  > = AdapterOf<unknown> & { rest?: never; _input?: T };

  /**
   * Tuple adapter type, equivalent to Zod's `ZodTuple`.
   *
   * @template T - Tuple of fixed-position adapters.
   * @template Rest - Optional rest element adapter.
   * @since 3.0.0
   */
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

  /**
   * Number adapter type with optional `.int()`, equivalent to Zod's `ZodNumber`.
   *
   * @since 3.0.0
   */
  export type ZodNumber =
    | AdapterOf<number>
    | (AdapterOf<number> & {
        int: () => AdapterOf<number>;
      });

  /**
   * Record shape where each value is an adapter, equivalent to Zod's `ZodRawShape`.
   *
   * @since 3.0.0
   */
  export type ZodRawShape = Record<string, AdapterUnknown>;
}
