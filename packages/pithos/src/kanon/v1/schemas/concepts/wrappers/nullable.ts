/**
 * Nullable schema wrapper
 *
 * @since 1.1.0
 */

import type { PithosType, PithosSafeParseResult } from "../../../types/base";

/**
 * Nullable schema wrapper
 *
 * @since 1.1.0
 */
export class PithosNullable<T extends PithosType>
  implements PithosType<T["_output"] | null, T["_input"] | null>
{
  _output!: T["_output"] | null;
  _input!: T["_input"] | null;

  constructor(private readonly schema: T) {}

  parse(data: unknown): T["_output"] | null {
    const result = this.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  safeParse(data: unknown): PithosSafeParseResult<T["_output"] | null> {
    if (data === null) {
      return { success: true, data: null };
    }
    return this.schema.safeParse(data);
  }

  async parseAsync(data: unknown): Promise<T["_output"] | null> {
    const result = await this.safeParseAsync(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  async safeParseAsync(
    data: unknown
  ): Promise<PithosSafeParseResult<T["_output"] | null>> {
    return this.safeParse(data);
  }
}
