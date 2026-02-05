/**
 * @module kanon/jit/utils/code
 *
 * Common utilities for JIT code builders.
 *
 * @since 3.3.0
 * @experimental
 */

import type { GeneratorContext } from "../context";
import { getIndent } from "../context";

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
 * Escapes special characters in a string for use in generated code.
 *
 * @param str - The string to escape
 * @returns Escaped string safe for use in generated JavaScript
 * @since 3.3.0
 *
 * @example
 * ```typescript
 * escapeString('Hello "World"'); // 'Hello \\"World\\"'
 * escapeString('Line1\nLine2'); // 'Line1\\nLine2'
 * ```
 */
export function escapeString(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
}

/**
 * Generates a debug comment for the generated code.
 * Only produces output when debug mode is enabled.
 *
 * @param ctx - The generator context
 * @param comment - The comment text
 * @returns The formatted comment string, or empty string if not in debug mode
 * @since 3.3.0
 *
 * @example
 * ```typescript
 * debugComment(ctx, "Type check: string");
 * // In debug mode: "  // Type check: string"
 * // Not in debug mode: ""
 * ```
 */
export function debugComment(ctx: GeneratorContext, comment: string): string {
  if (!ctx.debug) return "";
  const indent = getIndent(ctx);
  return `${indent}// ${comment}`;
}

/**
 * Generates a debug comment with a blank line before it.
 * Useful for separating sections in the generated code.
 *
 * @param ctx - The generator context
 * @param comment - The comment text
 * @returns The formatted comment with preceding blank line, or empty string if not in debug mode
 * @since 3.3.0
 */
export function debugSectionComment(ctx: GeneratorContext, comment: string): string {
  if (!ctx.debug) return "";
  const indent = getIndent(ctx);
  return `\n${indent}// ${comment}`;
}


/**
 * Wraps code lines with debug comments indicating the validation being performed.
 * Returns the original lines if not in debug mode.
 *
 * @param ctx - The generator context
 * @param description - Description of what is being validated
 * @param lines - The code lines to wrap
 * @returns Array of code lines, potentially with debug comments
 * @since 3.3.0
 */
export function wrapWithDebugComment(
  ctx: GeneratorContext,
  description: string,
  lines: string[]
): string[] {
  if (!ctx.debug || lines.length === 0) return lines;
  const comment = debugComment(ctx, description);
  return [comment, ...lines];
}
