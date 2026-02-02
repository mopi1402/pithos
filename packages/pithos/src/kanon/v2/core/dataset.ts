import type { BaseIssue } from "@kanon/v2/types/base.js";

/**
 * Validation status enum for explicit state management
 *
 * @since 2.0.0
 */
export type ValidationStatus = "unknown" | "success" | "partial" | "failure";

/**
 * Typed dataset interface.
 *
 * @since 2.0.0
 */
export interface TypedDataset {
  typed?: boolean;
}

/**
 * Unknown dataset interface - when validation hasn't started yet
 *
 * @since 2.0.0
 */
export interface UnknownDataset extends TypedDataset {
  /**
   * Explicit validation status
   */
  status: "unknown";
  /**
   * The dataset value
   */
  value: unknown;
  /**
   * The dataset issues (undefined when no issues)
   */
  issues?: undefined;
}

/**
 * Success dataset interface - when validation succeeded
 *
 * @since 2.0.0
 */
export interface SuccessDataset<TValue> extends TypedDataset {
  /**
   * Explicit validation status
   */
  status: "success";
  /**
   * The dataset value
   */
  value: TValue;
  /**
   * The dataset issues (undefined when no issues)
   */
  issues?: undefined;
}

/**
 * Partial dataset interface - when validation partially succeeded
 *
 * @since 2.0.0
 */
export interface PartialDataset<TValue, TIssue extends BaseIssue<unknown>>
  extends TypedDataset {
  /**
   * Explicit validation status
   */
  status: "partial";
  /**
   * The dataset value
   */
  value: TValue;
  /**
   * The dataset issues (array of issues)
   */
  issues: [TIssue, ...TIssue[]];
}

/**
 * Failure dataset interface - when validation failed
 *
 * @since 2.0.0
 */
export interface FailureDataset<TIssue extends BaseIssue<unknown>>
  extends TypedDataset {
  /**
   * Explicit validation status
   */
  status: "failure";
  /**
   * The dataset value
   */
  value: unknown;
  /**
   * The dataset issues (array of issues)
   */
  issues: [TIssue, ...TIssue[]];
}

/**
 * Output dataset type - union of all possible dataset states
 *
 * @since 2.0.0
 */
export type OutputDataset<TValue, TIssue extends BaseIssue<unknown>> =
  | UnknownDataset
  | SuccessDataset<TValue>
  | PartialDataset<TValue, TIssue>
  | FailureDataset<TIssue>;

/**
 * Configuration interface for validation
 *
 * @since 2.0.0
 */
export interface PithosConfig {
  /**
   * Language for error messages
   */
  lang?: string;
  /**
   * Whether to abort on first error
   */
  abortEarly?: boolean;
  /**
   * Custom error message
   */
  message?: string | ((issue: BaseIssue<unknown>) => string);
}

/**
 * Create a new unknown dataset
 *
 * @since 2.0.0
 */
export function createDataset(value: unknown): UnknownDataset {
  return { status: "unknown", value };
}

/**
 * Create a success dataset
 *
 * @since 2.0.0
 */
export function createSuccessDataset<TValue>(
  value: TValue
): SuccessDataset<TValue> {
  return { status: "success", value };
}

/**
 * Create a failure dataset
 *
 * @since 2.0.0
 */
export function createFailureDataset<TIssue extends BaseIssue<unknown>>(
  value: unknown,
  issues: [TIssue, ...TIssue[]]
): FailureDataset<TIssue> {
  return { status: "failure", value, issues };
}
