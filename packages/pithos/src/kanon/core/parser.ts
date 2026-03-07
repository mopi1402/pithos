import { Schema, GenericSchema, Infer, isCoerced } from "../types/base";

/**
 * Core parsing logic for Kanon V3 validation system.
 *
 * @template T - The expected output type of the schema.
 * @param schema - Schema to validate against.
 * @param input - Value to validate.
 * @returns Result object with success flag and data or error.
 * @since 2.0.0
 *
 * @performance Optimization: Fast paths for success/error cases.
 */
export function parse<T>(schema: Schema<T>, input: unknown): { success: true; data: T } | { success: false; error: string };
/**
 * Overload accepting a union of schemas (e.g. `fields[name]`).
 * Infers the output type from the union.
 *
 * @since 2.2.0
 */
export function parse<S extends GenericSchema>(schema: S, input: unknown): { success: true; data: Infer<S> } | { success: false; error: string };
export function parse(
  schema: GenericSchema,
  input: unknown
): { success: true; data: unknown } | { success: false; error: string } {
  const result = schema.validator(input);

  if (result === true) {
    return { success: true, data: input };
  }
  if (isCoerced(result)) {
    return { success: true, data: result.coerced };
  }
  return { success: false, error: result };
}

/**
 * Options for parseBulk function.
 *
 * @since 2.0.0
 */
export interface ParseBulkOptions {
  /**
   * If true, stops at first validation failure (fastest mode).
   * If false, collects all errors (comprehensive mode).
   * @defaultValue false
   */
  earlyAbort?: boolean;
}

/**
 * Bulk validation with two modes:
 * - Early abort: stops at first validation failure (fastest).
 * - Complete: collects all errors (comprehensive).
 *
 * @template T - The expected output type of the schema.
 * @param schema - Schema to validate against.
 * @param values - Array of values to validate.
 * @param options - Bulk validation options.
 * @returns Result object with success flag and data array or errors array.
 * @since 2.0.0
 *
 * @performance Optimization: Pre-allocation and early abort mode.
 */
export function parseBulk<T>(schema: Schema<T>, values: unknown[], options?: ParseBulkOptions): { success: true; data: T[] } | { success: false; errors: string[] };
/**
 * Overload accepting a union of schemas.
 * Infers the output type from the union.
 *
 * @since 2.2.0
 */
export function parseBulk<S extends GenericSchema>(schema: S, values: unknown[], options?: ParseBulkOptions): { success: true; data: Infer<S>[] } | { success: false; errors: string[] };
export function parseBulk(
  schema: GenericSchema,
  values: unknown[],
  options?: ParseBulkOptions
): { success: true; data: unknown[] } | { success: false; errors: string[] } {
  const { earlyAbort = false } = options || {};
  const valuesLength = values.length;

  // INTENTIONAL DUPLICATION: The two branches below share similar validation logic
  // but are kept separate for performance reasons:
  // - earlyAbort mode: lazy copy on coercion (immutable, fast when no coercion)
  // - normal mode: creates new results array (immutable, collects all errors)
  // Factorizing would add unnecessary allocations in the common case.

  if (earlyAbort) {
    let coercedValues: unknown[] | null = null;

    for (let i = 0; i < valuesLength; i++) {
      const result = schema.validator(values[i]);
      if (result === true) {
        if (coercedValues) {
          coercedValues[i] = values[i];
        }
      } else if (isCoerced(result)) {
        if (!coercedValues) {
          // First coercion: create a copy of values processed so far
          // Stryker disable next-line ArrayDeclaration: Pre-allocation optimization - all indices filled in loop, final array identical
          coercedValues = new Array(valuesLength);
          // Stryker disable next-line EqualityOperator: j <= i would copy values[i] then overwrite with coerced - same result
          for (let j = 0; j < i; j++) {
            coercedValues[j] = values[j];
          }
        }
        coercedValues[i] = result.coerced;
      } else {
        return { success: false, errors: [`Index ${i}: ${result}`] };
      }
    }

    return { success: true, data: coercedValues ?? values };
  } else {
    // Stryker disable next-line ArrayDeclaration: Pre-allocation optimization - all indices filled in loop, final array identical
    const results: unknown[] = new Array(valuesLength);
    const errors: string[] = [];

    for (let i = 0; i < valuesLength; i++) {
      const result = schema.validator(values[i]);
      if (result === true) {
        results[i] = values[i];
      } else if (isCoerced(result)) {
        results[i] = result.coerced;
      } else {
        errors.push(`Index ${i}: ${result}`);
      }
    }

    if (errors.length === 0) {
      return { success: true, data: results };
    } else {
      return { success: false, errors };
    }
  }
}
