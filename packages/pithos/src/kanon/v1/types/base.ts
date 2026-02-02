/**
 * Types de base pour la validation de schémas Pithos
 *
 * @since 1.1.0
 */

// Import PithosError pour les types
import { PithosError } from "../errors";

/**
 * Validation issue type
 *
 * @since 1.1.0
 */
export interface PithosIssue {
  code: string;
  message?: string;
  path: (string | number)[];
  [key: string]: unknown;
}

/**
 * Safe parse result type
 *
 * @template T - The validated data type
 * @since 1.1.0
 */
export type PithosSafeParseResult<T> =
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: PithosError };

/**
 * Base schema type
 *
 * @since 1.1.0
 */
export interface PithosType<Output = unknown, Input = unknown> {
  _output: Output;
  _input: Input;

  parse(data: unknown): Output;
  safeParse(data: unknown): PithosSafeParseResult<Output>;
  parseAsync(data: unknown): Promise<Output>;
  safeParseAsync(data: unknown): Promise<PithosSafeParseResult<Output>>;

  // String methods
  min?(minLength: number, message?: string): this;
  max?(maxLength: number, message?: string): this;
  length?(length: number, message?: string): this;
  email?(message?: string): this;
  url?(message?: string): this;
  regex?(regex: RegExp, message?: string): this;
  nonempty?(message?: string): this;
  toLowerCase?(): this;
  toUpperCase?(): this;
  trim?(): this;

  // Number methods
  positive?(message?: string): this;
  negative?(message?: string): this;
  int?(message?: string): this;

  // Array methods
  array?(): any;

  // Object methods
  optional?(): this;
  nullable?(): this;
  default?(defaultValue: unknown | (() => unknown)): this;

  // Refinement
  refine?(
    check: (data: Output) => boolean | Promise<boolean>,
    options?: { message?: string } | string
  ): this;

  // Check method for validation constraints
  check?(...checks: ((data: Output) => any)[]): this;
}
