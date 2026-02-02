/**
 * Number Code Builder - Complete Implementation
 *
 * Generates inline JavaScript code for number type validation
 * including all constraints: min, max, lt, lte, gt, gte, positive, negative,
 * int, multipleOf.
 *
 * This file merges and extends number-base.ts with advanced constraints.
 *
 * @since 3.3.0
 * @experimental
 */

import type { GeneratorContext } from "../../context";
import { formatPath, getIndent } from "../../context";
import { escapeString, debugComment } from "../../utils/code";
import { ERROR_MESSAGES_COMPOSITION } from "../../../core/consts/messages";

/**
 * Result of code generation containing the generated code and updated context.
 *
 * @since 3.3.0
 */
export interface CodeGenResult {
  /** Generated JavaScript code */
  code: string;
  /** Updated generator context */
  ctx: GeneratorContext;
}

/**
 * Number constraint metadata for JIT compilation.
 * These are extracted from the schema's refinements for inline code generation.
 *
 * @since 3.3.0
 */
export interface NumberConstraintMeta {
  /** Minimum value constraint (inclusive) */
  min?: { value: number; message?: string };
  /** Maximum value constraint (inclusive) */
  max?: { value: number; message?: string };
  /** Less than constraint (exclusive) */
  lt?: { value: number; message?: string };
  /** Less than or equal constraint (inclusive) */
  lte?: { value: number; message?: string };
  /** Greater than constraint (exclusive) */
  gt?: { value: number; message?: string };
  /** Greater than or equal constraint (inclusive) */
  gte?: { value: number; message?: string };
  /** Positive number constraint (> 0) */
  positive?: { message?: string };
  /** Negative number constraint (< 0) */
  negative?: { message?: string };
  /** Integer constraint */
  int?: { message?: string };
  /** Multiple of constraint */
  multipleOf?: { value: number; message?: string };
}

// ============================================================================
// Base constraint generators (from number-base.ts)
// ============================================================================

/**
 * Generates the type check code for a number value.
 * Includes NaN check as NaN is technically a number but invalid for validation.
 *
 * @param varName - The variable name to check
 * @param ctx - The generator context
 * @param customMessage - Optional custom error message
 * @returns Generated code and updated context
 * @since 3.3.0
 */
export function generateNumberTypeCheck(
  varName: string,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg = customMessage ?? `${errorPrefix}${ERROR_MESSAGES_COMPOSITION.number}`;

  const lines: string[] = [];
  
  // Add debug comment
  const comment = debugComment(ctx, "Type check: number");
  if (comment) lines.push(comment);
  
  lines.push(`${indent}if (typeof ${varName} !== "number" || Number.isNaN(${varName})) return "${escapeString(errorMsg)}";`);

  return { code: lines.join("\n"), ctx };
}

/**
 * Generates inline code for the min constraint (inclusive).
 *
 * @since 3.3.0
 */
export function generateMinCheck(
  varName: string,
  min: number,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg = customMessage ?? `${errorPrefix}${ERROR_MESSAGES_COMPOSITION.min(min)}`;

  const lines: string[] = [];
  
  // Add debug comment
  const comment = debugComment(ctx, `Constraint: min(${min})`);
  if (comment) lines.push(comment);
  
  lines.push(`${indent}if (${varName} < ${min}) return "${escapeString(errorMsg)}";`);

  return { code: lines.join("\n"), ctx };
}

/**
 * Generates inline code for the max constraint (inclusive).
 *
 * @since 3.3.0
 */
export function generateMaxCheck(
  varName: string,
  max: number,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg = customMessage ?? `${errorPrefix}${ERROR_MESSAGES_COMPOSITION.max(max)}`;

  const lines: string[] = [];
  
  // Add debug comment
  const comment = debugComment(ctx, `Constraint: max(${max})`);
  if (comment) lines.push(comment);
  
  lines.push(`${indent}if (${varName} > ${max}) return "${escapeString(errorMsg)}";`);

  return { code: lines.join("\n"), ctx };
}

/**
 * Generates inline code for the lt constraint (exclusive less than).
 *
 * @since 3.3.0
 */
export function generateLtCheck(
  varName: string,
  lessThan: number,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg = customMessage ?? `${errorPrefix}${ERROR_MESSAGES_COMPOSITION.lt(lessThan)}`;

  const lines: string[] = [];
  
  // Add debug comment
  const comment = debugComment(ctx, `Constraint: lt(${lessThan})`);
  if (comment) lines.push(comment);
  
  lines.push(`${indent}if (${varName} >= ${lessThan}) return "${escapeString(errorMsg)}";`);

  return { code: lines.join("\n"), ctx };
}

/**
 * Generates inline code for the lte constraint (inclusive less than or equal).
 *
 * @since 3.3.0
 */
export function generateLteCheck(
  varName: string,
  lessThanOrEqual: number,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg =
    customMessage ?? `${errorPrefix}${ERROR_MESSAGES_COMPOSITION.lte(lessThanOrEqual)}`;

  const lines: string[] = [];
  
  // Add debug comment
  const comment = debugComment(ctx, `Constraint: lte(${lessThanOrEqual})`);
  if (comment) lines.push(comment);
  
  lines.push(`${indent}if (${varName} > ${lessThanOrEqual}) return "${escapeString(errorMsg)}";`);

  return { code: lines.join("\n"), ctx };
}

