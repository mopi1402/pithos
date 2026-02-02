/**
 * ZodError class for API compatibility
 *
 * This class is only used in the Zod adapter API.
 * It's not part of the core Pithos validation system.
 *
 * @since 1.1.0
 */

import type { BaseIssue } from "@kanon/v2/types/base.js";

/**
 * ZodError class (alias for compatibility)
 *
 * This is only used in the Zod adapter API.
 * The core Pithos system uses PithosError.
 *
 * @since 1.1.0
 */
export class ZodError extends Error {
  public readonly issues: BaseIssue<unknown>[];

  constructor(issues: BaseIssue<unknown>[]) {
    super("Validation failed");
    this.name = "ZodError";
    this.issues = issues;
  }

  override get message(): string {
    return this.issues.map((issue) => issue.message).join(", ");
  }
}
