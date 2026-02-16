/**
 * @module kanon/jit/builders/composites/object
 *
 * Object Code Builder
 *
 * Generates inline JavaScript code for object type validation including:
 * - Type check: `typeof value === "object" && value !== null`
 * - Property validation with direct access `value.propName`
 * - Optional properties with `=== undefined` check
 * - Strict mode with extra keys verification
 * - Nested object support with recursive generation
 *
 * @since 2.0.0
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
import type { GenericSchema } from "../../../types/base";
import { escapeString, debugComment, type CodeGenResult } from "../../utils/code";

/**
 * Property definition for object schema.
 *
 * @since 2.0.0
 */
export interface ObjectPropertyMeta {
  /** The property name */
  name: string;
  /** Whether the property is optional */
  optional?: boolean;
  /** The schema for this property (used for nested generation) */
  schema?: GenericSchema;
  /** Code generator function for this property's value */
  generateCode?: (varName: string, ctx: GeneratorContext) => { code: string[]; ctx: GeneratorContext };
}

/**
 * Object constraint metadata for JIT compilation.
 *
 * @since 2.0.0
 */
export interface ObjectConstraintMeta {
  /** Properties to validate */
  properties: ObjectPropertyMeta[];
  /** Whether to use strict mode (reject extra keys) */
  strict?: boolean;
  /** Custom error message for strict mode violations */
  strictMessage?: string;
  /** Minimum number of keys */
  minKeys?: { value: number; message?: string };
  /** Maximum number of keys */
  maxKeys?: { value: number; message?: string };
}

// ============================================================================
// Type check generators
// ============================================================================

/**
 * Generates the type check code for an object value.
 *
 * @param varName - The variable name to check
 * @param ctx - The generator context
 * @param customMessage - Optional custom error message
 * @returns Generated code and updated context
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const result = generateObjectTypeCheck("value", ctx);
 * // result.code = 'if (typeof value !== "object" || value === null) return "Expected object";'
 * ```
 */
export function generateObjectTypeCheck(
  varName: string,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg = customMessage ?? `${errorPrefix}Expected object`;

  const lines: string[] = [];
  
  // Add debug comment
  const comment = debugComment(ctx, "Type check: object");
  if (comment) lines.push(comment);
  
  lines.push(`${indent}if (typeof ${varName} !== "object" || ${varName} === null) return "${escapeString(errorMsg)}";`);

  return { code: lines.join("\n"), ctx };
}

// ============================================================================
// Property validation generators
// ============================================================================

/**
 * Generates code to extract and validate a single property.
 *
 * @param objectVar - The variable name of the object
 * @param prop - The property metadata
 * @param ctx - The generator context
 * @returns Generated code lines and updated context
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const result = generatePropertyValidation("value", { name: "age", optional: false }, ctx);
 * // result.code = [
 * //   'var v_0 = value["age"];',
 * //   'if (v_0 === undefined) return "Property \'age\': Required";',
 * //   // ... property type validation
 * // ]
 * ```
 */
export function generatePropertyValidation(
  objectVar: string,
  prop: ObjectPropertyMeta,
  ctx: GeneratorContext
): { code: string[]; ctx: GeneratorContext } {
  const lines: string[] = [];
  const indent = ctx.debug ? getIndent(ctx) : "";
  const escapedPropName = escapeString(prop.name);

  // Add debug comment for property
  // Stryker disable next-line StringLiteral: Debug comment suffix is cosmetic - doesn't affect validation
  const comment = debugComment(ctx, `Property: ${prop.name}${prop.optional ? " (optional)" : ""}`);
  if (comment) lines.push(comment);

  // Generate unique variable name for this property
  const [propVar, ctxAfterVar] = nextVar(ctx);
  let currentCtx = ctxAfterVar;

  // Extract property value
  lines.push(`${indent}var ${propVar} = ${objectVar}["${escapedPropName}"];`);

  // Push path for error messages
  currentCtx = pushPath(currentCtx, prop.name);

  if (prop.optional) {
    // Optional property: only validate if not undefined
    if (prop.generateCode) {
      // Generate validation code wrapped in undefined check
      const innerCtx = increaseIndent(currentCtx);
      
      lines.push(`${indent}if (${propVar} !== undefined) {`);
      
      const validationResult = prop.generateCode(propVar, innerCtx);
      lines.push(...validationResult.code);
      currentCtx = { ...validationResult.ctx, indent: currentCtx.indent, path: currentCtx.path };
      
      lines.push(`${indent}}`);
    }
    // If no generateCode, optional property with no validation is always valid
  } else {
    // Required property: validate directly (V3 doesn't have a special "Required" check,
    // it just calls the property schema's validator with undefined)
    if (prop.generateCode) {
      const validationResult = prop.generateCode(propVar, currentCtx);
      lines.push(...validationResult.code);
      currentCtx = { ...validationResult.ctx, path: currentCtx.path };
    }
  }

  return { code: lines, ctx: currentCtx };
}

