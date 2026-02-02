/**
 * Literal schema implementation
 *
 * @since 1.1.0
 */

import type { PithosType, PithosSafeParseResult } from "@kanon/v1/types/base";
import { PithosError } from "@kanon/v1/errors";
import { PithosUnion } from "../composites/union";
import { PithosOptional } from "./wrappers/optional";
import { PithosNullable } from "./wrappers/nullable";
import { PithosDefault } from "./wrappers/default";
import { PithosRefined } from "./wrappers/refined";

/**
 * Literal schema implementation
 *
 * @since 1.1.0
 */
export class PithosLiteral<T extends string | number | boolean | null>
  implements PithosType<T, T>
{
  _output!: T;
  _input!: T;

  constructor(private readonly value: T) {}

  parse(data: unknown): T {
    const result = this.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  safeParse(data: unknown): PithosSafeParseResult<T> {
    if (data !== this.value) {
      return {
        success: false,
        error: new PithosError([
          {
            code: "invalid_literal_value",
            message: `Expected literal value ${JSON.stringify(this.value)}`,
            path: [],
          },
        ]),
      };
    }
    return { success: true, data: this.value };
  }

  async parseAsync(data: unknown): Promise<T> {
    const result = await this.safeParseAsync(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  async safeParseAsync(data: unknown): Promise<PithosSafeParseResult<T>> {
    return this.safeParse(data);
  }

  or<U extends PithosType>(other: U): any {
    return new PithosUnion([this, other]);
  }

  optional(): this {
    return new PithosOptional(this) as any;
  }

  nullable(): this {
    return new PithosNullable(this) as any;
  }

  default(defaultValue: unknown | (() => unknown)): this {
    return new PithosDefault(this, defaultValue) as any;
  }

  refine(
    check: (data: T) => boolean | Promise<boolean>,
    options?: { message?: string } | string
  ): this {
    const message = typeof options === "string" ? options : options?.message;
    return new PithosRefined(this, check, message) as any;
  }
}
