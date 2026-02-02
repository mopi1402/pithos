import type { PithosSafeParseResult } from "../../types/base";
import { PithosError } from "../../errors";
import type { PithosType } from "../../types/base";

/**
 * Schema for validating records (objects with typed keys/values)
 *
 * @since 1.1.0
 */
export class PithosRecord<TKey extends PithosType, TValue extends PithosType>
  implements PithosType<Record<any, any>>
{
  _output!: Record<any, any>;
  _input!: Record<any, any>;

  constructor(
    private readonly keySchema: TKey,
    private readonly valueSchema: TValue
  ) {}

  parse(data: unknown): Record<any, any> {
    const result = this.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  safeParse(data: unknown): PithosSafeParseResult<Record<any, any>> {
    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      return {
        success: false,
        error: new PithosError([
          {
            code: "invalid_type",
            expected: "object",
            received: typeof data,
            message: "Expected object",
            path: [],
          },
        ]),
      };
    }

    const issues: any[] = [];
    const result: Record<string | symbol, any> = {};

    for (const [key, value] of Object.entries(data)) {
      const keyResult = this.keySchema.safeParse(key);
      if (!keyResult.success) {
        issues.push(
          ...keyResult.error.issues.map((issue) => ({
            ...issue,
            path: [key, ...issue.path],
          }))
        );
        continue;
      }

      const valueResult = this.valueSchema.safeParse(value);
      if (!valueResult.success) {
        issues.push(
          ...valueResult.error.issues.map((issue) => ({
            ...issue,
            path: [key, ...issue.path],
          }))
        );
      } else {
        result[key] = valueResult.data;
      }
    }

    const symbolKeys = Object.getOwnPropertySymbols(data);
    for (const symbolKey of symbolKeys) {
      const value = (data as any)[symbolKey];

      const keyResult = this.keySchema.safeParse(symbolKey);
      if (!keyResult.success) {
        issues.push(
          ...keyResult.error.issues.map((issue) => ({
            ...issue,
            path: [symbolKey, ...issue.path],
          }))
        );
        continue;
      }

      const valueResult = this.valueSchema.safeParse(value);
      if (!valueResult.success) {
        issues.push(
          ...valueResult.error.issues.map((issue) => ({
            ...issue,
            path: [symbolKey, ...issue.path],
          }))
        );
      } else {
        result[symbolKey] = valueResult.data;
      }
    }

    const keySchemaAny = this.keySchema as any;
    if (
      keySchemaAny._def?.typeName === "PithosEnum" &&
      Array.isArray(keySchemaAny._def.values)
    ) {
      const requiredKeys = keySchemaAny._def.values;
      for (const requiredKey of requiredKeys) {
        if (!(requiredKey in data)) {
          issues.push({
            code: "missing_keys",
            keys: [requiredKey],
            message: `Missing required key: ${requiredKey}`,
            path: [],
          });
        }
      }
    }

    if (issues.length) {
      return {
        success: false,
        error: new PithosError(issues),
      };
    }

    return { success: true, data: result };
  }

  parseAsync(data: unknown): Promise<Record<any, any>> {
    return Promise.resolve(this.parse(data));
  }

  safeParseAsync(
    data: unknown
  ): Promise<PithosSafeParseResult<Record<any, any>>> {
    return Promise.resolve(this.safeParse(data));
  }
}
