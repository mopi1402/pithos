/**
 * Classes d'erreur pour la validation de schémas
 *
 * @since 1.1.0
 */

import type { PithosIssue } from "./types/base";

/**
 * Pithos error class
 *
 * @since 1.1.0
 */
export class PithosError extends Error {
  public readonly issues: PithosIssue[];

  constructor(issues: PithosIssue[]) {
    super("Validation failed");
    this.name = "PithosError";
    this.issues = issues;
  }

  override get message(): string {
    return this.issues.map((issue) => issue.message || issue.code).join(", ");
  }
}

/**
 * Error class (alias for compatibility)
 *
 * @since 1.1.0
 */
export class ZodError extends PithosError {
  constructor(issues: PithosIssue[]) {
    super(issues);
    this.name = "ZodError";
  }
}
