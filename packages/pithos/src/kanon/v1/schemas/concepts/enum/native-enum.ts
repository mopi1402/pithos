/**
 * Schema pour valider les enums natifs
 *
 * @since 1.1.0
 */

import type { PithosType, PithosSafeParseResult } from "../../../types/base";
import { PithosError } from "../../../errors";

/**
 * Schema pour valider les enums natifs
 *
 * @since 1.1.0
 */
export class PithosNativeEnum<T> implements PithosType<T> {
  _output!: T;
  _input!: T;

  constructor(private readonly enumObj: T) {}

  parse(data: unknown): T {
    const result = this.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  safeParse(data: unknown): PithosSafeParseResult<T> {
    // Vérifier si la valeur est dans l'enum
    const enumValues = Object.values(this.enumObj as Record<string, unknown>);
    if (!enumValues.includes(data)) {
      return {
        success: false,
        error: new PithosError([
          {
            code: "invalid_enum_value",
            options: enumValues,
            received: data,
            message: `Expected one of: ${enumValues.join(", ")}`,
            path: [],
          },
        ]),
      };
    }

    return { success: true, data: data as T };
  }

  parseAsync(data: unknown): Promise<T> {
    return Promise.resolve(this.parse(data));
  }

  safeParseAsync(data: unknown): Promise<PithosSafeParseResult<T>> {
    return Promise.resolve(this.safeParse(data));
  }
}
