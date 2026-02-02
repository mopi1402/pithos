/**
 * Kanon V3 JIT Compiler
 *
 * Generates optimized JavaScript validators at runtime using `new Function()`.
 * Supports all schema types: primitives, composites, unions, and coercion.
 *
 * @since 3.3.0
 * @experimental
 *
 * ## Performance Results (January 2026)
 *
 * Test schema: Object with 5 properties (string, number, boolean, string, number)
 *
 * | Scenario        | V3 Non-Compiled | JIT Compiled | Fastest-Validator | JIT vs V3 |
 * |-----------------|-----------------|--------------|-------------------|-----------|
 * | Valid Objects   | 12.6M ops/s     | 23.6M ops/s  | 19.3M ops/s       | 1.88x     |
 * | Invalid Objects | 13.1M ops/s     | 23.5M ops/s  | 3.1M ops/s        | 1.80x     |
 *
 * ## CSP (Content Security Policy) Limitations
 *
 * The JIT compiler uses `new Function()` which is blocked in environments with
 * strict Content Security Policy (missing `'unsafe-eval'`).
 *
 * When JIT compilation fails, the system automatically falls back to the original
 * V3 non-compiled validator with `isFallback: true`.
 *
 * ## Refinements Support
 *
 * Refinements are user-defined validation functions that cannot be inlined.
 * They are stored as external functions and called via the externals map.
 * This introduces function call overhead but preserves correctness.
 */

import type { Schema, ValidatorResult, GenericSchema } from "../types/base";
import { createGeneratorContext, type GeneratorContext, type ExternalValue } from "./context";
import { globalValidatorCache } from "./cache";
import {
  hasRefinements,
  getRefinements,
  generateRefinementsValidation,
} from "./builders/refinements";

// Import primitive builders
import { generateStringValidation } from "./builders/primitives/string";
import { generateNumberValidation } from "./builders/primitives/number";
import { generateBooleanValidation } from "./builders/primitives/boolean";
import {
  generateNullValidation,
  generateUndefinedValidation,
  generateAnyValidation,
  generateUnknownValidation,
  generateNeverValidation,
  generateVoidValidation,
  generateSymbolValidation,
} from "./builders/primitives/others";

// Import composite builders
import { generateObjectValidation, type ObjectPropertyMeta } from "./builders/composites/object";
import { generateArrayValidation } from "./builders/composites/array";

// Import operator builders
import { generateUnionValidation, type UnionBranchMeta } from "./builders/operators/union";

// Import coercion builders
import {
  generateCoerceStringValidation,
  generateCoerceNumberValidation,
  generateCoerceBooleanValidation,
  generateCoerceDateValidation,
  isCoerceType,
} from "./builders/coerce";

/**
 * Compiled validator function with metadata.
 *
 * A compiled validator is a function that validates values against a schema.
 * It returns `true` for valid values, an error message string for invalid values,
 * or `{ coerced: T }` for coercion schemas.
 *
 * @typeParam T - The type that the validator validates
 *
 * @example
 * ```typescript
 * const validate: CompiledValidator<{ name: string }> = compile(schema);
 *
 * // Valid value
 * validate({ name: "John" }); // true
 *
 * // Invalid value
 * validate({ name: 123 }); // "Property 'name': Expected string"
 *
 * // Check if using fallback
 * if (validate.isFallback) {
 *   console.log("JIT not available, using V3 validator");
 * }
 *
 * // Debug mode - inspect generated code
 * const debugValidate = compile(schema, { debug: true });
 * console.log(debugValidate.source);
 * ```
 *
 * @since 3.3.0
 */
export type CompiledValidator<T> = ((value: unknown) => ValidatorResult<T>) & {
  /**
   * Generated source code (only available when compiled with `{ debug: true }`).
   * Useful for debugging and understanding the generated validation logic.
   */
  source?: string;
  /**
   * True if using V3 fallback due to CSP or other restrictions.
   * When true, the validator is the original V3 non-compiled validator.
   */
  isFallback?: boolean;
};

/**
 * Options for the compile function.
 *
 * @example
 * ```typescript
 * // Default compilation (cached, no debug)
 * const validate = compile(schema);
 *
 * // Debug mode - includes source code
 * const debugValidate = compile(schema, { debug: true });
 * console.log(debugValidate.source);
 *
 * // Disable caching (useful for testing)
 * const uncachedValidate = compile(schema, { noCache: true });
 *
 * // Force fallback (useful for testing CSP scenarios)
 * const fallbackValidate = compile(schema, { forceFallback: true });
 * ```
 *
 * @since 3.3.0
 */
