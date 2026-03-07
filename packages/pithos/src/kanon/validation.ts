import { parse } from "./core/parser";
import { Schema, GenericSchema, Infer } from "./types/base";

/**
 * Result type for safe parsing operations.
 *
 * @template T - The type of the parsed data.
 * @since 2.0.0
 */
export type SafeParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Parses a value and throws on failure.
 *
 * @since 2.0.0
 */
function validationParse<T>(schema: Schema<T>, value: unknown): T;
function validationParse<S extends GenericSchema>(schema: S, value: unknown): Infer<S>;
function validationParse(schema: GenericSchema, value: unknown): unknown {
  const result = parse(schema, value);
  if (result.success) return result.data;
  throw new Error(result.error);
}

/**
 * Parses a value and returns a discriminated result.
 *
 * @since 2.0.0
 */
function validationSafeParse<T>(schema: Schema<T>, value: unknown): SafeParseResult<T>;
function validationSafeParse<S extends GenericSchema>(schema: S, value: unknown): SafeParseResult<Infer<S>>;
function validationSafeParse(schema: GenericSchema, value: unknown): SafeParseResult<unknown> {
  return parse(schema, value);
}

/**
 * Async variant of `parse`, kept for API parity (logic stays sync).
 *
 * @since 2.0.0
 */
async function validationParseAsync<T>(schema: Schema<T>, value: unknown): Promise<T>;
async function validationParseAsync<S extends GenericSchema>(schema: S, value: unknown): Promise<Infer<S>>;
async function validationParseAsync(schema: GenericSchema, value: unknown): Promise<unknown> {
  return validationParse(schema, value);
}

/**
 * Async variant of `safeParse`, kept for API parity (logic stays sync).
 *
 * @since 2.0.0
 */
async function validationSafeParseAsync<T>(schema: Schema<T>, value: unknown): Promise<SafeParseResult<T>>;
async function validationSafeParseAsync<S extends GenericSchema>(schema: S, value: unknown): Promise<SafeParseResult<Infer<S>>>;
async function validationSafeParseAsync(schema: GenericSchema, value: unknown): Promise<SafeParseResult<unknown>> {
  return validationSafeParse(schema, value);
}

/**
 * Kanon V3 lightweight validation helpers (Zod-like ergonomics, minimal surface).
 *
 * @since 2.0.0
 */
export const validation = {
  parse: validationParse,
  safeParse: validationSafeParse,
  parseAsync: validationParseAsync,
  safeParseAsync: validationSafeParseAsync,
};
