import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { isCoerced, type ValidatorResult, type CoercedResult } from "./base";

describe("isCoerced", () => {
  describe("[🎯] Specification Tests", () => {
    describe("isCoerced boundary conditions", () => {
      it("[🎯] should return true when receiving { coerced: value } (Req 30.1)", () => {
        // Test with various coerced values
        const coercedString: CoercedResult<string> = { coerced: "hello" };
        const coercedNumber: CoercedResult<number> = { coerced: 42 };
        const coercedNull: CoercedResult<null> = { coerced: null };
        const coercedUndefined: CoercedResult<undefined> = { coerced: undefined };
        const coercedObject: CoercedResult<object> = { coerced: { key: "value" } };
        const coercedArray: CoercedResult<number[]> = { coerced: [1, 2, 3] };

        expect(isCoerced(coercedString)).toBe(true);
        expect(isCoerced(coercedNumber)).toBe(true);
        expect(isCoerced(coercedNull)).toBe(true);
        expect(isCoerced(coercedUndefined)).toBe(true);
        expect(isCoerced(coercedObject)).toBe(true);
        expect(isCoerced(coercedArray)).toBe(true);
      });

      it("[🎯] should return false when receiving true (success result) (Req 30.2)", () => {
        const successResult: ValidatorResult<string> = true;

        expect(isCoerced(successResult)).toBe(false);
      });

      it("[🎯] should return false when receiving a string (error result) (Req 30.3)", () => {
        const errorResult: ValidatorResult<string> = "Validation failed";
        const emptyErrorResult: ValidatorResult<string> = "";

        expect(isCoerced(errorResult)).toBe(false);
        expect(isCoerced(emptyErrorResult)).toBe(false);
      });

      it("[🎯] should return false when receiving null (Req 30.4)", () => {
        // null is not a valid ValidatorResult, but isCoerced should handle it gracefully
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nullResult = null as any;

        expect(isCoerced(nullResult)).toBe(false);
      });

      it("[🎯] should return false when receiving undefined (Req 30.5)", () => {
        // undefined is not a valid ValidatorResult, but isCoerced should handle it gracefully
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const undefinedResult = undefined as any;

        expect(isCoerced(undefinedResult)).toBe(false);
      });

      it("[🎯] should return false when receiving an object without coerced key (Req 30.6)", () => {
        // Objects that look similar but don't have the 'coerced' key
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const wrongObject1 = { value: "hello" } as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const wrongObject2 = { data: 42 } as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const emptyObject = {} as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const arrayObject = [1, 2, 3] as any;

        expect(isCoerced(wrongObject1)).toBe(false);
        expect(isCoerced(wrongObject2)).toBe(false);
        expect(isCoerced(emptyObject)).toBe(false);
        expect(isCoerced(arrayObject)).toBe(false);
      });
    });
  });

  describe("[🎲] Property-Based Tests", () => {
    itProp.prop([fc.anything()])("[🎲] should return true for any value wrapped in coerced object", (value) => {
      const coercedResult: CoercedResult<unknown> = { coerced: value };
      expect(isCoerced(coercedResult)).toBe(true);
    });

    itProp.prop([fc.string()])("[🎲] should return false for any string (error result)", (errorMessage) => {
      const errorResult: ValidatorResult<unknown> = errorMessage;
      expect(isCoerced(errorResult)).toBe(false);
    });

    itProp.prop([fc.dictionary(fc.string().filter(k => k !== "coerced"), fc.anything())])(
      "[🎲] should return false for objects without coerced key",
      (obj) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(isCoerced(obj as any)).toBe(false);
      }
    );

    itProp.prop([fc.oneof(fc.integer(), fc.boolean(), fc.array(fc.anything()))])(
      "[🎲] should return false for non-object primitives and arrays",
      (value) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(isCoerced(value as any)).toBe(false);
      }
    );
  });
});