export interface CompileOptions {
  /**
   * Enable debug mode to include source code in the result.
   * When true, the compiled validator will have a `source` property
   * containing the generated JavaScript code.
   * @default false
   */
  debug?: boolean;
  /**
   * Disable caching for this compilation.
   * By default, compiled validators are cached using a WeakMap.
   * Set to true to always generate a new validator.
   * @default false
   */
  noCache?: boolean;
  /**
   * Force fallback to V3 validator (for testing).
   * When true, the JIT compiler will skip compilation and return
   * the original V3 validator with `isFallback: true`.
   * @default false
   */
  forceFallback?: boolean;
}

/**
 * Extended schema interface for object schemas.
 */
interface ObjectSchemaExt extends GenericSchema {
  type: "object";
  entries: Record<string, GenericSchema>;
}

/**
 * Extended schema interface for array schemas.
 */
interface ArraySchemaExt extends GenericSchema {
  type: "array";
  itemSchema: GenericSchema;
}

/**
 * Extended schema interface for union schemas.
 */
interface UnionSchemaExt extends GenericSchema {
  type: "union";
  schemas: readonly GenericSchema[];
}

/**
 * Result of code generation with externals.
 */
interface CodeGenWithExternals {
  /** Generated source code */
  code: string;
  /** Map of external values (refinements or regex patterns) */
  externals: Map<string, ExternalValue>;
}

// ============================================================================
// Schema Type Detection
// ============================================================================

/**
 * Checks if a schema is an object schema.
 */
function isObjectSchema(schema: GenericSchema): schema is ObjectSchemaExt {
  return schema.type === "object" && "entries" in schema;
}

/**
 * Checks if a schema is an array schema.
 */
function isArraySchema(schema: GenericSchema): schema is ArraySchemaExt {
  return schema.type === "array" && "itemSchema" in schema;
}

/**
 * Checks if a schema is a union schema.
 */
function isUnionSchema(schema: GenericSchema): schema is UnionSchemaExt {
  return schema.type === "union" && "schemas" in schema;
}

// ============================================================================
// Code Generation Router
// ============================================================================

/**
 * Generates validation code for a schema based on its type.
 * Routes to the appropriate builder for each schema type.
 */
function generateSchemaCode(
  schema: GenericSchema,
  varName: string,
  ctx: GeneratorContext
): { code: string[]; ctx: GeneratorContext } {
  const schemaType = schema.type;

  // Handle coercion types first
  if (isCoerceType(schemaType)) {
    switch (schemaType) {
      case "coerce_string":
        return generateCoerceStringValidation(varName, ctx, schema.message);
      case "coerce_number":
        return generateCoerceNumberValidation(varName, ctx, schema.message);
      case "coerce_boolean":
        return generateCoerceBooleanValidation(varName, ctx);
      case "coerce_date":
        return generateCoerceDateValidation(varName, ctx, schema.message);
    }
  }

  // Helper to add refinements to primitive type validation
  const addRefinementsIfNeeded = (
    result: { code: string[]; ctx: GeneratorContext }
  ): { code: string[]; ctx: GeneratorContext } => {
    if (hasRefinements(schema)) {
      const refinements = getRefinements(schema);
      // Use prefixPath: true to include the property path in error messages
      // The path is already set in the context when validating object properties
      const refinementResult = generateRefinementsValidation(varName, refinements, result.ctx, { prefixPath: true });
      return {
        code: [...result.code, ...refinementResult.code],
        ctx: refinementResult.ctx,
      };
    }
    return result;
  };

  // Handle primitive types
  switch (schemaType) {
    case "string":
      return addRefinementsIfNeeded(generateStringValidation(varName, ctx, undefined, schema.message));
    case "number":
      return addRefinementsIfNeeded(generateNumberValidation(varName, ctx, undefined, schema.message));
    case "boolean":
      return addRefinementsIfNeeded(generateBooleanValidation(varName, ctx, schema.message));
    case "null":
      return addRefinementsIfNeeded(generateNullValidation(varName, ctx, schema.message));
    case "undefined":
      return addRefinementsIfNeeded(generateUndefinedValidation(varName, ctx, schema.message));
    case "any":
      return addRefinementsIfNeeded(generateAnyValidation(varName, ctx));
    case "unknown":
      return addRefinementsIfNeeded(generateUnknownValidation(varName, ctx));
    case "never":
      return addRefinementsIfNeeded(generateNeverValidation(varName, ctx, schema.message));
    case "void":
      return addRefinementsIfNeeded(generateVoidValidation(varName, ctx, schema.message));
    case "symbol":
      return addRefinementsIfNeeded(generateSymbolValidation(varName, ctx, schema.message));
  }

  // Handle composite types
  if (isObjectSchema(schema)) {
    return generateObjectSchemaCode(schema, varName, ctx);
  }

  if (isArraySchema(schema)) {
    return generateArraySchemaCode(schema, varName, ctx);
  }

  // Handle union type
  if (isUnionSchema(schema)) {
    return generateUnionSchemaCode(schema, varName, ctx);
  }

  // Unsupported type - return error
  const errorMsg = `Unsupported schema type: ${schemaType}`;
  return {
    code: [`return "${errorMsg}";`],
    ctx,
  };
}