/**
 * Generates inline code for the gt constraint (exclusive greater than).
 *
 * @since 3.3.0
 */
export function generateGtCheck(
  varName: string,
  greaterThan: number,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg = customMessage ?? `${errorPrefix}${ERROR_MESSAGES_COMPOSITION.gt(greaterThan)}`;

  const lines: string[] = [];
  
  // Add debug comment
  const comment = debugComment(ctx, `Constraint: gt(${greaterThan})`);
  if (comment) lines.push(comment);
  
  lines.push(`${indent}if (${varName} <= ${greaterThan}) return "${escapeString(errorMsg)}";`);

  return { code: lines.join("\n"), ctx };
}

/**
 * Generates inline code for the gte constraint (inclusive greater than or equal).
 *
 * @since 3.3.0
 */
export function generateGteCheck(
  varName: string,
  greaterThanOrEqual: number,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg =
    customMessage ?? `${errorPrefix}${ERROR_MESSAGES_COMPOSITION.gte(greaterThanOrEqual)}`;

  const lines: string[] = [];
  
  // Add debug comment
  const comment = debugComment(ctx, `Constraint: gte(${greaterThanOrEqual})`);
  if (comment) lines.push(comment);
  
  lines.push(`${indent}if (${varName} < ${greaterThanOrEqual}) return "${escapeString(errorMsg)}";`);

  return { code: lines.join("\n"), ctx };
}

// ============================================================================
// Advanced constraint generators
// ============================================================================

/**
 * Generates inline code for the positive constraint (value > 0).
 *
 * @param varName - The variable name to check
 * @param ctx - The generator context
 * @param customMessage - Optional custom error message
 * @returns Generated code and updated context
 * @since 3.3.0
 *
 * @example
 * ```typescript
 * const result = generatePositiveCheck("value", ctx);
 * // result.code = 'if (value <= 0) return "Number must be positive";'
 * ```
 */
export function generatePositiveCheck(
  varName: string,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg = customMessage ?? `${errorPrefix}${ERROR_MESSAGES_COMPOSITION.positive}`;

  const lines: string[] = [];
  
  // Add debug comment
  const comment = debugComment(ctx, "Constraint: positive()");
  if (comment) lines.push(comment);
  
  lines.push(`${indent}if (${varName} <= 0) return "${escapeString(errorMsg)}";`);

  return { code: lines.join("\n"), ctx };
}

/**
 * Generates inline code for the negative constraint (value < 0).
 *
 * @param varName - The variable name to check
 * @param ctx - The generator context
 * @param customMessage - Optional custom error message
 * @returns Generated code and updated context
 * @since 3.3.0
 *
 * @example
 * ```typescript
 * const result = generateNegativeCheck("value", ctx);
 * // result.code = 'if (value >= 0) return "Number must be negative";'
 * ```
 */
export function generateNegativeCheck(
  varName: string,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg = customMessage ?? `${errorPrefix}${ERROR_MESSAGES_COMPOSITION.negative}`;

  const lines: string[] = [];
  
  // Add debug comment
  const comment = debugComment(ctx, "Constraint: negative()");
  if (comment) lines.push(comment);
  
  lines.push(`${indent}if (${varName} >= 0) return "${escapeString(errorMsg)}";`);

  return { code: lines.join("\n"), ctx };
}

/**
 * Generates inline code for the integer constraint.
 *
 * @param varName - The variable name to check
 * @param ctx - The generator context
 * @param customMessage - Optional custom error message
 * @returns Generated code and updated context
 * @since 3.3.0
 *
 * @example
 * ```typescript
 * const result = generateIntCheck("value", ctx);
 * // result.code = 'if (!Number.isInteger(value)) return "Number must be an integer";'
 * ```
 */
export function generateIntCheck(
  varName: string,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg = customMessage ?? `${errorPrefix}${ERROR_MESSAGES_COMPOSITION.int}`;

  const lines: string[] = [];
  
  // Add debug comment
  const comment = debugComment(ctx, "Constraint: int()");
  if (comment) lines.push(comment);
  
  lines.push(`${indent}if (!Number.isInteger(${varName})) return "${escapeString(errorMsg)}";`);

  return { code: lines.join("\n"), ctx };
}

/**
 * Generates inline code for the multipleOf constraint.
 *
 * Uses modulo operation to check if value is a multiple of the given divisor.
 * Handles floating point precision issues by using a small epsilon for comparison.
 *
 * @param varName - The variable name to check
 * @param divisor - The value that the number must be a multiple of
 * @param ctx - The generator context
 * @param customMessage - Optional custom error message
 * @returns Generated code and updated context
 * @since 3.3.0
 *
 * @example
 * ```typescript
 * const result = generateMultipleOfCheck("value", 5, ctx);
 * // result.code = 'if (value % 5 !== 0) return "Number must be a multiple of 5";'
 * ```
 */
