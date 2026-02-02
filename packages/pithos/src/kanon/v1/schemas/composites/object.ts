/**
 * Object schema implementation
 *
 * @since 1.1.0
 */

import type {
  PithosType,
  PithosSafeParseResult,
  PithosIssue,
} from "../../types/base";
import { PithosError } from "../../errors";
import { PithosOptional } from "../concepts/wrappers/optional";
import { PithosNullable } from "../concepts/wrappers/nullable";
import { PithosDefault } from "../concepts/wrappers/default";
import { PithosRefined } from "../concepts/wrappers/refined";

/**
 * Object schema implementation
 *
 * @since 1.1.0
 */
export class PithosObject<T extends Record<string, PithosType>>
  implements
    PithosType<
      { [K in keyof T]: T[K]["_output"] },
      { [K in keyof T]: T[K]["_input"] }
    >
{
  _output!: { [K in keyof T]: T[K]["_output"] };
  _input!: { [K in keyof T]: T[K]["_input"] };

  // Add a type property for better inference
  readonly __type = "object" as const;

  constructor(private readonly shape: T, private readonly strict: boolean = false) {}

  parse(data: unknown): { [K in keyof T]: T[K]["_output"] } {
    const result = this.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  safeParse(
    data: unknown
  ): PithosSafeParseResult<{ [K in keyof T]: T[K]["_output"] }> {
    if (typeof data !== "object" || data === null) {
      return {
        success: false,
        error: new PithosError([
          {
            code: "invalid_type",
            message: "Expected object",
            path: [],
          },
        ]),
      };
    }

    const validatedData: Record<string, unknown> = {};
    const issues: PithosIssue[] = [];

    for (const [key, schema] of Object.entries(this.shape)) {
      const value = (data as Record<string, unknown>)[key];

      // Vérifier si la propriété est optionnelle
      if (value === undefined) {
        // Vérifier si le schéma est optionnel
        const isOptional = schema instanceof PithosOptional;

        if (isOptional) {
          // Propriété optionnelle manquante, on l'ignore
          continue;
        } else {
          // Propriété requise manquante
          issues.push({
            code: "invalid_type",
            message: "Required",
            path: [key],
          });
          continue;
        }
      }

      const result = schema.safeParse(value);

      if (result.success) {
        validatedData[key] = result.data;
      } else {
        issues.push(
          ...result.error.issues.map((issue) => ({
            ...issue,
            path: [key, ...issue.path],
          }))
        );
      }
    }

    if (issues.length) {
      return {
        success: false,
        error: new PithosError(issues),
      };
    }

    if (this.strict) {
      const extraKeys = Object.keys(data as Record<string, unknown>).filter(
        (key) => !(key in this.shape)
      );
      if (extraKeys.length) {
        return {
          success: false,
          error: new PithosError([
            {
              code: "unrecognized_keys",
              message: `Unrecognized keys: ${extraKeys.join(", ")}`,
              path: [],
            },
          ]),
        };
      }
    }

    return {
      success: true,
      data: validatedData as { [K in keyof T]: T[K]["_output"] },
    };
  }

  async parseAsync(
    data: unknown
  ): Promise<{ [K in keyof T]: T[K]["_output"] }> {
    const result = await this.safeParseAsync(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  async safeParseAsync(
    data: unknown
  ): Promise<PithosSafeParseResult<{ [K in keyof T]: T[K]["_output"] }>> {
    return this.safeParse(data);
  }

  optional(): this {
    const optionalSchema = new PithosOptional(this) as any;
    optionalSchema.optional = true;
    return optionalSchema;
  }

  nullable(): this {
    return new PithosNullable(this) as any;
  }

  default(defaultValue: unknown | (() => unknown)): this {
    return new PithosDefault(this, defaultValue) as any;
  }

  refine(
    check: (data: { [K in keyof T]: T[K]["_output"] }) =>
      | boolean
      | Promise<boolean>,
    options?: { message?: string } | string
  ): this {
    const message = typeof options === "string" ? options : options?.message;
    return new PithosRefined(this, check, message) as any;
  }
}