/**
 * Generates validation code for an object schema.
 */
function generateObjectSchemaCode(
  schema: ObjectSchemaExt,
  varName: string,
  ctx: GeneratorContext
): { code: string[]; ctx: GeneratorContext } {
  const properties: ObjectPropertyMeta[] = [];

  for (const [propName, propSchema] of Object.entries(schema.entries)) {
    properties.push({
      name: propName,
      optional: false, // TODO: detect optional from schema
      generateCode: (pVarName: string, pCtx: GeneratorContext) => {
        // generateSchemaCode already handles refinements with prefixPath: true
        // The path is set in pCtx by generatePropertyValidation before calling this
        return generateSchemaCode(propSchema, pVarName, pCtx);
      },
    });
  }

  const result = generateObjectValidation(varName, ctx, { properties }, schema.message);

  // Add refinements for the object schema itself if any
  if (hasRefinements(schema)) {
    const refinements = getRefinements(schema);
    const refinementResult = generateRefinementsValidation(varName, refinements, result.ctx);
    return {
      code: [...result.code, ...refinementResult.code],
      ctx: refinementResult.ctx,
    };
  }

  return result;
}

/**
 * Generates validation code for an array schema.
 */
function generateArraySchemaCode(
  schema: ArraySchemaExt,
  varName: string,
  ctx: GeneratorContext
): { code: string[]; ctx: GeneratorContext } {
  const itemGenerator = (itemVarName: string, itemCtx: GeneratorContext) => {
    const result = generateSchemaCode(schema.itemSchema, itemVarName, itemCtx);
    
    // Add refinements for item schema if any
    if (hasRefinements(schema.itemSchema)) {
      const refinements = getRefinements(schema.itemSchema);
      const refinementResult = generateRefinementsValidation(itemVarName, refinements, result.ctx);
      return {
        code: [...result.code, ...refinementResult.code],
        ctx: refinementResult.ctx,
      };
    }
    
    return result;
  };

  const result = generateArrayValidation(varName, ctx, { itemGenerator }, schema.message);

  // Add refinements for the array schema itself if any
  if (hasRefinements(schema)) {
    const refinements = getRefinements(schema);
    const refinementResult = generateRefinementsValidation(varName, refinements, result.ctx);
    return {
      code: [...result.code, ...refinementResult.code],
      ctx: refinementResult.ctx,
    };
  }

  return result;
}

/**
 * Generates validation code for a union schema.
 */
function generateUnionSchemaCode(
  schema: UnionSchemaExt,
  varName: string,
  ctx: GeneratorContext
): { code: string[]; ctx: GeneratorContext } {
  const branches: UnionBranchMeta[] = schema.schemas.map((branchSchema) => {
    const typeName = getSchemaTypeName(branchSchema);
    const typeofCheck = getTypeofCheck(branchSchema);

    return {
      typeName,
      typeofCheck,
      generateCode: (bVarName: string, bCtx: GeneratorContext) => {
        return generateSchemaCode(branchSchema, bVarName, bCtx);
      },
    };
  });

  const result = generateUnionValidation(varName, ctx, { branches, errorMessage: schema.message });

  // Add refinements for the union schema itself if any
  if (hasRefinements(schema)) {
    const refinements = getRefinements(schema);
    const refinementResult = generateRefinementsValidation(varName, refinements, result.ctx);
    return {
      code: [...result.code, ...refinementResult.code],
      ctx: refinementResult.ctx,
    };
  }

  return result;
}

/**
 * Gets a human-readable type name for a schema.
 */
function getSchemaTypeName(schema: GenericSchema): string {
  return schema.type;
}

/**
 * Gets the typeof check for a schema if it's a simple primitive.
 */