// ============================================================================
// Strict mode generators
// ============================================================================

/**
 * Generates code to check for extra keys in strict mode.
 *
 * @param objectVar - The variable name of the object
 * @param allowedKeys - Array of allowed property names
 * @param ctx - The generator context
 * @param customMessage - Optional custom error message
 * @returns Generated code lines and updated context
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const result = generateStrictModeCheck("value", ["name", "age"], ctx);
 * // result.code = [
 * //   'for (var k in value) {',
 * //   '  if (Object.prototype.hasOwnProperty.call(value, k)) {',
 * //   '    if (k !== "name" && k !== "age") return "Unexpected property: " + k;',
 * //   '  }',
 * //   '}'
 * // ]
 * ```
 */
export function generateStrictModeCheck(
  objectVar: string,
  allowedKeys: string[],
  ctx: GeneratorContext,
  customMessage?: string
): { code: string[]; ctx: GeneratorContext } {
  const lines: string[] = [];
  const indent = ctx.debug ? getIndent(ctx) : "";
  const innerIndent = ctx.debug ? getIndent(increaseIndent(ctx)) : "";
  const innerIndent2 = ctx.debug ? getIndent(increaseIndent(increaseIndent(ctx))) : "";

  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg = customMessage ?? `${errorPrefix}Unexpected property: `;

  // Add debug comment for strict mode check
  const comment = debugComment(ctx, "Strict mode: check for unexpected properties");
  // Stryker disable next-line ConditionalExpression: Debug comment is optional - code works identically without it
  if (comment) lines.push(comment);

  // Generate key check using for...in with hasOwnProperty
  const [keyVar, ctxAfterVar] = nextVar(ctx);

  lines.push(`${indent}for (var ${keyVar} in ${objectVar}) {`);
  lines.push(`${innerIndent}if (Object.prototype.hasOwnProperty.call(${objectVar}, ${keyVar})) {`);

  if (allowedKeys.length === 0) {
    // No keys allowed - any key is invalid
    lines.push(`${innerIndent2}return "${escapeString(errorMsg)}" + ${keyVar};`);
  } else {
    // Generate condition for allowed keys
    const keyChecks = allowedKeys.map((key) => `${keyVar} !== "${escapeString(key)}"`).join(" && ");
    lines.push(`${innerIndent2}if (${keyChecks}) return "${escapeString(errorMsg)}" + ${keyVar};`);
  }

  lines.push(`${innerIndent}}`);
  lines.push(`${indent}}`);

  return { code: lines, ctx: ctxAfterVar };
}

// ============================================================================
// Key count constraint generators
// ============================================================================

/**
 * Generates code to check minimum number of keys.
 *
 * @param objectVar - The variable name of the object
 * @param minKeys - Minimum number of keys required
 * @param ctx - The generator context
 * @param customMessage - Optional custom error message
 * @returns Generated code and updated context
 * @since 2.0.0
 */
export function generateMinKeysCheck(
  objectVar: string,
  minKeys: number,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg = customMessage ?? `${errorPrefix}Object must have at least ${minKeys} keys`;

  const code = `${indent}if (Object.keys(${objectVar}).length < ${minKeys}) return "${escapeString(errorMsg)}";`;

  return { code, ctx };
}

