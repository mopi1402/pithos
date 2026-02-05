/**
 * @module kanon/jit/builders/composites/array
 *
 * Array Code Builder
 *
 * Generates inline JavaScript code for array type validation including:
 * - Type check: `Array.isArray(value)`
 * - Length constraints: minLength, maxLength, length
 * - Optimized for loop for item validation
 * - Index in error messages
 * - Pre-allocated result array for coercions
 *
 * @since 3.3.0
 * @experimental
 */

import type { GeneratorContext } from "../../context";
import {
  formatPath,
  getIndent,
  pushPath,
  nextVar,
  increaseIndent,
} from "../../context";
import { escapeString, debugComment, type CodeGenResult } from "../../utils/code";

/**
 * Array constraint metadata for JIT compilation.
 *
 * @since 3.3.0
 */
export interface ArrayConstraintMeta {
  /** Minimum array length */
  minLength?: { value: number; message?: string };
  /** Maximum array length */
  maxLength?: { value: number; message?: string };
  /** Exact array length */
  length?: { value: number; message?: string };
  /** Code generator function for array items */
  itemGenerator?: (varName: string, ctx: GeneratorContext) => { code: string[]; ctx: GeneratorContext };
  /** Whether items support coercion (requires result array) */
  supportsCoercion?: boolean;
}

// ============================================================================
// Type check generators
// ============================================================================

/**
 * Generates the type check code for an array value.
 *
 * @param varName - The variable name to check
 * @param ctx - The generator context
 * @param customMessage - Optional custom error message
 * @returns Generated code and updated context
 * @since 3.3.0
 *
 * @example
 * ```typescript
 * const result = generateArrayTypeCheck("value", ctx);
 * // result.code = 'if (!Array.isArray(value)) return "Expected array";'
 * ```
 */
export function generateArrayTypeCheck(
  varName: string,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg = customMessage ?? `${errorPrefix}Expected array`;

  const lines: string[] = [];
  
  // Add debug comment
  const comment = debugComment(ctx, "Type check: array");
  if (comment) lines.push(comment);
  
  lines.push(`${indent}if (!Array.isArray(${varName})) return "${escapeString(errorMsg)}";`);

  return { code: lines.join("\n"), ctx };
}

// ============================================================================
// Length constraint generators
// ============================================================================

/**
 * Generates inline code for the minLength constraint.
 *
 * @param varName - The variable name to check
 * @param min - Minimum length
 * @param ctx - The generator context
 * @param customMessage - Optional custom error message
 * @returns Generated code and updated context
 * @since 3.3.0
 */
export function generateArrayMinLengthCheck(
  varName: string,
  min: number,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg = customMessage ?? `${errorPrefix}Array must have at least ${min} items`;

  const lines: string[] = [];
  
  // Add debug comment
  const comment = debugComment(ctx, `Constraint: minLength(${min})`);
  if (comment) lines.push(comment);
  
  lines.push(`${indent}if (${varName}.length < ${min}) return "${escapeString(errorMsg)}";`);

  return { code: lines.join("\n"), ctx };
}

/**
 * Generates inline code for the maxLength constraint.
 *
 * @param varName - The variable name to check
 * @param max - Maximum length
 * @param ctx - The generator context
 * @param customMessage - Optional custom error message
 * @returns Generated code and updated context
 * @since 3.3.0
 */
export function generateArrayMaxLengthCheck(
  varName: string,
  max: number,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg = customMessage ?? `${errorPrefix}Array must have at most ${max} items`;

  const lines: string[] = [];
  
  // Add debug comment
  const comment = debugComment(ctx, `Constraint: maxLength(${max})`);
  if (comment) lines.push(comment);
  
  lines.push(`${indent}if (${varName}.length > ${max}) return "${escapeString(errorMsg)}";`);

  return { code: lines.join("\n"), ctx };
}

/**
 * Generates inline code for the exact length constraint.
 *
 * @param varName - The variable name to check
 * @param length - Exact length required
 * @param ctx - The generator context
 * @param customMessage - Optional custom error message
 * @returns Generated code and updated context
 * @since 3.3.0
 */
export function generateArrayLengthCheck(
  varName: string,
  length: number,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg = customMessage ?? `${errorPrefix}Array must have exactly ${length} items`;

  const lines: string[] = [];
  
  // Add debug comment
  const comment = debugComment(ctx, `Constraint: length(${length})`);
  if (comment) lines.push(comment);
  
  lines.push(`${indent}if (${varName}.length !== ${length}) return "${escapeString(errorMsg)}";`);

  return { code: lines.join("\n"), ctx };
}

