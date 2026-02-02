import type { PithosType, PithosSafeParseResult } from "../../types/base";
import { PithosError } from "../../errors";

/**
 * Void schema implementation
 *
 * @since 1.1.0
 */
export class PithosVoid implements PithosType<void> {
  _output!: void;
  _input!: void;

  parse(data: unknown): void {
    const result = this.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  safeParse(data: unknown): PithosSafeParseResult<void> {
    if (data === undefined) {
      return { success: true, data: undefined };
    }

    return {
      success: false,
      error: new PithosError([
        {
          code: "invalid_type",
          expected: "void",
          received: typeof data,
          message: "Expected void",
          path: [],
        },
      ]),
    };
  }

  parseAsync(data: unknown): Promise<void> {
    return Promise.resolve(this.parse(data));
  }

  safeParseAsync(data: unknown): Promise<PithosSafeParseResult<void>> {
    return Promise.resolve(this.safeParse(data));
  }
}
