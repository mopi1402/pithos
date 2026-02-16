/**
 * @module kanon/jit/builders/primitives/string
 *
 * String Code Builder - Complete Implementation
 *
 * Generates inline JavaScript code for string type validation
 * including all constraints: minLength, maxLength, length, email, url, uuid,
 * regex, includes, startsWith, endsWith.
 *
 * @since 2.0.0
 * @experimental
 */

import type { GeneratorContext } from "../../context";
import { formatPath, getIndent, addExternal } from "../../context";
import { escapeString, debugComment, type CodeGenResult } from "../../utils/code";
import { EMAIL_REGEX, URL_REGEX, UUID_REGEX } from "../../../core/consts/patterns";
import { ERROR_MESSAGES_COMPOSITION } from "../../../core/consts/messages";

/**
 * String constraint metadata for JIT compilation.
 * These are extracted from the schema's refinements for inline code generation.
 *
 * @since 2.0.0
 */
export interface StringConstraintMeta {
  /** Minimum length constraint */
  minLength?: { value: number; message?: string };
  /** Maximum length constraint */
  maxLength?: { value: number; message?: string };
  /** Exact length constraint */
  length?: { value: number; message?: string };
  /** Email format constraint */
  email?: { message?: string };
  /** URL format constraint */
  url?: { message?: string };
  /** UUID format constraint */
  uuid?: { message?: string };
  /** Custom regex constraint */
  regex?: { pattern: RegExp; message?: string };
  /** Includes substring constraint */
  includes?: { value: string; message?: string };
  /** Starts with prefix constraint */
  startsWith?: { value: string; message?: string };
  /** Ends with suffix constraint */
  endsWith?: { value: string; message?: string };
}

// ============================================================================
// Base constraint generators
// ============================================================================

/**
 * Generates the type check code for a string value.
 *
 * @param varName - The variable name to check
 * @param ctx - The generator context
 * @param customMessage - Optional custom error message
 * @returns Generated code and updated context
 * @since 2.0.0
 */
export function generateStringTypeCheck(
  varName: string,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg = customMessage ?? `${errorPrefix}${ERROR_MESSAGES_COMPOSITION.string}`;

  // Stryker disable next-line ArrayDeclaration: lines array is filled by push below
  const lines: string[] = [];
  
  // Add debug comment
  const comment = debugComment(ctx, "Type check: string");
  // Stryker disable next-line ConditionalExpression: comment is empty string when no debug, push is harmless
  if (comment) lines.push(comment);
  
  lines.push(`${indent}if (typeof ${varName} !== "string") return "${escapeString(errorMsg)}";`);

  return { code: lines.join("\n"), ctx };
}

/**
 * Generates inline code for the minLength constraint.
 *
 * @param varName - The variable name to check.
 * @param min - Minimum length value.
 * @param ctx - The generator context.
 * @param customMessage - Optional custom error message.
 * @returns Generated code and updated context.
 * @since 2.0.0
 */
export function generateMinLengthCheck(
  varName: string,
  min: number,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg =
    customMessage ?? `${errorPrefix}${ERROR_MESSAGES_COMPOSITION.minLength(min)}`;

  // Stryker disable next-line ArrayDeclaration: lines array is filled by push below
  const lines: string[] = [];
  
  // Add debug comment
  const comment = debugComment(ctx, `Constraint: minLength(${min})`);
  // Stryker disable next-line ConditionalExpression: comment is empty string when no debug, push is harmless
  if (comment) lines.push(comment);
  
  lines.push(`${indent}if (${varName}.length < ${min}) return "${escapeString(errorMsg)}";`);

  return { code: lines.join("\n"), ctx };
}

/**
 * Generates inline code for the maxLength constraint.
 *
 * @param varName - The variable name to check.
 * @param max - Maximum length value.
 * @param ctx - The generator context.
 * @param customMessage - Optional custom error message.
 * @returns Generated code and updated context.
 * @since 2.0.0
 */