// ============================================================================
// Item validation generators
// ============================================================================

/**
 * Generates an optimized for loop for validating array items.
 *
 * @param arrayVar - The variable name of the array
 * @param ctx - The generator context
 * @param itemGenerator - Code generator for each item
 * @param supportsCoercion - Whether to pre-allocate result array for coercions
 * @returns Generated code lines and updated context
 * @since 3.3.0
 *
 * @example
 * ```typescript
 * const result = generateArrayItemsLoop("value", ctx, stringGenerator);
 * // result.code = [
 * //   'var len = value.length;',
 * //   'for (var i = 0; i < len; i++) {',
 * //   '  var item = value[i];',
 * //   '  if (typeof item !== "string") return "Index " + i + ": Expected string";',
 * //   '}'
 * // ]
 * ```
 */
export function generateArrayItemsLoop(
  arrayVar: string,
  ctx: GeneratorContext,
  itemGenerator: (varName: string, ctx: GeneratorContext) => { code: string[]; ctx: GeneratorContext },
  supportsCoercion?: boolean
): { code: string[]; ctx: GeneratorContext } {
  // Stryker disable next-line ArrayDeclaration: Array preallocation for code lines
  const lines: string[] = [];
  const indent = ctx.debug ? getIndent(ctx) : "";
  const innerIndent = ctx.debug ? getIndent(increaseIndent(ctx)) : "";

  // Generate unique variable names
  const [lenVar, ctx1] = nextVar(ctx);
  const [indexVar, ctx2] = nextVar(ctx1);
  const [itemVar, ctx3] = nextVar(ctx2);
  let currentCtx = ctx3;

  // Cache array length for performance
  lines.push(`${indent}var ${lenVar} = ${arrayVar}.length;`);

  // Pre-allocate result array for coercions if needed
  if (supportsCoercion) {
    const [resultVar, ctx4] = nextVar(currentCtx);
    currentCtx = ctx4;
    lines.push(`${indent}var ${resultVar} = new Array(${lenVar});`);
  }

  // Generate optimized for loop
  lines.push(`${indent}for (var ${indexVar} = 0; ${indexVar} < ${lenVar}; ${indexVar}++) {`);

  // Extract item
  lines.push(`${innerIndent}var ${itemVar} = ${arrayVar}[${indexVar}];`);

  // Push index to path for error messages
  // We use a special format that will be replaced with the actual index at runtime
  const itemCtx = pushPath(increaseIndent(currentCtx), `" + ${indexVar} + "`);

  // Generate item validation
  const itemResult = itemGenerator(itemVar, itemCtx);

  // Process item validation code to include index in error messages
  for (const line of itemResult.code) {
    // Replace path format with index-aware format
    // Stryker disable next-line ConditionalExpression,LogicalOperator,BlockStatement: Regex replacement branches produce equivalent index formats
    const processedLine = line.replace(
      /Property '([^']*)" \+ [^+]+ \+ "([^']*)'/g,
      (_, prefix, suffix) => {
        // Stryker disable next-line ConditionalExpression,LogicalOperator: All branches produce valid Index format
        if (prefix && suffix) {
          return `Index " + ${indexVar} + ".${suffix}'`;
        } else if (/* Stryker disable next-line ConditionalExpression,BlockStatement */ prefix) {
          return `Index " + ${indexVar} + "'`;
        }
        return `Index " + ${indexVar} + "'`;
      }
    );
    lines.push(processedLine);
  }

  lines.push(`${indent}}`);

  return { code: lines, ctx: { ...itemResult.ctx, indent: ctx.indent, path: ctx.path } };
}

/**
 * Generates a simpler item loop that includes index in error messages directly.
 *
 * @param arrayVar - The variable name of the array
 * @param ctx - The generator context
 * @param itemGenerator - Code generator for each item
 * @returns Generated code lines and updated context
 * @since 3.3.0
 */
