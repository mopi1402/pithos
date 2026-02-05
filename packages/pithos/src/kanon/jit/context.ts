/**
 * @module kanon/jit/context
 *
 * Generator Context for JIT Compilation
 *
 * Provides the context needed during code generation, including:
 * - Variable name generation
 * - Path tracking for error messages
 * - External function references (refinements)
 * - Debug mode settings
 * - Cycle detection
 *
 * @since 3.3.0
 * @experimental
 */

import type { GenericSchema } from "../types/base";

/**
 * Type for external values that can be stored in the context.
 * Can be either a refinement function or a RegExp pattern.
 *
 * @since 3.3.0
 */
export type ExternalValue = ((value: unknown) => boolean | string) | RegExp;

/**
 * Context used during code generation.
 *
 * This interface defines the state maintained while generating
 * validation code for a schema.
 *
 * @since 3.3.0
 */
export interface GeneratorContext {
  /** Counter for generating unique variable names */
  readonly varCounter: number;

  /** Current indentation level (for debug mode) */
  readonly indent: number;

  /** Current path in the object (for error messages) */
  readonly path: readonly string[];

  /** Map of external values (refinements or regex patterns) to be injected */
  readonly externals: Map<string, ExternalValue>;

  /** Whether debug mode is enabled (readable code with comments) */
  readonly debug: boolean;

  /** Set of schemas already visited (for cycle detection) */
  readonly visited: WeakSet<GenericSchema>;
}

/**
 * Options for creating a new generator context.
 *
 * @since 3.3.0
 */
export interface GeneratorContextOptions {
  /** Enable debug mode for readable code */
  debug?: boolean;
}

/**
 * Creates a new generator context with default values.
 *
 * @param options - Optional configuration
 * @returns A new GeneratorContext instance
 * @since 3.3.0
 *
 * @example
 * ```typescript
 * const ctx = createGeneratorContext({ debug: true });
 * const varName = nextVar(ctx); // "v_0"
 * ```
 */
export function createGeneratorContext(
  options?: GeneratorContextOptions
): GeneratorContext {
  return {
    varCounter: 0,
    indent: 0,
    path: [],
    externals: new Map(),
    debug: options?.debug ?? false,
    visited: new WeakSet(),
  };
}

/**
 * Generates the next unique variable name and returns updated context.
 *
 * @param ctx - The current context
 * @returns A tuple of [variableName, updatedContext]
 * @since 3.3.0
 *
 * @example
 * ```typescript
 * const [varName, newCtx] = nextVar(ctx);
 * // varName = "v_0", newCtx.varCounter = 1
 * ```
 */
export function nextVar(ctx: GeneratorContext): [string, GeneratorContext] {
  const varName = `v_${ctx.varCounter}`;
  return [
    varName,
    {
      ...ctx,
      varCounter: ctx.varCounter + 1,
    },
  ];
}

/**
 * Pushes a path segment and returns updated context.
 *
 * Used to track the current location in nested objects for error messages.
 *
 * @param ctx - The current context
 * @param segment - The path segment to add (property name or index)
 * @returns Updated context with the new path
 * @since 3.3.0
 *
 * @example
 * ```typescript
 * const ctx1 = pushPath(ctx, "user");
 * const ctx2 = pushPath(ctx1, "address");
 * // ctx2.path = ["user", "address"]
 * ```
 */
export function pushPath(ctx: GeneratorContext, segment: string): GeneratorContext {
  return {
    ...ctx,
    path: [...ctx.path, segment],
  };
}

/**
 * Pops the last path segment and returns updated context.
 *
 * @param ctx - The current context
 * @returns Updated context with the last path segment removed
 * @since 3.3.0
 *
 * @example
 * ```typescript
 * // ctx.path = ["user", "address"]
 * const newCtx = popPath(ctx);
 * // newCtx.path = ["user"]
 * ```
 */
export function popPath(ctx: GeneratorContext): GeneratorContext {
  return {
    ...ctx,
    path: ctx.path.slice(0, -1),
  };
}

