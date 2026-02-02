/**
 * Union of all schema type literals.
 *
 * @since 3.0.0
 */
export type SchemaType =
  | SchemaCompositeType
  | SchemaOperatorType
  | SchemaPrimitiveType
  | SchemaTransformType
  | SchemaWrapperType;

/**
 * Primitive schema type literals.
 *
 * @since 3.0.0
 */
export type SchemaPrimitiveType =
  | "any"
  | "bigint"
  | "boolean"
  | "date"
  | "enum"
  | "int"
  | "literal"
  | "nativeEnum"
  | "never"
  | "null"
  | "number"
  | "string"
  | "symbol"
  | "undefined"
  | "unknown"
  | "void";

/**
 * Composite schema type literals.
 *
 * @since 3.0.0
 */
export type SchemaCompositeType =
  | "array"
  | "map"
  | "object"
  | "record"
  | "set"
  | "tuple";

/**
 * Operator schema type literals.
 *
 * @since 3.0.0
 */
export type SchemaOperatorType = "union" | "intersection";

/**
 * Transform schema type literals.
 *
 * @since 3.0.0
 */
export type SchemaTransformType =
  | "keyof"
  | "partial"
  | "required"
  | "pick"
  | "omit";

/**
 * Wrapper schema type literals.
 *
 * @since 3.0.0
 */
export type SchemaWrapperType = "default" | "lazy" | "nullable" | "nullish" | "optional" | "readonly";

/**
 * Base interface for all Kanon schemas.
 *
 * @template T - The type that this schema validates
 * @since 3.0.0
 */
export interface Schema<T = unknown> {
  type: SchemaType;
  message?: string;
  refinements?: Array<(value: T) => true | string>;
  validator: (value: unknown) => ValidatorResult<T>;
}

/**
 * Result type for coerced values.
 * Used by coerce schemas to return the transformed value.
 * @since 3.0.0
 */
export type CoercedResult<T> = { coerced: T };

/**
 * Validator return type.
 * - `true` for valid values (no transformation)
 * - `string` for validation errors
 * - `CoercedResult<T>` for coerced values
 * @since 3.0.0
 */
export type ValidatorResult<T> = true | string | CoercedResult<T>;

/**
 * Check if a validator result is a coerced value (success case).
 *
 * @param result - The validator result to check
 * @returns True if the result contains a coerced value
 * @since 3.2.0
 */
export function isCoerced<T>(
  result: ValidatorResult<T>
): result is CoercedResult<T> {
  return typeof result === "object" && result !== null && "coerced" in result;
}

// INTENTIONAL: Uses Schema<any> to work around TypeScript variance issues.
// Schema<T> is not assignable to Schema<unknown> due to contravariant refinements,
// but Schema<any> accepts all schema types.
/**
 * Generic schema type that accepts any schema regardless of its specific type.
 * Use this for constraints where you need to accept any schema.
 *
 * @since 3.0.0
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GenericSchema = Schema<any> & { type: SchemaType };

/**
 * Extracts the inferred TypeScript type from a Kanon schema.
 *
 * @template S - The schema type to extract from
 * @since 3.0.0
 * @example
 * ```typescript
 * const userSchema = object({ name: string(), age: number() });
 * type User = Infer<typeof userSchema>;
 * // ^? { name: string; age: number }
 * ```
 */
export type Infer<S> = S extends Schema<infer T> ? T : never;