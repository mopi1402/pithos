import type { PithosType, PithosSafeParseResult } from "../../types/base";
import { PithosError } from "../../errors";

/**
 * Never schema implementation
 *
 * @since 1.1.0
 */
export class PithosNever implements PithosType<never> {
  _output!: never;
  _input!: never;

  parse(data: unknown): never {
    const result = this.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  safeParse(data: unknown): PithosSafeParseResult<never> {
    return {
      success: false,
      error: new PithosError([
        {
          code: "invalid_type",
          expected: "never",
          received: typeof data,
          message: "Expected never",
          path: [],
        },
      ]),
    };
  }

  parseAsync(data: unknown): Promise<never> {
    return Promise.reject(new Error("Expected never"));
  }

  safeParseAsync(data: unknown): Promise<PithosSafeParseResult<never>> {
    return Promise.resolve(this.safeParse(data));
  }
}
