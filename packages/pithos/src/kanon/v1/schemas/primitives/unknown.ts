import type { PithosSafeParseResult } from "../../types/base";
import type { PithosType } from "../../types/base";

/**
 * Unknown schema implementation
 *
 * @since 1.1.0
 */
export class PithosUnknown implements PithosType<unknown> {
  _output!: unknown;
  _input!: unknown;

  parse(data: unknown): unknown {
    return data;
  }

  safeParse(data: unknown): PithosSafeParseResult<unknown> {
    return { success: true, data };
  }

  parseAsync(data: unknown): Promise<unknown> {
    return Promise.resolve(data);
  }

  safeParseAsync(data: unknown): Promise<PithosSafeParseResult<unknown>> {
    return Promise.resolve({ success: true, data });
  }
}
