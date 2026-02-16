/**
 * Type guards and schema type discrimination utilities for Kanon V3.
 *
 * @since 2.0.0
 */

import type { SchemaType, GenericSchema } from "./base";
import type {
  StringConstraint,
  NumberConstraint,
  ArrayConstraint,
  ObjectConstraint,
  DateConstraint,
  BigIntConstraint,
  SetConstraint,
  MapConstraint,
} from "./constraints";
import type {
  StringSchema,
  NumberSchema,
  BooleanSchema,
  DateSchema,
  BigIntSchema,
  UnknownSchema,
  NullSchema,
  UndefinedSchema,
  VoidSchema,
  NeverSchema,
  SymbolSchema,
  IntSchema,
  EnumSchema,
  LiteralSchema,
  NativeEnumSchema,
  AnySchema,
} from "./primitives";
import type {
  ObjectSchema,
  ArraySchema,
  TupleSchema,
  RecordSchema,
  MapSchema,
  SetSchema,
} from "./composites";
import type { UnionSchema, IntersectionSchema } from "./operators";
import type {
  KeyofSchema,
  PartialSchema,
  RequiredSchema,
  PickSchema,
  OmitSchema,
} from "./transforms";
import type {
  NullableSchema,
  NullishSchema,
  OptionalSchema,
  DefaultSchema,
  ReadonlySchema,
  LazySchema,
} from "./wrappers";

/**
 * Lookup table mapping SchemaType literals to their corresponding schema types.
 * @internal
 */
type SchemaTypeMap = {
  string: StringSchema;
  number: NumberSchema;
  boolean: BooleanSchema;
  date: DateSchema;
  bigint: BigIntSchema;
  symbol: SymbolSchema;
  int: IntSchema;
  enum: EnumSchema<string | number | boolean>;
  literal: LiteralSchema<string | number | boolean>;
  nativeEnum: NativeEnumSchema<string | number>;
  any: AnySchema;
  unknown: UnknownSchema;
  never: NeverSchema;
  null: NullSchema;
  undefined: UndefinedSchema;
  void: VoidSchema;
  array: ArraySchema;
  object: ObjectSchema;
  tuple: TupleSchema;
  record: RecordSchema<GenericSchema, GenericSchema>;
  map: MapSchema;
  set: SetSchema;
  union: UnionSchema<readonly GenericSchema[]>;
  intersection: IntersectionSchema<readonly GenericSchema[]>;
  keyof: KeyofSchema<GenericSchema>;
  partial: PartialSchema<GenericSchema>;
  required: RequiredSchema<GenericSchema>;
  pick: PickSchema<GenericSchema, string>;
  omit: OmitSchema<GenericSchema, string>;
  nullable: NullableSchema<GenericSchema>;
  nullish: NullishSchema<GenericSchema>;
  optional: OptionalSchema<GenericSchema>;
  default: DefaultSchema<GenericSchema>;
  readonly: ReadonlySchema<GenericSchema>;
  lazy: LazySchema<unknown>;
};

/**
 * Maps a SchemaType to its corresponding schema type.
 *
 * @template T - The schema type literal
 * @since 2.0.0
 */
export type SchemaOfType<T extends SchemaType> = SchemaTypeMap[T];

/**
 * Type guard to check if a schema matches a specific schema type.
 *
 * @param schema - The schema to check
 * @param type - The schema type to check against
 * @returns True if the schema matches the specified type
 * @since 2.0.0
 * @example
 * ```typescript
 * const schema: GenericSchema = string();
 * if (isSchemaType(schema, "string")) {
 *   // schema is narrowed to StringSchema (base type, without constraint methods)
 *   console.log(schema.type); // "string"
 * }
 * ```
 */
export function isSchemaType<T extends SchemaType>(
  schema: GenericSchema,
  type: T
  // INTENTIONAL: Type assertion needed due to TypeScript variance.
  // NeverSchema and other specific schemas are not assignable to GenericSchema
  // due to contravariant refinements, but at runtime all schemas have compatible structure.
  // The runtime check ensures type safety.
): schema is SchemaOfType<T> & GenericSchema {
  return schema.type === type;
}

/**
 * Grouped type guards for common schema types.
 * Provides convenient type narrowing for frequently used schemas.
 *
 * @since 2.0.0
 * @example
 * ```typescript
 * const schema: GenericSchema = string();
 * if (schemaGuards.isString(schema)) {
 *   // schema is narrowed to StringSchema (base type, without constraint methods)
 *   console.log(schema.type); // "string"
 * }
 * ```
 */
