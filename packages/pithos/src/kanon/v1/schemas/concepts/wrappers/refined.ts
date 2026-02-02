/**
 * Refined schema wrapper
 *
 * @since 1.1.0
 */

import type { PithosType, PithosSafeParseResult } from "../../../types/base";
import { PithosError } from "../../../errors";

/**
 * Refined schema wrapper
 *
 * @since 1.1.0
 */
export class PithosRefined<T extends PithosType>
  implements PithosType<T["_output"], T["_input"]>
{
  _output!: T["_output"];
  _input!: T["_input"];

  constructor(
    private readonly schema: T,
    private readonly checkFn: (data: T["_output"]) => boolean | Promise<boolean>,
    private readonly message?: string
  ) {}

  parse(data: unknown): T["_output"] {
    const result = this.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  safeParse(data: unknown): PithosSafeParseResult<T["_output"]> {
    const result = this.schema.safeParse(data);
    if (!result.success) {
      return result;
    }

    // Apply the refinement check synchronously
    try {
      const checkResult = this.checkFn(result.data);
      if (checkResult instanceof Promise) {
        // Si c'est une promesse, on ne peut pas la traiter de manière synchrone
        // On considère que c'est valide pour l'instant
        return result;
      }

      if (!checkResult) {
        return {
          success: false,
          error: new PithosError([
            {
              code: "custom",
              message: this.message || "Invalid input",
              path: [],
            },
          ]),
        };
      }
    } catch {
      // If the check throws an error, we consider it invalid
      return {
        success: false,
        error: new PithosError([
          {
            code: "custom",
            message: this.message || "Invalid input",
            path: [],
          },
        ]),
      };
    }

    return result;
  }

  // Add refine method to allow chaining
  refine(
    check: (data: T["_output"]) => boolean | Promise<boolean>,
    options?: { message?: string } | string
  ): this {
    const message = typeof options === "string" ? options : options?.message;
    return new PithosRefined(this as unknown as T, check, message) as this;
  }

  async parseAsync(data: unknown): Promise<T["_output"]> {
    const result = await this.safeParseAsync(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  async safeParseAsync(
    data: unknown
  ): Promise<PithosSafeParseResult<T["_output"]>> {
    const result = this.schema.safeParse(data);
    if (!result.success) {
      return result;
    }

    try {
      const isValid = await this.checkFn(result.data);
      if (!isValid) {
        return {
          success: false,
          error: new PithosError([
            {
              code: "custom",
              message: this.message || "Invalid input",
              path: [],
            },
          ]),
        };
      }
    } catch {
      return {
        success: false,
        error: new PithosError([
          {
            code: "custom",
            message: this.message || "Invalid input",
            path: [],
          },
        ]),
      };
    }

    return result;
  }
}
