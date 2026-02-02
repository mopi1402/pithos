/**
 * Omit object schema wrapper
 * Excludes specific fields from an object
 *
 * @since 1.1.0
 */

import type { PithosType, PithosSafeParseResult } from "../../../types/base";
import { PithosError } from "../../../errors";

// Helper types to avoid complex mapped type repetition
type OmitOutput<T extends Record<string, PithosType>, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P]["_output"];
};

type OmitInput<T extends Record<string, PithosType>, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P]["_input"];
};

/**
 * Omit object schema wrapper
 * Excludes specific fields from an object
 *
 * @since 1.1.0
 */
export class PithosOmit<T extends Record<string, PithosType>, K extends keyof T>
  implements PithosType<OmitOutput<T, K>, OmitInput<T, K>>
{
  _output!: OmitOutput<T, K>;
  _input!: OmitInput<T, K>;

  constructor(private readonly shape: T, private readonly keys: K[]) {}

  parse(data: unknown): OmitOutput<T, K> {
    const result = this.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  safeParse(data: unknown): PithosSafeParseResult<OmitOutput<T, K>> {
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
    const result: OmitOutput<T, K> = {} as OmitOutput<T, K>;
    const issues: Array<{
      code: string;
      message?: string;
      path: (string | number)[];
      [key: string]: unknown;
    }> = [];

    for (const [key, schema] of Object.entries(this.shape)) {
      if (this.keys.includes(key as K)) {
        continue; // Skip excluded keys
      }

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
        (result as any)[key] = fieldResult.data;
      } else {
        issues.push(
          ...fieldResult.error.issues.map((issue) => ({
            ...issue,
            path: [key, ...issue.path],
          }))
        );
      }
    }

    // Strict validation: reject extra properties
    const allowedKeys = Object.keys(this.shape).filter(
      (key) => !this.keys.includes(key as K)
    );
    const extraKeys = Object.keys(obj).filter(
      (key) => !allowedKeys.includes(key)
    );
    if (extraKeys.length) {
      issues.push({
        code: "unrecognized_keys",
        message: `Unrecognized keys: ${extraKeys.join(", ")}`,
        path: [],
      });
    }

    if (issues.length) {
      return {
        success: false,
        error: new PithosError(issues),
      };
    }

    return { success: true, data: result };
  }

  async parseAsync(data: unknown): Promise<OmitOutput<T, K>> {
    const result = await this.safeParseAsync(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  async safeParseAsync(
    data: unknown
  ): Promise<PithosSafeParseResult<OmitOutput<T, K>>> {
    return this.safeParse(data);
  }
}
