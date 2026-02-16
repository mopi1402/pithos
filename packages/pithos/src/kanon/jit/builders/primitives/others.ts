/**
 * @module kanon/jit/builders/primitives/others
 *
 * Primitives Code Builder
 *
 * Generates inline JavaScript code for primitive type validation:
 * null, undefined, any, unknown, never, void, symbol.
 *
 * @since 2.0.0
 * @experimental
 */

import type { GeneratorContext } from "../../context";
import { formatPath, getIndent } from "../../context";
import { escapeString, type CodeGenResult } from "../../utils/code";
import { ERROR_MESSAGES_COMPOSITION } from "../../../core/consts/messages";

// ============================================================================
// Null type
// ============================================================================

/**
 * Generates the type check code for a null value.
 *
 * @param varName - The variable name to check
 * @param ctx - The generator context
 * @param customMessage - Optional custom error message
 * @returns Generated code and updated context
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const result = generateNullTypeCheck("value", ctx);
 * // result.code = 'if (value !== null) return "Expected null";'
 * ```
 */
export function generateNullTypeCheck(
  varName: string,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg = customMessage ?? `${errorPrefix}${ERROR_MESSAGES_COMPOSITION.null}`;

  const code = `${indent}if (${varName} !== null) return "${escapeString(errorMsg)}";`;

  return { code, ctx };
}

/**
 * Generates complete validation code for a null schema.
 *
 * @param varName - The variable name to validate
 * @param ctx - The generator context
 * @param customTypeMessage - Optional custom type error message
 * @returns Generated code lines and updated context
 * @since 2.0.0
 */
export function generateNullValidation(
  varName: string,
  ctx: GeneratorContext,
  customTypeMessage?: string
): { code: string[]; ctx: GeneratorContext } {
  const typeCheck = generateNullTypeCheck(varName, ctx, customTypeMessage);
  return { code: [typeCheck.code], ctx: typeCheck.ctx };
}

// ============================================================================
// Undefined type
// ============================================================================

/**
 * Generates the type check code for an undefined value.
 *
 * @param varName - The variable name to check
 * @param ctx - The generator context
 * @param customMessage - Optional custom error message
 * @returns Generated code and updated context
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const result = generateUndefinedTypeCheck("value", ctx);
 * // result.code = 'if (value !== undefined) return "Expected undefined";'
 * ```
 */
export function generateUndefinedTypeCheck(
  varName: string,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg = customMessage ?? `${errorPrefix}${ERROR_MESSAGES_COMPOSITION.undefined}`;

  const code = `${indent}if (${varName} !== undefined) return "${escapeString(errorMsg)}";`;

  return { code, ctx };
}

/**
 * Generates complete validation code for an undefined schema.
 *
 * @param varName - The variable name to validate
 * @param ctx - The generator context
 * @param customTypeMessage - Optional custom type error message
 * @returns Generated code lines and updated context
 * @since 2.0.0
 */
export function generateUndefinedValidation(
  varName: string,
  ctx: GeneratorContext,
  customTypeMessage?: string
): { code: string[]; ctx: GeneratorContext } {
  const typeCheck = generateUndefinedTypeCheck(varName, ctx, customTypeMessage);
  return { code: [typeCheck.code], ctx: typeCheck.ctx };
}

// ============================================================================
// Any type
// ============================================================================

/**
 * Generates validation code for an any type.
 * Any type accepts all values, so no validation is performed.
 *
 * @param _varName - The variable name (unused, any accepts everything)
 * @param ctx - The generator context
 * @returns Generated code (empty) and updated context
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const result = generateAnyValidation("value", ctx);
 * // result.code = [] (no validation needed)
 * ```
 */
export function generateAnyValidation(
  _varName: string,
  ctx: GeneratorContext
): { code: string[]; ctx: GeneratorContext } {
  // Any type accepts all values - no validation code needed
  return { code: [], ctx };
}

// ============================================================================
// Unknown type
// ============================================================================

/**
 * Generates validation code for an unknown type.
 * Unknown type accepts all values at runtime (validation happens at type level).
 *
 * @param _varName - The variable name (unused, unknown accepts everything at runtime)
 * @param ctx - The generator context
 * @returns Generated code (empty) and updated context
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const result = generateUnknownValidation("value", ctx);
 * // result.code = [] (no runtime validation needed)
 * ```
 */
