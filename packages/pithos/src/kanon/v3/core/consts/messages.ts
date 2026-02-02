/**
 * Error messages constants for Kanon V3.
 *
 * Centralized error messages used throughout the validation system.
 * Messages without parameters are direct strings for optimal performance,
 * while messages with parameters use functions for interpolation.
 *
 * @performance Optimization: Messages without parameters are ~71% faster than arrow functions
 * @note Trade-off: Direct strings provide better performance but limit tree-shaking
 * compared to individual function exports. Bundle size impact is minimal (~1-2KB).
 * @since 3.0.0
 */
export const ERROR_MESSAGES_COMPOSITION = {
  string: "Expected string",
  number: "Expected number",
  boolean: "Expected boolean",
  object: "Expected object",
  array: "Expected array",
  map: "Expected map",
  set: "Expected set",
  record: "Expected record",
  minLength: (min: number) => `String must be at least ${min} characters long`,
  maxLength: (max: number) => `String must be at most ${max} characters long`,
  min: (min: number) => `Number must be at least ${min}`,
  max: (max: number) => `Number must be at most ${max}`,
  int: "Number must be an integer",
  positive: "Number must be positive",
  negative: "Number must be negative",
  email: "Invalid email format",
  url: "Invalid URL format",
  uuid: "Invalid UUID format",
  pattern: (regex: RegExp) => `String must match pattern ${regex.source}`,
  length: (length: number) =>
    `String must be exactly ${length} characters long`,
  includes: (substring: string) => `String must include "${substring}"`,
  startsWith: (prefix: string) => `String must start with "${prefix}"`,
  endsWith: (suffix: string) => `String must end with "${suffix}"`,
  lt: (lessThan: number) => `Number must be less than ${lessThan}`,
  lte: (lessThanOrEqual: number) =>
    `Number must be less than or equal to ${lessThanOrEqual}`,
  gt: (greaterThan: number) => `Number must be greater than ${greaterThan}`,
  gte: (greaterThanOrEqual: number) =>
    `Number must be greater than or equal to ${greaterThanOrEqual}`,
  multipleOf: (multiple: number) => `Number must be a multiple of ${multiple}`,
  arrayMinLength: (min: number) => `Array must have at least ${min} items`,
  arrayMaxLength: (max: number) => `Array must have at most ${max} items`,
  arrayLength: (length: number) => `Array must have exactly ${length} items`,
  arrayUnique: "Array must contain unique values",
  setMinSize: (min: number) => `Set must have at least ${min} items`,
  setMaxSize: (max: number) => `Set must have at most ${max} items`,
  mapMinSize: (min: number) => `Map must have at least ${min} entries`,
  mapMaxSize: (max: number) => `Map must have at most ${max} entries`,
  objectMinKeys: (min: number) => `Object must have at least ${min} keys`,
  objectMaxKeys: (max: number) => `Object must have at most ${max} keys`,
  objectStrict: (key: string) =>
    `Object must not contain unexpected property: ${key}`,
  null: "Expected null",
  undefined: "Expected undefined",
  date: "Expected date",
  bigint: "Expected bigint",
  dateMin: (min: Date) => `Date must be at least ${min.toISOString()}`,
  dateMax: (max: Date) => `Date must be at most ${max.toISOString()}`,
  dateBefore: (before: Date) => `Date must be before ${before.toISOString()}`,
  dateAfter: (after: Date) => `Date must be after ${after.toISOString()}`,
  bigintMin: (min: bigint) => `BigInt must be at least ${min.toString()}`,
  bigintMax: (max: bigint) => `BigInt must be at most ${max.toString()}`,
  bigintPositive: "BigInt must be positive",
  bigintNegative: "BigInt must be negative",

  // Union, Literal, Tuple messages
  union: "Value does not match any of the expected types",
  literal: (expected: unknown, actualType: string) =>
    `Expected literal value ${JSON.stringify(expected)}, got ${actualType}`,
  tuple: "Expected tuple",
  tupleLength: (expected: number, actual: number) =>
    `Expected tuple of length ${expected}, got ${actual}`,
  tupleMinLength: (expected: number, actual: number) =>
    `Expected tuple of at least length ${expected}, got ${actual}`,

  // Enum messages
  enum: (values: readonly unknown[], actualType: string) =>
    `Expected one of [${values
      .map((v) => JSON.stringify(v))
      .join(", ")}], got ${actualType}`,
  nativeEnum: (values: readonly unknown[], actualType: string) =>
    `Expected one of [${values
      .map((v) => JSON.stringify(v))
      .join(", ")}], got ${actualType}`,

  // Specialized types messages
  symbol: "Expected symbol",
  never: "This value should never exist",
  void: "Expected void (undefined)",

  // Transform messages
  missingField: (field: string) => `Missing required field: ${field}`,
  propertyError: (field: string, error: string) =>
    `Property '${field}': ${error}`,
  keyofExpectedOneOf: (keys: string) => `Expected one of: ${keys}`,

  // Coerce messages
  coerceNumber: "Cannot coerce to number",
  coerceString: "Cannot coerce to string",
  coerceDate: "Cannot coerce to date",
  coerceBigInt: "Cannot coerce to bigint",
  coerceInvalidDate: "Invalid date",
  coerceNullToBigInt: "Cannot convert null to BigInt",
  coerceUndefinedToBigInt: "Cannot convert undefined to BigInt",
  coerceNullToDate: "Cannot convert null to Date",
  coerceUndefinedToDate: "Cannot convert undefined to Date",
} as const;