const guard =
  <T extends SchemaType>(type: T) =>
  (s: GenericSchema): s is SchemaOfType<T> & GenericSchema =>
    s.type === type;

/**
 * Collection of type guards for all schema types.
 *
 * @since 2.0.0
 */
export const schemaGuards = {
  isString: guard("string"),
  isNumber: guard("number"),
  isBoolean: guard("boolean"),
  isDate: guard("date"),
  isBigInt: guard("bigint"),
  isSymbol: guard("symbol"),
  isInt: guard("int"),
  isEnum: guard("enum"),
  isLiteral: guard("literal"),
  isNativeEnum: guard("nativeEnum"),
  isAny: guard("any"),
  isUnknown: guard("unknown"),
  isNever: guard("never"),
  isNull: guard("null"),
  isUndefined: guard("undefined"),
  isVoid: guard("void"),
  isArray: guard("array"),
  isObject: guard("object"),
  isTuple: guard("tuple"),
  isRecord: guard("record"),
  isMap: guard("map"),
  isSet: guard("set"),
  isUnion: guard("union"),
  isIntersection: guard("intersection"),
  isKeyof: guard("keyof"),
  isPartial: guard("partial"),
  isRequired: guard("required"),
  isPick: guard("pick"),
  isOmit: guard("omit"),
  isNullable: guard("nullable"),
  isNullish: guard("nullish"),
  isOptional: guard("optional"),
  isDefault: guard("default"),
  isReadonly: guard("readonly"),
  isLazy: guard("lazy"),
} as const;

// ============================================================================
// Constraint Type Guards
// ============================================================================

/**
 * Type guard for StringConstraint.
 * Checks that the schema is a string type and has constraint methods.
 *
 * @param schema - The schema to check
 * @returns True if the schema is a StringConstraint with constraint methods
 * @since 2.0.0
 * @example
 * ```typescript
 * const schema = string().minLength(5);
 * if (isStringConstraint(schema)) {
 *   // schema is narrowed to StringConstraint
 *   schema.maxLength(10); // constraint methods available
 * }
 * ```
 */
export function isStringConstraint(
  schema: GenericSchema
): schema is StringConstraint {
  return (
    schema.type === "string" &&
    // Stryker disable next-line ConditionalExpression: defensive guard - Kanon schema factories always return Constraints with methods
    typeof (schema as StringConstraint).minLength === "function"
  );
}

/**
 * Type guard for NumberConstraint.
 * Checks that the schema is a number type and has constraint methods.
 *
 * @param schema - The schema to check
 * @returns True if the schema is a NumberConstraint with constraint methods
 * @since 2.0.0
 * @example
 * ```typescript
 * const schema = number().min(0);
 * if (isNumberConstraint(schema)) {
 *   // schema is narrowed to NumberConstraint
 *   schema.max(100); // constraint methods available
 * }
 * ```
 */
export function isNumberConstraint(
  schema: GenericSchema
): schema is NumberConstraint {
  return (
    // Stryker disable next-line ConditionalExpression,LogicalOperator: defensive guard - Kanon schema factories always return Constraints with methods
    schema.type === "number" &&
    // Stryker disable next-line ConditionalExpression: defensive guard - Kanon schema factories always return Constraints with methods
    typeof (schema as NumberConstraint).min === "function"
  );
}

/**
 * Type guard for ArrayConstraint.
 * Checks that the schema is an array type and has constraint methods.
 *
 * @param schema - The schema to check
 * @returns True if the schema is an ArrayConstraint with constraint methods
 * @since 2.0.0
 * @example
 * ```typescript
 * const schema = array(string()).minLength(1);
 * if (isArrayConstraint(schema)) {
 *   // schema is narrowed to ArrayConstraint
 *   schema.maxLength(10); // constraint methods available
 * }
 * ```
 */
export function isArrayConstraint<T extends GenericSchema>(
  schema: GenericSchema
): schema is ArrayConstraint<T> {
  return (
    schema.type === "array" &&
    // Stryker disable next-line ConditionalExpression: defensive guard - Kanon schema factories always return Constraints with methods
    typeof (schema as ArrayConstraint<T>).minLength === "function"
  );
}

