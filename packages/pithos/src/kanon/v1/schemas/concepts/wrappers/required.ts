/**
 * Required object schema wrapper
 * Makes all fields required
 *
 * @since 1.1.0
 */

import type { PithosType, PithosSafeParseResult } from "../../../types/base";
import { PithosError } from "../../../errors";

/**
 * Required object schema wrapper
 * Makes all fields required
 *
 * @since 1.1.0
 */
export class PithosRequired<T extends Record<string, PithosType>>
  implements
    PithosType<
      { [K in keyof T]: T[K]["_output"] },
      { [K in keyof T]: T[K]["_input"] }
    >
{
  _output!: { [K in keyof T]: T[K]["_output"] };
  _input!: { [K in keyof T]: T[K]["_input"] };

  constructor(private readonly shape: T) {}

  parse(data: unknown): { [K in keyof T]: T[K]["_output"] } {
    const result = this.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  safeParse(
    data: unknown
  ): PithosSafeParseResult<{ [K in keyof T]: T[K]["_output"] }> {
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
    const result: { [K in keyof T]: T[K]["_output"] } = {} as any;
    const issues: any[] = [];

    for (const [key, schema] of Object.entries(this.shape)) {
      if (!(key in obj)) {
        issues.push({
          code: "missing",
          message: `Missing required field: ${key}`,
          path: [key],
        });
        continue;
      }

      const fieldResult = schema.safeParse(obj[key]);
      if (fieldResult.success) {
        result[key as keyof T] = fieldResult.data;
      } else {
        issues.push(
          ...fieldResult.error.issues.map((issue) => ({
            ...issue,
            path: [key, ...issue.path],
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

  async parseAsync(
    data: unknown
  ): Promise<{ [K in keyof T]: T[K]["_output"] }> {
    const result = await this.safeParseAsync(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  async safeParseAsync(
    data: unknown
  ): Promise<PithosSafeParseResult<{ [K in keyof T]: T[K]["_output"] }>> {
    return this.safeParse(data);
  }
}