/**
 * Generates code to check maximum number of keys.
 *
 * @param objectVar - The variable name of the object
 * @param maxKeys - Maximum number of keys allowed
 * @param ctx - The generator context
 * @param customMessage - Optional custom error message
 * @returns Generated code and updated context
 * @since 2.0.0
 */
export function generateMaxKeysCheck(
  objectVar: string,
  maxKeys: number,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg = customMessage ?? `${errorPrefix}Object must have at most ${maxKeys} keys`;

  const code = `${indent}if (Object.keys(${objectVar}).length > ${maxKeys}) return "${escapeString(errorMsg)}";`;

  return { code, ctx };
}

// ============================================================================
// Complete validation generator
// ============================================================================

/**
 * Generates complete validation code for an object schema.
 *
 * @param varName - The variable name to validate
 * @param ctx - The generator context
 * @param constraints - Object constraint metadata
 * @param customTypeMessage - Optional custom type error message
 * @returns Generated code lines and updated context
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const result = generateObjectValidation("value", ctx, {
 *   properties: [
 *     { name: "name", optional: false, generateCode: generateStringValidation },
 *     { name: "age", optional: true, generateCode: generateNumberValidation }
 *   ],
 *   strict: true
 * });
 * ```
 */
export function generateObjectValidation(
  varName: string,
  ctx: GeneratorContext,
  constraints?: ObjectConstraintMeta,
  customTypeMessage?: string
): { code: string[]; ctx: GeneratorContext } {
  const lines: string[] = [];
  let currentCtx = ctx;

  // Type check
  const typeCheck = generateObjectTypeCheck(varName, currentCtx, customTypeMessage);
  lines.push(typeCheck.code);
  currentCtx = typeCheck.ctx;

  if (constraints) {
    // Key count constraints (before property validation for early exit)
    if (constraints.minKeys !== undefined) {
      const check = generateMinKeysCheck(
        varName,
        constraints.minKeys.value,
        currentCtx,
        constraints.minKeys.message
      );
      lines.push(check.code);
      currentCtx = check.ctx;
    }

    if (constraints.maxKeys !== undefined) {
      const check = generateMaxKeysCheck(
        varName,
        constraints.maxKeys.value,
        currentCtx,
        constraints.maxKeys.message
      );
      lines.push(check.code);
      currentCtx = check.ctx;
    }

    // Strict mode check (before property validation to fail fast on extra keys)
    if (constraints.strict) {
      const allowedKeys = constraints.properties.map((p) => p.name);
      const strictCheck = generateStrictModeCheck(
        varName,
        allowedKeys,
        currentCtx,
        constraints.strictMessage
      );
      lines.push(...strictCheck.code);
      currentCtx = strictCheck.ctx;
    }

    // Property validations
    for (const prop of constraints.properties) {
      const propResult = generatePropertyValidation(varName, prop, currentCtx);
      lines.push(...propResult.code);
      // Preserve varCounter but reset path
      currentCtx = {
        ...propResult.ctx,
        path: ctx.path,
      };
    }
  }

  return { code: lines, ctx: currentCtx };
}

// ============================================================================
// Nested object support
// ============================================================================

/**
 * Creates a code generator function for a nested object.
 * This allows recursive object validation.
 *
 * @param nestedConstraints - Constraints for the nested object
 * @returns A code generator function
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const addressGenerator = createNestedObjectGenerator({
 *   properties: [
 *     { name: "street", generateCode: stringGenerator },
 *     { name: "city", generateCode: stringGenerator }
 *   ]
 * });
 *
 * const result = generateObjectValidation("value", ctx, {
 *   properties: [
 *     { name: "address", generateCode: addressGenerator }
 *   ]
 * });
 * ```
 */
export function createNestedObjectGenerator(
  nestedConstraints: ObjectConstraintMeta
): (varName: string, ctx: GeneratorContext) => { code: string[]; ctx: GeneratorContext } {
  return (varName: string, ctx: GeneratorContext) => {
    return generateObjectValidation(varName, ctx, nestedConstraints);
  };
}