function getTypeofCheck(schema: GenericSchema): string | undefined {
  switch (schema.type) {
    case "string":
      return "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "undefined":
      return "undefined";
    case "symbol":
      return "symbol";
    default:
      return undefined;
  }
}

// ============================================================================
// Main Compiler
// ============================================================================

/**
 * Formats the generated code for debug mode.
 * Adds proper indentation and removes empty lines.
 *
 * @param code - The raw generated code
 * @param debug - Whether debug mode is enabled
 * @returns Formatted code string
 */
function formatGeneratedCode(code: string, debug: boolean): string {
  if (!debug) {
    // In non-debug mode, remove empty lines and extra whitespace
    return code
      .split("\n")
      .filter((line) => line.trim() !== "")
      .join("\n");
  }
  
  // In debug mode, preserve formatting but clean up multiple blank lines
  return code
    .split("\n")
    .reduce((acc: string[], line, index, arr) => {
      // Skip if this is a blank line following another blank line
      if (line.trim() === "" && index > 0 && arr[index - 1].trim() === "") {
        return acc;
      }
      acc.push(line);
      return acc;
    }, [])
    .join("\n");
}

/**
 * Generates the complete validator code for a schema.
 */
function generateValidatorCode(
  schema: GenericSchema,
  options?: CompileOptions
): CodeGenWithExternals {
  const ctx = createGeneratorContext({ debug: options?.debug });
  const lines: string[] = [];

  // Add header comment in debug mode
  if (options?.debug) {
    lines.push("// JIT-compiled validator for schema type: " + schema.type);
    lines.push("");
  }

  // Generate schema validation code
  const result = generateSchemaCode(schema, "value", ctx);
  lines.push(...result.code);

  // Add return true at the end if not already present
  const lastLine = lines[lines.length - 1]?.trim();
  if (!lastLine?.startsWith("return ")) {
    if (options?.debug) {
      lines.push("");
      lines.push("// Validation passed");
    }
    lines.push("return true;");
  }

  const rawCode = lines.join("\n");
  const formattedCode = formatGeneratedCode(rawCode, options?.debug ?? false);

  return {
    code: formattedCode,
    externals: result.ctx.externals,
  };
}

/**
 * Compiles a schema into an optimized validator function using JIT compilation.
 *
 * The JIT compiler generates JavaScript code at runtime using `new Function()`,
 * which is then executed by the V8 engine with full optimization. This results
 * in validators that are significantly faster than the interpreted V3 validators.
 *
 * ## Performance
 *
 * Typical performance improvements over V3 non-compiled validators:
 * - Simple objects (3 props): ~1.4x faster
 * - Complex objects (nested): ~4x faster
 * - Large arrays (500+ items): ~4x faster
 * - Unions: ~1.3-2x faster
 *
 * ## Caching
 *
 * Compiled validators are cached using a WeakMap keyed by schema reference.
 * This means calling `compile(schema)` multiple times with the same schema
 * returns the same compiled validator without re-compilation.
 *
 * ## CSP Limitations
 *
 * The JIT compiler uses `new Function()` which is blocked in environments with
 * strict Content Security Policy (missing `'unsafe-eval'`). In such cases,
 * the compiler automatically falls back to the original V3 validator.
 * Check `validator.isFallback` to detect this scenario.
 *
 * ## Refinements
 *
 * Schemas with refinements (custom validation functions) are supported but
 * cannot be fully inlined. Refinements are called as external functions,
 * which introduces some overhead compared to pure type validation.
 *
 * @typeParam T - The type that the schema validates
 * @param schema - The schema to compile
 * @param options - Compilation options
 * @returns A compiled validator function
 *
 * @example Basic usage
 * ```typescript
 * import { object, string, number, compile } from "@kanon";
 *
 * const userSchema = object({ name: string(), age: number() });
 * const validate = compile(userSchema);
 *
 * validate({ name: "John", age: 30 }); // true
 * validate({ name: 123, age: 30 }); // "Property 'name': Expected string"
 * ```
 *
 * @example Debug mode - inspect generated code
 * ```typescript
 * const validate = compile(schema, { debug: true });
 * console.log(validate.source);
 * // Output:
 * // if (typeof value !== "object" || value === null) {
 * //   return "Expected object";
 * // }
 * // var v_0 = value.name;
 * // if (typeof v_0 !== "string") {
 * //   return "Property 'name': Expected string";
 * // }
 * // ...
 * ```
 *
 * @example Checking for CSP fallback
 * ```typescript
 * const validate = compile(schema);
 * if (validate.isFallback) {
 *   console.warn("JIT compilation not available, using V3 fallback");
 * }
 * ```
 *
 * @example With arrays
 * ```typescript
 * const tagsSchema = array(string());
 * const validate = compile(tagsSchema);
 *
 * validate(["a", "b", "c"]); // true
 * validate(["a", 123, "c"]); // "Index 1: Expected string"
 * ```
 *
 * @example With unions
 * ```typescript
 * const idSchema = unionOf(string(), number());
 * const validate = compile(idSchema);
 *
 * validate("abc"); // true
 * validate(123); // true
 * validate(true); // "Expected string or number"
 * ```
 *
 * @since 3.3.0
 * @experimental
 */