export function generateMultipleOfCheck(
  varName: string,
  divisor: number,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg = customMessage ?? `${errorPrefix}${ERROR_MESSAGES_COMPOSITION.multipleOf(divisor)}`;

  // For integer divisors, use simple modulo
  // For floating point divisors, use epsilon comparison to handle precision issues
  const isIntegerDivisor = Number.isInteger(divisor);
  
  const lines: string[] = [];
  
  // Add debug comment
  const comment = debugComment(ctx, `Constraint: multipleOf(${divisor})`);
  if (comment) lines.push(comment);
  
  let code: string;
  if (isIntegerDivisor) {
    code = `${indent}if (${varName} % ${divisor} !== 0) return "${escapeString(errorMsg)}";`;
  } else {
    // Use epsilon comparison for floating point: Math.abs(value % divisor) > 1e-10
    code = `${indent}if (Math.abs(${varName} % ${divisor}) > 1e-10 && Math.abs(${varName} % ${divisor} - ${divisor}) > 1e-10) return "${escapeString(errorMsg)}";`;
  }
  
  lines.push(code);

  return { code: lines.join("\n"), ctx };
}

// ============================================================================
// Complete validation generator
// ============================================================================

/**
 * Generates complete validation code for a number schema with all constraints.
 *
 * @param varName - The variable name to validate
 * @param ctx - The generator context
 * @param constraints - Optional constraint metadata
 * @param customTypeMessage - Optional custom type error message
 * @returns Generated code lines and updated context
 * @since 3.3.0
 *
 * @example
 * ```typescript
 * const result = generateNumberValidation("value", ctx, {
 *   min: { value: 0 },
 *   max: { value: 100 },
 *   int: {}
 * });
 * // result.code = [
 * //   'if (typeof value !== "number" || Number.isNaN(value)) return "Expected number";',
 * //   'if (value < 0) return "Number must be at least 0";',
 * //   'if (value > 100) return "Number must be at most 100";',
 * //   'if (!Number.isInteger(value)) return "Number must be an integer";'
 * // ]
 * ```
 */
export function generateNumberValidation(
  varName: string,
  ctx: GeneratorContext,
  constraints?: NumberConstraintMeta,
  customTypeMessage?: string
): { code: string[]; ctx: GeneratorContext } {
  const lines: string[] = [];
  let currentCtx = ctx;

  // Type check
  const typeCheck = generateNumberTypeCheck(varName, currentCtx, customTypeMessage);
  lines.push(typeCheck.code);
  currentCtx = typeCheck.ctx;

  // Constraint checks
  if (constraints) {
    // Range constraints (from base)
    if (constraints.min !== undefined) {
      const check = generateMinCheck(
        varName,
        constraints.min.value,
        currentCtx,
        constraints.min.message
      );
      lines.push(check.code);
      currentCtx = check.ctx;
    }

    if (constraints.max !== undefined) {
      const check = generateMaxCheck(
        varName,
        constraints.max.value,
        currentCtx,
        constraints.max.message
      );
      lines.push(check.code);
      currentCtx = check.ctx;
    }

    if (constraints.lt !== undefined) {
      const check = generateLtCheck(
        varName,
        constraints.lt.value,
        currentCtx,
        constraints.lt.message
      );
      lines.push(check.code);
      currentCtx = check.ctx;
    }

    if (constraints.lte !== undefined) {
      const check = generateLteCheck(
        varName,
        constraints.lte.value,
        currentCtx,
        constraints.lte.message
      );
      lines.push(check.code);
      currentCtx = check.ctx;
    }

    if (constraints.gt !== undefined) {
      const check = generateGtCheck(
        varName,
        constraints.gt.value,
        currentCtx,
        constraints.gt.message
      );
      lines.push(check.code);
      currentCtx = check.ctx;
    }

    if (constraints.gte !== undefined) {
      const check = generateGteCheck(
        varName,
        constraints.gte.value,
        currentCtx,
        constraints.gte.message
      );
      lines.push(check.code);
      currentCtx = check.ctx;
    }

    // Sign constraints
    if (constraints.positive !== undefined) {
      const check = generatePositiveCheck(varName, currentCtx, constraints.positive.message);
      lines.push(check.code);
      currentCtx = check.ctx;
    }

    if (constraints.negative !== undefined) {
      const check = generateNegativeCheck(varName, currentCtx, constraints.negative.message);
      lines.push(check.code);
      currentCtx = check.ctx;
    }

    // Type constraints
    if (constraints.int !== undefined) {
      const check = generateIntCheck(varName, currentCtx, constraints.int.message);
      lines.push(check.code);
      currentCtx = check.ctx;
    }

    if (constraints.multipleOf !== undefined) {
      const check = generateMultipleOfCheck(
        varName,
        constraints.multipleOf.value,
        currentCtx,
        constraints.multipleOf.message
      );
      lines.push(check.code);
      currentCtx = check.ctx;
    }
  }

  return { code: lines, ctx: currentCtx };
}