export function generateMaxLengthCheck(
  varName: string,
  max: number,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg =
    customMessage ?? `${errorPrefix}${ERROR_MESSAGES_COMPOSITION.maxLength(max)}`;

  // Stryker disable next-line ArrayDeclaration: lines array is filled by push below
  const lines: string[] = [];
  
  // Add debug comment
  const comment = debugComment(ctx, `Constraint: maxLength(${max})`);
  // Stryker disable next-line ConditionalExpression: comment is empty string when no debug, push is harmless
  if (comment) lines.push(comment);
  
  lines.push(`${indent}if (${varName}.length > ${max}) return "${escapeString(errorMsg)}";`);

  return { code: lines.join("\n"), ctx };
}

/**
 * Generates inline code for the exact length constraint.
 *
 * @param varName - The variable name to check.
 * @param length - Exact length value.
 * @param ctx - The generator context.
 * @param customMessage - Optional custom error message.
 * @returns Generated code and updated context.
 * @since 2.0.0
 */
export function generateLengthCheck(
  varName: string,
  length: number,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg =
    customMessage ?? `${errorPrefix}${ERROR_MESSAGES_COMPOSITION.length(length)}`;

  // Stryker disable next-line ArrayDeclaration: lines array is filled by push below
  const lines: string[] = [];
  
  // Add debug comment
  const comment = debugComment(ctx, `Constraint: length(${length})`);
  // Stryker disable next-line ConditionalExpression: comment is empty string when no debug, push is harmless
  if (comment) lines.push(comment);
  
  lines.push(`${indent}if (${varName}.length !== ${length}) return "${escapeString(errorMsg)}";`);

  return { code: lines.join("\n"), ctx };
}

// ============================================================================
// Advanced constraint generators
// ============================================================================

/**
 * Generates inline code for the email format constraint.
 * Uses externals to reference the shared EMAIL_REGEX pattern.
 *
 * @param varName - The variable name to check.
 * @param ctx - The generator context.
 * @param customMessage - Optional custom error message.
 * @returns Generated code and updated context.
 * @since 2.0.0
 */
export function generateEmailCheck(
  varName: string,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg = customMessage ?? `${errorPrefix}${ERROR_MESSAGES_COMPOSITION.email}`;

  // Use externals to reference the shared regex pattern
  const [refName, newCtx] = addExternal(ctx, EMAIL_REGEX);

  // Stryker disable next-line ArrayDeclaration: lines array is filled by push below
  const lines: string[] = [];

  // Add debug comment
  const comment = debugComment(ctx, "Constraint: email()");
  // Stryker disable next-line ConditionalExpression: comment is empty string when no debug, push is harmless
  if (comment) lines.push(comment);

  lines.push(`${indent}if (!externals.get("${refName}").test(${varName})) return "${escapeString(errorMsg)}";`);

  return { code: lines.join("\n"), ctx: newCtx };
}

/**
 * Generates inline code for the URL format constraint.
 * Uses externals to reference the shared URL_REGEX pattern.
 *
 * @param varName - The variable name to check.
 * @param ctx - The generator context.
 * @param customMessage - Optional custom error message.
 * @returns Generated code and updated context.
 * @since 2.0.0
 */
export function generateUrlCheck(
  varName: string,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg = customMessage ?? `${errorPrefix}${ERROR_MESSAGES_COMPOSITION.url}`;

  // Use externals to reference the shared regex pattern
  const [refName, newCtx] = addExternal(ctx, URL_REGEX);

  // Stryker disable next-line ArrayDeclaration: lines array is filled by push below
  const lines: string[] = [];
  
  // Add debug comment
  const comment = debugComment(ctx, "Constraint: url()");
  // Stryker disable next-line ConditionalExpression: comment is empty string when no debug, push is harmless
  if (comment) lines.push(comment);
  
  lines.push(`${indent}if (!externals.get("${refName}").test(${varName})) return "${escapeString(errorMsg)}";`);

  return { code: lines.join("\n"), ctx: newCtx };
}

/**
 * Generates inline code for the UUID format constraint.
 * Uses externals to reference the shared UUID_REGEX pattern.
 *
 * @param varName - The variable name to check.
 * @param ctx - The generator context.
 * @param customMessage - Optional custom error message.
 * @returns Generated code and updated context.
 * @since 2.0.0
 */
