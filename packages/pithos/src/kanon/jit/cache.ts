/**
 * @module kanon/jit/compiler
 *
 * Validator Cache for JIT Compilation
 *
 * Caches compiled validators to avoid re-compilation of the same schema.
 * Uses WeakMap to allow garbage collection of unused schemas.
 *
 * @since 3.3.0
 * @experimental
 */

import type { Schema, ValidatorResult } from "../types/base";

/**
 * Compiled validator function type.
 *
 * A compiled validator is a function that validates a value and returns
 * either `true` for valid values, a string error message for invalid values,
 * or a coerced result object.
 *
 * @template T - The type being validated
 * @since 3.3.0
 */
export type CompiledValidatorFn<T> = (value: unknown) => ValidatorResult<T>;

/**
 * Compiled validator with metadata.
 *
 * @template T - The type being validated
 * @since 3.3.0
 */
export interface CompiledValidator<T> extends CompiledValidatorFn<T> {
  /** Generated source code (only in debug mode) */
  source?: string;
  /** Whether this is a fallback to V3 non-compiled validator */
  isFallback?: boolean;
}

/**
 * Interface for the validator cache.
 *
 * The cache stores compiled validators keyed by their source schema.
 * Using WeakMap ensures that schemas can be garbage collected when
 * no longer referenced elsewhere.
 *
 * @since 3.3.0
 */
export interface ValidatorCache {
  /**
   * Retrieves a compiled validator from the cache.
   *
   * @param schema - The schema to look up
   * @returns The cached validator, or undefined if not found
   */
  get<T>(schema: Schema<T>): CompiledValidator<T> | undefined;

  /**
   * Stores a compiled validator in the cache.
   *
   * @param schema - The schema to use as key
   * @param validator - The compiled validator to cache
   */
  set<T>(schema: Schema<T>, validator: CompiledValidator<T>): void;

  /**
   * Checks if a schema has a cached validator.
   *
   * @param schema - The schema to check
   * @returns true if the schema has a cached validator
   */
  has(schema: Schema<unknown>): boolean;

  /**
   * Clears all cached validators.
   *
   * Note: This creates a new WeakMap, allowing the old entries
   * to be garbage collected.
   */
  clear(): void;
}

/**
 * Internal implementation of the validator cache.
 */
class ValidatorCacheImpl implements ValidatorCache {
  // Using WeakMap<object, ...> to avoid variance issues with Schema<T>
  private cache: WeakMap<object, CompiledValidator<unknown>>;

  constructor() {
    this.cache = new WeakMap();
  }

  get<T>(schema: Schema<T>): CompiledValidator<T> | undefined {
    return this.cache.get(schema) as CompiledValidator<T> | undefined;
  }

  set<T>(schema: Schema<T>, validator: CompiledValidator<T>): void {
    this.cache.set(schema, validator as CompiledValidator<unknown>);
  }

  has(schema: Schema<unknown>): boolean {
    return this.cache.has(schema);
  }

  clear(): void {
    this.cache = new WeakMap();
  }
}

/**
 * Creates a new validator cache instance.
 *
 * @returns A new ValidatorCache
 * @since 3.3.0
 *
 * @example
 * ```typescript
 * const cache = createValidatorCache();
 *
 * const schema = string();
 * const validator = compile(schema);
 *
 * cache.set(schema, validator);
 *
 * // Later...
 * if (cache.has(schema)) {
 *   const cached = cache.get(schema);
 * }
 * ```
 */
export function createValidatorCache(): ValidatorCache {
  return new ValidatorCacheImpl();
}

/**
 * Global validator cache instance.
 *
 * This is the default cache used by the JIT compiler.
 * It can be cleared using `globalValidatorCache.clear()`.
 *
 * @since 3.3.0
 */
export const globalValidatorCache: ValidatorCache = createValidatorCache();
