import type { PithosSafeParseResult, PithosType } from "../../types/base";
import { PithosError } from "../../errors";

/**
 * Schema for validating tuples (arrays with fixed types)
 *
 * @since 1.1.0
 */
export class PithosTuple<T extends readonly PithosType[]>
  implements PithosType<any>
{
  _output!: any;
  _input!: any;

  constructor(
    private readonly schemas: T,
    private readonly restSchema?: PithosType
  ) {}

  parse(data: unknown): any {
    const result = this.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  safeParse(data: unknown): PithosSafeParseResult<any> {
    if (!Array.isArray(data)) {
      return {
        success: false,
        error: new PithosError([
          {
            code: "invalid_type",
            expected: "array",
            received: typeof data,
            message: "Expected array",
            path: [],
          },
        ]),
      };
    }

    const issues: any[] = [];
    const result: any[] = [];

    for (let i = 0; i < this.schemas.length; i++) {
      const schema = this.schemas[i];
      const item = data[i];

      if (item === undefined) {
        const schemaAny = schema as any;
        if (schemaAny._def?.typeName === "PithosOptional") {
          continue;
        }
        issues.push({
          code: "invalid_type",
          expected: "defined",
          received: "undefined",
          message: "Required",
          path: [i],
        });
        continue;
      }

      const itemResult = schema.safeParse(item);
      if (!itemResult.success) {
        issues.push(
          ...itemResult.error.issues.map((issue) => ({
            ...issue,
            path: [i, ...issue.path],
          }))
        );
      } else {
        result[i] = itemResult.data;
      }
    }

    if (this.restSchema) {
      for (let i = this.schemas.length; i < data.length; i++) {
        const item = data[i];
        const itemResult = this.restSchema.safeParse(item);
        if (!itemResult.success) {
          issues.push(
            ...itemResult.error.issues.map((issue) => ({
              ...issue,
              path: [i, ...issue.path],
            }))
          );
        } else {
          result[i] = itemResult.data;
        }
      }
    } else if (data.length > this.schemas.length) {
      issues.push({
        code: "too_big",
        maximum: this.schemas.length,
        type: "array",
        inclusive: true,
        message: `Expected at most ${this.schemas.length} items`,
        path: [],
      });
    }

    if (issues.length) {
      return {
        success: false,
        error: new PithosError(issues),
      };
    }

    return { success: true, data: result };
  }

  parseAsync(data: unknown): Promise<any> {
    return Promise.resolve(this.parse(data));
  }

  safeParseAsync(data: unknown): Promise<PithosSafeParseResult<any>> {
    return Promise.resolve(this.safeParse(data));
  }
}
