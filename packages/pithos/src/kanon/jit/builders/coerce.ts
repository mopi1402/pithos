/**
 * @module kanon/jit/builders/coerce
 *
 * Coerce Code Builder
 *
 * Generates inline JavaScript code for coercion type validation.
 * Supports coerce.string, coerce.number, coerce.boolean, and coerce.date.
 *
 * Coercion schemas transform input values to the target type and return
 * `{ coerced: value }` for successful coercions.
 *
 * @since 2.0.0
 * @experimental
 */

import type { GeneratorContext } from "../context";
import { formatPath, getIndent } from "../context";
import { escapeString, type CodeGenResult } from "../utils/code";

// ============================================================================
// Error messages (matching core/consts/messages.ts)
// ============================================================================

const COERCE_ERRORS = {
  string: "Cannot coerce to string",
  number: "Cannot coerce to number",
  date: "Cannot coerce to date",
  invalidDate: "Invalid date",
  nullToDate: "Cannot convert null to Date",
  undefinedToDate: "Cannot convert undefined to Date",
} as const;

// ============================================================================
// Coerce String
// ============================================================================

/**
 * Generates inline code for coerce.string().
 *
 * If the value is already a string, returns true.
 * Otherwise, converts to string using String(value) and returns `{ coerced: result }`.
 *
 * @param varName - The variable name to coerce
 * @param ctx - The generator context
 * @param customMessage - Optional custom error message
 * @returns Generated code and updated context
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const result = generateCoerceStringCheck("value", ctx);
 * // Generated code:
 * // if (typeof value === "string") return true;
 * // try { return { coerced: String(value) }; } catch { return "Cannot coerce to string"; }
 * ```
 */
export function generateCoerceStringCheck(
  varName: string,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg = customMessage ?? `${errorPrefix}${COERCE_ERRORS.string}`;

  // If already a string, return true (no coercion needed)
  // Otherwise, try to coerce with String() and return { coerced: result }
  const code = [
    `${indent}if (typeof ${varName} === "string") return true;`,
    `${indent}try { return { coerced: String(${varName}) }; } catch { return "${escapeString(errorMsg)}"; }`,
  ].join("\n");

  return { code, ctx };
}

// ============================================================================
// Coerce Number
// ============================================================================

/**
 * Generates inline code for coerce.number().
 *
 * If the value is already a valid number (not NaN), returns true.
 * Otherwise, converts to number using Number(value) with NaN check.
 * Returns `{ coerced: result }` for successful coercions.
 *
 * @param varName - The variable name to coerce
 * @param ctx - The generator context
 * @param customMessage - Optional custom error message
 * @returns Generated code and updated context
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const result = generateCoerceNumberCheck("value", ctx);
 * // Generated code handles:
 * // - Already a number: return true
 * // - Boolean: coerce to 0/1
 * // - Empty string: coerce to 0
 * // - Other: try Number(value) with NaN check
 * ```
 */
export function generateCoerceNumberCheck(
  varName: string,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg = customMessage ?? `${errorPrefix}${COERCE_ERRORS.number}`;

  // Generate code that matches the coerceNumber implementation:
  // 1. If already a valid number, return true
  // 2. If boolean, coerce to 0/1
  // 3. If empty string, coerce to 0
  // 4. Otherwise, try Number() with NaN check
  const code = [
    `${indent}if (typeof ${varName} === "number" && !Number.isNaN(${varName})) return true;`,
    `${indent}var coerced_num;`,
    `${indent}if (typeof ${varName} === "boolean") { coerced_num = ${varName} ? 1 : 0; }`,
    `${indent}else if (${varName} === "") { coerced_num = 0; }`,
    `${indent}else { try { coerced_num = Number(${varName}); } catch { return "${escapeString(errorMsg)}"; } }`,
    `${indent}if (Number.isNaN(coerced_num)) return "${escapeString(errorMsg)}";`,
    `${indent}return { coerced: coerced_num };`,
  ].join("\n");

  return { code, ctx };
}

// ============================================================================
// Coerce Boolean
// ============================================================================

/**
 * Generates inline code for coerce.boolean().
 *
 * If the value is already a boolean, returns true.
 * Otherwise, converts to boolean using Boolean(value) and returns `{ coerced: result }`.
 * Boolean coercion never fails - any value can be coerced to boolean.
 *
 * @param varName - The variable name to coerce
 * @param ctx - The generator context
 * @returns Generated code and updated context
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const result = generateCoerceBooleanCheck("value", ctx);
 * // Generated code:
 * // if (typeof value === "boolean") return true;
 * // return { coerced: Boolean(value) };
 * ```
 */
export function generateCoerceBooleanCheck(
  varName: string,
  ctx: GeneratorContext
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";

  // Boolean coercion never fails - any value can be coerced to boolean
  const code = [
    `${indent}if (typeof ${varName} === "boolean") return true;`,
    `${indent}return { coerced: Boolean(${varName}) };`,
  ].join("\n");

  return { code, ctx };
}

// ============================================================================
// Coerce Date
// ============================================================================

