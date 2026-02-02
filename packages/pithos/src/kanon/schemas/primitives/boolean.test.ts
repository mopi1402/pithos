import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { boolean } from "./boolean";
import { parse } from "../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";

describe("boolean", () => {
  describe("validation", () => {
    it("should accept valid boolean values", () => {
      const schema = boolean();

      expect(parse(schema, true).success).toBe(true);
      expect(parse(schema, false).success).toBe(true);
    });

    it("should reject non-boolean primitive types", () => {
      const schema = boolean();

      expect(parse(schema, 0).success).toBe(false);
      expect(parse(schema, 1).success).toBe(false);
      expect(parse(schema, -1).success).toBe(false);
      expect(parse(schema, 3.14).success).toBe(false);
      expect(parse(schema, Number.NaN).success).toBe(false);
      expect(parse(schema, Infinity).success).toBe(false);
      expect(parse(schema, -Infinity).success).toBe(false);
      expect(parse(schema, "true").success).toBe(false);
      expect(parse(schema, "false").success).toBe(false);
      expect(parse(schema, "1").success).toBe(false);
      expect(parse(schema, "0").success).toBe(false);
      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, undefined).success).toBe(false);
    });

    it("should reject complex types", () => {
      const schema = boolean();

      expect(parse(schema, {}).success).toBe(false);
      expect(parse(schema, []).success).toBe(false);
      expect(parse(schema, [1, 2, 3]).success).toBe(false);
      expect(parse(schema, () => {}).success).toBe(false);
      expect(parse(schema, Symbol("test")).success).toBe(false);
      expect(parse(schema, new Date()).success).toBe(false);
      expect(parse(schema, new Map()).success).toBe(false);
      expect(parse(schema, new Set()).success).toBe(false);
      expect(parse(schema, /regex/).success).toBe(false);
      expect(parse(schema, BigInt(123)).success).toBe(false);
    });

    it("should return correct error message for invalid values", () => {
      const schema = boolean();

      const result1 = parse(schema, 1);
      expect(result1.success).toBe(false);
      if (!result1.success) {
        expect(result1.error).toBe(ERROR_MESSAGES_COMPOSITION.boolean);
      }

      const result2 = parse(schema, "true");
      expect(result2.success).toBe(false);
      if (!result2.success) {
        expect(result2.error).toBe(ERROR_MESSAGES_COMPOSITION.boolean);
      }

      const result3 = parse(schema, null);
      expect(result3.success).toBe(false);
      if (!result3.success) {
        expect(result3.error).toBe(ERROR_MESSAGES_COMPOSITION.boolean);
      }
    });

    it("should use custom error message when provided", () => {
      const customMessage = "Must be a boolean";
      const schema = boolean(customMessage);

      const result1 = parse(schema, 1);
      expect(result1.success).toBe(false);
      if (!result1.success) {
        expect(result1.error).toBe(customMessage);
      }

      const result2 = parse(schema, "true");
      expect(result2.success).toBe(false);
      if (!result2.success) {
        expect(result2.error).toBe(customMessage);
      }

      const result3 = parse(schema, null);
      expect(result3.success).toBe(false);
      if (!result3.success) {
        expect(result3.error).toBe(customMessage);
      }
    });

    it("should return correct data type when validation succeeds", () => {
      const schema = boolean();

      const result1 = parse(schema, true);
      expect(result1.success).toBe(true);
      if (result1.success) {
        expect(typeof result1.data).toBe("boolean");
        expect(result1.data).toBe(true);
      }

      const result2 = parse(schema, false);
      expect(result2.success).toBe(true);
      if (result2.success) {
        expect(typeof result2.data).toBe("boolean");
        expect(result2.data).toBe(false);
      }
    });
  });

  describe("singleton behavior", () => {
    it("should return same instance when called without message", () => {
      const schema1 = boolean();
      const schema2 = boolean();

      expect(schema1).toBe(schema2);
    });

    it("should return different instances when called with message", () => {
      const schema1 = boolean("Error 1");
      const schema2 = boolean("Error 2");

      expect(schema1).not.toBe(schema2);
    });

    it("should return different instance when one has message and other doesn't", () => {
      const schema1 = boolean();
      const schema2 = boolean("Custom error");

      expect(schema1).not.toBe(schema2);
    });
  });

  describe("edge cases", () => {
    it("should handle true", () => {
      const schema = boolean();
      expect(parse(schema, true).success).toBe(true);
    });

    it("should handle false", () => {
      const schema = boolean();
      expect(parse(schema, false).success).toBe(true);
    });

    it("should reject truthy values that are not boolean", () => {
      const schema = boolean();
      expect(parse(schema, 1).success).toBe(false);
      expect(parse(schema, "true").success).toBe(false);
      expect(parse(schema, {}).success).toBe(false);
      expect(parse(schema, []).success).toBe(false);
    });

    it("should reject falsy values that are not boolean", () => {
      const schema = boolean();
      expect(parse(schema, 0).success).toBe(false);
      expect(parse(schema, "").success).toBe(false);
      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, undefined).success).toBe(false);
    });

    it("should handle boolean objects (boxed booleans)", () => {
      const schema = boolean();
      // INTENTIONAL: Testing that boxed booleans (typeof === "object") are rejected
      const boxedBoolean = new Boolean(true);
      expect(parse(schema, boxedBoolean).success).toBe(false);
    });
  });

  describe("[🎯] Specification Tests", () => {
    describe("boxed primitives", () => {
      it("[🎯] should reject boxed Boolean object with true (edge case: boxed primitives)", () => {
        // Requirements: 13.6
        const schema = boolean();
        const boxedBoolean = new Boolean(true);
        expect(parse(schema, boxedBoolean).success).toBe(false);
      });

      it("[🎯] should reject boxed Boolean object with false (edge case: boxed primitives)", () => {
        // Requirements: 13.6
        const schema = boolean();
        const boxedBoolean = new Boolean(false);
        expect(parse(schema, boxedBoolean).success).toBe(false);
      });
    });
  });
});


describe("[🎲] Property-Based Tests", () => {
  itProp.prop([fc.boolean()])(
    "[🎲] should accept any boolean",
    (value) => {
      const schema = boolean();
      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(value);
      }
    }
  );

  itProp.prop([fc.string()])(
    "[🎲] should reject any string",
    (value) => {
      const schema = boolean();
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.integer()])(
    "[🎲] should reject any integer",
    (value) => {
      const schema = boolean();
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.dictionary(fc.string(), fc.anything())])(
    "[🎲] should reject any object",
    (value) => {
      const schema = boolean();
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );
});