export function generateUnknownValidation(
  _varName: string,
  ctx: GeneratorContext
): { code: string[]; ctx: GeneratorContext } {
  // Unknown type accepts all values at runtime - no validation code needed
  return { code: [], ctx };
}

// ============================================================================
// Never type
// ============================================================================

/**
 * Generates the type check code for a never type.
 * Never type rejects all values - nothing can satisfy it.
 *
 * @param _varName - The variable name (unused, never always fails)
 * @param ctx - The generator context
 * @param customMessage - Optional custom error message
 * @returns Generated code and updated context
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const result = generateNeverTypeCheck("value", ctx);
 * // result.code = 'return "No value can satisfy never type";'
 * ```
 */
export function generateNeverTypeCheck(
  _varName: string,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg = customMessage ?? `${errorPrefix}${ERROR_MESSAGES_COMPOSITION.never}`;

  // Never type always fails - unconditional return
  const code = `${indent}return "${escapeString(errorMsg)}";`;

  return { code, ctx };
}

/**
 * Generates complete validation code for a never schema.
 * Always returns an error since no value can satisfy never.
 *
 * @param varName - The variable name to validate
 * @param ctx - The generator context
 * @param customTypeMessage - Optional custom type error message
 * @returns Generated code lines and updated context
 * @since 2.0.0
 */
export function generateNeverValidation(
  varName: string,
  ctx: GeneratorContext,
  customTypeMessage?: string
): { code: string[]; ctx: GeneratorContext } {
  const typeCheck = generateNeverTypeCheck(varName, ctx, customTypeMessage);
  return { code: [typeCheck.code], ctx: typeCheck.ctx };
}

// ============================================================================
// Void type
// ============================================================================

/**
 * Generates the type check code for a void type.
 * Void type only accepts undefined.
 *
 * @param varName - The variable name to check
 * @param ctx - The generator context
 * @param customMessage - Optional custom error message
 * @returns Generated code and updated context
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const result = generateVoidTypeCheck("value", ctx);
 * // result.code = 'if (value !== undefined) return "Expected void (undefined)";'
 * ```
 */
export function generateVoidTypeCheck(
  varName: string,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg = customMessage ?? `${errorPrefix}${ERROR_MESSAGES_COMPOSITION.void}`;

  const code = `${indent}if (${varName} !== undefined) return "${escapeString(errorMsg)}";`;

  return { code, ctx };
}

/**
 * Generates complete validation code for a void schema.
 *
 * @param varName - The variable name to validate
 * @param ctx - The generator context
 * @param customTypeMessage - Optional custom type error message
 * @returns Generated code lines and updated context
 * @since 2.0.0
 */
export function generateVoidValidation(
  varName: string,
  ctx: GeneratorContext,
  customTypeMessage?: string
): { code: string[]; ctx: GeneratorContext } {
  const typeCheck = generateVoidTypeCheck(varName, ctx, customTypeMessage);
  return { code: [typeCheck.code], ctx: typeCheck.ctx };
}

// ============================================================================
// Symbol type
// ============================================================================

/**
 * Generates the type check code for a symbol value.
 *
 * @param varName - The variable name to check
 * @param ctx - The generator context
 * @param customMessage - Optional custom error message
 * @returns Generated code and updated context
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const result = generateSymbolTypeCheck("value", ctx);
 * // result.code = 'if (typeof value !== "symbol") return "Expected symbol";'
 * ```
 */
export function generateSymbolTypeCheck(
  varName: string,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg = customMessage ?? `${errorPrefix}${ERROR_MESSAGES_COMPOSITION.symbol}`;

  const code = `${indent}if (typeof ${varName} !== "symbol") return "${escapeString(errorMsg)}";`;

  return { code, ctx };
}

/**
 * Generates complete validation code for a symbol schema.
 *
 * @param varName - The variable name to validate
 * @param ctx - The generator context
 * @param customTypeMessage - Optional custom type error message
 * @returns Generated code lines and updated context
 * @since 2.0.0
 */
export function generateSymbolValidation(
  varName: string,
  ctx: GeneratorContext,
  customTypeMessage?: string
): { code: string[]; ctx: GeneratorContext } {
  const typeCheck = generateSymbolTypeCheck(varName, ctx, customTypeMessage);
  return { code: [typeCheck.code], ctx: typeCheck.ctx };
}