/**
 * Type guard for ObjectConstraint.
 * Checks that the schema is an object type and has constraint methods.
 *
 * @param schema - The schema to check
 * @returns True if the schema is an ObjectConstraint with constraint methods
 * @since 2.0.0
 * @example
 * ```typescript
 * const schema = object({ name: string() }).minKeys(1);
 * if (isObjectConstraint(schema)) {
 *   // schema is narrowed to ObjectConstraint
 *   schema.maxKeys(5); // constraint methods available
 * }
 * ```
 */
export function isObjectConstraint<
  T extends Record<string, GenericSchema> = Record<string, GenericSchema>
>(schema: GenericSchema): schema is ObjectConstraint<T> {
  return (
    // Stryker disable next-line ConditionalExpression,LogicalOperator: defensive guard - Kanon schema factories always return Constraints with methods
    schema.type === "object" &&
    // Stryker disable next-line ConditionalExpression: defensive guard - Kanon schema factories always return Constraints with methods
    typeof (schema as ObjectConstraint<T>).minKeys === "function"
  );
}

/**
 * Type guard for DateConstraint.
 * Checks that the schema is a date type and has constraint methods.
 *
 * @param schema - The schema to check
 * @returns True if the schema is a DateConstraint with constraint methods
 * @since 2.0.0
 * @example
 * ```typescript
 * const schema = date().min(new Date('2020-01-01'));
 * if (isDateConstraint(schema)) {
 *   // schema is narrowed to DateConstraint
 *   schema.max(new Date('2030-01-01')); // constraint methods available
 * }
 * ```
 */
export function isDateConstraint(
  schema: GenericSchema
): schema is DateConstraint {
  return (
    schema.type === "date" &&
    // Stryker disable next-line ConditionalExpression: defensive guard - Kanon schema factories always return Constraints with methods
    typeof (schema as DateConstraint).min === "function"
  );
}

/**
 * Type guard for BigIntConstraint.
 * Checks that the schema is a bigint type and has constraint methods.
 *
 * @param schema - The schema to check
 * @returns True if the schema is a BigIntConstraint with constraint methods
 * @since 2.0.0
 * @example
 * ```typescript
 * const schema = bigint().min(0n);
 * if (isBigIntConstraint(schema)) {
 *   // schema is narrowed to BigIntConstraint
 *   schema.max(100n); // constraint methods available
 * }
 * ```
 */
export function isBigIntConstraint(
  schema: GenericSchema
): schema is BigIntConstraint {
  return (
    schema.type === "bigint" &&
    // Stryker disable next-line ConditionalExpression: defensive guard - Kanon schema factories always return Constraints with methods
    typeof (schema as BigIntConstraint).min === "function"
  );
}

/**
 * Type guard for SetConstraint.
 * Checks that the schema is a set type and has constraint methods.
 *
 * @param schema - The schema to check
 * @returns True if the schema is a SetConstraint with constraint methods
 * @since 2.0.0
 * @example
 * ```typescript
 * const schema = set(string()).minSize(1);
 * if (isSetConstraint(schema)) {
 *   // schema is narrowed to SetConstraint
 *   schema.maxSize(10); // constraint methods available
 * }
 * ```
 */
export function isSetConstraint<T extends GenericSchema>(
  schema: GenericSchema
): schema is SetConstraint<T> {
  return (
    schema.type === "set" &&
    // Stryker disable next-line ConditionalExpression: defensive guard - Kanon schema factories always return Constraints with methods
    typeof (schema as SetConstraint<T>).minSize === "function"
  );
}

/**
 * Type guard for MapConstraint.
 * Checks that the schema is a map type and has constraint methods.
 *
 * @param schema - The schema to check
 * @returns True if the schema is a MapConstraint with constraint methods
 * @since 2.0.0
 * @example
 * ```typescript
 * const schema = map(string(), number()).minSize(1);
 * if (isMapConstraint(schema)) {
 *   // schema is narrowed to MapConstraint
 *   schema.maxSize(10); // constraint methods available
 * }
 * ```
 */
export function isMapConstraint<
  K extends GenericSchema,
  V extends GenericSchema
>(schema: GenericSchema): schema is MapConstraint<K, V> {
  return (
    schema.type === "map" &&
    // Stryker disable next-line ConditionalExpression: defensive guard - Kanon schema factories always return Constraints with methods
    typeof (schema as MapConstraint<K, V>).minSize === "function"
  );
}
