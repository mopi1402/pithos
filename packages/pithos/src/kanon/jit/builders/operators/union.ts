/**
 * @module kanon/jit/builders/operators/union
 *
 * Union Code Builder
 *
 * Generates inline JavaScript code for union type validation including:
 * - Sequential branch checks with early return
 * - Optimized typeof grouping for primitive unions
 * - Combined error messages when no branch validates
 *
 * @since 3.3.0
 * @experimental
 */

import type { GeneratorContext } from "../../context";
import {
  formatPath,
  getIndent,
  nextVar,
} from "../../context";
import { escapeString, debugComment } from "../../utils/code";
import { ERROR_MESSAGES_COMPOSITION } from "../../../core/consts/messages";

/**
 * Union branch definition for code generation.
 *
 * @since 3.3.0
 */
export interface UnionBranchMeta {
  /** Human-readable type name for error messages */
  typeName: string;
  /** Code generator for this branch */
  generateCode: (varName: string, ctx: GeneratorContext) => { code: string[]; ctx: GeneratorContext };
  /** Optional quick typeof check for optimization */
  typeofCheck?: string;
}

/**
 * Union constraint metadata for JIT compilation.
 *
 * @since 3.3.0
 */
export interface UnionConstraintMeta {
  /** Branches of the union */
  branches: UnionBranchMeta[];
  /** Custom error message when no branch matches */
  errorMessage?: string;
}

// ============================================================================
// Primitive typeof optimization
// ============================================================================

/**
 * Groups union branches by their typeof check for optimization.
 * Primitive unions like `string | number` can use a single typeof check.
 *
 * @param branches - Union branches to analyze
 * @returns Map of typeof values to branch indices
 * @since 3.3.0
 */
export function groupBranchesByTypeof(
  branches: UnionBranchMeta[]
): Map<string, number[]> {
  const groups = new Map<string, number[]>();

  branches.forEach((branch, index) => {
    if (branch.typeofCheck) {
      const existing = groups.get(branch.typeofCheck) ?? [];
      existing.push(index);
      groups.set(branch.typeofCheck, existing);
    }
  });

  return groups;
}

/**
 * Checks if all branches are simple primitive types that can be optimized.
 *
 * @param branches - Union branches to check
 * @returns true if all branches have typeof checks
 * @since 3.3.0
 */
export function canOptimizeWithTypeof(branches: UnionBranchMeta[]): boolean {
  return branches.every((b) => b.typeofCheck !== undefined);
}

// ============================================================================
// Union validation generators
// ============================================================================

/**
 * Generates optimized union check for primitive types using typeof.
 *
 * @param varName - The variable name to check
 * @param branches - Union branches (must all have typeofCheck)
 * @param ctx - The generator context
 * @param errorMessage - Custom error message
 * @returns Generated code and updated context
 * @since 3.3.0
 *
 * @example
 * ```typescript
 * // For union([string(), number()])
 * const result = generateOptimizedPrimitiveUnion("value", branches, ctx);
 * // result.code = 'if (typeof value !== "string" && typeof value !== "number") return "Expected string or number";'
 * ```
 */
export function generateOptimizedPrimitiveUnion(
  varName: string,
  branches: UnionBranchMeta[],
  ctx: GeneratorContext,
  errorMessage?: string
): { code: string[]; ctx: GeneratorContext } {
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";

  const lines: string[] = [];

  // Add debug comment
  const typeNames = branches.map((b) => b.typeName).join(" | ");
  const comment = debugComment(ctx, `Union check: ${typeNames} (optimized)`);
  if (comment) lines.push(comment);

  // Build typeof checks
  const typeofChecks = branches
    .map((b) => `typeof ${varName} !== "${b.typeofCheck}"`)
    .join(" && ");

  // Build error message
  const errorMsg = errorMessage ?? `${errorPrefix}${ERROR_MESSAGES_COMPOSITION.union}`;

  // Special handling for number to exclude NaN
  const hasNumber = branches.some((b) => b.typeofCheck === "number");
  let nanCheck = "";
  if (hasNumber) {
    nanCheck = ` || Number.isNaN(${varName})`;
  }

  const errorLine = `${indent}if ((${typeofChecks})${nanCheck}) return "${escapeString(errorMsg)}";`;
  const successLine = `${indent}return true;`;

  lines.push(errorLine, successLine);

  return { code: lines, ctx };
}

/**
 * Generates a simpler sequential union using inline checks.
 * Each branch is checked in sequence with early return on success.
 *
 * @param varName - The variable name to check
 * @param branches - Union branches
 * @param ctx - The generator context
 * @param errorMessage - Custom error message
 * @returns Generated code and updated context
 * @since 3.3.0
 */