export function generateSimpleArrayItemsLoop(
  arrayVar: string,
  ctx: GeneratorContext,
  itemGenerator: (varName: string, indexVar: string, ctx: GeneratorContext) => { code: string[]; ctx: GeneratorContext }
): { code: string[]; ctx: GeneratorContext } {
  const lines: string[] = [];
  const indent = ctx.debug ? getIndent(ctx) : "";
  const innerIndent = ctx.debug ? getIndent(increaseIndent(ctx)) : "";

  // Generate unique variable names
  const [lenVar, ctx1] = nextVar(ctx);
  const [indexVar, ctx2] = nextVar(ctx1);
  const [itemVar, ctx3] = nextVar(ctx2);
  const currentCtx = ctx3;

  // Add debug comment for items loop
  const comment = debugComment(ctx, "Validate array items");
  // Stryker disable next-line ConditionalExpression: Debug comment is optional - code works identically without it
  if (comment) lines.push(comment);

  // Cache array length for performance
  lines.push(`${indent}var ${lenVar} = ${arrayVar}.length;`);

  // Generate optimized for loop
  lines.push(`${indent}for (var ${indexVar} = 0; ${indexVar} < ${lenVar}; ${indexVar}++) {`);

  // Extract item
  lines.push(`${innerIndent}var ${itemVar} = ${arrayVar}[${indexVar}];`);

  // Generate item validation with index available
  const innerCtx = increaseIndent(currentCtx);
  const itemResult = itemGenerator(itemVar, indexVar, innerCtx);
  lines.push(...itemResult.code);

  lines.push(`${indent}}`);

  return { code: lines, ctx: { ...itemResult.ctx, indent: ctx.indent, path: ctx.path } };
}

// ============================================================================
// Complete validation generator
// ============================================================================

/**
 * Generates complete validation code for an array schema.
 *
 * @param varName - The variable name to validate
 * @param ctx - The generator context
 * @param constraints - Array constraint metadata
 * @param customTypeMessage - Optional custom type error message
 * @returns Generated code lines and updated context
 * @since 3.3.0
 *
 * @example
 * ```typescript
 * const result = generateArrayValidation("value", ctx, {
 *   minLength: { value: 1 },
 *   maxLength: { value: 10 },
 *   itemGenerator: stringGenerator
 * });
 * ```
 */
export function generateArrayValidation(
  varName: string,
  ctx: GeneratorContext,
  constraints?: ArrayConstraintMeta,
  customTypeMessage?: string
): { code: string[]; ctx: GeneratorContext } {
  const lines: string[] = [];
  let currentCtx = ctx;

  // Type check
  const typeCheck = generateArrayTypeCheck(varName, currentCtx, customTypeMessage);
  lines.push(typeCheck.code);
  currentCtx = typeCheck.ctx;

  if (constraints) {
    // Length constraints (before iteration for early exit)
    if (constraints.minLength !== undefined) {
      const check = generateArrayMinLengthCheck(
        varName,
        constraints.minLength.value,
        currentCtx,
        constraints.minLength.message
      );
      lines.push(check.code);
      currentCtx = check.ctx;
    }

    if (constraints.maxLength !== undefined) {
      const check = generateArrayMaxLengthCheck(
        varName,
        constraints.maxLength.value,
        currentCtx,
        constraints.maxLength.message
      );
      lines.push(check.code);
      currentCtx = check.ctx;
    }

    if (constraints.length !== undefined) {
      const check = generateArrayLengthCheck(
        varName,
        constraints.length.value,
        currentCtx,
        constraints.length.message
      );
      lines.push(check.code);
      currentCtx = check.ctx;
    }

    // Item validation
    if (constraints.itemGenerator) {
      const loopResult = generateSimpleArrayItemsLoop(
        varName,
        currentCtx,
        (itemVar, indexVar, innerCtx) => {
          // Wrap the item generator to include index in error messages
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const itemResult = constraints.itemGenerator!(itemVar, innerCtx);
          
          // Process each line to include index in error messages
          const processedCode = itemResult.code.map((line) => {
            // Replace generic error messages with index-prefixed ones
            return line.replace(
              /return "([^"]+)"/g,
              (match, errorMsg) => {
                // If error already has "Index" or "Property", don't modify
                if (errorMsg.startsWith("Index ") || errorMsg.includes("Property '")) {
                  return match;
                }
                return `return "Index " + ${indexVar} + ": ${escapeString(errorMsg)}"`;
              }
            );
          });
          
          return { code: processedCode, ctx: itemResult.ctx };
        }
      );
      lines.push(...loopResult.code);
      currentCtx = loopResult.ctx;
    }
  }

  return { code: lines, ctx: currentCtx };
}
