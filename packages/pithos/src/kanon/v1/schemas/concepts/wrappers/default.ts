/**
 * Default schema wrapper
 *
 * @since 1.1.0
 */

import type { PithosType, PithosSafeParseResult } from "../../../types/base";

/**
 * Default schema wrapper
 *
 * @since 1.1.0
 */
export class PithosDefault<T extends PithosType>
  implements PithosType<T["_output"], T["_input"] | undefined>
{
  _output!: T["_output"];
  _input!: T["_input"] | undefined;

  constructor(
    private readonly schema: T,
    private readonly defaultValue: unknown | (() => unknown)
  ) {}

  parse(data: unknown): T["_output"] {
    const result = this.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  safeParse(data: unknown): PithosSafeParseResult<T["_output"]> {
    if (data === undefined) {
      const defaultVal =
        typeof this.defaultValue === "function"
          ? (this.defaultValue as () => unknown)()
          : this.defaultValue;
      return this.schema.safeParse(defaultVal);
    }
    return this.schema.safeParse(data);
  }

  async parseAsync(data: unknown): Promise<T["_output"]> {
    const result = await this.safeParseAsync(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  async safeParseAsync(
    data: unknown
  ): Promise<PithosSafeParseResult<T["_output"]>> {
    return this.safeParse(data);
  }
}
