/**
 * Pick object schema wrapper
 * Selects specific fields from an object
 *
 * @since 1.1.0
 */

import type { PithosType, PithosSafeParseResult } from "../../../types/base";
import { PithosError } from "../../../errors";

/**
 * Pick object schema wrapper
 * Selects specific fields from an object
 *
 * @since 1.1.0
 */
export class PithosPick<T extends Record<string, PithosType>, K extends keyof T>
  implements
    PithosType<{ [P in K]: T[P]["_output"] }, { [P in K]: T[P]["_input"] }>
{
  _output!: { [P in K]: T[P]["_output"] };
  _input!: { [P in K]: T[P]["_input"] };

  constructor(private readonly shape: T, private readonly keys: K[]) {}

  parse(data: unknown): { [P in K]: T[P]["_output"] } {
    const result = this.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  safeParse(
    data: unknown
  ): PithosSafeParseResult<{ [P in K]: T[P]["_output"] }> {
    if (typeof data !== "object" || data === null) {
      return {
        success: false,
        error: new PithosError([
          {
            code: "invalid_type",
            expected: "object",
            received: typeof data,
            path: [],
          },
        ]),
      };
    }

    const obj = data as Record<string, unknown>;
    const result: { [P in K]: T[P]["_output"] } = {} as any;
    const issues: any[] = [];

    for (const key of this.keys) {
      if (!(key in obj)) {
        issues.push({
          code: "missing",
          message: `Missing required field: ${String(key)}`,
          path: [String(key)],
        });
        continue;
      }

      const schema = this.shape[key];
      if (!schema) {
        issues.push({
          code: "invalid_type",
          message: `Schema not found for key: ${String(key)}`,
          path: [String(key)],
        });
        continue;
      }

      const fieldResult = schema.safeParse(obj[String(key)]);
      if (fieldResult.success) {
        result[key] = fieldResult.data;
      } else {
        issues.push(
          ...fieldResult.error.issues.map((issue) => ({
            ...issue,
            path: [String(key), ...issue.path],
          }))
        );
      }
    }

    if (issues.length) {
      return {
        success: false,
        error: new PithosError(issues),
      };
    }

    return { success: true, data: result };
  }

  async parseAsync(data: unknown): Promise<{ [P in K]: T[P]["_output"] }> {
    const result = await this.safeParseAsync(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  async safeParseAsync(
    data: unknown
  ): Promise<PithosSafeParseResult<{ [P in K]: T[P]["_output"] }>> {
    return this.safeParse(data);
  }
}
