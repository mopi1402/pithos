import { parse } from "./core/parser";
import { Schema } from "./types/base";

/**
 * Result type for safe parsing operations.
 *
 * @template T - The type of the parsed data
 * @since 3.1.0
 */
export type SafeParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Kanon V3 lightweight validation helpers (Zod-like ergonomics, minimal surface).
 *
 * @since 3.1.0
 */
export const validation = {
  /**
   * Parses a value and throws on failure.
   *
   * @since 3.1.0
   */
  parse<T>(schema: Schema<T>, value: unknown): T {
    const result = parse(schema, value);
    if (result.success) return result.data;
    throw new Error(result.error);
  },

  /**
   * Parses a value and returns a discriminated result.
   *
   * @since 3.1.0
   */
  safeParse<T>(schema: Schema<T>, value: unknown): SafeParseResult<T> {
    return parse(schema, value);
  },

  /**
   * Async variant, kept for API parity (logic stays sync).
   *
   * @since 3.1.0
   */
  async parseAsync<T>(schema: Schema<T>, value: unknown): Promise<T> {
    return this.parse(schema, value);
  },

  /**
   * Async variant, kept for API parity (logic stays sync).
   *
   * @since 3.1.0
   */
  async safeParseAsync<T>(
    schema: Schema<T>,
    value: unknown
  ): Promise<SafeParseResult<T>> {
    return this.safeParse(schema, value);
  },
};
