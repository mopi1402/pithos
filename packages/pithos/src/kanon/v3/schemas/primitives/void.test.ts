import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { void_ } from "./void";
import { parse } from "../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";

describe("void_", () => {
  describe("validation", () => {
    it("should accept undefined", () => {
      const schema = void_();

      expect(parse(schema, undefined).success).toBe(true);
    });

    it("should reject non-undefined primitive types", () => {
      const schema = void_();

      expect(parse(schema, "string").success).toBe(false);
      expect(parse(schema, 123).success).toBe(false);
      expect(parse(schema, 0).success).toBe(false);
      expect(parse(schema, true).success).toBe(false);
      expect(parse(schema, false).success).toBe(false);
      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, Symbol("test")).success).toBe(false);
      expect(parse(schema, BigInt(123)).success).toBe(false);
    });

    it("should reject complex types", () => {
      const schema = void_();

      expect(parse(schema, {}).success).toBe(false);
      expect(parse(schema, []).success).toBe(false);
      expect(parse(schema, [1, 2, 3]).success).toBe(false);
      expect(parse(schema, () => {}).success).toBe(false);
      expect(parse(schema, new Date()).success).toBe(false);
      expect(parse(schema, new Map()).success).toBe(false);
      expect(parse(schema, new Set()).success).toBe(false);
      expect(parse(schema, /regex/).success).toBe(false);
    });

    it("should reject edge case values", () => {
      const schema = void_();

      expect(parse(schema, Number.NaN).success).toBe(false);
      expect(parse(schema, Infinity).success).toBe(false);
      expect(parse(schema, -Infinity).success).toBe(false);
      expect(parse(schema, 0).success).toBe(false);
      expect(parse(schema, "").success).toBe(false);
    });

    it("should return correct error message for invalid values", () => {
      const schema = void_();

      const result1 = parse(schema, "string");
      expect(result1.success).toBe(false);
      if (!result1.success) {
        expect(result1.error).toBe(ERROR_MESSAGES_COMPOSITION.void);
      }

      const result2 = parse(schema, null);
      expect(result2.success).toBe(false);
      if (!result2.success) {
        expect(result2.error).toBe(ERROR_MESSAGES_COMPOSITION.void);
      }

      const result3 = parse(schema, 123);
      expect(result3.success).toBe(false);
      if (!result3.success) {
        expect(result3.error).toBe(ERROR_MESSAGES_COMPOSITION.void);
      }
    });

    it("should use custom error message when provided", () => {
      const customMessage = "Must be void";
      const schema = void_(customMessage);

      const result1 = parse(schema, "string");
      expect(result1.success).toBe(false);
      if (!result1.success) {
        expect(result1.error).toBe(customMessage);
      }

      const result2 = parse(schema, null);
      expect(result2.success).toBe(false);
      if (!result2.success) {
        expect(result2.error).toBe(customMessage);
      }

      const result3 = parse(schema, 123);
      expect(result3.success).toBe(false);
      if (!result3.success) {
        expect(result3.error).toBe(customMessage);
      }
    });

    it("should return correct data type when validation succeeds", () => {
      const schema = void_();

      const result = parse(schema, undefined);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(undefined);
      }
    });
  });

  describe("singleton behavior", () => {
    it("should return same instance when called without message", () => {
      const schema1 = void_();
      const schema2 = void_();

      expect(schema1).toBe(schema2);
    });

    it("should return different instances when called with message", () => {
      const schema1 = void_("Error 1");
      const schema2 = void_("Error 2");

      expect(schema1).not.toBe(schema2);
    });

    it("should return different instance when one has message and other doesn't", () => {
      const schema1 = void_();
      const schema2 = void_("Custom error");

      expect(schema1).not.toBe(schema2);
    });
  });

  describe("edge cases", () => {
    it("should only accept undefined (void type)", () => {
      const schema = void_();
      expect(parse(schema, undefined).success).toBe(true);
      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, 0).success).toBe(false);
      expect(parse(schema, "").success).toBe(false);
      expect(parse(schema, false).success).toBe(false);
    });
  });

  describe("[🎯] Specification Tests", () => {
    describe("void accepts undefined", () => {
      it("[🎯] should accept undefined (edge case: void accepts undefined) - Requirement 13.13", () => {
        const schema = void_();

        const result = parse(schema, undefined);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(undefined);
        }
      });
    });

    describe("void rejects null", () => {
      it("[🎯] should reject null (edge case: void rejects null) - Requirement 13.14", () => {
        const schema = void_();

        const result = parse(schema, null);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.void);
        }
      });

      it("[🎯] should distinguish between null and undefined", () => {
        const schema = void_();

        // undefined is accepted
        expect(parse(schema, undefined).success).toBe(true);

        // null is rejected
        expect(parse(schema, null).success).toBe(false);
      });
    });
  });
});


describe("[🎲] Property-Based Tests", () => {
  itProp.prop([fc.string()])(
    "[🎲] should reject any string",
    (value) => {
      const schema = void_();
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.integer()])(
    "[🎲] should reject any integer",
    (value) => {
      const schema = void_();
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.boolean()])(
    "[🎲] should reject any boolean",
    (value) => {
      const schema = void_();
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.dictionary(fc.string(), fc.anything())])(
    "[🎲] should reject any object",
    (value) => {
      const schema = void_();
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );
});
