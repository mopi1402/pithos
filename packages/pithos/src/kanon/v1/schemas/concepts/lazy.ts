/**
 * Lazy schema implementation for recursive types
 *
 * @since 1.1.0
 */

import type { PithosType, PithosSafeParseResult } from "@kanon/v1/types/base";
import { addCheckMethod } from "@kanon/v1/utils/add-check-method";

/**
 * Lazy schema implementation
 * Allows creating recursive types by deferring schema evaluation
 *
 * @since 1.1.0
 */
export class PithosLazy<T extends PithosType>
  implements PithosType<T["_output"], T["_input"]>
{
  _output!: T["_output"];
  _input!: T["_input"];

  private _schema: T | null = null;

  constructor(private readonly getter: () => T) {}

  private get schema(): T {
    if (!this._schema) {
      this._schema = this.getter();
    }
    return this._schema;
  }

  parse(data: unknown): T["_output"] {
    const result = this.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  safeParse(data: unknown): PithosSafeParseResult<T["_output"]> {
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
    return this.schema.safeParseAsync(data);
  }

  // Delegate check method to the inner schema
  check(...checks: ((data: T["_output"]) => any)[]): this {
    this.schema.check?.(...checks);
    return this;
  }
}

/**
 * Create a lazy schema that defers evaluation until needed
 *
 * @param getter - Function that returns the schema to evaluate
 * @returns Lazy schema with check method
 *
 * @since 1.1.0
 */
export const lazy = <T extends PithosType>(getter: () => T) => {
  return addCheckMethod(new PithosLazy(getter));
};
