/**
 * @module kanon/jit/builders/primitives/boolean
 *
 * Boolean Code Builder
 *
 * Generates inline JavaScript code for boolean type validation.
 * Boolean schemas have no additional constraints beyond type checking.
 *
 * @since 3.3.0
 * @experimental
 */

import type { GeneratorContext } from "../../context";
import { formatPath, getIndent } from "../../context";
import { escapeString, debugComment, type CodeGenResult } from "../../utils/code";
import { ERROR_MESSAGES_COMPOSITION } from "../../../core/consts/messages";

/**
 * Generates the type check code for a boolean value.
 *
 * @param varName - The variable name to check
 * @param ctx - The generator context
 * @param customMessage - Optional custom error message
 * @returns Generated code and updated context
 * @since 3.3.0
 *
 * @example
 * ```typescript
 * const result = generateBooleanTypeCheck("value", ctx);
 * // result.code = 'if (typeof value !== "boolean") return "Expected boolean";'
 * ```
 */
export function generateBooleanTypeCheck(
  varName: string,
  ctx: GeneratorContext,
  customMessage?: string
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";
  const errorMsg = customMessage ?? `${errorPrefix}${ERROR_MESSAGES_COMPOSITION.boolean}`;

  const lines: string[] = [];
  
  // Add debug comment
  const comment = debugComment(ctx, "Type check: boolean");
  if (comment) lines.push(comment);
  
  lines.push(`${indent}if (typeof ${varName} !== "boolean") return "${escapeString(errorMsg)}";`);

  return { code: lines.join("\n"), ctx };
}

/**
 * Generates complete validation code for a boolean schema.
 * Boolean schemas only have type checking, no additional constraints.
 *
 * @param varName - The variable name to validate
 * @param ctx - The generator context
 * @param customTypeMessage - Optional custom type error message
 * @returns Generated code lines and updated context
 * @since 3.3.0
 *
 * @example
 * ```typescript
 * const result = generateBooleanValidation("value", ctx);
 * // result.code = ['if (typeof value !== "boolean") return "Expected boolean";']
 * ```
 */
export function generateBooleanValidation(
  varName: string,
  ctx: GeneratorContext,
  customTypeMessage?: string
): { code: string[]; ctx: GeneratorContext } {
  const typeCheck = generateBooleanTypeCheck(varName, ctx, customTypeMessage);
  return { code: [typeCheck.code], ctx: typeCheck.ctx };
}
