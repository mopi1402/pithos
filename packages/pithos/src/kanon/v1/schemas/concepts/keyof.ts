/**
 * Keyof schema implementation
 *
 * @since 1.1.0
 */

import type { PithosType, PithosSafeParseResult } from "@kanon/v1/types/base";
import { PithosError } from "@kanon/v1/errors";
import { PithosOptional } from "@kanon/v1/schemas/concepts/wrappers/optional";
import { PithosNullable } from "@kanon/v1/schemas/concepts/wrappers/nullable";
import { PithosDefault } from "@kanon/v1/schemas/concepts/wrappers/default";
import { PithosRefined } from "@kanon/v1/schemas/concepts/wrappers/refined";

/**
 * Keyof schema implementation
 *
 * @since 1.1.0
 */
export class PithosKeyof<T extends PithosType>
  implements PithosType<keyof any, string>
{
  _output!: keyof any;
  _input!: string;

  constructor(private readonly schema: T) {}

  parse(data: unknown): keyof any {
    const result = this.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  safeParse(data: unknown): PithosSafeParseResult<keyof any> {
    if (typeof data !== "string") {
      return {
        success: false,
        error: new PithosError([
          {
            code: "invalid_type",
            message: "Expected string",
            path: [],
          },
        ]),
      };
    }

    // Extraire les clés du schéma d'objet
    if ("shape" in this.schema) {
      const shape = (this.schema as any).shape;
      const validKeys = Object.keys(shape);

      if (!validKeys.includes(data)) {
        return {
          success: false,
          error: new PithosError([
            {
              code: "invalid_enum_value",
              message: `Invalid enum value. Expected ${validKeys.join(" | ")}`,
              path: [],
            },
          ]),
        };
      }
    }

    return { success: true, data: data as keyof any };
  }

  async parseAsync(data: unknown): Promise<keyof any> {
    const result = await this.safeParseAsync(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  async safeParseAsync(
    data: unknown
  ): Promise<PithosSafeParseResult<keyof any>> {
    return this.safeParse(data);
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
    check: (data: keyof any) => boolean | Promise<boolean>,
    options?: { message?: string } | string
  ): this {
    const message = typeof options === "string" ? options : options?.message;
    return new PithosRefined(this, check, message) as any;
  }
}