export function generateUuidCheck(
  varName: string,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg = customMessage ?? `${errorPrefix}${ERROR_MESSAGES_COMPOSITION.uuid}`;

  // Use externals to reference the shared regex pattern
  const [refName, newCtx] = addExternal(ctx, UUID_REGEX);

  // Stryker disable next-line ArrayDeclaration: lines array is filled by push below
  const lines: string[] = [];
  
  // Add debug comment
  const comment = debugComment(ctx, "Constraint: uuid()");
  // Stryker disable next-line ConditionalExpression: comment is empty string when no debug, push is harmless
  if (comment) lines.push(comment);
  
  lines.push(`${indent}if (!externals.get("${refName}").test(${varName})) return "${escapeString(errorMsg)}";`);

  return { code: lines.join("\n"), ctx: newCtx };
}

/**
 * Generates inline code for a custom regex constraint.
 * Uses externals to reference the regex pattern directly.
 *
 * @param varName - The variable name to check.
 * @param pattern - The regex pattern to match.
 * @param ctx - The generator context.
 * @param customMessage - Optional custom error message.
 * @returns Generated code and updated context.
 * @since 2.0.0
 */
export function generateRegexCheck(
  varName: string,
  pattern: RegExp,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg = customMessage ?? `${errorPrefix}${ERROR_MESSAGES_COMPOSITION.pattern(pattern)}`;

  // Use externals to reference the regex pattern directly (not a wrapper function)
  const [refName, newCtx] = addExternal(ctx, pattern);

  // Stryker disable next-line ArrayDeclaration: lines array is filled by push below
  const lines: string[] = [];
  
  // Add debug comment
  const comment = debugComment(ctx, `Constraint: regex(${pattern.toString()})`);
  // Stryker disable next-line ConditionalExpression: comment is empty string when no debug, push is harmless
  if (comment) lines.push(comment);
  
  lines.push(`${indent}if (!externals.get("${refName}").test(${varName})) return "${escapeString(errorMsg)}";`);

  return { code: lines.join("\n"), ctx: newCtx };
}

/**
 * Generates inline code for the includes constraint.
 *
 * @param varName - The variable name to check.
 * @param substring - The substring to search for.
 * @param ctx - The generator context.
 * @param customMessage - Optional custom error message.
 * @returns Generated code and updated context.
 * @since 2.0.0
 */
export function generateIncludesCheck(
  varName: string,
  substring: string,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg = customMessage ?? `${errorPrefix}${ERROR_MESSAGES_COMPOSITION.includes(substring)}`;

  // Stryker disable next-line ArrayDeclaration: lines array is filled by push below
  const lines: string[] = [];
  
  // Add debug comment
  const comment = debugComment(ctx, `Constraint: includes("${substring}")`);
  // Stryker disable next-line ConditionalExpression: comment is empty string when no debug, push is harmless
  if (comment) lines.push(comment);
  
  lines.push(`${indent}if (!${varName}.includes("${escapeString(substring)}")) return "${escapeString(errorMsg)}";`);

  return { code: lines.join("\n"), ctx };
}

/**
 * Generates inline code for the startsWith constraint.
 *
 * @param varName - The variable name to check.
 * @param prefix - The required prefix.
 * @param ctx - The generator context.
 * @param customMessage - Optional custom error message.
 * @returns Generated code and updated context.
 * @since 2.0.0
 */
export function generateStartsWithCheck(
  varName: string,
  prefix: string,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg = customMessage ?? `${errorPrefix}${ERROR_MESSAGES_COMPOSITION.startsWith(prefix)}`;

  // Stryker disable next-line ArrayDeclaration: lines array is filled by push below
  const lines: string[] = [];
  
  // Add debug comment
  const comment = debugComment(ctx, `Constraint: startsWith("${prefix}")`);
  // Stryker disable next-line ConditionalExpression: comment is empty string when no debug, push is harmless
  if (comment) lines.push(comment);
  
  lines.push(`${indent}if (!${varName}.startsWith("${escapeString(prefix)}")) return "${escapeString(errorMsg)}";`);

  return { code: lines.join("\n"), ctx };
}

/**
 * Generates inline code for the endsWith constraint.
 *
 * @param varName - The variable name to check.
 * @param suffix - The required suffix.
 * @param ctx - The generator context.
 * @param customMessage - Optional custom error message.
 * @returns Generated code and updated context.
 * @since 2.0.0
 */