/**
 * Adds an external value (refinement function or regex pattern) and returns its reference name.
 *
 * External values are stored in the context and injected at runtime.
 * This is necessary because refinement functions and regex patterns cannot be inlined.
 *
 * @param ctx - The current context
 * @param value - The external value to add (function or RegExp)
 * @returns A tuple of [referenceName, updatedContext]
 * @since 3.3.0
 *
 * @example
 * ```typescript
 * // Adding a refinement function
 * const isValidSlug = (value: string) => /^[a-z0-9-]+$/.test(value);
 * const [refName, newCtx] = addExternal(ctx, isValidSlug);
 * // refName = "ref_0"
 * // Generated code: `if (!externals.get("ref_0")(value)) return "...";`
 *
 * // Adding a regex pattern
 * const [refName2, newCtx2] = addExternal(ctx, /^[a-z]+$/);
 * // Generated code: `if (!externals.get("ref_0").test(value)) return "...";`
 * ```
 */
export function addExternal(
  ctx: GeneratorContext,
  value: ExternalValue
): [string, GeneratorContext] {
  const refName = `ref_${ctx.externals.size}`;
  const newExternals = new Map(ctx.externals);
  newExternals.set(refName, value);

  return [
    refName,
    {
      ...ctx,
      externals: newExternals,
    },
  ];
}

/**
 * Marks a schema as visited for cycle detection.
 *
 * Note: Since WeakSet is not iterable, we cannot create a copy.
 * Instead, we mutate the existing WeakSet. This is acceptable because
 * the visited set is only used during a single compilation pass.
 *
 * @param ctx - The current context
 * @param schema - The schema being visited
 * @returns Updated context with the schema marked as visited
 * @since 3.3.0
 */
export function markVisited(
  ctx: GeneratorContext,
  schema: GenericSchema
): GeneratorContext {
  // WeakSet is not iterable, so we add to the existing set
  // This is a controlled mutation during compilation
  ctx.visited.add(schema);
  return ctx;
}

/**
 * Checks if a schema has already been visited (cycle detection).
 *
 * @param ctx - The current context
 * @param schema - The schema to check
 * @returns true if the schema was already visited
 * @since 3.3.0
 */
export function hasVisited(
  ctx: GeneratorContext,
  schema: GenericSchema
): boolean {
  return ctx.visited.has(schema);
}

/**
 * Increases the indentation level (for debug mode).
 *
 * @param ctx - The current context
 * @returns Updated context with increased indentation
 * @since 3.3.0
 */
export function increaseIndent(ctx: GeneratorContext): GeneratorContext {
  return {
    ...ctx,
    indent: ctx.indent + 1,
  };
}

/**
 * Decreases the indentation level (for debug mode).
 *
 * @param ctx - The current context
 * @returns Updated context with decreased indentation
 * @since 3.3.0
 */
export function decreaseIndent(ctx: GeneratorContext): GeneratorContext {
  return {
    ...ctx,
    indent: Math.max(0, ctx.indent - 1),
  };
}

/**
 * Gets the current indentation string (for debug mode).
 *
 * @param ctx - The current context
 * @returns Indentation string (2 spaces per level)
 * @since 3.3.0
 */
export function getIndent(ctx: GeneratorContext): string {
  return "  ".repeat(ctx.indent);
}

/**
 * Formats the current path as a string for error messages.
 *
 * @param ctx - The current context
 * @returns Formatted path string
 * @since 3.3.0
 *
 * @example
 * ```typescript
 * // ctx.path = ["user", "address", "city"]
 * formatPath(ctx); // "user.address.city"
 *
 * // ctx.path = ["items", "0", "name"]
 * formatPath(ctx); // "items[0].name"
 * ```
 */
export function formatPath(ctx: GeneratorContext): string {
  // Stryker disable next-line ConditionalExpression: Early return optimization — reduce with "" initial produces "" for empty array identically
  if (ctx.path.length === 0) return "";

  return ctx.path.reduce((acc, segment, index) => {
    // Check if segment is a numeric index
    if (/^\d+$/.test(segment)) {
      return `${acc}[${segment}]`;
    }
    // First segment or after an index
    if (index === 0) {
      return segment;
    }
    return `${acc}.${segment}`;
  }, "");
}
