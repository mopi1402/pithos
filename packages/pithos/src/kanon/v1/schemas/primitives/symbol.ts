import type { PithosSafeParseResult } from "../../types/base";
import { PithosError } from "../../errors";
import type { PithosType } from "../../types/base";

/**
 * Symbol schema implementation
 *
 * @since 1.1.0
 */
export class PithosSymbol implements PithosType<symbol> {
  _output!: symbol;
  _input!: symbol;

  parse(data: unknown): symbol {
    const result = this.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  safeParse(data: unknown): PithosSafeParseResult<symbol> {
    if (typeof data === "symbol") {
      return { success: true, data };
    }

    return {
      success: false,
      error: new PithosError([
        {
          code: "invalid_type",
          expected: "symbol",
          received: typeof data,
          message: "Expected symbol",
          path: [],
        },
      ]),
    };
  }

  parseAsync(data: unknown): Promise<symbol> {
    return Promise.resolve(this.parse(data));
  }

  safeParseAsync(data: unknown): Promise<PithosSafeParseResult<symbol>> {
    return Promise.resolve(this.safeParse(data));
  }
}