export function generateEndsWithCheck(
  varName: string,
  suffix: string,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg = customMessage ?? `${errorPrefix}${ERROR_MESSAGES_COMPOSITION.endsWith(suffix)}`;

  // Stryker disable next-line ArrayDeclaration: lines array is filled by push below
  const lines: string[] = [];
  
  // Add debug comment
  const comment = debugComment(ctx, `Constraint: endsWith("${suffix}")`);
  // Stryker disable next-line ConditionalExpression: comment is empty string when no debug, push is harmless
  if (comment) lines.push(comment);
  
  lines.push(`${indent}if (!${varName}.endsWith("${escapeString(suffix)}")) return "${escapeString(errorMsg)}";`);

  return { code: lines.join("\n"), ctx };
}

// ============================================================================
// Complete validation generator
// ============================================================================

/**
 * Generates complete validation code for a string schema with all constraints.
 *
 * @param varName - The variable name to validate.
 * @param ctx - The generator context.
 * @param constraints - Optional string constraint metadata.
 * @param customTypeMessage - Optional custom type error message.
 * @returns Generated code lines and updated context.
 * @since 2.0.0
 */
export function generateStringValidation(
  varName: string,
  ctx: GeneratorContext,
  constraints?: StringConstraintMeta,
  customTypeMessage?: string
): { code: string[]; ctx: GeneratorContext } {
  const lines: string[] = [];
  let currentCtx = ctx;

  // Type check
  const typeCheck = generateStringTypeCheck(varName, currentCtx, customTypeMessage);
  lines.push(typeCheck.code);
  currentCtx = typeCheck.ctx;

  // Constraint checks
  if (constraints) {
    if (constraints.minLength !== undefined) {
      const check = generateMinLengthCheck(varName, constraints.minLength.value, currentCtx, constraints.minLength.message);
      lines.push(check.code);
      currentCtx = check.ctx;
    }

    if (constraints.maxLength !== undefined) {
      const check = generateMaxLengthCheck(varName, constraints.maxLength.value, currentCtx, constraints.maxLength.message);
      lines.push(check.code);
      currentCtx = check.ctx;
    }

    if (constraints.length !== undefined) {
      const check = generateLengthCheck(varName, constraints.length.value, currentCtx, constraints.length.message);
      lines.push(check.code);
      currentCtx = check.ctx;
    }

    if (constraints.email !== undefined) {
      const check = generateEmailCheck(varName, currentCtx, constraints.email.message);
      lines.push(check.code);
      currentCtx = check.ctx;
    }

    if (constraints.url !== undefined) {
      const check = generateUrlCheck(varName, currentCtx, constraints.url.message);
      lines.push(check.code);
      currentCtx = check.ctx;
    }

    if (constraints.uuid !== undefined) {
      const check = generateUuidCheck(varName, currentCtx, constraints.uuid.message);
      lines.push(check.code);
      currentCtx = check.ctx;
    }

    if (constraints.regex !== undefined) {
      const check = generateRegexCheck(varName, constraints.regex.pattern, currentCtx, constraints.regex.message);
      lines.push(check.code);
      currentCtx = check.ctx;
    }

    if (constraints.includes !== undefined) {
      const check = generateIncludesCheck(varName, constraints.includes.value, currentCtx, constraints.includes.message);
      lines.push(check.code);
      currentCtx = check.ctx;
    }

    if (constraints.startsWith !== undefined) {
      const check = generateStartsWithCheck(varName, constraints.startsWith.value, currentCtx, constraints.startsWith.message);
      lines.push(check.code);
      currentCtx = check.ctx;
    }

    if (constraints.endsWith !== undefined) {
      const check = generateEndsWithCheck(varName, constraints.endsWith.value, currentCtx, constraints.endsWith.message);
      lines.push(check.code);
      currentCtx = check.ctx;
    }
  }

  return { code: lines, ctx: currentCtx };
}

// Export regex patterns for testing
/**
 * Exported regex patterns for string validation.
 *
 * @since 2.0.0
 */
export const STRING_PATTERNS = {
  EMAIL: EMAIL_REGEX,
  URL: URL_REGEX,
  UUID: UUID_REGEX,
} as const;