export function compile<T>(
  schema: Schema<T>,
  options?: CompileOptions
): CompiledValidator<T> {
  // Force fallback if requested (for testing)
  if (options?.forceFallback) {
    const fallback = schema.validator as CompiledValidator<T>;
    fallback.isFallback = true;
    return fallback;
  }

  // Check cache first (unless disabled)
  if (!options?.noCache) {
    const cached = globalValidatorCache.get(schema);
    if (cached) {
      return cached as CompiledValidator<T>;
    }
  }

  try {
    const { code: sourceCode, externals } = generateValidatorCode(
      schema as GenericSchema,
      options
    );

    let compiledFn: (value: unknown, externals?: Map<string, ExternalValue>) => ValidatorResult<T>;

    // If there are externals (refinements), we need to pass them to the function
    if (externals.size > 0) {
      // INTENTIONAL: new Function() is the core of JIT optimization
      // eslint-disable-next-line no-new-func
      compiledFn = Function("value", "externals", sourceCode) as typeof compiledFn;
    } else {
      // No externals - simpler function signature
      // INTENTIONAL: new Function() is the core of JIT optimization
      // eslint-disable-next-line no-new-func
      compiledFn = Function("value", sourceCode) as typeof compiledFn;
    }

    // Create the validator wrapper
    const validator: CompiledValidator<T> = externals.size > 0
      ? (value: unknown) => compiledFn(value, externals)
      : (value: unknown) => compiledFn(value);

    if (options?.debug) {
      validator.source = sourceCode;
    }
    validator.isFallback = false;

    // Cache the compiled validator (unless disabled)
    if (!options?.noCache) {
      globalValidatorCache.set(schema, validator);
    }

    return validator;
  } catch {
    // CSP or other restriction → silent fallback
    const fallback = schema.validator as CompiledValidator<T>;
    fallback.isFallback = true;
    // Do NOT cache fallback
    return fallback;
  }
}

/**
 * Checks if JIT compilation is available in the current environment.
 *
 * JIT compilation requires `new Function()` to be available, which may be
 * blocked by Content Security Policy (CSP) in some environments.
 *
 * Use this function to check availability before deciding whether to use
 * JIT compilation or fall back to alternative strategies.
 *
 * @returns `true` if `new Function()` is supported, `false` otherwise
 *
 * @example
 * ```typescript
 * import { isJITAvailable, compile } from "@kanon";
 *
 * if (isJITAvailable()) {
 *   const validate = compile(schema);
 *   // Use JIT-compiled validator
 * } else {
 *   // Use V3 non-compiled validator
 *   const validate = schema.validator;
 * }
 * ```
 *
 * @since 3.3.0
 */
export function isJITAvailable(): boolean {
  try {
    // INTENTIONAL: Testing if new Function() works in this environment
    // eslint-disable-next-line no-new-func
    const testFn = new Function("return true");
    return testFn() === true;
  } catch {
    return false;
  }
}

/**
 * Clears the global validator cache.
 *
 * The JIT compiler caches compiled validators using a WeakMap keyed by schema
 * reference. This function clears all cached validators, forcing re-compilation
 * on the next `compile()` call.
 *
 * Useful for:
 * - Testing scenarios where you need fresh compilations
 * - Memory management in long-running applications
 * - Debugging compilation issues
 *
 * @example
 * ```typescript
 * import { compile, clearCache } from "@kanon";
 *
 * const validate1 = compile(schema);
 * const validate2 = compile(schema);
 * console.log(validate1 === validate2); // true (cached)
 *
 * clearCache();
 *
 * const validate3 = compile(schema);
 * console.log(validate1 === validate3); // false (re-compiled)
 * ```
 *
 * @since 3.3.0
 */
export function clearCache(): void {
  globalValidatorCache.clear();
}
