/**
 * Optional schema wrapper
 *
 * @since 1.1.0
 */

import type { PithosType, PithosSafeParseResult } from "../../../types/base";

/**
 * Optional schema wrapper
 *
 * @since 1.1.0
 */
export class PithosOptional<T extends PithosType>
  implements PithosType<T["_output"] | undefined, T["_input"] | undefined>
{
  _output!: T["_output"] | undefined;
  _input!: T["_input"] | undefined;

  constructor(private readonly schema: T) {}

  parse(data: unknown): T["_output"] | undefined {
    const result = this.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  safeParse(data: unknown): PithosSafeParseResult<T["_output"] | undefined> {
    if (data === undefined) {
      return { success: true, data: undefined };
    }
    return this.schema.safeParse(data);
  }

  async parseAsync(data: unknown): Promise<T["_output"] | undefined> {
    const result = await this.safeParseAsync(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  async safeParseAsync(
    data: unknown
  ): Promise<PithosSafeParseResult<T["_output"] | undefined>> {
    return this.safeParse(data);
  }
}
