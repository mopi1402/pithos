/**
 * Schema pour valider les enums
 *
 * @since 1.1.0
 */

import type { PithosType, PithosSafeParseResult } from "../../../types/base";
import { PithosError } from "../../../errors";

/**
 * Schema pour valider les enums
 *
 * @since 1.1.0
 */
export class PithosEnum<T extends readonly string[]>
  implements PithosType<T[number]>
{
  _output!: T[number];
  _input!: T[number];

  constructor(private readonly values: T) {}

  parse(data: unknown): T[number] {
    const result = this.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  safeParse(data: unknown): PithosSafeParseResult<T[number]> {
    if (typeof data !== "string") {
      return {
        success: false,
        error: new PithosError([
          {
            code: "invalid_type",
            expected: "string",
            received: typeof data,
            message: "Expected string",
            path: [],
          },
        ]),
      };
    }

    if (
      !Array.isArray(this.values) ||
      !this.values.includes(data as T[number])
    ) {
      return {
        success: false,
        error: new PithosError([
          {
            code: "invalid_enum_value",
            options: this.values,
            received: data,
            message: `Expected one of: ${
              Array.isArray(this.values)
                ? this.values.join(", ")
                : "invalid enum values"
            }`,
            path: [],
          },
        ]),
      };
    }

    return { success: true, data: data as T[number] };
  }

  parseAsync(data: unknown): Promise<T[number]> {
    return Promise.resolve(this.parse(data));
  }

  safeParseAsync(data: unknown): Promise<PithosSafeParseResult<T[number]>> {
    return Promise.resolve(this.safeParse(data));
  }
}
