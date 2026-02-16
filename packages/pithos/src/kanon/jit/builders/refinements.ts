/**
 * @module kanon/jit/builders/refinements
 *
 * Refinements Code Builder
 *
 * Generates inline JavaScript code for refinement function calls.
 * Refinements are user-defined validation functions that cannot be inlined
 * because their source code is not accessible. They are stored as external
 * functions and called via the externals map.
 *
 * @since 2.0.0
 * @experimental
 */

import type { GeneratorContext } from "../context";
import { formatPath, getIndent, addExternal } from "../context";
import { escapeString, type CodeGenResult } from "../utils/code";

/**
 * Refinement function type.
 * Returns true for valid values, or an error message string for invalid values.
 *
 * @template T - The type being validated
 * @since 2.0.0
 */
export type RefinementFn<T = unknown> = (value: T) => true | string;

/**
 * Options for refinement code generation.
 *
 * @since 2.0.0
 */
export interface RefinementOptions {
  /** Whether to prefix errors with the current path */
  prefixPath?: boolean;
}

/**
 * Generates code to call a single refinement function.
 *
 * The refinement is stored as an external function and called via
 * `externals.get("ref_N")(value)`. The result is checked and if it's
 * not `true`, the error message is returned.
 *
 * @param varName - The variable name to validate
 * @param refinement - The refinement function to call
 * @param ctx - The generator context
 * @param index - Optional index for debugging (refinement order)
 * @param options - Optional configuration for code generation
 * @returns Generated code and updated context
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const isValidSlug = (value: string) => /^[a-z0-9-]+$/.test(value) || "Invalid slug";
 * const result = generateRefinementCall("value", isValidSlug, ctx);
 * // Generated code:
 * // var ref_result_0 = externals.get("ref_0")(value);
 * // if (ref_result_0 !== true) return ref_result_0;
 * ```
 */
export function generateRefinementCall<T>(
  varName: string,
  refinement: RefinementFn<T>,
  ctx: GeneratorContext,
  index?: number,
  options?: RefinementOptions
): CodeGenResult {
  const indent = ctx.debug ? getIndent(ctx) : "";
  
  // Add the refinement as an external function
  const [refName, newCtx] = addExternal(ctx, refinement as RefinementFn<unknown>);
  
  // Generate unique result variable name
  const resultVar = `ref_result_${refName.replace("ref_", "")}`;
  
  // Generate the refinement call code
  // We call the refinement and check if the result is not true
  const lines: string[] = [];
  
  if (ctx.debug && index !== undefined) {
    lines.push(`${indent}// Refinement ${index + 1}`);
  }
  
  lines.push(`${indent}var ${resultVar} = externals.get("${refName}")(${varName});`);
  
  // If prefixPath is enabled and we have a path, wrap the error with the path
  if (options?.prefixPath) {
    const path = formatPath(ctx);
    if (path) {
      const errorPrefix = `Property '${escapeString(path)}': `;
      lines.push(`${indent}if (${resultVar} !== true) return "${errorPrefix}" + ${resultVar};`);
    } else {
      lines.push(`${indent}if (${resultVar} !== true) return ${resultVar};`);
    }
  } else {
    lines.push(`${indent}if (${resultVar} !== true) return ${resultVar};`);
  }
  
  const code = lines.join("\n");
  
  return { code, ctx: newCtx };
}

/**
 * Generates code to call multiple refinement functions in order.
 *
 * Refinements are called sequentially in the order they were defined.
 * If any refinement returns an error, validation stops and the error is returned.
 *
 * @param varName - The variable name to validate
 * @param refinements - Array of refinement functions to call
 * @param ctx - The generator context
 * @param options - Optional configuration for code generation
 * @returns Generated code lines and updated context
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const refinements = [
 *   (v: string) => v.length > 0 || "Cannot be empty",
 *   (v: string) => /^[a-z]+$/.test(v) || "Must be lowercase"
 * ];
 * const result = generateRefinementsValidation("value", refinements, ctx);
 * // Generated code calls each refinement in order
 * ```
 */
export function generateRefinementsValidation<T>(
  varName: string,
  refinements: ReadonlyArray<RefinementFn<T>>,
  ctx: GeneratorContext,
  options?: RefinementOptions
): { code: string[]; ctx: GeneratorContext } {
  const lines: string[] = [];
  let currentCtx = ctx;
  
  for (let i = 0; i < refinements.length; i++) {
    const refinement = refinements[i];
    const result = generateRefinementCall(varName, refinement, currentCtx, i, options);
    lines.push(result.code);
    currentCtx = result.ctx;
  }
  
  return { code: lines, ctx: currentCtx };
}

/**
 * Checks if a schema has refinements.
 *
 * @param schema - The schema to check
 * @returns True if the schema has refinements
 * @since 2.0.0
 */
export function hasRefinements(schema: { refinements?: unknown[] }): boolean {
  return Array.isArray(schema.refinements) && schema.refinements.length > 0;
}

/**
 * Gets the refinements from a schema.
 *
 * @param schema - The schema to get refinements from
 * @returns Array of refinement functions, or empty array if none
 * @since 2.0.0
 */
export function getRefinements<T>(
  schema: { refinements?: Array<RefinementFn<T>> }
): ReadonlyArray<RefinementFn<T>> {
  return schema.refinements ?? [];
}