export function generateSimpleSequentialUnion(
  varName: string,
  branches: UnionBranchMeta[],
  ctx: GeneratorContext,
  errorMessage?: string
): { code: string[]; ctx: GeneratorContext } {
  const lines: string[] = [];
  const indent = ctx.debug ? getIndent(ctx) : "";
  const path = formatPath(ctx);
  const errorPrefix = path ? `Property '${path}': ` : "";

  let currentCtx = ctx;

  // Add debug comment
  const typeNames = branches.map((b) => b.typeName).join(" | ");
  const comment = debugComment(ctx, `Union check: ${typeNames} (sequential)`);
  if (comment) lines.push(comment);

  // For each branch, generate a validation block
  for (let i = 0; i < branches.length; i++) {
    const branch = branches[i];

    // Generate branch validation
    const branchResult = branch.generateCode(varName, currentCtx);
    currentCtx = branchResult.ctx;

    // Convert validation code to a condition check
    // We need to invert the logic: if validation passes, return true
    if (branch.typeofCheck) {
      // Simple typeof check - can be inlined
      if (branch.typeofCheck === "number") {
        lines.push(
          `${indent}if (typeof ${varName} === "number" && !Number.isNaN(${varName})) return true;`
        );
      } else {
        lines.push(`${indent}if (typeof ${varName} === "${branch.typeofCheck}") return true;`);
      }
    } else {
      // Complex validation - use the generated code
      // Wrap in a validation function pattern
      const [validVar, ctx2] = nextVar(currentCtx);
      currentCtx = ctx2;

      lines.push(`${indent}var ${validVar} = (function() {`);
      for (const line of branchResult.code) {
        lines.push(`${indent}  ${line.trim()}`);
      }
      lines.push(`${indent}  return true;`);
      lines.push(`${indent}})();`);
      lines.push(`${indent}if (${validVar} === true) return true;`);
    }
  }

  // If no branch matched, return error
  const errorMsg = errorMessage ?? `${errorPrefix}${ERROR_MESSAGES_COMPOSITION.union}`;
  lines.push(`${indent}return "${escapeString(errorMsg)}";`);

  return { code: lines, ctx: currentCtx };
}

// ============================================================================
// Complete validation generator
// ============================================================================

/**
 * Generates complete validation code for a union schema.
 * Automatically chooses the best strategy based on branch types.
 *
 * @param varName - The variable name to validate
 * @param ctx - The generator context
 * @param constraints - Union constraint metadata
 * @returns Generated code lines and updated context
 * @since 3.3.0
 *
 * @example
 * ```typescript
 * const result = generateUnionValidation("value", ctx, {
 *   branches: [
 *     { typeName: "string", typeofCheck: "string", generateCode: stringGenerator },
 *     { typeName: "number", typeofCheck: "number", generateCode: numberGenerator }
 *   ]
 * });
 * ```
 */
export function generateUnionValidation(
  varName: string,
  ctx: GeneratorContext,
  constraints: UnionConstraintMeta
): { code: string[]; ctx: GeneratorContext } {
  const { branches, errorMessage } = constraints;

  // Empty union - always fails
  if (branches.length === 0) {
    const indent = ctx.debug ? getIndent(ctx) : "";
    const path = formatPath(ctx);
    const errorPrefix = path ? `Property '${path}': ` : "";
    const errorMsg = errorMessage ?? `${errorPrefix}No valid type in union`;
    return {
      code: [`${indent}return "${escapeString(errorMsg)}";`],
      ctx,
    };
  }

  // Single branch - just use that branch's validation
  if (branches.length === 1) {
    return branches[0].generateCode(varName, ctx);
  }

  // Check if we can optimize with typeof
  if (canOptimizeWithTypeof(branches)) {
    return generateOptimizedPrimitiveUnion(varName, branches, ctx, errorMessage);
  }

  // Fall back to simple sequential validation
  return generateSimpleSequentialUnion(varName, branches, ctx, errorMessage);
}

// ============================================================================
// Helper functions for creating branch metadata
// ============================================================================

/**
 * Creates a branch metadata for a string type.
 *
 * @param generateCode - Code generator function for this branch.
 * @returns Branch metadata with type information and code generator.
 * @since 3.3.0
 */
export function createStringBranch(
  generateCode: (varName: string, ctx: GeneratorContext) => { code: string[]; ctx: GeneratorContext }
): UnionBranchMeta {
  return {
    typeName: "string",
    typeofCheck: "string",
    generateCode,
  };
}

/**
 * Creates a branch metadata for a number type.
 *
 * @param generateCode - Code generator function for this branch.
 * @returns Branch metadata with type information and code generator.
 * @since 3.3.0
 */
export function createNumberBranch(
  generateCode: (varName: string, ctx: GeneratorContext) => { code: string[]; ctx: GeneratorContext }
): UnionBranchMeta {
  return {
    typeName: "number",
    typeofCheck: "number",
    generateCode,
  };
}

/**
 * Creates a branch metadata for a boolean type.
 *
 * @param generateCode - Code generator function for this branch.
 * @returns Branch metadata with type information and code generator.
 * @since 3.3.0
 */
export function createBooleanBranch(
  generateCode: (varName: string, ctx: GeneratorContext) => { code: string[]; ctx: GeneratorContext }
): UnionBranchMeta {
  return {
    typeName: "boolean",
    typeofCheck: "boolean",
    generateCode,
  };
}

/**
 * Creates a branch metadata for a null type.
 *
 * @returns Branch metadata for null type with inline === check.
 * @since 3.3.0
 */
export function createNullBranch(): UnionBranchMeta {
  return {
    typeName: "null",
    typeofCheck: undefined, // null requires === check, not typeof
    generateCode: (varName, ctx) => {
      const indent = ctx.debug ? getIndent(ctx) : "";
      return {
        code: [`${indent}if (${varName} !== null) return "Expected null";`],
        ctx,
      };
    },
  };
}

/**
 * Creates a branch metadata for an undefined type.
 *
 * @returns Branch metadata for undefined type with typeof check.
 * @since 3.3.0
 */
export function createUndefinedBranch(): UnionBranchMeta {
  return {
    typeName: "undefined",
    typeofCheck: "undefined",
    generateCode: (varName, ctx) => {
      const indent = ctx.debug ? getIndent(ctx) : "";
      return {
        code: [`${indent}if (${varName} !== undefined) return "Expected undefined";`],
        ctx,
      };
    },
  };
}