/**
 * Generates inline code for coerce.date().
 *
 * If the value is already a valid Date, returns true.
 * Otherwise, attempts to convert to Date with special handling for:
 * - null: returns error (cannot convert null to Date)
 * - undefined: returns error (cannot convert undefined to Date)
 * - number: new Date(value)
 * - string: new Date(value)
 * - boolean: new Date(value ? 1 : 0)
 * - other: new Date(String(value))
 *
 * Returns `{ coerced: result }` for successful coercions, error string otherwise.
 *
 * @param varName - The variable name to coerce
 * @param ctx - The generator context
 * @param customMessage - Optional custom error message
 * @returns Generated code and updated context
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const result = generateCoerceDateCheck("value", ctx);
 * // Generated code handles various input types and validates the resulting Date
 * ```
 */
export function generateCoerceDateCheck(
  varName: string,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const invalidDateMsg = customMessage ?? `${errorPrefix}${COERCE_ERRORS.invalidDate}`;
  const nullMsg = `${errorPrefix}${COERCE_ERRORS.nullToDate}`;
  const undefinedMsg = `${errorPrefix}${COERCE_ERRORS.undefinedToDate}`;

  // Generate code that matches the coerceDate implementation:
  // 1. If already a valid Date, return true
  // 2. Handle null and undefined specially (return error)
  // 3. Handle number, string, boolean
  // 4. For other types, try String() conversion
  // 5. Validate the resulting Date (check for Invalid Date)
  const code = [
    `${indent}if (${varName} instanceof Date && !Number.isNaN(${varName}.getTime())) return true;`,
    `${indent}var coerced_date;`,
    `${indent}if (${varName} === null) return "${escapeString(nullMsg)}";`,
    `${indent}if (${varName} === undefined) return "${escapeString(undefinedMsg)}";`,
    `${indent}if (typeof ${varName} === "number") { coerced_date = new Date(${varName}); }`,
    `${indent}else if (typeof ${varName} === "string") { coerced_date = new Date(${varName}); }`,
    `${indent}else if (typeof ${varName} === "boolean") { coerced_date = new Date(${varName} ? 1 : 0); }`,
    `${indent}else { try { coerced_date = new Date(String(${varName})); } catch { return "${escapeString(invalidDateMsg)}"; } }`,
    `${indent}if (Number.isNaN(coerced_date.getTime())) return "${escapeString(invalidDateMsg)}";`,
    `${indent}return { coerced: coerced_date };`,
  ].join("\n");

  return { code, ctx };
}

// ============================================================================
// Complete validation generators
// ============================================================================

/**
 * Generates complete validation code for a coerce.string schema.
 *
 * @param varName - The variable name to validate
 * @param ctx - The generator context
 * @param customMessage - Optional custom error message
 * @returns Generated code lines and updated context
 * @since 2.0.0
 */
export function generateCoerceStringValidation(
  varName: string,
  ctx: GeneratorContext,
  customMessage?: string
): { code: string[]; ctx: GeneratorContext } {
  const result = generateCoerceStringCheck(varName, ctx, customMessage);
  return { code: [result.code], ctx: result.ctx };
}

/**
 * Generates complete validation code for a coerce.number schema.
 *
 * @param varName - The variable name to validate
 * @param ctx - The generator context
 * @param customMessage - Optional custom error message
 * @returns Generated code lines and updated context
 * @since 2.0.0
 */
export function generateCoerceNumberValidation(
  varName: string,
  ctx: GeneratorContext,
  customMessage?: string
): { code: string[]; ctx: GeneratorContext } {
  const result = generateCoerceNumberCheck(varName, ctx, customMessage);
  return { code: [result.code], ctx: result.ctx };
}

/**
 * Generates complete validation code for a coerce.boolean schema.
 *
 * @param varName - The variable name to validate
 * @param ctx - The generator context
 * @returns Generated code lines and updated context
 * @since 2.0.0
 */
export function generateCoerceBooleanValidation(
  varName: string,
  ctx: GeneratorContext
): { code: string[]; ctx: GeneratorContext } {
  const result = generateCoerceBooleanCheck(varName, ctx);
  return { code: [result.code], ctx: result.ctx };
}

/**
 * Generates complete validation code for a coerce.date schema.
 *
 * @param varName - The variable name to validate
 * @param ctx - The generator context
 * @param customMessage - Optional custom error message
 * @returns Generated code lines and updated context
 * @since 2.0.0
 */
export function generateCoerceDateValidation(
  varName: string,
  ctx: GeneratorContext,
  customMessage?: string
): { code: string[]; ctx: GeneratorContext } {
  const result = generateCoerceDateCheck(varName, ctx, customMessage);
  return { code: [result.code], ctx: result.ctx };
}

/**
 * Coercion type for schema detection.
 *
 * @since 2.0.0
 */
export type CoerceType = "coerce_string" | "coerce_number" | "coerce_boolean" | "coerce_date";

/**
 * Checks if a schema type is a coercion type.
 *
 * @param type - The schema type to check
 * @returns True if the type is a coercion type
 * @since 2.0.0
 */
export function isCoerceType(type: string): type is CoerceType {
  return (
    type === "coerce_string" ||
    type === "coerce_number" ||
    type === "coerce_boolean" ||
    type === "coerce_date"
  );
}
